<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create Admin User
        User::updateOrCreate(
            ['email' => 'evrarddjob@gmail.com'],
            [
                'name' => 'Admin Evrard',
                'password' => Hash::make('8x4dfsoxpcxlmdcx'),
                'role' => 'admin',
            ]
        );

        // Create Manager User
        User::updateOrCreate(
            ['email' => 'evrard@gmail.com'],
            [
                'name' => 'Manager Evrard',
                'password' => Hash::make('fxc4vrfxwc1v'),
                'role' => 'manager',
            ]
        );
    }
}
