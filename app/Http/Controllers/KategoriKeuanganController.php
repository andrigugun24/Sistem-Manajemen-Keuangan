<?php

namespace App\Http\Controllers;

use App\Models\KategoriKeuangan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KategoriKeuanganController extends Controller
{
    public function index()
    {
        $kategoriKeuangans = KategoriKeuangan::latest()->get();
        return Inertia::render('DataMaster/KategoriKeuangan/Index', [
            'kategori_keuangans' => $kategoriKeuangans
        ]);
    }

    public function create()
    {
        return Inertia::render('DataMaster/KategoriKeuangan/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:255',
            'jenis' => 'required|in:Pemasukan,Pengeluaran',
        ]);

        KategoriKeuangan::create($validated);

        return redirect()->route('kategori-keuangan.index')->with('success', 'Kategori Keuangan berhasil ditambahkan.');
    }

    public function edit(KategoriKeuangan $kategoriKeuangan)
    {
        return Inertia::render('DataMaster/KategoriKeuangan/Edit', [
            'kategori_keuangan' => $kategoriKeuangan
        ]);
    }

    public function update(Request $request, KategoriKeuangan $kategoriKeuangan)
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:255',
            'jenis' => 'required|in:Pemasukan,Pengeluaran',
        ]);

        $kategoriKeuangan->update($validated);

        return redirect()->route('kategori-keuangan.index')->with('success', 'Kategori Keuangan berhasil diperbarui.');
    }

    public function destroy(KategoriKeuangan $kategoriKeuangan)
    {
        $kategoriKeuangan->delete();
        return redirect()->route('kategori-keuangan.index')->with('success', 'Kategori Keuangan berhasil dihapus.');
    }
}
