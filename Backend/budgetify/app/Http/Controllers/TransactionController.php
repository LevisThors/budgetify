<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    protected function getModel()
    {
        return new Transaction;
    }

    public function getAll(Request $request)
    {
        $transactions = $this->getModel()::where("account_id", $request->account_id)->with('categories')->get();

        return response()->json($transactions, 200);
    }
}
