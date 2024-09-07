<?php

use App\Http\Controllers\TestingController;
use Illuminate\Support\Facades\Route;

Route::get('/__testing__/csrf-token', [TestingController::class, 'csrfToken']);
Route::get('/__testing__/current-user', [TestingController::class, 'currentUser']);
Route::post('/__testing__/login', [TestingController::class, 'login']);
Route::post('/__testing__/logout', [TestingController::class, 'logout']);
Route::post('/__testing__/model', [TestingController::class, 'create']);
