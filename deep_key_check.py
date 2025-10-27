#!/usr/bin/env python3
import json

def get_all_keys_with_paths(data, prefix=""):
    """استخراج جميع المفاتيح مع مساراتها الكاملة"""
    keys = []
    if isinstance(data, dict):
        for key, value in data.items():
            current_path = f"{prefix}.{key}" if prefix else key
            keys.append(current_path)
            if isinstance(value, dict):
                keys.extend(get_all_keys_with_paths(value, current_path))
    return keys

def compare_detailed_structure():
    """مقارنة تفصيلية لبنية الملفين"""
    print("🔍 فحص تفصيلي لبنية الملفين...\n")
    
    with open('src/locales/en.json', 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    
    with open('src/locales/ar.json', 'r', encoding='utf-8') as f:
        ar_data = json.load(f)
    
    en_keys = get_all_keys_with_paths(en_data)
    ar_keys = get_all_keys_with_paths(ar_data)
    
    print(f"📊 إجمالي المفاتيح:")
    print(f"  en.json: {len(en_keys)} مفتاح")
    print(f"  ar.json: {len(ar_keys)} مفتاح")
    
    # فحص الاختلافات في الترتيب
    print(f"\n🔍 فحص الاختلافات في الترتيب:")
    
    differences_found = False
    max_check = min(len(en_keys), len(ar_keys))
    
    for i in range(max_check):
        if i < len(en_keys) and i < len(ar_keys):
            if en_keys[i] != ar_keys[i]:
                if not differences_found:
                    print("  ❌ اختلافات في الترتيب:")
                    differences_found = True
                print(f"    الموضع {i+1:3d}: en='{en_keys[i]}' vs ar='{ar_keys[i]}'")
                
                # إظهار أول 10 اختلافات فقط
                if differences_found and i > 10:
                    print("    ... (المزيد من الاختلافات)")
                    break
    
    if not differences_found:
        print("  ✅ الترتيب متطابق تماماً")
    
    # فحص المفاتيح المفقودة أو الزائدة
    en_set = set(en_keys)
    ar_set = set(ar_keys)
    
    missing_in_ar = en_set - ar_set
    extra_in_ar = ar_set - en_set
    
    if missing_in_ar:
        print(f"\n❌ مفاتيح مفقودة في ar.json ({len(missing_in_ar)}):")
        for key in sorted(missing_in_ar)[:10]:  # أول 10 فقط
            print(f"    - {key}")
        if len(missing_in_ar) > 10:
            print(f"    ... و {len(missing_in_ar) - 10} مفاتيح أخرى")
    
    if extra_in_ar:
        print(f"\n⚠️ مفاتيح زائدة في ar.json ({len(extra_in_ar)}):")
        for key in sorted(extra_in_ar)[:10]:  # أول 10 فقط
            print(f"    + {key}")
        if len(extra_in_ar) > 10:
            print(f"    ... و {len(extra_in_ar) - 10} مفاتيح أخرى")
    
    if not missing_in_ar and not extra_in_ar:
        print(f"\n✅ جميع المفاتيح موجودة في كلا الملفين")

def check_specific_sections():
    """فحص أقسام محددة قد تحتوي على مشاكل"""
    print(f"\n🔍 فحص أقسام محددة...")
    
    with open('src/locales/en.json', 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    
    with open('src/locales/ar.json', 'r', encoding='utf-8') as f:
        ar_data = json.load(f)
    
    # فحص قسم formBuilder
    if 'formBuilder' in en_data and 'formBuilder' in ar_data:
        en_fb_keys = list(en_data['formBuilder'].keys())
        ar_fb_keys = list(ar_data['formBuilder'].keys())
        
        print(f"\n📋 قسم formBuilder:")
        print(f"  en.json: {len(en_fb_keys)} مفتاح")
        print(f"  ar.json: {len(ar_fb_keys)} مفتاح")
        
        if en_fb_keys != ar_fb_keys:
            print("  ❌ ترتيب مختلف في formBuilder")
            # إظهار أول 5 اختلافات
            for i, (en_key, ar_key) in enumerate(zip(en_fb_keys, ar_fb_keys)):
                if en_key != ar_key:
                    print(f"    الموضع {i+1}: en='{en_key}' vs ar='{ar_key}'")
                    if i >= 4:  # أول 5 فقط
                        break
        else:
            print("  ✅ ترتيب متطابق في formBuilder")

if __name__ == "__main__":
    compare_detailed_structure()
    check_specific_sections()
