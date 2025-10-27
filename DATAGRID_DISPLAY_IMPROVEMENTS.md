# تحسينات عرض بيانات DataGrid في FormSubmissions.vue

## المشكلة الأساسية
كانت بيانات DataGrid المخزونة في قاعدة البيانات تظهر بالمفاتيح التقنية (مثل `column_1758437970761_x839tcme7`) بدلاً من الـ labels المفهومة (مثل "منطقة نص").

## بنية البيانات المخزونة
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
        },
        {
          "key": "textarea_1758437967489_p353mcyt7",
          "type": "textarea",
          "input": true,
          "tableView": true,
          "label": "منطقة نص",
          "validate": {"required": false},
          "rows": 3,
          "placeholder": "أدخل النص...",
          "spellcheck": true
        }
      ],
      "textarea_1758437963319_2os58ijq3": null,
      "textarea_1758437967489_p353mcyt7": null,
      "column_1758437970761_x839tcme7": "سيؤميةبر",
      "column_1758437972461_ep83ly474": "يمبىيمب",
      "textfield_1758437958659_ehubeocbc": "نستيؤىسيؤ"
    }
  ]
}
```

## التحسينات المطبقة

### 1. تحسين دالة `getDatagridColumns`
- **قبل**: كانت تعرض جميع المفاتيح بما في ذلك المفاتيح التقنية
- **بعد**: تستخرج أسماء الأعمدة من `_components` أولاً، ثم تعطي أولوية للمفاتيح ذات المعنى

```javascript
const getDatagridColumns = (value: any[]): string[] => {
  // أولاً: استخراج أسماء الأعمدة من _components (الأكثر دقة)
  const firstRow = value[0]
  if (firstRow && firstRow._components && Array.isArray(firstRow._components)) {
    const componentKeys = firstRow._components.map(comp => comp.key).filter(Boolean)
    if (componentKeys.length > 0) {
      return componentKeys
    }
  }
  
  // احتياطي: جمع المفاتيح مع إعطاء أولوية للمفاتيح ذات المعنى
  // ...
}
```

### 2. تحسين دالة `getDatagridFieldLabel`
- **قبل**: كانت تبحث في schema النموذج أولاً
- **بعد**: تبحث في `_components` في البيانات المرسلة أولاً (الأكثر دقة)

```javascript
const getDatagridFieldLabel = (fieldKey: string, datagridValue?: any[]): string => {
  // أولوية 1: البحث في datagridValue المرسل (الأكثر دقة)
  if (datagridValue && Array.isArray(datagridValue)) {
    for (const row of datagridValue) {
      if (row._components && Array.isArray(row._components)) {
        for (const comp of row._components) {
          if (comp.key === fieldKey && comp.label) {
            return comp.label
          }
        }
        break // كسر بعد فحص الصف الأول
      }
    }
  }
  
  // أولوية 2: البحث في selectedSubmission
  // أولوية 3: البحث في form schema
  // ...
}
```

### 3. تحسين عرض القيم الفارغة
- **قبل**: كانت تعرض `-` للقيم الفارغة
- **بعد**: تعرض "لا توجد بيانات" مترجمة حسب اللغة

```javascript
// قبل
<span v-else class="text-gray-400 italic">-</span>

// بعد  
<span v-else class="text-gray-400 italic text-xs">{{ t('submissions.noData') }}</span>
```

## النتائج المتوقعة

### قبل التحسينات:
| column_1758437970761_x839tcme7 | column_1758437972461_ep83ly474 | textarea_1758437963319_2os58ijq3 |
|-------------------------------|-------------------------------|----------------------------------|
| سيؤميةبر                      | يمبىيمب                       | -                                |

### بعد التحسينات:
| منطقة نص | منطقة نص | حقل نص |
|---------|---------|--------|
| سيؤميةبر | يمبىيمب | لا توجد بيانات |

## آلية العمل الجديدة

1. **استخراج الأعمدة**: `getDatagridColumns` تستخرج أسماء الأعمدة من `_components`
2. **استخراج التسميات**: `getDatagridFieldLabel` تستخرج labels من `_components` 
3. **عرض البيانات**: القيم تُعرض مع معالجة خاصة للقيم الفارغة
4. **الترجمة**: جميع النصوص مترجمة حسب اللغة المحددة

## الفوائد

- ✅ عرض أسماء أعمدة مفهومة بدلاً من المفاتيح التقنية
- ✅ استخراج labels من البيانات المخزونة مباشرة
- ✅ معالجة أفضل للقيم الفارغة والـ null
- ✅ دعم كامل للترجمة العربية والإنجليزية
- ✅ أولوية ذكية لمصادر البيانات المختلفة
- ✅ logging مفصل لتسهيل التشخيص

## ملاحظات للاختبار

1. تأكد من وجود بيانات DataGrid في الإرسالات
2. افحص console.log للتأكد من استخراج labels بشكل صحيح
3. اختبر مع بيانات تحتوي على قيم فارغة ومليئة
4. اختبر التبديل بين اللغتين العربية والإنجليزية

## الملفات المُحدثة
- `/src/views/FormSubmissions.vue`: تحسين دوال عرض DataGrid
