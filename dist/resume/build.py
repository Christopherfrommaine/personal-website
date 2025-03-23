import re

with open("dist/assets/generatedresume.html", "r") as f:
    generated_content = f.read().strip()

with open("dist/resume/index.html", "r") as f:
    index_content = f.read()

updated_content = re.sub(
    r'(<div class="generated">)(.*?)(</div>)',
    rf'\1\n  {generated_content}\n\3',
    index_content,
    flags=re.DOTALL
)

with open("dist/resume/index.html", "w") as f:
    f.write(updated_content)
