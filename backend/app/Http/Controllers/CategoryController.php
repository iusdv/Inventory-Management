<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // GET /api/categories
    public function index()
    {
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->get();

        return response()->json($categories);
    }

    // POST /api/categories
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'status' => 'boolean',
        ]);

        // Auto-generate category_id
        $nextId = (Category::max('id') ?? 0) + 1;
        $categoryCode = 'CAT-' . str_pad($nextId, 3, '0', STR_PAD_LEFT);

        $data = array_merge($request->all(), [
            'category_id' => $categoryCode,
        ]);

        $category = Category::create($data);

        return response()->json($category, 201);
    }

    // GET /api/categories/{id}
    public function show($id)
    {
        $category = Category::with('children')->findOrFail($id);
        return response()->json($category);
    }

    // PUT /api/categories/{id}
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'status' => 'boolean',
        ]);

        $category->update($request->all());

        return response()->json($category);
    }

    // DELETE /api/categories/{id}
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
