<?php

namespace App\Http\Controllers;

use App\Models\Category;

class CategoryController extends Controller
{
    protected function getModel()
    {
        return new Category;
    }
}
