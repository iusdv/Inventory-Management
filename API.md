# API Documentation

Complete API documentation for the Inventory Management System.

## Base URL

```
http://localhost:8000/api
```

## Authentication

The API uses Laravel Sanctum for token-based authentication. Include the token in the Authorization header:

```
Authorization: Bearer {your-token}
```

## Response Format

All responses are in JSON format:

```json
{
  "data": {},
  "message": "Success",
  "status": 200
}
```

Error responses:

```json
{
  "message": "Error description",
  "errors": {},
  "status": 400
}
```

---

## Authentication Endpoints

### Register User

**POST** `/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response:**
```json
{
  "access_token": "1|abc123...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login

**POST** `/login`

Authenticate a user and receive an access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "1|abc123...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Logout

**POST** `/logout` (Protected)

Invalidate the current access token.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Get Current User

**GET** `/user` (Protected)

Get the authenticated user's information.

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "group_id": null,
  "phone": "+1234567890",
  "address": "123 Main St",
  "status": true
}
```

---

## Dashboard Endpoint

### Get Dashboard Data

**GET** `/dashboard` (Protected)

Get dashboard statistics and data.

**Response:**
```json
{
  "stats": {
    "totalProducts": 150,
    "totalOrders": 45,
    "totalUsers": 12,
    "totalRevenue": 45678.90
  },
  "lowStockProducts": [...],
  "recentOrders": [...],
  "ordersByStatus": [...],
  "topProducts": [...]
}
```

---

## Users Endpoints

### List Users

**GET** `/users` (Protected)

Get a list of all users.

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "group_id": 1,
    "phone": "+1234567890",
    "address": "123 Main St",
    "status": true,
    "group": {
      "id": 1,
      "name": "Administrators"
    }
  }
]
```

### Create User

**POST** `/users` (Protected)

Create a new user.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "user",
  "group_id": 2,
  "phone": "+1234567891",
  "address": "456 Oak St",
  "status": true
}
```

### Get User

**GET** `/users/{id}` (Protected)

Get a specific user by ID.

### Update User

**PUT** `/users/{id}` (Protected)

Update a user's information.

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "email": "jane.smith@example.com",
  "role": "manager",
  "phone": "+1234567891",
  "status": true
}
```

### Delete User

**DELETE** `/users/{id}` (Protected)

Delete a user.

---

## Products Endpoints

### List Products

**GET** `/products` (Protected)

Get a list of all products with their relationships.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "sku": "PROD-001",
    "description": "Product description",
    "category_id": 1,
    "brand_id": 1,
    "price": 99.99,
    "cost": 50.00,
    "quantity": 100,
    "min_quantity": 10,
    "max_quantity": 500,
    "image": null,
    "status": true,
    "category": {...},
    "brand": {...}
  }
]
```

### Create Product

**POST** `/products` (Protected)

Create a new product.

**Request Body:**
```json
{
  "name": "New Product",
  "sku": "PROD-002",
  "description": "Product description",
  "category_id": 1,
  "brand_id": 1,
  "price": 149.99,
  "cost": 75.00,
  "quantity": 50,
  "min_quantity": 5,
  "max_quantity": 200,
  "status": true
}
```

### Get Product

**GET** `/products/{id}` (Protected)

Get a specific product with all its relationships.

### Update Product

**PUT** `/products/{id}` (Protected)

Update a product's information.

### Delete Product

**DELETE** `/products/{id}` (Protected)

Delete a product.

---

## Orders Endpoints

### List Orders

**GET** `/orders` (Protected)

Get a list of all orders.

**Response:**
```json
[
  {
    "id": 1,
    "order_number": "ORD-1234567890-1234",
    "user_id": 1,
    "store_id": 1,
    "customer_name": "Customer Name",
    "customer_email": "customer@example.com",
    "customer_phone": "+1234567890",
    "customer_address": "123 Customer St",
    "subtotal": 199.98,
    "tax": 19.99,
    "discount": 0.00,
    "total": 219.97,
    "payment_method": "cash",
    "payment_status": "paid",
    "order_status": "completed",
    "notes": "Order notes",
    "order_items": [...]
  }
]
```

### Create Order

**POST** `/orders` (Protected)

Create a new order.

**Request Body:**
```json
{
  "customer_name": "Customer Name",
  "customer_email": "customer@example.com",
  "customer_phone": "+1234567890",
  "customer_address": "123 Customer St",
  "store_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 99.99
    }
  ],
  "payment_method": "cash",
  "payment_status": "paid",
  "notes": "Optional notes"
}
```

### Get Order

**GET** `/orders/{id}` (Protected)

Get a specific order with all items.

### Update Order

**PUT** `/orders/{id}` (Protected)

Update an order (mainly status updates).

**Request Body:**
```json
{
  "payment_status": "paid",
  "order_status": "completed",
  "notes": "Updated notes"
}
```

### Delete Order

**DELETE** `/orders/{id}` (Protected)

Delete an order.

---

## Categories Endpoints

### List Categories

**GET** `/categories` (Protected)

Get all categories with parent-child relationships.

### Create Category

**POST** `/categories` (Protected)

**Request Body:**
```json
{
  "name": "Electronics",
  "description": "Electronic items",
  "parent_id": null,
  "status": true
}
```

### Get Category

**GET** `/categories/{id}` (Protected)

### Update Category

**PUT** `/categories/{id}` (Protected)

### Delete Category

**DELETE** `/categories/{id}` (Protected)

---

## Brands Endpoints

### List Brands

**GET** `/brands` (Protected)

### Create Brand

**POST** `/brands` (Protected)

**Request Body:**
```json
{
  "name": "Brand Name",
  "description": "Brand description",
  "logo": "logo-url",
  "status": true
}
```

### Get Brand

**GET** `/brands/{id}` (Protected)

### Update Brand

**PUT** `/brands/{id}` (Protected)

### Delete Brand

**DELETE** `/brands/{id}` (Protected)

---

## Stores Endpoints

### List Stores

**GET** `/stores` (Protected)

### Create Store

**POST** `/stores` (Protected)

**Request Body:**
```json
{
  "name": "Store Name",
  "code": "STORE-001",
  "address": "123 Store St",
  "city": "City",
  "state": "State",
  "zip": "12345",
  "phone": "+1234567890",
  "email": "store@example.com",
  "status": true
}
```

### Get Store

**GET** `/stores/{id}` (Protected)

### Update Store

**PUT** `/stores/{id}` (Protected)

### Delete Store

**DELETE** `/stores/{id}` (Protected)

---

## Groups Endpoints

### List Groups

**GET** `/groups` (Protected)

### Create Group

**POST** `/groups` (Protected)

**Request Body:**
```json
{
  "name": "Managers",
  "description": "Manager user group",
  "permissions": ["read", "write", "delete"]
}
```

### Get Group

**GET** `/groups/{id}` (Protected)

### Update Group

**PUT** `/groups/{id}` (Protected)

### Delete Group

**DELETE** `/groups/{id}` (Protected)

---

## Attributes Endpoints

### List Attributes

**GET** `/attributes` (Protected)

### Create Attribute

**POST** `/attributes` (Protected)

**Request Body:**
```json
{
  "name": "Color",
  "type": "select",
  "values": ["Red", "Blue", "Green"]
}
```

### Get Attribute

**GET** `/attributes/{id}` (Protected)

### Update Attribute

**PUT** `/attributes/{id}` (Protected)

### Delete Attribute

**DELETE** `/attributes/{id}` (Protected)

---

## Company Endpoints

### Get Company Info

**GET** `/company` (Protected)

### Create/Update Company

**POST** `/company` (Protected)

**Request Body:**
```json
{
  "name": "Company Name",
  "email": "company@example.com",
  "phone": "+1234567890",
  "address": "123 Company St",
  "city": "City",
  "state": "State",
  "zip": "12345",
  "country": "USA",
  "logo": "logo-url",
  "website": "https://company.com",
  "tax_id": "123456789"
}
```

### Update Company

**PUT** `/company/{id}` (Protected)

---

## Settings Endpoints

### List Settings

**GET** `/settings` (Protected)

Returns a key/value object used by the frontend Settings page.

**Response:**
```json
{
  "emailNotifications": true,
  "lowStockAlerts": true,
  "orderNotifications": true,
  "currency": "USD",
  "dateFormat": "MM/DD/YYYY",
  "timezone": "ET",
  "autoUpdateStock": true,
  "showOutOfStockItems": false
}
```

### Bulk Update Settings (Recommended)

**PUT** `/settings` (Protected)

Upserts settings in one request (for frontend).

**Request Body:**
```json
{
  "emailNotifications": true,
  "lowStockAlerts": true,
  "orderNotifications": true,
  "currency": "USD",
  "dateFormat": "MM/DD/YYYY",
  "timezone": "ET",
  "autoUpdateStock": true,
  "showOutOfStockItems": false
}
```

**Response:** Same format as `GET /settings`.

**cURL Example:**
```bash
curl -X PUT http://localhost:8000/api/settings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "emailNotifications": true,
    "lowStockAlerts": true,
    "orderNotifications": true,
    "currency": "USD",
    "dateFormat": "MM/DD/YYYY",
    "timezone": "ET",
    "autoUpdateStock": true,
    "showOutOfStockItems": false
  }'
```

### Create Setting

**POST** `/settings` (Protected)

**Request Body:**
```json
{
  "key": "site_name",
  "value": "My Inventory",
  "type": "string",
  "group": "general"
}
```

### Get Setting

**GET** `/settings/{key}` (Protected)

### Update Setting

**PUT** `/settings/{key}` (Protected)

### Delete Setting

**DELETE** `/settings/{key}` (Protected)

---

## Reports Endpoints

### Sales Report

**GET** `/reports/sales` (Protected)

Get sales report with optional filters.

**Query Parameters:**
- `start_date` (optional): YYYY-MM-DD
- `end_date` (optional): YYYY-MM-DD
- `store_id` (optional): Store ID

**Response:**
```json
{
  "orders": [...],
  "summary": {
    "totalSales": 12345.67,
    "totalOrders": 45,
    "averageOrderValue": 274.35
  }
}
```

### Inventory Report

**GET** `/reports/inventory` (Protected)

Get inventory report with optional filters.

**Query Parameters:**
- `category_id` (optional)
- `brand_id` (optional)
- `low_stock` (optional): boolean

**Response:**
```json
{
  "products": [...],
  "summary": {
    "totalProducts": 150,
    "totalValue": 75000.00,
    "lowStockCount": 12
  }
}
```

### Top Products Report

**GET** `/reports/top-products` (Protected)

Get top selling products.

**Query Parameters:**
- `limit` (optional): Number of products (default: 10)

### Revenue Report

**GET** `/reports/revenue` (Protected)

Get revenue over time.

**Query Parameters:**
- `period` (optional): day, week, month, year (default: month)

**Response:**
```json
[
  {
    "period": "2024-01",
    "total_revenue": 12345.67,
    "order_count": 45
  }
]
```

---

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## Rate Limiting

API calls are rate-limited to prevent abuse. Default limits:
- 60 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

---

## Testing with cURL

### Login Example

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

### Get Products (Protected)

```bash
curl -X GET http://localhost:8000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Create Product (Protected)

```bash
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "sku": "TEST-001",
    "price": 99.99,
    "cost": 50.00,
    "quantity": 100
  }'
```

---

## Postman Collection

You can import the API endpoints into Postman for easy testing:

1. Create a new collection
2. Set base URL as environment variable: `{{base_url}}`
3. Add authentication token as bearer token in collection settings
4. Create requests for each endpoint

---

## Support

For API support or questions, please open an issue in the repository.
