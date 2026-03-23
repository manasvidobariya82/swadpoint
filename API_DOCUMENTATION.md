# SwadPoint API Documentation

## Base URL

```
http://localhost:3000/api
```

---

## 🔐 Authentication Endpoints

### Register User

```
POST /auth/register
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "9876543210",
  "role": "customer" // or "admin", "manager", "staff"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Login

```
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "john@example.com",
  "password": "securepassword"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_123",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Get Current Session

```
GET /auth/session

Response (200):
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Logout

```
POST /auth/logout

Response (200):
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 📦 Orders API

### List All Orders

```
GET /orders?status=new&limit=10&offset=0

Query Parameters:
- status: "new" | "accepted" | "preparing" | "completed" | "cancelled"
- limit: Number of orders to return (default: 50)
- offset: Pagination offset (default: 0)

Response (200):
{
  "success": true,
  "orders": [
    {
      "id": "ORD-2024-001",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "customerMobile": "9876543210",
      "items": [
        {
          "name": "Biryani",
          "quantity": 2,
          "price": 250,
          "total": 500
        }
      ],
      "total": 500,
      "tax": 50,
      "grandTotal": 550,
      "status": "new",
      "type": "delivery", // "delivery" | "takeaway" | "table" | "dine-in"
      "paymentMethod": "upi",
      "paymentStatus": "completed",
      "specialInstructions": "No onions please",
      "assignedStaff": "Staff Name",
      "estimationTime": "30 mins",
      "createdAt": "2024-03-20T10:30:00Z",
      "updatedAt": "2024-03-20T10:30:00Z"
    }
  ],
  "total": 42,
  "page": 0
}
```

### Create Order

```
POST /orders
Content-Type: application/json

Request:
{
  "userId": "user_123",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerMobile": "9876543210",
  "items": [
    {
      "menuItemId": "item_001",
      "name": "Biryani",
      "quantity": 2,
      "price": 250,
      "total": 500
    }
  ],
  "total": 500,
  "tax": 50,
  "grandTotal": 550,
  "type": "delivery",
  "paymentMethod": "upi",
  "specialInstructions": "No onions please"
}

Response (201):
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "ORD-2024-001",
    ...
  }
}
```

### Update Order Status

```
PATCH /orders
Content-Type: application/json

Request:
{
  "orderId": "ORD-2024-001",
  "status": "accepted", // "accepted" | "preparing" | "completed" | "cancelled"
  "assignedStaff": "Staff Name" (optional),
  "estimationTime": "30 mins" (optional)
}

Response (200):
{
  "success": true,
  "message": "Order status updated successfully",
  "order": { ... }
}
```

### Stream Orders (Server-Sent Events)

```
GET /orders/stream

Response: Streaming updates
event: order-added
data: {"id": "ORD-2024-001", "status": "new"}

event: order-updated
data: {"id": "ORD-2024-001", "status": "preparing"}
```

---

## 💳 Payments API

### List All Payments

```
GET /payments?status=success&limit=10&offset=0

Query Parameters:
- status: "success" | "pending" | "failed"
- limit: Number of records (default: 50)
- offset: Pagination offset

Response (200):
{
  "success": true,
  "payments": [
    {
      "id": "PAY-2024-001",
      "orderId": "ORD-2024-001",
      "amount": 550,
      "status": "success",
      "paymentMethod": "upi",
      "upiTransactionId": "UPI123456",
      "customerName": "John Doe",
      "customerMobile": "9876543210",
      "createdAt": "2024-03-20T10:30:00Z"
    }
  ],
  "total": 156,
  "page": 0
}
```

### Create Payment

```
POST /payments
Content-Type: application/json

Request:
{
  "orderId": "ORD-2024-001",
  "amount": 550,
  "paymentMethod": "upi",
  "upiTransactionId": "UPI123456" (for UPI)
}

Response (201):
{
  "success": true,
  "message": "Payment recorded successfully",
  "payment": { ... }
}
```

### Update Payment Status

```
PATCH /payments
Content-Type: application/json

Request:
{
  "paymentId": "PAY-2024-001",
  "status": "success", // "success" | "failed" | "pending"
  "upiTransactionId": "UPI123456" (optional)
}

Response (200):
{
  "success": true,
  "message": "Payment updated successfully"
}
```

### Get UPI Configuration

```
GET /payment-config

Response (200):
{
  "success": true,
  "config": {
    "upiId": "restaurant@bank",
    "payeeName": "Restaurant Name"
  }
}
```

### Update UPI Configuration

```
PUT /payment-config
Content-Type: application/json

Request:
{
  "upiId": "restaurant@bank",
  "payeeName": "Restaurant Name"
}

Response (200):
{
  "success": true,
  "message": "Configuration updated successfully"
}
```

---

## 🍽️ Menu API

### List Menu Items (by category)

```
GET /menu?category=Main%20Course

Query Parameters:
- category: Filter by category (optional)

Response (200):
{
  "success": true,
  "items": [
    {
      "id": "item_001",
      "name": "Biryani",
      "price": 250,
      "description": "Fragrant basmati rice with meat",
      "category": "Main Course",
      "available": true,
      "image": "biryani.jpg"
    }
  ]
}
```

### Get All Menu Items

```
GET /menu

Response (200):
{
  "success": true,
  "menu": {
    "Main Course": [ ... ],
    "Starter": [ ... ],
    "Dessert": [ ... ],
    "Beverage": [ ... ]
  }
}
```

### Add Menu Item

```
POST /menu
Content-Type: application/json

Request:
{
  "name": "Biryani",
  "price": 250,
  "description": "Fragrant basmati rice with meat",
  "category": "Main Course"
}

Response (201):
{
  "success": true,
  "item": { ... }
}
```

### Update Menu Item

```
PUT /menu
Content-Type: application/json

Request:
{
  "itemId": "item_001",
  "price": 260,
  "description": "Updated description",
  "available": true
}

Response (200):
{
  "success": true,
  "item": { ... }
}
```

### Delete Menu Item

```
DELETE /menu?itemId=item_001

Response (200):
{
  "success": true,
  "message": "Item deleted successfully"
}
```

---

## 📊 Inventory API

### List Inventory Items

```
GET /inventory?category=vegetables&limit=10

Query Parameters:
- category: Filter by category
- limit: Items per page
- offset: Pagination offset

Response (200):
{
  "success": true,
  "items": [
    {
      "id": "inv_001",
      "name": "Tomato",
      "category": "Vegetables",
      "currentStock": 50,
      "unit": "kg",
      "minStock": 10,
      "lastRestocked": "2024-03-20T10:00:00Z",
      "status": "ok" // "critical" | "warning" | "ok"
    }
  ],
  "total": 145
}
```

### Add Inventory Item

```
POST /inventory
Content-Type: application/json

Request:
{
  "name": "Tomato",
  "category": "Vegetables",
  "currentStock": 50,
  "unit": "kg",
  "minStock": 10,
  "lastRestocked": "2024-03-20T10:00:00Z"
}

Response (201):
{
  "success": true,
  "item": { ... }
}
```

### Update Stock Level

```
PATCH /inventory/:id
Content-Type: application/json

Request:
{
  "currentStock": 45,
  "action": "subtract" // "add" | "subtract" | "set"
}

Response (200):
{
  "success": true,
  "item": { ... }
}
```

### Delete Inventory Item

```
DELETE /inventory/:id

Response (200):
{
  "success": true,
  "message": "Item deleted successfully"
}
```

---

## 👥 Customer API

### Get User Profile

```
GET /user/:userId

Response (200):
{
  "success": true,
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "customer",
    "createdAt": "2024-03-20T10:00:00Z"
  }
}
```

### Update User Profile

```
PUT /user/:userId
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210"
}

Response (200):
{
  "success": true,
  "user": { ... }
}
```

### Get User Orders

```
GET /user/:userId/orders

Response (200):
{
  "success": true,
  "orders": [ ... ]
}
```

---

## 🏨 Reservation API

### Get Reservation Settings

```
GET /reservation-settings

Response (200):
{
  "success": true,
  "settings": {
    "maxReservationAdvanceDays": 30,
    "maxGuestsPerReservation": 50,
    "operatingHoursStart": "10:00",
    "operatingHoursEnd": "23:00"
  }
}
```

### Update Reservation Settings

```
PUT /reservation-settings
Content-Type: application/json

Request:
{
  "maxReservationAdvanceDays": 30,
  "maxGuestsPerReservation": 50,
  "operatingHoursStart": "10:00",
  "operatingHoursEnd": "23:00"
}

Response (200):
{
  "success": true,
  "settings": { ... }
}
```

### List All Tables

```
GET /tables

Response (200):
{
  "success": true,
  "tables": [
    {
      "id": "table_001",
      "number": 1,
      "capacity": 4,
      "location": "Window",
      "available": true
    }
  ]
}
```

---

## 📈 Dashboard Summary

### Get Dashboard Metrics

```
GET /dashboard-summary

Response (200):
{
  "success": true,
  "summary": {
    "totalOrders": 42,
    "totalRevenue": 12500,
    "pendingOrders": 5,
    "completedToday": 38,
    "averageOrderValue": 298,
    "topDish": "Biryani",
    "lowStockItems": 3
  }
}
```

---

## 🧪 Test Endpoint

### Test API Connectivity

```
GET /test

Response (200):
{
  "success": true,
  "message": "API is working correctly"
}
```

---

## Error Responses

All endpoints follow this error format:

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting implemented. Recommended for production:

- 100 requests per minute per IP for public endpoints
- 1000 requests per minute per user for authenticated endpoints

---

## Pagination

For list endpoints that support pagination:

```
Query Parameters:
- limit: Items per page (default: 50, max: 100)
- offset: Number of items to skip (default: 0)

Response includes:
- total: Total number of items available
- page: Current page number
- items: Array of results
```

---

## Authentication

Protected endpoints require authentication via session cookies set during login.
Include `credentials: 'include'` in fetch requests:

```javascript
fetch("/api/orders", {
  method: "GET",
  credentials: "include",
});
```

---

**Last Updated**: March 23, 2026  
**Version**: 1.0.0
