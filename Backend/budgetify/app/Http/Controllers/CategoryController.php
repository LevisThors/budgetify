<?php

namespace App\Http\Controllers;

use App\Exports\CategoryStatisticsExport;
use App\Exports\CategoryStatisticsReport;
use App\Exports\MonthlyStatisticsExport;
use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class CategoryController extends Controller
{
    protected function getModel()
    {
        return new Category;
    }

    public function store(Request $request)
    {
        $account = Account::find($request->account_id);

        $existingCategory = $account->categories()->where('type', $request->type)->where('title', $request->title)->first();

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
            });
        }

        $categories = $categories->where("type", "Expenses")->get();

        $statistics = [];
        foreach ($categories as $category) {
            $statistics[$category->title] = $category->transactions->where("type", "Expenses")->sum("amount");
        }

        $statistics["currency"] = Account::find($request->account_id)->currency;

        if (isset($request->download)) {
            return Excel::download(new CategoryStatisticsExport($statistics), 'category_statistics.xlsx');
        }

        return response()->json($statistics, 200);
    }

    public function getMonthlyStatistics(Request $request)
    {
        $dates = explode(',', $request->date);
        $date_from = Carbon::parse($dates[0] ?? now()->subMonths(5));
        $date_to = isset($dates[1]) ? Carbon::parse($dates[1]) : now();

        $statistics = [];

        while ($date_from->lessThanOrEqualTo($date_to)) {
            $transactions = Transaction::whereMonth('payment_date', $date_from->month)
                ->whereYear('payment_date', $date_from->year)
                ->where('account_id', $request->account_id)
                ->get();

            $income = $transactions->where('type', 'Income')->sum('amount');
            $expenses = $transactions->where('type', 'Expenses')->sum('amount');
            $economy = $income - $expenses;
            $percentageOfEconomy = $income > 0 ? number_format(($economy / $income) * 100, 2) : 0;

            if ($income < $expenses) {
                $economy = $expenses - $income;
                $percentageOfEconomy = $expenses > 0 ? number_format(($economy / $expenses) * 100, 2) : 0;
            }

            $statistics[] = [
                'month' => $date_from->format('F Y'),
                'income' => $income,
                'expenses' => $expenses,
                'economy' => $economy,
                'percentage_of_economy' => $percentageOfEconomy
            ];

            $date_from->addMonth();
        }

        if (isset($request->download)) {
            return Excel::download(new MonthlyStatisticsExport($statistics), 'monthly_statistics.xlsx');
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
