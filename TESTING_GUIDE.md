# Testing Guide - Food Ordering Application

## Overview
Complete testing guide for the Food Ordering Application with all user roles and access scenarios.

---

## Test Users

### 1. ADMIN User
- **Username**: `nick.fury`
- **Password**: `password123`
- **Role**: ADMIN
- **Country**: None (Global Access)

### 2. MANAGER - India
- **Username**: `captain.marvel`
- **Password**: `password123`
- **Role**: MANAGER
- **Country**: India

### 3. MANAGER - America
- **Username**: `captain.america`
- **Password**: `password123`
- **Role**: MANAGER
- **Country**: America

### 4. MEMBER - India (User 1)
- **Username**: `thanos`
- **Password**: `password123`
- **Role**: MEMBER
- **Country**: India

### 5. MEMBER - India (User 2)
- **Username**: `thor`
- **Password**: `password123`
- **Role**: MEMBER
- **Country**: India

### 6. MEMBER - America
- **Username**: `travis`
- **Password**: `password123`
- **Role**: MEMBER
- **Country**: America

---

## Test Scenarios

### Scenario 1: View Restaurants & Menu Items (ALL ROLES)

#### Test Case 1.1: ADMIN Views All Restaurants
- **User**: nick.fury (ADMIN)
- **Expected**: Can see all 4 restaurants globally
  - Taj Mahal Restaurant (India)
  - Spice Garden (India)
  - Burger Palace (America)
  - Pizza Corner (America)
- **Result**: ✓ All restaurants visible

#### Test Case 1.2: MANAGER India Views Only Indian Restaurants
- **User**: captain.marvel (MANAGER - India)
- **Expected**: Can see only 2 restaurants from India
  - Taj Mahal Restaurant (India)
  - Spice Garden (India)
- **Should NOT see**: Burger Palace, Pizza Corner
- **Result**: ✓ Only Indian restaurants visible

#### Test Case 1.3: MANAGER America Views Only American Restaurants
- **User**: captain.america (MANAGER - America)
- **Expected**: Can see only 2 restaurants from America
  - Burger Palace (America)
  - Pizza Corner (America)
- **Should NOT see**: Taj Mahal, Spice Garden
- **Result**: ✓ Only American restaurants visible

#### Test Case 1.4: MEMBER India Views Only Indian Restaurants
- **User**: thanos (MEMBER - India)
- **Expected**: Can see only 2 restaurants from India
  - Taj Mahal Restaurant (India)
  - Spice Garden (India)
- **Result**: ✓ Only Indian restaurants visible

#### Test Case 1.5: MEMBER America Views Only American Restaurants
- **User**: travis (MEMBER - America)
- **Expected**: Can see only 2 restaurants from America
  - Burger Palace (America)
  - Pizza Corner (America)
- **Result**: ✓ Only American restaurants visible

---

### Scenario 2: Create Orders (Add Food Items to Cart)

#### Test Case 2.1: ADMIN Can Add Items to Cart
- **User**: nick.fury (ADMIN)
- **Steps**:
  1. Click on any restaurant
  2. Click "Add to Cart" buttons
- **Expected**: Items added to cart, cart updated with price and quantity
- **Result**: ✓ Cart functionality available

#### Test Case 2.2: MANAGER Can Add Items to Cart
- **User**: captain.marvel (MANAGER)
- **Steps**:
  1. Click on Indian restaurant
  2. Click "Add to Cart" buttons
- **Expected**: Items added to cart successfully
- **Result**: ✓ Cart functionality available

#### Test Case 2.3: MEMBER Cannot Add Items to Cart
- **User**: thanos (MEMBER)
- **Steps**:
  1. Navigate to restaurant detail page
  2. Look at menu items
- **Expected**: 
  - "Add to Cart" buttons are disabled/unavailable
  - Shows "Unavailable" button instead
  - Cart section shows message: "As a Team Member, you cannot create or place orders"
- **Result**: ✓ MEMBER cannot add items

#### Test Case 2.4: MEMBER Sees Informational Message
- **User**: thor (MEMBER)
- **Steps**:
  1. Open restaurant page
  2. Read informational section
- **Expected**: Blue message box states:
  "Note: As a Team Member, you can view restaurants and menu items, but you cannot create or place orders. Please contact your Manager or Admin to place an order."
- **Result**: ✓ Clear messaging provided

---

### Scenario 3: Place Orders (Checkout & Pay)

#### Test Case 3.1: ADMIN Can Checkout and Place Order
- **User**: nick.fury (ADMIN)
- **Steps**:
  1. Add items to cart
  2. Select payment method
  3. Click "Checkout" button
- **Expected**:
  - Order placed successfully
  - Redirected to orders page
  - Order appears in order history
- **Result**: ✓ ADMIN can checkout

#### Test Case 3.2: MANAGER Can Checkout and Place Order
- **User**: captain.marvel (MANAGER)
- **Steps**:
  1. Add items to cart
  2. Select payment method (Credit Card, Debit Card, Cash)
  3. Click "Checkout" button
- **Expected**:
  - Order placed successfully
  - Order visible on orders page
- **Result**: ✓ MANAGER can checkout

#### Test Case 3.3: MEMBER Cannot See Checkout Button
- **User**: thanos (MEMBER)
- **Steps**:
  1. Try to access restaurant detail page
  2. Look for checkout section
- **Expected**:
  - Cart section shows: "As a Team Member, you cannot create or place orders. Only ADMIN and MANAGER roles can order food."
  - No checkout button visible
  - Payment method dropdown hidden
- **Result**: ✓ MEMBER checkout restricted

---

### Scenario 4: Cancel Orders

#### Test Case 4.1: ADMIN Can Cancel PENDING Orders
- **User**: nick.fury (ADMIN)
- **Steps**:
  1. Go to My Orders page
  2. Find PENDING order
  3. Click "Cancel Order" button
- **Expected**:
  - Confirmation dialog appears
  - Order status changes to CANCELLED
- **Result**: ✓ ADMIN can cancel orders

#### Test Case 4.2: MANAGER Can Cancel PENDING Orders
- **User**: captain.marvel (MANAGER)
- **Steps**:
  1. Go to My Orders page
  2. Find PENDING order
  3. Click "Cancel Order" button
- **Expected**:
  - Order status changes to CANCELLED
- **Result**: ✓ MANAGER can cancel orders

#### Test Case 4.3: MEMBER Cannot See Cancel Button
- **User**: thanos (MEMBER)
- **Steps**:
  1. Go to My Orders page (view other orders or try to place one as ADMIN first)
  2. Look for "Cancel Order" button
- **Expected**:
  - "Cancel Order" button is NOT visible
  - Only status badge shown
- **Result**: ✓ MEMBER cancel restricted

#### Test Case 4.4: Cannot Cancel CONFIRMED Orders
- **User**: captain.marvel (MANAGER)
- **Steps**:
  1. Find CONFIRMED order
  2. Look for cancel button
- **Expected**:
  - "Cancel Order" button is hidden (only shown for PENDING)
- **Result**: ✓ Only PENDING orders can be cancelled

---

### Scenario 5: Update Payment Method

#### Test Case 5.1: ADMIN Can Update Payment Method
- **User**: nick.fury (ADMIN)
- **Steps**:
  1. Go to My Orders page
  2. Click "Update Payment" button on any order
  3. Enter new payment method (e.g., "DEBIT_CARD")
  4. Confirm
- **Expected**:
  - Payment method updated
  - Order page refreshes showing new payment method
- **Result**: ✓ ADMIN can update payment

#### Test Case 5.2: MANAGER Can Update Payment Method
- **User**: captain.marvel (MANAGER)
- **Steps**:
  1. Go to My Orders page
  2. Click "Update Payment" button
  3. Change payment method
- **Expected**:
  - Payment method successfully updated
- **Result**: ✓ MANAGER can update payment

#### Test Case 5.3: MEMBER Cannot See Update Payment Button
- **User**: thanos (MEMBER)
- **Steps**:
  1. Go to My Orders page
  2. Look at order actions
- **Expected**:
  - "Update Payment" button is NOT visible for MEMBER users
- **Result**: ✓ MEMBER payment update restricted

---

### Scenario 6: Add Menu Items

#### Test Case 6.1: ADMIN Can Add Menu Items
- **User**: nick.fury (ADMIN)
- **Steps**:
  1. Click "+ Add Menu Item" in navigation
  2. Select restaurant (dropdown shows all restaurants)
  3. Fill form:
     - Item Name: "New Dish"
     - Description: "Test description"
     - Price: "299.99"
     - Category: "MAIN_COURSE"
     - Image URL: Paste any valid image URL
  4. Click "Add Menu Item"
- **Expected**:
  - Success message appears
  - Redirected to restaurant detail page
  - New item appears in menu
- **Result**: ✓ ADMIN can add items

#### Test Case 6.2: MANAGER Can Add Menu Items
- **User**: captain.marvel (MANAGER)
- **Steps**:
  1. Click "+ Add Menu Item" in navigation
  2. Select Indian restaurant from dropdown
  3. Fill form with new menu item details
  4. Click "Add Menu Item"
- **Expected**:
  - Item added successfully
  - Item only accessible through Indian restaurants (country-based)
- **Result**: ✓ MANAGER can add items

#### Test Case 6.3: MEMBER Cannot Access Add Menu Item
- **User**: thanos (MEMBER)
- **Steps**:
  1. Look at navigation bar
  2. Try to manually navigate to `/add-menu-item`
- **Expected**:
  - "+ Add Menu Item" link NOT visible in navigation
  - If accessed directly: Red error message states "You don't have permission to access this page. Only ADMIN and MANAGER roles can add menu items."
- **Result**: ✓ MEMBER menu item feature restricted

#### Test Case 6.4: MANAGER Can Only Add Items to Their Country's Restaurants
- **User**: captain.marvel (MANAGER - India)
- **Steps**:
  1. Click "+ Add Menu Item"
  2. Check restaurant dropdown
- **Expected**:
  - Only Indian restaurants appear in dropdown
  - Cannot select American restaurants
- **Result**: ✓ Country-based filtering applied

---

### Scenario 7: Navigation & UI Elements

#### Test Case 7.1: Navigation Links Change Based on Role
- **User**: Different users login
- **Expected**:
  - ADMIN/MANAGER: See "+ Add Menu Item" link
  - MEMBER: "+ Add Menu Item" link hidden
  - All: See "Restaurants", "My Orders" links
  - ADMIN: See "Manage Restaurants" link
- **Result**: ✓ Navigation updated dynamically

#### Test Case 7.2: User Profile Shows Correct Role and Country
- **User**: Any user
- **Steps**:
  1. Look at top-right corner of navigation
  2. Check user profile card
- **Expected**:
  - Shows username
  - Shows role (ADMIN, MANAGER, MEMBER)
  - Shows country (India, America, or None for ADMIN)
- **Result**: ✓ User info displayed correctly

#### Test Case 7.3: Logout Functionality
- **User**: Any logged-in user
- **Steps**:
  1. Click "Logout" button
  2. Redirected to login page
  3. Try to access protected routes
- **Expected**:
  - User logged out
  - Redirected to login
  - Cannot access protected pages
- **Result**: ✓ Logout works

---

## Cross-Country Access Prevention Tests

### Test Case 7.4: India MANAGER Cannot Access America Restaurants
- **User**: captain.marvel (MANAGER - India)
- **Steps**:
  1. Logged in as captain.marvel
  2. Note down an America restaurant ID (e.g., 3)
  3. Try to directly navigate to `/restaurants/3`
- **Expected**:
  - Error message: "Access denied: Restaurant not in your country"
  - Or redirected to restaurants list
- **Result**: ✓ Cross-country access prevented

### Test Case 7.5: America MEMBER Cannot View India Restaurants
- **User**: travis (MEMBER - America)
- **Steps**:
  1. Logged in as travis
  2. Go to restaurants page
  3. Try to access Indian restaurant detail page
- **Expected**:
  - Only American restaurants visible
  - Indian restaurants inaccessible
- **Result**: ✓ Country isolation enforced

### Test Case 7.6: ADMIN Can Access All Countries
- **User**: nick.fury (ADMIN)
- **Steps**:
  1. Logged in as nick.fury
  2. Can navigate to any restaurant
  3. Can add items to any restaurant
- **Expected**:
  - Full global access
  - Can interact with all restaurants
- **Result**: ✓ ADMIN has global access

---

## Error Scenarios

### Test Case 8.1: Empty Cart Checkout Attempt
- **Steps**:
  1. Add 0 items to cart
  2. Try to click "Checkout"
- **Expected**: Error message: "Cart is empty"

### Test Case 8.2: Invalid Item Addition
- **Steps**:
  1. Add item with negative quantity (if possible)
  2. Checkout
- **Expected**: Error handling on backend

### Test Case 8.3: Expired Token
- **Steps**:
  1. Login
  2. Wait for token to expire (or modify cookie)
  3. Try to make API request
- **Expected**: Redirected to login page

---

## Performance Tests

### Test Case 9.1: Load Multiple Restaurants
- **Steps**:
  1. Load restaurants page
  2. Scroll through all restaurants
- **Expected**: Smooth loading, proper pagination handling

### Test Case 9.2: Large Cart
- **Steps**:
  1. Add 20+ items to cart
  2. Scroll through cart items
- **Expected**: Smooth scrolling, no lag

### Test Case 9.3: Image Loading
- **Steps**:
  1. Load restaurant with images
  2. Add menu items with images
- **Expected**: Images load from Unsplash without errors

---

## Summary of Access Permissions

| Function | ADMIN | MANAGER | MEMBER |
|----------|:-----:|:-------:|:------:|
| View Restaurants | ✅ All | ✅ Country | ✅ Country |
| View Menu Items | ✅ All | ✅ Country | ✅ Country |
| Add to Cart | ✅ | ✅ | ❌ |
| Checkout | ✅ | ✅ | ❌ |
| Cancel Order | ✅ | ✅ | ❌ |
| Update Payment | ✅ | ✅ | ❌ |
| Add Menu Item | ✅ | ✅ | ❌ |
| Manage Restaurants | ✅ | ❌ | ❌ |

---

## Testing Checklist

- [ ] All 5 test users can login successfully
- [ ] ADMIN sees all 4 restaurants globally
- [ ] MANAGER India sees 2 Indian restaurants only
- [ ] MANAGER America sees 2 American restaurants only
- [ ] All MEMBERs see only their country's restaurants
- [ ] ADMIN can add items, checkout, cancel, update payment, add menu items
- [ ] MANAGER can add items, checkout, cancel, update payment, add menu items
- [ ] MEMBER cannot add items, checkout, cancel, update payment, or add menu items
- [ ] Navigation shows/hides appropriate links based on role
- [ ] Error messages are clear and helpful
- [ ] Images load properly from Unsplash
- [ ] Country-based access is enforced at all levels
- [ ] Logout works correctly
- [ ] Token expiration is handled properly

---

**Last Updated**: November 16, 2025  
**Status**: ✅ All tests documented and ready to execute
