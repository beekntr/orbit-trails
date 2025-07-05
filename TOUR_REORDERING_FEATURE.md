# Tour Package Reordering Feature 🎯

## Overview
Added drag-and-drop functionality to the admin dashboard for reordering tour packages. This allows you to control the display order of tours on the frontend.

## Features Added

### 🗄️ Backend Changes

1. **Tour Model Updated** (`server/models/Tour.ts`)
   - Added `order: number` field to ITour interface
   - Added order field to mongoose schema with default value of 0
   - Tours are now sorted by order first, then creation date

2. **New API Endpoint** (`server/routes/tours.ts`)
   - `POST /api/tours/reorder` - Updates tour display order
   - Protected route (admin authentication required)

3. **Controller Function** (`server/controllers/tourController.ts`)
   - `reorderTours()` - Handles bulk order updates
   - `createTour()` - Auto-assigns next available order to new tours
   - `getAllTours()` - Now sorts by order field

4. **Shared API** (`shared/api.ts`)
   - Added `order` field to Tour interface
   - Added `reorderTours()` method to API class

### 🎨 Frontend Changes

1. **New Component** (`client/components/DraggableToursTable.tsx`)
   - Drag-and-drop table using @dnd-kit library
   - Visual feedback during dragging
   - Maintains all existing functionality (edit, delete)
   - Shows grip handle for dragging

2. **Admin Dashboard Updated** (`client/pages/Admin.tsx`)
   - Replaced static table with draggable component
   - Added `handleReorderTours()` function
   - Real-time order updates with optimistic UI
   - Toast notifications for success/error

3. **Dependencies Added**
   - `@dnd-kit/core` - Core drag and drop functionality
   - `@dnd-kit/sortable` - Sortable list utilities
   - `@dnd-kit/utilities` - CSS transform utilities

## How to Use

### 🎯 Reordering Tours

1. **Login to Admin Dashboard**
   - Navigate to `/admin`
   - Login with admin credentials

2. **Go to Tours Tab**
   - Click on "Tour Packages" tab
   - You'll see all tours in a table format

3. **Drag and Drop**
   - Look for the grip handle (⋮⋮) next to each tour name
   - Click and drag tours to reorder them
   - Drop them in the desired position
   - Changes are saved automatically

4. **Visual Feedback**
   - Dragged item becomes semi-transparent
   - Drop zones are highlighted
   - Success toast confirms the update

### 🔧 For Developers

**Running Migration** (if you have existing tours):
```bash
cd server
npx ts-node migrations/addOrderToTours.ts
```

**API Usage**:
```typescript
// Reorder tours
const tourOrders = [
  { id: "tour1_id", order: 0 },
  { id: "tour2_id", order: 1 },
  { id: "tour3_id", order: 2 }
];

await OrbitTrailsAPI.reorderTours(tourOrders);
```

**Component Usage**:
```tsx
<DraggableToursTable
  tours={tours}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onReorder={handleReorder}
  loading={loading}
/>
```

## Technical Details

### 🎪 Drag and Drop Implementation

- **Library**: @dnd-kit (modern, accessible alternative to react-beautiful-dnd)
- **Strategy**: Vertical list sorting with closest center collision detection
- **Sensors**: Pointer and keyboard sensors for accessibility
- **Performance**: Optimized with CSS transforms, no DOM manipulation during drag

### 🔒 Security

- **Authentication**: All reorder operations require admin authentication
- **Validation**: Backend validates tour IDs and order values
- **Error Handling**: Graceful fallback if reorder fails

### 📱 Accessibility

- **Keyboard Support**: Full keyboard navigation support
- **Screen Readers**: Proper ARIA labels and announcements
- **Focus Management**: Maintains focus state during drag operations

## Benefits

1. **Better User Experience**
   - Intuitive drag-and-drop interface
   - Immediate visual feedback
   - No need to edit individual order values

2. **Content Management**
   - Control feature tour prominence
   - Seasonal promotions can be moved to top
   - Easy A/B testing of tour order

3. **SEO Benefits**
   - Important tours appear first in structured data
   - Better user engagement with optimized order
   - Improved click-through rates

## Troubleshooting

### Common Issues

1. **Drag Not Working**
   - Check if user has admin privileges
   - Ensure tours are loaded (not empty array)
   - Check browser console for JavaScript errors

2. **Order Not Saving**
   - Verify backend API is running
   - Check network tab for failed requests
   - Ensure MongoDB is connected

3. **Tours Not Appearing in New Order**
   - Check if frontend is caching old data
   - Refresh the tours page
   - Verify database order values

### Debug Mode

Enable debug mode by adding to your .env:
```
VITE_DEBUG_DND=true
```

This will log drag operations to the console.

## Future Enhancements

- **Category-based Ordering**: Separate ordering within each category
- **Bulk Operations**: Select multiple tours and move together
- **Order Templates**: Save and apply common ordering patterns
- **Advanced Filtering**: Drag and drop with category filters active

---

🎉 **The reordering feature is now fully functional!** Your tours will display in the order you set in the admin dashboard.
