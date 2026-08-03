<?php

namespace App\Http\Controllers;

use App\Models\Pembayaran;
use App\Models\DetailPembayaran;
use App\Models\Tagihan;
use App\Models\TransaksiKas;
use App\Models\KategoriKeuangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Services\AktivitasService;
use App\Models\User;
use App\Notifications\SistemNotification;

class PembayaranController extends Controller
{
    /**
     * Halaman Pembayaran & Verifikasi.
     */
    public function index(Request $request)
    {
        // Riwayat transaksi hari ini (default) atau sesuai filter
        $tanggal = $request->get('tanggal', Carbon::today()->toDateString());

        $pembayarans = Pembayaran::with(['siswa.kelas', 'detailPembayarans.tagihan.kategoriTagihan', 'user'])
            ->whereDate('tanggal_bayar', $tanggal)
            ->when($request->status && $request->status !== 'Semua', function ($q) use ($request) {
                if (strtolower($request->status) === 'menunggu') $q->where('status_pembayaran', 'menunggu');
                elseif (strtolower($request->status) === 'lunas') $q->where('status_pembayaran', 'lunas');
                elseif (strtolower($request->status) === 'ditolak') $q->where('status_pembayaran', 'ditolak');
            })
            ->when($request->search, function ($q) use ($request) {
                $q->where(function ($sub) use ($request) {
                    $sub->where('no_referensi', 'like', "%{$request->search}%")
                        ->orWhereHas('siswa', function ($qSiswa) use ($request) {
                            $qSiswa->where('nama_lengkap', 'like', "%{$request->search}%");
                        });
                });
            })
            ->latest('tanggal_bayar')
            ->paginate(20)
            ->withQueryString();

        // Hitung statistik hari ini
        $hariIni = Carbon::today();
        $totalHariIni = Pembayaran::whereDate('tanggal_bayar', $hariIni)
            ->where('status_pembayaran', 'lunas')
            ->sum('total_bayar');
        $lunasCount = Pembayaran::whereDate('tanggal_bayar', $hariIni)
            ->where('status_pembayaran', 'lunas')
            ->count();
        $menungguCount = Pembayaran::whereDate('tanggal_bayar', $hariIni)
            ->where('status_pembayaran', 'menunggu')
            ->count();

        return Inertia::render('Keuangan/Pembayaran/Index', [
            'pembayarans' => $pembayarans,
            'stats' => [
                'totalHariIni' => $totalHariIni,
                'lunasCount' => $lunasCount,
                'menungguCount' => $menungguCount,
            ],
            'filters' => $request->only(['tanggal', 'status', 'search']),
        ]);
    }

    /**
     * Proses pembayaran baru.
     *
     * Business Logic:
     * 1. Buat record pembayaran + detail per tagihan
     * 2. Jika tunai → langsung status 'lunas', update sisa tagihan, catat kas masuk
     * 3. Jika transfer/qris → status 'menunggu', sisa tagihan BELUM dikurangi
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'metode_pembayaran' => 'required|in:tunai,transfer,qris',
            'items' => 'required|array|min:1',
            'items.*.tagihan_id' => 'required|exists:tagihans,id',
            'items.*.nominal_bayar' => 'required|integer|min:1',
            'bukti_transfer' => 'nullable|image|max:5120', // 5MB max
        ]);

        $totalBayar = collect($validated['items'])->sum('nominal_bayar');
        $isTunai = $validated['metode_pembayaran'] === 'tunai';

        // Handle bukti transfer upload
        $buktiPath = null;
        if ($request->hasFile('bukti_transfer')) {
            $buktiPath = $request->file('bukti_transfer')->store('bukti-transfer', 'public');
        }

        $pembayaran = DB::transaction(function () use ($validated, $totalBayar, $isTunai, $buktiPath) {
            // 1. Buat Pembayaran
            $pembayaran = Pembayaran::create([
                'no_referensi' => 'PAY-' . strtoupper(Str::random(8)),
                'siswa_id' => $validated['siswa_id'],
                'user_id' => auth()->id(),
                'total_bayar' => $totalBayar,
                'metode_pembayaran' => $validated['metode_pembayaran'],
                'status_pembayaran' => $isTunai ? 'lunas' : 'menunggu',
                'tanggal_bayar' => now(),
                'bukti_transfer' => $buktiPath,
            ]);

            // 2. Buat Detail per tagihan
            foreach ($validated['items'] as $item) {
                DetailPembayaran::create([
                    'pembayaran_id' => $pembayaran->id,
                    'tagihan_id' => $item['tagihan_id'],
                    'nominal_bayar' => $item['nominal_bayar'],
                ]);

                // 3. Jika tunai → langsung update sisa tagihan
                if ($isTunai) {
                    $this->updateSisaTagihan($item['tagihan_id'], $item['nominal_bayar']);
                }
            }

            // 4. Jika tunai → catat ke transaksi kas otomatis
            if ($isTunai) {
                $this->catatKasMasuk($pembayaran);
            }

            return $pembayaran;
        });

        // Log aktivitas
        AktivitasService::catat('Pembayaran Baru', 'App\Models\Pembayaran', $pembayaran->id, null, [
            'no_referensi' => $pembayaran->no_referensi,
            'total_bayar' => $pembayaran->total_bayar,
            'metode' => $pembayaran->metode_pembayaran,
        ]);

        // Notifikasi ke admin
        $siswa = \App\Models\Siswa::find($pembayaran->siswa_id);
        $admins = User::whereIn('role', ['admin', 'bendahara'])->where('id', '!=', auth()->id())->get();
        foreach ($admins as $admin) {
            $admin->notify(new SistemNotification(
                'Pembayaran SPP Diterima',
                ($siswa->nama_lengkap ?? 'Siswa') . " membayar Rp " . number_format($pembayaran->total_bayar, 0, ',', '.') . " via {$pembayaran->metode_pembayaran}.",
                'pembayaran'
            ));
        }

        // Notifikasi ke orang tua siswa
        $orangTuas = User::where('role', 'orang_tua')
            ->whereHas('siswas', fn($q) => $q->where('siswas.id', $pembayaran->siswa_id))
            ->get();
        foreach ($orangTuas as $ortu) {
            $statusMsg = $isTunai ? 'telah lunas' : 'sedang menunggu verifikasi';
            $ortu->notify(new SistemNotification(
                'Pembayaran Anak Anda Tercatat',
                "Pembayaran sebesar Rp " . number_format($pembayaran->total_bayar, 0, ',', '.') . " untuk {$siswa->nama_lengkap} {$statusMsg}.",
                'pembayaran'
            ));
        }

        return redirect()->route('pembayaran.index')
        ->with('success', "Pembayaran {$pembayaran->no_referensi} berhasil dicatat.")
        ->with('cetak_id', $pembayaran->id);
    }

    /**
     * Verifikasi pembayaran non-tunai (Transfer/QRIS).
     * Dipanggil oleh Bendahara/Admin untuk menyetujui atau menolak.
     */
    public function verifikasi(Request $request, Pembayaran $pembayaran)
    {
        $validated = $request->validate([
            'aksi' => 'required|in:setuju,tolak',
        ]);

        if ($pembayaran->status_pembayaran !== 'menunggu') {
            return redirect()->back()->with('error', 'Pembayaran ini sudah diproses sebelumnya.');
        }

        DB::transaction(function () use ($pembayaran, $validated) {
            if ($validated['aksi'] === 'setuju') {
                $pembayaran->update(['status_pembayaran' => 'lunas']);

                // Update sisa tagihan untuk setiap detail
                foreach ($pembayaran->detailPembayarans as $detail) {
                    $this->updateSisaTagihan($detail->tagihan_id, $detail->nominal_bayar);
                }

                // Catat kas masuk
                $this->catatKasMasuk($pembayaran);
            } else {
                $pembayaran->update(['status_pembayaran' => 'ditolak']);
            }
        });

        $statusText = $validated['aksi'] === 'setuju' ? 'disetujui' : 'ditolak';

        // Log aktivitas
        AktivitasService::catat('Verifikasi Pembayaran', 'App\Models\Pembayaran', $pembayaran->id, null, [
            'no_referensi' => $pembayaran->no_referensi,
            'aksi' => $statusText,
        ]);

        // Notifikasi ke orang tua siswa tentang hasil verifikasi
        $siswa = \App\Models\Siswa::find($pembayaran->siswa_id);
        $orangTuas = User::where('role', 'orang_tua')
            ->whereHas('siswas', fn($q) => $q->where('siswas.id', $pembayaran->siswa_id))
            ->get();
        foreach ($orangTuas as $ortu) {
            $title = $validated['aksi'] === 'setuju' ? 'Pembayaran Disetujui ✅' : 'Pembayaran Ditolak ❌';
            $msg = "Pembayaran Rp " . number_format($pembayaran->total_bayar, 0, ',', '.') . " untuk {$siswa->nama_lengkap} telah {$statusText}.";
            $ortu->notify(new SistemNotification($title, $msg, 'pembayaran'));
        }

        return redirect()->back()->with('success', "Pembayaran {$pembayaran->no_referensi} berhasil {$statusText}.");
    }

    /**
     * Helper: Update sisa tagihan setelah pembayaran.
     */
    private function updateSisaTagihan(int $tagihanId, int $nominalBayar): void
    {
        $tagihan = Tagihan::findOrFail($tagihanId);
        $sisaBaru = max(0, $tagihan->sisa_tagihan - $nominalBayar);

        $tagihan->update([
            'sisa_tagihan' => $sisaBaru,
            'status' => $sisaBaru <= 0 ? 'lunas' : 'sebagian',
        ]);
    }

    /**
     * Helper: Catat pembayaran ke transaksi_kas sebagai kas masuk (polymorphic).
     */
    private function catatKasMasuk(Pembayaran $pembayaran): void
    {
        // Cari atau buat kategori keuangan "Pembayaran SPP"
        $kategori = KategoriKeuangan::firstOrCreate(
            ['nama_kategori' => 'Pembayaran SPP'],
            ['jenis' => 'Pemasukan']
        );

        TransaksiKas::create([
            'kategori_keuangan_id' => $kategori->id,
            'tipe_transaksi' => 'masuk',
            'nominal' => $pembayaran->total_bayar,
            'keterangan' => "Pembayaran {$pembayaran->no_referensi} oleh siswa ID {$pembayaran->siswa_id}",
            'tanggal_transaksi' => $pembayaran->tanggal_bayar,
            'referensi_type' => Pembayaran::class,
            'referensi_id' => $pembayaran->id,
        ]);
    }

    /**
     * Halaman daftar pembayaran yang menunggu verifikasi.
     */
    public function verifikasiIndex(Request $request)
    {
        $pembayarans = Pembayaran::with(['siswa.kelas', 'detailPembayarans.tagihan.kategoriTagihan', 'user'])
            ->where('status_pembayaran', 'menunggu')
            ->latest('tanggal_bayar')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Keuangan/Verifikasi/Index', [
            'pembayarans' => $pembayarans,
        ]);
    }

    /**
     * Helper: Terbilang untuk angka
     */
    private function terbilang($angka)
    {
        $angka = abs($angka);
        $baca = array("", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas");
        $terbilang = "";

        if ($angka < 12) {
            $terbilang = " " . $baca[$angka];
        } elseif ($angka < 20) {
            $terbilang = $this->terbilang($angka - 10) . " Belas";
        } elseif ($angka < 100) {
            $terbilang = $this->terbilang($angka / 10) . " Puluh" . $this->terbilang($angka % 10);
        } elseif ($angka < 200) {
            $terbilang = " Seratus" . $this->terbilang($angka - 100);
        } elseif ($angka < 1000) {
            $terbilang = $this->terbilang($angka / 100) . " Ratus" . $this->terbilang($angka % 100);
        } elseif ($angka < 2000) {
            $terbilang = " Seribu" . $this->terbilang($angka - 1000);
        } elseif ($angka < 1000000) {
            $terbilang = $this->terbilang($angka / 1000) . " Ribu" . $this->terbilang($angka % 1000);
        } elseif ($angka < 1000000000) {
            $terbilang = $this->terbilang($angka / 1000000) . " Juta" . $this->terbilang($angka % 1000000);
        } elseif ($angka < 1000000000000) {
            $terbilang = $this->terbilang($angka / 1000000000) . " Milyar" . $this->terbilang(fmod($angka, 1000000000));
        } elseif ($angka < 1000000000000000) {
            $terbilang = $this->terbilang($angka / 1000000000000) . " Trilyun" . $this->terbilang(fmod($angka, 1000000000000));
        }

        return trim($terbilang);
    }

    /**
     * Cetak kuitansi/bukti pembayaran.
     */
    public function cetak(Pembayaran $pembayaran)
    {
        $pembayaran->load(['siswa.kelas', 'detailPembayarans.tagihan.kategoriTagihan', 'user']);

        $profilSekolah = \App\Models\ProfilSekolah::first();

        // Siapkan terbilang manual
        $terbilangText = $this->terbilang($pembayaran->total_bayar) . " Rupiah";

        return Inertia::render('Keuangan/Kuitansi/Show', [
            'pembayaran' => $pembayaran,
            'profilSekolah' => $profilSekolah,
            'terbilang' => $terbilangText,
        ]);
    }
}
