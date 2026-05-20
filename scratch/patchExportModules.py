import os
import shutil

files_to_patch = [
    "src/features/reports/publisher_records/export_S21/specific_records/inactive_publishers/useInactivePublishers.tsx",
    "src/features/reports/publisher_records/export_S21/specific_records/field_service_groups/useFieldServiceGroups.tsx",
    "src/features/reports/publisher_records/export_S21/specific_records/active_publishers/useActivePublishers.tsx",
    "src/features/reports/hooks/usePublisherCard.tsx",
    "src/features/congregation/field_service_groups/export_groups/useExportGroups.tsx"
]

for file_path in files_to_patch:
    if os.path.exists(file_path):
        try:
            # Create a backup
            backup_path = file_path + ".bak"
            shutil.copy2(file_path, backup_path)
            
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace the usages
            new_content = content.replace("formatNameInAppState", "formatNamePrintState")
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Patched {file_path}")
            else:
                print(f"No replacement occurred in {file_path}")
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
    else:
        print(f"File not found: {file_path}")
