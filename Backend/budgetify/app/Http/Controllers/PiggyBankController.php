<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\PiggyBank;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PiggyBankController extends Controller
{
    protected function getModel()
    {
        return new PiggyBank;
    }

    public function getAll(Request $request)
    {
        $piggyBanks = $this->getModel()::where("account_id", $request->account_id)->get();

        if ($piggyBanks->isEmpty()) {
            return response()->json(["error" => "No piggy banks found"], 400);
        }

        $currency = $piggyBanks->first()->account->currency;

        return response()->json(["piggyBanks" => $piggyBanks, "currency" => $currency], 200);
    }

    public function store(Request $request)
    {
        $piggyBank = $this->getModel()::create([...$request->all(), "saved_amount" => 0]);

        return response()->json($piggyBank, 200);
    }

    public function delete(Request $request, $id)
    {
        $piggyBank = $this->getModel()::find($id);

        $account = $piggyBank->account;

        $account->balance += $piggyBank->saved_amount;
        $account->save();

        $piggyBank->delete();

        return response()->json($piggyBank, 200);
    }

    public function update(Request $request, $id)
    {
        $piggyBank = $this->getModel()::find($id);

        if (isset($request->amountToSave)) {
            $piggyBank->saved_amount += (int)$request->amountToSave;

            $account = $piggyBank->account;
            $account->balance -= (int)$request->amountToSave;

            if ($account->balance < 0) {
                return response()->json(["error" => "Insufficient funds"], 400);
            } else {
                $piggyBank->save();
                $account->save();
            }

            return response()->json($piggyBank, 200);
        }

        $piggyBank->update($request->all());

        return response()->json($piggyBank, 200);
    }

    public function crash($id)
    {
        $piggyBank = $this->getModel()::find($id);

        $account = $piggyBank->account;
        $account->balance += $piggyBank->saved_amount;
        $account->save();

        if ($piggyBank->saved_amount > 0) {
            $transaction = Transaction::create([
                'title' => $piggyBank->goal,
                'type' => "Income",
                'amount' => $piggyBank->saved_amount,
                'payment_date' => Carbon::now(),
                'account_id' => $account->id,
            ]);

            $piggyCategory = $account->categories->where("type", "Income")->where("title", "Piggy Withdrawal")->first();

            if (!$piggyCategory) {
                $piggyCategory = Category::create(
                    [
                        "title" => "Piggy Withdrawal",
                        "type" => "Income",
                        "account_id" => $account->id,
                    ]
                );
            }

            $transaction->categories()->attach($piggyCategory);
        }

        $piggyBank->delete();

        return response()->json(["message" => "Piggy Bank Crashed"], 200);
    }
}
