async function updateDownloadCount() {
    try {
        const response = await fetch(`https://crates.io/api/v1/crates/cgrustplot`);
        const data = await response.json();
        let counter = document.getElementById("download-count");

        if (counter) {
            counter.textContent = data.crate.downloads;
        }
        
    } catch (error) {
        console.error("Error fetching download count:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateDownloadCount();
});