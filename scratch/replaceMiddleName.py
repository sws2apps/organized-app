import os
import re

regex = r"buildPersonFullname\(\s*(\w+(?:\.person_data|\.speaker_data)?)\.person_lastname\.value,\s*(\w+(?:\.person_data|\.speaker_data)?)\.person_firstname\.value,\s*(\w+)\s*\)"

def replacer(match):
    l_obj = match.group(1)
    f_obj = match.group(2)
    opt = match.group(3)
    if l_obj == f_obj:
        return f"buildPersonFullname(\n            {l_obj}.person_lastname.value,\n            {f_obj}.person_firstname.value,\n            {opt},\n            {l_obj}.person_middlename?.value\n          )"
    return match.group(0)

modified = 0
for root, _dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            new_content = re.sub(regex, replacer, content)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Modified {path}")
                modified += 1

print(f"Total modified: {modified}")
