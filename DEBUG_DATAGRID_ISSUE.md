# تشخيص مشكلة اختفاء بيانات DataGrid

## المشكلة
بعد تطبيق التحسينات على عرض بيانات DataGrid، اختفت البيانات من الواجهة.

## التشخيص المطبق

### 1. إضافة Logging مفصل لدالة `isDatagridData`
```javascript
const isDatagridData = (value: any[]): boolean => {
  if (!Array.isArray(value) || value.length === 0) {
    console.log('🔍 isDatagridData: Not array or empty')
    return false
  }

  const firstItem = value[0]
  if (typeof firstItem !== 'object' || firstItem === null) {
    console.log('🔍 isDatagridData: First item is not object')
    return false
  }

  const firstKeys = Object.keys(firstItem)
  console.log('🔍 isDatagridData: First item keys:', firstKeys)

  const result = similarItems.length >= Math.ceil(value.length * 0.8)
  console.log('🔍 isDatagridData result:', result, `(${similarItems.length}/${value.length} items match)`)
  return result
}
```

### 2. إضافة Logging مفصل لدالة `getDatagridColumns`
```javascript
const getDatagridColumns = (value: any[]): string[] => {
  console.log('🏗️ DataGrid data received:', value)

  // First, try to get columns from _components
  if (firstRow._components && Array.isArray(firstRow._components)) {
    console.log('🏗️ Using component keys from _components:', componentKeys)
    return componentKeys
  }

  // Fallback logging
  console.log('🏗️ DataGrid columns (all keys):', result)
  return result
}
```

## خطوات الاختبار

### 1. فتح Developer Tools
- اضغط F12 أو Ctrl+Shift+I
- اذهب إلى تبويب Console

### 2. فتح صفحة الإرسالات
- اذهب إلى صفحة Form Submissions
- ابحث عن إرسالات تحتوي على DataGrid

### 3. فحص Console Logs
ابحث عن الرسائل التالية:

#### إذا كانت البيانات تُكتشف بشكل صحيح:
```
🔍 isDatagridData: First item keys: ["_isEmpty", "_rowId", "_components", "textarea_123", "column_456"]
🔍 isDatagridData result: true (1/1 items match)
🏗️ DataGrid data received: [{...}]
🏗️ Using component keys from _components: ["textarea_123", "column_456"]
```

#### إذا كانت هناك مشكلة:
```
🔍 isDatagridData: Not array or empty
// أو
🔍 isDatagridData: First item is not object
// أو
🔍 isDatagridData result: false (0/1 items match)
```

## الحلول المحتملة

### إذا كانت المشكلة في `isDatagridData`:
- البيانات لا تُكتشف كـ DataGrid
- قد نحتاج لتعديل شروط الكشف

### إذا كانت المشكلة في `getDatagridColumns`:
- الأعمدة لا تُستخرج بشكل صحيح
- قد نحتاج لتحسين استخراج المفاتيح

### إذا كانت البيانات فارغة تماماً:
- مشكلة في API أو تحميل البيانات
- قد نحتاج للتحقق من مصدر البيانات

## البيانات المتوقعة
بناءً على البيانات التي أرسلها المستخدم:
```json
{
  "datagrid_1758437954101_v8oyo8013": [
    {
      "_isEmpty": false,
      "_rowId": "row_1758437960246_mvzjbrob6",
      "_components": [
        {
          "type": "textarea",
          "key": "textarea_1758437963319_2os58ijq3",
          "label": "منطقة نص"
        }
      ],
      "textarea_1758437963319_2os58ijq3": null,
      "column_1758437970761_x839tcme7": "سيؤميةبر"
    }
  ]
}
```

## النتيجة المتوقعة بعد الإصلاح
- عرض جدول DataGrid مع أسماء أعمدة مفهومة
- استخراج labels من _components
- عرض البيانات بشكل صحيح مع معالجة القيم الفارغة

## الخطوة التالية
اختبر في بيئة التطوير وأرسل نتائج console.log لتحديد السبب الدقيق للمشكلة.
