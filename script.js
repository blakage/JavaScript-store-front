let currentImageIndex = 1; // Start with the first image

function changeImage(offset) {
    currentImageIndex += offset;
    
    // Define your image paths here, e.g., image1.jpg, image2.jpg, etc.
    const imagePaths = ["frontend/Assets/Vault2.png", "frontend/Assets/Vault3.png", "frontend/Assets/Vault.png"];

    if (currentImageIndex < 0) {
        currentImageIndex = imagePaths.length - 1;
    } else if (currentImageIndex >= imagePaths.length) {
        currentImageIndex = 0;
    }

    const mainImage = document.getElementById("main-image");
    mainImage.src = imagePaths[currentImageIndex];
}