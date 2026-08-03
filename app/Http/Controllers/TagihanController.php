<?php

namespace App\Http\Controllers;

use App\Models\Tagihan;
use App\Models\Siswa;
use App\Models\KategoriTagihan;
use App\Models\TahunAjaran;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Services\AktivitasService;
use App\Models\User;
use App\Notifications\SistemNotification;

class TagihanController extends Controller
{
    /**
     * Daftar semua batch tagihan (grouped by kategori + bulan).
     */
    public function index(Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::where('aktif', true)->first();

        // Statistik
        $totalExpected = Tagihan::when($tahunAjaranAktif, fn($q) => $q->where('tahun_ajaran_id', $tahunAjaranAktif->id))
            ->sum('nominal_tagihan');
        $totalTerkumpul = Tagihan::when($tahunAjaranAktif, fn($q) => $q->where('tahun_ajaran_id', $tahunAjaranAktif->id))
            ->sum(DB::raw('nominal_tagihan - sisa_tagihan'));
        $totalTunggakan = Tagihan::when($tahunAjaranAktif, fn($q) => $q->where('tahun_ajaran_id', $tahunAjaranAktif->id))
            ->where('status', '!=', 'lunas')
            ->sum('sisa_tagihan');

        $jumlahSiswa = Siswa::where('status', 'aktif')->count();

        // Group tagihan by kategori + bulan_tagihan + target_kelas for batch view
        $tagihans = Tagihan::with(['kategoriTagihan', 'tahunAjaran'])
            ->when($request->tahun_ajaran && $request->tahun_ajaran !== 'all', function ($q) use ($request) {
                $q->whereHas('tahunAjaran', fn($qta) => $qta->where('nama_tahun_ajaran', $request->tahun_ajaran));
            })
            ->when(!$request->tahun_ajaran && $tahunAjaranAktif, fn($q) => $q->where('tahun_ajaran_id', $tahunAjaranAktif->id))
            ->when($request->target_kelas && $request->target_kelas !== 'semua', function ($q) use ($request) {
                $q->where('target_kelas', $request->target_kelas);
            })
            ->when($request->kategori_tagihan_id && $request->kategori_tagihan_id !== 'semua', function ($q) use ($request) {
                $q->where('kategori_tagihan_id', $request->kategori_tagihan_id);
            })
            ->when($request->search, function ($q) use ($request) {
                $q->whereHas('kategoriTagihan', function ($qk) use ($request) {
                    $qk->where('kode_tagihan', 'like', "%{$request->search}%")
                       ->orWhere('nama_kategori', 'like', "%{$request->search}%");
                });
            })
            ->select(
                'kategori_tagihan_id',
                'bulan_tagihan',
                'target_kelas',
                'nominal_tagihan',
                'jatuh_tempo',
                DB::raw('COUNT(*) as total_siswa'),
                DB::raw('SUM(CASE WHEN status = "lunas" THEN 1 ELSE 0 END) as sudah_bayar'),
                DB::raw('SUM(CASE WHEN status != "lunas" THEN 1 ELSE 0 END) as belum_bayar')
            )
            ->groupBy('kategori_tagihan_id', 'bulan_tagihan', 'target_kelas', 'nominal_tagihan', 'jatuh_tempo')
            ->when($request->status, function ($q) use ($request) {
                if ($request->status === 'lunas') {
                    $q->having('belum_bayar', '=', 0);
                } elseif ($request->status === 'berjalan') {
                    $q->having('belum_bayar', '>', 0);
                }
            })
            ->latest('jatuh_tempo')
            ->paginate(10)
            ->withQueryString();

        // Load relasi untuk setiap item
        $tagihans->getCollection()->transform(function ($item) {
            $item->kategori_tagihan = KategoriTagihan::find($item->kategori_tagihan_id);
            if (strpos($item->jatuh_tempo, '2099') !== false) {
                $item->jatuh_tempo_format = 'Tidak Ada Batas';
            } else {
                $item->jatuh_tempo_format = Carbon::parse($item->jatuh_tempo)->translatedFormat('d M Y');
            }
            return $item;
        });

        $tahunAjarans = TahunAjaran::orderBy('aktif', 'desc')->orderBy('created_at', 'desc')->get();
        $kategoriTagihans = KategoriTagihan::orderBy('nama_kategori')->get();

        return Inertia::render('Keuangan/Tagihan/Index', [
            'tagihans' => $tagihans,
            'stats' => [
                'totalExpected' => $totalExpected,
                'totalTerkumpul' => $totalTerkumpul,
                'totalTunggakan' => $totalTunggakan,
                'jumlahSiswa' => $jumlahSiswa,
            ],
            'tahunAjarans' => $tahunAjarans,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'kategoriTagihans' => $kategoriTagihans,
            'filters' => $request->only(['tahun_ajaran', 'kategori_tagihan_id', 'target_kelas', 'status', 'search']),
        ]);
    }

    /**
     * Detail siswa dalam satu batch tagihan
     */
    public function batchDetail(Request $request)
    {
        $kategoriId = $request->kategori_tagihan_id;
        $bulanTagihan = $request->bulan_tagihan;
        $targetKelas = $request->target_kelas;

        $kategori = KategoriTagihan::findOrFail($kategoriId);

        $tagihans = Tagihan::with(['detailPembayarans' => function ($q) {
                $q->whereHas('pembayaran', function ($q2) {
                    $q2->where('status_pembayaran', 'lunas');
                });
            }, 'detailPembayarans.pembayaran'])
            ->where('kategori_tagihan_id', $kategoriId)
            ->when($bulanTagihan, fn($q) => $q->where('bulan_tagihan', $bulanTagihan), fn($q) => $q->whereNull('bulan_tagihan'))
            ->where('target_kelas', $targetKelas)
            ->join('siswas', 'tagihans.siswa_id', '=', 'siswas.id')
            ->select('tagihans.*')
            ->orderBy('siswas.nama_lengkap')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Keuangan/Tagihan/BatchDetail', [
            'tagihans' => $tagihans,
            'batchInfo' => [
                'kategori' => $kategori->nama_kategori,
                'bulan' => $bulanTagihan,
                'target_kelas' => $targetKelas,
            ]
        ]);
    }

    /**
     * Form untuk generate tagihan batch.
     */
    public function create()
    {
        $kategoriTagihans = KategoriTagihan::orderBy('nama_kategori')->get();
        $kelasList = Kelas::withCount(['siswas' => fn($q) => $q->where('status', 'aktif')])->orderBy('nama_kelas')->get();
        $tahunAjaranAktif = TahunAjaran::where('aktif', true)->first();
        $totalSiswaAktif = Siswa::where('status', 'aktif')->count();

        return Inertia::render('Keuangan/Tagihan/Create', [
            'kategoriTagihans' => $kategoriTagihans,
            'kelasList' => $kelasList,
            'tahunAjaranAktif' => $tahunAjaranAktif,
            'totalSiswaAktif' => $totalSiswaAktif,
        ]);
    }

    /**
     * Generate tagihan batch (massal).
     * Business Logic:
     *  - Terima kategori_tagihan_id, target kelas, opsi bulan
     *  - Generate tagihan ke semua siswa yang match
     *  - Cegah duplikasi (jika tagihan bulan+kategori+siswa sudah ada)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kategori_tagihan_id' => 'required|exists:kategori_tagihans,id',
            'target_kelas' => 'required|string', // 'semua', 'custom', '79' (SMP), '1012' (SMA)
            'custom_siswa_ids' => 'nullable|array',
            'custom_siswa_ids.*' => 'exists:siswas,id',
            'opsi_bulan' => 'required|string|in:satu_tahun,satu_bulan,sekali_bayar',
            'bulan_spesifik' => 'nullable|string',
            'tahun_ajaran_id' => 'required|exists:tahun_ajarans,id',
        ]);

        $kategori = KategoriTagihan::findOrFail($validated['kategori_tagihan_id']);
        $tahunAjaran = TahunAjaran::findOrFail($validated['tahun_ajaran_id']);

        // Tentukan daftar siswa target
        $siswaQuery = Siswa::where('status', 'aktif');

        if ($validated['target_kelas'] === 'custom' && !empty($validated['custom_siswa_ids'])) {
            $siswaQuery->whereIn('id', $validated['custom_siswa_ids']);
        } elseif ($validated['target_kelas'] === '79') {
            // SMP: Kelas 7, 8, 9
            $siswaQuery->whereHas('kelas', function ($q) {
                $q->where('nama_kelas', 'REGEXP', '(^|[[:space:]])(7|8|9|VII|VIII|IX)([[:space:]]|$)');
            });
        } elseif ($validated['target_kelas'] === '1012') {
            // SMA: Kelas 10, 11, 12
            $siswaQuery->whereHas('kelas', function ($q) {
                $q->where('nama_kelas', 'REGEXP', '(^|[[:space:]])(10|11|12|X|XI|XII)([[:space:]]|$)');
            });
        }
        // 'semua' = tidak ada filter tambahan

        $siswaIds = $siswaQuery->pluck('id');

        if ($siswaIds->isEmpty()) {
            return redirect()->back()->with('error', 'Tidak ada siswa aktif yang match dengan target tagihan.');
        }

        // Tentukan bulan-bulan yang akan digenerate
        $nominal = $kategori->nominal_default ?? 0;
        $bulanList = [];

        if ($validated['opsi_bulan'] === 'satu_tahun') {
            // Juli - Juni
            $bulanList = [
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            ];
        } elseif ($validated['opsi_bulan'] === 'satu_bulan') {
            $bulanList = [$validated['bulan_spesifik']];
        } else {
            // sekali_bayar — bulan null
            $bulanList = [null];
        }

        // Tahun dari nama tahun ajaran (e.g. "2025/2026")
        $tahunParts = explode('/', $tahunAjaran->nama_tahun_ajaran);
        $tahunAwal = $tahunParts[0] ?? date('Y');
        $tahunAkhir = $tahunParts[1] ?? ($tahunAwal + 1);

        $bulanKeUrutan = [
            'Juli' => 7, 'Agustus' => 8, 'September' => 9, 'Oktober' => 10,
            'November' => 11, 'Desember' => 12, 'Januari' => 1, 'Februari' => 2,
            'Maret' => 3, 'April' => 4, 'Mei' => 5, 'Juni' => 6,
        ];

        $created = 0;
        $skipped = 0;

        DB::transaction(function () use ($siswaIds, $bulanList, $kategori, $tahunAjaran, $nominal, $bulanKeUrutan, $tahunAwal, $tahunAkhir, $validated, &$created, &$skipped) {
            foreach ($siswaIds as $siswaId) {
                foreach ($bulanList as $bulan) {
                    $bulanTagihan = $bulan ? "{$bulan} " . ($bulanKeUrutan[$bulan] >= 7 ? $tahunAwal : $tahunAkhir) : null;

                    // Cek duplikasi
                    $exists = Tagihan::where('siswa_id', $siswaId)
                        ->where('kategori_tagihan_id', $kategori->id)
                        ->where('tahun_ajaran_id', $tahunAjaran->id)
                        ->where('bulan_tagihan', $bulanTagihan)
                        ->exists();

                    if ($exists) {
                        $skipped++;
                        continue;
                    }

                    // Hitung jatuh tempo
                    if ($bulan) {
                        $tanggalNum = $bulanKeUrutan[$bulan] ?? 1;
                        $tahunJT = $tanggalNum >= 7 ? $tahunAwal : $tahunAkhir;
                        $jatuhTempo = Carbon::create($tahunJT, $tanggalNum, 1)->endOfMonth()->format('Y-m-d');
                    } else {
                        // Sekali bayar, tidak ada batas
                        $jatuhTempo = '2099-12-31';
                    }

                    Tagihan::create([
                        'siswa_id' => $siswaId,
                        'kategori_tagihan_id' => $kategori->id,
                        'tahun_ajaran_id' => $tahunAjaran->id,
                        'bulan_tagihan' => $bulanTagihan,
                        'target_kelas' => collect([$validated['target_kelas']])->first(),
                        'nominal_tagihan' => $nominal,
                        'sisa_tagihan' => $nominal,
                        'status' => 'belum_lunas',
                        'jatuh_tempo' => $jatuhTempo,
                    ]);

                    $created++;
                }
            }
        });

        $message = "Berhasil generate {$created} tagihan.";
        if ($skipped > 0) {
            $message .= " ({$skipped} tagihan dilewati karena sudah ada.)";
        }

        // Log aktivitas
        AktivitasService::catat('Generate Tagihan Batch', 'App\Models\Tagihan', null, null, [
            'kategori' => $kategori->nama_kategori,
            'jumlah_dibuat' => $created,
            'jumlah_dilewati' => $skipped,
        ]);

        // Kirim notifikasi ke semua admin
        $admins = User::whereIn('role', ['admin', 'bendahara'])->get();
        foreach ($admins as $admin) {
            $admin->notify(new SistemNotification(
                'Tagihan Baru Dibuat',
                "Tagihan {$kategori->nama_kategori} berhasil digenerate untuk {$created} siswa.",
                'tagihan'
            ));
        }

        // Kirim notifikasi ke orang tua siswa yang terkena tagihan
        $orangTuas = User::where('role', 'orang_tua')
            ->whereHas('siswas', fn($q) => $q->whereIn('siswas.id', $siswaIds))
            ->get();
        foreach ($orangTuas as $ortu) {
            $namaAnak = $ortu->siswas()->whereIn('siswas.id', $siswaIds)->pluck('nama_lengkap')->join(', ');
            $ortu->notify(new SistemNotification(
                'Tagihan Baru untuk Anak Anda',
                "Tagihan {$kategori->nama_kategori} sebesar Rp " . number_format($nominal, 0, ',', '.') . " telah dibuat untuk {$namaAnak}.",
                'tagihan'
            ));
        }

        return redirect()->route('tagihan.index')->with('success', $message);
    }

    /**
     * Show detail tagihan per siswa.
     * Karena route resource tagihan menggunakan id, kita asumsikan id ini adalah siswa_id untuk view show.
     */
    public function show($id)
    {
        $siswa = Siswa::with('kelas')->findOrFail($id);

        $tagihans = Tagihan::with(['kategoriTagihan', 'tahunAjaran', 'detailPembayarans' => function ($q) {
                $q->whereHas('pembayaran', function ($q2) {
                    $q2->where('status_pembayaran', 'lunas');
                });
            }, 'detailPembayarans.pembayaran'])
            ->where('siswa_id', $id)
            ->latest('jatuh_tempo')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Keuangan/Tagihan/Show', [
            'siswa' => $siswa,
            'tagihans' => $tagihans
        ]);
    }

    /**
     * Tampilkan form edit tagihan tunggal.
     */
    public function edit(Tagihan $tagihan)
    {
        $tagihan->load(['siswa.kelas', 'kategoriTagihan', 'tahunAjaran']);

        return Inertia::render('Keuangan/Tagihan/Edit', [
            'tagihan' => $tagihan
        ]);
    }

    /**
     * Update tagihan tunggal.
     */
    public function update(Request $request, Tagihan $tagihan)
    {
        $validated = $request->validate([
            'nominal_tagihan' => 'required|numeric|min:0',
            'status' => 'required|in:belum_lunas,sebagian,lunas',
            'jatuh_tempo' => 'required|date'
        ]);

        $selisih = $validated['nominal_tagihan'] - $tagihan->nominal_tagihan;
        $sisaBaru = $tagihan->sisa_tagihan + $selisih;
        if ($sisaBaru < 0) $sisaBaru = 0;

        if ($sisaBaru <= 0 && $validated['nominal_tagihan'] > 0) {
            $validated['status'] = 'lunas';
            $sisaBaru = 0;
        } elseif ($sisaBaru > 0 && $sisaBaru < $validated['nominal_tagihan']) {
            $validated['status'] = 'sebagian';
        } else if ($sisaBaru >= $validated['nominal_tagihan']) {
            $validated['status'] = 'belum_lunas';
        }

        $tagihan->update([
            'nominal_tagihan' => $validated['nominal_tagihan'],
            'status' => $validated['status'],
            'jatuh_tempo' => $validated['jatuh_tempo'],
            'sisa_tagihan' => $sisaBaru
        ]);

        return redirect()->route('tagihan.show', $tagihan->siswa_id)->with('success', 'Tagihan berhasil diperbarui.');
    }

    /**
     * Hapus tagihan tunggal.
     */
    public function destroy(Tagihan $tagihan)
    {
        $siswaId = $tagihan->siswa_id;
        $tagihan->delete();

        return redirect()->route('tagihan.show', $siswaId)->with('success', 'Tagihan berhasil dihapus.');
    }

    /**
     * API: Cari siswa untuk Pembayaran (autocomplete).
     */
    public function cariSiswa(Request $request)
    {
        $search = $request->get('q', '');

        $siswas = Siswa::with('kelas')
            ->where('status', 'aktif')
            ->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%");
            })
            ->limit(10)
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'nisn' => $s->nisn,
                'nama' => $s->nama_lengkap,
                'kelas' => $s->kelas?->nama_kelas ?? '-',
            ]);

        return response()->json($siswas);
    }

    /**
     * API: Ambil tagihan belum lunas per siswa (untuk pembayaran).
     */
    public function tagihanSiswa($siswaId)
    {
        $tagihans = Tagihan::with('kategoriTagihan')
            ->where('siswa_id', $siswaId)
            ->where('status', '!=', 'lunas')
            ->orderBy('jatuh_tempo')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'kategori' => $t->kategoriTagihan?->nama_kategori ?? '-',
                'bulan' => $t->bulan_tagihan ?? '-',
                'nominal' => $t->nominal_tagihan,
                'jatuhTempo' => $t->jatuh_tempo->translatedFormat('d M Y'),
                'sisa' => $t->sisa_tagihan,
            ]);

        return response()->json($tagihans);
    }
}
