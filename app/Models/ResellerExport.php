<?php

namespace App\Models;

use Database\Factories\ResellerExportFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResellerExport extends Model
{
    /** @use HasFactory<ResellerExportFactory> */
    use HasFactory;

    protected $fillable = ['user_id', 'status', 'file_path', 'file_name', 'total'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeLatestForUser(Builder $query, User $user): void
    {
        $query->where('user_id', $user->id)->latest('id');
    }

    public function scopeForUser(Builder $query, User $user): void
    {
        $query->where('user_id', $user->id);
    }

    public function getIsCompletedAttribute(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * @return array{id: int, status: string, total: int, download_url: string|null}
     */
    public function payload(): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'total' => $this->total,
            'download_url' => $this->is_completed && $this->file_path !== null
                ? route('resellers-export.download', $this)
                : null,
        ];
    }
}
