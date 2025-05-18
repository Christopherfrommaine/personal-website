
import os

files = os.listdir("dist/assets/compositions/")

if "" in files:
    files.remove("")

def read_file(path):
    with open("dist/assets/compositions/" + path, 'r') as f:
        contents = f.read()
    return contents

def date_of_song(s):
    if s + ".date" not in files:
        print(s, "date file not found")
        return 0
    
    month_map = {
        'january': 1, 'jan': 1,
        'february': 2, 'feb': 2,
        'march': 3, 'mar': 3,
        'april': 4, 'apr': 4,
        'may': 5,
        'june': 6, 'jun': 6,
        'july': 7, 'jul': 7,
        'august': 8, 'aug': 8,
        'september': 9, 'sep': 9, 'sept': 9,
        'october': 10, 'oct': 10,
        'november': 11, 'nov': 11,
        'december': 12, 'dec': 12
    }
    
    date_string = read_file(s + ".date")

    day = 1
    month = 1
    year = 0

    for name, num in month_map.items():
        if name in s.lower():
            month = num
            break
    
    digits = [int(part) for part in date_string.split() if part.isdigit()]
    if len(digits) == 1:
        year = digits[0]
    if len(digits) == 2:
        day = digits[0]
        year = digits[1]
    if len(digits) == 3:
        month = digits[0]
        day = digits[1]
        year = digits[2]
    
    day_index = day + 31 * month + 365 * year

    return day_index


songs = list({s.split(".")[0] for s in files})
if "" in songs:
    songs.remove("")

songs.sort(key=lambda s: -date_of_song(s))

def generate_html(s):
    date = read_file(s + ".date") if s + ".date" in files else ""
    o = f"<div class=composition-name><h2>{s} </h2><h3>{date.strip()}</h3></div>\n"
    o += "<div class=composition-files>\n"

    file_map = [
        (".mp4", "Video"),
        (".mov", "Video"),
        (".recording", "Recording"),
        (".pdf", "Score"),
        (".mp3", "Audio"),
        (".xml", "XML"),
        (".mscz", "MuseScore")
    ]

    for k, v in file_map:
        filename = None
        for f in files:
            if s + k in f:
                filename = f
                break
        
        if filename:
            o += f"  <a href=\"/assets/compositions/{filename}\" target=\"_blank\">{v}</a>\n"
    
    o += "</div>\n\n"

    return o

generated_content = "\n"
for s in songs:
    generated_content += generate_html(s)
generated_content += "    "

with open("dist/music/compositions/index.html", "r") as f:
    index_content = f.read()

position_start = min([i for i in range(len(index_content)) if "<generated>" in index_content[:i]] + [len(index_content)])
position_end   = min([i for i in range(len(index_content)) if "</generated>" in index_content[:i]] + [len(index_content)]) - 12


updated_content = index_content[:position_start] + generated_content + index_content[position_end:]

with open("dist/music/compositions/index.html", "w") as f:
    f.write(updated_content)

