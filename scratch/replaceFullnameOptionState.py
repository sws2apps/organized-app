import os
import re

replacements = {
    "fullnameOptionState": "formatNameInAppState"
}

modified = 0
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            new_content = content
            for old, new in replacements.items():
                new_content = re.sub(r'\b' + re.escape(old) + r'\b', new, new_content)
            
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Modified {path}")
                modified += 1

print(f"Total modified: {modified}")
