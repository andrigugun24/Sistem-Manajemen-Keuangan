<?php

namespace App\Http\Controllers;

use App\Models\KategoriTagihan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KategoriTagihanController extends Controller
{
    public function index()
    {
        $kategoriTagihans = KategoriTagihan::latest()->get();
        return Inertia::render('DataMaster/KategoriTagihan/Index', [
            'kategori_tagihans' => $kategoriTagihans
        ]);
    }

    public function create()
    {
        return Inertia::render('DataMaster/KategoriTagihan/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:255',
            'kode_tagihan' => 'nullable|string|max:50',
            'jenis_tagihan' => 'required|string|in:Bulanan,Sekali Bayar',
            'nominal_default' => 'nullable|numeric|min:0',
            'deskripsi' => 'nullable|string|max:255',
        ]);

        KategoriTagihan::create($validated);

        return redirect()->route('kategori-tagihan.index')->with('success', 'Kategori Tagihan berhasil ditambahkan.');
    }

    public function edit(KategoriTagihan $kategoriTagihan)
    {
        return Inertia::render('DataMaster/KategoriTagihan/Edit', [
            'kategori_tagihan' => $kategoriTagihan
        ]);
    }

    public function update(Request $request, KategoriTagihan $kategoriTagihan)
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:255',
            'kode_tagihan' => 'nullable|string|max:50',
            'jenis_tagihan' => 'required|string|in:Bulanan,Sekali Bayar',
            'nominal_default' => 'nullable|numeric|min:0',
            'deskripsi' => 'nullable|string|max:255',
        ]);

        $kategoriTagihan->update($validated);

        return redirect()->route('kategori-tagihan.index')->with('success', 'Kategori Tagihan berhasil diperbarui.');
    }

    public function destroy(KategoriTagihan $kategoriTagihan)
    {
        $kategoriTagihan->delete();
        return redirect()->route('kategori-tagihan.index')->with('success', 'Kategori Tagihan berhasil dihapus.');
    }
}
