<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Services\AktivitasService;

class SiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Siswa::with('kelas');

        // Kepala sekolah hanya dapat melihat siswa sesuai instansinya
        $user = auth()->user();
        if ($user->role === 'kepala_sekolah' && $user->instansi) {
            $query->where('instansi', $user->instansi);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%");
        }

        $siswas = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('DataMaster/DataSiswa/Index', [
            'siswas' => $siswas,
            'filters' => $request->only('search')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $kelas = Kelas::orderBy('nama_kelas', 'asc')->get();
        return Inertia::render('DataMaster/DataSiswa/Create', [
            'kelas' => $kelas
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nisn' => 'required|string|unique:siswas,nisn',
            'nama_lengkap' => 'required|string|max:255',
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'required|in:L,P',
            'agama' => 'nullable|string|max:50',
            'alamat' => 'nullable|string',
            'kelas_id' => 'required|exists:kelas,id',
            'instansi' => 'required|in:SMP,SMA',
            'nama_ayah' => 'nullable|string|max:255',
            'nama_ibu' => 'nullable|string|max:255',
            'telepon_ortu' => 'nullable|string|max:20',
            'pekerjaan_ortu' => 'nullable|string|max:255',
            'status' => 'nullable|in:aktif,nonaktif,lulus,pindah',
            'foto' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('siswa-foto', 'public');
        }

        $siswa = Siswa::create($validated);

        AktivitasService::catat('Tambah Siswa', 'App\Models\Siswa', $siswa->id, null, $siswa->toArray());

        return redirect()->route('siswa.index')->with('success', 'Data siswa berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Siswa $siswa)
    {
        $siswa->load('kelas');
        return Inertia::render('DataMaster/DataSiswa/Show', [
            'siswa' => $siswa
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Siswa $siswa)
    {
        $kelas = Kelas::orderBy('nama_kelas', 'asc')->get();
        return Inertia::render('DataMaster/DataSiswa/Edit', [
            'siswa' => $siswa,
            'kelas' => $kelas
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Siswa $siswa)
    {
        $validated = $request->validate([
            'nisn' => 'required|string|unique:siswas,nisn,' . $siswa->id,
            'nama_lengkap' => 'required|string|max:255',
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'required|in:L,P',
            'agama' => 'nullable|string|max:50',
            'alamat' => 'nullable|string',
            'kelas_id' => 'required|exists:kelas,id',
            'instansi' => 'required|in:SMP,SMA',
            'nama_ayah' => 'nullable|string|max:255',
            'nama_ibu' => 'nullable|string|max:255',
            'telepon_ortu' => 'nullable|string|max:20',
            'pekerjaan_ortu' => 'nullable|string|max:255',
            'status' => 'nullable|in:aktif,nonaktif,lulus,pindah',
            'foto' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            // Hapus foto lama jika ada
            if ($siswa->foto && Storage::disk('public')->exists($siswa->foto)) {
                Storage::disk('public')->delete($siswa->foto);
            }
            $validated['foto'] = $request->file('foto')->store('siswa-foto', 'public');
        }

        $dataLama = $siswa->toArray();
        $siswa->update($validated);

        AktivitasService::catat('Update Siswa', 'App\Models\Siswa', $siswa->id, $dataLama, $siswa->fresh()->toArray());

        return redirect()->route('siswa.index')->with('success', 'Data siswa berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Siswa $siswa)
    {
        AktivitasService::catat('Hapus Siswa', 'App\Models\Siswa', $siswa->id, $siswa->toArray(), null);
        $siswa->delete();
        return redirect()->route('siswa.index')->with('success', 'Data siswa berhasil dihapus.');
    }

    /**
     * Import data siswa dari Excel.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048',
        ]);

        try {
            \Maatwebsite\Excel\Facades\Excel::import(new \App\Imports\SiswaImport, $request->file('file'));
            return redirect()->back()->with('success', 'Data siswa berhasil diimport.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memproses file Excel: ' . $e->getMessage());
        }
    }
}
