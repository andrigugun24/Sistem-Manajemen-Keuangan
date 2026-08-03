<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin Master — satu-satunya akun default
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@sekolah.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
    }
}

