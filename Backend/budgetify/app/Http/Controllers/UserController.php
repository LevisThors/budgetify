<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getModel()
    {
        return new User;
    }

    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        $user = new User([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        if ($user->save()) {
            Auth::login($user);
            return response()->json(['message' => 'Registration successful'], 200);
        } else {
            return response()->json(['message' => 'Registration failed'], 500);
        }
    }

    public function registerAdmin(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:users',
            'gender' => 'required',
            'date_of_birth' => 'required',
            'country' => 'required',
            'password' => 'required|string|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        $admin = Admin::create([
            'date_of_birth' => $request->input('date_of_birth'),
            'gender' => $request->input('gender'),
            'country' => $request->input('country'),
            'user_id' => $user->id,
        ]);

        return response()->json(['message' => 'Admin registered successfully'], 200);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return response()->json(['message' => 'Logged in'], 200);
        }

        return response()->json(['message' => 'Invalid credentials.'], 401);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out'], 200);
    }

    public function get(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            return response()->json(
                [
                    "firstName" => $user->first_name,
                    "lastName" => $user->last_name
                ],
                200
            );
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }
}
