<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    protected function getModel()
    {
        return new Category;
    }

    public function getAll(Request $request)
    {
        $categories = $this->getModel()::where("account_id", $request->account_id)->get();

        return response()->json([
            "Expenses" => $categories->where("type", "Expenses"),
            "Income" => $categories->where("type", "Income"),
        ], 200);
    }

    public function getStatistics(Request $request)
    {
        $categories = $this->getModel()::where("account_id", $request->account_id);

        if (isset($request->date)) {
            $dates = explode(',', $request->date);

            $categories->whereHas('transactions', function ($query) use ($dates) {
                $query->whereBetween('payment_date', [$dates[0], $dates[1]]);
            })->orWhereHas('subscriptions', function ($query) use ($dates) {
                $query->whereBetween('payment_date', [$dates[0], $dates[1]]);
            });
        }

        $categories = $categories->get();

        $statistics = [];
        foreach ($categories as $category) {
            $statistics[$category->title] = $category->transactions->where("type", "Expenses")->sum("amount")
                + $category->subscriptions->sum("amount");
        }

        return response()->json($statistics, 200);
    }
}
