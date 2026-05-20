import os
import re

replacements = {
    "FullnameOption.FIRST_BEFORE_LAST": "FormatNameOption.FIRST_LAST",
    "FullnameOption.LAST_BEFORE_FIRST": "FormatNameOption.LAST_FIRST",
    "FullnameOption | FormatNameOption": "FormatNameOption",
    "FullnameOption ": "FormatNameOption ",
    "FullnameOption;": "FormatNameOption;",
    "FullnameOption,": "FormatNameOption,",
    "FullnameOption\n": "FormatNameOption\n",
    "import { FullnameOption }": "import { FormatNameOption }",
    "import { FirstDayWeekOption, FullnameOption }": "import { FirstDayWeekOption, FormatNameOption }",
    "import { FormatNameOption, FullnameOption }": "import { FormatNameOption }",
    "export enum FullnameOption {\n  FIRST_BEFORE_LAST = 1,\n  LAST_BEFORE_FIRST = 2,\n}\n\n": ""
}

modified = 0
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
            
            # fix import combining
            new_content = new_content.replace("import { FormatNameOption } from '@definition/settings';\nimport { FormatNameOption } from '@definition/settings';", "import { FormatNameOption } from '@definition/settings';")
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Modified {path}")
                modified += 1

print(f"Total modified: {modified}")
