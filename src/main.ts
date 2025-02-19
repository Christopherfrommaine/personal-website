// Replace global-header elements with global/global-header.html
document.addEventListener('DOMContentLoaded', function() {
    const headerElement = document.getElementById('global-header');
    
    if (headerElement) {
      fetch('/global/global-header.html')
        .then(response => response.text())
        .then(data => {
          headerElement.innerHTML = data;
        })
        .catch(error => console.error('Error loading global header:', error));
    } else {
      console.warn('Global header element not found on the page');
    }
  });

// Replace global-footer elements with global/global-footer.html
document.addEventListener('DOMContentLoaded', function() {
  const headerElement = document.getElementById('global-footer');
  
  if (headerElement) {
    fetch('/global/global-footer.html')
      .then(response => response.text())
      .then(data => {
        headerElement.innerHTML = data;
      })
      .catch(error => console.error('Error loading global footer:', error));
  } else {
    console.warn('Global footer element not found on the page');
  }
});


document.addEventListener("DOMContentLoaded", function() {
  document.body.classList.add("loaded");
});