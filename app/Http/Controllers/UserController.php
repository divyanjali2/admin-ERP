<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->orderBy('created_at', 'desc')->paginate(20);
        $roles = Role::orderBy('name')->get();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role_id' => 'nullable|exists:roles,id',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        
        $role_id = $validated['role_id'];
        unset($validated['role_id']);

        $user = User::create($validated);
        
        if ($role_id) {
            $user->roles()->attach($role_id);
        }

        return redirect('/hrms/users')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            'user' => $user->load('roles'),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'role_id' => 'nullable|exists:roles,id',
        ]);

        if ($request->filled('password')) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }
        
        $role_id = $validated['role_id'];
        unset($validated['role_id']);

        $user->update($validated);
        
        if ($role_id) {
            $user->roles()->sync([$role_id]);
        } else {
            $user->roles()->detach();
        }

        return redirect('/hrms/users')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect('/hrms/users')->with('success', 'User deleted successfully.');
    }
}
