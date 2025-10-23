<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index()
    {
        $company = Company::first();
        return response()->json($company);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'zip' => 'nullable|string',
            'country' => 'nullable|string',
            'logo' => 'nullable|string',
            'website' => 'nullable|url',
            'tax_id' => 'nullable|string',
        ]);

        $company = Company::first();
        
        if ($company) {
            $company->update($request->all());
        } else {
            $company = Company::create($request->all());
        }

        return response()->json($company);
    }

    public function update(Request $request, $id)
    {
        $company = Company::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'zip' => 'nullable|string',
            'country' => 'nullable|string',
            'logo' => 'nullable|string',
            'website' => 'nullable|url',
            'tax_id' => 'nullable|string',
        ]);

        $company->update($request->all());

        return response()->json($company);
    }
}
