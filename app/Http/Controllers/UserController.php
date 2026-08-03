<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use App\Services\AktivitasService;

class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->paginate(20);

        $roleCounts = [
            'admin' => User::where('role', 'admin')->count(),
            'kepala_sekolah' => User::where('role', 'kepala_sekolah')->count(),
            'bendahara' => User::where('role', 'bendahara')->count(),
            'guru' => User::where('role', 'guru')->count(),
            'orang_tua' => User::where('role', 'orang_tua')->count(),
        ];

        return Inertia::render('Sistem/Pengguna/Index', [
            'users' => $users,
            'roleCounts' => $roleCounts,
        ]);
    }

    public function create()
    {
        $siswas = Siswa::where('status', 'aktif')
            ->doesntHave('users')
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nisn']);

        return Inertia::render('Sistem/Pengguna/Create', [
            'siswas' => $siswas
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', Rules\Password::defaults()],
            'role' => 'required|string|in:admin,bendahara,kepala_sekolah,kepala_yayasan,orang_tua',
            'instansi' => 'nullable|string|max:100',
            'siswa_ids' => 'nullable|array',
            'siswa_ids.*' => 'exists:siswas,id'
        ]);

        $userData = $validated;
        unset($userData['siswa_ids']);

        $userData['password'] = Hash::make($userData['password']);

        $user = User::create($userData);

        if ($user->role === 'orang_tua' && !empty($validated['siswa_ids'])) {
            $user->siswas()->sync($validated['siswa_ids']);
        }

        AktivitasService::catat('Tambah Pengguna', 'App\Models\User', $user->id, null, ['name' => $user->name, 'email' => $user->email, 'role' => $user->role]);

        return redirect()->route('pengguna.index')->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function edit(User $pengguna) // Parameter $pengguna dari route bind
    {
        $siswas = Siswa::where('status', 'aktif')
            ->where(function ($query) use ($pengguna) {
                $query->doesntHave('users')
                      ->orWhereHas('users', function ($q) use ($pengguna) {
                          $q->where('users.id', $pengguna->id);
                      });
            })
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nisn']);

        $pengguna->load('siswas:id');

        return Inertia::render('Sistem/Pengguna/Edit', [
            'user' => $pengguna,
            'siswas' => $siswas,
            'selected_siswa_ids' => $pengguna->siswas->pluck('id')->toArray()
        ]);
    }

    public function update(Request $request, User $pengguna)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class.',email,'.$pengguna->id,
            'role' => 'required|string|in:admin,bendahara,kepala_sekolah,kepala_yayasan,orang_tua',
            'instansi' => 'nullable|string|max:100',
            'siswa_ids' => 'nullable|array',
            'siswa_ids.*' => 'exists:siswas,id'
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['required', Rules\Password::defaults()];
        }

        $validated = $request->validate($rules);

        $userData = $validated;
        unset($userData['siswa_ids']);

        if ($request->filled('password')) {
            $userData['password'] = Hash::make($userData['password']);
        } else {
            unset($userData['password']);
        }

        $pengguna->update($userData);

        if ($pengguna->role === 'orang_tua') {
            $pengguna->siswas()->sync($validated['siswa_ids'] ?? []);
        } else {
            // Jika bukan orang tua, hapus relasi apapun
            $pengguna->siswas()->detach();
        }

        AktivitasService::catat('Update Pengguna', 'App\Models\User', $pengguna->id, null, ['name' => $pengguna->name, 'role' => $pengguna->role]);

        return redirect()->route('pengguna.index')->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function destroy(User $pengguna)
    {
        // Hindari menghapus diri sendiri
        if (auth()->id() === $pengguna->id) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        AktivitasService::catat('Hapus Pengguna', 'App\Models\User', $pengguna->id, ['name' => $pengguna->name, 'email' => $pengguna->email], null);
        $pengguna->delete();
        return redirect()->route('pengguna.index')->with('success', 'Pengguna berhasil dihapus.');
    }
}
