<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('piggy_banks', function (Blueprint $table) {
            $table->id();
            $table->string('goal');
            $table->decimal('goal_amount', 8, 2);
            $table->decimal('saved_amount', 8, 2)->default(0);
            $table->date('date');
            $table->foreignId('account_id')->constrained()->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('piggy_banks');
    }
};
