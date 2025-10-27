#!/usr/bin/env python3
import json

def get_main_keys_order(file_path):
    """استخراج ترتيب المفاتيح الرئيسية من ملف JSON"""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return list(data.keys())

def compare_key_orders():
    """مقارنة ترتيب المفاتيح بين الملفين"""
    print("🔍 فحص ترتيب المفاتيح الرئيسية...\n")
    
    en_keys = get_main_keys_order('src/locales/en.json')
    ar_keys = get_main_keys_order('src/locales/ar.json')
    
    print("📋 ترتيب المفاتيح في en.json:")
    for i, key in enumerate(en_keys, 1):
        print(f"  {i:2d}. {key}")
    
    print("\n📋 ترتيب المفاتيح في ar.json:")
    for i, key in enumerate(ar_keys, 1):
        print(f"  {i:2d}. {key}")
    
    print(f"\n📊 الإحصائيات:")
    print(f"  عدد المفاتيح في en.json: {len(en_keys)}")
    print(f"  عدد المفاتيح في ar.json: {len(ar_keys)}")
    
    # فحص الاختلافات في الترتيب
    print(f"\n🔍 فحص الاختلافات:")
    
    if en_keys == ar_keys:
        print("  ✅ الترتيب متطابق تماماً")
    else:
        print("  ❌ هناك اختلاف في الترتيب")
        
        # العثور على الاختلافات
        for i, (en_key, ar_key) in enumerate(zip(en_keys, ar_keys)):
            if en_key != ar_key:
                print(f"    الموضع {i+1}: en='{en_key}' vs ar='{ar_key}'")
        
        # فحص المفاتيح المفقودة أو الزائدة
        en_set = set(en_keys)
        ar_set = set(ar_keys)
        
        missing_in_ar = en_set - ar_set
        extra_in_ar = ar_set - en_set
        
        if missing_in_ar:
            print(f"    مفاتيح مفقودة في ar.json: {missing_in_ar}")
        if extra_in_ar:
            print(f"    مفاتيح زائدة في ar.json: {extra_in_ar}")

if __name__ == "__main__":
    compare_key_orders()
