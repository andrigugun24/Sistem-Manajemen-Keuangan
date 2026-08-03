<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\KategoriKeuangan;

try {
    $k = Kelas::first();
    if ($k) {
        $k->delete();
        echo "Kelas deleted success.\n";
    }
} catch (\Exception $e) {
    echo "Kelas delete ERROR: " . $e->getMessage() . "\n";
}

try {
    $s = Siswa::first();
    if ($s) {
        app('App\Http\Controllers\SiswaController')->destroy($s);
        echo "Siswa deleted via Controller success.\n";
    }
} catch (\Exception $e) {
    echo "Siswa delete ERROR: " . $e->getMessage() . "\n";
}

try {
    $kk = KategoriKeuangan::first();
    if ($kk) {
        $kk->delete();
        echo "KategoriKeuangan deleted success.\n";
    }
} catch (\Exception $e) {
    echo "KategoriKeuangan delete ERROR: " . $e->getMessage() . "\n";
}
