<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SubscriptionController extends Controller
{
    protected function getModel()
    {
        return new Subscription;
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
                    });
            }

            if (isset($request['sort'])) {
                [$column, $direction] = explode('-', $request['sort']);
                $query->orderBy($column, $direction);
            } else {
                $query->orderBy('created_at', 'desc');
            }

            $subscriptions = $query->get();

            if ($subscriptions->count() == 0) {
                return response()->json(['message' => 'Empty account'], 200);
            }

            return response()->json(
                [
                    'subscriptions' => $subscriptions,
                    'currency' => Account::find($request->account_id)->first()->currency,
                ],
                200
            );
        } else {
            return response()->json(['message' => 'Empty account'], 200);
        }
    }

    public function store(Request $request)
    {
        if (Auth::user()) {
            DB::beginTransaction();

            if (Carbon::parse($request->first_payment_date)->isPast()) {
                DB::rollBack();
                return response()->json(['message' => 'Invalid date'], 400);
            }

            try {
                $subscription = $this->getModel()::create([
                    'title' => $request['title'],
                    'description' => $request['description'],
                    'amount' => $request['amount'],
                    'first_payment_date' =>  $request['first_payment_date'],
                    'second_payment_date' => $request['second_payment_date'],
                    'account_id' => $request->account_id,
                ]);

                if (isset($request['categories'])) {
                    $accountCategories = Account::find($request->account_id)->categories->pluck('id')->toArray();

                    if (array_diff($request['categories'], $accountCategories)) {
                        DB::rollBack();
                        return response()->json(['message' => 'Some categories do not belong to this account'], 400);
                    }

                    $subscription->categories()->attach($request['categories']);
                }

                $account = Auth::user()->accounts->find($request->account_id);
                $total_amount = $request['amount'];

                if (isset($request['second_payment_date'])) {
                    $total_amount *= 2;
                }

                $account->balance -= $total_amount;

                if ($account->balance < 0) {
                    DB::rollBack();
                    return response()->json(['message' => 'Insufficient funds'], 400);
                }

                $account->save();

                DB::commit();

                return response()->json($subscription, 200);
            } catch (\Exception $e) {
                DB::rollBack();

                return response()->json(['message' => 'Error occurred while creating subscription: ' . $e->getMessage()], 500);
            }
        }
    }

    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $subscription = $this->getModel()::find($id);

            if (!$subscription) {
                return response()->json(['message' => 'Subscription not found'], 404);
            }

            $account = Auth::user()->accounts->find($request->account_id);
            $account->balance = $account->balance + $subscription->amount - $request['amount'];

            if ($account->balance < 0) {
                DB::rollBack();
                return response()->json(['message' => 'Insufficient funds'], 400);
            }

            if (Carbon::parse($request->first_payment_date)->isPast()) {
                DB::rollBack();
                return response()->json(['message' => 'Payment date should be in the future'], 400);
            }

            $subscription->update([
                'title' => $request['title'],
                'description' => $request['description'],
                'amount' => $request['amount'],
                'first_payment_date' => $request['first_payment_date'],
                'second_payment_date' => $request['second_payment_date'],
                'account_id' => $request['account_id'],
            ]);

            if (isset($request['categories'])) {
                $accountCategories = Auth::user()->accounts->find($request->account_id)->categories->pluck('id')->toArray();

                if (array_diff($request['categories'], $accountCategories)) {
                    DB::rollBack();
                    return response()->json(['message' => 'Some categories do not belong to this account'], 400);
                }

                $subscription->categories()->sync($request['categories']);
            }

            $account->save();

            DB::commit();

            return response()->json($subscription, 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => 'Error occurred while updating subscription: ' . $e->getMessage()], 500);
        }
    }

    public function delete($id)
    {
        $subscription = $this->getModel()::find($id);

        if (!$subscription) {
            return response()->json(['message' => 'Subscription not found'], 404);
        }

        $account = $subscription->account;
        $account->balance += $subscription->amount;

        if ($subscription->second_payment_date) {
            $account->balance += $subscription->amount;
        }

        $account->save();
        $subscription->delete();

        return response()->json(['message' => 'Subscription deleted'], 200);
    }
}
