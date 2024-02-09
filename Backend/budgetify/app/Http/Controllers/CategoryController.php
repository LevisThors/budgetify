<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    protected function getModel()
    {
        return new Category;
    }

    public function getAll(Request $request)
    {
        $categories = $this->getModel()::where("user_id", Auth::user()->id)->get();

        return response()->json([
            "Expenses" => $categories->where("type", "Expenses"),
            "Income" => $categories->where("type", "Income"),
        ], 200);
    }
}
