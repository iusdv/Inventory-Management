<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'manager',
        'code',
        'address',
        'city',
        'state',
        'zip',
        'phone',
        'email',
        'status',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_store')
                    ->withPivot('quantity', 'price')
                    ->withTimestamps();
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
