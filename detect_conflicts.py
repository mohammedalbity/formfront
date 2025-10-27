#!/usr/bin/env python3
import json
import re

def find_duplicate_keys_in_file(file_path):
    """البحث عن مفاتيح مكررة في ملف JSON"""
    print(f"🔍 فحص المفاتيح المكررة في {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # البحث عن المفاتيح المكررة باستخدام regex
    key_pattern = r'"([^"]+)"\s*:'
    keys = re.findall(key_pattern, content)
    
    # العثور على المفاتيح المكررة
    seen_keys = {}
    duplicates = []
    
    for i, key in enumerate(keys):
        if key in seen_keys:
            duplicates.append((key, seen_keys[key], i))
        else:
            seen_keys[key] = i
    
    if duplicates:
        print(f"  ❌ تم العثور على {len(duplicates)} مفتاح مكرر:")
        for key, first_pos, second_pos in duplicates[:10]:  # أول 10 فقط
            print(f"    - '{key}' (المواضع: {first_pos}, {second_pos})")
        if len(duplicates) > 10:
            print(f"    ... و {len(duplicates) - 10} مفاتيح مكررة أخرى")
    else:
        print(f"  ✅ لا توجد مفاتيح مكررة")
    
    return duplicates

def check_json_structure(file_path):
    """فحص بنية JSON للتأكد من صحتها"""
    print(f"\n🔍 فحص بنية JSON في {file_path}...")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"  ✅ بنية JSON صحيحة")
        return True, data
    except json.JSONDecodeError as e:
        print(f"  ❌ خطأ في بنية JSON: {e}")
        return False, None

def find_structural_issues():
    """البحث عن مشاكل هيكلية في الملفات"""
    print("🔍 البحث عن المشاكل الهيكلية...\n")
    
    # فحص الملف الإنجليزي
    en_duplicates = find_duplicate_keys_in_file('src/locales/en.json')
    en_valid, en_data = check_json_structure('src/locales/en.json')
    
    # فحص الملف العربي
    ar_duplicates = find_duplicate_keys_in_file('src/locales/ar.json')
    ar_valid, ar_data = check_json_structure('src/locales/ar.json')
    
    # فحص التضارب في المحتوى
    if en_valid and ar_valid:
        print(f"\n🔍 فحص التضارب في المحتوى...")
        
        # فحص أقسام محددة قد تحتوي على مشاكل
        problematic_sections = []
        
        for section in ['formBuilder', 'componentLabels', 'componentDescriptions']:
            if section in en_data and section in ar_data:
                en_section = en_data[section]
                ar_section = ar_data[section]
                
                if isinstance(en_section, dict) and isinstance(ar_section, dict):
                    en_keys = set(en_section.keys())
                    ar_keys = set(ar_section.keys())
                    
                    if en_keys != ar_keys:
                        problematic_sections.append(section)
                        missing_in_ar = en_keys - ar_keys
                        extra_in_ar = ar_keys - en_keys
                        
                        print(f"  ❌ تضارب في قسم '{section}':")
                        if missing_in_ar:
                            print(f"    مفقود في ar.json: {list(missing_in_ar)[:5]}")
                        if extra_in_ar:
                            print(f"    زائد في ar.json: {list(extra_in_ar)[:5]}")
        
        if not problematic_sections:
            print(f"  ✅ لا توجد تضاربات في المحتوى")
    
    return {
        'en_duplicates': en_duplicates,
        'ar_duplicates': ar_duplicates,
        'en_valid': en_valid,
        'ar_valid': ar_valid
    }

def check_formbuilder_section():
    """فحص مفصل لقسم formBuilder"""
    print(f"\n🔍 فحص مفصل لقسم formBuilder...")
    
    try:
        with open('src/locales/en.json', 'r', encoding='utf-8') as f:
            en_data = json.load(f)
        
        with open('src/locales/ar.json', 'r', encoding='utf-8') as f:
            ar_data = json.load(f)
        
        if 'formBuilder' in en_data and 'formBuilder' in ar_data:
            en_fb = en_data['formBuilder']
            ar_fb = ar_data['formBuilder']
            
            print(f"  📊 إحصائيات formBuilder:")
            print(f"    en.json: {len(en_fb)} مفتاح رئيسي")
            print(f"    ar.json: {len(ar_fb)} مفتاح رئيسي")
            
            # فحص المفاتيح الفرعية المهمة
            important_keys = ['componentLabels', 'componentDescriptions', 'messages', 'validation']
            
            for key in important_keys:
                if key in en_fb and key in ar_fb:
                    en_subkeys = len(en_fb[key]) if isinstance(en_fb[key], dict) else 1
                    ar_subkeys = len(ar_fb[key]) if isinstance(ar_fb[key], dict) else 1
                    
                    status = "✅" if en_subkeys == ar_subkeys else "❌"
                    print(f"    {status} {key}: en={en_subkeys}, ar={ar_subkeys}")
                elif key in en_fb:
                    print(f"    ❌ {key}: موجود في en.json فقط")
                elif key in ar_fb:
                    print(f"    ❌ {key}: موجود في ar.json فقط")
    
    except Exception as e:
        print(f"  ❌ خطأ في فحص formBuilder: {e}")

if __name__ == "__main__":
    results = find_structural_issues()
    check_formbuilder_section()
    
    print(f"\n📋 ملخص النتائج:")
    if results['en_duplicates'] or results['ar_duplicates']:
        print(f"  ❌ تم العثور على مفاتيح مكررة")
    else:
        print(f"  ✅ لا توجد مفاتيح مكررة")
    
    if results['en_valid'] and results['ar_valid']:
        print(f"  ✅ بنية JSON صحيحة في كلا الملفين")
    else:
        print(f"  ❌ مشاكل في بنية JSON")
