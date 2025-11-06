# Debug Guide - "Error retrieving provider requests" 🔍

## المشكلة الحالية 🔴

```
❌ Error: "Error retrieving provider requests"
❌ Requests tab: "No requests yet"
```

---

## خطوات الفحص (Step by Step) 🔍

### الخطوة 1: افتح Developer Console

```
1. اضغط F12 في المتصفح
2. اذهب لـ Console tab
3. اضغط Refresh في الصفحة
4. اضغط على Requests tab
```

### الخطوة 2: شوف الـ Console Logs

**ابحث عن:**

```javascript
// ✅ Log 1: Provider ID
"Fetching requests for provider: {uuid}"

// ✅ Log 2: Response Status
"Response status: 200" or "Response status: 401" or "Response status: 404"

// ✅ Log 3: Response Data
"Response data: { ... }"
```

---

## التشخيص حسب الـ Console Output 🩺

### السيناريو 1: مفيش logs خالص ❌
```
Console: (فاضي)
```

**المشكلة:** الكود مش بيوصل للـ fetch أصلاً

**الحل:**
```javascript
// Check:
console.log('Dashboard Data:', dashboardData);
console.log('Profile ID:', dashboardData?.profileId);
```

**احتمالات:**
- ✅ `profileId` null → Dashboard مش محمل
- ✅ Token expired → Login تاني

---

### السيناريو 2: Response Status 401 🔐
```
Console:
"Fetching requests for provider: abc123..."
"Response status: 401"
"Response data: { succeeded: false, message: 'Unauthorized' }"
```

**المشكلة:** Authentication failed

**الحل:**
1. **Check Token:**
   ```javascript
   console.log(localStorage.getItem('accessToken'));
   ```

2. **Login مرة تانية:**
   - Token expired
   - Logout → Login again

3. **Check Token Role:**
   ```javascript
   // Token يجب يحتوي على Role = "Provider"
   // Decode token في jwt.io
   ```

---

### السيناريو 3: Response Status 404 🚫
```
Console:
"Fetching requests for provider: abc123..."
"Response status: 404"
"Response data: { succeeded: false, message: 'Provider not found' }"
```

**المشكلة:** Provider ID غلط أو مش موجود

**الحل:**
1. **Check Provider ID:**
   ```javascript
   console.log('Provider ID:', dashboardData?.profileId);
   ```

2. **Verify في Dashboard API:**
   ```
   GET /api/Provider/dashboard
   Response should contain: profileId
   ```

3. **Check Database:**
   ```sql
   SELECT * FROM ServiceProviderProfiles 
   WHERE Id = 'your-provider-id';
   ```

---

### السيناريو 4: Response Status 200 لكن Data فاضي ✅❓
```
Console:
"Fetching requests for provider: abc123..."
"Response status: 200"
"Response data: { succeeded: true, data: [] }"
"Transformed requests: []"
```

**المشكلة:** مفيش requests فعلاً! (مش error)

**الحل:**
- ده normal behavior
- Provider ده مفيش عنده requests بجد
- جرب Provider تاني أو اعمل request جديد من User side

---

### السيناريو 5: Response Status 500 💥
```
Console:
"Fetching requests for provider: abc123..."
"Response status: 500"
"Response data: { succeeded: false, message: 'Internal server error' }"
```

**المشكلة:** Backend error!

**الحل:**
1. **Check Backend Logs:**
   ```
   Look for exception in backend console
   ```

2. **Common Backend Issues:**
   - Database connection failed
   - Query error
   - Null reference exception
   - Missing includes in EF query

3. **Test في Swagger:**
   ```
   GET /api/Requests/provider/{providerId}
   ```

---

### السيناريو 6: Network Error ⚡
```
Console:
"Fetching requests for provider: abc123..."
"Error fetching provider requests: TypeError: Failed to fetch"
```

**المشكلة:** Can't reach backend

**الحل:**
1. **Check Backend Running:**
   ```
   Backend should be running on https://elanis.runasp.net
   ```

2. **Check Network:**
   - Internet connection
   - Firewall
   - CORS settings

3. **Check URL:**
   ```typescript
   // Should be:
   'https://elanis.runasp.net/api/Requests/provider/{id}'
   // NOT:
   'http://...' or 'https://elanis.runasp.net/Requests/...'
   ```

---

## Frontend vs Backend - أين المشكلة؟ 🤔

### ✅ المشكلة من الـ Frontend إذا:

1. **Console shows:**
   ```
   "Waiting for dashboard data to load..."
   ```
   → **Fix:** Dashboard data not loaded

2. **Console shows:**
   ```
   "Fetching requests for provider: undefined"
   ```
   → **Fix:** profileId is undefined

3. **Network tab shows:**
   ```
   Request URL: https://elanis.runasp.net/api/Requests/provider/undefined
   ```
   → **Fix:** profileId issue

---

### ✅ المشكلة من الـ Backend إذا:

1. **Console shows:**
   ```
   "Response status: 500"
   ```
   → **Fix:** Backend error, check backend logs

2. **Console shows:**
   ```
   "Response status: 404"
   "Response data: { message: 'Provider not found' }"
   ```
   → **Fix:** Provider ID doesn't exist in database

3. **Swagger gives same error:**
   ```
   Test in Swagger → Same 500/404 error
   ```
   → **Fix:** Backend issue

---

## Quick Test في Swagger 🧪

### Test 1: Get Dashboard
```
GET /api/Provider/dashboard
Authorization: Bearer {your-token}

Expected Response:
{
  "succeeded": true,
  "data": {
    "profileId": "abc-123-...",
    ...
  }
}
```

**Copy the `profileId` from response!**

---

### Test 2: Get Provider Requests
```
GET /api/Requests/provider/{profileId}
Authorization: Bearer {your-token}

Expected Response:
{
  "succeeded": true,
  "data": [
    {
      "id": "...",
      "providerName": "...",
      "categoryName": "...",
      "status": 1,
      ...
    }
  ]
}
```

---

### Test 3: Compare IDs
```javascript
// From Dashboard:
profileId: "abc-123-def-456"

// In Requests URL:
/api/Requests/provider/abc-123-def-456

// ✅ Must match!
```

---

## الحلول الشائعة 🔧

### حل 1: Refresh Token
```javascript
// Logout
localStorage.clear();

// Login again
// New token will be generated
```

---

### حل 2: Clear State
```javascript
// في Console:
localStorage.clear();
window.location.reload();
```

---

### حل 3: Check Database
```sql
-- Check if provider exists
SELECT * FROM ServiceProviderProfiles 
WHERE UserId = 'your-user-id';

-- Check if requests exist for provider
SELECT * FROM ServiceRequests 
WHERE ServiceProviderId = 'your-provider-id';
```

---

### حل 4: Backend Fix (إذا كان المشكلة من الباك)

#### في ServiceProviderService.cs - GetProviderRequests:
```csharp
public async Task<Response<List<ServiceRequestDto>>> GetProviderRequests(Guid providerId)
{
    try
    {
        var provider = await _unitOfWork.ServiceProviderProfiles
            .FindSingleAsync(p => p.Id == providerId);
            
        if (provider == null)
            return _responseHandler.NotFound<List<ServiceRequestDto>>("Provider not found");
        
        var requests = await _unitOfWork.Repository<ServiceRequest>()
            .GetQueryable()
            .Where(r => r.ServiceProviderId == providerId)
            .Include(r => r.User)
            .Include(r => r.Category)
            .ToListAsync();
        
        // Map to DTO...
        
        return _responseHandler.Success(dtos, "Requests retrieved successfully");
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error getting provider requests");
        return _responseHandler.ServerError<List<ServiceRequestDto>>("Error retrieving requests");
    }
}
```

---

## ملخص سريع للفحص ⚡

```bash
# 1. Open Console (F12)

# 2. Refresh page

# 3. Click Requests tab

# 4. Look for these logs:
   "Fetching requests for provider: {id}"  ← Should appear
   "Response status: {code}"                ← Check code
   "Response data: {...}"                   ← Check data

# 5. Diagnose:
   - 401 → Login again
   - 404 → Provider ID wrong
   - 500 → Backend error
   - 200 + empty data → No requests (normal)
   - Network error → Backend not running
```

---

## الخطوة التالية 🚀

### ✅ اعمل الآتي:

1. **افتح Console** (F12)
2. **Refresh** الصفحة
3. **اضغط Requests** tab
4. **صور** الـ Console output
5. **ابعتلي** الصورة عشان أقدر أحدد المشكلة بالظبط!

---

**المفروض تشوف logs في Console زي:**
```
Waiting for dashboard data to load...
Fetching requests for provider: abc-123-def-456
Response status: 200
Response data: { succeeded: true, data: [...] }
Transformed requests: [...]
```

**لو مش شايف الـ logs دي، ابعتلي screenshot من Console!** 📸

---

**Status:** 🔍 Waiting for Console logs  
**Next:** Screenshot من Console بعد الضغط على Requests tab
