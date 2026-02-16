<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::orderBy('name')->get();

        return Inertia::render('HRMS/Departments', [
            'departments' => $departments,
        ]);
    }

    public function create()
    {
        return Inertia::render('HRMS/DepartmentsCreate');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:departments,name'],
        ]);

        Department::create($validated);

        return redirect()->route('hrms.departments.index')->with('success', 'Department created successfully.');
    }

    public function edit(Department $department)
    {
        return Inertia::render('HRMS/DepartmentsEdit', [
            'department' => $department,
        ]);
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:departments,name,' . $department->department_id . ',department_id'],
        ]);

        $department->update($validated);

        return redirect()->route('hrms.departments.index')->with('success', 'Department updated successfully.');
    }

    public function destroy(Department $department)
    {
        $department->delete();

        return redirect()->route('hrms.departments.index')->with('success', 'Department deleted successfully.');
    }
}
