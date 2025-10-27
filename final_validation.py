#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت التحقق النهائي من مزامنة ملفات الترجمة
يتحقق من صحة JSON والتطابق في الهيكل بين ar.json و en.json
"""

import json
import os
from typing import Dict, Any, Set

def get_all_keys(obj: Any, prefix: str = '') -> Set[str]:
    """استخراج جميع المفاتيح من كائن JSON بشكل تسلسلي"""
    keys = set()
    
    if isinstance(obj, dict):
        for key, value in obj.items():
            full_key = f"{prefix}.{key}" if prefix else key
            keys.add(full_key)
            keys.update(get_all_keys(value, full_key))
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            keys.update(get_all_keys(item, f"{prefix}[{i}]"))
    
    return keys

def validate_json_file(file_path: str) -> tuple[bool, Dict[str, Any]]:
    """التحقق من صحة ملف JSON"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return True, data
    except json.JSONDecodeError as e:
        print(f"❌ خطأ في JSON في {file_path}: {e}")
        return False, {}
    except FileNotFoundError:
        print(f"❌ الملف غير موجود: {file_path}")
        return False, {}

def main():
    """الدالة الرئيسية للتحقق"""
    print("🔍 بدء التحقق النهائي من ملفات الترجمة...")
    
    ar_file = '/home/mohammed/form/formio/src/locales/ar.json'
    en_file = '/home/mohammed/form/formio/src/locales/en.json'
    
    # التحقق من صحة الملفات
    print("\n📋 التحقق من صحة JSON...")
    ar_valid, ar_data = validate_json_file(ar_file)
    en_valid, en_data = validate_json_file(en_file)
    
    if not ar_valid or not en_valid:
        print("💥 فشل في التحقق من صحة الملفات!")
        return False
    
    print("✅ جميع ملفات JSON صحيحة")
    
    # استخراج المفاتيح
    print("\n🔑 استخراج المفاتيح...")
    ar_keys = get_all_keys(ar_data)
    en_keys = get_all_keys(en_data)
    
    print(f"📊 عدد المفاتيح في ar.json: {len(ar_keys)}")
    print(f"📊 عدد المفاتيح في en.json: {len(en_keys)}")
    
    # مقارنة المفاتيح
    common_keys = ar_keys & en_keys
    ar_only = ar_keys - en_keys
    en_only = en_keys - ar_keys
    
    print(f"🤝 المفاتيح المشتركة: {len(common_keys)}")
    print(f"🔴 مفاتيح في ar.json فقط: {len(ar_only)}")
    print(f"🔵 مفاتيح في en.json فقط: {len(en_only)}")
    
    # عرض المفاتيح المختلفة إن وجدت
    if ar_only:
        print("\n🔴 مفاتيح موجودة في ar.json فقط:")
        for key in sorted(list(ar_only)[:10]):  # عرض أول 10 فقط
            print(f"  - {key}")
        if len(ar_only) > 10:
            print(f"  ... و {len(ar_only) - 10} مفتاح آخر")
    
    if en_only:
        print("\n🔵 مفاتيح موجودة في en.json فقط:")
        for key in sorted(list(en_only)[:10]):  # عرض أول 10 فقط
            print(f"  - {key}")
        if len(en_only) > 10:
            print(f"  ... و {len(en_only) - 10} مفتاح آخر")
    
    # النتيجة النهائية
    print(f"\n{'='*50}")
    if len(ar_keys) == len(en_keys) and len(ar_only) == 0 and len(en_only) == 0:
        print("🎉 مزامنة مثالية! جميع المفاتيح متطابقة")
        sync_status = "مثالية"
    elif abs(len(ar_keys) - len(en_keys)) <= 5:
        print("✅ مزامنة جيدة مع اختلافات طفيفة")
        sync_status = "جيدة"
    else:
        print("⚠️ توجد اختلافات كبيرة تحتاج مراجعة")
        sync_status = "تحتاج مراجعة"
    
    # معلومات إضافية
    ar_size = os.path.getsize(ar_file)
    en_size = os.path.getsize(en_file)
    
    print(f"\n📈 إحصائيات الملفات:")
    print(f"  ar.json: {ar_size:,} بايت")
    print(f"  en.json: {en_size:,} بايت")
    print(f"  الفرق: {abs(ar_size - en_size):,} بايت")
    print(f"  حالة المزامنة: {sync_status}")
    
    # فحص بعض المفاتيح المهمة
    important_keys = [
        'formBuilder.componentLabels',
        'formBuilder.componentDescriptions',
        'submissions.status',
        'auth.signIn',
        'validation.required'
    ]
    
    print(f"\n🔍 فحص المفاتيح المهمة:")
    for key in important_keys:
        ar_has = key in ar_keys
        en_has = key in en_keys
        status = "✅" if ar_has and en_has else "❌"
        print(f"  {status} {key}: AR={ar_has}, EN={en_has}")
    
    return sync_status == "مثالية" or sync_status == "جيدة"

if __name__ == "__main__":
    success = main()
    print(f"\n{'🎉 نجح التحقق!' if success else '💥 فشل التحقق!'}")
