# 🚀 Quick Start Guide

Get your Inventory Management System running in 5 minutes!

## Prerequisites

Make sure you have:
- PHP 8.1+ (`php --version`)
- Composer (`composer --version`)
- Node.js 16+ (`node --version`)
- MySQL/MariaDB running

## Step 1: Clone & Navigate

```bash
git clone https://github.com/iusdv/Inventory-Management.git
cd Inventory-Management
```

## Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
composer install

# Create environment file
cp .env.example .env

# Edit .env and set your database credentials:
# DB_DATABASE=inventory_management
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Start backend server
php artisan serve
```

✅ Backend running at: http://localhost:8000

## Step 3: Frontend Setup (2 minutes)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

✅ Frontend running at: http://localhost:3000

## Step 4: First Login (1 minute)

1. Open http://localhost:3000 in your browser
2. Click "Register" or go to http://localhost:3000/register
3. Fill in the registration form:
   - Name: Your Name
   - Email: your@email.com
   - Password: password123
   - Confirm Password: password123
4. Click "Register"
5. You'll be automatically logged in!

## Step 5: Explore! 🎉

Now you can:
- ✅ View the Dashboard
- ✅ Manage Users
- ✅ Add Products
- ✅ Create Orders
- ✅ View Reports
- ✅ And more!

## Quick Commands Reference

### Backend
```bash
# Start backend server
cd backend && php artisan serve

# Run migrations
php artisan migrate

# Clear cache
php artisan cache:clear

# View routes
php artisan route:list
```

### Frontend
```bash
# Start frontend
cd frontend && npm start

# Build for production
npm run build

# Run tests
npm test
```

## Troubleshooting

### Issue: "composer: command not found"
Install Composer: https://getcomposer.org/download/

### Issue: "npm: command not found"
Install Node.js: https://nodejs.org/

### Issue: "Access denied for user"
Check MySQL credentials in `backend/.env`

### Issue: "Migration failed"
```bash
# Create database manually
mysql -u root -p
CREATE DATABASE inventory_management;
exit;

# Then run migrations
php artisan migrate
```

### Issue: "Port 8000 already in use"
```bash
# Use different port
php artisan serve --port=8001
```

### Issue: "Port 3000 already in use"
Kill the process or the frontend will ask to use 3001

## What's Next?

1. **Add Sample Data**
   - Create some categories
   - Add brands
   - Create products
   - Make test orders

2. **Make It Yours**
   - Update company information
   - Customize colors in `frontend/src/App.css`
   - Add your logo
   - Configure settings

3. **Learn More**
   - Read `API.md` for API documentation
   - Check `STRUCTURE.md` for architecture
   - Review `FEATURES.md` for all features

## Default Access

After registration, you can make yourself an admin:

```sql
-- Connect to MySQL
mysql -u root -p inventory_management

-- Update user role
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## Production Deployment

When ready for production:

1. Set `APP_ENV=production` in backend `.env`
2. Set `APP_DEBUG=false`
3. Run `npm run build` in frontend
4. Configure your web server (Apache/Nginx)
5. Set up SSL certificate
6. Enable proper backups

## Need Help?

- 📖 Full documentation in `README.md`
- 🔧 Detailed setup in `SETUP.md`
- 🏗️ Architecture in `STRUCTURE.md`
- 📡 API docs in `API.md`
- ✅ Features list in `FEATURES.md`
- 📊 Summary in `SUMMARY.md`

## Support

Found a bug or need help? Open an issue on GitHub!

---

**Happy Inventory Managing! 📦✨**
