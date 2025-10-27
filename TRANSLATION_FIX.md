# إصلاح مشكلة الترجمة

## المشكلة
الترجمات (Previous, Next, Search) تظهر بالإنجليزية بدلاً من العربية

## السبب
اللغة الحالية في التطبيق هي **English**

---

## ✅ الحل 1: تغيير اللغة في التطبيق

### من خلال الواجهة:
1. ابحث عن أيقونة اللغة في Header
2. اضغط عليها
3. اختر **العربية**

### من خلال Browser Console:
```javascript
// افتح Console (F12)
localStorage.setItem('user_language', 'ar')
location.reload()
```

---

## ✅ الحل 2: تغيير اللغة الافتراضية

### في Profile:
1. اذهب إلى صفحة Profile
2. غيّر اللغة إلى "العربية"
3. احفظ التغييرات

---

## 🔍 التحقق من اللغة الحالية

### في Browser Console:
```javascript
// تحقق من اللغة المخزنة
console.log('Stored language:', localStorage.getItem('user_language'))

// تحقق من لغة المستخدم
const userData = JSON.parse(localStorage.getItem('user_data'))
console.log('User language:', userData?.language)

// تحقق من الترجمات
console.log('Search translation:', document.querySelector('[aria-label]'))
```

---

## 📝 الترجمات الموجودة

### Arabic (ar.json):
```json
"common": {
  "search": "البحث",
  "loading": "جاري التحميل...",
  "error": "خطأ",
  "success": "نجاح",
  "previous": "السابق",
  "next": "التالي"
}
```

### English (en.json):
```json
"common": {
  "search": "Search",
  "loading": "Loading...",
  "error": "Error",
  "success": "Success",
  "previous": "Previous",
  "next": "Next"
}
```

---

## 🎯 الحل السريع

### في Browser Console:
```javascript
// 1. تغيير اللغة
localStorage.setItem('user_language', 'ar')

// 2. تحديث بيانات المستخدم
const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
userData.language = 'ar'
localStorage.setItem('user_data', JSON.stringify(userData))

// 3. إعادة تحميل الصفحة
location.reload()
```

---

## ✅ بعد التطبيق

يجب أن ترى:
- ✅ "البحث" بدلاً من "Search"
- ✅ "السابق" بدلاً من "Previous"
- ✅ "التالي" بدلاً من "Next"
- ✅ جميع النصوص بالعربية

---

## 🔧 إذا لم يعمل

### تأكد من:
1. ملف `ar.json` محمّل بشكل صحيح
2. i18n مُهيأ بشكل صحيح
3. اللغة الافتراضية مضبوطة

### للتحقق:
```javascript
// في Console
console.log(window.$i18n?.locale)
console.log(window.$i18n?.messages)
```

---

## 💡 نصيحة

أضف هذا الكود في `main.ts` لضبط اللغة تلقائياً:

```typescript
// Set language from user preferences
const storedLang = localStorage.getItem('user_language')
const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
const userLang = userData.language || storedLang || 'ar' // default to Arabic

i18n.global.locale.value = userLang as 'ar' | 'en'
```

---

الآن جرب الحل السريع وأخبرني بالنتيجة! 🎉
