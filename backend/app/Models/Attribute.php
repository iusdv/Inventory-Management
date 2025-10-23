<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'values',
    ];

    protected $casts = [
        'values' => 'array',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_attribute')
                    ->withPivot('value')
                    ->withTimestamps();
    }
}
