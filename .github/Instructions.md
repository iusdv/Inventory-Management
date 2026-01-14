# Inventory Management System - AI Agent Instructions

## Architecture Overview

This is a full-stack **Laravel + React** inventory management system with strict API-based separation:
- **Backend** (`backend/`): Laravel 11 REST API (port 8000) with Sanctum token authentication
- **Frontend** (`frontend/`): React 18 SPA (port 3000) with React Router v6
- **Database**: MySQL with Eloquent ORM

## Key Development Patterns

### Backend (Laravel)

**API-Only Architecture**: All routes in `routes/api.php` are prefixed with `/api`. Controllers return JSON exclusively.

**Authentication Flow**: 
- Public routes: `/api/register` and `/api/login` issue Sanctum bearer tokens
- Protected routes: All wrapped in `auth:sanctum` middleware (see [routes/api.php](../backend/routes/api.php))
- Token stored client-side in `localStorage` and sent via `Authorization: Bearer {token}` header

**Controller Pattern**: Simple resourceful controllers without custom response transformers:
```php
// Example: ProductController returns models directly with eager loading
public function index() {
    $products = Product::with(['category', 'brand', 'stores', 'attributes'])->get();
    return response()->json($products);
}
```

**Model Relationships**: Heavy use of many-to-many pivot tables:
- Products ↔ Stores: `product_store` pivot with `quantity`, `price`
- Products ↔ Attributes: `product_attribute` pivot with `value`
- Categories: Self-referencing with `parent_id` for hierarchical structure

**Validation**: Inline in controllers using `$request->validate()`. No form requests used yet.

### Frontend (React)

**Authentication Service** (`src/services/authService.js`):
- Manages token and user in localStorage
- `isAuthenticated()` used by `PrivateRoute` component for route protection

**API Client** (`src/services/api.js`):
- Axios instance with base URL `http://localhost:8000/api`
- Interceptors: Auto-inject Bearer token, auto-redirect to `/login` on 401 responses
- **Proxy**: `package.json` includes `"proxy": "http://localhost:8000"` (note: not actively used, direct URLs preferred)

**Page Pattern**: All CRUD pages follow the same structure (see [Products.js](../frontend/src/pages/Products.js)):
1. Multiple `useState` hooks for data, modal, form state
2. `useEffect` calls `fetchData()` which uses `Promise.all()` to load related resources (categories, brands, etc.)
3. Inline modals for create/edit forms
4. `handleSubmit` conditionally POSTs or PUTs based on `editingProduct` state

**Routing**: App structure in [App.js](../frontend/src/App.js):
- Public routes: `/login`, `/register`
- Protected routes: All nested under `<PrivateRoute>` with `Sidebar` + `Navbar` layout
- Default redirect: `/` → `/dashboard`

## Critical Workflows

### Development Setup

**Backend** (from `backend/`):
```bash
composer install
cp .env.example .env  # Configure DB credentials
php artisan key:generate
php artisan migrate
php artisan serve     # Runs on http://localhost:8000
```

**Frontend** (from `frontend/`):
```bash
npm install
npm start             # Runs on http://localhost:3000
```

**First Admin User**: No seeders exist. Register via UI, then manually update DB:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### Testing

**Backend**: PHPUnit configured (`phpunit.xml` present) but no test files exist yet in `tests/`.

**Frontend**: Jest + React Testing Library configured but no tests implemented.

## Project-Specific Conventions

- **No API Versioning**: All endpoints at `/api/{resource}` without `/v1/` prefix
- **Direct Model Returns**: Controllers serialize Eloquent models/collections directly without DTOs or transformers
- **Boolean Status Fields**: Most resources have `status` boolean (active/inactive) instead of enum states
- **SKU Uniqueness**: Products require unique `sku` field with validation
- **Inline Validation**: No FormRequest classes; validation rules duplicated in `store()` and `update()` methods
- **LocalStorage Auth**: Token persistence via localStorage (no cookie-based auth)
- **No TypeScript**: Plain JavaScript with no type checking in frontend
- **Vite in Dependencies**: `vite` present in `frontend/devDependencies` but project uses `react-scripts` (Create React App) as primary build tool

## Database Migrations

All migrations timestamped `2024_01_01_*` for ordering. Key tables:
- `groups`, `users` (with `group_id` FK)
- `brands`, `categories` (self-referencing), `stores`, `attributes`
- `products` with FKs to category/brand
- `product_store`, `product_attribute` pivot tables
- `orders`, `order_items`

## Known Limitations

- No role-based permission system implemented (only `role` column on users)
- No image upload handling (image field stores strings, not files)
- Reports endpoints exist but implementation may be basic
- No pagination implemented (all index endpoints return full collections)
- Error messages not internationalized

## When Adding Features

1. **Backend**: Add route in `api.php` → Create/update controller → Validate inline → Return JSON
2. **Frontend**: Add route in `App.js` → Create page with useState/useEffect pattern → Use `api.js` for requests
3. **Database**: Create migration with `php artisan make:migration`, add to model `$fillable`, define relationships
4. **Related Resources**: Always eager-load relationships in controller index methods (e.g., `->with(['category', 'brand'])`)
