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
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:text,select,color,size',
            'values' => 'nullable|array',
        ]);

        $attribute = Attribute::create($request->all());

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

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|in:text,select,color,size',
            'values' => 'nullable|array',
        ]);

        $attribute->update($request->all());

        return response()->json($attribute);
    }

    public function destroy($id)
    {
        $attribute = Attribute::findOrFail($id);
        $attribute->delete();

        return response()->json(['message' => 'Attribute deleted successfully']);
    }
}
