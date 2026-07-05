// Interactive Functional Controls for StellarMedia
document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Navigation Toggle System
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            const icon = navToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        const structuralLinks = navLinks.querySelectorAll('a');
        structuralLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // 2. Master-Detail split view — used by both Graphic Design cards and the Video Editing carousel.
    //    Clicking an item performs a shared-element (FLIP) "hero" transition: the clicked box
    //    smoothly scales up and slides into the left-hand hero pane, while a scrollable side
    //    panel of options slides in from the right.
    const detailView = document.getElementById('detailView');
    const detailHero = document.getElementById('detailHero');
    const detailHeroImg = document.getElementById('detailHeroImg');
    const detailHeroBadge = document.getElementById('detailHeroBadge');
    const detailHeroTitle = document.getElementById('detailHeroTitle');
    const detailPanel = document.getElementById('detailPanel');
    const detailPanelTitle = document.getElementById('detailPanelTitle');
    const detailPanelDesc = document.getElementById('detailPanelDesc');
    const detailOptionsList = document.getElementById('detailOptionsList');

    let originEl = null;
    let isCarouselFrozen = false; // pauses the 3D spin while the detail view is open

    function buildOptionsList(options) {
        if (!detailOptionsList) return;
        detailOptionsList.innerHTML = '';
        (options || []).forEach((opt) => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${opt}</span>`;
            detailOptionsList.appendChild(li);
        });
    }

    function openDetailView(cardEl, data, isFestival) {
        if (!detailView || !detailHero) return;

        originEl = cardEl;
        const startRect = cardEl.getBoundingClientRect();

        // Populate content before measuring, so the hero pane's final layout is accurate
        detailHeroImg.src = data.image;
        detailHeroImg.alt = data.title;
        detailHeroBadge.innerHTML = `<i class="${data.icon}"></i>`;
        detailHeroTitle.textContent = data.title;
        detailPanelTitle.textContent = data.title;
        detailPanelDesc.textContent = data.desc;
        buildOptionsList(data.options);

        detailView.classList.toggle('theme-festival', !!isFestival);
        detailView.classList.add('open');
        detailView.setAttribute('aria-hidden', 'false');
        detailPanel.classList.remove('open');
        detailHero.style.transition = 'none';

        requestAnimationFrame(() => {
            const finalRect = detailHero.getBoundingClientRect();

            const deltaX = startRect.left - finalRect.left;
            const deltaY = startRect.top - finalRect.top;
            const scaleX = startRect.width / finalRect.width;
            const scaleY = startRect.height / finalRect.height;

            // Start the hero pane exactly where the clicked card was (First -> Invert)
            detailHero.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;

            requestAnimationFrame(() => {
                // Then animate it to its natural position/size (Play)
                detailHero.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
                detailHero.style.transform = 'translate(0, 0) scale(1, 1)';
            });

            // Side panel slides in shortly after the hero starts moving
            setTimeout(() => {
                detailPanel.classList.add('open');
            }, 200);
        });
    }

    function closeDetailView() {
        if (!detailView || !detailView.classList.contains('open')) return;

        detailPanel.classList.remove('open');

        if (originEl) {
            const backRect = originEl.getBoundingClientRect();
            const finalRect = detailHero.getBoundingClientRect();

            const deltaX = backRect.left - finalRect.left;
            const deltaY = backRect.top - finalRect.top;
            const scaleX = backRect.width / finalRect.width;
            const scaleY = backRect.height / finalRect.height;

            detailHero.style.transition = 'transform 0.45s ease';
            detailHero.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
        }

        setTimeout(() => {
            detailView.classList.remove('open');
            detailView.setAttribute('aria-hidden', 'true');
            detailHero.style.transition = 'none';
            detailHero.style.transform = 'none';
            originEl = null;
            isCarouselFrozen = false;
        }, 420);
    }

    if (detailView) {
        detailView.querySelectorAll('[data-close]').forEach((el) => {
            el.addEventListener('click', closeDetailView);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDetailView();
        });
    }

    // --- Placeholder sample data ---
    // These are temporary stock images/descriptions so the click-to-sample feature works end to end.
    // Swap the "image" values and "options" lists for your own project work whenever you have it.
    const DESIGN_SAMPLES = [
        {
            title: 'Logo & Brand Identity',
            icon: 'fa-solid fa-bezier-curve',
            image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
            desc: 'Sample brand-mark styling — the kind of clean, versatile identity work we build for a logo & brand kit project.',
            options: [
                'Primary logo + 2 alternate marks',
                'Color palette & typography system',
                'Brand style guide (PDF)',
                'Social profile & favicon sizing',
                'Source files (AI, EPS, PNG, SVG)'
            ]
        },
        {
            title: 'Social Media Graphics',
            icon: 'fa-solid fa-hashtag',
            image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
            desc: 'A sample of the scroll-stopping, on-platform graphic style we use for posts, stories, and carousels.',
            options: [
                'Custom post & story templates',
                'Carousel & cover designs',
                'Platform-correct sizing (IG/FB/TikTok)',
                'On-brand color & type system',
                'Editable template files'
            ]
        },
        {
            title: 'Marketing Materials',
            icon: 'fa-solid fa-bullhorn',
            image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
            desc: 'A sample layout showing the print-ready poster and flyer style we deliver for marketing campaigns.',
            options: [
                'Print-ready posters & flyers',
                'Brochure & one-pager layouts',
                'Bleed/CMYK-correct print files',
                'Digital ad variants',
                'Two rounds of revisions'
            ]
        },
        {
            title: 'Pitch Decks & Infographics',
            icon: 'fa-solid fa-chart-pie',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
            desc: 'A sample of our presentation planning process — turning dense data into a clear visual story.',
            options: [
                'Custom slide template system',
                'Data visualization & icon set',
                'Investor-ready narrative flow',
                'Editable PPTX / Keynote / Figma',
                'Infographic export (PNG/PDF)'
            ]
        },
        {
            title: 'Photo Editing & Compositing',
            icon: 'fa-solid fa-wand-magic-sparkles',
            image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
            desc: 'A sample retouching and compositing workspace, similar to the setup we use for photo manipulation work.',
            options: [
                'Color correction & retouching',
                'Background removal/compositing',
                'Multi-image blends & manipulation',
                'High-res export for print & web',
                'Before/after revision pass'
            ]
        },
        {
            title: 'Print & Event Graphics',
            icon: 'fa-solid fa-print',
            image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
            desc: 'A sample of the collaborative process behind our business card, invitation, and event graphic work.',
            options: [
                'Business card & stationery design',
                'Invitation & menu layouts',
                'Certificates & event signage',
                'Print-ready files (CMYK, bleed)',
                'Quick-turn rush option available'
            ]
        }
    ];

    const VIDEO_SAMPLES = [
        {
            title: 'Short-Form & Viral Edits',
            icon: 'fa-brands fa-tiktok',
            image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
            desc: 'A sample of the punchy, fast-cut style we use for TikToks, Reels, and Shorts.',
            options: [
                '9:16 vertical edit (TikTok/Reels/Shorts)',
                'Trending audio sync',
                'Animated captions & text pops',
                'Fast-paced trend-style cuts',
                '24–48 hr turnaround'
            ]
        },
        {
            title: 'Long-Form & YouTube',
            icon: 'fa-brands fa-youtube',
            image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
            desc: 'A sample editing timeline, similar to the multi-track sequencing we use for vlogs and YouTube content.',
            options: [
                'Multi-track timeline editing',
                'Chapter markers & pacing edits',
                'Intro/outro & lower thirds',
                'Color pass & audio cleanup',
                'Up to 3 revision rounds'
            ]
        },
        {
            title: 'Podcasts & Interviews',
            icon: 'fa-solid fa-microphone-lines',
            image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
            desc: 'A sample of the talking-head and interview editing style we use for podcast and conversation content.',
            options: [
                'Multi-cam talking-head editing',
                'Clean audio leveling & noise removal',
                'Highlight/clip cutdowns for social',
                'Caption & subtitle burn-in',
                'Episode thumbnail included'
            ]
        },
        {
            title: 'Gaming & Events',
            icon: 'fa-solid fa-gamepad',
            image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
            desc: 'A sample creative workstation, similar to the setup behind our gaming montage and event highlight edits.',
            options: [
                'Synced multi-source gameplay edit',
                'Highlight montage pacing',
                'Event recap & sizzle-reel cut',
                'Custom overlays & sound effects',
                'Fast delivery for live events'
            ]
        },
        {
            title: 'Color Grading & VFX',
            icon: 'fa-solid fa-film',
            image: 'https://images.unsplash.com/photo-1608699565424-597c238383c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
            desc: 'A cinematic sample showing the kind of color treatment and visual polish we apply in post-production.',
            options: [
                'Cinematic color grade (LUT-based)',
                'Scene-to-scene color matching',
                'Motion graphics & VFX compositing',
                'Transition & title design',
                'Master export in multiple formats'
            ]
        },
        {
            title: 'Audio & Enhancements',
            icon: 'fa-solid fa-headphones',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
            desc: 'A sample of our process for sound design, audio cleanup, and mix enhancement.',
            options: [
                'Dialogue cleanup & noise reduction',
                'Music bed selection & mixing',
                'Loudness leveling for platform specs',
                'Caption/subtitle file generation',
                'Custom intro/outro stinger'
            ]
        }
    ];

    // Wire up click-to-detail on the Graphic Design cards (no festival background — see CSS)
    document.querySelectorAll('#services .service-card').forEach((card) => {
        const index = parseInt(card.getAttribute('data-sample-index'), 10);
        const sample = DESIGN_SAMPLES[index];
        if (!sample) return;
        card.addEventListener('click', () => openDetailView(card, sample, false));
    });

    // 3. 3D Cursor-Swipe Video Carousel
    //    - Swiping spins it (more sensitive than a plain hover-tilt)
    //    - It keeps spinning with a bit of momentum, then snaps to land on one option
    //    - Clicking a card opens the matching item in the festival-themed detail view
    function initCursorCarousel() {
        const track = document.getElementById('videoCarouselTrack');
        const container = document.querySelector('.video-3d-section');
        if (!track || !container) return;

        const items = Array.from(track.querySelectorAll('.carousel-item-3d'));

        // Click-to-sample works the same on phone and desktop, so wire it up
        // no matter which layout is active below.
        items.forEach((item) => {
            const sampleIndex = parseInt(item.getAttribute('data-sample-index'), 10);
            const sample = VIDEO_SAMPLES[sampleIndex];
            if (sample) {
                item.addEventListener('click', () => {
                    isCarouselFrozen = true;
                    openDetailView(item, sample, true);
                });
            }
        });

        // On phones, stop right here. CSS lays these same cards out as a
        // plain stacked list on narrow screens (see the @media block in
        // style.css), so there is no 3D rotation to set up — the cards
        // just sit in normal document flow and the page scrolls normally.
        const isMobileLayout = window.matchMedia('(max-width: 768px)').matches;
        if (isMobileLayout) return;

        // ---- Everything below this line only runs on wider (desktop/laptop) screens ----
        const itemCount = items.length;
        const anglePerItem = 360 / itemCount;
        const radius = 420;

        items.forEach((item, index) => {
            const angle = index * anglePerItem;
            item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        });

        let rotationY = 0;
        let velocity = 0;
        let lastPointerX = null;
        let snapping = false;
        let snapTarget = 0;
        let stopTimer = null;

        const sensitivity = 0.10; // very gentle — higher = more rotation per pixel swiped
        const maxDelta = 22;      // clamps any single jump (e.g. the pointer re-entering fast)
        const friction = 0.92;    // how gradually the spin slows down while you swipe

        function nearestSnapAngle(angle) {
            return Math.round(angle / anglePerItem) * anglePerItem;
        }

        function scheduleSnap() {
            clearTimeout(stopTimer);
            stopTimer = setTimeout(() => {
                snapTarget = nearestSnapAngle(rotationY);
                snapping = true;
            }, 160); // short pause after a swipe before it locks onto the nearest option
        }

        container.addEventListener('pointermove', (e) => {
            if (isCarouselFrozen) return;
            snapping = false;
            if (lastPointerX !== null) {
                let deltaX = e.clientX - lastPointerX;
                deltaX = Math.max(-maxDelta, Math.min(maxDelta, deltaX));
                velocity += deltaX * sensitivity;
            }
            lastPointerX = e.clientX;
            scheduleSnap();
        });

        container.addEventListener('pointerleave', () => {
            lastPointerX = null;
            if (isCarouselFrozen) return;
            clearTimeout(stopTimer);
            snapTarget = nearestSnapAngle(rotationY);
            snapping = true;
        });

        // Figures out which card is currently facing front, so it can be highlighted
        function updateFrontCard() {
            let minDiff = Infinity;
            let frontIndex = 0;
            items.forEach((item, i) => {
                const itemAngle = i * anglePerItem;
                let combined = (itemAngle + rotationY) % 360;
                if (combined < 0) combined += 360;
                const diff = Math.min(combined, 360 - combined);
                if (diff < minDiff) {
                    minDiff = diff;
                    frontIndex = i;
                }
            });
            items.forEach((item, i) => item.classList.toggle('is-front', i === frontIndex));
        }

        function animate3D() {
            if (!isCarouselFrozen) {
                if (snapping) {
                    rotationY += (snapTarget - rotationY) * 0.12;
                    velocity = 0;
                    if (Math.abs(snapTarget - rotationY) < 0.05) {
                        rotationY = snapTarget;
                        snapping = false;
                    }
                } else {
                    velocity *= friction;
                    rotationY += velocity;
                }

                track.style.transform = `translateZ(-${radius}px) rotateY(${rotationY}deg)`;
                updateFrontCard();
            }

            requestAnimationFrame(animate3D);
        }

        updateFrontCard();
        animate3D();
    }

    initCursorCarousel();

    // 4. Project Inquiry Form Submission Validation Handler
    const projectForm = document.getElementById('projectForm');

    if (projectForm) {
        projectForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const nameField = document.getElementById('clientName').value.trim();
            const emailField = document.getElementById('clientEmail').value.trim();
            const serviceField = document.getElementById('serviceType').value.trim();
            const messageField = document.getElementById('projectDetails').value.trim();

            if (nameField && emailField && serviceField && messageField) {
                alert(`Thank you, ${nameField}! Your request regarding "${serviceField}" has been received. Our team will contact you back at ${emailField} shortly.`);
                projectForm.reset();
            } else {
                alert('Please check your entries and fulfill all mandatory parameters.');
            }
        });
    }
});
