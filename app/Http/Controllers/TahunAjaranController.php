<?php

namespace App\Http\Controllers;

use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TahunAjaranController extends Controller
{
    public function index()
    {
        $tahunAjarans = TahunAjaran::latest()->get();
        return Inertia::render('DataMaster/TahunAjaran/Index', [
            'tahun_ajarans' => $tahunAjarans
        ]);
    }

    public function create()
    {
        return Inertia::render('DataMaster/TahunAjaran/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_tahun_ajaran' => 'required|string|max:255',
            'semester' => 'required|in:Ganjil,Genap',
            'aktif' => 'boolean'
        ]);

        if ($validated['aktif'] ?? false) {
            TahunAjaran::query()->update(['aktif' => false]); // Hanya 1 yang aktif
        }

        TahunAjaran::create($validated);

        return redirect()->route('tahun-ajaran.index')->with('success', 'Tahun Ajaran berhasil ditambahkan.');
    }

    public function edit(TahunAjaran $tahunAjaran)
    {
        return Inertia::render('DataMaster/TahunAjaran/Edit', [
            'tahun_ajaran' => $tahunAjaran
        ]);
    }

    public function update(Request $request, TahunAjaran $tahunAjaran)
    {
        $validated = $request->validate([
            'nama_tahun_ajaran' => 'required|string|max:255',
            'semester' => 'required|in:Ganjil,Genap',
            'aktif' => 'boolean'
        ]);

        if ($validated['aktif'] ?? false) {
            TahunAjaran::where('id', '!=', $tahunAjaran->id)->update(['aktif' => false]);
        }

        $tahunAjaran->update($validated);

        return redirect()->route('tahun-ajaran.index')->with('success', 'Tahun Ajaran berhasil diperbarui.');
    }

    public function destroy(TahunAjaran $tahunAjaran)
    {
        $tahunAjaran->delete();
        return redirect()->route('tahun-ajaran.index')->with('success', 'Tahun Ajaran berhasil dihapus.');
    }
}
