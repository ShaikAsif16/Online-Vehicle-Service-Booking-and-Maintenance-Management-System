import os
import re

with open("scripts/build_docx_report.py", "r", encoding="utf-8") as f:
    content = f.read()

# Replace .jpg with .png in Project_Screenshots paths
updated = re.sub(r'Project_Screenshots/(Fig_7_[0-9]+_[A-Za-z0-9_]+)\.jpg', r'Project_Screenshots/\1.png', content)

with open("scripts/build_docx_report.py", "w", encoding="utf-8") as f:
    f.write(updated)

print("Updated script image extensions to .png")
