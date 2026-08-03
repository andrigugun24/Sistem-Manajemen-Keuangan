<?php 

namespace App\Services;

use App\Models\LogAktivitas;

class AktivitasService {
    public static function catat($action, $modelType = null, $modelId = null, $dataLama = null, $dataBaru = null)
    {
        LogAktivitas::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'model_type' => $modelType,
            'model_id' => $modelId,
            'data_lama' => $dataLama,
            'data_baru' => $dataBaru,
            'ip_address' => request()->ip()
        ]);
    }
}
