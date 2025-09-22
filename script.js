document.addEventListener('DOMContentLoaded', function() {
    const openButton = document.getElementById('openInvitation');
    const coverPage = document.getElementById('coverPage');
    const mainContent = document.getElementById('mainContent');
    
    // --- 1. Dynamic Guest Name ---
    const urlParams = new URLSearchParams(window.location.search);
    const guest = urlParams.get('to');
    const guestNameElement = document.getElementById('guestName');

    if (guest && guestNameElement) {
        const sanitizedGuest = guest.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        guestNameElement.innerHTML = `Dear ${sanitizedGuest},<br>You are cordially invited`;
    }

    // --- Cover Page Logic ---
    mainContent.style.display = 'none';
    openButton.addEventListener('click', () => {
        coverPage.classList.add('hidden');
        document.body.style.overflow = 'hidden';
        mainContent.style.display = 'block';
        
        const scrollContainer = document.querySelector('.scroll-container');
        scrollContainer.style.overflowY = 'scroll';
    });

    // --- 2. Wedding Wishes Fetching ---
    const googleSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQCsPsMcZLV8Gdp6_oP7M9Hkicj--Ku0yNrGwxhbg2XGYUoCfotzasSqJUb99Uw7VwZxDR3-drNdYG7/pub?output=csv';

    // REPLACE your old fetchWishes function with this new one.

async function fetchWishes() {
    const wishesBoard = document.getElementById('wishes-board');
    const googleSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQCsPsMcZLV8Gdp6_oP7M9Hkicj--Ku0yNrGwxhbg2XGYUoCfotzasSqJUb99Uw7VwZxDR3-drNdYG7/pub?gid=1210716786&single=true&output=csv';

    if (!wishesBoard) return;

    try {
        // This is the fix: Adding a unique timestamp to bypass the browser cache
        const response = await fetch(`${googleSheetURL}&t=${new Date().getTime()}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.text();
        
        // Split rows and filter out any empty lines from the CSV
        const wishes = data.split('\n').slice(1).reverse().filter(row => row.trim() !== '');

        wishesBoard.innerHTML = ''; // Clear the 'loading' message

        if (wishes.length === 0) {
            wishesBoard.innerHTML = '<p style="text-align: center; padding: 20px;">Be the first to leave a wish!</p>';
            return;
        }

        wishes.forEach(row => {
            // This robust parser handles commas inside wishes
            const columns = row.match(/(".*?"|[^",\r\n]+)(?=\s*,|\s*$)/g) || [];
            
            // Assuming columns are [Timestamp, Name, Wish]
            // We remove quotes from the start and end of each value
            const name = (columns[1] || 'Anonymous').replace(/^"|"$/g, '');
            const message = (columns[2] || '').replace(/^"|"$/g, '');

            if (message) {
                const wishCard = document.createElement('div');
                wishCard.className = 'wish-card';
                wishCard.innerHTML = `<p>${message}</p><p class="wisher-name">— ${name}</p>`;
                wishesBoard.appendChild(wishCard);
            }
        });

    } catch (error) {
        console.error('Error fetching wishes:', error);
        wishesBoard.innerHTML = '<p style="text-align: center; padding: 20px;">Could not load wishes at this time.</p>';
    }
}

    fetchWishes();

    // --- 3. Countdown Timer ---
    const countdownDate = new Date("November 16, 2025 15:00:00").getTime();
    const countdownFunction = setInterval(function() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
             countdownElement.innerHTML = `
                <div>${days}<span>Days</span></div>
                <div>${hours}<span>Hours</span></div>
                <div>${minutes}<span>Minutes</span></div>
                <div>${seconds}<span>Seconds</span></div>
            `;
        }

        if (distance < 0) {
            clearInterval(countdownFunction);
            if (countdownElement) {
                countdownElement.innerHTML = "The special day is here!";
            }
        }
    }, 1000);

    // --- 4. Copy to Clipboard for Gifting ---
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const textToCopy = button.getAttribute('data-clipboard-text');
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    });

/* ADD ALL OF THIS CODE to the end of your script.js file, before the final }); */

    const audio = document.getElementById('wedding-song');
    audio.volume = 0.35; // Set initial volume to 35%
    const audioBtn = document.getElementById('audio-control-btn');
    const audioIcon = audioBtn.querySelector('i');

    // Modify the original 'openInvitation' click listener to play audio
    const openInvitationButton = document.getElementById('openInvitation');
    openInvitationButton.addEventListener('click', () => {
        audio.play();
        audioIcon.classList.remove('fa-play');
        audioIcon.classList.add('fa-pause', 'fa-spin');
    });

    audioBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            audioIcon.classList.replace('fa-play', 'fa-pause');
            audioIcon.classList.add('fa-spin');
        } else {
            audio.pause();
            audioIcon.classList.replace('fa-pause', 'fa-play');
            audioIcon.classList.remove('fa-spin');
        }
    });

    // --- Embedded Wish Form Logic ---
    const wishForm = document.getElementById('wish-form');
    // ⬇️ IMPORTANT: You'll need to create this URL using the guide below
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxmR4118wxh_JB4b98e17BfScdkNBk6cwETYQCEqbQgLcEMR6p0j0_sCQqPZ7y1XlmoUA/exec'; 

    wishForm.addEventListener('submit', e => {
        e.preventDefault();
        const submitBtn = wishForm.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        fetch(scriptURL, { method: 'POST', body: new FormData(wishForm) })
            .then(response => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Wish';
                alert('Thank you! Your wish has been sent.');
                wishForm.reset();
                setTimeout(fetchWishes, 1000); // Refresh the board after a short delay
            })
            .catch(error => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Wish';
                alert('Sorry, there was an error. Please try again.');
                console.error('Error!', error.message);
            });
    });

    // --- Gallery & Video Logic ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryImages = Array.from(document.querySelectorAll('.image-grid img'));
    const imageSources = galleryImages.map(img => img.src);
    let currentImageIndex = 0;

    function showImage(index) {
        lightboxImg.src = imageSources[index];
        currentImageIndex = index;
    }

    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            lightbox.classList.add('active');
            showImage(index);
        });
    });

    document.querySelector('.lightbox-close').addEventListener('click', () => lightbox.classList.remove('active'));
    document.querySelector('.lightbox-next').addEventListener('click', () => {
        showImage((currentImageIndex + 1) % imageSources.length);
    });
    document.querySelector('.lightbox-prev').addEventListener('click', () => {
        showImage((currentImageIndex - 1 + imageSources.length) % imageSources.length);
    });

    // Swipe navigation for lightbox
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
    lightbox.addEventListener('touchend', e => {
        let touchEndX = e.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) { document.querySelector('.lightbox-next').click(); }
        if (touchStartX - touchEndX < -50) { document.querySelector('.lightbox-prev').click(); }
    });

    // Video autoplay on scroll
    const video = document.querySelector('.gallery-video');
    video.volume = 0.05; // Set initial volume to 5%
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.5 }); // Play when 50% of the video is visible
    observer.observe(video);

// --- RSVP Form Submission without Redirect ---
const rsvpForm = document.getElementById('rsvp-form');

rsvpForm.addEventListener('submit', function (e) {
    e.preventDefault(); // This is the most important part - it stops the redirect
    const formData = new FormData(rsvpForm);
    const object = {};
    formData.forEach((value, key) => {
        object[key] = value;
    });
    const json = JSON.stringify(object);
    const submitBtn = rsvpForm.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let jsonResponse = await response.json();
        if (response.status == 200) {
            alert('Thank you! Your RSVP has been submitted.'); // Success pop-up
        } else {
            console.log(response);
            alert(jsonResponse.message); // Error pop-up
        }
    })
    .catch(error => {
        console.log(error);
        alert("Something went wrong! Please try again."); // Network error pop-up
    })
    .finally(() => {
        // Re-enable the button and reset the form
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm Attendance';
        rsvpForm.reset();
    });
});

});