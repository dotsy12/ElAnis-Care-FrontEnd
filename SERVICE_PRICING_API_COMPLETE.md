# Service Pricing API Integration - Complete Guide

## ✅ Integration Complete

تم تكامل نظام إدارة الأسعار (Service Pricing Management) في Admin Dashboard مع APIs الحقيقية بالكامل.

---

## 📋 APIs المنفذة

### **1. Get Categories with Pricing** 📊
```
GET /api/ServicePricing/categories-with-pricing
Authorization: Bearer {accessToken}

Response: Array of categories with their pricing
```

### **2. Get Category Pricing** 🔍
```
GET /api/ServicePricing/category/{categoryId}
Authorization: Bearer {accessToken}
```

### **3. Get Active Pricing** ✅
```
GET /api/ServicePricing/active

Response: All active pricing items
```

### **4. Get Pricing by ID** 📄
```
GET /api/ServicePricing/{id}
Authorization: Bearer {accessToken}
```

### **5. Create Pricing** ➕
```
POST /api/ServicePricing
Authorization: Bearer {accessToken}
Content-Type: application/json

Body: {
  "categoryId": "uuid",
  "shiftType": 1,          // 1=3Hours, 2=12Hours, 3=FullDay
  "pricePerShift": 20.00,
  "description": "string",
  "isActive": true
}
```

### **6. Update Pricing** ✏️
```
PUT /api/ServicePricing/{id}
Authorization: Bearer {accessToken}
Content-Type: application/json

Body: {
  "pricePerShift": 25.00,
  "description": "string",
  "isActive": true
}
```

### **7. Delete Pricing** 🗑️
```
DELETE /api/ServicePricing/{id}
Authorization: Bearer {accessToken}
```

### **8. Bulk Create Pricing** 📦
```
POST /api/ServicePricing/bulk
Authorization: Bearer {accessToken}
Content-Type: application/json

Body: {
  "categoryId": "uuid",
  "pricings": [
    {
      "shiftType": 1,
      "pricePerShift": 20.00,
      "description": "3-hour shift"
    },
    {
      "shiftType": 2,
      "pricePerShift": 22.00,
      "description": "12-hour shift"
    }
  ]
}
```

---

## 🎯 Shift Types Enum

```typescript
enum ShiftType {
  ThreeHours = 1,    // 3 ساعات
  TwelveHours = 2,   // 12 ساعة
  FullDay = 3        // يوم كامل (24 ساعة)
}
```

---

## 🔄 سير العمل

```
Admin Dashboard
      ↓
Click "Pricing" Tab
      ↓
[fetchCategoriesWithPricing()]
      ↓
Display Categories with Pricing
      ↓
Each Category Shows:
   - Category Info (Icon, Name, Description)
   - Pricing Items (3h, 12h, Full Day)
      ↓
Admin Actions:
   ┌────────────┬───────────┬──────────┐
   │ Add (+)    │ Edit (✏️) │ Delete (🗑️)│
   └────────────┴───────────┴──────────┘
      ↓              ↓            ↓
   Dialog         Dialog      Confirm
      ↓              ↓            ↓
   Create        Update       Delete
      ↓              ↓            ↓
   ─────────── Refresh ────────────
```

---

## 📊 Response Structure

### **Categories with Pricing:**
```json
{
  "statusCode": 200,
  "succeeded": true,
  "message": "Categories with pricing retrieved successfully.",
  "data": [
    {
      "categoryId": "uuid",
      "categoryName": "Elderly Care",
      "categoryDescription": "Care for seniors",
      "categoryIcon": "👴",
      "categoryIsActive": true,
      "pricing": [
        {
          "id": "uuid",
          "categoryId": "uuid",
          "categoryName": "Elderly Care",
          "shiftType": 1,
          "shiftTypeName": "3 Hours",
          "pricePerShift": 20.00,
          "description": "Standard 3-hour shift",
          "isActive": true,
          "createdAt": "2025-10-29T...",
          "updatedAt": "2025-10-29T...",
          "updatedBy": "Admin"
        }
      ]
    }
  ]
}
```

---

## 🎨 UI Components

### **1. Pricing Grid (by Category):**

**Features:**
- ✅ Grouped by category
- ✅ Category header with:
  - Icon, Name, Description
  - Active/Inactive badge
- ✅ Pricing items for each shift type
- ✅ Loading spinner
- ✅ Empty states
- ✅ Add/Edit/Delete buttons

**Layout:**
```tsx
{isLoadingPricing ? (
  <Spinner />
) : categoriesWithPricing.length === 0 ? (
  <EmptyState />
) : (
  <CategoryCards>
    <CategoryHeader />
    <PricingItems>
      {pricing.map(price => (
        <PriceCard>
          <ShiftType />
          <Price />
          <Badge />
          <Actions />
        </PriceCard>
      ))}
    </PricingItems>
  </CategoryCards>
)}
```

### **2. Pricing Dialog:**

**Features:**
- ✅ Form للإضافة/التعديل
- ✅ حقول:
  - Category (dropdown) - للإضافة فقط
  - Shift Type (dropdown) - للإضافة فقط
  - Price Per Shift - required
  - Description - optional
  - Is Active - checkbox
- ✅ Validation
- ✅ Cancel & Save buttons
- ✅ Loading state

**Rules:**
- عند **Create**: يمكن اختيار Category و Shift Type
- عند **Update**: Category و Shift Type محجوزة (readonly)

---

## 💾 State Management

```typescript
const [categoriesWithPricing, setCategoriesWithPricing] = useState<CategoryWithPricing[]>([]);
const [isLoadingPricing, setIsLoadingPricing] = useState(true);
const [showPricingDialog, setShowPricingDialog] = useState(false);
const [editingPricing, setEditingPricing] = useState<ServicePricing | null>(null);
const [pricingForm, setPricingForm] = useState({
  categoryId: '',
  shiftType: 1,
  pricePerShift: 0,
  description: '',
  isActive: true,
});
const [isSavingPricing, setIsSavingPricing] = useState(false);
```

---

## 📝 Interfaces

```typescript
interface ServicePricing {
  id: string;
  categoryId: string;
  categoryName: string;
  shiftType: number; // 1=3Hours, 2=12Hours, 3=FullDay
  shiftTypeName: string;
  pricePerShift: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

interface CategoryWithPricing {
  categoryId: string;
  categoryName: string;
  categoryDescription: string;
  categoryIcon: string;
  categoryIsActive: boolean;
  pricing: ServicePricing[];
}
```

---

## 🔐 Authentication

**جميع الـ APIs (ما عدا /active) تحتاج Bearer Token:**
```typescript
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
}
```

---

## 🧪 للاختبار

### **1. View Pricing:**
```bash
1. Login as Admin
2. Click "Pricing" tab
3. Should see loading spinner
4. Categories with pricing appear
5. Check:
   - Each category displayed
   - Pricing items grouped
   - Shift types (3h, 12h, Full Day)
   - Prices displayed
   - Active/Inactive badges
```

### **2. Create Pricing:**
```bash
1. Click "+ Add Pricing"
2. Dialog opens
3. Fill form:
   - Category: Elderly Care
   - Shift Type: 3 Hours
   - Price: $20
   - Description: Standard 3-hour
   - Active: ✓ checked
4. Click "Add Pricing"
5. Should see "Saving..."
6. Success toast
7. Dialog closes
8. List refreshes
```

### **3. Edit Pricing:**
```bash
1. Click Edit (✏️) on a pricing
2. Dialog opens with data
3. Modify price: $25
4. Click "Update Pricing"
5. Success toast
6. List refreshes
```

### **4. Delete Pricing:**
```bash
1. Click Delete (🗑️) on a pricing
2. Confirmation dialog
3. Confirm deletion
4. Success toast
5. Pricing removed from list
```

### **5. API Calls في DevTools:**
```bash
GET /api/ServicePricing/categories-with-pricing
→ Status: 200
→ Response: Array of categories with pricing

POST /api/ServicePricing
→ Status: 201
→ Body: Pricing data
→ Response: Created pricing

PUT /api/ServicePricing/{id}
→ Status: 200
→ Body: Updated data
→ Response: Updated pricing

DELETE /api/ServicePricing/{id}
→ Status: 200
→ Response: Success message
```

---

## ⚠️ Error Handling

### **1. Validation:**
```typescript
if (!pricingForm.categoryId || pricingForm.pricePerShift <= 0) {
  toast.error('Please fill in all required fields');
  return;
}
```

### **2. API Error:**
```typescript
if (!response.ok || !result.succeeded) {
  toast.error(result.message || 'Failed to...');
}
```

### **3. Network Error:**
```typescript
catch (error) {
  toast.error('Failed to...');
}
```

### **4. Delete Confirmation:**
```typescript
if (!confirm('Are you sure you want to delete this pricing?')) {
  return;
}
```

---

## 🎯 Button States

### **Add Pricing Button:**
- Normal: "+ Add Pricing"
- Opens Dialog

### **Save Button:**
- Normal: "Add Pricing" / "Update Pricing"
- Saving: "Saving..." (disabled)

### **Delete Button:**
- Normal: 🗑️ icon
- Shows confirmation

---

## 💡 Business Logic

### **Pricing Rules:**
1. **Each category** can have multiple pricing items
2. **Each pricing** is for a specific shift type
3. **Shift types:**
   - 1 = 3 Hours
   - 2 = 12 Hours
   - 3 = Full Day (24 Hours)
4. **Price** is per shift (not hourly)
5. **Active pricing** is available for booking

### **Use Cases:**

**Example: Elderly Care**
- 3 Hours → $60 per shift
- 12 Hours → $240 per shift
- Full Day → $400 per shift

**Example: Child Care**
- 3 Hours → $45 per shift
- 12 Hours → $180 per shift
- Full Day → $300 per shift

---

## 📌 Features

✅ **CRUD Operations:**
  - Create ✓
  - Read (All/Category/Active/ById) ✓
  - Update ✓
  - Delete ✓
  - Bulk Create ✓

✅ **UI Features:**
  - Grouped by category ✓
  - Loading states ✓
  - Empty states ✓
  - Active/Inactive badges ✓
  - Price display ($) ✓

✅ **Form Features:**
  - Category selection ✓
  - Shift type selection ✓
  - Price validation ✓
  - Active toggle ✓

✅ **UX Features:**
  - Toast notifications ✓
  - Delete confirmation ✓
  - Auto-refresh ✓
  - Disabled states ✓

---

## 🚀 الميزات

✅ **Full API Integration** - 8 APIs منفذة
✅ **Loading States** - لكل عملية
✅ **Error Handling** - شامل
✅ **Validation** - قبل الإرسال
✅ **Confirmation** - للحذف
✅ **Auto Refresh** - بعد العمليات
✅ **Category Grouping** - تنظيم حسب الفئة
✅ **Shift Types** - 3 أنواع نوبات
✅ **Active Toggle** - تفعيل/تعطيل
✅ **Professional UI** - تصميم احترافي

---

## 🚧 الميزات المستقبلية

- [ ] Bulk update pricing
- [ ] Price history/audit log
- [ ] Discount/promotion management
- [ ] Seasonal pricing
- [ ] Peak hours pricing
- [ ] Provider-specific pricing
- [ ] Location-based pricing
- [ ] Price comparison charts
- [ ] Revenue analytics per shift type
- [ ] Price recommendations (AI)

---

## 📊 Example Data Structure

```typescript
// Categories with Pricing
[
  {
    categoryId: "cat-1",
    categoryName: "Elderly Care",
    categoryIcon: "👴",
    pricing: [
      { shiftType: 1, shiftTypeName: "3 Hours", pricePerShift: 60 },
      { shiftType: 2, shiftTypeName: "12 Hours", pricePerShift: 240 },
      { shiftType: 3, shiftTypeName: "Full Day", pricePerShift: 400 }
    ]
  },
  {
    categoryId: "cat-2",
    categoryName: "Child Care",
    categoryIcon: "👶",
    pricing: [
      { shiftType: 1, shiftTypeName: "3 Hours", pricePerShift: 45 },
      { shiftType: 2, shiftTypeName: "12 Hours", pricePerShift: 180 },
      { shiftType: 3, shiftTypeName: "Full Day", pricePerShift: 300 }
    ]
  }
]
```

---

## 📝 Summary

✅ **8 APIs متكاملة:**
  - GET Categories with Pricing ✓
  - GET Category Pricing ✓
  - GET Active ✓
  - GET by ID ✓
  - POST Create ✓
  - PUT Update ✓
  - DELETE Delete ✓
  - POST Bulk Create ✓

✅ **UI Components:**
  - Pricing Grid (by category) ✓
  - Pricing Dialog ✓
  - Loading States ✓
  - Error Handling ✓

✅ **Features:**
  - Full CRUD ✓
  - Category grouping ✓
  - Shift type management ✓
  - Active toggle ✓
  - Real-time updates ✓

---

**تاريخ التكامل:** 29 أكتوبر 2025  
**المطور:** Cascade AI  
**الحالة:** ✅ Complete & Fully Functional
