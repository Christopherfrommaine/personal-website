document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("myButton");

    if (button) {
        button.addEventListener("click", () => {
            alert("Button clicked!");
        });
    } else {
        console.error("Button not found.");
    }
});
