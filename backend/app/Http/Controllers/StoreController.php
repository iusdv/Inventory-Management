<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StoreController extends Controller
{
    private function generateUniqueCode(string $name, ?int $ignoreId = null): string
    {
        $base = Str::upper(Str::slug($name, '-'));
        $candidate = $base;
        $suffix = 1;

        while (Store::query()
            ->where('code', $candidate)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $suffix++;
            $candidate = $base . '-' . $suffix;
        }

        return $candidate;
    }

    public function index()
    {
        $stores = Store::all();
        return response()->json($stores);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'manager' => 'nullable|string|max:255',
            'code' => 'nullable|string|max:255|unique:stores,code',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'status' => 'boolean',
        ]);

        if (empty($data['code'])) {
            $data['code'] = $this->generateUniqueCode($data['name']);
        }

        $store = Store::create($data);

        return response()->json($store, 201);
    }

    public function show($id)
    {
        $store = Store::with('products')->findOrFail($id);
        return response()->json($store);
    }

    public function update(Request $request, $id)
    {
        $store = Store::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'location' => 'nullable|string|max:255',
            'manager' => 'nullable|string|max:255',
            'code' => 'sometimes|nullable|string|max:255|unique:stores,code,' . $id,
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'status' => 'boolean',
        ]);

        if (array_key_exists('code', $data) && empty($data['code'])) {
            $nameForCode = $data['name'] ?? $store->name;
            $data['code'] = $this->generateUniqueCode($nameForCode, $store->id);
        }

        $store->update($data);

        return response()->json($store);
    }

    public function destroy($id)
    {
        $store = Store::findOrFail($id);
        $store->delete();

        return response()->json(['message' => 'Store deleted successfully']);
    }
}
