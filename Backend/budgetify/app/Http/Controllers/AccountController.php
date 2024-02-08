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
        $user = Auth::user();
        if ($user && $user->accounts->contains($id)) {
            $account = $this->getModel()->find($id);

            if ($request->has('title')) {
                $newTitle = strtolower($request->title);

                if ($user->accounts->where('id', '!=', $id)->filter(function ($account) use ($newTitle) {
                    return strtolower($account->title) === $newTitle;
                })->count() > 0) {
                    return response()->json(["message" => "Account with such name already exists"], 400);
                }
            }

            $account->update($request->all());

            return response()->json(["updatedAccount" => $account], 200);
        } else {
            return response()->json(["message" => "Unauthorized"], 401);
        }
    }

    public function delete($id)
    {
        $user = Auth::user();
        if ($user && $user->accounts->contains($id)) {
            $account = $this->getModel()->find($id);
            $account->delete();

            return response()->json(["message" => "Account has been deleted"], 200);
        } else {
            return response()->json(["message" => "Unauthorized"], 401);
        }
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $newTitle = strtolower($request->title);

        if ($user) {
            if ($user->accounts->filter(function ($account) use ($newTitle) {
                return strtolower($account->title) === $newTitle;
            })->count() > 0) {
                return response()->json(["message" => "Account with such name already exists"], 400);
            }

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
