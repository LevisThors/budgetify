<?php

namespace App\Http\Controllers;

use App\Models\PiggyBank;
use Illuminate\Http\Request;

class PiggyBankController extends Controller
{
    protected function getModel()
    {
        return new PiggyBank;
    }
}
