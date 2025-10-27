#!/usr/bin/env python3
import json
import re
from collections import OrderedDict

def remove_duplicate_keys_from_text(text):
    """إزالة المفاتيح المكررة من نص JSON مع الحفاظ على آخر قيمة"""
    lines = text.split('\n')
    seen_keys = {}
    result_lines = []
    current_object_level = 0
    
    for line_num, line in enumerate(lines):
        # تتبع مستوى الكائن
        current_object_level += line.count('{') - line.count('}')
        
        # البحث عن مفاتيح JSON
        key_match = re.match(r'^(\s*)"([^"]+)"\s*:\s*(.*)$', line)
        
        if key_match:
            indent, key, value = key_match.groups()
            
            # إنشاء مفتاح فريد يتضمن المستوى والمسار
            unique_key = f"{current_object_level}:{key}"
            
            if unique_key in seen_keys:
                # تحديث القيمة بدلاً من إضافة مكرر
                old_line_num = seen_keys[unique_key]
                print(f"  🔄 تحديث مفتاح مكرر '{key}' في السطر {line_num + 1} (كان في السطر {old_line_num + 1})")
                # استبدال السطر القديم بالجديد
                result_lines[old_line_num] = line
            else:
                seen_keys[unique_key] = len(result_lines)
                result_lines.append(line)
        else:
            result_lines.append(line)
    
    return '\n'.join(result_lines)

def fix_json_file(file_path):
    """إصلاح ملف JSON من المفاتيح المكررة"""
    print(f"🔧 إصلاح الملف: {file_path}")
    
    # قراءة الملف الأصلي
    with open(file_path, 'r', encoding='utf-8') as f:
        original_content = f.read()
    
    # إنشاء نسخة احتياطية
    backup_path = f"{file_path}.backup"
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(original_content)
    print(f"  💾 تم إنشاء نسخة احتياطية: {backup_path}")
    
    # إزالة المفاتيح المكررة
    fixed_content = remove_duplicate_keys_from_text(original_content)
    
    # التحقق من صحة JSON
    try:
        json.loads(fixed_content)
        print(f"  ✅ JSON صحيح بعد الإصلاح")
        
        # حفظ الملف المُصلح
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        print(f"  💾 تم حفظ الملف المُصلح")
        return True
        
    except json.JSONDecodeError as e:
        print(f"  ❌ خطأ في JSON بعد الإصلاح: {e}")
        
        # استعادة النسخة الأصلية
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(original_content)
        
        print(f"  🔄 تم استعادة النسخة الأصلية")
        return False

def rebuild_json_properly(file_path):
    """إعادة بناء ملف JSON بشكل صحيح"""
    print(f"🏗️ إعادة بناء الملف: {file_path}")
    
    try:
        # قراءة وتحليل JSON
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # إعادة كتابة JSON بتنسيق صحيح
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2, separators=(',', ': '))
        
        print(f"  ✅ تم إعادة بناء الملف بنجاح")
        return True
        
    except Exception as e:
        print(f"  ❌ خطأ في إعادة البناء: {e}")
        return False

def main():
    """الدالة الرئيسية لإصلاح ملفات الترجمة"""
    print("🔧 بدء إصلاح المفاتيح المكررة في ملفات الترجمة...\n")
    
    files_to_fix = [
        'src/locales/en.json',
        'src/locales/ar.json'
    ]
    
    success_count = 0
    
    for file_path in files_to_fix:
        print(f"{'='*50}")
        
        # الطريقة الأولى: إعادة بناء JSON
        if rebuild_json_properly(file_path):
            success_count += 1
        else:
            # الطريقة الثانية: إصلاح يدوي
            if fix_json_file(file_path):
                success_count += 1
        
        print()
    
    print(f"{'='*50}")
    print(f"📊 النتائج النهائية:")
    print(f"  ✅ ملفات مُصلحة: {success_count}/{len(files_to_fix)}")
    
    if success_count == len(files_to_fix):
        print(f"  🎉 تم إصلاح جميع الملفات بنجاح!")
    else:
        print(f"  ⚠️ بعض الملفات تحتاج إصلاح يدوي")

if __name__ == "__main__":
    main()
