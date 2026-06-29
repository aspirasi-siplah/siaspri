<?php

namespace App\Providers;

use App\Services\Analytics\AnalyticsServiceInterface;
use App\Services\Analytics\FakeAnalyticsService;
use App\Services\Analytics\GoogleAnalyticsService;
use App\Services\Analytics\UnavailableAnalyticsService;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Spatie\Analytics\AnalyticsServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (app()->environment('local')) {
            $this->app->singleton(
                AnalyticsServiceInterface::class,
                FakeAnalyticsService::class
            );
        } elseif ($this->analyticsIsConfigured()) {
            $this->app->register(AnalyticsServiceProvider::class);

            $this->app->singleton(
                AnalyticsServiceInterface::class,
                GoogleAnalyticsService::class
            );
        } else {
            $this->app->singleton(
                AnalyticsServiceInterface::class,
                UnavailableAnalyticsService::class
            );
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    protected function analyticsIsConfigured(): bool
    {
        $propertyId = config('analytics.property_id');
        $credentials = config('analytics.service_account_credentials_json');

        if (blank($propertyId)) {
            return false;
        }

        if (is_array($credentials)) {
            return $credentials !== [];
        }

        return is_string($credentials) && $credentials !== '' && is_file($credentials);
    }
}
