<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['message' => 'Inventory Management API'];
});
