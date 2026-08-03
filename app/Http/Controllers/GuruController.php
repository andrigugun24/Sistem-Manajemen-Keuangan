<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Services\AktivitasService;

class GuruController extends Controller
{
    public function index()
    {
        $query = Guru::latest();

        // Kepala sekolah hanya dapat melihat guru sesuai instansinya
        $user = auth()->user();
        if ($user->role === 'kepala_sekolah' && $user->instansi) {
            $query->where('instansi', $user->instansi);
        }

        $gurus = $query->get();
        return Inertia::render('DataMaster/DataGuru/Index', [
            'gurus' => $gurus
        ]);
    }

    public function create()
    {
        return Inertia::render('DataMaster/DataGuru/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_guru' => 'required|string|max:255',
            'nip' => 'nullable|string|max:255',
            'instansi' => 'required|in:SMP,SMA,Keduanya/Yayasan',
            'foto' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('guru-foto', 'public');
        }

        $guru = Guru::create($validated);
        AktivitasService::catat('Tambah Guru', 'App\Models\Guru', $guru->id, null, $guru->toArray());
        return redirect()->route('guru.index')->with('success', 'Guru berhasil ditambahkan.');
    }

    public function edit(Guru $guru)
    {
        return Inertia::render('DataMaster/DataGuru/Edit', [
            'guru' => $guru
        ]);
    }

    public function update(Request $request, Guru $guru)
    {
        $validated = $request->validate([
            'nama_guru' => 'required|string|max:255',
            'nip' => 'nullable|string|max:255',
            'instansi' => 'required|in:SMP,SMA,Keduanya/Yayasan',
            'foto' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            if ($guru->foto && Storage::disk('public')->exists($guru->foto)) {
                Storage::disk('public')->delete($guru->foto);
            }
            $validated['foto'] = $request->file('foto')->store('guru-foto', 'public');
        }

        $dataLama = $guru->toArray();
        $guru->update($validated);
        AktivitasService::catat('Update Guru', 'App\Models\Guru', $guru->id, $dataLama, $guru->fresh()->toArray());
        return redirect()->route('guru.index')->with('success', 'Guru berhasil diperbarui.');
    }

    public function destroy(Guru $guru)
    {
        AktivitasService::catat('Hapus Guru', 'App\Models\Guru', $guru->id, $guru->toArray(), null);
        $guru->delete();
        return redirect()->route('guru.index')->with('success', 'Guru berhasil dihapus.');
    }
}
