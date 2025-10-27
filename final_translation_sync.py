#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت متقدم لمزامنة ملفات الترجمة
يقرأ هيكل ar.json ويولد en.json مطابق تماماً مع ترجمات إنجليزية ذكية
"""

import json
import re
from typing import Dict, Any, Union

class TranslationSynchronizer:
    def __init__(self):
        self.translation_map = {
            # Auth section
            "تسجيل الدخول": "Sign In",
            "إنشاء حساب": "Sign Up", 
            "البريد الإلكتروني": "Email",
            "كلمة المرور": "Password",
            "تأكيد كلمة المرور": "Confirm Password",
            "الاسم الكامل": "Full Name",
            "اللغة": "Language",
            "تسجيل الدخول": "Login",
            "تسجيل": "Register",
            "تسجيل الخروج": "Logout",
            "الملف الشخصي": "Profile",
            "لوحة التحكم": "Dashboard",
            "هل لديك حساب؟": "Already have an account?",
            "ليس لديك حساب؟": "Don't have an account?",
            "تم تسجيل الدخول بنجاح": "Login successful",
            "تم إنشاء الحساب بنجاح": "Registration successful",
            "تم تسجيل الخروج بنجاح": "Logout successful",
            "جاري التحميل...": "Loading...",
            "حدث خطأ": "An error occurred",
            "خطأ في الشبكة": "Network error",
            "مرحباً": "Welcome",
            
            # Common terms
            "الرئيسية": "Home",
            "النماذج": "Forms",
            "الإرسالات": "Submissions",
            "الإعدادات": "Settings",
            "إرسالاتي": "My Submissions",
            "حفظ": "Save",
            "إرسال": "Submit",
            "إلغاء": "Cancel",
            "تحرير": "Edit",
            "حذف": "Delete",
            "نسخ": "Duplicate",
            "معاينة": "Preview",
            "مشاركة": "Share",
            "تصدير": "Export",
            "استيراد": "Import",
            "إنشاء": "Create",
            "تحديث": "Update",
            "العنوان": "Title",
            "الاسم": "Name",
            "الوصف": "Description",
            "المسار": "Path",
            "الحالة": "Status",
            "تم الإنشاء": "Created",
            "تم التحديث": "Updated",
            "المؤلف": "Author",
            "نشط": "Active",
            "غير نشط": "Inactive",
            "مسودة": "Draft",
            "منشور": "Published",
            "معلق": "Pending",
            "مُرسل": "Submitted",
            "تمت المراجعة": "Reviewed",
            "موافق عليه": "Approved",
            "مرفوض": "Rejected",
            "خطأ": "Error",
            "نجح": "Success",
            "تحميل": "Loading",
            "مطلوب": "Required",
            "اختياري": "Optional",
            "بحث": "Search",
            "فلترة": "Filter",
            "ترتيب": "Sort",
            "تحديث": "Refresh",
            "إعادة تحميل": "Reload",
            "نسخ": "Copy",
            "لصق": "Paste",
            "قص": "Cut",
            "تراجع": "Undo",
            "إعادة": "Redo",
            "اختيار": "Select",
            "اختيار الكل": "Select All",
            "إلغاء التحديد": "Deselect All",
            "إضافة": "Add",
            "إزالة": "Remove",
            "رفع": "Upload",
            "تنزيل": "Download",
            "طباعة": "Print",
            "نقل": "Move",
            "إعادة تسمية": "Rename",
            "خصائص": "Properties",
            "تفضيلات": "Preferences",
            "مساعدة": "Help",
            "حول": "About",
            "الإصدار": "Version",
            "السمة": "Theme",
            "الإشعارات": "Notifications",
            "الحساب": "Account",
            "نسيت كلمة المرور": "Forgot Password",
            "تغيير كلمة المرور": "Change Password",
            "تحديث الملف الشخصي": "Update Profile",
            "المستخدمون": "Users",
            "التقارير": "Reports",
            "التحليلات": "Analytics",
            "الإدارة": "Administration",
            
            # Form Builder specific
            "منشئ النماذج": "Form Builder",
            "أساسي": "Basic",
            "تخطيط": "Layout",
            "بيانات": "Data",
            "متقدم": "Premium",
            "حقل نص": "Text Field",
            "منطقة نص": "Text Area",
            "رقم": "Number",
            "بريد إلكتروني": "Email",
            "كلمة مرور": "Password",
            "اختيار": "Select",
            "راديو": "Radio",
            "مربع اختيار": "Checkbox",
            "زر": "Button",
            "أعمدة": "Columns",
            "لوحة": "Panel",
            "جدول": "Table",
            "تبويبات": "Tabs",
            "حاوية": "Container",
            "شبكة بيانات": "Data Grid",
            "شبكة تحرير": "Edit Grid",
            "شجرة": "Tree",
            "استطلاع": "Survey",
            "مورد": "Resource",
            "توقيع": "Signature",
            "ملف": "File",
            "تاريخ ووقت": "Date/Time",
            "رقم هاتف": "Phone Number",
            "عنوان": "Address",
            "عملة": "Currency",
            "لوحة علامات": "Tag Pad",
            "عنصر HTML": "HTML Element",
            "محتوى": "Content",
            "مخفي": "Hidden",
            "مجموعة حقول": "Fieldset",
            "بئر": "Well",
            
            # Validation and errors
            "هذا الحقل مطلوب": "This field is required",
            "إدخال غير صحيح": "Invalid input",
            "يرجى إدخال بريد إلكتروني صحيح": "Please enter a valid email address",
            "الحد الأدنى للطول": "Minimum length",
            "الحد الأقصى للطول": "Maximum length",
            "يرجى مطابقة التنسيق المطلوب": "Please match the required format",
            "يرجى إدخال رقم صحيح": "Please enter a valid number",
            "يرجى إدخال تاريخ صحيح": "Please enter a valid date",
            "يرجى إدخال رابط صحيح": "Please enter a valid URL",
            "يرجى إدخال رقم هاتف صحيح": "Please enter a valid phone number",
            "كلمات المرور غير متطابقة": "Passwords do not match",
            "فشل التحقق المخصص": "Custom validation failed",
            
            # File operations
            "اختيار ملف": "Select File",
            "رفع": "Upload",
            "اسحب وأفلت الملفات هنا": "Drag and drop files here",
            "تصفح": "Browse",
            "إزالة": "Remove",
            "معاينة": "Preview",
            "الحد الأقصى لحجم الملف": "Maximum file size",
            "أنواع الملفات المسموحة": "Allowed file types",
            "تقدم الرفع": "Upload progress",
            "اكتمل الرفع": "Upload complete",
            "فشل الرفع": "Upload failed",
            "الملف كبير جداً": "File is too large",
            "نوع ملف غير صحيح": "Invalid file type",
            "لم يتم اختيار ملف": "No file selected",
            
            # Table operations
            "إضافة صف": "Add Row",
            "حذف صف": "Delete Row",
            "إضافة عمود": "Add Column",
            "حذف عمود": "Delete Column",
            "تحرير العنوان": "Edit Header",
            "لا توجد بيانات": "No data available",
            "جاري تحميل البيانات...": "Loading data...",
            "خطأ في تحميل البيانات": "Error loading data",
            
            # Survey operations
            "إضافة سؤال": "Add Question",
            "تحرير سؤال": "Edit Question",
            "حذف سؤال": "Delete Question",
            "نوع السؤال": "Question Type",
            "نص السؤال": "Question Text",
            "الخيارات": "Options",
            "إضافة خيار": "Add Option",
            "إزالة خيار": "Remove Option",
            "لا توجد أسئلة": "No questions added yet",
            
            # Default fallbacks
            "لا توجد مكونات": "No components",
            "ابدأ بإضافة المكونات": "Start by adding components",
            "متاح": "Available",
            "اسحب للإضافة": "Drag to add",
            "اختر مكون للتحرير": "Select a component to edit",
            "محدد": "Selected",
            "اختبر نموذجك": "Test your form",
            "نموذج بدون عنوان": "Untitled form",
            "وقت الإرسال": "Submission time",
            "عرض بيانات الإرسال": "View submission data",
            "عرض العنصر": "View item",
            "القيمة": "Value",
            "خاصية القيمة": "Value property",
            "رابط": "URL",
            "إدخال رابط": "URL input",
            "عنوان المعاينة": "Preview title",
            "المعاينة جاهزة": "Preview ready",
        }
    
    def smart_translate(self, arabic_text: str) -> str:
        """ترجمة ذكية للنصوص العربية إلى الإنجليزية"""
        if not isinstance(arabic_text, str):
            return str(arabic_text)
        
        # البحث عن ترجمة مباشرة
        if arabic_text in self.translation_map:
            return self.translation_map[arabic_text]
        
        # البحث عن ترجمة جزئية
        for ar_key, en_value in self.translation_map.items():
            if ar_key in arabic_text:
                return arabic_text.replace(ar_key, en_value)
        
        # ترجمات تلقائية بناءً على الأنماط
        patterns = {
            r'تم (.+) بنجاح': r'\1 successful',
            r'فشل في (.+)': r'Failed to \1',
            r'خطأ في (.+)': r'Error in \1',
            r'جاري (.+)\.\.\.': r'\1...',
            r'لا توجد (.+)': r'No \1',
            r'عرض (.+)': r'View \1',
            r'إضافة (.+)': r'Add \1',
            r'حذف (.+)': r'Delete \1',
            r'تحرير (.+)': r'Edit \1',
            r'إنشاء (.+)': r'Create \1',
            r'تحديث (.+)': r'Update \1',
        }
        
        for pattern, replacement in patterns.items():
            if re.search(pattern, arabic_text):
                return re.sub(pattern, replacement, arabic_text)
        
        # إذا لم نجد ترجمة، نعيد النص الأصلي مع تحذير
        print(f"⚠️ لم يتم العثور على ترجمة لـ: {arabic_text}")
        return arabic_text
    
    def translate_structure(self, obj: Union[Dict, str, Any]) -> Union[Dict, str, Any]:
        """ترجمة هيكل كامل من العربية للإنجليزية"""
        if isinstance(obj, dict):
            result = {}
            for key, value in obj.items():
                result[key] = self.translate_structure(value)
            return result
        elif isinstance(obj, str):
            return self.smart_translate(obj)
        else:
            return obj
    
    def synchronize_translations(self, ar_file_path: str, en_file_path: str):
        """مزامنة ملفات الترجمة"""
        try:
            # قراءة الملف العربي
            with open(ar_file_path, 'r', encoding='utf-8') as f:
                ar_data = json.load(f)
            
            print(f"📖 تم قراءة {len(ar_data)} قسم رئيسي من ar.json")
            
            # ترجمة الهيكل كاملاً
            print("🔄 جاري ترجمة الهيكل...")
            en_data = self.translate_structure(ar_data)
            
            # كتابة الملف الإنجليزي الجديد
            with open(en_file_path, 'w', encoding='utf-8') as f:
                json.dump(en_data, f, ensure_ascii=False, indent=2)
            
            print(f"✅ تم إنشاء en.json مع {len(en_data)} قسم رئيسي")
            
            # التحقق من صحة JSON
            with open(en_file_path, 'r', encoding='utf-8') as f:
                json.load(f)
            print("✅ تم التحقق من صحة JSON")
            
            return True
            
        except Exception as e:
            print(f"❌ خطأ في المزامنة: {e}")
            return False

def main():
    """الدالة الرئيسية"""
    synchronizer = TranslationSynchronizer()
    
    ar_file = '/home/mohammed/form/formio/src/locales/ar.json'
    en_file = '/home/mohammed/form/formio/src/locales/en.json'
    
    print("🚀 بدء مزامنة ملفات الترجمة...")
    success = synchronizer.synchronize_translations(ar_file, en_file)
    
    if success:
        print("🎉 تمت المزامنة بنجاح!")
    else:
        print("💥 فشلت المزامنة!")
    
    return success

if __name__ == "__main__":
    main()
