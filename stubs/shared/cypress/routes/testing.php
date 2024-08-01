<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;

Route::get('__testing__/login', function () {
    Auth::login(
        User::firstWhere('email', Request::input('email'))
            ?? User::factory()->create(Request::all())
    );
});

Route::get('__testing__/logout', function () {
    Auth::logout();
});
