<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\AktivitasService;

class KelasController extends Controller
{
    public function index()
    {
        $kelas = Kelas::withCount('siswas')->latest()->get();
        return Inertia::render('DataMaster/DataKelas/Index', [
            'kelas' => $kelas
        ]);
    }

    public function create()
    {
        // View create bisa digabung dengan index menggunakan modal, namun kita siapkan jika diperlukan
        return Inertia::render('DataMaster/DataKelas/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string|max:255',
            'instansi' => 'required|in:SMP,SMA',
        ]);

        $kelas = Kelas::create($validated);
        AktivitasService::catat('Tambah Kelas', 'App\Models\Kelas', $kelas->id, null, $kelas->toArray());
        return redirect()->route('kelas.index')->with('success', 'Kelas berhasil ditambahkan.');
    }

    public function edit(Kelas $kelas)
    {
        return Inertia::render('DataMaster/DataKelas/Edit', [
            'kelas' => $kelas
        ]);
    }

    public function update(Request $request, Kelas $kelas)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string|max:255',
            'instansi' => 'required|in:SMP,SMA',
        ]);

        $dataLama = $kelas->toArray();
        $kelas->update($validated);
        AktivitasService::catat('Update Kelas', 'App\Models\Kelas', $kelas->id, $dataLama, $kelas->fresh()->toArray());
        return redirect()->route('kelas.index')->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy(Kelas $kelas)
    {
        AktivitasService::catat('Hapus Kelas', 'App\Models\Kelas', $kelas->id, $kelas->toArray(), null);
        $kelas->delete();
        return redirect()->route('kelas.index')->with('success', 'Kelas berhasil dihapus.');
    }
}
