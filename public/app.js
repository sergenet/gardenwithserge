// Migrate old localStorage language keys to the new format and clean up

async function initializeCommerceAvailability() {
    const status = document.getElementById('commerce-status');
    const stripeButtons = document.querySelectorAll('.stripe-half');
    const paypalButtons = document.querySelectorAll('.paypal-half');
    [...stripeButtons, ...paypalButtons].forEach((button) => { button.disabled = true; });
    try {
        const response = await fetch('/api/commerce/config', { credentials: 'same-origin' });
        if (!response.ok) throw new Error('Commerce configuration unavailable');
        const config = await response.json();
        if (config.enabled && config.stripe) {
            stripeButtons.forEach((button) => { button.disabled = false; });
        }
        if (config.enabled && config.paypal) {
            paypalButtons.forEach((button) => { button.disabled = false; });
        }
        if (status && config.enabled && (config.stripe || config.paypal)) {
            status.textContent = 'Secure checkout is available through the enabled payment options below.';
            status.className = 'mt-3 rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-900 max-w-3xl mx-auto';
        }
    } catch {
        if (status) status.textContent = 'New membership checkout is temporarily unavailable. No payment was attempted.';
    }
}

document.addEventListener('DOMContentLoaded', initializeCommerceAvailability);
(function() {
    // Migrate 'selectedLanguage' -> 'preferred-language' if needed
    const oldLang = localStorage.getItem('selectedLanguage');
    if (oldLang && !localStorage.getItem('preferred-language')) {
        localStorage.setItem('preferred-language', oldLang);
    }
    if (!oldLang && localStorage.getItem('preferred-language')) {
        localStorage.setItem('selectedLanguage', localStorage.getItem('preferred-language'));
    }

    // Optionally, clean up other obsolete keys here
    // localStorage.removeItem('anotherOldLanguageKey');
})();
// Main JavaScript functionality for Garden with Serge

// ---- Remove old language cookie for all users ----
document.cookie = 'language=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

function userHasUnlimitedAnalysis() {
    return window.membershipType === 'basic' || window.membershipType === 'green_thumb';
}

async function loadMembershipStatus() {
    try {
        const response = await fetch('/api/membership/status', {
            method: 'GET',
            credentials: 'same-origin'
        });
        if (!response.ok) {
            return;
        }
        const data = await response.json();
        if (data && data.tier) {
            window.membershipType = data.tier;
            updateAnalysisCounter();
        }
    } catch (_) {
        // Non-blocking: fallback to free behavior if status endpoint is unavailable.
    }
}

// Daily analysis tracking
let dailyAnalysisCount = getDailyAnalysisCount();
let selectedFile = null;
let currentStep = 'upload'; // 'upload', 'identification', 'analysis', 'results'
let activeAnalysisData = null;

// Cookie management for daily analysis tracking
function getDailyAnalysisCount() {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('plantAnalysisDaily');
    if (storedData) {
        const data = JSON.parse(storedData);
        if (data.date === today) {
            return data.count;
        }
    }
    // Reset for new day
    return 0;
}

function incrementAnalysisCount() {
    const today = new Date().toDateString();
    dailyAnalysisCount++;
    localStorage.setItem('plantAnalysisDaily', JSON.stringify({
        date: today,
        count: dailyAnalysisCount
    }));
    updateAnalysisCounter();
}

function updateAnalysisCounter() {
    const dailyLimit = 3;
    const remaining = Math.max(0, dailyLimit - dailyAnalysisCount);

    // Load active dictionary
    const lang = window.currentLanguage || 'en';
    const dict = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : {};

    // Get translations with clean English fallbacks
    const unlimitedText = dict['unlimited-analyses'] || 'Unlimited analyses';
    const freeAnalysisText = dict['free-analysis-counter'] || '3 free plant identifications per day';
    const counterUnlimited = dict['counter-unlimited'] || 'Unlimited';
    const counterNoLeft = dict['counter-no-left'] || 'No free analysis left today';
    
    let leftTemplate = dict['analyses-left'] || '{remaining} of {limit} left';
    const remainingText = leftTemplate
        .replace('{remaining}', remaining)
        .replace('{limit}', dailyLimit);

    // 1. Top/main counter: Unlimited for members, 3 for visitors
    const mainCounterElements = [
        document.getElementById('free-analysis-counter'),
        document.getElementById('free-analysis-counter-text')
    ];
    mainCounterElements.forEach(mainCounterElement => {
        if (mainCounterElement) {
            if (userHasUnlimitedAnalysis()) {
                mainCounterElement.textContent = unlimitedText;
            } else {
                mainCounterElement.textContent = freeAnalysisText;
            }
        }
    });

    // 2. Bottom (Plant Doctor) counter
    const counterElements = [
        document.getElementById('analysis-counter-stats'),
        document.getElementById('analysis-counter-doctor')
    ];
    counterElements.forEach(counterElement => {
        if (counterElement) {
            if (userHasUnlimitedAnalysis()) {
                counterElement.innerHTML = `<span class="text-green-700 font-semibold">${counterUnlimited}</span>`;
            } else if (remaining > 0) {
                counterElement.innerHTML = `<span class="text-green-700 font-semibold">${remainingText}</span>`;
            } else {
                counterElement.innerHTML = `<span class="text-red-600 font-semibold">${counterNoLeft}</span>`;
            }
        }
    });
}

function showUpgradePrompt() {
    const language = window.currentLanguage || 'en';
    const upgradePrompt = translations[language] ? translations[language]['upgrade-basic-prompt'] || 'Upgrade to Basic Membership ($4.99/month) for unlimited plant identification and disease analysis.' : 'Upgrade to Basic Membership ($4.99/month) for unlimited plant identification and disease analysis.';
    const upgradeNow = translations[language] ? translations[language]['upgrade-now'] || 'Upgrade Now' : 'Upgrade Now';
    const maybeLater = translations[currentLanguage] ? translations[currentLanguage]['maybe-later'] || 'Maybe Later' : 'Maybe Later';
    const confirmed = confirm(`${upgradePrompt}\n\n${upgradeNow}?`);
    if (confirmed) {
        // Scroll to membership section
        scrollToSection('membership');
    }
    return confirmed;
}

// Smooth scrolling to sections
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'instant',
            block: 'start'
        });
    }
    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('show')) {
        toggleMobileMenu();
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const button = document.getElementById('mobile-menu-button');
    if (mobileMenu) {
        mobileMenu.classList.toggle('show');
        const open = mobileMenu.classList.contains('show');
        if (button) {
            button.setAttribute('aria-expanded', String(open));
            button.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
        }
    }
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 75000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, { ...options, signal: controller.signal });
    } finally {
        clearTimeout(timeout);
    }
}

// Toggle language dropdown
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    const button = document.getElementById('language-menu-button');
    if (dropdown) {
        dropdown.classList.toggle('show');
        const open = dropdown.classList.contains('show');
        if (button) button.setAttribute('aria-expanded', String(open));
        if (open) dropdown.querySelector('[role="menuitem"]')?.focus();
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const languageDropdown = document.querySelector('.language-dropdown');
    const dropdown = document.getElementById('language-dropdown');
    if (languageDropdown && dropdown && !languageDropdown.contains(event.target)) {
        dropdown.classList.remove('show');
        document.getElementById('language-menu-button')?.setAttribute('aria-expanded', 'false');
    }
});

// Fixed expandable content function with proper language support
function expandContent(section) {
    const expandedElement = document.getElementById(section + '-expanded');
    const buttonElement = document.getElementById(section + '-expand-btn');
    if (expandedElement && buttonElement) {
        if (expandedElement.classList.contains('hidden')) {
            expandedElement.classList.remove('hidden');
        } else {
            expandedElement.classList.add('hidden');
        }
        refreshExpandableButtonLabels(window.currentLanguage);
    }
}

// Garden Styles expandable content function
function expandGardenStyle(section) {
    const expandedElement = document.getElementById(section + '-expanded-content');
    const buttonElement = document.getElementById(section + '-expand-btn');
    if (expandedElement && buttonElement) {
        if (expandedElement.classList.contains('hidden')) {
            expandedElement.classList.remove('hidden');
            translateGardenStylesExpandedContent(window.currentLanguage);
        } else {
            expandedElement.classList.add('hidden');
        }
        refreshExpandableButtonLabels(window.currentLanguage);
    }
}

// Function to translate expanded content specifically for Garden Styles
function translateGardenStylesExpandedContent(language) {
    if (!translations[language]) return;
    const elementsToTranslate = [
        // Container gardening expanded content titles
        'container-best-plants-title', 'container-types-title',
        // Container gardening expanded content
        'container-herbs', 'container-vegetables', 'container-flowers', 'container-fruits',
        'container-terracotta', 'container-plastic', 'container-ceramic', 'container-wood',
        // Vertical gardening expanded content titles
        'vertical-systems-title', 'vertical-perfect-plants-title',
        // Vertical gardening expanded content
        'vertical-living-walls', 'vertical-hydroponic-towers', 'vertical-pocket-planters', 'vertical-trellis-systems',
        'vertical-climbing-vines', 'vertical-trailing-plants', 'vertical-compact-vegetables',
        // Hydroponic gardening expanded content titles
        'hydroponic-systems-title', 'hydroponic-equipment-title',
        // Hydroponic gardening expanded content
        'hydroponic-dwc', 'hydroponic-nft', 'hydroponic-ebb-flow', 'hydroponic-aeroponic',
        'hydroponic-containers', 'hydroponic-pumps', 'hydroponic-testing', 'hydroponic-lights',
        // Permaculture expanded content titles
        'permaculture-design-title', 'permaculture-benefits-title',
        // Permaculture expanded content
        'permaculture-food-forests', 'permaculture-water-harvesting', 'permaculture-companion-planting', 'permaculture-pest-management',
        'permaculture-low-maintenance', 'permaculture-soil-health', 'permaculture-resilient', 'permaculture-productive',
        // Shade gardens expanded content titles
        'shade-plants-title', 'shade-design-title',
        // Shade gardens expanded content
        'shade-hostas', 'shade-ferns', 'shade-impatiens', 'shade-astilbe', 'shade-heuchera',
        'shade-light-plants', 'shade-paths-seating', 'shade-layer-height', 'shade-fragrant-plants',
        // Indoor gardening expanded content titles
        'indoor-plants-title', 'indoor-conditions-title',
        // Indoor gardening expanded content
        'indoor-pothos', 'indoor-snake-plant', 'indoor-spider-plant', 'indoor-peace-lily', 'indoor-herbs',
        'indoor-light', 'indoor-temperature', 'indoor-humidity', 'indoor-soil'
    ];
    elementsToTranslate.forEach(id => {
        const element = document.getElementById(id);
        if (element && translations[language][id]) {
            element.textContent = translations[language][id];
        }
    });
    // Also translate any list items in expanded content with a fallback approach
    const expandedSections = ['container-gardening', 'vertical-gardening', 'hydroponic-gardening', 'permaculture', 'shade-gardens', 'indoor-gardening'];
    expandedSections.forEach(section => {
        const expandedContent = document.getElementById(section + '-expanded-content');
        if (expandedContent && !expandedContent.classList.contains('hidden')) {
            // Find all elements with IDs that match our translation keys
            const translatableElements = expandedContent.querySelectorAll('[id]');
            translatableElements.forEach(element => {
                const elementId = element.id;
                if (translations[language][elementId]) {
                    element.textContent = translations[language][elementId];
                }
            });
        }
    });
}

// Self-healing Newsletter subscription override to resolve translation caching issues
function setupNewsletterFormOverride() {
    const oldForm = document.getElementById('newsletter-form');
    if (!oldForm) return;

    // Clone the form to clear any inline submit listeners registered by a cached index.html
    const newForm = oldForm.cloneNode(true);
    oldForm.parentNode.replaceChild(newForm, oldForm);

    newForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailInput = newForm.querySelector('#newsletter-email');
        const submitBtn = newForm.querySelector('#newsletter-submit-btn');
        const messageDiv = document.getElementById('newsletter-message');
        
        if (!emailInput || !messageDiv) return;
        
        const email = emailInput.value.trim();
        if (!email) return;

        messageDiv.textContent = '';
        messageDiv.className = 'mt-4 text-white font-semibold';

        const lang = window.currentLanguage
            || localStorage.getItem('selectedLanguage')
            || localStorage.getItem('preferred-language')
            || (document.cookie.match(/(?:^|;s*)language=([^;]*)/) || [])[1]
            || 'en';

        // Disable button during submit
        const originalBtnHTML = submitBtn ? submitBtn.innerHTML : 'Subscribe Free';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
            const submitBtnTextSpan = submitBtn.querySelector('#newsletter-submit-btn-text');
            const subscribingText = {
                en: 'Subscribing...',
                es: 'Suscribiendo...',
                fr: 'Abonnement...',
                de: 'Abonnieren...',
                el: 'Εγγραφή...',
                ru: 'Подписка...',
                ar: 'جاري الاشتراك...'
            };
            const textToSet = subscribingText[lang] || subscribingText.en;
            if (submitBtnTextSpan) {
                submitBtnTextSpan.textContent = textToSet;
            } else {
                submitBtn.textContent = textToSet;
            }
        }

        // Get selected language and map it to full name for backend welcome email
        const langMap = {
            en: 'English',
            el: 'Greek',
            es: 'Spanish',
            fr: 'French',
            de: 'German',
            ar: 'Arabic',
            ru: 'Russian'
        };
        const longLanguage = langMap[lang] || 'English';

        // Hostname-aware API URL
        const NEWSLETTER_API_URL = window.location.hostname.includes('plantid')
            ? 'https://api.gardenwithserge.com/api/newsletter-signup'
            : '/api/newsletter-signup';

        try {
            const res = await fetch(NEWSLETTER_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, language: longLanguage })
            });

            const data = await res.json().catch(() => ({}));
            const isDuplicate = data?.mode === 'duplicate' || /duplicate|already/i.test(String(data?.error || ''));
            const isSuccess = res.ok && (data?.ok === true || data?.success === true);

            if (isDuplicate) {
                const dupMsgs = {
                    en: 'This email is already subscribed.',
                    es: 'Este correo ya está suscrito.',
                    fr: 'Cet e-mail est déjà abonné.',
                    de: 'Diese E-Mail-Adresse ist bereits abonniert.',
                    el: 'Αυτό το email είναι ήδη εγγεγραμμένο.',
                    ru: 'Этот email уже подписан.',
                    ar: 'هذا البريد الإلكتروني مشترك بالفعل.'
                };
                messageDiv.textContent = dupMsgs[lang] || dupMsgs.en;
                messageDiv.className = 'mt-4 text-yellow-100 font-semibold';
            } else if (isSuccess) {
                const sucMsgs = {
                    en: 'Thank you for subscribing!',
                    es: '¡Gracias por suscribirse!',
                    fr: 'Merci de vous être abonné !',
                    de: 'Vielen Dank für Ihre Anmeldung!',
                    el: 'Σας ευχαριστούμε για την εγγραφή!',
                    ru: 'Спасибо за подписку!',
                    ar: 'شكرًا لاشتراكك!'
                };
                messageDiv.textContent = sucMsgs[lang] || sucMsgs.en;
                messageDiv.className = 'mt-4 text-green-100 font-semibold';
                newForm.reset();
            } else {
                const errMsgs = {
                    en: data?.error || 'Server error. Please try again.',
                    es: data?.error === 'This email is already subscribed.' ? 'Este correo ya está suscrito.' : (data?.error || 'Error del servidor. Por favor, inténtelo de nuevo.'),
                    fr: data?.error === 'This email is already subscribed.' ? 'Cet e-mail est déjà abonné.' : (data?.error || 'Erreur du serveur. Veuillez réessayer.'),
                    de: data?.error === 'This email is already subscribed.' ? 'Diese E-Mail-Adresse ist bereits abonniert.' : (data?.error || 'Serverfehler. Bitte versuchen Sie es erneut.'),
                    el: data?.error === 'This email is already subscribed.' ? 'Αυτό το email είναι ήδη εγγεγραμμένο.' : (data?.error || 'Σφάλμα διακομιστή. Παρακαλώ δοκιμάστε ξανά.'),
                    ru: data?.error === 'This email is already subscribed.' ? 'Этот email уже подписан.' : (data?.error || 'Ошибка сервера. Пожалуйста, попробуйте еще раз.'),
                    ar: data?.error === 'This email is already subscribed.' ? 'هذا البريد الإلكتروني مشترك بالفعل.' : (data?.error || 'خطأ في الخادم. يرجى المحاولة مرة أخرى.')
                };
                messageDiv.textContent = errMsgs[lang] || errMsgs.en;
                messageDiv.className = 'mt-4 text-red-100 font-semibold';
            }
        } catch (err) {
            const netMsgs = {
                en: 'Network error. Please try again later.',
                es: 'Error de red. Por favor, inténtelo más tarde.',
                fr: 'Erreur réseau. Veuillez réessayer plus tard.',
                de: 'Netzwerkfehler. Bitte versuchen Sie es später noch einmal.',
                el: 'Σφάλμα δικτύου. Παρακαλώ δοκιμάστε ξανά αργότερα.',
                ru: 'Ошибка сети. Пожалуйста, попробуйте позже.',
                ar: 'خطأ في الشبكة. يرجى المحاولة لاحقًا.'
            };
            messageDiv.textContent = netMsgs[lang] || netMsgs.en;
            messageDiv.className = 'mt-4 text-red-100 font-semibold';
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
                submitBtn.innerHTML = originalBtnHTML;
            }
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'mt-4 text-white font-semibold';
            }, 6000);
        }
    });
}

// --- Plant Benefits Functionality ---
async function getPlantBenefits(plantName) {
    if (!plantName) return "No plant name provided.";
    try {
        const response = await fetch('get_plant_benefits.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plant: plantName })
        });
        const data = await response.json();
        return data.benefits || "No benefits found.";
    } catch (err) {
        return "Unable to fetch benefits at this time.";
    }
}

// AI Plant Doctor functionality - Enhanced with two-step process

async function optimizePlantPhoto(file) {
    const bitmap = await createImageBitmap(file);
    try {
        const maxDimension = 1600;
        const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
        if (scale === 1 && file.size <= 2 * 1024 * 1024) return file;

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(bitmap.width * scale));
        canvas.height = Math.max(1, Math.round(bitmap.height * scale));
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) throw new Error('Photo processing is unavailable in this browser.');
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise((resolve, reject) => {
            canvas.toBlob(
                (result) => result ? resolve(result) : reject(new Error('Photo compression failed.')),
                'image/jpeg',
                0.85
            );
        });
        const baseName = file.name.replace(/\.[^.]+$/, '') || 'plant-photo';
        return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
    } finally {
        bitmap.close();
    }
}

async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    const supportedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
    if (!supportedTypes.has(file.type.toLowerCase())) {
        event.target.value = '';
        selectedFile = null;
        alert('Please use a JPEG, PNG, or WebP photo. HEIC and other formats are not supported yet.');
        return;
    }
    if (file.size > 25 * 1024 * 1024) {
        event.target.value = '';
        selectedFile = null;
        alert('Please use a photo smaller than 25 MB.');
        return;
    }
    try {
        selectedFile = await optimizePlantPhoto(file);
        displayImagePreview(selectedFile);
    } catch (error) {
        event.target.value = '';
        selectedFile = null;
        alert(error && error.message ? error.message : 'The photo could not be prepared for analysis.');
    }
}

function displayImagePreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewImage = document.getElementById('preview-image');
        const imagePreview = document.getElementById('image-preview');
        const uploadInterface = document.getElementById('upload-interface');
        if (previewImage && imagePreview) {
            previewImage.src = e.target.result;
            imagePreview.classList.remove('hidden');
            // Hide the upload interface
            const uploadSection = uploadInterface.querySelector('.border-2');
            if (uploadSection) {
                uploadSection.style.display = 'none';
            }
        }
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    selectedFile = null;
    currentStep = 'upload';
    const imagePreview = document.getElementById('image-preview');
    const uploadInterface = document.getElementById('upload-interface');
    const identificationStep = document.getElementById('identification-step');
    const analysisResults = document.getElementById('analysis-results');
    if (imagePreview) {
        imagePreview.classList.add('hidden');
    }
    if (identificationStep) {
        identificationStep.classList.add('hidden');
    }
    if (analysisResults) {
        analysisResults.classList.add('hidden');
    }
    // Show the upload interface again
    const uploadSection = uploadInterface.querySelector('.border-2');
    if (uploadSection) {
        uploadSection.style.display = 'block';
    }
    // Reset file input
    const fileInput = document.getElementById('plant-photo-input');
    if (fileInput) {
        fileInput.value = '';
    }
    // Also reset manual input
    const manualInputDiv = document.getElementById('manual-plant-input');
    if (manualInputDiv) {
        manualInputDiv.classList.add('hidden');
    }
    const manualNameInput = document.getElementById('manual-plant-name');
    if (manualNameInput) {
        manualNameInput.value = '';
    }
}

async function analyzeImage() {
    if (!selectedFile) {
        alert(typeof t === 'function' ? t('pd-alert-image') : 'Please select an image first.');
        return;
    }
    // Check if user has remaining analyses
    if (!userHasUnlimitedAnalysis() && dailyAnalysisCount >= 3) {
        if (!showUpgradePrompt()) {
            return;
        }
    }

    const analyzeBtn = document.getElementById('analyze-btn');
    const originalText = analyzeBtn.textContent;
    // Show loading state
    analyzeBtn.textContent = 'Analyzing...';
    analyzeBtn.disabled = true;
    try {
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('language', window.currentLanguage || 'en');
        // Use absolute path for production server
        const response = await fetchWithTimeout('https://api.gardenwithserge.com/api/plant-identify', {
            method: 'POST',
            body: formData
        });
        if (response.status === 429) {
            const payload = await response.json().catch(() => ({}));
            dailyAnalysisCount = 3;
            updateAnalysisCounter();
            throw new Error(payload.error || 'Daily free plant-identification limit reached.');
        }
        if (!response.ok) {
            const payload = await response.json().catch(() => ({}));
            throw new Error(payload.error || `Plant identification request failed (${response.status}).`);
        }
        const data = await response.json();
        if (!userHasUnlimitedAnalysis() && Number.isFinite(Number(data.usedToday))) {
            dailyAnalysisCount = Number(data.usedToday);
            localStorage.setItem('plantAnalysisDaily', JSON.stringify({
                date: new Date().toDateString(),
                count: dailyAnalysisCount
            }));
            updateAnalysisCounter();
        }

        if (typeof data.plantName === "undefined") {
            alert(typeof t === 'function' ? t('pd-alert-failed-identify') : 'Sorry, something went wrong.');
            identifiedPlantName = "Unknown plant";
        } else if (!data.plantName || data.plantName === "Unknown plant") {
            alert(typeof t === 'function' ? t('pd-alert-failed-identify') : 'Sorry, the plant could not be identified.');
            identifiedPlantName = "Unknown plant";
        } else {
            identifiedPlantName = data.plantName;
            let details = '';
            if (data.scientificName) details += ` (${data.scientificName})`;
            if (Number.isFinite(Number(data.confidence))) details += `, Confidence: ${Math.round(Number(data.confidence))}%`;
            if (details) identifiedPlantName += details;
        }

        // --- Plant Benefits call for Green Thumb members ---
        const benefitsSection = document.getElementById('plant-benefits-section');
        const benefitsContent = document.getElementById('plant-benefits-content');
        if (window.membershipType === 'green_thumb' && benefitsSection && benefitsContent) {
            benefitsSection.style.display = 'block';
            benefitsContent.innerText = "Loading...";
            getPlantBenefits(identifiedPlantName).then(benefits => {
                if (benefitsContent.isConnected) benefitsContent.innerText = benefits;
            });
        } else if (benefitsSection) {
            benefitsSection.style.display = 'none';
        }

        showIdentificationStep();
    } catch (err) {
        const message = err && err.name === 'AbortError'
            ? 'Plant identification timed out. Please try a smaller photo or try again shortly.'
            : (err && err.message ? err.message : (typeof t === 'function' ? t('pd-alert-failed-identify') : 'Failed to identify plant.'));
        alert(message);
        identifiedPlantName = 'Unknown plant';
        showIdentificationStep();
    } finally {
        analyzeBtn.textContent = originalText;
        analyzeBtn.disabled = false;
        currentStep = 'identification';
    }
}

function translatePlantNameIfUnknown(name) {
    if (!name) return '';
    let lowerName = name.toLowerCase().trim();
    const translatedUnknown = typeof t === 'function' ? t('unknown-plant') : 'Unknown plant';
    
    if (lowerName === "unknown plant" || lowerName === "unknown") {
        return translatedUnknown;
    } else if (lowerName.startsWith("unknown plant")) {
        const suffix = name.substring("unknown plant".length);
        return translatedUnknown + suffix;
    } else if (lowerName.startsWith("unknown")) {
        const suffix = name.substring("unknown".length);
        return translatedUnknown + suffix;
    }
    return name;
}

function showIdentificationStep() {
    const imagePreview = document.getElementById('image-preview');
    const identificationStep = document.getElementById('identification-step');
    if (imagePreview) {
        imagePreview.classList.add('hidden');
    }
    if (identificationStep) {
        identificationStep.classList.remove('hidden');
        const identifiedPlantElement = document.getElementById('identified-plant-name');
        if (identifiedPlantElement) {
            identifiedPlantElement.textContent = translatePlantNameIfUnknown(identifiedPlantName);
        }
    }
    // Add Start Over button if not present
    let startOverBtn = document.getElementById('start-over-identify');
    if (!startOverBtn && identificationStep) {
        startOverBtn = document.createElement('button');
        startOverBtn.id = 'start-over-identify';
        startOverBtn.className = 'bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors mt-4';
        startOverBtn.textContent = typeof t === 'function' ? t('start-over-identify') : 'Start Over';
        startOverBtn.onclick = resetAnalysis;
        const centerDiv = identificationStep.querySelector('.text-center');
        if (centerDiv) {
            centerDiv.appendChild(startOverBtn);
        }
    }
}

function confirmPlantIdentification(isCorrect) {
    if (isCorrect) {
        // Proceed to disease analysis
        proceedToDiseaseAnalysis();
    } else {
        // Show manual input form
        const manualInputDiv = document.getElementById('manual-plant-input');
        if (manualInputDiv) {
            manualInputDiv.classList.remove('hidden');
        }
        // Force immediate placeholder and button translation
        const manualPlantNameInput = document.getElementById('manual-plant-name');
        const lang = window.currentLanguage || 'en';
        if (manualPlantNameInput && typeof translations !== 'undefined' && translations[lang] && translations[lang]['manual-plant-name-placeholder']) {
            manualPlantNameInput.placeholder = translations[lang]['manual-plant-name-placeholder'];
        }
        const updateBtn = document.getElementById('update-plant-btn');
        if (updateBtn && typeof translations !== 'undefined' && translations[lang] && translations[lang]['update-plant-btn']) {
            updateBtn.textContent = translations[lang]['update-plant-btn'];
        }
    }
}

function updatePlantName() {
    const manualNameInput = document.getElementById('manual-plant-name');
    if (manualNameInput && manualNameInput.value.trim()) {
        identifiedPlantName = manualNameInput.value.trim();
        proceedToDiseaseAnalysis();
    } else {
        alert(typeof t === 'function' ? t('provide-plant-name') : 'Please enter a plant name.');
    }
}

function proceedToDiseaseAnalysis() {
    const identificationStep = document.getElementById('identification-step');
    const analyzeBtn = document.getElementById('continue-analysis-btn');
    const originalText = analyzeBtn ? analyzeBtn.textContent : 'Continue to Disease Analysis';
    if (!userHasUnlimitedAnalysis()) {
        showAnalysisError('Plant disease diagnosis requires an active paid membership.');
        return;
    }
    if (analyzeBtn) {
        analyzeBtn.textContent = 'Analyzing...';
        analyzeBtn.disabled = true;
    }
    // Call backend for disease analysis
    (async () => {
        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('plantName', identifiedPlantName);
            formData.append('language', window.currentLanguage || 'en');
            const response = await fetchWithTimeout('https://api.gardenwithserge.com/api/plant-analyze', {
                method: 'POST',
                body: formData
            });
            if (response.status === 403) {
                const payload = await response.json().catch(() => ({}));
                showAnalysisError(payload.error || 'Plant disease diagnosis requires an active paid membership.');
                return;
            }
            if (response.status === 429) {
                const payload = await response.json().catch(() => ({}));
                const msg = payload.error || 'Daily free analysis limit reached. Upgrade to continue.';
                alert(msg);
                showUpgradePrompt();
                return;
            }
            if (!response.ok) {
                throw new Error('Disease analysis failed.');
            }
            const data = await response.json();
            if (!data || typeof data.healthStatus !== 'string' || !Array.isArray(data.careRecommendations)) {
                throw new Error('Disease analysis returned an invalid response.');
            }
            if (!userHasUnlimitedAnalysis() && Number.isFinite(Number(data.usedToday))) {
                dailyAnalysisCount = Number(data.usedToday);
                localStorage.setItem('plantAnalysisDaily', JSON.stringify({
                    date: new Date().toDateString(),
                    count: dailyAnalysisCount
                }));
                updateAnalysisCounter();
            }
            activeAnalysisData = data;
            showAnalysisResults(data);
        } catch (err) {
            showAnalysisError(typeof t === 'function'
                ? t('pd-alert-failed-analyze')
                : 'The analysis did not complete. No diagnosis or treatment recommendation was produced. Please try again.');
        } finally {
            if (analyzeBtn) {
                analyzeBtn.textContent = originalText;
                analyzeBtn.disabled = false;
            }
        }
    })();
}

function showAnalysisError(message) {
    const identificationStep = document.getElementById('identification-step');
    const analysisResults = document.getElementById('analysis-results');
    const failureMessage = document.getElementById('diagnosis-access-message')
        || document.getElementById('analysis-failure-message');
    if (analysisResults) analysisResults.classList.add('hidden');
    if (identificationStep) identificationStep.classList.remove('hidden');
    if (failureMessage) {
        failureMessage.textContent = message;
        failureMessage.className = 'mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-left font-semibold text-amber-900';
        failureMessage.setAttribute('role', 'alert');
    }
    activeAnalysisData = null;
    currentStep = 'identification';
}

function showAnalysisResults(analysisData) {
    if (!analysisData || typeof analysisData.healthStatus !== 'string' || !Array.isArray(analysisData.careRecommendations)) {
        showAnalysisError('The analysis did not return a valid result. No diagnosis was produced. Please try again.');
        return;
    }
    const identificationStep = document.getElementById('identification-step');
    const analysisResults = document.getElementById('analysis-results');
    if (identificationStep) {
        identificationStep.classList.add('hidden');
    }
    if (analysisResults) {
        analysisResults.classList.remove('hidden');
        // Update the analysis results with the identified plant name
        const analysisPlantNameElement = document.getElementById('analysis-plant-name');
        const healthElement = document.getElementById('analysis-health-status');
        const rec1Element = document.getElementById('analysis-rec-1');
        const rec2Element = document.getElementById('analysis-rec-2');
        const rec3Element = document.getElementById('analysis-rec-3');
        const confidenceElement = document.getElementById('analysis-confidence');
        {
            // Use backend data
            let plantNameToShow = translatePlantNameIfUnknown(analysisData.plantName || identifiedPlantName);
            if (analysisPlantNameElement) analysisPlantNameElement.textContent = plantNameToShow;
            if (healthElement) healthElement.textContent = analysisData.healthStatus || '';
            if (Array.isArray(analysisData.careRecommendations)) {
                if (rec1Element) rec1Element.textContent = analysisData.careRecommendations[0] || '';
                if (rec2Element) rec2Element.textContent = analysisData.careRecommendations[1] || '';
                if (rec3Element) rec3Element.textContent = analysisData.careRecommendations[2] || '';
            }
            if (confidenceElement) confidenceElement.textContent = 'AI-generated guidance can be incomplete or incorrect. Verify important treatment decisions with a qualified local professional.';

            const expandedDiagnosisId = 'analysis-expanded-diagnosis';
            const riskFactorsId = 'analysis-risk-factors';
            let expandedDiagnosisEl = document.getElementById(expandedDiagnosisId);
            let riskFactorsEl = document.getElementById(riskFactorsId);
            let premiumWrap = document.getElementById('analysis-premium-green-thumb');

            if (!premiumWrap) {
                premiumWrap = document.createElement('div');
                premiumWrap.id = 'analysis-premium-green-thumb';
                premiumWrap.className = 'mt-4 bg-green-50 border border-green-200 rounded-lg p-4';
                premiumWrap.innerHTML = `
                    <h4 class="font-semibold text-green-900 mb-2">Expanded Health Diagnosis</h4>
                    <p id="${expandedDiagnosisId}" class="text-green-800 mb-3"></p>
                    <h5 class="font-semibold text-green-900 mb-2">Risk Factors</h5>
                    <ul id="${riskFactorsId}" class="text-green-800 space-y-1"></ul>
                `;
                const analysisCard = analysisResults.querySelector('.bg-white');
                if (analysisCard) analysisCard.appendChild(premiumWrap);
                expandedDiagnosisEl = document.getElementById(expandedDiagnosisId);
                riskFactorsEl = document.getElementById(riskFactorsId);
            }

            const hasExpanded = !!(analysisData.expandedHealthDiagnosis || (Array.isArray(analysisData.riskFactors) && analysisData.riskFactors.length));
            if (premiumWrap) premiumWrap.style.display = hasExpanded ? 'block' : 'none';
            if (expandedDiagnosisEl) expandedDiagnosisEl.textContent = analysisData.expandedHealthDiagnosis || '';
            if (riskFactorsEl) {
                riskFactorsEl.innerHTML = '';
                if (Array.isArray(analysisData.riskFactors)) {
                    analysisData.riskFactors.filter(Boolean).forEach((factor) => {
                        const li = document.createElement('li');
                        li.textContent = `• ${factor}`;
                        riskFactorsEl.appendChild(li);
                    });
                }
            }
        }
        // Add Start Over button if not present
        let startOverBtn = document.getElementById('start-over-results');
        if (!startOverBtn && analysisResults) {
            startOverBtn = document.createElement('button');
            startOverBtn.id = 'start-over-results';
            startOverBtn.className = 'bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors mt-4';
            startOverBtn.textContent = typeof t === 'function' ? t('start-over-identify') : 'Start Over';
            startOverBtn.onclick = resetAnalysis;
            const centerDiv = analysisResults.querySelector('.text-center');
            if (centerDiv) {
                centerDiv.appendChild(startOverBtn);
            }
        }
          // --- Plant Benefits display ---
        const benefitsSection = document.getElementById('analysis-benefits-section');
        const benefitsContent = document.getElementById('analysis-benefits');
        if (benefitsSection && benefitsContent) {
            if (analysisData && analysisData.benefits && analysisData.benefits.trim() !== "") {
                benefitsSection.style.display = 'block';
                benefitsContent.textContent = analysisData.benefits;
            } else {
                benefitsSection.style.display = 'none';
                benefitsContent.textContent = '';
            }
        }
    } // <--- This closes if (analysisResults) { ... }
}     // <--- This closes function showAnalysisResults  


function resetAnalysis() {
    removeImage();
    currentStep = 'upload';
    
    // Reset lead magnet form state on reset
    const lmForm = document.getElementById('lm-form');
    const successMsg = document.getElementById('lm-success-msg');
    const emailInput = document.getElementById('lm-email');
    const submitBtn = document.getElementById('lm-btn-submit');
    if (lmForm) lmForm.style.display = 'flex';
    if (successMsg) {
        successMsg.style.display = 'none';
        successMsg.classList.add('hidden');
    }
    if (emailInput) emailInput.value = '';
    if (submitBtn) submitBtn.disabled = false;
}

// ======= CAMERA FUNCTIONALITY - REAL CAMERA ACCESS =======
function startCamera() {
    const uploadInterface = document.getElementById('upload-interface');
    const imagePreview = document.getElementById('image-preview');
    if (uploadInterface) uploadInterface.style.display = 'none';
    if (imagePreview) imagePreview.classList.add('hidden');
    let cameraModal = document.getElementById('camera-modal');
    if (!cameraModal) {
        cameraModal = document.createElement('div');
        cameraModal.id = 'camera-modal';
        cameraModal.style.position = 'fixed';
        cameraModal.style.top = '0';
        cameraModal.style.left = '0';
        cameraModal.style.width = '100vw';
        cameraModal.style.height = '100vh';
        cameraModal.style.background = 'rgba(0,0,0,0.7)';
        cameraModal.style.display = 'flex';
        cameraModal.style.alignItems = 'center';
        cameraModal.style.justifyContent = 'center';
        cameraModal.style.zIndex = '99999';
        cameraModal.innerHTML = `
            <div style="background:white;padding:24px;border-radius:12px;max-width:95vw;">
                <select id="camera-select" style="margin-bottom:10px;display:none;"></select>
                <video id="camera-video" autoplay playsinline style="width:360px;max-width:90vw;border-radius:8px;"></video>
                <br/>
                <button id="capture-btn" style="margin:12px;padding:12px 24px;background:#16a34a;color:white;border:none;border-radius:8px;cursor:pointer;">Capture</button>
                <button id="close-camera-btn" style="margin:12px;padding:12px 24px;background:#ef4444;color:white;border:none;border-radius:8px;cursor:pointer;">Cancel</button>
            </div>
        `;
        document.body.appendChild(cameraModal);
    } else {
        cameraModal.style.display = 'flex';
    }
    const video = document.getElementById('camera-video');
    const captureBtn = document.getElementById('capture-btn');
    const closeBtn = document.getElementById('close-camera-btn');
    const cameraSelect = document.getElementById('camera-select');
    let stream;
    function stopStream() {
        if (stream) stream.getTracks().forEach(track => track.stop());
    }
    function startStream(constraints) {
        stopStream();
        return navigator.mediaDevices.getUserMedia(constraints)
            .then(function(s) {
                stream = s;
                video.srcObject = stream;
            });
    }
    // Try to get rear camera first, fallback to any
    startStream({ video: { facingMode: { exact: "environment" } } })
        .catch(() => startStream({ video: { facingMode: "environment" } }))
        .catch(() => startStream({ video: true }))
        .then(() => navigator.mediaDevices.enumerateDevices())
        .then(function(devices) {
            const videoDevices = devices.filter(device => device.kind === "videoinput");
            if (videoDevices.length > 1) {
                cameraSelect.innerHTML = "";
                videoDevices.forEach((device, idx) => {
                    const option = document.createElement("option");
                    option.value = device.deviceId;
                    option.text = device.label || `Camera ${idx + 1}`;
                    cameraSelect.appendChild(option);
                });
                cameraSelect.style.display = "block";
                cameraSelect.onchange = function() {
                    startStream({ video: { deviceId: { exact: cameraSelect.value } } });
                };
                // Try to auto-select the 'back' camera if available
                const backCam = Array.from(cameraSelect.options).find(opt =>
                    /back|environment|rear/i.test(opt.text)
                );
                if (backCam) {
                    cameraSelect.value = backCam.value;
                    cameraSelect.onchange();
                }
            } else {
                cameraSelect.style.display = "none";
            }
        }).catch(function(err) {
            alert('Unable to access camera: ' + err.message);
            cameraModal.style.display = 'none';
            if (uploadInterface) uploadInterface.style.display = 'block';
        });
    captureBtn.onclick = function() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(function(blob) {
            selectedFile = new File([blob], "captured-image.png", { type: "image/png" });
            displayImagePreview(selectedFile);
        }, 'image/png');
        stopStream();
        cameraModal.style.display = 'none';
        if (uploadInterface) uploadInterface.style.display = 'block';
    };
    closeBtn.onclick = function() {
        stopStream();
        cameraModal.style.display = 'none';
        if (uploadInterface) uploadInterface.style.display = 'block';
    };
}

// Initialize page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    // Add smooth scrolling to the document
    document.documentElement.style.scrollBehavior = 'smooth';
    // Initialize analysis counter
    updateAnalysisCounter();
    // Initialize drag and drop for plant doctor
    const dropZone = document.querySelector('.border-dashed');
    if (dropZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });
        dropZone.addEventListener('drop', handleDrop, false);
    }
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    function highlight(e) {
        dropZone.classList.add('border-green-500', 'bg-green-50');
    }
    function unhighlight(e) {
        dropZone.classList.remove('border-green-500', 'bg-green-50');
    }
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                selectedFile = file;
                displayImagePreview(file);
            }
        }
    }
});

// ========================================
// MODERN PAYMENT SYSTEM INTEGRATION
// ========================================

// Stripe initialization
let stripe;
if (typeof Stripe !== 'undefined') {
    stripe = Stripe('pk_live_51QZissFJK8JMTXAGJXHqgM1jrMQubVXAScCSGxYckMzvYQhoGkB1J56CHwR1fabPnnrBu8Asfaf2wVoT3EaK9jyY002HHOHiCI');
}

// Payment configuration
const paymentConfig = {
    'basic': {
        'monthly': {
            stripePrice: 'price_1QZjhGFJK8JMTXAGlnc3JnKI',
            stripeBuyLink: 'https://buy.stripe.com/4gM5kDdj3ahB8rr44B7Re00',
            paypalPlan: 'P-59008482787162719NBUDZZA',
            amount: 4.99
        },
        'yearly': {
            stripePrice: 'price_1QZjhGFJK8JMTXAGfgE2HXCZ',
            stripeBuyLink: 'https://buy.stripe.com/6oU3cvgvf0H1233asZ7Re03',
            paypalPlan: 'P-09S96113AN811444HNBUEAEI',
            amount: 47.90
        }
    },
    'green-thumb': {
        'monthly': {
            stripePrice: 'price_1QZjhGFJK8JMTXAGmnC4KLPQ',
            stripeBuyLink: 'https://buy.stripe.com/00wbJ1baVahBcHH0Sp7Re01',
            paypalPlan: 'P-0H932671XA612824SNA37QNA',
            amount: 9.99
        },
        'yearly': {
            stripePrice: 'price_1QZjhGFJK8JMTXAGnbH5TYUW',
            stripeBuyLink: 'https://buy.stripe.com/3cI7sL6UFexRbDDfNj7Re02',
            paypalPlan: 'P-7HG26175MM096980GNBUEH7Q',
            amount: 95.90
        }
    }
};

// Handle Stripe payment
async function handleStripePayment(membershipType, billingCycle, event) {
    const button = event.target.closest('.stripe-half');
    const loadingSpinner = button.querySelector('.payment-loading');
    
    // Prevent multiple clicks
    if (button.disabled) return;
    
    // Show loading
    button.disabled = true;
    if (loadingSpinner) loadingSpinner.style.display = 'block';
    
    try {
        const config = paymentConfig[membershipType][billingCycle];
        
        // Use direct buy link since we have buy.stripe.com URLs instead of price IDs
        if (config.stripeBuyLink) {
            // Redirect to Stripe buy link
            window.location.href = config.stripeBuyLink;
            return;
        }
        
        // Fallback: Traditional checkout (if price IDs are provided in the future)
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{
                price: config.stripePrice,
                quantity: 1,
            }],
            mode: 'subscription',
            successUrl: `${window.location.origin}/payment-success.html?session_id={CHECKOUT_SESSION_ID}&type=${membershipType}&cycle=${billingCycle}`,
            cancelUrl: `${window.location.origin}/payment-cancel.html`,
            customerEmail: null,
            metadata: {
                membershipType: membershipType,
                billingCycle: billingCycle,
                language: window.currentLanguage || 'en'
            },
            allowPromotionCodes: true,
            billingAddressCollection: 'auto',
            automaticTax: { enabled: true }
        });

        if (error) {
            throw new Error(error.message);
        }

    } catch (error) {
        // Show user-friendly error message
        const errorMessages = {
            en: 'Payment processing failed. Please try again or contact support.',
            es: 'El procesamiento del pago falló. Inténtalo de nuevo o contacta con soporte.',
            fr: 'Le traitement du paiement a échoué. Veuillez réessayer ou contacter le support.',
            de: 'Zahlungsverarbeitung fehlgeschlagen. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.',
            el: 'Η επεξεργασία πληρωμής απέτυχε. Παρακαλώ δοκιμάστε ξανά ή επικοινωνήστε με την υποστήριξη.',
            ru: 'Обработка платежа не удалась. Пожалуйста, попробуйте снова или обратитесь в службу поддержки.',
            ar: 'فشل في معالجة الدفع. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.'
        };
        
        alert(errorMessages[window.currentLanguage] || errorMessages.en);
        
        // Hide loading
        button.disabled = false;
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

// Handle PayPal payment
async function handlePayPalPayment(membershipType, billingCycle, event) {
    const button = event.target.closest('.paypal-half');
    const loadingSpinner = button.querySelector('.payment-loading');
    
    // Prevent multiple clicks
    if (button.disabled) return;
    
    // Show loading
    button.disabled = true;
    if (loadingSpinner) loadingSpinner.style.display = 'block';
    
    try {
        throw new Error('PayPal checkout is unavailable until server-side verification is implemented.');

    } catch (error) {
        // Show user-friendly error message
        const errorMessages = {
            en: 'PayPal payment failed. Please try again or contact support.',
            es: 'El pago de PayPal falló. Inténtalo de nuevo o contacta con soporte.',
            fr: 'Le paiement PayPal a échoué. Veuillez réessayer ou contacter le support.',
            de: 'PayPal-Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.',
            el: 'Η πληρωμή PayPal απέτυχε. Παρακαλώ δοκιμάστε ξανά ή επικοινωνήστε με την υποστήριξη.',
            ru: 'Платеж PayPal не удался. Пожалуйста, попробуйте снова или обратитесь в службу поддержки.',
            ar: 'فشل دفع PayPal. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.'
        };
        
        alert(errorMessages[window.currentLanguage] || errorMessages.en);
        
        // Hide loading
        button.disabled = false;
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

// --- Language Switching Implementation ---

// Track current language globally, use localStorage if set
window.currentLanguage = localStorage.getItem('selectedLanguage') || localStorage.getItem('preferred-language') || 'en';

function refreshExpandableButtonLabels(lang) {
    const language = translations[lang] ? lang : 'en';
    const moreText = translations[language]['click-more-content'] || 'Click for more content';
    const hideText = translations[language]['click-hide-content'] || 'Click to hide content';
    const buttons = document.querySelectorAll('[id$="-expand-btn"]');

    buttons.forEach((button) => {
        const section = button.id.replace(/-expand-btn$/, '');
        const expandedElement = document.getElementById(section + '-expanded')
            || document.getElementById(section + '-expanded-content');
        const label = expandedElement && !expandedElement.classList.contains('hidden') ? hideText : moreText;
        button.textContent = label;
    });
}

function updateTranslations(lang) {
    if (!lang) lang = window.currentLanguage;
    // Fallback to English if language not found
    if (!translations[lang]) lang = 'en';
    window.currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    localStorage.setItem('preferred-language', lang);

    // Update all elements that match translation keys, including repeated ids in legacy markup.
    for (const key in translations[lang]) {
        const elements = document.querySelectorAll(`[id="${key}"]`);
        elements.forEach((el) => {
            el.textContent = translations[lang][key];
        });
    }

    // Set lead magnet email input placeholder when language changes
    const lmEmail = document.getElementById('lm-email');
    if (lmEmail && translations[lang]['newsletter-email-placeholder']) {
        lmEmail.placeholder = translations[lang]['newsletter-email-placeholder'];
    }

    // Set manual plant name input placeholder when language changes
    const manualPlantNameInput = document.getElementById('manual-plant-name');
    if (manualPlantNameInput && translations[lang]['manual-plant-name-placeholder']) {
        manualPlantNameInput.placeholder = translations[lang]['manual-plant-name-placeholder'];
    }

    refreshExpandableButtonLabels(lang);
}

// Language switching handler
function changeLanguage(lang, flag, label) {
    window.currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);

    updateTranslations(lang);

    // Update flag and language label in menu if present
    const flagEl = document.getElementById('current-flag');
    if (flagEl) flagEl.textContent = flag;
    const langEl = document.getElementById('current-language');
    if (langEl) langEl.textContent = label;

    // Hide the language dropdown after selection
    const langDropdown = document.getElementById('language-dropdown');
    if (langDropdown) langDropdown.classList.remove('show');
}

function installCspSafeInteractions() {
    document.querySelectorAll('[onclick]').forEach((element) => {
        const handler = element.getAttribute('onclick') || '';
        let listener = null;
        let match;

        if ((match = handler.match(/^scrollToSection\('([^']+)'\)$/))) {
            listener = () => scrollToSection(match[1]);
        } else if (handler === 'toggleLanguageDropdown()') {
            listener = () => toggleLanguageDropdown();
        } else if (handler === 'toggleMobileMenu()') {
            listener = () => toggleMobileMenu();
        } else if ((match = handler.match(/^changeLanguage\('([^']+)', '([^']+)', '([^']+)'\)$/))) {
            listener = () => changeLanguage(match[1], match[2], match[3]);
        } else if ((match = handler.match(/^expandGardenStyle\('([^']+)'\)$/))) {
            listener = () => expandGardenStyle(match[1]);
        } else if ((match = handler.match(/^expandContent\('([^']+)'\)$/))) {
            listener = () => expandContent(match[1]);
        } else if ((match = handler.match(/^handlePayPalPayment\('([^']+)', '([^']+)', event\)$/))) {
            listener = (event) => handlePayPalPayment(match[1], match[2], event);
        } else if ((match = handler.match(/^handleStripePayment\('([^']+)', '([^']+)', event\)$/))) {
            listener = (event) => handleStripePayment(match[1], match[2], event);
        } else if (handler.includes("window.location.href='/learning-center.php?lang='")) {
            listener = () => { window.location.href = `/learning-center.php?lang=${window.currentLanguage || 'en'}`; };
        } else if (handler === "window.location.href='login.php'") {
            listener = () => { window.location.href = 'login.php'; };
        } else if (handler === 'startCamera()') {
            listener = () => startCamera();
        } else if (handler === 'analyzeImage()') {
            listener = () => analyzeImage();
        } else if (handler === 'removeImage()') {
            listener = () => removeImage();
        } else if (handler === 'confirmPlantIdentification(true)') {
            listener = () => confirmPlantIdentification(true);
        } else if (handler === 'confirmPlantIdentification(false)') {
            listener = () => confirmPlantIdentification(false);
        } else if (handler === 'updatePlantName()') {
            listener = () => updatePlantName();
        } else if (handler === 'proceedToDiseaseAnalysis()') {
            listener = () => proceedToDiseaseAnalysis();
        } else if (handler === 'resetAnalysis()') {
            listener = () => resetAnalysis();
        }

        if (listener) {
            element.removeAttribute('onclick');
            element.addEventListener('click', listener);
        }
    });

    const photoInput = document.getElementById('plant-photo-input');
    if (photoInput) {
        photoInput.removeAttribute('onchange');
        photoInput.addEventListener('change', handleFileSelect);
    }

    const leadMagnetForm = document.getElementById('lm-form');
    if (leadMagnetForm) {
        leadMagnetForm.removeAttribute('onsubmit');
        leadMagnetForm.addEventListener('submit', handleLeadMagnetSubmit);
    }
}

// On page load, initialize to last selected language
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    let savedLang = urlLang || localStorage.getItem('selectedLanguage') || localStorage.getItem('preferred-language') || 'en';
    window.currentLanguage = savedLang;
    installCspSafeInteractions();
    setupNewsletterFormOverride();
    updateTranslations(savedLang);
    loadMembershipStatus();

    // Initialize lead magnet placeholder on page load
    const lmEmail = document.getElementById('lm-email');
    if (lmEmail && typeof translations !== 'undefined' && translations[savedLang] && translations[savedLang]['newsletter-email-placeholder']) {
        lmEmail.placeholder = translations[savedLang]['newsletter-email-placeholder'];
    }
});

// Make payment and language functions globally available
window.handleStripePayment = handleStripePayment;
window.handlePayPalPayment = handlePayPalPayment;
window.changeLanguage = changeLanguage;
window.toggleLanguageDropdown = toggleLanguageDropdown;
window.updateTranslations = updateTranslations;

function getTranslationLocal(key, fallback) {
    const lang = window.currentLanguage || 'en';
    if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
        return translations[lang][key];
    }
    return fallback;
}

// Lead Magnet Form AJAX Submission Handler
async function handleLeadMagnetSubmit(event) {
  event.preventDefault();
  const emailInput = document.getElementById('lm-email');
  const submitBtn = document.getElementById('lm-btn-submit');
  const successMsg = document.getElementById('lm-success-msg');
  const lmForm = document.getElementById('lm-form');

  if (!emailInput || !emailInput.value) return;

  const email = emailInput.value.trim();
  const lang = window.currentLanguage || 'en';
  
  const langMapping = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'el': 'Greek',
    'ru': 'Russian',
    'ar': 'Arabic'
  };
  const fullLanguageName = langMapping[lang] || 'English';

  const plantNameEl = document.getElementById('analysis-plant-name');
  const healthStatusEl = document.getElementById('analysis-health-status');
  
  const plantName = plantNameEl ? plantNameEl.textContent.split(' (')[0].trim() : '';
  const diseaseAnalysis = healthStatusEl ? healthStatusEl.textContent.trim() : '';
  const careRecommendations = [];
  for (let i = 1; i <= 3; i++) {
    const recEl = document.getElementById(`analysis-rec-${i}`);
    if (recEl && recEl.textContent.trim()) {
      careRecommendations.push(recEl.textContent.trim());
    }
  }

  if (submitBtn) submitBtn.disabled = true;

  try {
    const response = await fetch('/api/newsletter-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        language: fullLanguageName,
        plantName: plantName,
        diseaseAnalysis: diseaseAnalysis,
        careRecommendations: careRecommendations,
        sevenDayChecklist: activeAnalysisData && activeAnalysisData.sevenDayChecklist ? activeAnalysisData.sevenDayChecklist : null
      })
    });

    if (response.ok) {
      if (lmForm) lmForm.style.display = 'none';
      
      let successText = getTranslationLocal('lm-success', "🎉 Sent! Your custom recovery plan for {plant} is on its way to your inbox! Check your spam folder if it doesn't arrive in a few minutes.");
      
      successText = successText.replace('{plant}', plantName || 'your plant');
      
      if (successMsg) {
        successMsg.innerText = successText;
        successMsg.classList.remove('hidden');
        successMsg.style.display = 'block';
      }
    } else {
      let errorText = getTranslationLocal('newsletter-error', 'An error occurred. Please try again.');
      try {
        const errData = await response.json();
        if (errData && errData.error) {
          errorText = errData.error;
        }
      } catch (_) {}
      alert(errorText);
      if (submitBtn) submitBtn.disabled = false;
    }
  } catch (error) {
    alert(getTranslationLocal('newsletter-error', 'An error occurred. Please try again.'));
    if (submitBtn) submitBtn.disabled = false;
  }
}
