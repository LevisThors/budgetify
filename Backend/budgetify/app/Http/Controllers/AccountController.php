<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccountController extends Controller
{
    protected function getModel()
    {
        return new Account;
    }

    public function update(Request $request, $id)
    {
        if (Auth::user() && Auth::user()->accounts->contains($id)) {
            $account = $this->getModel()->find($id);
            $account->update($request->all());

            return response()->json(["updatedAccount" => $account], 200);
        } else {
            return response()->json(["message" => "Unauthorized"], 401);
        }
    }

    public function store(Request $request)
    {
        if (Auth::user()) {
            $account = $this->getModel()->create([
                "user_id" => Auth::id(),
                ...$request->all(),
            ]);

            return response()->json(["createdAccount" => $account], 200);
        } else {
            return response()->json(["message" => "Unauthorized"], 401);
        }
    }
}
