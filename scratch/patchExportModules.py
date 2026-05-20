import os

files_to_patch = [
    "src/features/reports/publisher_records/export_S21/specific_records/inactive_publishers/useInactivePublishers.tsx",
    "src/features/reports/publisher_records/export_S21/specific_records/field_service_groups/useFieldServiceGroups.tsx",
    "src/features/reports/publisher_records/export_S21/specific_records/active_publishers/useActivePublishers.tsx",
    "src/features/reports/hooks/usePublisherCard.tsx",
    "src/features/congregation/field_service_groups/export_groups/useExportGroups.tsx"
]

for file_path in files_to_patch:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the usages
        content = content.replace("formatNameInAppState", "formatNamePrintState")
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {file_path}")
    else:
        print(f"File not found: {file_path}")
