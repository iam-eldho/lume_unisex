
let clientIP = "Unknown";

fetch("https://api.ipify.org?format=json")
    .then(res => res.json())
    .then(data => {
        clientIP = data.ip;
    })
    .catch(() => {
        clientIP = "Unavailable";
    });

const phoneInput = document.getElementById('phone');
const dateInput = document.getElementById('date');

function setMinDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const minDate = `${yyyy}-${mm}-${dd}`;
    dateInput.setAttribute('min', minDate);
}

setMinDate();

phoneInput.addEventListener('input', function () {
    // Remove everything except digits
    this.value = this.value.replace(/\D/g, '').slice(0, 10);
});

function convertTo24Hour(time12h) {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    hours = parseInt(hours, 10);

    if (modifier === "PM" && hours !== 12) {
        hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
        hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

(function () {
    const loader = document.querySelector(".loader-container");

    // Minimum time loader should stay visible (ms)
    const MIN_LOADER_TIME = 1200;
    const startTime = Date.now();

    window.addEventListener("load", () => {
        const elapsed = Date.now() - startTime;
        const remaining = MIN_LOADER_TIME - elapsed;

        setTimeout(() => {
            loader.classList.add("fade-out");
        }, remaining > 0 ? remaining : 0);
    });
})();

// Mobile menu functions
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.querySelector('.menu-toggle');
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
}

function closeMenu() {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.querySelector('.menu-toggle');
    menu.classList.remove('active');
    toggle.classList.remove('active');
}

function openModal(type) {
    const modal = document.getElementById('appointmentModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const title = document.getElementById('modalTitle');
    if (type === 'enquiry' || type === 'consultation') {
        title.textContent = 'ENQUIRE NOW';
        requestType.value = 'Enquiry';
    } else {
        title.textContent = 'BOOK APPOINTMENT';
        requestType.value = 'Appointment';
    }
    modal.classList.add('active');

    const requestTypeInput = document.getElementById('requestType');
    const dateGroup = document.getElementById('dateGroup');
    const timeGroup = document.getElementById('timeGroup');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');

    if (type === 'appointment') {
        requestTypeInput.value = 'Appointment';

        dateGroup.style.display = 'block';
        timeGroup.style.display = 'block';

        // 🔥 REQUIRED ONLY FOR APPOINTMENT
        dateInput.required = true;
        timeInput.required = true;

    } else {
        requestTypeInput.value = 'Enquiry';

        dateGroup.style.display = 'none';
        timeGroup.style.display = 'none';

        // 🔥 REMOVE REQUIRED FOR ENQUIRY
        dateInput.required = false;
        timeInput.required = false;

        // Optional: clear values
        dateInput.value = '';
        timeInput.value = '';
    }
}

function closeModal() {
    document.getElementById('appointmentModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Form submission
document.getElementById('appointmentForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    let timeValue = document.getElementById("time").value;

    const requestType = document.getElementById("requestType").value;
    const dateValue = document.getElementById("date").value;


    if (requestType === "Appointment") {
        if (!dateValue || !timeValue) {
            alert("Please select date and time for appointment");
            return;
        }
    }

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'SUBMITTING...';
    formMessage.style.display = 'none';

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        gender: document.getElementById('gender').value,
        purpose: document.getElementById('purpose').value,
        date: document.getElementById('date').value,
        time: timeValue,
        requestType: requestType,
        message: document.getElementById('message').value,
        ip: clientIP,
        timestamp: new Date().toLocaleString()
    };

    try {

        // Replace with your Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwrC1JaitfoD4BUVcFKn-STATd1r113jOxOalo2Rx3RLMaESRQil_yNeCjSjVL61WBbhw/exec';

        const formBody = new URLSearchParams(formData);

        const response = await fetch(scriptURL, {
            method: "POST",
            body: formBody
        });

        if (response.ok) {
            formMessage.className = 'form-message success';
            formMessage.textContent =
                'Thank you! Your request has been received. We will contact you soon.';

            document.getElementById('appointmentForm').reset();

            // Show message
            formMessage.style.display = 'block';

            setTimeout(() => {
                closeModal();
                formMessage.style.display = 'none';
            }, 3000);

        } else {
            throw new Error('Submission failed');
        }

    } catch (error) {
        console.error(error);

        formMessage.className = 'form-message error';
        formMessage.textContent =
            'Sorry, there was an error. Please call us directly at +91 98765 43210';
        formMessage.style.display = 'block';

    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'SUBMIT ENQUIRY';
    }
});

// Close modal on outside click
document.getElementById('appointmentModal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeModal();
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function (e) {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.querySelector('.menu-toggle');
    if (menu.classList.contains('active') &&
        !menu.contains(e.target) &&
        !toggle.contains(e.target)) {
        closeMenu();
    }
});


function openLightbox(img) {
    const box = document.getElementById("lightbox");
    const imgEl = document.getElementById("lightbox-img");
    const videoEl = document.getElementById("lightbox-video");

    videoEl.pause();
    videoEl.style.display = "none";

    imgEl.src = img.src;
    imgEl.style.display = "block";

    box.classList.add("active");
}

function openVideoLightbox(src) {
    const box = document.getElementById("lightbox");
    const imgEl = document.getElementById("lightbox-img");
    const videoEl = document.getElementById("lightbox-video");

    imgEl.style.display = "none";
    videoEl.muted = true;      // ✅ KEEP MUTED
    videoEl.src = src;
    videoEl.style.display = "block";
    videoEl.muted = false;
    videoEl.play();

    box.classList.add("active");
}

function closeLightbox() {
    const box = document.getElementById("lightbox");
    const videoEl = document.getElementById("lightbox-video");

    videoEl.pause();
    videoEl.src = "";

    box.classList.remove("active");
}

const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

let index = 0;

function updateCarousel() {
    const itemWidth = document.querySelector('.carousel-item').offsetWidth + 16;
    track.style.transform = `translateX(-${index * itemWidth}px)`;
}

nextBtn.addEventListener('click', () => {
    const maxIndex = track.children.length - 1;
    index = index < maxIndex ? index + 1 : 0;
    updateCarousel();
});

prevBtn.addEventListener('click', () => {
    const maxIndex = track.children.length - 1;
    index = index > 0 ? index - 1 : maxIndex;
    updateCarousel();
});

window.addEventListener('resize', updateCarousel);
