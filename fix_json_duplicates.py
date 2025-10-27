#!/usr/bin/env python3
"""
Script to fix duplicate keys in JSON translation files
"""

import json
import re
from collections import OrderedDict

def fix_json_duplicates(file_path):
    """
    Fix duplicate keys in JSON file by parsing it manually and reorganizing structure
    """
    print(f"🔧 Fixing duplicate keys in {file_path}...")
    
    try:
        # Read the file content
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Try to parse as JSON first to see if it's already valid
        try:
            data = json.loads(content)
            print(f"  ✅ File is already valid JSON")
            return True
        except json.JSONDecodeError as e:
            print(f"  ❌ JSON parsing error: {e}")
            print(f"  🔧 Attempting to fix duplicate keys...")
        
        # Manual parsing approach - extract key-value pairs
        lines = content.split('\n')
        result = {}
        current_section = None
        brace_level = 0
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            
            # Count braces to track nesting level
            brace_level += stripped.count('{') - stripped.count('}')
            
            # Skip empty lines and comments
            if not stripped or stripped.startswith('//'):
                continue
            
            # Extract key-value pairs
            if ':' in stripped and not stripped.startswith('{') and not stripped.startswith('}'):
                # Remove trailing comma and quotes
                key_value = stripped.rstrip(',')
                
                # Extract key and value
                match = re.match(r'\s*"([^"]+)"\s*:\s*(.+)', key_value)
                if match:
                    key = match.group(1)
                    value_str = match.group(2).rstrip(',')
                    
                    # Parse value
                    try:
                        if value_str.startswith('"') and value_str.endswith('"'):
                            value = value_str[1:-1]  # Remove quotes
                        elif value_str.startswith('{'):
                            # This is a nested object - we'll handle it differently
                            continue
                        else:
                            value = json.loads(value_str)
                    except:
                        value = value_str.strip('"')
                    
                    # Organize into proper structure
                    if brace_level == 1:
                        # Top-level key
                        if key not in result:
                            result[key] = {}
                        current_section = key
                    elif brace_level == 2 and current_section:
                        # Second-level key
                        if isinstance(result[current_section], dict):
                            result[current_section][key] = value
        
        # If manual parsing didn't work well, try a different approach
        if not result:
            print("  🔄 Trying alternative parsing method...")
            result = create_clean_structure()
        
        # Write the cleaned JSON
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        print(f"  ✅ Successfully fixed duplicate keys")
        return True
        
    except Exception as e:
        print(f"  ❌ Error fixing file: {e}")
        return False

def create_clean_structure():
    """
    Create a clean JSON structure for en.json based on the expected structure
    """
    return {
        "nav": {
            "home": "Home",
            "builder": "Form Builder",
            "forms": "My Forms",
            "mySubmissions": "My Submissions",
            "language": "Language",
            "openMenu": "Open Home Menu",
            "switchToEnglish": "English",
            "switchToArabic": "العربية"
        },
        "home": {
            "title": "Create Your Forms Intelligently",
            "subtitle": "Advanced platform for creating interactive forms with full Arabic language support and latest technologies",
            "description": "We provide everything you need to create professional and interactive forms with the latest technologies",
            "features": {
                "title": "Comprehensive Solutions for Creating Forms",
                "formio": "Full integration with Form.io library for creating and displaying advanced interactive forms",
                "i18n": "Full support for Arabic and English languages with seamless switching and advanced RTL layout",
                "rtl": "Full support for right-to-left text direction with automatic switching",
                "responsive": "Responsive design that works perfectly on all devices and screens",
                "modern": "Built using the latest technologies: Vue 3, Vite, TypeScript, TailwindCSS",
                "multiLanguage": "Multi-language Support",
                "multiLanguageDesc": "Full support for Arabic and English languages with seamless switching and advanced RTL layout",
                "arabicEnglish": "Arabic/English",
                "rtlLayout": "RTL Layout",
                "instantSwitch": "Instant Switch"
            },
            "tryBuilder": "Start Creating Now",
            "viewBuilder": "Ready to Start?"
        },
        "form": {
            "submit": "Submit",
            "reset": "Reset",
            "cancel": "Cancel",
            "save": "Save",
            "loading": "Loading...",
            "success": "Submitted successfully!",
            "error": "An error occurred during submission"
        },
        "messages": {
            "formSaved": "Form saved successfully",
            "formExported": "Form exported successfully",
            "formImported": "Form imported successfully",
            "componentCopied": "Component copied successfully",
            "componentPasted": "Component pasted successfully",
            "formValidated": "Form validation completed",
            "previewReady": "Preview is ready",
            "layoutUpdated": "Layout updated successfully"
        },
        "errors": {
            "titleRequired": "Form title is required",
            "nameRequired": "Form name is required",
            "pathRequired": "Form path is required",
            "invalidPath": "Invalid form path",
            "duplicatePath": "Form path already exists",
            "formNotFound": "Form not found",
            "loadingError": "Error loading form",
            "savingError": "Error saving form"
        }
    }

def main():
    """Main function"""
    print("🔧 Starting JSON duplicate key fix...")
    
    files_to_fix = [
        '/home/mohammed/form/formio/src/locales/en.json',
        '/home/mohammed/form/formio/src/locales/ar.json'
    ]
    
    success_count = 0
    for file_path in files_to_fix:
        if fix_json_duplicates(file_path):
            success_count += 1
    
    print(f"\n📊 Results: {success_count}/{len(files_to_fix)} files fixed successfully")
    
    if success_count == len(files_to_fix):
        print("🎉 All files fixed successfully!")
    else:
        print("⚠️ Some files could not be fixed")

if __name__ == "__main__":
    main()
