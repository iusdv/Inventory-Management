<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function index()
    {
        $stores = Store::all();
        return response()->json($stores);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:stores',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'status' => 'boolean',
        ]);

        $store = Store::create($request->all());

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

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:255|unique:stores,code,' . $id,
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'status' => 'boolean',
        ]);

        $store->update($request->all());

        return response()->json($store);
    }

    public function destroy($id)
    {
        $store = Store::findOrFail($id);
        $store->delete();

        return response()->json(['message' => 'Store deleted successfully']);
    }
}
