<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\ProfilSekolah;
use Illuminate\Support\Facades\Storage;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'userRole' => $request->user()?->role ?? 'admin',
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
            'unreadNotificationsCount' => fn () => $request->user()
                ? $request->user()->unreadNotifications()->count()
                : 0,
            'latestNotifications' => fn () => $request->user()
                ? $request->user()->notifications()->latest()->take(5)->get()->map(fn ($n) => [
                    'id' => $n->id,
                    'title' => $n->data['title'] ?? 'Notifikasi',
                    'desc' => $n->data['message'] ?? '',
                    'time' => $n->created_at->diffForHumans(),
                    'unread' => is_null($n->read_at),
                ])
                : [],
            'sekolah' => fn () => tap(ProfilSekolah::first(), function ($profil) {
                if ($profil && $profil->logo) {
                    $profil->logo_url = Storage::disk('public')->url($profil->logo);
                }
            }),
            'tahunAjaranAktif' => fn () => \App\Models\TahunAjaran::where('aktif', true)->first(),
            'tahunAjarans' => fn () => \App\Models\TahunAjaran::orderBy('aktif', 'desc')->orderBy('created_at', 'desc')->get(),
        ];
    }
}
