<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Services\Settings\SettingValueType;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::query()
            ->get(['key', 'value'])
            ->mapWithKeys(fn ($s) => [$s->key => $s->value]);

        return response()->json($settings);
    }

    public function bulkUpdate(Request $request)
    {
        $payload = $request->all();

        if (!is_array($payload)) {
            return response()->json(['message' => 'Invalid settings payload'], 422);
        }

        $groupMap = [
            'emailNotifications' => 'general',
            'lowStockAlerts' => 'general',
            'orderNotifications' => 'general',
            'currency' => 'display',
            'dateFormat' => 'display',
            'timezone' => 'display',
            'autoUpdateStock' => 'inventory',
            'showOutOfStockItems' => 'inventory',
        ];

        foreach ($payload as $key => $value) {
            if (!is_string($key) || $key === '') {
                continue;
            }

            $type = SettingValueType::detect($value);

            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'type' => $type, 'group' => $groupMap[$key] ?? 'general']
            );
        }

        return $this->index();
    }

    public function store(Request $request)
    {
        $request->validate([
            'key' => 'required|string|unique:settings',
            'value' => 'nullable',
            'type' => 'required|string',
            'group' => 'required|string',
        ]);

        $setting = Setting::create($request->all());

        return response()->json($setting, 201);
    }

    public function show($key)
    {
        $setting = Setting::where('key', $key)->firstOrFail();
        return response()->json($setting);
    }

    public function update(Request $request, $key)
    {
        $setting = Setting::where('key', $key)->firstOrFail();

        $request->validate([
            'value' => 'sometimes|nullable',
            'type' => 'sometimes|required|string',
            'group' => 'sometimes|required|string',
        ]);

        $setting->update($request->all());

        return response()->json($setting);
    }

    public function destroy($key)
    {
        $setting = Setting::where('key', $key)->firstOrFail();
        $setting->delete();

        return response()->json(['message' => 'Setting deleted successfully']);
    }
}
