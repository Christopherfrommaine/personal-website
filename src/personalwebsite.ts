// Background effect for the personal website page
document.addEventListener("DOMContentLoaded", function() {
    fetch('/projects/personal-website/index.txt')
      .then(response => response.text())
      .then(data => {
        const code = document.getElementById('code');
        
        if (code) {
            code.textContent = data;
        }
      })
      .catch(error => console.error('Error fetching file:', error));
  });  