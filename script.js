// Dynamically load the YouTube IFrame Player API asynchronously
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
if (firstScriptTag) {
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
} else {
    document.head.appendChild(tag);
}

window.addEventListener('load', () => {
    createParticles();
    createLanterns();

    // Start dismissing the loading screen much faster to improve FCP, LCP, and Speed Index.
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease';
        }
        setTimeout(() => {
            if (loader) loader.style.display = 'none';
            const intro = document.getElementById('intro-overlay');
            if (intro) {
                intro.style.display = 'flex';
                intro.style.opacity = '1';
            }
        }, 500);
    }, 400); // 400ms delay instead of 2500ms
});
// ======================== PARTICLES ========================
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.width = (Math.random() * 3 + 1) + 'px';
        p.style.height = p.style.width;
        p.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
        p.style.animationDuration = (Math.random() * 15 + 10) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        p.style.opacity = Math.random() * 0.6 + 0.2;
        const colors = ['#D4AF37', '#F5D676', '#1A8C60', '#ffffff'];
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(p);
    }
}

// ======================== FLYING ANIMALS (SHEEP & CALVES) ========================
function createLanterns() {
    const container = document.getElementById('lanterns');
    const animals = ['🐑', '🐄', '🐑', '🐏', '🐑', '🐮', '🐑', '🐂', '🐑', '🐑'];
    const animStyles = ['', 'bounce', 'spin', '', 'bounce', '', 'spin', 'bounce', '', 'bounce'];

    for (let i = 0; i < 12; i++) {
        const el = document.createElement('div');
        const style = animStyles[i % animStyles.length];
        el.className = 'flying-animal' + (style ? ' ' + style : '');
        el.textContent = animals[i % animals.length];
        el.style.left = (Math.random() * 88 + 6) + '%';
        el.style.fontSize = (Math.random() * 1.2 + 1.6) + 'rem';
        const floatDur = (Math.random() * 15 + 18) + 's';
        const wiggleDur = (Math.random() * 3 + 2) + 's';
        el.style.animationDuration = floatDur + ', ' + wiggleDur;
        el.style.animationDelay = (Math.random() * 12) + 's, ' + (Math.random() * 2) + 's';
        container.appendChild(el);
    }
}

// ======================== PASSWORD ========================
document.getElementById('pw-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkPassword();
});

function checkPassword() {
    const val = document.getElementById('pw-input').value.trim().toLowerCase();
    const errEl = document.getElementById('pw-error');
    const card = document.querySelector('.password-card');

    if (val === 'eid') {
        // SUCCESS!
        startMusic(); // Start music immediately to preserve user interaction context
        launchConfetti();
        setTimeout(launchFireworks, 300);

        document.getElementById('password-screen').style.transition = 'opacity 1s ease, transform 1s ease';
        document.getElementById('password-screen').style.opacity = '0';
        document.getElementById('password-screen').style.transform = 'scale(1.1)';

        setTimeout(() => {
            document.getElementById('password-screen').style.display = 'none';
            const main = document.getElementById('main-content');
            const nav = document.getElementById('main-nav');
            const floatBtn = document.getElementById('floating-music');

            main.style.display = 'block';
            nav.style.display = 'flex';
            floatBtn.classList.add('active');
            const floatSpiritualBtn = document.getElementById('floating-spiritual');
            if (floatSpiritualBtn) floatSpiritualBtn.style.display = 'flex';

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    main.classList.add('fade-in');
                    initScrollReveal();
                    initCountdown();
                    initSunnahChecklist();
                    loadDuaWall();
                });
            });
        }, 1000);

    } else {
        // WRONG PASSWORD
        errEl.classList.add('show');
        errEl.textContent = '❌ كلمة المرور غلط! Try: eid';
        card.classList.remove('shake');
        requestAnimationFrame(() => card.classList.add('shake'));
        setTimeout(() => card.classList.remove('shake'), 700);
        document.getElementById('pw-input').value = '';
        document.getElementById('pw-input').focus();
    }
}

// ======================== YOUTUBE TAKBEER MUSIC & MIXER ========================
let ytPlayerMain = null;
let ytPlayerTalbiyah = null;
let ytPlayerAmbience = null;

let mainTrackId = 'COCjvUYGHNs';
let talbiyahTrackId = 'kYJzX9eZp9M';
let ambienceTrackId = 'F0lH00jJ64w';

let ytReadyMain = false;
let ytReadyTalbiyah = false;
let ytReadyAmbience = false;

let musicPlaying = false;
let pendingPlay = false;



// Called automatically by YouTube API when ready
window.onYouTubeIframeAPIReady = function () {
    // Main player
    ytPlayerMain = new YT.Player('yt-player-main', {
        host: 'https://www.youtube-nocookie.com',
        videoId: mainTrackId,
        playerVars: {
            autoplay: 0,
            loop: 1,
            playlist: mainTrackId,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0
        },
        events: {
            onReady: function (e) {
                ytReadyMain = true;
                ytPlayerMain.setVolume(70);
                if (pendingPlay) { startMusic(); pendingPlay = false; }
            },
            onStateChange: function (e) {
                if (e.data === YT.PlayerState.ENDED) {
                    ytPlayerMain.seekTo(0);
                    ytPlayerMain.playVideo();
                }
            }
        }
    });

    // Talbiyah player
    ytPlayerTalbiyah = new YT.Player('yt-player-talbiyah', {
        host: 'https://www.youtube-nocookie.com',
        videoId: talbiyahTrackId,
        playerVars: {
            autoplay: 0,
            loop: 1,
            playlist: talbiyahTrackId,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0
        },
        events: {
            onReady: function (e) {
                ytReadyTalbiyah = true;
                ytPlayerTalbiyah.setVolume(0);
            },
            onStateChange: function (e) {
                if (e.data === YT.PlayerState.ENDED) {
                    ytPlayerTalbiyah.seekTo(0);
                    ytPlayerTalbiyah.playVideo();
                }
            }
        }
    });

    // Ambience player
    ytPlayerAmbience = new YT.Player('yt-player-ambience', {
        host: 'https://www.youtube-nocookie.com',
        videoId: ambienceTrackId,
        playerVars: {
            autoplay: 0,
            loop: 1,
            playlist: ambienceTrackId,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0
        },
        events: {
            onReady: function (e) {
                ytReadyAmbience = true;
                ytPlayerAmbience.setVolume(0);
            },
            onStateChange: function (e) {
                if (e.data === YT.PlayerState.ENDED) {
                    ytPlayerAmbience.seekTo(0);
                    ytPlayerAmbience.playVideo();
                }
            }
        }
    });
};

const trackVideos = {
    makkah: 'COCjvUYGHNs',
    egypt: 'P1Bpy3YIxwo'
};

function changeMainTrack(trackKey) {
    const vidId = trackVideos[trackKey];
    if (!vidId) return;
    mainTrackId = vidId;

    // Update UI buttons
    document.querySelectorAll('.mixer-select-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('track-' + trackKey);
    if (activeBtn) activeBtn.classList.add('active');

    if (ytReadyMain && ytPlayerMain) {
        ytPlayerMain.loadVideoById({
            videoId: vidId,
            suggestedQuality: 'default'
        });
        musicPlaying = true;

        // Update UI state
        const musicIcon = document.getElementById('music-icon');
        const musicLabel = document.getElementById('music-label');
        const floatBtn = document.getElementById('floating-music');
        const wave = document.getElementById('sound-wave');
        if (musicIcon) musicIcon.textContent = '🔊';
        if (musicLabel) musicLabel.textContent = 'إيقاف الصوت';
        if (floatBtn) floatBtn.textContent = '🔊';
        if (wave) wave.classList.remove('paused');
    }
}

function selectIntroTrack(trackKey) {
    // Save selection to main players
    changeMainTrack(trackKey);

    // Start music immediately within this click handler to bypass browser autoplay restrictions
    startMusic();

    // Fade out the intro overlay
    const intro = document.getElementById('intro-overlay');
    if (intro) intro.style.opacity = '0';

    setTimeout(() => {
        if (intro) intro.style.display = 'none';

        // Show the password screen
        const pwScreen = document.getElementById('password-screen');
        if (pwScreen) {
            pwScreen.style.display = 'flex';
            pwScreen.style.opacity = '1';
        }
        const pwInput = document.getElementById('pw-input');
        if (pwInput) pwInput.focus();
    }, 800);
}

function startMusic() {
    if (!ytReadyMain) { pendingPlay = true; return; }
    musicPlaying = true;

    // Play Main
    ytPlayerMain.playVideo();

    // Play Talbiyah if volume > 0
    const talbVol = parseInt(document.getElementById('volume-talbiyah').value);
    if (talbVol > 0 && ytReadyTalbiyah) {
        ytPlayerTalbiyah.setVolume(talbVol);
        ytPlayerTalbiyah.playVideo();
    }

    // Play Ambience if volume > 0
    const ambVol = parseInt(document.getElementById('volume-ambience').value);
    if (ambVol > 0 && ytReadyAmbience) {
        ytPlayerAmbience.setVolume(ambVol);
        ytPlayerAmbience.playVideo();
    }

    // Update UI
    const musicIcon = document.getElementById('music-icon');
    const musicLabel = document.getElementById('music-label');
    const floatBtn = document.getElementById('floating-music');
    const wave = document.getElementById('sound-wave');
    if (musicIcon) musicIcon.textContent = '🔊';
    if (musicLabel) musicLabel.textContent = 'إيقاف الصوت';
    if (floatBtn) floatBtn.textContent = '🔊';
    if (wave) wave.classList.remove('paused');
}

function toggleMusic() {
    if (!ytReadyMain) { pendingPlay = true; return; }

    if (musicPlaying) {
        // Pause all
        if (ytPlayerMain) ytPlayerMain.pauseVideo();
        if (ytPlayerTalbiyah) ytPlayerTalbiyah.pauseVideo();
        if (ytPlayerAmbience) ytPlayerAmbience.pauseVideo();

        musicPlaying = false;

        // Update UI
        const musicIcon = document.getElementById('music-icon');
        const musicLabel = document.getElementById('music-label');
        const floatBtn = document.getElementById('floating-music');
        const wave = document.getElementById('sound-wave');
        if (musicIcon) musicIcon.textContent = '🔇';
        if (musicLabel) musicLabel.textContent = 'تشغيل الصوت';
        if (floatBtn) floatBtn.textContent = '🔇';
        if (wave) wave.classList.add('paused');
    } else {
        startMusic();
    }
}

function adjustMixVolume(type, val) {
    const valEl = document.getElementById('val-' + type);
    if (valEl) valEl.textContent = val + '%';

    const vol = parseInt(val);

    if (type === 'talbiyah' && ytReadyTalbiyah) {
        ytPlayerTalbiyah.setVolume(vol);
        if (vol > 0 && musicPlaying) {
            ytPlayerTalbiyah.playVideo();
        } else if (vol === 0) {
            ytPlayerTalbiyah.pauseVideo();
        }
    } else if (type === 'ambience' && ytReadyAmbience) {
        ytPlayerAmbience.setVolume(vol);
        if (vol > 0 && musicPlaying) {
            ytPlayerAmbience.playVideo();
        } else if (vol === 0) {
            ytPlayerAmbience.pauseVideo();
        }
    }
}

// ======================== LIVE STREAM SWITCHER ========================
function switchStream(type, btn) {
    // Update active button state
    document.querySelectorAll('.stream-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const iframe = document.getElementById('live-stream-iframe');
    if (iframe) {
        if (type === 'makkah') {
            iframe.src = 'https://www.youtube.com/embed/JIoc71OHmuU';
        } else if (type === 'madinah') {
            iframe.src = 'https://www.youtube.com/embed/MyPninv21t4';
        }
    }
}

// ======================== CONFETTI ========================
function launchConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#D4AF37', '#F5D676', '#1A8C60', '#ffffff', '#FF6B6B', '#4ECDC4', '#FFE66D'];
    const shapes = ['■', '●', '▲', '★', '◆'];

    for (let i = 0; i < 120; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.color = colors[Math.floor(Math.random() * colors.length)];
            piece.style.fontSize = (Math.random() * 12 + 6) + 'px';
            piece.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            piece.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
            piece.style.animationDelay = '0s';
            piece.style.width = 'auto'; piece.style.height = 'auto';
            piece.style.background = 'none';
            container.appendChild(piece);
            setTimeout(() => piece.remove(), 4000);
        }, i * 25);
    }
}

// ======================== FIREWORKS ========================
function launchFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.4;

    const particles = [];

    function createExplosion(x, y) {
        const colors = ['#D4AF37', '#F5D676', '#1A8C60', '#ffffff', '#FFE66D', '#FF6B6B'];
        for (let i = 0; i < 60; i++) {
            const angle = (Math.PI * 2 / 60) * i;
            const speed = Math.random() * 4 + 2;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 3 + 1,
                decay: Math.random() * 0.02 + 0.01
            });
        }
    }

    // Launch several fireworks
    const positions = [
        [canvas.width * 0.2, canvas.height * 0.4],
        [canvas.width * 0.5, canvas.height * 0.3],
        [canvas.width * 0.8, canvas.height * 0.4],
        [canvas.width * 0.35, canvas.height * 0.55],
        [canvas.width * 0.65, canvas.height * 0.55],
    ];

    positions.forEach(([x, y], i) => {
        setTimeout(() => createExplosion(x, y), i * 400);
    });

    function animate() {
        ctx.fillStyle = 'rgba(3,10,20,0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravity
            p.alpha -= p.decay;
            p.vx *= 0.99;

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Remove dead particles
        for (let i = particles.length - 1; i >= 0; i--) {
            if (particles[i].alpha <= 0) particles.splice(i, 1);
        }

        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}

// ======================== SCROLL REVEAL ========================
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}

// ======================== TYPEWRITER EFFECT ========================
(function () {
    const text = 'تقبّل الله منا ومنكم صالح الأعمال، وأعاده الله عليكم بالخير والسعادة والبركات';
    const el = document.getElementById('hero-typewriter');
    if (!el) return;
    let i = 0;
    function typeNext() {
        if (i <= text.length) {
            el.textContent = text.substring(0, i);
            i++;
            setTimeout(typeNext, 60);
        }
    }
    // Start typewriter when main content becomes visible
    const origInit = initScrollReveal;
    initScrollReveal = function () {
        origInit();
        setTimeout(typeNext, 500);
    };
})();

// ======================== PARALLAX SCROLLING ========================
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const sky = document.querySelector('.night-sky');
    if (sky) sky.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
}, { passive: true });

// ======================== EMOJI RAIN ========================
function emojiRain(type) {
    const mixEmojis = ['🐑', '⭐', '🌙', '🎉', '✨', '🐏', '🕌', '🤲'];
    const count = 50;
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.textContent = type === 'mix' ? mixEmojis[Math.floor(Math.random() * mixEmojis.length)] : type;
            drop.style.left = (Math.random() * 100) + '%';
            drop.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
            drop.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
            document.body.appendChild(drop);
            setTimeout(() => drop.remove(), 4000);
        }, i * 60);
    }
}

// ======================== INTERACTIVE SHEEP ========================
document.addEventListener('click', (e) => {
    const animal = e.target.closest('.flying-animal');
    if (!animal) return;

    // Pop animation
    animal.classList.remove('clicked');
    void animal.offsetWidth;
    animal.classList.add('clicked');
    setTimeout(() => animal.classList.remove('clicked'), 600);

    // Sound bubble
    const sounds = ['مـــاااا 🐑', 'بـــاااا 🐏', 'مووووو 🐄', 'عيد مبارك! ✨'];
    const bubble = document.createElement('div');
    bubble.className = 'sheep-sound-bubble';
    bubble.textContent = sounds[Math.floor(Math.random() * sounds.length)];
    const rect = animal.getBoundingClientRect();
    bubble.style.left = rect.left + 'px';
    bubble.style.top = (rect.top - 30) + 'px';
    document.body.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1300);

    // Play bleat sound with Web Audio
    try {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ac.createOscillator();
        const g = ac.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ac.currentTime + 0.3);
        g.gain.setValueAtTime(0.15, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.4);
        osc.connect(g);
        g.connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.4);
    } catch (err) { }
});

// ======================== EID CARD GENERATOR (Canvas) ========================
function generateEidCard() {
    const name = document.getElementById('card-name-input').value.trim();
    if (!name) {
        document.getElementById('card-name-input').style.borderColor = '#FF6B6B';
        setTimeout(() => document.getElementById('card-name-input').style.borderColor = '', 1500);
        return;
    }
    const canvas = document.getElementById('eid-card-canvas');
    const ctx = canvas.getContext('2d');
    const W = 800, H = 1000;
    canvas.width = W; canvas.height = H;

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#030A14');
    bg.addColorStop(0.3, '#0D2845');
    bg.addColorStop(0.6, '#0A2318');
    bg.addColorStop(1, '#030A14');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Geometric pattern (subtle dots)
    ctx.globalAlpha = 0.06;
    for (let px = 0; px < W; px += 40) {
        for (let py = 0; py < H; py += 40) {
            ctx.fillStyle = '#D4AF37';
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.globalAlpha = 1;

    // Gold outer border
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    // Inner decorative border
    ctx.strokeStyle = 'rgba(212,175,55,0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(35, 35, W - 70, H - 70);

    // Corner ornaments
    ctx.font = '40px serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#D4AF37';
    ctx.fillText('✦', 55, 65);
    ctx.fillText('✦', W - 55, 65);
    ctx.fillText('✦', 55, H - 40);
    ctx.fillText('✦', W - 55, H - 40);

    // Top decorations
    ctx.font = '48px serif';
    ctx.fillText('🌙', W / 2, 100);
    ctx.font = '32px serif';
    ctx.fillText('✨  🐑  ✨', W / 2, 150);

    // Divider line
    const lineGrad = ctx.createLinearGradient(100, 0, W - 100, 0);
    lineGrad.addColorStop(0, 'transparent');
    lineGrad.addColorStop(0.5, '#D4AF37');
    lineGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(100, 180);
    ctx.lineTo(W - 100, 180);
    ctx.stroke();

    // Main greeting
    ctx.fillStyle = '#D4AF37';
    ctx.shadowColor = 'rgba(212,175,55,0.5)';
    ctx.shadowBlur = 20;
    ctx.font = '700 62px "Scheherazade New", "Amiri", serif';
    ctx.fillText('عيد أضحى مبارك', W / 2, 280);

    // Sheep emoji
    ctx.shadowBlur = 0;
    ctx.font = '80px serif';
    ctx.fillText('🐑', W / 2, 390);

    // Divider
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, 430);
    ctx.lineTo(W - 150, 430);
    ctx.stroke();

    // Name
    ctx.fillStyle = '#F5D676';
    ctx.shadowColor = 'rgba(212,175,55,0.4)';
    ctx.shadowBlur = 15;
    ctx.font = '700 50px "Scheherazade New", "Amiri", serif';
    ctx.fillText(name, W / 2, 510);
    ctx.shadowBlur = 0;

    // Dua text
    ctx.fillStyle = 'rgba(240,230,200,0.85)';
    ctx.font = '34px "Scheherazade New", "Amiri", serif';
    ctx.fillText('تقبّل الله منك صالح الأعمال', W / 2, 600);
    ctx.fillText('وأعاده الله عليك بالخير والبركات', W / 2, 650);

    // Verse
    ctx.fillStyle = 'rgba(212,175,55,0.6)';
    ctx.font = '28px "Scheherazade New", "Amiri", serif';
    ctx.fillText('﴿ وَفَدَيْنَاهُ بِذِبْحٍ عَظِيمٍ ﴾', W / 2, 740);

    // Bottom decorations
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 790);
    ctx.lineTo(W - 100, 790);
    ctx.stroke();

    ctx.font = '32px serif';
    ctx.fillStyle = '#D4AF37';
    ctx.fillText('🕌  ✦  🤲  ✦  🕌', W / 2, 850);

    ctx.fillStyle = 'rgba(240,230,200,0.4)';
    ctx.font = '22px "Scheherazade New", serif';
    ctx.fillText('كل عام وأنتم بخير', W / 2, 920);

    // Setup the 3D Gift Box
    const wrapper = document.getElementById('eid-card-wrapper');
    wrapper.classList.remove('show');

    const boxContainer = document.getElementById('gift-box-container');
    const box = document.getElementById('gift-box');
    const hint = document.getElementById('gift-click-hint');

    boxContainer.style.display = 'block';
    box.classList.remove('open');
    hint.style.display = 'block';

    // Scroll to the gift box container smoothly
    boxContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Play magical creation sound
    try {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ac.createOscillator();
        const g = ac.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ac.currentTime + 0.5);
        g.gain.setValueAtTime(0.1, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5);
        osc.connect(g);
        g.connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.5);
    } catch (e) { }
}

function openGiftBox() {
    const box = document.getElementById('gift-box');
    if (box.classList.contains('open')) return;

    box.classList.add('open');
    document.getElementById('gift-click-hint').style.display = 'none';

    // Play gorgeous synthesizer chime arpeggio!
    playGreetingChime();

    // Reveal the card after unfolding animation finishes
    setTimeout(() => {
        const wrapper = document.getElementById('eid-card-wrapper');
        wrapper.classList.add('show');
        emojiRain('mix');
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 900);
}

function playGreetingChime() {
    try {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const now = ac.currentTime;

        // Play C major 7 arpeggio (magical chime)
        const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25, 783.99, 987.77];
        notes.forEach((freq, idx) => {
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.1);

            gain.gain.setValueAtTime(0, now + idx * 0.1);
            gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.1 + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.7);

            osc.connect(gain);
            gain.connect(ac.destination);
            osc.start(now + idx * 0.1);
            osc.stop(now + idx * 0.1 + 0.75);
        });

        // Add a warm background pad note
        const padOsc = ac.createOscillator();
        const padGain = ac.createGain();
        padOsc.type = 'triangle';
        padOsc.frequency.setValueAtTime(196.00, now); // G3
        padGain.gain.setValueAtTime(0, now);
        padGain.gain.linearRampToValueAtTime(0.12, now + 0.4);
        padGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        padOsc.connect(padGain);
        padGain.connect(ac.destination);
        padOsc.start(now);
        padOsc.stop(now + 1.8);
    } catch (e) { }
}

function downloadCard() {
    const canvas = document.getElementById('eid-card-canvas');
    const link = document.createElement('a');
    link.download = 'eid-card.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function shareCard() {
    const name = document.getElementById('card-name-input').value.trim() || 'صديقي';
    const msg = 'عيد أضحى مبارك 🐑✨\nتقبّل الله منك يا ' + name + ' صالح الأعمال\nوأعاده الله عليك بالخير والبركات 🤲🌙';
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
}

// ======================== PHOTO FRAME ========================
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.getElementById('photo-canvas');
            const ctx = canvas.getContext('2d');
            const size = 600;
            canvas.width = size; canvas.height = size;

            // Draw image (cover fit)
            const scale = Math.max(size / img.width, size / img.height);
            const w = img.width * scale, h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

            // Dark gradient overlay at bottom
            const grad = ctx.createLinearGradient(0, size * 0.55, 0, size);
            grad.addColorStop(0, 'rgba(3,10,20,0)');
            grad.addColorStop(1, 'rgba(3,10,20,0.9)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, size, size);

            // Gold border
            ctx.strokeStyle = '#D4AF37';
            ctx.lineWidth = 12;
            ctx.strokeRect(6, 6, size - 12, size - 12);
            ctx.strokeStyle = 'rgba(212,175,55,0.4)';
            ctx.lineWidth = 2;
            ctx.strokeRect(18, 18, size - 36, size - 36);

            // Text
            ctx.textAlign = 'center';
            ctx.fillStyle = '#F5D676';
            ctx.shadowColor = 'rgba(212,175,55,0.6)';
            ctx.shadowBlur = 15;
            ctx.font = '700 38px "Scheherazade New", serif';
            ctx.fillText('عيد أضحى مبارك 🐑✨', size / 2, size - 60);
            ctx.font = '24px "Scheherazade New", serif';
            ctx.fillStyle = 'rgba(240,230,200,0.8)';
            ctx.shadowBlur = 8;
            ctx.fillText('تقبّل الله منّا ومنكم', size / 2, size - 25);

            // Corners
            ctx.font = '28px serif'; ctx.shadowBlur = 0;
            ctx.fillText('🌙', 35, 42);
            ctx.fillText('🌙', size - 35, 42);
            ctx.fillText('✨', 35, size - 15);
            ctx.fillText('✨', size - 35, size - 15);

            document.getElementById('photo-frame-result').classList.add('show');
            document.getElementById('photo-upload-area').style.display = 'none';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function downloadPhoto() {
    const canvas = document.getElementById('photo-canvas');
    const link = document.createElement('a');
    link.download = 'eid-photo-frame.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function initCountdown() {
    // Target: May 27, 2026 06:19:00 (Eid Al-Adha Prayer in Itay El-Baroud)
    const targetDate = new Date('2026-05-27T06:19:00').getTime();

    function update() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        const dEl = document.getElementById('cd-days');
        const hEl = document.getElementById('cd-hours');
        const mEl = document.getElementById('cd-minutes');
        const sEl = document.getElementById('cd-seconds');

        if (diff <= 0) {
            if (dEl) dEl.textContent = '00';
            if (hEl) hEl.textContent = '00';
            if (mEl) mEl.textContent = '00';
            if (sEl) sEl.textContent = '00';
            const container = document.querySelector('.countdown-container');
            if (container) {
                container.innerHTML = `<div class="countdown-title" style="font-size: 1.5rem; color: var(--gold); animation: glowPulse 2s ease-in-out infinite;">🎉 عِيدُكُمْ مُبَارَكٌ وَسَعِيدٌ 🎉</div>
                                               <div style="font-size:1.1rem; color:var(--text-light); opacity:0.85; margin-top:0.5rem;">تقبل الله منا ومنكم صالح الأعمال وعساكم من عواده</div>`;
            }
            clearInterval(interval);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (dEl) dEl.textContent = String(days).padStart(2, '0');
        if (hEl) hEl.textContent = String(hours).padStart(2, '0');
        if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
        if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    const interval = setInterval(update, 1000);
}

// ======================== SUNNAH CHECKLIST ========================
function initSunnahChecklist() {
    const savedState = localStorage.getItem('eid_sunnah_checklist');
    const checks = savedState ? JSON.parse(savedState) : {};
    const checkboxes = document.querySelectorAll('.sunnah-checkbox');

    checkboxes.forEach(cb => {
        const idx = cb.getAttribute('data-index');
        if (checks[idx] === true) {
            cb.checked = true;
        }
    });

    updateSunnahProgress();
}

function toggleSunnah(element) {
    const checkboxes = document.querySelectorAll('.sunnah-checkbox');
    const checks = {};

    checkboxes.forEach(cb => {
        const idx = cb.getAttribute('data-index');
        checks[idx] = cb.checked;
    });

    localStorage.setItem('eid_sunnah_checklist', JSON.stringify(checks));
    updateSunnahProgress();

    if (element.checked) {
        emojiRain('✨');
    }
}

function updateSunnahProgress() {
    const checkboxes = document.querySelectorAll('.sunnah-checkbox');
    let checkedCount = 0;
    checkboxes.forEach(cb => {
        if (cb.checked) checkedCount++;
    });

    const percentage = checkboxes.length ? Math.round((checkedCount / checkboxes.length) * 100) : 0;
    const progressEl = document.getElementById('sunnah-progress');
    const percentEl = document.getElementById('sunnah-percentage');
    const congratsEl = document.getElementById('sunnah-congratulation');

    if (progressEl) progressEl.style.width = percentage + '%';
    if (percentEl) percentEl.textContent = percentage + '%';

    if (congratsEl) {
        if (percentage === 100) {
            congratsEl.classList.add('show');
        } else {
            congratsEl.classList.remove('show');
        }
    }
}

// ======================== HAJJ JOURNEY ========================
const hajjStepsData = [
    {
        title: "الإحرام ويوم التروية",
        date: "8 ذو الحجة (يوم التروية)",
        icon: "🕋",
        badgeClass: "wajib",
        badgeText: "بداية المناسك",
        description: "يغتسل الحاج ويحرم من ميقاته أو مكان إقامته متلبساً بالتلبية قائلاً: \"لبيك حجاً\"، ثم يتوجه إلى مشعر منى ويبيت فيها، ويصلي الصلوات قصراً دون جمع (الظهر والعصر والعشاء ركعتين، والمغرب والفجر دون قصر).",
        virtue: "يستحب الإكثار من التلبية: \"لبيك اللهم لبيك، لبيك لا شريك لك لبيك، إن الحمد والنعمة لك والملك، لا شريك لك\"، والاستعداد الروحي التام لوقوف عرفة العظيم."
    },
    {
        title: "الوقوف بعرفة",
        date: "9 ذو الحجة (يوم عرفة)",
        icon: "🏔️",
        badgeClass: "pillar",
        badgeText: "ركن الحج الأعظم",
        description: "يتوجه الحجاج بعد فجر اليوم التاسع إلى جبل عرفات، ويصلون الظهر والعصر جمعاً وقصراً جمع تقديم في وقت الظهر. ويقف الحجاج في عرفات يهللون ويكبرون ويدعون الله حتى غروب الشمس. والوقوف بعرفة هو ركن الحج الذي لا يصح الحج بدونه.",
        virtue: "قال النبي ﷺ: \"الحج عرفة\". وهو يوم مغفرة الذنوب والعتق من النار، وأفضل الدعاء دعاء يوم عرفة: \"لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير\"."
    },
    {
        title: "المبيت بمزدلفة",
        date: "ليلة 10 ذو الحجة (ليلة النحر)",
        icon: "⛺",
        badgeClass: "wajib",
        badgeText: "واجب عند الجمهور",
        description: "بعد غروب شمس يوم عرفة، ينفر الحجاج بهدوء وسكينة إلى مزدلفة. وهناك يصلون المغرب والعشاء جمع تأخير وقصراً للعشاء. ويبيتون ليلتهم بمزدلفة، ويجمعون منها حصيات رمي الجمار (7 حصيات لليوم الأول). ويصلون فيها الفجر ثم يتوجهون إلى منى قبل شروق الشمس.",
        virtue: "النفرة بسكينة وذكر الله عند المشعر الحرام بمزدلفة كما جاء في القرآن الكريم: ﴿ فَإِذَا أَفَضْتُمْ مِنْ عَرَفَاتٍ فَاذْكُرُوا اللَّهَ عِنْدَ الْمَشْعَرِ الْحَرَامِ ﴾."
    },
    {
        title: "النحر ورمي جمرة العقبة الكبرى",
        date: "10 ذو الحجة (يوم النحر / عيد الأضحى)",
        icon: "🐏",
        badgeClass: "vital",
        badgeText: "رمي ونحر",
        description: "يتوجه الحجاج إلى منى ليرموا جمرة العقبة الكبرى بسبع حصيات متعاقبات مع التكبير عند كل رمية. ثم يقوم الحاج بذبح هديه (الأضحية) ويأكل منها ويتصدق، وهو يوم العيد للمسلمين جميعاً.",
        virtue: "رمي الجمار طاعة لله وإحياء لسنة إبراهيم عليه السلام في مقاومة وسوسة الشيطان، والنحر تقرباً إلى الله وإطعاماً للفقراء والمساكين."
    },
    {
        title: "الحلق وطواف الإفاضة",
        date: "10 ذو الحجة (التحلل الأكبر)",
        icon: "✂️",
        badgeClass: "pillar",
        badgeText: "ركن الطواف",
        description: "بعد رمي جمرة العقبة والنحر، يحلق الرجل رأسه أو يقصره (والتقصير للمرأة)، وبذلك يتحلل التحلل الأول فيباح له كل شيء إلا النساء. ثم يتوجه إلى مكة ليطوف بالبيت طواف الإفاضة (ركن الحج) ويسعى بين الصفا والمروة إن كان عليه سعي، وبذلك يتحلل التحلل الأكبر.",
        virtue: "الحلق فيه دعاء النبي ﷺ للمحلقين بالمغفرة ثلاثاً وللمقصرين مرة. وطواف الإفاضة هو زيارة بيت الله الحرام بعد أداء المناسك تعبيراً عن كمال العبودية."
    },
    {
        title: "رمي الجمار في أيام التشريق وطواف الوداع",
        date: "11 - 13 ذو الحجة (أيام التشريق)",
        icon: "👋",
        badgeClass: "wajib",
        badgeText: "ختام المناسك",
        description: "يبيت الحجاج في منى ليالي أيام التشريق (11 و12 و13 ذو الحجة)، ويرمون الجمار الثلاث (الصغرى والوسطى والعقبة) كل يوم بسبع حصيات لكل جمرة بعد زوال الشمس. ويجوز للمتعجل الرحيل في ال12 بعد الرمي. وقبل السفر، يطوف طواف الوداع حول الكعبة ليكون آخر عهده بالبيت.",
        virtue: "قال تعالى: ﴿ وَاذْكُرُوا اللَّهَ فِي أَيَّامٍ مَعْدُودَاتٍ ﴾. ويستحب التكبير المطلق والمقيد خلال هذه الأيام، وهي أيام أكل وشرب وذكر لله تعالى."
    }
];

function selectHajjStep(index, btnElement) {
    const buttons = document.querySelectorAll('.hajj-step-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    btnElement.classList.add('active');

    const iconEl = document.getElementById('hj-icon');
    const titleEl = document.getElementById('hj-title');
    const dateEl = document.getElementById('hj-date');
    const badgeEl = document.getElementById('hj-badge');
    const descEl = document.getElementById('hj-description');
    const virtueEl = document.getElementById('hj-virtue');
    const card = document.getElementById('hajj-detail-card');

    const step = hajjStepsData[index];

    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';

        setTimeout(() => {
            if (iconEl) iconEl.textContent = step.icon;
            if (titleEl) titleEl.textContent = step.title;
            if (dateEl) dateEl.textContent = step.date;
            if (descEl) descEl.textContent = step.description;
            if (virtueEl) virtueEl.textContent = step.virtue;

            if (badgeEl) {
                badgeEl.textContent = step.badgeText;
                badgeEl.className = 'hajj-badge ' + step.badgeClass;
            }

            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200);
    }
}

// ======================== EIDIYA CARD GENERATOR ========================
function generateEidiyaCard() {
    const toName = document.getElementById('eidiya-to-input').value.trim();
    const amount = document.getElementById('eidiya-amount-input').value.trim();
    const currency = document.getElementById('eidiya-currency-input').value.trim() || 'ريال';
    const fromName = document.getElementById('eidiya-from-input').value.trim();

    if (!toName || !amount || !fromName) {
        if (!toName) document.getElementById('eidiya-to-input').style.borderColor = '#FF6B6B';
        if (!amount) document.getElementById('eidiya-amount-input').style.borderColor = '#FF6B6B';
        if (!fromName) document.getElementById('eidiya-from-input').style.borderColor = '#FF6B6B';

        setTimeout(() => {
            document.getElementById('eidiya-to-input').style.borderColor = '';
            document.getElementById('eidiya-amount-input').style.borderColor = '';
            document.getElementById('eidiya-from-input').style.borderColor = '';
        }, 1500);
        return;
    }

    const canvas = document.getElementById('eidiya-card-canvas');
    const ctx = canvas.getContext('2d');
    const W = 900, H = 500;
    canvas.width = W; canvas.height = H;

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#061F13');
    bg.addColorStop(0.5, '#0B2D1B');
    bg.addColorStop(1, '#020C07');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.globalAlpha = 0.04;
    ctx.fillStyle = '#D4AF37';
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) {
        ctx.beginPath();
        ctx.moveTo(W / 2, H / 2);
        ctx.lineTo(W / 2 + Math.cos(angle) * W, H / 2 + Math.sin(angle) * H);
        ctx.lineTo(W / 2 + Math.cos(angle + 0.1) * W, H / 2 + Math.sin(angle + 0.1) * H);
        ctx.closePath();
        ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 6;
    ctx.strokeRect(15, 15, W - 30, H - 30);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(25, 25, W - 50, H - 50);

    ctx.font = '35px serif';
    ctx.fillStyle = '#D4AF37';
    ctx.textAlign = 'center';
    ctx.fillText('✦', 45, 60);
    ctx.fillText('✦', W - 45, 60);
    ctx.fillText('✦', 45, H - 45);
    ctx.fillText('✦', W - 45, H - 45);

    ctx.fillStyle = '#D4AF37';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
    ctx.shadowBlur = 12;
    ctx.font = '700 42px "Scheherazade New", "Amiri", serif';
    ctx.fillText('سَنَدُ عِيدِيَّةٍ مُبَارَكَة', W / 2, 85);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 120, 110);
    ctx.lineTo(W / 2 + 120, 110);
    ctx.stroke();

    const badgeX = 180, badgeY = 280, badgeW = 220, badgeH = 140;
    const badgeGrad = ctx.createLinearGradient(badgeX - badgeW / 2, 0, badgeX + badgeW / 2, 0);
    badgeGrad.addColorStop(0, '#9A7B1C');
    badgeGrad.addColorStop(0.5, '#D4AF37');
    badgeGrad.addColorStop(1, '#9A7B1C');
    ctx.fillStyle = badgeGrad;
    ctx.beginPath();
    ctx.roundRect(badgeX - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 16);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(badgeX - badgeW / 2 + 8, badgeY - badgeH / 2 + 8, badgeW - 16, badgeH - 16, 10);
    ctx.stroke();

    ctx.fillStyle = '#030A14';
    ctx.font = '700 48px "Noto Naskh Arabic", "Amiri", serif';
    ctx.fillText(amount, badgeX, badgeY + 10);

    ctx.font = '700 22px "Scheherazade New", "Amiri", serif';
    ctx.fillText(currency, badgeX, badgeY + 42);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(240, 230, 200, 0.75)';
    ctx.font = '24px "Scheherazade New", "Amiri", serif';
    ctx.fillText('يُمنح هذا السند إلى البطل/الأميرة:', W - 100, 190);

    ctx.fillStyle = '#F5D676';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
    ctx.shadowBlur = 15;
    ctx.font = '700 48px "Scheherazade New", "Amiri", serif';
    ctx.fillText(toName, W - 100, 255);
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(240, 230, 200, 0.75)';
    ctx.font = '24px "Scheherazade New", "Amiri", serif';
    ctx.fillText('تهنئة بمناسبة عيد الأضحى المبارك، عساكم من عواده!', W - 100, 315);

    ctx.fillStyle = 'rgba(212, 175, 55, 0.9)';
    ctx.font = '700 28px "Scheherazade New", "Amiri", serif';
    ctx.fillText('مُقدّم العيدية بكل حب: ' + fromName, W - 100, 385);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 440);
    ctx.lineTo(W - 100, 440);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(240, 230, 200, 0.4)';
    ctx.font = '18px "Scheherazade New", serif';
    ctx.fillText('✨ كل عام وأنتم بخير وسعادة ✨', W / 2, 470);

    const wrapper = document.getElementById('eidiya-card-wrapper');
    wrapper.style.display = 'block';
    wrapper.style.animation = 'cardReveal 0.8s ease';
    emojiRain('🎉');
}

function downloadEidiya() {
    const canvas = document.getElementById('eidiya-card-canvas');
    const link = document.createElement('a');
    link.download = 'eidiya-check.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function shareEidiya() {
    const toName = document.getElementById('eidiya-to-input').value.trim() || 'البطل';
    const amount = document.getElementById('eidiya-amount-input').value.trim() || 'العيدية';
    const currency = document.getElementById('eidiya-currency-input').value.trim() || 'ريال';
    const fromName = document.getElementById('eidiya-from-input').value.trim() || 'محبكم';

    const msg = 'كل عام وأنت بخير يا ' + toName + ' بمناسبة عيد الأضحى المبارك! 🐑✨\nلقد صنعت لك عيدية مخصصة بقيمة: ' + amount + ' ' + currency + '\nمن: ' + fromName + ' 🎁❤️';
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
}

// ======================== ATHKAR HUB LOGIC ========================
function filterAthkar(category, btn) {
    document.querySelectorAll('.athkar-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.thikr-card').forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function countThikr(id, max, btn) {
    const countEl = btn.querySelector('.current-count');
    let count = parseInt(countEl.textContent);
    if (count < max) {
        count++;
        countEl.textContent = count;
        const progressInner = document.getElementById('progress-' + id);
        if (progressInner) {
            const percent = Math.min(100, (count / max) * 100);
            progressInner.style.width = percent + '%';
        }

        // Play tiny tick sound
        try {
            const ac = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ac.createOscillator();
            const g = ac.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, ac.currentTime);
            g.gain.setValueAtTime(0.05, ac.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
            osc.connect(g);
            g.connect(ac.destination);
            osc.start();
            osc.stop(ac.currentTime + 0.08);
        } catch (e) { }

        if (count === max) {
            btn.classList.add('completed');
            emojiRain('✨');

            // Success ring sound
            try {
                const ac = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ac.createOscillator();
                const g = ac.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, ac.currentTime); // C5
                osc.frequency.setValueAtTime(659.25, ac.currentTime + 0.1); // E5
                osc.frequency.setValueAtTime(783.99, ac.currentTime + 0.2); // G5
                g.gain.setValueAtTime(0.1, ac.currentTime);
                g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5);
                osc.connect(g);
                g.connect(ac.destination);
                osc.start();
                osc.stop(ac.currentTime + 0.5);
            } catch (e) { }
        }
    }
}

function copyThikr(id, btn) {
    const text = document.getElementById('thikr-text-' + id).textContent;
    navigator.clipboard.writeText(text).then(() => {
        const origText = btn.textContent;
        btn.textContent = '✅ تم النسخ';
        btn.style.color = '#1A8C60';
        btn.style.borderColor = '#1A8C60';
        setTimeout(() => {
            btn.textContent = origText;
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function shareThikr(id) {
    const text = document.getElementById('thikr-text-' + id).textContent;
    const shareText = encodeURIComponent(`${text}\n\n(منصة أذكار العيد 🕋✨)`);
    window.open(`https://wa.me/?text=${shareText}`, '_blank');
}

// ======================== SPIRITUAL MODE LOGIC ========================
let spiritualModeActive = false;
let spiritualPrevVolumes = null;
let spiritualAnimId = null;
let spiritualStars = [];

function toggleSpiritualMode() {
    const body = document.body;
    const btn = document.getElementById('floating-spiritual');
    spiritualModeActive = !spiritualModeActive;

    if (spiritualModeActive) {
        body.classList.add('spiritual-active');
        btn.classList.add('active');
        btn.textContent = '🌙';

        // Store previous volumes
        spiritualPrevVolumes = {
            main: ytReadyMain && ytPlayerMain ? ytPlayerMain.getVolume() : 70,
            talbiyah: document.getElementById('volume-talbiyah').value,
            ambience: document.getElementById('volume-ambience').value
        };

        // Apply quiet spiritual mix
        if (!musicPlaying) {
            startMusic();
        }

        // Fade main to 15
        if (ytReadyMain && ytPlayerMain) ytPlayerMain.setVolume(15);
        // Fade Talbiyah to 40
        if (ytReadyTalbiyah && ytPlayerTalbiyah) {
            ytPlayerTalbiyah.setVolume(40);
            ytPlayerTalbiyah.playVideo();
        }
        // Fade Ambience to 30
        if (ytReadyAmbience && ytPlayerAmbience) {
            ytPlayerAmbience.setVolume(30);
            ytPlayerAmbience.playVideo();
        }

        // Update mixer UI sliders
        document.getElementById('volume-talbiyah').value = 40;
        const valTalb = document.getElementById('val-talbiyah');
        if (valTalb) valTalb.textContent = '40%';

        document.getElementById('volume-ambience').value = 30;
        const valAmb = document.getElementById('val-ambience');
        if (valAmb) valAmb.textContent = '30%';

        // Start Canvas animation
        startSpiritualStars();

    } else {
        body.classList.remove('spiritual-active');
        btn.classList.remove('active');
        btn.textContent = '✨';

        // Restore previous volumes
        if (spiritualPrevVolumes) {
            if (ytReadyMain && ytPlayerMain) ytPlayerMain.setVolume(spiritualPrevVolumes.main);

            const talb = parseInt(spiritualPrevVolumes.talbiyah);
            if (ytReadyTalbiyah && ytPlayerTalbiyah) {
                ytPlayerTalbiyah.setVolume(talb);
                if (talb === 0) ytPlayerTalbiyah.pauseVideo();
            }

            const amb = parseInt(spiritualPrevVolumes.ambience);
            if (ytReadyAmbience && ytPlayerAmbience) {
                ytPlayerAmbience.setVolume(amb);
                if (amb === 0) ytPlayerAmbience.pauseVideo();
            }

            document.getElementById('volume-talbiyah').value = spiritualPrevVolumes.talbiyah;
            const valTalb = document.getElementById('val-talbiyah');
            if (valTalb) valTalb.textContent = spiritualPrevVolumes.talbiyah + '%';

            document.getElementById('volume-ambience').value = spiritualPrevVolumes.ambience;
            const valAmb = document.getElementById('val-ambience');
            if (valAmb) valAmb.textContent = spiritualPrevVolumes.ambience + '%';
        }

        // Stop Canvas animation
        stopSpiritualStars();
    }
}

function startSpiritualStars() {
    const canvas = document.getElementById('spiritual-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    spiritualStars = [];

    class ShootingStar {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height * 0.5;
            this.len = Math.random() * 80 + 50;
            this.speed = Math.random() * 6 + 4;
            this.opacity = Math.random() * 0.4 + 0.3;
            this.dx = Math.random() * 2 - 4; // slant left-downwards
            this.dy = this.speed;
        }
        update() {
            this.x += this.dx;
            this.y += this.dy;
            if (this.y > canvas.height + this.len || this.x < -this.len) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.strokeStyle = `rgba(255, 230, 150, ${this.opacity})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.dx * (this.len / this.speed), this.y + this.dy * (this.len / this.speed));
            ctx.stroke();
            ctx.restore();
        }
    }

    for (let i = 0; i < 4; i++) {
        spiritualStars.push(new ShootingStar());
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        spiritualStars.forEach(s => {
            s.update();
            s.draw();
        });
        spiritualAnimId = requestAnimationFrame(loop);
    }
    loop();
}

function stopSpiritualStars() {
    if (spiritualAnimId) {
        cancelAnimationFrame(spiritualAnimId);
        spiritualAnimId = null;
    }
    const canvas = document.getElementById('spiritual-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
// ======================== ARAFAH DUA WALL ========================
let selectedDuaTarget = 'عائلتي';
let selectedDuaTheme = 'gold';

function selectDuaTarget(target, btn) {
    document.querySelectorAll('.dua-target-selector .target-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedDuaTarget = target;
}

function selectDuaTheme(theme, btn) {
    document.querySelectorAll('.dua-theme-selector .theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedDuaTheme = theme;
}

const defaultDuas = [
    {
        id: 'default-1',
        text: "اللهم احفظ لي عائلتي وأحبتي من كل سوء، واجمعنا دائماً على طاعتك ورضاك، واكتب لنا الأجر والمغفرة في هذا اليوم العظيم.",
        author: "فاعل خير",
        target: "عائلتي",
        theme: "gold",
        date: "يوم عرفة",
        amen: 24
    },
    {
        id: 'default-2',
        text: "اللهم فرج هم المهمومين من المسلمين، واقضِ الدين عن المدينين، واشفِ مرضانا ومرضى المسلمين جميعاً يا أرحم الراحمين.",
        author: "محب للخير",
        target: "عام",
        theme: "emerald",
        date: "يوم عرفة",
        amen: 45
    },
    {
        id: 'default-3',
        text: "يا رب لا تغرب شمس يوم عرفة إلا وقد غفرت ذنبي، وسترت عيبي، ويسرت أمري، وقبلت توبتي ودعائي وجعلتني من عتقائك من النار.",
        author: "أمة الله",
        target: "نفسي",
        theme: "purple",
        date: "يوم عرفة",
        amen: 31
    }
];

function getDuasFromStorage() {
    const saved = localStorage.getItem('arafah_custom_duas');
    if (saved !== null) {
        return JSON.parse(saved);
    } else {
        localStorage.setItem('arafah_custom_duas', JSON.stringify(defaultDuas));
        return defaultDuas;
    }
}

function saveDuasToStorage(duas) {
    localStorage.setItem('arafah_custom_duas', JSON.stringify(duas));
}

function loadDuaWall() {
    const allDuas = getDuasFromStorage();
    const grid = document.getElementById('dua-wall-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (allDuas.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-light); opacity: 0.5; padding: 3rem 1rem; font-family: 'Amiri', serif; font-size: 1.25rem; direction: rtl;">لا توجد أدعية منشورة حالياً.. اكتب دعاءك الأول وانشره على الجدار! 🤲✨</div>`;
        return;
    }

    allDuas.forEach((dua, idx) => {
        // Deterministic random rotation to keep the cards slightly rotated but static
        const rotations = [-2.5, 1.8, -1.2, 2.2, -1.8, 1.5];
        const rot = rotations[idx % rotations.length];

        const card = document.createElement('div');
        card.className = `dua-wall-card dua-card-${dua.theme}`;
        card.style.transform = `rotate(${rot}deg)`;
        card.id = `dua-card-${dua.id}`;

        let targetLabel = 'عائلتي';
        if (dua.target === 'أصدقائي') targetLabel = '🤝 الأصدقاء';
        else if (dua.target === 'عائلتي') targetLabel = '👨‍👩‍👧‍👦 العائلة';
        else if (dua.target === 'نفسي') targetLabel = '🤲 النفس';
        else if (dua.target === 'عام') targetLabel = '🌍 عام للمسلمين';

        card.innerHTML = `
                    <div class="dua-card-pin">📌</div>
                    <div class="dua-card-hearts"></div>
                    <div class="dua-card-header">
                        <span class="dua-card-tag">${targetLabel}</span>
                        <span class="dua-card-date">${dua.date}</span>
                    </div>
                    <div class="dua-card-body">${dua.text}</div>
                    <div class="dua-card-author">✍️ بقلم: ${dua.author}</div>
                    <div class="dua-card-footer">
                        <button class="dua-amen-btn" onclick="amenDua('${dua.id}', this)">
                            <span>❤️</span> آمين (<span class="amen-count">${dua.amen}</span>)
                        </button>
                        <div class="dua-card-actions">
                            <button class="dua-card-action-btn" onclick="copyCustomDua('${dua.id}')" title="نسخ الدعاء">📋</button>
                            <button class="dua-card-action-btn" onclick="shareCustomDua('${dua.id}')" title="مشاركة على واتساب">💬</button>
                            <button class="dua-card-action-btn" onclick="deleteCustomDua('${dua.id}')" style="color:#ff6b6b; border-color:rgba(255,107,107,0.2);" title="حذف الدعاء">🗑️</button>
                        </div>
                    </div>
                `;
        grid.appendChild(card);
    });
}

function postDua() {
    const textEl = document.getElementById('dua-text-input');
    const authorEl = document.getElementById('dua-author-input');

    const text = textEl.value.trim();
    let author = authorEl.value.trim();

    if (!text) {
        textEl.style.borderColor = '#ff6b6b';
        setTimeout(() => textEl.style.borderColor = '', 1500);
        return;
    }

    if (!author) author = 'فاعل خير';

    const newDua = {
        id: 'custom-' + Date.now(),
        text: text,
        author: author,
        target: selectedDuaTarget,
        theme: selectedDuaTheme,
        date: 'يوم عرفة',
        amen: 0
    };

    const customDuas = getDuasFromStorage();
    customDuas.unshift(newDua);
    saveDuasToStorage(customDuas);

    textEl.value = '';
    authorEl.value = '';

    loadDuaWall();
    emojiRain('🤲');

    setTimeout(() => {
        const newCard = document.getElementById(`dua-card-${newDua.id}`);
        if (newCard) {
            newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            newCard.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.8)';
            setTimeout(() => newCard.style.boxShadow = '', 2000);
        }
    }, 200);
}

function createFloatingHeart(cardElement) {
    const container = cardElement.querySelector('.dua-card-hearts');
    if (!container) return;

    const heart = document.createElement('div');
    heart.textContent = '❤️';
    heart.style.position = 'absolute';
    heart.style.bottom = '20px';
    heart.style.left = (Math.random() * 60 + 20) + '%';
    heart.style.fontSize = (Math.random() * 0.8 + 0.6) + 'rem';
    heart.style.opacity = '1';
    heart.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
    container.appendChild(heart);

    setTimeout(() => {
        heart.style.transform = `translateY(-80px) translateX(${Math.random() * 40 - 20}px) scale(1.4)`;
        heart.style.opacity = '0';
    }, 50);

    setTimeout(() => heart.remove(), 1050);
}

function amenDua(id, btn) {
    const sessionKey = `amen_clicked_${id}`;
    if (sessionStorage.getItem(sessionKey)) {
        const card = btn.closest('.dua-wall-card');
        createFloatingHeart(card);
        return;
    }

    sessionStorage.setItem(sessionKey, 'true');
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => btn.style.transform = '', 200);

    const card = btn.closest('.dua-wall-card');
    createFloatingHeart(card);

    const customDuas = getDuasFromStorage();
    const found = customDuas.find(d => d.id === id);
    if (found) {
        found.amen++;
        saveDuasToStorage(customDuas);
        btn.querySelector('.amen-count').textContent = found.amen;
    }
}

function copyCustomDua(id) {
    const customDuas = getDuasFromStorage();
    const found = customDuas.find(d => d.id === id);
    if (found && found.text) {
        navigator.clipboard.writeText(found.text).then(() => {
            emojiRain('✨');
        });
    }
}

function shareCustomDua(id) {
    const customDuas = getDuasFromStorage();
    const found = customDuas.find(d => d.id === id);
    if (found && found.text) {
        const msg = `الدعاء المستحب في يوم عرفة 🕋:\n\n"${found.text}"\n\nتقبل الله منا ومنكم صالح الأعمال 🤲✨`;
        window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
    }
}

function deleteCustomDua(id) {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا الدعاء من لوحتك؟')) {
        let customDuas = getDuasFromStorage();
        customDuas = customDuas.filter(d => d.id !== id);
        saveDuasToStorage(customDuas);
        loadDuaWall();
    }
}

function clearAllDuas() {
    if (confirm('هل أنت متأكد من مسح جميع الأدعية المكتوبة بواسطتك؟')) {
        saveDuasToStorage([]);
        loadDuaWall();
    }
}