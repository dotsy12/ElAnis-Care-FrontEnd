# Registration API Integration - Complete Guide

## ✅ Integration Complete

تم تكامل صفحات التسجيل والتحقق من OTP بنجاح مع API الحقيقي.

---

## 📋 المكونات المحدثة

### 1. **RegistrationPage.tsx** ✨
تم تحديث الصفحة بالكامل للاتصال بـ API الحقيقي:

#### **الحقول المطلوبة للمستخدم العادي:**
- `FirstName` - الاسم الأول
- `LastName` - اسم العائلة
- `Email` - البريد الإلكتروني
- `PhoneNumber` - رقم الهاتف
- `Password` - كلمة المرور
- `ConfirmPassword` - تأكيد كلمة المرور
- `Address` - العنوان
- `DateOfBirth` - تاريخ الميلاد

#### **الحقول الإضافية لمقدمي الخدمة:**
- `Bio` - السيرة المهنية
- `NationalId` - رقم الهوية الوطنية
- `Experience` - سنوات الخبرة
- `HourlyRate` - السعر بالساعة
- `IdDocument` - ملف الهوية (file upload)
- `Certificate` - الشهادة (file upload)
- `CVPath` - السيرة الذاتية (file upload)
- `SelectedCategoryIds` - الفئات المختارة (array)

#### **API Endpoints:**
```
User: POST http://elanis.runasp.net/api/Account/register-user
Provider: POST http://elanis.runasp.net/api/Account/register-service-provider
```

#### **ميزات التحديث:**
- ✅ إرسال البيانات بصيغة `multipart/form-data`
- ✅ رفع الملفات (ID, Certificate, CV)
- ✅ التحقق من صحة البيانات قبل الإرسال
- ✅ رسائل خطأ واضحة من الـ Backend
- ✅ حالة تحميل أثناء الإرسال
- ✅ الانتقال التلقائي لصفحة OTP عند النجاح

---

### 2. **OTPVerificationPage.tsx** 🆕
صفحة جديدة للتحقق من OTP:

#### **الميزات:**
- ✅ إدخال 6 أرقام منفصلة
- ✅ التنقل التلقائي بين الحقول
- ✅ إرسال OTP إلى API
- ✅ التحقق من النجاح والانتقال للصفحة المناسبة

#### **API Endpoint:**
```
POST http://elanis.runasp.net/api/Account/verify-otp
Body: { userId: "string", otp: "string" }
```

#### **سير العمل:**
1. المستخدم يدخل الـ 6 أرقام
2. إرسال الطلب للـ API
3. عند النجاح:
   - **User**: الانتقال لـ User Dashboard
   - **Provider**: الانتقال لـ Pending Approval Page

---

### 3. **App.tsx** 🔄
تم تحديث الملف لإضافة:
- ✅ استيراد `OTPVerificationPage`
- ✅ إضافة state لحفظ بيانات OTP
- ✅ تحديث دالة `navigate` لقبول data إضافية
- ✅ إضافة handler للتحقق من OTP
- ✅ إضافة route جديد `verify-otp`

---

## 🔄 سير العمل الكامل

### **للمستخدم العادي:**
```
Register → Fill Form → Submit → API Call → 
Success → Navigate to OTP Page → Enter OTP → 
Verify → Success → User Dashboard
```

### **لمقدم الخدمة:**
```
Register → Fill Form + Upload Files → Submit → API Call → 
Success → Navigate to OTP Page → Enter OTP → 
Verify → Success → Pending Approval Page
```

---

## 📡 API Response Handling

### **User Registration Response (201):**
```json
{
  "statusCode": 100,
  "succeeded": true,
  "message": "string",
  "data": {
    "id": "string",
    "email": "string",
    "phoneNumber": "string",
    "role": "string",
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

### **Provider Registration Response (201):**
```json
{
  "statusCode": 100,
  "succeeded": true,
  "message": "string",
  "data": {
    "applicationId": "string",
    "userId": "string",
    "email": "string",
    "status": 1,
    "createdAt": "2025-10-29T15:09:28.119Z"
  }
}
```

### **OTP Verification Response (200):**
```json
{
  "statusCode": 100,
  "succeeded": true,
  "message": "string",
  "data": true
}
```

---

## 🎨 UI/UX Features

### **ميزات تحسين تجربة المستخدم:**
- ✅ رسائل نجاح وفشل واضحة باستخدام Toast
- ✅ حالة تحميل أثناء الطلبات
- ✅ تعطيل الأزرار أثناء التحميل
- ✅ التحقق من صحة البيانات قبل الإرسال
- ✅ رسائل خطأ مفصلة من Backend
- ✅ تصميم متجاوب وجميل
- ✅ رموز توضيحية لكل حقل

---

## 🧪 للاختبار

### **1. تسجيل مستخدم عادي:**
```bash
1. انتقل لصفحة التسجيل
2. اختر "I am a User"
3. املأ جميع الحقول المطلوبة
4. اضغط "Create Account"
5. ستنتقل لصفحة OTP
6. أدخل الـ OTP المرسل للبريد
7. تحقق من الانتقال للـ Dashboard
```

### **2. تسجيل مقدم خدمة:**
```bash
1. انتقل لصفحة التسجيل
2. اختر "I am a Care Provider"
3. املأ جميع الحقول (شاملة البيانات الإضافية)
4. ارفع الملفات المطلوبة (ID, Certificate, CV)
5. اختر الفئات المناسبة
6. اضغط "Submit for Approval"
7. ستنتقل لصفحة OTP
8. أدخل الـ OTP المرسل للبريد
9. تحقق من الانتقال لصفحة Pending Approval
```

---

## ⚠️ ملاحظات مهمة

1. **الملفات المطلوبة لمقدم الخدمة:**
   - يجب رفع جميع الملفات الثلاثة (ID, Certificate, CV)
   - الصيغ المسموحة: `.pdf, .jpg, .jpeg, .png` للوثائق
   - الصيغ المسموحة: `.pdf, .doc, .docx` للـ CV

2. **الفئات:**
   - يمكن اختيار أكثر من فئة واحدة
   - استخدم Ctrl/Cmd للاختيار المتعدد

3. **العمر:**
   - يجب أن يكون بين 18-65 سنة (يتم التحقق من Backend)

4. **معلومات API:**
   - Base URL: `http://elanis.runasp.net`
   - جميع الطلبات تستخدم `multipart/form-data` للتسجيل
   - طلبات OTP تستخدم `application/json`

---

## 🚀 الميزات المستقبلية المقترحة

- [ ] إعادة إرسال OTP
- [ ] مؤقت لانتهاء صلاحية OTP
- [ ] تحميل الملفات بـ drag & drop
- [ ] معاينة الملفات قبل الرفع
- [ ] تحسين رسائل الخطأ
- [ ] إضافة Progress Bar للتحميل

---

## 📝 Summary

✅ **تم التكامل الكامل مع API الحقيقي**
✅ **جميع الحقول المطلوبة موجودة ومتصلة**
✅ **رفع الملفات يعمل بشكل صحيح**
✅ **التحقق من OTP متكامل**
✅ **التوجيه الصحيح حسب نوع المستخدم**
✅ **معالجة الأخطاء بشكل احترافي**

---

**تاريخ التكامل:** 29 أكتوبر 2025
**المطور:** Cascade AI
**الحالة:** ✅ Complete & Ready for Testing
