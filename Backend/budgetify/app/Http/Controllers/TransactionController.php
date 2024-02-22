<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class TransactionController extends Controller
{
    protected function getModel()
    {
        return new Transaction;
    }

    public function getAll(Request $request)
    {
        if (is_numeric($request->account_id)) {
            $query = $this->getModel()::where('account_id', $request['account_id'])
                ->with('categories');

            if (isset($request->type)) {
                $query->where('type', $request->type);
            }

            if (isset($request['query'])) {
                $searchTerm = '%' . $request['query'] . '%';
                $query->where('title', 'like', $searchTerm)
                    ->orWhere('description', 'like', $searchTerm)
                    ->orWhereHas('categories', function ($query) use ($searchTerm) {
                        $query->where('title', 'like', $searchTerm);
                    });;
            }

            if (isset($request['sort'])) {
                [$column, $direction] = explode('-', $request['sort']);
                $query->orderBy($column, $direction);
            } else {
                $query->orderBy('payment_date', 'desc');
            }

            // $transactions = $query->get();

            $transactions = $query->get()->map(function ($transaction) {
                $transaction->documents = $transaction->getMedia()->map(function ($media) {
                    return [
                        'url' => env('NGROK_URL') . explode('localhost', $media->getUrl())[1],
                        'path' => $media->getPath(),
                        'name' => $media->name,
                    ];
                });

                return $transaction;
            });

            if ($transactions->count() == 0) {
                return response()->json(['message' => 'Empty account'], 200);
            }

            return response()->json(
                [
                    'transactions' => $transactions,
                    'currency' => Account::find($request->account_id)->first()->currency,
                ],
                200
            );
        } else {
            return response()->json(['message' => 'Empty account'], 200);
        }
    }

    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $transaction = $this->getModel()::find($id);

            if (!$transaction) {
                return response()->json(['message' => 'Transaction not found'], 404);
            }

            $transaction->update([
                'title' => $request['title'],
                'description' => $request['description'],
                'type' => $request['type'],
                'amount' => $request['amount'],
                'payment_date' => $request['payment_date'],
                'payee' => $request['payee'] ? $request['payee']
                    : Auth::user()->first_name . ' ' . Auth::user()->last_name,
                'account_id' => $request->account_id,
            ]);

            if (isset($request['categories'])) {
                $userCategories = Auth::user()->categories->pluck('id')->toArray();

                if (array_diff($request['categories'], $userCategories)) {
                    DB::rollBack();
                    return response()->json(['message' => 'Some categories do not belong to the user'], 400);
                }

                $transaction->categories()->sync($request['categories']);
            }

            if (isset($request->media)) {
                foreach ($request->media as $file) {
                    $transaction
                        ->addMedia($file)
                        ->toMediaCollection();
                }
            }

            $account = Auth::user()->accounts->find($request->account_id);
            $account->balance = $request->type === 'Expenses'
                ? $account->balance - $request->amount
                : $account->balance + $request->amount;

            if ($account->balance < 0) {
                DB::rollBack();
                return response()->json(['message' => 'Insufficient funds'], 400);
            }

            $account->save();

            DB::commit();

            return response()->json($transaction, 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => 'Error occurred while updating transaction: ' . $e->getMessage()], 500);
        }
    }

    public function delete($id)
    {
        $transaction = $this->getModel()::find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        $account = $transaction->account;
        $account->balance = $transaction->type === "Expenses"
            ? $account->balance + $transaction->amount
            : $account->balance - $transaction->amount;

        $account->save();
        $transaction->delete();

        return response()->json(['message' => 'Transaction deleted'], 200);
    }

    public function store(Request $request)
    {
        if (Auth::user()) {
            DB::beginTransaction();

            try {
                $transaction = $this->getModel()::create([
                    'title' => $request['title'],
                    'description' => $request['description'],
                    'type' => $request['type'],
                    'amount' => $request['amount'],
                    'payment_date' => $request['payment_date'],
                    'payee' => $request['payee'] ? $request['payee']
                        : '',
                    'account_id' => $request->account_id,
                ]);

                if (isset($request['categories'])) {
                    $accountCategories = Account::find($request->account_id)->categories->pluck('id')->toArray();

                    if (array_diff($request['categories'], $accountCategories)) {
                        DB::rollBack();
                        return response()->json(['message' => 'Some categories do not belong to the user'], 400);
                    }

                    $transaction->categories()->attach($request['categories']);
                }

                if (isset($request->media)) {
                    foreach ($request->media as $file) {
                        $transaction
                            ->addMedia($file)
                            ->toMediaCollection();
                    }
                }

                $account = Auth::user()->accounts->find($request->account_id);
                $account->balance = $request->type === 'Expenses'
                    ? $account->balance - $request->amount
                    : $account->balance + $request->amount;

                if ($account->balance < 0) {
                    DB::rollBack();
                    return response()->json(['message' => 'Insufficient funds'], 400);
                }

                $account->save();

                DB::commit();

                return response()->json($transaction, 200);
            } catch (\Exception $e) {
                DB::rollBack();

                return response()->json(['message' => 'Error occurred while creating transaction: ' . $e->getMessage()], 500);
            }
        }
    }

    public function downloadDocument($path)
    {
        $path = str_replace('-s-', '/', $path);
        // $path = explode('/storage', $path)[1];

        Log::info($path);
        return response()->download($path);
    }
}
