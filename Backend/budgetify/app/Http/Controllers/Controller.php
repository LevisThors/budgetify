<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    abstract protected function getModel();

    public function getAll(Request $request)
    {
        if (isset($request->account_id)) {
            return $this->getModel()::where("account_id", $request->account_id)->get();
        } else {
            return $this->getModel()::where("user_id", auth()->id())->get();
        }
    }
}
