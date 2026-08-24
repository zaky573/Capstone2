<?php

namespace App\Providers;

use App\Models\Perwalian;
use App\Policies\PerwalianPolicy;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\Gate::policy(Perwalian::class, PerwalianPolicy::class);
    }
}
