<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Permissions/Index', [
            'permissions' => $permissions,
        ]);
    }

    public function create()
    {
        return Inertia::render('Permissions/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
            'description' => 'nullable|string',
        ]);

        Permission::create($validated);

        return redirect('/hrms/permissions')->with('success', 'Permission created successfully.');
    }

    public function edit(Permission $permission)
    {
        return Inertia::render('Permissions/Edit', [
            'permission' => $permission,
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
            'description' => 'nullable|string',
        ]);

        $permission->update($validated);

        return redirect('/hrms/permissions')->with('success', 'Permission updated successfully.');
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();

        return redirect('/hrms/permissions')->with('success', 'Permission deleted successfully.');
    }
}
