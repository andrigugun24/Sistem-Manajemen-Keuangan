<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotifikasiController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if(!method_exists($user, 'notifications')){
             return Inertia::render('Sistem/Notifikasi/Index', ['notifikasi' => []]);
        }
        $notifications = $user->notifications()->paginate(20);
        return Inertia::render('Sistem/Notifikasi/Index', [
            'notifikasi' => $notifications
        ]);
    }

    public function markAsRead($id)
    {
        try {
            $notification = auth()->user()->notifications()->findOrFail($id);
            $notification->markAsRead();
        } catch (\Exception $e) {}
        
        return back();
    }

    public function markAllAsRead()
    {
        try {
            auth()->user()->unreadNotifications->markAsRead();
        } catch (\Exception $e) {}
        
        return back();
    }
}
