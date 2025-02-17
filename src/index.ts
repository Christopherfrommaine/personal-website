const skills: string[] = [
    "HTML5 & CSS3",
    "JavaScript & TypeScript",
    "React & Next.js",
    "Node.js & Express",
    "UI/UX Design",
  ]
  
  function populateSkills(): void {
    const skillsList = document.getElementById("skills-list")
    if (skillsList) {
      skills.forEach((skill) => {
        const li = document.createElement("li")
        li.textContent = skill
        skillsList.appendChild(li)
      })
    }
  }
  
  function setCurrentYear(): void {
    const yearSpan = document.getElementById("current-year")
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear().toString()
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    populateSkills()
    setCurrentYear()
  })
  
  