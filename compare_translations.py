#!/usr/bin/env python3
"""
Translation files comparison script for Form.io Vue.js project
Compares ar.json and en.json to find structural differences and missing keys
"""

import json
import sys
from pathlib import Path

def load_json_file(file_path):
    """Load and parse JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return None

def get_all_keys(obj, prefix=""):
    """Recursively get all keys from nested object"""
    keys = set()
    if isinstance(obj, dict):
        for key, value in obj.items():
            current_key = f"{prefix}.{key}" if prefix else key
            keys.add(current_key)
            if isinstance(value, dict):
                keys.update(get_all_keys(value, current_key))
    return keys

def compare_translation_files(ar_file, en_file):
    """Compare Arabic and English translation files"""
    print("🔍 Loading translation files...")
    
    ar_data = load_json_file(ar_file)
    en_data = load_json_file(en_file)
    
    if not ar_data or not en_data:
        print("❌ Failed to load one or both translation files")
        return False
    
    print("✅ Both files loaded successfully")
    
    # Get all keys from both files
    ar_keys = get_all_keys(ar_data)
    en_keys = get_all_keys(en_data)
    
    print(f"\n📊 Translation Statistics:")
    print(f"Arabic keys: {len(ar_keys)}")
    print(f"English keys: {len(en_keys)}")
    
    # Find missing keys
    missing_in_ar = en_keys - ar_keys
    missing_in_en = ar_keys - en_keys
    common_keys = ar_keys & en_keys
    
    print(f"Common keys: {len(common_keys)}")
    print(f"Missing in Arabic: {len(missing_in_ar)}")
    print(f"Missing in English: {len(missing_in_en)}")
    
    # Report missing keys
    if missing_in_ar:
        print(f"\n❌ Keys missing in Arabic (ar.json):")
        for key in sorted(missing_in_ar):
            print(f"  - {key}")
    
    if missing_in_en:
        print(f"\n❌ Keys missing in English (en.json):")
        for key in sorted(missing_in_en):
            print(f"  - {key}")
    
    if not missing_in_ar and not missing_in_en:
        print("\n✅ Perfect synchronization! Both files have identical key structures.")
        return True
    else:
        print(f"\n⚠️ Found {len(missing_in_ar) + len(missing_in_en)} discrepancies between files.")
        return False

def main():
    """Main function"""
    # Define file paths
    ar_file = Path("src/locales/ar.json")
    en_file = Path("src/locales/en.json")
    
    print("🌍 Form.io Translation Files Comparison")
    print("=" * 50)
    
    # Check if files exist
    if not ar_file.exists():
        print(f"❌ Arabic file not found: {ar_file}")
        return 1
    
    if not en_file.exists():
        print(f"❌ English file not found: {en_file}")
        return 1
    
    # Compare files
    success = compare_translation_files(ar_file, en_file)
    
    if success:
        print("\n🎉 Translation files are perfectly synchronized!")
        return 0
    else:
        print("\n🔧 Translation files need synchronization.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
