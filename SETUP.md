# Installation and Setup Guide

This guide will help you set up and run the Inventory Management System.

## Prerequisites

### Backend Requirements
- PHP 8.1 or higher
- Composer
- MySQL 5.7+ or MariaDB 10.3+
- PHP Extensions:
  - OpenSSL
  - PDO
  - Mbstring
  - Tokenizer
  - XML
  - Ctype
  - JSON
  - BCMath

### Frontend Requirements
- Node.js 16+ and npm
- Modern web browser

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/iusdv/Inventory-Management.git
cd Inventory-Management
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
composer install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env file
# Edit the following lines:
DB_DATABASE=inventory_management
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password

# Run migrations to create database tables
php artisan migrate

# Start the development server
php artisan serve
```

The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will open automatically at `http://localhost:3000`

## Creating Your First Admin User

Since there's no seeder yet, you'll need to register your first user:

1. Open `http://localhost:3000/register`
2. Fill in the registration form
3. After registration, you'll be automatically logged in

To make your user an admin, you can update the database directly:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## Testing the Application

1. **Login**: Navigate to `http://localhost:3000/login` and use your credentials
2. **Dashboard**: After login, you'll see the dashboard with statistics
3. **Navigation**: Use the sidebar to navigate between different modules
4. **CRUD Operations**: Try adding products, users, or other entities

## Common Issues and Solutions

### Issue: Composer install fails
**Solution**: Make sure you have PHP 8.1+ installed and all required PHP extensions

### Issue: Migration fails
**Solution**: 
- Check your database credentials in `.env`
- Make sure MySQL is running
- Create the database manually if it doesn't exist:
  ```sql
  CREATE DATABASE inventory_management;
  ```

### Issue: CORS errors in frontend
**Solution**: 
- Make sure the backend is running on port 8000
- Check that CORS is properly configured in `backend/config/cors.php`

### Issue: npm install fails
**Solution**: 
- Make sure you have Node.js 16+ installed
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

## Production Deployment

### Backend Deployment

1. Set up your production server with PHP, Composer, and MySQL
2. Clone the repository to your server
3. Install dependencies: `composer install --optimize-autoloader --no-dev`
4. Set up your `.env` file with production settings:
   ```
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://yourdomain.com
   ```
5. Generate key: `php artisan key:generate`
6. Run migrations: `php artisan migrate --force`
7. Cache config: `php artisan config:cache`
8. Cache routes: `php artisan route:cache`
9. Set up your web server (Apache/Nginx) to point to `public/index.php`

### Frontend Deployment

1. Update the API URL in your frontend `.env`:
   ```
   REACT_APP_API_URL=https://yourdomain.com/api
   ```
2. Build the production bundle: `npm run build`
3. Deploy the `build/` directory to your static hosting or web server

## Additional Configuration

### Email Configuration
To enable email features, configure your mail settings in `.env`:
```
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
```

### File Storage
For file uploads (logos, images), configure your storage in `.env`:
```
FILESYSTEM_DISK=local
# or for S3
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=
AWS_BUCKET=
```

## Development Tips

- Use `php artisan route:list` to see all available API routes
- Use `php artisan tinker` for interactive PHP console
- Frontend API calls are automatically proxied to the backend via the `proxy` setting in `package.json`
- Check browser console and Network tab for debugging frontend issues
- Check `storage/logs/laravel.log` for backend errors

## Need Help?

- Check the main README.md for API documentation
- Review the code in `backend/routes/api.php` for available endpoints
- Examine controller files for API implementation details
- Look at React components in `frontend/src/pages/` for frontend features

## Next Steps

After successful installation:
1. Explore the dashboard
2. Create some test data (brands, categories, products)
3. Try creating orders
4. Check out the reports section
5. Customize the application to your needs
