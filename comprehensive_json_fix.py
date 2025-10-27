#!/usr/bin/env python3
"""
Comprehensive script to fix all duplicate keys in JSON translation files
"""

import json
import re
from collections import OrderedDict

def parse_json_with_duplicates(content):
    """
    Parse JSON content that may contain duplicate keys by keeping only the last occurrence
    """
    # Use a custom JSON decoder that handles duplicates
    def dict_raise_on_duplicates(ordered_pairs):
        """Convert list of key-value pairs to dict, keeping last occurrence of duplicates"""
        result = {}
        for key, value in ordered_pairs:
            if key in result:
                print(f"  🔄 Overwriting duplicate key: '{key}'")
            result[key] = value
        return result
    
    try:
        # Parse JSON with duplicate handling
        data = json.loads(content, object_pairs_hook=dict_raise_on_duplicates)
        return data
    except json.JSONDecodeError as e:
        print(f"  ❌ JSON parsing failed: {e}")
        return None

def clean_json_structure(file_path):
    """
    Clean JSON file by removing duplicate keys and organizing structure properly
    """
    print(f"🔧 Cleaning JSON structure in {file_path}...")
    
    try:
        # Read the file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Parse with duplicate handling
        data = parse_json_with_duplicates(content)
        
        if data is None:
            print(f"  ❌ Could not parse JSON file")
            return False
        
        # Clean and reorganize the structure
        cleaned_data = reorganize_structure(data)
        
        # Write the cleaned JSON back
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(cleaned_data, f, indent=2, ensure_ascii=False, sort_keys=False)
        
        print(f"  ✅ Successfully cleaned JSON structure")
        return True
        
    except Exception as e:
        print(f"  ❌ Error cleaning file: {e}")
        return False

def reorganize_structure(data):
    """
    Reorganize JSON structure to ensure proper hierarchy and no duplicates
    """
    if not isinstance(data, dict):
        return data
    
    # Create a clean structure
    cleaned = OrderedDict()
    
    # Define the expected top-level structure for translation files
    expected_sections = [
        'nav', 'home', 'form', 'signature', 'auth', 'forms', 'formBuilder',
        'submissions', 'userSubmissions', 'publicForm', 'validation', 
        'messages', 'errors', 'componentLabels', 'componentDescriptions',
        'placeholders', 'defaultLabels', 'footer'
    ]
    
    # Process each expected section
    for section in expected_sections:
        if section in data:
            cleaned[section] = clean_nested_dict(data[section])
    
    # Add any remaining sections that weren't in the expected list
    for key, value in data.items():
        if key not in cleaned:
            cleaned[key] = clean_nested_dict(value)
    
    return cleaned

def clean_nested_dict(obj):
    """
    Recursively clean nested dictionaries
    """
    if isinstance(obj, dict):
        cleaned = OrderedDict()
        for key, value in obj.items():
            cleaned[key] = clean_nested_dict(value)
        return cleaned
    elif isinstance(obj, list):
        return [clean_nested_dict(item) for item in obj]
    else:
        return obj

def validate_json_file(file_path):
    """
    Validate that the JSON file is now properly formatted
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            json.load(f)
        print(f"  ✅ {file_path} is now valid JSON")
        return True
    except json.JSONDecodeError as e:
        print(f"  ❌ {file_path} still has JSON errors: {e}")
        return False

def count_keys(obj, level=0):
    """
    Count total keys in nested structure
    """
    if not isinstance(obj, dict):
        return 0
    
    count = len(obj)
    for value in obj.values():
        if isinstance(value, dict):
            count += count_keys(value, level + 1)
    
    return count

def main():
    """Main function"""
    print("🔧 Starting comprehensive JSON duplicate key fix...")
    
    files_to_fix = [
        '/home/mohammed/form/formio/src/locales/en.json',
        '/home/mohammed/form/formio/src/locales/ar.json'
    ]
    
    success_count = 0
    
    for file_path in files_to_fix:
        print(f"\n📁 Processing {file_path}...")
        
        # Count keys before
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                original_data = parse_json_with_duplicates(f.read())
            if original_data:
                original_key_count = count_keys(original_data)
                print(f"  📊 Original key count: {original_key_count}")
        except:
            original_key_count = "unknown"
        
        # Clean the file
        if clean_json_structure(file_path):
            # Validate the result
            if validate_json_file(file_path):
                # Count keys after
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        cleaned_data = json.load(f)
                    cleaned_key_count = count_keys(cleaned_data)
                    print(f"  📊 Cleaned key count: {cleaned_key_count}")
                except:
                    cleaned_key_count = "unknown"
                
                success_count += 1
            else:
                print(f"  ❌ File validation failed")
        else:
            print(f"  ❌ File cleaning failed")
    
    print(f"\n📊 Final Results:")
    print(f"  ✅ Files processed successfully: {success_count}/{len(files_to_fix)}")
    
    if success_count == len(files_to_fix):
        print("🎉 All duplicate key issues have been resolved!")
        print("💡 Your JSON files are now clean and valid.")
    else:
        print("⚠️ Some files could not be fixed completely")

if __name__ == "__main__":
    main()
