# A set of things locally which should be run every once in a while to keep the website up to date.

# Copy compositions to assets
cp -r ~/Documents/Scores/Finished dist/assets/
rm -r dist/assets/compositions
mv dist/assets/Finished dist/assets/compositions

# Process Compositions
python3 dist/music/compositions/build.py

# Combine files into text for display
python3 dist/projects/personal-website/build.py

# Update assets with newest paper
cp ~/Programming/LaTeX/Universal\ Quantum\ Gates/UniversalQuantumGates.pdf dist/assets/

# Generate resume and update resume/index.html
cp ~/Documents/Obsidian/Notes/Resume.md dist/assets/
pandoc -o dist/assets/generatedresume.html dist/assets/Resume.md
python3 dist/resume/build.py
rm dist/assets/generatedresume.html
pandoc -o dist/assets/resume.pdf dist/assets/Resume.md --pdf-engine=xelatex