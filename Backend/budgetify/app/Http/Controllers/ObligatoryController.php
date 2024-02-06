<?php

namespace App\Http\Controllers;

use App\Models\Obligatory;
use Illuminate\Http\Request;

class ObligatoryController extends Controller
{
    protected function getModel()
    {
        return new Obligatory;
    }
}
