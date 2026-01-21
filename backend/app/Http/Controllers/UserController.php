<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('role')->get();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:groups,id',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $role = Group::find($data['role_id']);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'group_id' => $data['role_id'],
            'role' => $role?->name,
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
            'status' => $data['status'] ?? true,
        ]);

        return response()->json($user->load('role'), 201);
    }

    public function show($id)
    {
        $user = User::with('role')->findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:8',
            'role_id' => 'sometimes|required|exists:groups,id',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $update = collect($data)->except(['password', 'role_id'])->all();

        if (array_key_exists('password', $data)) {
            $update['password'] = Hash::make($data['password']);
        }

        if (array_key_exists('role_id', $data)) {
            $role = Group::find($data['role_id']);
            $update['group_id'] = $data['role_id'];
            $update['role'] = $role?->name;
        }

        $user->update($update);

        return response()->json($user->load('role'));
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
