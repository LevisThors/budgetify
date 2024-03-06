<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\PiggyBankController;
use App\Http\Controllers\ObligatoryController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::middleware("web")->group(function () {
    // Guest Routes
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);
    Route::post('/logout', [UserController::class, 'logout']);

    // User Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', [UserController::class, 'get']);

        Route::get('/categories', [CategoryController::class, 'getAll']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::delete('/categories/{id}', [CategoryController::class, 'delete']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::get('/categories/statistics', [CategoryController::class, 'getStatistics']);
        Route::get('/categories/monthly_statistics', [CategoryController::class, 'getMonthlyStatistics']);

        Route::get('/transactions', [TransactionController::class, 'getAll']);
        Route::put('/transactions/{id}', [TransactionController::class, 'update']);
        Route::delete('/transactions/{id}', [TransactionController::class, 'delete']);
        Route::post('/transactions', [TransactionController::class, 'store']);
        Route::get('/transactions/download/{path?}', [TransactionController::class, 'downloadDocument']);

        Route::get('/subscriptions', [SubscriptionController::class, 'getAll']);
        Route::put('/subscriptions/{id}', [SubscriptionController::class, 'update']);
        Route::delete('/subscriptions/{id}', [SubscriptionController::class, 'delete']);
        Route::post('/subscriptions', [SubscriptionController::class, 'store']);

        Route::get('/accounts', [AccountController::class, 'getAll']);
        Route::put('/accounts/{id}', [AccountController::class, 'update']);
        Route::delete('/accounts/{id}', [AccountController::class, 'delete']);
        Route::post('/accounts', [AccountController::class, 'store']);

        Route::get('/piggy-banks', [PiggyBankController::class, 'getAll']);
        Route::put('/piggy-banks/{id}', [PiggyBankController::class, 'update']);
        Route::delete('/piggy-banks/{id}', [PiggyBankController::class, 'delete']);
        Route::post('/piggy-banks/{id}/crash', [PiggyBankController::class, 'crash']);
        Route::post('/piggy-banks', [PiggyBankController::class, 'store']);

        Route::get('/obligatories', [ObligatoryController::class, 'getAll']);
        Route::put('/obligatories/{id}', [ObligatoryController::class, 'update']);
        Route::delete('/obligatories/{id}', [ObligatoryController::class, 'delete']);
        Route::post('/obligatories', [ObligatoryController::class, 'store']);
    });
});
