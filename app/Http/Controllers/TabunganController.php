<?php

namespace App\Http\Controllers;

use App\Models\Tabungan;
use App\Models\MutasiTabungan;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Services\AktivitasService;

class TabunganController extends Controller
{
    /**
     * Dashboard tabungan — daftar semua siswa + saldo.
     */
    public function index(Request $request)
    {
        $tabungans = Tabungan::with(['siswa.kelas'])
            ->join('siswas', 'tabungans.siswa_id', '=', 'siswas.id')
            ->select('tabungans.*')
            ->when($request->get('search'), function ($q, $search) {
                $q->whereHas('siswa', fn($sq) =>
                    $sq->where('nama_lengkap', 'like', "%{$search}%")
                       ->orWhere('nisn', 'like', "%{$search}%")
                );
            })
            ->orderBy('siswas.nama_lengkap')
            ->paginate(15)
            ->withQueryString();

        // Stats
        $totalSaldo = Tabungan::sum('saldo');
        $totalPenabung = Tabungan::where('saldo', '>', 0)->count();

        return Inertia::render('Tabungan/Index', [
            'tabungans' => $tabungans,
            'stats' => [
                'totalSaldo' => $totalSaldo,
                'totalPenabung' => $totalPenabung,
            ],
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Form setoran tabungan.
     */
    public function setor(Request $request)
    {
        // Riwayat setoran hari ini
        $setoranHariIni = MutasiTabungan::with(['tabungan.siswa.kelas'])
            ->where('jenis_mutasi', 'setor')
            ->whereDate('created_at', Carbon::today())
            ->latest('tanggal_mutasi')
            ->limit(20)
            ->get();

        $totalSetoranHariIni = $setoranHariIni->sum('nominal');
        $jumlahTransaksi = $setoranHariIni->count();

        return Inertia::render('Tabungan/Setor', [
            'setoranHariIni' => $setoranHariIni,
            'stats' => [
                'totalSetoranHariIni' => $totalSetoranHariIni,
                'jumlahTransaksi' => $jumlahTransaksi,
            ],
        ]);
    }

    /**
     * Proses setoran tabungan.
     *
     * Business Logic:
     * 1. Cari/buat tabungan siswa (auto-create jika belum ada)
     * 2. Tambahkan saldo
     * 3. Catat mutasi sebagai 'setor'
     */
    public function setorStore(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'nominal' => 'required|integer|min:1000',
            'tanggal_mutasi' => 'required|date',
        ]);

        DB::transaction(function () use ($validated) {
            // Auto-create tabungan jika belum ada
            $tabungan = Tabungan::firstOrCreate(
                ['siswa_id' => $validated['siswa_id']],
                ['saldo' => 0]
            );

            // Update saldo
            $saldoBaru = $tabungan->saldo + $validated['nominal'];
            $tabungan->update(['saldo' => $saldoBaru]);

            // Catat mutasi
            MutasiTabungan::create([
                'tabungan_id' => $tabungan->id,
                'jenis_mutasi' => 'setor',
                'nominal' => $validated['nominal'],
                'saldo_sebelum' => $tabungan->saldo - $validated['nominal'],
                'saldo_sesudah' => $saldoBaru,
                'tanggal_mutasi' => $validated['tanggal_mutasi'],
                'user_id' => auth()->id(),
            ]);
        });

        AktivitasService::catat('Setor Tabungan', 'App\Models\Tabungan', $validated['siswa_id'], null, [
            'nominal' => $validated['nominal'],
        ]);

        return redirect()->route('tabungan.setor')->with('success', 'Setoran berhasil dicatat.');
    }

    /**
     * Form penarikan tabungan.
     */
    public function tarik(Request $request)
    {
        $tarikHariIni = MutasiTabungan::with(['tabungan.siswa.kelas'])
            ->where('jenis_mutasi', 'tarik')
            ->whereDate('created_at', Carbon::today())
            ->latest('tanggal_mutasi')
            ->limit(20)
            ->get();

        $totalTarikHariIni = $tarikHariIni->sum('nominal');
        $jumlahTransaksi = $tarikHariIni->count();

        return Inertia::render('Tabungan/Tarik', [
            'tarikHariIni' => $tarikHariIni,
            'stats' => [
                'totalTarikHariIni' => $totalTarikHariIni,
                'jumlahTransaksi' => $jumlahTransaksi,
            ],
        ]);
    }

    /**
     * Proses penarikan tabungan.
     *
     * Business Logic:
     * 1. Validasi saldo cukup
     * 2. Kurangi saldo
     * 3. Catat mutasi sebagai 'tarik'
     */
    public function tarikStore(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'nominal' => 'required|integer|min:1000',
            'tanggal_mutasi' => 'required|date',
        ]);

        $tabungan = Tabungan::where('siswa_id', $validated['siswa_id'])->first();

        if (!$tabungan || $tabungan->saldo < $validated['nominal']) {
            return redirect()->back()->with('error', 'Saldo tabungan tidak mencukupi.');
        }

        DB::transaction(function () use ($validated, $tabungan) {
            $saldoBaru = $tabungan->saldo - $validated['nominal'];
            $tabungan->update(['saldo' => $saldoBaru]);

            MutasiTabungan::create([
                'tabungan_id' => $tabungan->id,
                'jenis_mutasi' => 'tarik',
                'nominal' => $validated['nominal'],
                'saldo_sebelum' => $tabungan->saldo + $validated['nominal'],
                'saldo_sesudah' => $saldoBaru,
                'tanggal_mutasi' => $validated['tanggal_mutasi'],
                'user_id' => auth()->id(),
            ]);
        });

        AktivitasService::catat('Tarik Tabungan', 'App\Models\Tabungan', $validated['siswa_id'], null, [
            'nominal' => $validated['nominal'],
        ]);

        return redirect()->route('tabungan.tarik')->with('success', 'Penarikan berhasil dicatat.');
    }

    /**
     * Buku tabungan — riwayat mutasi per siswa.
     */
    public function bukuTabungan(Request $request)
    {
        $siswaId = $request->get('siswa_id') ?? $request->get('siswa');
        $tabungan = null;
        $mutasis = collect();
        $totalSetoran = 0;
        $totalPenarikan = 0;

        if ($siswaId) {
            $tabungan = Tabungan::with('siswa.kelas')->where('siswa_id', $siswaId)->first();

            if ($tabungan) {
                $mutasis = MutasiTabungan::with('user')
                    ->where('tabungan_id', $tabungan->id)
                    ->latest('tanggal_mutasi')
                    ->paginate(20)
                    ->withQueryString();

                // Hitung total setoran dan penarikan dari seluruh mutasi (bukan hanya yang di-paginate)
                $totalSetoran = MutasiTabungan::where('tabungan_id', $tabungan->id)
                    ->where('jenis_mutasi', 'setor')
                    ->sum('nominal');

                $totalPenarikan = MutasiTabungan::where('tabungan_id', $tabungan->id)
                    ->where('jenis_mutasi', 'tarik')
                    ->sum('nominal');
            }
        }

        return Inertia::render('Tabungan/BukuTabungan', [
            'tabungan' => $tabungan ? array_merge($tabungan->toArray(), [
                'total_setoran' => $totalSetoran,
                'total_penarikan' => $totalPenarikan,
            ]) : null,
            'mutasis' => $mutasis,
            'filters' => $request->only(['siswa_id']),
        ]);
    }

    /**
     * API: Cari siswa + saldo tabungan (untuk form setor/tarik).
     */
    public function cariSiswaTabungan(Request $request)
    {
        $search = $request->get('q', '');

        $siswas = Siswa::with(['kelas', 'tabungan'])
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
                'saldo' => $s->tabungan?->saldo ?? 0,
            ]);

        return response()->json($siswas);
    }
}
