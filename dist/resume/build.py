import re

with open("dist/assets/generatedresume.html", "r") as f:
    generated_content = "\n" + f.read().strip() + "\n    "

with open("dist/resume/index.html", "r") as f:
    index_content = f.read()

updated_content = re.sub(
    r'(<generated>)(.*?)(</generated>)',
    rf'\1\n  {generated_content}\n\3',
    index_content,
    flags=re.DOTALL
)

with open("dist/resume/index.html", "w") as f:
    f.write(updated_content)
