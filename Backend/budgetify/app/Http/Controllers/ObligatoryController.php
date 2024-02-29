<?php

namespace App\Http\Controllers;

use App\Models\Obligatory;
use Illuminate\Http\Request;
use App\Models\Account;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ObligatoryController extends Controller
{
    protected function getModel()
    {
        return new Obligatory;
    }

    public function getAll(Request $request)
    {
        if (is_numeric($request->account_id)) {
            $query = $this->getModel()::where('account_id', $request['account_id']);

            if (isset($request->type)) {
                $query->where('type', $request->type);
            }

            if (isset($request['query'])) {
                $searchTerm = '%' . $request['query'] . '%';
                $query->where('title', 'like', $searchTerm)
                    ->orWhere('description', 'like', $searchTerm);
            }

            if (isset($request['sort'])) {
                [$column, $direction] = explode('-', $request['sort']);
                $query->orderBy($column, $direction);
            } else {
                $query->orderBy('created_at', 'desc');
            }

            $obligatories = $query->get();

            if ($obligatories->count() == 0) {
                return response()->json(['message' => 'Empty account'], 200);
            }

            return response()->json(
                [
                    'obligatories' => $obligatories,
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

            Log::info($request->all());

            if (Carbon::parse($request->first_payment_date)->isPast()) {
                DB::rollBack();
                return response()->json(['message' => 'Invalid date'], 400);
            }

            try {
                $obligatory = $this->getModel()::create([
                    'title' => $request['title'],
                    'description' => $request['description'],
                    'amount' => $request['amount'],
                    'first_payment_date' =>  $request['first_payment_date'],
                    'second_payment_date' => $request['second_payment_date'],
                    'account_id' => $request->account_id,
                ]);

                $account = Auth::user()->accounts->find($request->account_id);

                if ($account->balance < 0) {
                    DB::rollBack();
                    return response()->json(['message' => 'Insufficient funds'], 400);
                }

                DB::commit();

                return response()->json($obligatory, 200);
            } catch (\Exception $e) {
                DB::rollBack();

                return response()->json(['message' => 'Error occurred while creating obligatory: ' . $e->getMessage()], 500);
            }
        }
    }

    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $obligatory = $this->getModel()::find($id);

            if (!$obligatory) {
                return response()->json(['message' => 'Obligatory not found'], 404);
            }

            $account = Auth::user()->accounts->find($request->account_id);

            if ($account->balance < 0) {
                DB::rollBack();
                return response()->json(['message' => 'Insufficient funds'], 400);
            }

            if (Carbon::parse($request->first_payment_date)->isPast()) {
                DB::rollBack();
                return response()->json(['message' => 'Payment date should be in the future'], 400);
            }

            $obligatory->update([
                'title' => $request['title'],
                'description' => $request['description'],
                'amount' => $request['amount'],
                'first_payment_date' => $request['first_payment_date'],
                'second_payment_date' => $request['second_payment_date'],
                'account_id' => $request['account_id'],
            ]);

            $account->save();

            DB::commit();

            return response()->json($obligatory, 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => 'Error occurred while updating obligatory: ' . $e->getMessage()], 500);
        }
    }

    public function delete($id)
    {
        $obligatory = $this->getModel()::find($id);

        if (!$obligatory) {
            return response()->json(['message' => 'Obligatory not found'], 404);
        }

        $obligatory->delete();

        return response()->json(['message' => 'Obligatory deleted'], 200);
    }
}
