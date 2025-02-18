// Replace global-header elements with global/header.html
document.addEventListener('DOMContentLoaded', function() {
    const headerElement = document.getElementById('global-header');
    
    if (headerElement) {
      fetch('global/header.html')
        .then(response => response.text())
        .then(data => {
          headerElement.innerHTML = data;
        })
        .catch(error => console.error('Error loading global header:', error));
    } else {
      console.warn('Global header element not found on the page');
    }
  });
