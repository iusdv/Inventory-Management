<?php

namespace App\Http\Controllers;

use App\Models\Attribute;
use Illuminate\Http\Request;

class AttributeController extends Controller
{
    public function index()
    {
        $attributes = Attribute::all();
        return response()->json($attributes);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:text,select,color,size',
            'values' => 'nullable|array',
            'status' => 'boolean',
        ]);

        $attribute = Attribute::create($data);

        return response()->json($attribute, 201);
    }

    public function show($id)
    {
        $attribute = Attribute::findOrFail($id);
        return response()->json($attribute);
    }

    public function update(Request $request, $id)
    {
        $attribute = Attribute::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|in:text,select,color,size',
            'values' => 'nullable|array',
            'status' => 'boolean',
        ]);

        $attribute->update($data);

        return response()->json($attribute);
    }

    public function destroy($id)
    {
        $attribute = Attribute::findOrFail($id);
        $attribute->delete();

        return response()->json(['message' => 'Attribute deleted successfully']);
    }
}
