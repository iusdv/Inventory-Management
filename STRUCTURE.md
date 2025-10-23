# Project Structure Overview

## Complete Inventory Management System

This document provides an overview of the project structure and components.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Port 3000)                │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Login/     │  │  Dashboard   │  │   Products   │      │
│  │   Register   │  │   (Stats)    │  │   (CRUD)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Users     │  │    Orders    │  │   Reports    │      │
│  │   (CRUD)     │  │   (CRUD)     │  │  (Analytics) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────┐      │
│  │  Groups, Brands, Categories, Stores, Attributes  │      │
│  │  Company, Profile, Settings                       │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │ (JWT Authentication)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Laravel API Backend (Port 8000)            │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    API Routes                        │   │
│  │  /api/login, /api/register, /api/logout            │   │
│  │  /api/dashboard, /api/users, /api/products         │   │
│  │  /api/orders, /api/reports, etc.                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                               │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Controllers                        │   │
│  │  AuthController, UserController, ProductController  │   │
│  │  OrderController, DashboardController, etc.         │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                               │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                      Models                          │   │
│  │  User, Product, Order, Category, Brand, Store, etc. │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      MySQL Database                          │
│                                                               │
│  Tables: users, products, orders, categories, brands,       │
│  stores, attributes, groups, companies, settings, etc.      │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
Inventory-Management/
│
├── backend/                         # Laravel API Backend
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/        # API Controllers
│   │   │       ├── AuthController.php
│   │   │       ├── UserController.php
│   │   │       ├── ProductController.php
│   │   │       ├── OrderController.php
│   │   │       ├── DashboardController.php
│   │   │       ├── ReportController.php
│   │   │       ├── BrandController.php
│   │   │       ├── CategoryController.php
│   │   │       ├── StoreController.php
│   │   │       ├── AttributeController.php
│   │   │       ├── GroupController.php
│   │   │       ├── CompanyController.php
│   │   │       └── SettingController.php
│   │   │
│   │   └── Models/                 # Eloquent Models
│   │       ├── User.php
│   │       ├── Product.php
│   │       ├── Order.php
│   │       ├── OrderItem.php
│   │       ├── Category.php
│   │       ├── Brand.php
│   │       ├── Store.php
│   │       ├── Attribute.php
│   │       ├── Group.php
│   │       ├── Company.php
│   │       └── Setting.php
│   │
│   ├── database/
│   │   └── migrations/             # Database Migrations
│   │       ├── 2024_01_01_000001_create_groups_table.php
│   │       ├── 2024_01_01_000002_create_users_table.php
│   │       ├── 2024_01_01_000003_create_brands_table.php
│   │       ├── 2024_01_01_000004_create_categories_table.php
│   │       ├── 2024_01_01_000005_create_stores_table.php
│   │       ├── 2024_01_01_000006_create_attributes_table.php
│   │       ├── 2024_01_01_000007_create_products_table.php
│   │       ├── 2024_01_01_000008_create_product_pivot_tables.php
│   │       ├── 2024_01_01_000009_create_orders_table.php
│   │       ├── 2024_01_01_000010_create_order_items_table.php
│   │       ├── 2024_01_01_000011_create_companies_table.php
│   │       ├── 2024_01_01_000012_create_settings_table.php
│   │       └── 2024_01_01_000013_create_personal_access_tokens_table.php
│   │
│   ├── routes/
│   │   ├── api.php                 # API Routes
│   │   ├── web.php                 # Web Routes
│   │   └── console.php             # Console Routes
│   │
│   ├── config/                     # Configuration Files
│   │   ├── app.php
│   │   ├── database.php
│   │   ├── cors.php
│   │   └── sanctum.php
│   │
│   ├── bootstrap/
│   │   └── app.php                 # Application Bootstrap
│   │
│   ├── public/
│   │   └── index.php               # Entry Point
│   │
│   ├── composer.json               # PHP Dependencies
│   └── .env.example                # Environment Template
│
├── frontend/                       # React Frontend
│   ├── public/
│   │   └── index.html              # HTML Template
│   │
│   ├── src/
│   │   ├── components/             # Reusable Components
│   │   │   ├── Sidebar.js
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   │
│   │   ├── pages/                  # Page Components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Users.js
│   │   │   ├── Products.js
│   │   │   └── index.js            # Other pages
│   │   │
│   │   ├── services/               # API Services
│   │   │   ├── api.js              # Axios Configuration
│   │   │   └── authService.js      # Authentication Service
│   │   │
│   │   ├── App.js                  # Main App Component
│   │   ├── App.css                 # Global Styles
│   │   └── index.js                # Entry Point
│   │
│   └── package.json                # Node Dependencies
│
├── README.md                       # Main Documentation
├── SETUP.md                        # Setup Instructions
└── .gitignore                      # Git Ignore Rules
```

## Database Schema

### Core Tables

1. **users** - System users with roles
   - id, name, email, password, role, group_id, phone, address, status

2. **groups** - User groups with permissions
   - id, name, description, permissions (JSON)

3. **products** - Product inventory
   - id, name, sku, description, category_id, brand_id, price, cost, quantity, min_quantity, max_quantity, image, status

4. **categories** - Hierarchical product categories
   - id, name, description, parent_id, status

5. **brands** - Product brands
   - id, name, description, logo, status

6. **stores** - Store locations
   - id, name, code, address, city, state, zip, phone, email, status

7. **attributes** - Product attributes
   - id, name, type, values (JSON)

8. **orders** - Customer orders
   - id, order_number, user_id, store_id, customer_name, customer_email, customer_phone, customer_address, subtotal, tax, discount, total, payment_method, payment_status, order_status, notes

9. **order_items** - Order line items
   - id, order_id, product_id, quantity, price, total

10. **companies** - Company information
    - id, name, email, phone, address, city, state, zip, country, logo, website, tax_id

11. **settings** - System settings
    - id, key, value (JSON), type, group

### Pivot Tables

- **product_store** - Many-to-many relationship between products and stores
- **product_attribute** - Many-to-many relationship between products and attributes

## Features

### Implemented Features ✅

1. **Authentication System**
   - User registration with validation
   - User login with JWT tokens
   - Logout functionality
   - Protected routes
   - Token-based API authentication

2. **Dashboard**
   - Statistics overview (total products, orders, users, revenue)
   - Recent orders list
   - Low stock products alert
   - Top selling products
   - Order status breakdown

3. **User Management**
   - List all users with pagination
   - Create new users with role assignment
   - Edit user information
   - Delete users
   - User status management

4. **Product Management**
   - List all products with details
   - Create products with SKU, pricing, and inventory
   - Edit product information
   - Delete products
   - Category and brand associations
   - Stock quantity tracking

5. **Order Management**
   - Create new orders with multiple items
   - Calculate subtotal, tax, and total
   - Order status tracking
   - Payment status management
   - Customer information capture

6. **Reports**
   - Sales reports with date filters
   - Inventory reports
   - Top products analysis
   - Revenue over time

7. **Additional Modules** (Basic structure ready)
   - Groups management
   - Brands management
   - Categories management
   - Stores management
   - Attributes management
   - Company settings
   - System settings
   - User profile

### API Endpoints

All endpoints are RESTful and follow Laravel conventions:

- **GET** `/api/resource` - List all
- **POST** `/api/resource` - Create new
- **GET** `/api/resource/{id}` - Get single
- **PUT/PATCH** `/api/resource/{id}` - Update
- **DELETE** `/api/resource/{id}` - Delete

### Authentication Flow

1. User registers or logs in
2. Backend generates JWT token using Laravel Sanctum
3. Frontend stores token in localStorage
4. Token is included in all subsequent API requests
5. Backend validates token on protected routes
6. User can logout to invalidate token

### Frontend Routing

- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Dashboard (protected)
- `/users` - Users management (protected)
- `/products` - Products management (protected)
- `/orders` - Orders management (protected)
- `/reports` - Reports (protected)
- And more...

## Technology Highlights

### Backend (Laravel)
- **Laravel Sanctum** for API authentication
- **Eloquent ORM** for database operations
- **Resource Controllers** for RESTful APIs
- **Migration System** for database versioning
- **Validation** for input sanitization
- **CORS** enabled for frontend communication

### Frontend (React)
- **React Router** for client-side routing
- **Axios** for HTTP requests
- **Context/State Management** via hooks
- **Protected Routes** for authenticated pages
- **Responsive Design** with custom CSS
- **Form Handling** with validation

## Security Features

1. Password hashing using bcrypt
2. JWT token-based authentication
3. CORS configuration
4. Input validation on backend
5. SQL injection prevention via Eloquent ORM
6. XSS protection
7. CSRF token handling

## Next Steps for Development

1. Install dependencies (`composer install`, `npm install`)
2. Configure database in `.env`
3. Run migrations (`php artisan migrate`)
4. Start backend (`php artisan serve`)
5. Start frontend (`npm start`)
6. Register first user
7. Start using the system!

## Customization Ideas

- Add image upload for products and brands
- Implement advanced filtering and search
- Add email notifications for orders
- Create printable invoices
- Add barcode generation for products
- Implement role-based permissions
- Add multi-language support
- Create mobile app version
- Add real-time notifications
- Implement advanced analytics

---

**Built with ❤️ using Laravel and React**
