# Provider Availability Management Feature ✅

## نظرة عامة
تم إضافة نظام إدارة الأوقات المتاحة (Availability) لمقدمي الخدمة في Provider Dashboard.

## الميزات المضافة

### 1. **اختيار الأيام المتاحة**
- Calendar component للاختيار المتعدد للأيام
- عرض عدد الأيام المحددة
- واجهة سهلة وواضحة

### 2. **اختيار الفترات الزمنية**
أربع فترات زمنية متاحة:
- **Morning** (1) - صباحاً
- **Afternoon** (2) - بعد الظهر
- **Evening** (3) - مساءً
- **Night** (4) - ليلاً

### 3. **إضافة ملاحظات**
- حقل اختياري لإضافة ملاحظات عن الأوقات المتاحة
- مثال: "Available for emergency cases only"

### 4. **عرض الجدول الزمني**
- قائمة بجميع الأوقات المتاحة المحفوظة
- عرض التاريخ، الفترة الزمنية، والملاحظات
- إمكانية حذف أي availability

### 5. **Loading States**
- Loading indicator عند تحميل البيانات
- Loading indicator عند حفظ البيانات
- Disabled button أثناء الحفظ

## API Endpoints المستخدمة

### GET /api/Provider/availability
```typescript
// Fetch availability for a date range
GET https://elanis.runasp.net/api/Provider/availability?startDate=${startDate}&endDate=${endDate}
Headers: Authorization: Bearer {token}

Response:
{
  "succeeded": true,
  "data": [
    {
      "id": "uuid",
      "date": "2025-11-03T00:00:00Z",
      "isAvailable": true,
      "availableShift": 1,
      "notes": "string"
    }
  ]
}
```

### POST /api/Provider/availability
```typescript
// Create new availability
POST https://elanis.runasp.net/api/Provider/availability
Headers: 
  - Authorization: Bearer {token}
  - Content-Type: application/json

Body:
{
  "date": "2025-11-03T18:07:19.335Z",
  "isAvailable": true,
  "availableShift": 1,  // 1=Morning, 2=Afternoon, 3=Evening, 4=Night
  "notes": "string"
}

Response:
{
  "statusCode": 201,
  "succeeded": true,
  "message": "Availability added successfully",
  "data": { ... }
}
```

### DELETE /api/Provider/availability/{id}
```typescript
// Delete an availability entry
DELETE https://elanis.runasp.net/api/Provider/availability/{id}
Headers: Authorization: Bearer {token}

Response:
{
  "succeeded": true,
  "message": "Availability deleted successfully"
}
```

## التعديلات التقنية

### Interfaces المضافة
```typescript
interface ProviderAvailability {
  id: string;
  date: string;
  isAvailable: boolean;
  availableShift: number; // 1=Morning, 2=Afternoon, 3=Evening, 4=Night
  notes: string;
}
```

### States المضافة
```typescript
const [availabilities, setAvailabilities] = useState<ProviderAvailability[]>([]);
const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
const [isSavingAvailability, setIsSavingAvailability] = useState(false);
const [availabilityNotes, setAvailabilityNotes] = useState('');
const [selectedTimeSlots, setSelectedTimeSlots] = useState<number[]>([1]);
```

### Functions المضافة
1. **fetchAvailability()** - جلب البيانات من API
2. **handleSaveAvailability()** - حفظ availability جديد
3. **handleDeleteAvailability(id)** - حذف availability
4. **toggleTimeSlot(slotId)** - تبديل اختيار الفترة الزمنية

## كيفية الاستخدام

### للمستخدم (Provider):

1. **تسجيل الدخول** كمقدم خدمة
2. **الذهاب لـ Provider Dashboard**
3. **الضغط على "Availability"** في القائمة الجانبية
4. **اختيار الأيام المتاحة** من التقويم (يمكن اختيار أكثر من يوم)
5. **اختيار الفترات الزمنية** (Morning, Afternoon, Evening, Night)
6. **إضافة ملاحظات** (اختياري)
7. **الضغط على "Save Availability"**

### النتيجة:
- ✅ يتم حفظ كل مجموعة (يوم + فترة زمنية) كـ availability منفصل
- ✅ يظهر الجدول الزمني المحفوظ أسفل النموذج
- ✅ يمكن حذف أي availability من الجدول

## مثال على الاستخدام

### سيناريو:
مقدم خدمة يريد تحديد أوقاته المتاحة:

1. يختار **3, 4, 5 نوفمبر 2025**
2. يختار **Morning + Evening**
3. يضيف ملاحظة: "Available for house visits"
4. يضغط Save

### النتيجة:
يتم إنشاء 6 availability entries:
- Nov 3, Morning
- Nov 3, Evening
- Nov 4, Morning
- Nov 4, Evening
- Nov 5, Morning
- Nov 5, Evening

## الملفات المعدلة

### ProviderDashboard.tsx
- ✅ إضافة interfaces و states
- ✅ إضافة API functions
- ✅ تحديث UI للـ Availability tab
- ✅ إضافة useEffect لجلب البيانات

### المكونات المستخدمة
- `Calendar` - من ui/calendar
- `Textarea` - من ui/textarea
- `Badge` - من ui/badge
- Icons: `CalendarIcon`, `Clock`, `X`

## Validation

### قبل الحفظ:
- ✅ يجب اختيار يوم واحد على الأقل
- ✅ يجب اختيار فترة زمنية واحدة على الأقل
- ✅ الملاحظات اختيارية

### رسائل الخطأ:
- "Please select at least one date"
- "Please select at least one time slot"
- "Authentication required"

### رسائل النجاح:
- "Availability saved successfully!"
- "Availability deleted"

## UI/UX Features

### 1. Calendar
- اختيار متعدد للأيام
- تصميم واضح ومنظم
- Border لتمييز المنطقة

### 2. Time Slots
- Grid layout (2 columns على mobile, 4 على desktop)
- Active state واضح (برتقالي)
- Icons للفترات الزمنية

### 3. Availability List
- Scrollable (max height 96)
- عرض التاريخ بشكل واضح
- زر حذف سهل الوصول

### 4. Loading States
- Spinner animation أثناء التحميل
- Disabled button أثناء الحفظ
- Inline spinner في زر الحفظ

## Testing Checklist

- [ ] Login كـ Provider
- [ ] Navigate إلى Availability tab
- [ ] اختيار تاريخ واحد + فترة واحدة → Save → تحقق من النجاح
- [ ] اختيار تواريخ متعددة + فترات متعددة → Save
- [ ] إضافة notes → Save → تحقق من ظهورها
- [ ] حذف availability → تحقق من الحذف
- [ ] محاولة Save بدون اختيار تاريخ → تحقق من الخطأ
- [ ] محاولة Save بدون اختيار فترة → تحقق من الخطأ
- [ ] تحديث الصفحة → تحقق من استمرار البيانات

## Known Limitations

1. **Bulk API**: لم يتم استخدام `/api/Provider/availability/bulk` (يمكن إضافته لاحقاً)
2. **Update**: لا يوجد update API - يجب حذف ثم إعادة إضافة
3. **Past Dates**: لا يوجد validation لمنع اختيار تواريخ ماضية (يمكن إضافته)
4. **Conflicts**: لا يوجد check للـ conflicts (نفس اليوم ونفس الفترة)

## Future Enhancements

### 1. Bulk Creation
استخدام bulk API لإنشاء availabilities متعددة في request واحد:
```typescript
POST /api/Provider/availability/bulk
{
  "startDate": "2025-11-03",
  "endDate": "2025-11-30",
  "isAvailable": true,
  "availableShift": 1,
  "excludeDays": [0, 6] // Exclude Sunday & Saturday
}
```

### 2. Calendar View
عرض الـ availabilities مباشرة على Calendar بألوان مختلفة

### 3. Recurring Availability
إضافة option لجدولة أوقات متكررة (مثل: كل يوم اثنين صباحاً)

### 4. Conflict Detection
منع إنشاء availabilities متعارضة

### 5. Past Dates Validation
منع اختيار تواريخ في الماضي

---

## Status: ✅ Complete

التطبيق جاهز للاستخدام والاختبار!

**تاريخ الإضافة:** Nov 2, 2025  
**الإصدار:** 1.0
