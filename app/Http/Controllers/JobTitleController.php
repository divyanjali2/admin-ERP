<?php

namespace App\Http\Controllers;

use App\Models\JobTitle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobTitleController extends Controller
{
    public function index()
    {
        $jobTitles = JobTitle::orderBy('job_title_id')->get();

        return Inertia::render('HRMS/JobTitles', [
            'jobTitles' => $jobTitles,
        ]);
    }

    public function create()
    {
        return Inertia::render('HRMS/JobTitlesCreate');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:job_titles,name'],
        ]);

        JobTitle::create($validated);

        return redirect()->route('hrms.job-titles.index')->with('success', 'Job Title created successfully.');
    }

    public function edit(JobTitle $jobTitle)
    {
        return Inertia::render('HRMS/JobTitlesEdit', [
            'jobTitle' => $jobTitle,
        ]);
    }

    public function update(Request $request, JobTitle $jobTitle)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:job_titles,name,' . $jobTitle->job_title_id . ',job_title_id'],
        ]);

        $jobTitle->update($validated);

        return redirect()->route('hrms.job-titles.index')->with('success', 'Job Title updated successfully.');
    }

    public function destroy(JobTitle $jobTitle)
    {
        $jobTitle->delete();

        return redirect()->route('hrms.job-titles.index')->with('success', 'Job Title deleted successfully.');
    }
}
