# From:
# (cat dist/projects/personal-website/index.html; echo \"\"; echo \"\"; cat dist/projects/personal-website/styles.css; echo \"\"; echo \"\"; cat src/main.ts) > dist/projects/personal-website/index.txt

import os

def read_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    return content

def write_to_file(file_path, content):
    with open(file_path, 'w') as file:
        file.write(content)

dir = os.getcwd() + "/dist/projects/personal-website/"

o = "```index.html\n" + read_file(dir + "index.html") + "\n```\n\n" + \
    "```styles.css\n" + read_file(dir + "styles.css") + "\n```\n\n" + \
    "```main.ts\n"    + read_file(os.getcwd() + "/src/main.ts") + "\n```"

write_to_file(dir + "webpage-source.txt", o)
