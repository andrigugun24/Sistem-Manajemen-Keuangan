<?php

namespace App\Http\Controllers;

use App\Models\ProfilSekolah;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Services\AktivitasService;

class ProfilSekolahController extends Controller
{
    public function index()
    {
        $profil = ProfilSekolah::first();
        
        if (!$profil) {
            $profil = ProfilSekolah::create([
                'nama_sekolah' => 'Sistem Informasi Terpadu',
            ]);
        }

        return Inertia::render('DataMaster/ProfilSekolah/Index', [
            'profil' => $profil
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'nama_sekolah' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'telepon' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:255',
            'kepala_sekolah' => 'nullable|string|max:255',
            'nip_kepala_sekolah' => 'nullable|string|max:100',
            'logo' => 'nullable|image|max:2048', // 2MB max
        ]);

        $profil = ProfilSekolah::first();

        if ($request->hasFile('logo')) {
            if ($profil->logo && Storage::disk('public')->exists($profil->logo)) {
                Storage::disk('public')->delete($profil->logo);
            }
            $logoPath = $request->file('logo')->store('logos', 'public');
            $validated['logo'] = $logoPath;
        }

        $dataLama = $profil->toArray();
        $profil->update($validated);

        AktivitasService::catat('Update Profil Yayasan', 'App\Models\ProfilSekolah', $profil->id, $dataLama, $profil->fresh()->toArray());

        return back()->with('success', 'Profil yayasan berhasil diperbarui.');
    }
}
