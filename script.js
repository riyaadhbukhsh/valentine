// Get elements
const initialScreen = document.getElementById('initial-screen');
const revealButton = document.getElementById('reveal-button');
const yesButton = document.getElementById('yes-button');
const noButton = document.getElementById('no-button');
const questionScreen = document.getElementById('question-screen');
const successScreen = document.getElementById('success-screen');

// Track if question screen is active
let questionScreenActive = false;

// Function to move the no button to a random position inside the buttons container
function moveNoButton() {
    if (!questionScreenActive) return;

    const buttonsContainer = questionScreen.querySelector('.buttons');
    if (!buttonsContainer) return;

    // Get button dimensions
    const buttonWidth = noButton.offsetWidth;
    const buttonHeight = noButton.offsetHeight;

    // Get container dimensions
    const containerWidth = buttonsContainer.offsetWidth;
    const containerHeight = buttonsContainer.offsetHeight;

    // Calculate maximum positions to keep button within the buttons container
    const maxX = containerWidth - buttonWidth - 10; // 10px padding
    const maxY = containerHeight - buttonHeight - 10;

    // Generate random position within the container
    const randomX = Math.max(10, Math.random() * maxX);
    const randomY = Math.max(10, Math.random() * maxY);

    // Apply position with transition (slower speed)
    noButton.style.transition = 'all 0.2s ease-out';
    noButton.style.left = `${randomX}px`;
    noButton.style.top = `${randomY}px`;
}

// Initialize no button to be centered below the yes button
function initializeNoButton() {
    const buttonsContainer = questionScreen.querySelector('.buttons');
    if (!buttonsContainer) return;

    // Center horizontally in the container
    const containerWidth = buttonsContainer.offsetWidth;
    const noButtonWidth = noButton.offsetWidth;
    const noButtonX = (containerWidth - noButtonWidth) / 2;

    // Position 70px from top to be very close below the yes button
    const noButtonY = 180;

    noButton.style.transition = 'none';
    noButton.style.left = `${noButtonX}px`;
    noButton.style.top = `${noButtonY}px`;
}

// Handle reveal button click
revealButton.addEventListener('click', () => {
    initialScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');
    questionScreenActive = true;

    // Initialize no button position after showing question screen
    setTimeout(() => {
        initializeNoButton();
    }, 150);
});

// Make no button run away on mouse enter
noButton.addEventListener('mouseenter', () => {
    if (questionScreenActive) {
        moveNoButton();
    }
});

// Also move on mouse movement near the button (for better chase effect)
let lastMoveTime = 0;
const moveDelay = 150; // Milliseconds between moves

// Function to check distance and move button
function checkDistanceAndMove(clientX, clientY) {
    if (!questionScreenActive) return;

    const currentTime = Date.now();
    if (currentTime - lastMoveTime < moveDelay) {
        return; // Skip if we moved too recently
    }

    const buttonRect = noButton.getBoundingClientRect();

    // Calculate distance from pointer to button center
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;

    const distance = Math.sqrt(
        Math.pow(clientX - buttonCenterX, 2) +
        Math.pow(clientY - buttonCenterY, 2)
    );

    // If pointer is within 120px of the button, move it away
    if (distance < 120) {
        moveNoButton();
        lastMoveTime = currentTime;
    }
}

// Mouse support for desktop
document.addEventListener('mousemove', (e) => {
    checkDistanceAndMove(e.clientX, e.clientY);
});

// Touch support for mobile/iPhone
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        checkDistanceAndMove(touch.clientX, touch.clientY);
    }
}, { passive: true });

// Handle yes button click
yesButton.addEventListener('click', () => {
    questionScreenActive = false;

    // Hide question screen
    questionScreen.classList.add('hidden');

    // Show success screen
    successScreen.classList.remove('hidden');

    // Show all photos
    showPhotos();

    // Create confetti effect
    createConfetti();

    // Scatter roses and hearts
    scatterEmojis();
});

// Handle no button click (just in case someone manages to click it)
noButton.addEventListener('click', () => {
    if (questionScreenActive) {
        moveNoButton();
    }
});

// Show photos function
function showPhotos() {
    const photos = ['photo-1', 'photo-2', 'photo-3', 'photo-4', 'photo-5'];
    photos.forEach((photoId, index) => {
        setTimeout(() => {
            const photo = document.getElementById(photoId);
            photo.classList.remove('hidden');
        }, index * 200);
    });
}

// Scatter emojis (roses and hearts)
function scatterEmojis() {
    const emojis = ['🌹', '❤️', '💕', '💖', '💗', '💝', '🌹', '❤️', '💕', '🌹', '❤️', '💖', '🌹', '💗', '💝', '🌹', '❤️', '💕', '🌹', '💖'];
    const container = document.getElementById('emoji-container');

    emojis.forEach((emoji, index) => {
        setTimeout(() => {
            const emojiDiv = document.createElement('div');
            emojiDiv.className = 'floating-emoji';
            emojiDiv.textContent = emoji;

            // Random position but avoid center area (20-80%)
            let left, top;
            const avoidCenter = Math.random() > 0.5;

            if (avoidCenter) {
                // Place on left or right edges
                if (Math.random() > 0.5) {
                    left = Math.random() * 15; // 0-15%
                } else {
                    left = 85 + Math.random() * 15; // 85-100%
                }
                top = Math.random() * 100;
            } else {
                // Place on top or bottom edges
                if (Math.random() > 0.5) {
                    top = Math.random() * 15; // 0-15%
                } else {
                    top = 85 + Math.random() * 15; // 85-100%
                }
                left = Math.random() * 100;
            }

            emojiDiv.style.left = left + '%';
            emojiDiv.style.top = top + '%';

            // Random animation delay
            emojiDiv.style.animationDelay = Math.random() * 2 + 's';

            container.appendChild(emojiDiv);
        }, index * 100);
    });
}

// Confetti effect
function createConfetti() {
    const colors = ['#ff0000', '#ff69b4', '#ff1493', '#ffc0cb', '#ff6347'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            confetti.style.opacity = '1';

            document.body.appendChild(confetti);

            // Animate confetti falling
            const duration = 2000 + Math.random() * 2000;
            const startTime = Date.now();

            function animateConfetti() {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;

                if (progress < 1) {
                    confetti.style.top = (progress * window.innerHeight) + 'px';
                    confetti.style.opacity = 1 - progress;
                    confetti.style.transform = `rotate(${progress * 360 * 4}deg)`;
                    requestAnimationFrame(animateConfetti);
                } else {
                    confetti.remove();
                }
            }

            animateConfetti();
        }, i * 30);
    }
}
