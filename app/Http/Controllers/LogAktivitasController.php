<?php

namespace App\Http\Controllers;

use App\Models\LogAktivitas;
use Inertia\Inertia;

class LogAktivitasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $logs = LogAktivitas::with('user:id,name')
            ->latest()
            ->paginate(20);
            
        return Inertia::render('Sistem/LogAktivitas/Index', [
            'logs' => $logs
        ]);
    }

    public function destroy(LogAktivitas $logAktivitas)
    {
        $logAktivitas->delete();
        return redirect()->back();
    }
    
    // Clear all logs
    public function clear()
    {
        LogAktivitas::truncate();
        return redirect()->back();
    }
}
