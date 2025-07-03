# API Testing Guide

This document provides examples for testing all API endpoints of the Orbit Trails application.

## Base URL
```
http://localhost:3000/api
```

## Testing Commands (PowerShell)

### 1. Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET
```

### 2. Get All Tours
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/tours" -Method GET
```

### 3. Submit Contact Form
```powershell
$contactData = @{
    name = "John Doe"
    email = "john@example.com"
    phone = "+1234567890"
    message = "I'm interested in your Golden Triangle tour package."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/contact" -Method POST -Body $contactData -ContentType "application/json"
```

### 4. Submit Custom Tour Request
```powershell
$customTourData = @{
    name = "Jane Smith"
    email = "jane@example.com"
    phone = "+1987654321"
    destinations = @("Delhi", "Agra", "Jaipur")
    duration = "8 days"
    budget = "$1200"
    travelers = 2
    travelStyle = "Luxury"
    interests = @("History", "Culture", "Photography")
    accommodation = "5-star hotels"
    transportation = "Private car"
    dietaryRequirements = "Vegetarian"
    additionalRequests = "Need wheelchair accessible accommodations"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/customize-tour" -Method POST -Body $customTourData -ContentType "application/json"
```

### 5. Admin Login
```powershell
$loginData = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/login" -Method POST -Body $loginData -ContentType "application/json"
$token = $loginResponse.data.token
Write-Host "Login successful! Token: $token"
```

### 6. Get Admin Dashboard (requires token)
```powershell
# Use token from login response
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/admin/dashboard" -Method GET -Headers $headers
```

### 7. Create New Tour (requires token)
```powershell
$tourData = @{
    name = "Rajasthan Royal Experience"
    description = "Experience the royal heritage of Rajasthan with visits to majestic palaces and forts."
    category = "Rajasthan Tours"
    price = 899
    duration = "10 Days"
    maxGuests = 16
    minAge = 12
    rating = 4.8
    reviews = 0
    highlights = @("Royal Palaces", "Desert Safari", "Cultural Shows")
    included = @("Accommodation", "Transportation", "Professional Guide", "Entrance Fees")
    notIncluded = @("International Flights", "Personal Expenses", "Tips", "Travel Insurance")
    itinerary = @()
    images = @("https://example.com/rajasthan-tour.jpg")
    destinations = @("Jaipur", "Udaipur", "Jodhpur", "Jaisalmer")
    status = "active"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/tours" -Method POST -Body $tourData -Headers $headers -ContentType "application/json"
```

## Expected Responses

### Health Check Response
```json
{
  "status": "OK",
  "message": "Orbit Trails API is running",
  "timestamp": "2025-07-03T11:45:31.892Z"
}
```

### Tours Response
```json
{
  "success": true,
  "data": {
    "tours": [...],
    "groupedTours": {...},
    "total": 6
  }
}
```

### Contact Submission Response
```json
{
  "success": true,
  "message": "Thank you for your message! We'll get back to you soon.",
  "data": {
    "contact": {...}
  }
}
```

### Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "admin": {
      "id": "...",
      "username": "admin"
    }
  }
}
```

## Browser Testing

### Frontend Pages
- Homepage: http://localhost:8080
- Tours: http://localhost:8080/tours  
- Contact: http://localhost:8080/contact
- Admin: http://localhost:8080/adm

### API Endpoints
- Health: http://localhost:3000/api/health
- Tours: http://localhost:3000/api/tours

## Database Verification

Check if data is properly stored in MongoDB Atlas:

1. **Contact Submissions**: After submitting contact form
2. **Custom Tour Requests**: After submitting custom tour request  
3. **New Tours**: After creating tours via admin panel
4. **Admin Authentication**: Login attempts and token generation

## Email Testing

Verify email notifications are sent for:
1. Contact form submissions
2. Custom tour requests

Check email configuration in `.env` file and ensure SMTP/Gmail credentials are correct.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check if backend is running on port 3000
2. **Database Connection**: Verify MongoDB Atlas connection string
3. **Email Errors**: Check email service configuration
4. **JWT Errors**: Ensure JWT_SECRET is set in environment
5. **Port Conflicts**: Make sure ports 3000 and 8080 are available

### Debug Commands

```powershell
# Check if backend is running
Test-NetConnection -ComputerName localhost -Port 3000

# Check if frontend is running  
Test-NetConnection -ComputerName localhost -Port 8080

# View backend logs
npm run dev:server

# View frontend logs
npm run dev
```

---

**Test all endpoints to ensure the application is working correctly!**
