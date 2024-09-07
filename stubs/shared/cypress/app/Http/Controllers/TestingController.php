<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestingController
{
    /**
     * Get the CSRF token value.
     */
    public function csrfToken(Request $request): JsonResponse
    {
        return response()->json($request->session()->token());
    }

    /**
     * Get the currently authenticated user.
     */
    public function currentUser(): ?User
    {
        return Auth::user();
    }

    /**
     * Find or create a user and log them into the application.
     */
    public function login(Request $request): User
    {
        $input = $request->only('attributes');

        $user = $this->findOrCreateWith('App\\Models\\User', $input['attributes']);

        Auth::login($user);

        return $user;
    }

    /**
     * Log the authenticated user out of the application.
     */
    public function logout(): void
    {
        Auth::logout();
    }

    /**
     * Create a new Eloquent factory.
     */
    public function create(Request $request): Model
    {
        $input = $request->only(['model', 'attributes']);

        return $this->findOrCreateWith($input['model'], $input['attributes']);
    }

    /**
     * Find or create a user with the given attributes.
     *
     * @param  array<string, mixed>  $attributes
     */
    private function findOrCreateWith(string $model, array $attributes): Model
    {
        if (empty($attributes)) {
            return $model::factory()->create();
        }

        return $model::firstWhere($attributes)
            ?? $model::factory()->create($attributes);
    }
}
