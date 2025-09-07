# TravelMate Client API Documentation

This directory contains all the API client functions for the TravelMate application, organized by feature area.

## 📁 File Structure

```
src/data/
├── api.js                 # Main API client with all exports
├── apiAuth.js            # Authentication endpoints
├── apiUsers.js           # User management endpoints  
├── apiTrips.js           # Trip management endpoints
├── apiChat.js            # AI chat and itinerary generation
├── apiUtils.js           # Utility functions
├── apiTypes.js           # Type definitions and constants
├── apiExamples.js        # Example usage patterns
├── countries.js          # Country data
├── index.js              # Barrel export
└── README.md             # This file
```

## 🔧 Updated Features (Based on api-endpoints.json)

### Authentication (apiAuth.js)
✅ **login** - User login with email/password  
✅ **register** - User registration  
✅ **refreshToken** - Token refresh with optional refreshToken parameter  
✅ **logout** - Logout with token and optional refreshToken  

### User Management (apiUsers.js)
✅ **getProfile** - Get user profile  
✅ **updateProfile** - Update user profile  
✅ **changePassword** - Change user password  
✅ **scheduleAccountDeletion** - Schedule account deletion (31 days)  
✅ **cancelAccountDeletion** - Cancel scheduled deletion  
✅ **deleteAccountImmediate** - Immediate account deletion  

#### Admin User Functions
✅ **getAllUsers** - Get all users (admin only)  
✅ **activateUser** - Activate user account (admin only)  
✅ **deactivateUser** - Deactivate user account (admin only)  
✅ **getStats** - Get basic user statistics (admin only)  
✅ **getDashboardStats** - Get detailed dashboard statistics (admin only)  
✅ **getDeletedUsers** - Get deleted users (admin only)  
✅ **restoreUser** - Restore deleted user (admin only)  
✅ **permanentlyDeleteUser** - Permanently delete user (admin only)  

**⚠️ Note:** Admins can activate/deactivate users but cannot change passwords for security reasons.  

### Trip Management (apiTrips.js)
✅ **getMyTrips** - Get user's trips with pagination  
✅ **createTrip** - Create new trip  
✅ **getTripById** - Get trip details  
✅ **updateTrip** - Update trip information  
✅ **deleteTrip** - Delete trip (logical deletion)  
✅ **addCosts** - Add costs to trip  
✅ **updateItinerary** - Update trip itinerary  
✅ **generatePdfReport** - Generate PDF report  
✅ **getTripReports** - Get list of trip reports  
✅ **servePDF** - Download PDF report  

#### Admin Trip Functions
✅ **getAllTrips** - Get all trips (admin only)  
✅ **getTripStats** - Get trip statistics and counts (admin only)  
✅ **getTripsByStatus** - Get trips filtered by status (admin only)  
✅ **cleanupOrphanedPDFs** - Cleanup orphaned PDF files (admin only)  
✅ **getDeletedTrips** - Get deleted trips (admin only)  
✅ **restoreTrip** - Restore deleted trip (admin only)  
✅ **permanentlyDeleteTrip** - Permanently delete trip (admin only)  

### AI Chat & Itinerary (apiChat.js)
✅ **generateItinerary** - Generate trip itinerary with AI  
✅ **chatAssistant** - Chat with travel assistant  

## 🔌 Usage Examples

### Authentication
```javascript
import { authAPI } from './data/api.js';

// Login
const loginResult = await authAPI.login({ 
  email: 'user@example.com', 
  password: 'password123' 
});

// Logout
await authAPI.logout(token, refreshToken);
```

### Admin Management
```javascript
import { usersAPI, tripsAPI, apiUtils } from './data/api.js';

// Get complete dashboard statistics
const dashboardStats = await apiUtils.getAdminDashboardStats(adminToken);
console.log('Total Users:', dashboardStats.data.summary.totalUsers);
console.log('Active Users:', dashboardStats.data.summary.activeUsers);
console.log('Total Trips:', dashboardStats.data.summary.totalTrips);
console.log('Active Trips:', dashboardStats.data.summary.activeTrips);

// Activate/Deactivate users (NOT change password)
await usersAPI.admin.activateUser(adminToken, userId);
await usersAPI.admin.deactivateUser(adminToken, userId);

// Get trip statistics
const tripStats = await tripsAPI.admin.getTripStats(adminToken);
console.log('Planned trips:', tripStats.data.plannedTrips);
console.log('Completed trips:', tripStats.data.completedTrips);

// Get trips by status
const activeTrips = await tripsAPI.admin.getTripsByStatus(adminToken, 'active');
const completedTrips = await tripsAPI.admin.getTripsByStatus(adminToken, 'completed');
```

### Trip Management
```javascript
import { tripsAPI } from './data/api.js';

// Add costs to trip
await tripsAPI.addCosts(token, tripId, [
  {
    type: "accommodation",
    label: "Hotel per night",
    currency: "USD",
    amount: 150,
    quantity: 7
  }
]);

// Update itinerary
await tripsAPI.updateItinerary(token, tripId, [
  {
    dayNumber: 1,
    notes: "First day in Tokyo",
    activities: [
      {
        time: "09:00",
        activity: "Breakfast at hotel",
        location: "Hotel Shibuya"
      }
    ]
  }
]);

// Generate PDF report
const reportData = await tripsAPI.createTripReport(token, tripId);
const pdfBlob = await tripsAPI.servePDF(token, tripId);
```

### AI Chat
```javascript
import { chatAPI } from './data/api.js';

// Generate itinerary
const itinerary = await chatAPI.generateBasicItinerary(token, {
  destination: "Tokyo, Japan",
  startDate: "2025-11-01",
  endDate: "2025-11-07",
  partySize: 2,
  budget: 2000,
  interests: ["culture", "food", "temples"]
});

// Chat with assistant
const response = await chatAPI.chatAssistant(token, {
  message: "What's the best time to visit Machu Picchu?",
  tripId: tripId,
  context: "Planning honeymoon trip to Peru"
});
```

## 🛡️ Error Handling

All API functions use consistent error handling:

```javascript
try {
  const result = await tripsAPI.createTrip(token, tripData);
  console.log('Success:', result.data);
} catch (error) {
  console.error('Error:', error.message);
}
```

## 🔑 Authentication

Most endpoints require authentication. Pass the JWT token as the first parameter:

```javascript
const token = localStorage.getItem('token');
const profile = await usersAPI.getProfile(token);
```

## 📊 Response Format

All API functions return responses in this format:

```javascript
{
  success: true,
  data: { /* response data */ },
  message: "Operation completed successfully"
}
```

For errors:
```javascript
{
  success: false,
  message: "Error description"
}
```

## 🔄 Updates Made

1. **Enhanced Authentication**: Added proper refreshToken and logout with token support
2. **Account Deletion Management**: Added scheduling, cancellation, and immediate deletion
3. **Admin Functions**: Added comprehensive admin management for users and trips
4. **Trip Enhancements**: Added cost management, itinerary updates, and PDF reporting
5. **Logical Deletion**: Implemented soft delete with restore capabilities
6. **Error Handling**: Consistent error handling across all endpoints

## 📝 Notes

- All admin functions require admin role authentication
- Logical deletion is used instead of physical deletion for data integrity
- PDF reports are generated and managed automatically
- All endpoints support pagination where applicable
- Functions follow the exact API specification from `api-endpoints.json`