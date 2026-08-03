<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class SistemNotification extends Notification
{
    use Queueable;

    protected string $title;
    protected string $message;
    protected string $icon;

    public function __construct(string $title, string $message, string $icon = 'info')
    {
        $this->title = $title;
        $this->message = $message;
        $this->icon = $icon;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'title' => $this->title,
            'message' => $this->message,
            'icon' => $this->icon,
        ];
    }
}
