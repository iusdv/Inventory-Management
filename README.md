# Inventory Management System

A full-stack inventory management system built with Laravel (PHP) backend and React (JavaScript) frontend.

## Features

- **Authentication**: Login, Register, and Logout functionality
- **Dashboard**: Overview of key metrics and statistics
- **User Management**: Manage system users with different roles
- **Groups**: Organize users into groups with specific permissions
- **Brands**: Manage product brands
- **Categories**: Organize products into categories (with parent-child relationships)
- **Stores**: Manage multiple store locations
- **Attributes**: Define product attributes (colors, sizes, etc.)
- **Products**: Complete product management with inventory tracking
- **Orders**: Create and manage customer orders
- **Reports**: Sales, inventory, and revenue reports
- **Company**: Company profile management
- **Profile**: User profile settings
- **Settings**: System configuration

## Technology Stack

### Backend
- PHP 8.1+
- Laravel 11.x
- Laravel Sanctum (API Authentication)
- MySQL Database

### Frontend
- React 18.x
- React Router v6
- Axios
- CSS3

## Project Structure

```
Inventory-Management/
├── backend/              # Laravel API Backend
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   └── Models/
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   │   └── api.php
│   └── composer.json
├── frontend/            # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Copy environment file and configure:
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inventory_management
DB_USERNAME=root
DB_PASSWORD=your_password
```

5. Generate application key:
```bash
php artisan key:generate
```

6. Run migrations:
```bash
php artisan migrate
```

7. Start the development server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```bash
REACT_APP_API_URL=http://localhost:8000/api
```

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Resources (Protected)
- `GET /api/dashboard` - Dashboard statistics
- `/api/users` - User CRUD operations
- `/api/groups` - Group CRUD operations
- `/api/brands` - Brand CRUD operations
- `/api/categories` - Category CRUD operations
- `/api/stores` - Store CRUD operations
- `/api/attributes` - Attribute CRUD operations
- `/api/products` - Product CRUD operations
- `/api/orders` - Order CRUD operations
- `/api/company` - Company settings
- `/api/settings` - System settings

### Reports
- `GET /api/reports/sales` - Sales report
- `GET /api/reports/inventory` - Inventory report
- `GET /api/reports/top-products` - Top selling products
- `GET /api/reports/revenue` - Revenue over time

## Database Schema

The system includes the following main tables:
- `users` - System users
- `groups` - User groups with permissions
- `brands` - Product brands
- `categories` - Product categories (hierarchical)
- `stores` - Store locations
- `attributes` - Product attributes
- `products` - Product inventory
- `orders` - Customer orders
- `order_items` - Order line items
- `companies` - Company information
- `settings` - System settings

## Features Implementation Status

✅ Backend API complete
✅ Database migrations
✅ Authentication system
✅ Dashboard with statistics
✅ User management (full CRUD)
✅ Product management (full CRUD)
✅ Basic pages for all modules
✅ Responsive UI design

## Development

### Backend Development
```bash
# Run tests
php artisan test

# Clear cache
php artisan cache:clear
php artisan config:clear

# Create new controller
php artisan make:controller ControllerName

# Create new model with migration
php artisan make:model ModelName -m
```

### Frontend Development
```bash
# Run tests
npm test

# Build for production
npm run build

# Check for issues
npm run lint
```

## Production Deployment

### Backend
1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false` in `.env`
3. Run `php artisan config:cache`
4. Run `php artisan route:cache`
5. Set up proper web server (Apache/Nginx)

### Frontend
1. Run `npm run build`
2. Deploy the `build/` directory to your web server
3. Configure environment variables for production API URL

## License

This project is licensed under the MIT License.


