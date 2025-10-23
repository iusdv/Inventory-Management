<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all();
        return response()->json($settings);
    }

    public function store(Request $request)
    {
        $request->validate([
            'key' => 'required|string|unique:settings',
            'value' => 'required',
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
            'value' => 'sometimes|required',
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
