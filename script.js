// Initialize AOS
AOS.init({
  duration: 1000,
  once: false,
  offset: 100,
});

document.addEventListener("DOMContentLoaded", () => {
  // 1. Get Guest Name from URL
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get("to") || "Tamu Undangan";
  document.getElementById("guest-name").innerText = guestName;

  // 2. Setup Background Slider
  const bgImages = [
    "img/tema 0.18.jpeg",
    "img/tema 0.12.jpeg",
    "img/tema 1.3.jpeg",
    "img/tema 0.21.jpeg",
    "img/tema 1.2.jpeg",
    "img/tema 0.17.jpeg",
    "img/tema 0.19.jpeg"
  ];
  
  const welcomeSlider = document.getElementById("welcome-slider");
  const heroSlider = document.getElementById("hero-slider");

  // 3. Setup Gallery Carousel
  // Gallery is now a continuous CSS marquee, no JS required for it.

  function createSlides(sliderElem, hasOverlay) {
    if (!sliderElem) return [];
    const slideElems = [];
    bgImages.forEach((src, idx) => {
        const slide = document.createElement("div");
        slide.className = "slide" + (idx === 0 ? " active" : "");
        slide.style.backgroundImage = `url('${src}')`;
        // Removed inline backgroundSize and backgroundPosition so CSS can use media queries
        sliderElem.appendChild(slide);
        slideElems.push(slide);
    });
    return slideElems;
  }

  const welcomeSlides = createSlides(welcomeSlider, true);
  const heroSlides = createSlides(heroSlider, false);

  let currentSlideIndex = 0;

  setInterval(() => {
    // Hide current
    if (welcomeSlides[currentSlideIndex])
      welcomeSlides[currentSlideIndex].classList.remove("active");
    if (heroSlides[currentSlideIndex])
      heroSlides[currentSlideIndex].classList.remove("active");

    // Move to next
    currentSlideIndex = (currentSlideIndex + 1) % bgImages.length;

    // Show next
    if (welcomeSlides[currentSlideIndex])
      welcomeSlides[currentSlideIndex].classList.add("active");
    if (heroSlides[currentSlideIndex])
      heroSlides[currentSlideIndex].classList.add("active");
  }, 2500);

  // 3. Open Invitation & Play Music
  const btnOpen = document.getElementById("open-invitation");
  const welcomeScreen = document.getElementById("welcome-screen");
  const mainContent = document.getElementById("main-content");
  const bgMusic = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-btn");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  let isPlaying = false;

  btnOpen.addEventListener("click", () => {
    // Slide up welcome screen
    welcomeScreen.classList.add("slide-up");

    // Show main content
    mainContent.classList.remove("hidden");

    // Show hamburger menu
    if (hamburgerMenu) hamburgerMenu.style.display = "block";

    // Play music
    bgMusic
      .play()
      .then(() => {
        isPlaying = true;
      })
      .catch((err) => {
        console.log("Audio autoplay prevented by browser.");
      });

    // Hide welcome screen after transition
    setTimeout(() => {
      welcomeScreen.style.display = "none";
    }, 1000);
  });

  // 4. Hamburger Menu Logic
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const icon = menuToggle.querySelector("i");
      if (navLinks.classList.contains("active")) {
        icon.classList.remove("bx-menu");
        icon.classList.add("bx-x");
      } else {
        icon.classList.remove("bx-x");
        icon.classList.add("bx-menu");
      }
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.querySelector("i").classList.replace("bx-x", "bx-menu");
      });
    });
  }

  // Scrollytelling logic removed. Using AOS for vertical scroll animations.

  // Toggle Music
  musicBtn.addEventListener("click", () => {
    if (isPlaying) {
      bgMusic.pause();
      musicBtn.classList.add("paused");
      musicBtn.innerHTML = "<i class='bx bx-music' style='opacity:0.5'></i>";
    } else {
      bgMusic.play();
      musicBtn.classList.remove("paused");
      musicBtn.innerHTML = "<i class='bx bx-music'></i>";
    }
    isPlaying = !isPlaying;
  });

  // 3. Countdown Timer (Target: Dec 25, 2026 08:00:00)
  const targetDate = new Date("July 24, 2026 08:00:00").getTime();

  const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      clearInterval(countdownInterval);
      document.getElementById("days").innerText = "00";
      document.getElementById("hours").innerText = "00";
      document.getElementById("minutes").innerText = "00";
      document.getElementById("seconds").innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerText =
      hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerText =
      minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerText =
      seconds < 10 ? "0" + seconds : seconds;
  }, 1000);

  // 4. RSVP Form & QR Code Generation
  const rsvpForm = document.getElementById("rsvp-form");
  const qrResult = document.getElementById("qr-result");
  const resetBtn = document.getElementById("reset-btn");

  const GOOGLE_APP_URL = "https://script.google.com/macros/s/AKfycbzpsH0AUzQ2u0fTqn4uW-VlmvSCYoCJx4ujYExWHiljlvpxtKJ4_-pj1l061dlqxuER/exec";

  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get Form Data
    const name = document.getElementById("name").value;
    const attendance = document.getElementById("attendance").value;
    const pax = document.getElementById("pax") ? document.getElementById("pax").value : 1;
    const message = document.getElementById("message").value;
    const submitBtn = rsvpForm.querySelector('button[type="submit"]');

    // Display info
    document.getElementById("qr-name-display").innerText = name;
    document.getElementById("qr-status-display").innerText = attendance;

    // Show loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Mengirim...";
    submitBtn.disabled = true;

    // Create payload matching Google Sheets columns
    const payload = {
      nama: name,
      kehadiran: attendance,
      jumlah_orang: pax,
      ucapan: message
    };

    fetch(GOOGLE_APP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      // Hide form, show result
      rsvpForm.classList.add("hidden");
      qrResult.classList.remove("hidden");
      
      // Reset button
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;

      // Update guestbook display immediately
      loadGuestbook();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengirim data. Pastikan koneksi internet Anda stabil.');
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    });
  });

  resetBtn.addEventListener("click", () => {
    qrResult.classList.add("hidden");
    rsvpForm.classList.remove("hidden");
    rsvpForm.reset();
  });

  // Load guestbook on page load
  let guestbookInterval = null;

  function loadGuestbook() {
    const listContainer = document.getElementById("guestbook-list");
    if (!listContainer) return;
    
    if (guestbookInterval) {
        clearInterval(guestbookInterval);
    }
    
    listContainer.innerHTML = '<p style="text-align: center; color: var(--text-light); margin-top: 20px;"><i class="bx bx-loader-alt bx-spin"></i> Memuat ucapan...</p>';

    fetch(GOOGLE_APP_URL)
      .then(response => response.json())
      .then(data => {
        let rsvpData = data || [];
        
        // Hapus ucapan asal-asalan jika ada
        rsvpData = rsvpData.filter(item => item.nama !== 'djgewjd' && item.ucapan && !item.ucapan.includes('dwedwe'));

        // Filter only those who have messages and sort newest first
        const wishes = rsvpData
            .filter(item => item.ucapan && item.ucapan.trim() !== "")
            .sort((a, b) => new Date(b.waktu || 0) - new Date(a.waktu || 0)); // Menampilkan yang terbaru di bawah, jika ingin di atas rubah a dan b.
            
        // Sebaiknya yang paling baru di atas
        wishes.sort((a, b) => new Date(b.waktu || 0) - new Date(a.waktu || 0));

        if (wishes.length > 0) {
            // Ensure we have enough items to fill the screen by duplicating the array if it's too short
            let displayWishes = [...wishes];
            while (displayWishes.length < 10) {
                displayWishes = [...displayWishes, ...wishes];
            }

            const createWishHTML = (item) => {
                const dateVal = item.waktu || new Date().toISOString();
                const dateStr = new Date(dateVal).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                });
                const badgeColor = item.kehadiran === 'Hadir' ? '#4ade80' : '#f87171';
                
                return `
                    <div style="background: rgba(255,255,255,0.05); padding: 25px; border-radius: 16px; border-left: 4px solid ${badgeColor}; box-shadow: 0 10px 30px rgba(0,0,0,0.3); width: 100%; backdrop-filter: blur(10px); box-sizing: border-box; flex-shrink: 0;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
                            <h4 style="color: var(--primary); font-size: 1.25rem; margin: 0; font-weight: 600;">${item.nama}</h4>
                            <span style="font-size: 0.8rem; color: rgba(255,255,255,0.5);">${dateStr}</span>
                        </div>
                        <p style="color: rgba(255,255,255,0.95); font-size: 1.05rem; line-height: 1.6; margin: 0; font-style: italic;">
                            "${item.ucapan.replace(/\\n/g, '<br>')}"
                        </p>
                    </div>
                `;
            };

            let baseHtml = '';
            displayWishes.forEach(item => {
                baseHtml += createWishHTML(item);
            });

            // Render two identical copies to create a perfect seamless loop
            listContainer.innerHTML = baseHtml + baseHtml;
        } else {
            listContainer.innerHTML = '<p style="text-align: center; color: var(--text-light); margin-top: 20px;">Jadilah yang pertama memberikan ucapan!</p>';
        }
      })
      .catch(error => {
        console.error('Error fetching guestbook:', error);
        listContainer.innerHTML = '<p style="text-align: center; color: #f87171; margin-top: 20px;">Gagal memuat ucapan. Periksa koneksi internet.</p>';
      });
  }

  loadGuestbook();
});

// Copy to Clipboard Function
function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btn.innerHTML;
    btn.innerHTML = "<i class='bx bx-check'></i> Tersalin!";
    btn.style.background = "var(--primary)";
    btn.style.color = "#000";
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = "transparent";
      btn.style.color = "var(--primary)";
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
    alert('Gagal menyalin. Silakan salin manual.');
  });
}
