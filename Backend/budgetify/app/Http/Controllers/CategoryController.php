<?php

namespace App\Http\Controllers;

use App\Models\Account;
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

    public function store(Request $request)
    {
        $account = Account::find($request->account_id);

        $existingCategory = $account->categories()->where('title', $request->title)->first();

        if ($existingCategory) {
            return response()->json(['error' => 'A category with this title already exists.'], 400);
        }

        $category = $this->getModel()::create([
            "title" => $request->title,
            "type" => $request->type,
            "account_id" => $account->id,
        ]);

        return response()->json($category, 200);
    }

    public function update(Request $request, $id)
    {
        $account = Account::find($request->account_id);

        $existingCategory = $account->categories()->where('title', $request->title)->get();

        if ($existingCategory->count() > 1) {
            return response()->json(['error' => 'A category with this title already exists.'], 400);
        }

        $category = $this->getModel()::find($id);

        if ($category) {
            $category->update([
                "title" => $request->title,
                "type" => $request->type,
            ]);
            return response()->json($category, 200);
        }

        return response()->json(['error' => 'Category not found.'], 400);
    }

    public function getAll(Request $request)
    {
        $query = $this->getModel()::where("account_id", $request->account_id);

        if (isset($request->unordered)) {
            if (isset($request->type)) {
                $query->where('type', $request->type);
            }

            if (isset($request['query'])) {
                $searchTerm = '%' . $request['query'] . '%';
                $query->where('title', 'like', $searchTerm)
                    ->orWhere('type', 'like', $searchTerm);
            }

            $categories = $query->get();

            return response()->json($categories, 200);
        } else {
            $categories = $query->get();

            return response()->json([
                "Expenses" => $categories->where("type", "Expenses")->values(),
                "Income" => $categories->where("type", "Income")->values(),
            ], 200);
        }
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

    public function delete($id)
    {
        $category = $this->getModel()::find($id);

        if ($category) {
            $category->delete();
            return response()->json(['message' => 'Category deleted successfully.'], 200);
        }

        return response()->json(['error' => 'Category not found.'], 404);
    }
}
