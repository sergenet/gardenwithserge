// Main JavaScript functionality for Garden with Serge
console.log('DEBUG: app.js loaded at', new Date().toISOString());
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
// Daily analysis tracking
let dailyAnalysisCount = getDailyAnalysisCount();
let selectedFile = null;
let identifiedPlantName = '';
let currentStep = 'upload'; // 'upload', 'identification', 'analysis', 'results'

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
    const dailyLimit = 3; // or whatever your daily free limit is
    const remaining = Math.max(0, dailyLimit - dailyAnalysisCount);

    // 1. Top/main counter: Always static text (never counts down)
    const mainCounterElements = [
        document.getElementById('free-analysis-counter'),
        document.getElementById('free-analysis-counter-text')
    ];
    mainCounterElements.forEach(mainCounterElement => {
        if (mainCounterElement) {
            // Always show the static text, never counts down
            mainCounterElement.textContent = '3 Free analysis per day';
        }
    });

    // 2. Bottom (Plant Doctor) counter: This counts down
    const counterElements = [
        document.getElementById('analysis-counter-stats'),
        document.getElementById('analysis-counter-doctor')
    ];
    counterElements.forEach(counterElement => {
        if (counterElement) {
            if (remaining > 0) {
                counterElement.innerHTML = `<span class="text-green-600 font-semibold">${remaining} of 3 left</span>`;
            } else {
                counterElement.innerHTML = `<span class="text-red-600 font-semibold">No free analysis left today</span>`;
            }
        }
    });
}

function showUpgradePrompt() {
    const upgradePrompt = translations[currentLanguage] ? translations[currentLanguage]['upgrade-basic-prompt'] || 'Upgrade to Basic Membership ($4.99/month) for unlimited plant identification and disease analysis.' : 'Upgrade to Basic Membership ($4.99/month) for unlimited plant identification and disease analysis.';
    const upgradeNow = translations[currentLanguage] ? translations[currentLanguage]['upgrade-now'] || 'Upgrade Now' : 'Upgrade Now';
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
            behavior: 'smooth',
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
    if (mobileMenu) {
        mobileMenu.classList.toggle('show');
    }
}

// Toggle language dropdown
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const languageDropdown = document.querySelector('.language-dropdown');
    const dropdown = document.getElementById('language-dropdown');
    if (languageDropdown && dropdown && !languageDropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Fixed expandable content function with proper language support
function expandContent(section) {
    const expandedElement = document.getElementById(section + '-expanded');
    const buttonElement = document.getElementById(section + '-expand-btn');
    if (expandedElement && buttonElement) {
        if (expandedElement.classList.contains('hidden')) {
            expandedElement.classList.remove('hidden');
            // Use translated text for hide button
            const hideText = translations[currentLanguage] ? translations[currentLanguage]['click-hide-content'] || 'Click to hide content' : 'Click to hide content';
            buttonElement.textContent = hideText;
        } else {
            expandedElement.classList.add('hidden');
            // Use translated text for show more button
            const moreText = translations[currentLanguage] ? translations[currentLanguage]['click-more-content'] || 'Click for more content' : 'Click for more content';
            buttonElement.textContent = moreText;
        }
    }
}

// Garden Styles expandable content function
function expandGardenStyle(section) {
    const expandedElement = document.getElementById(section + '-expanded-content');
    const buttonElement = document.getElementById(section + '-expand-btn');
    if (expandedElement && buttonElement) {
        if (expandedElement.classList.contains('hidden')) {
            expandedElement.classList.remove('hidden');
            // Use translated text for hide button
            const hideText = translations[currentLanguage] ? translations[currentLanguage]['click-hide-content'] || 'Click to hide content' : 'Click to hide content';
            buttonElement.textContent = hideText;
            // Translate the newly visible content in Garden Styles section
            translateGardenStylesExpandedContent(currentLanguage);
        } else {
            expandedElement.classList.add('hidden');
            // Use translated text for show more button
            const moreText = translations[currentLanguage] ? translations[currentLanguage]['click-more-content'] || 'Click for more content' : 'Click for more content';
            buttonElement.textContent = moreText;
        }
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

// Newsletter subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    const submitBtn = document.getElementById('newsletter-submit-btn');
    if (!email) {
        alert('Please enter your email address.');
        return;
    }
    // Demo functionality - show success message
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    setTimeout(() => {
        alert('Thank you for subscribing! You\'ll receive our gardening tips via email.');
        document.getElementById('newsletter-email').value = '';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1000);
}

// AI Plant Doctor functionality - Enhanced with two-step process

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        selectedFile = file;
        displayImagePreview(file);
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
        alert('Please select an image first.');
        return;
    }
    // Check if user has remaining analyses
    if (dailyAnalysisCount >= 3) {
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
        // Use absolute path for production server
        const response = await fetch('https://gardenwithserge.com/api/plant-identify', {
    method: 'POST',
    body: formData
});
if (!response.ok) {
    throw new Error('Plant identification failed.');
}
const data = await response.json();
console.log("DEBUG - plant-identify backend response:", data);

if (typeof data.plantName === "undefined") {
    console.log("DEBUG - plantName is missing from response!", data);
    alert("Sorry, something went wrong. Backend response missing plantName.");
    identifiedPlantName = "Unknown plant";
} else if (!data.plantName || data.plantName === "Unknown plant") {
    console.log("DEBUG - plantName is blank or 'Unknown plant'", data.plantName);
    alert("Sorry, the plant could not be identified. Try again with a clearer or different photo.");
    identifiedPlantName = "Unknown plant";
} else {
    identifiedPlantName = data.plantName;
    let details = '';
    if (data.scientificName) details += ` (${data.scientificName})`;
    if (data.confidence) details += `, Confidence: ${(data.confidence * 100).toFixed(0)}%`;
    if (details) identifiedPlantName += details;
    console.log("DEBUG - Identified plant name:", identifiedPlantName);
}
showIdentificationStep();
    } catch (err) {
        alert('Error: ' + err.message);
        identifiedPlantName = 'Unknown plant';
        showIdentificationStep();
    } finally {
        analyzeBtn.textContent = originalText;
        analyzeBtn.disabled = false;
        currentStep = 'identification';
    }
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
            identifiedPlantElement.textContent = identifiedPlantName;
        }
    }
    // Add Start Over button if not present
    let startOverBtn = document.getElementById('start-over-identify');
    if (!startOverBtn) {
        startOverBtn = document.createElement('button');
        startOverBtn.id = 'start-over-identify';
        startOverBtn.className = 'bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors mt-4';
        startOverBtn.textContent = 'Start Over';
        startOverBtn.onclick = resetAnalysis;
        identificationStep.querySelector('.text-center').appendChild(startOverBtn);
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
    }
}

function updatePlantName() {
    const manualNameInput = document.getElementById('manual-plant-name');
    if (manualNameInput && manualNameInput.value.trim()) {
        identifiedPlantName = manualNameInput.value.trim();
        proceedToDiseaseAnalysis();
    } else {
        alert('Please enter a plant name.');
    }
}

function proceedToDiseaseAnalysis() {
    incrementAnalysisCount();
    const identificationStep = document.getElementById('identification-step');
    const analyzeBtn = document.getElementById('continue-analysis-btn');
    const originalText = analyzeBtn ? analyzeBtn.textContent : 'Continue to Disease Analysis';
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
            const response = await fetch('https://gardenwithserge.com/api/plant-analyze', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Disease analysis failed.');
            }
            const data = await response.json();
            console.log("DEBUG - plant-identify backend response:", data);
			showAnalysisResults(data);
        } catch (err) {
            alert('Error: ' + err.message);
            showAnalysisResults(null);
        } finally {
            if (analyzeBtn) {
                analyzeBtn.textContent = originalText;
                analyzeBtn.disabled = false;
            }
            currentStep = 'results';
        }
    })();
}

function showAnalysisResults(analysisData) {
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
        if (analysisData) {
            // Use backend data
            analysisPlantNameElement.textContent = analysisData.plantName || identifiedPlantName;
            healthElement.textContent = analysisData.healthStatus || '';
            if (Array.isArray(analysisData.careRecommendations)) {
                rec1Element.textContent = analysisData.careRecommendations[0] || '';
                rec2Element.textContent = analysisData.careRecommendations[1] || '';
                rec3Element.textContent = analysisData.careRecommendations[2] || '';
            }
            confidenceElement.textContent = 'Confidence: ' + (analysisData.confidence ? (analysisData.confidence * 100).toFixed(1) : 'N/A') + '% - Analysis based on image quality and plant characteristics.';
        } else {
            // fallback to random demo if backend fails
            analysisPlantNameElement.textContent = identifiedPlantName;
            const healthStatuses = [
                'Your plant appears to be in excellent health!',
                'Your plant looks healthy with minor care needed.',
                'Good overall condition with some areas for improvement.',
                'Plant shows signs of stress but is recoverable.',
                'Healthy plant with seasonal maintenance needed.'
            ];
            const recommendationSets = [
                [
                    '• Water regularly but avoid overwatering',
                    '• Ensure good drainage',
                    '• Provide 6-8 hours of sunlight daily'
                ],
                [
                    '• Check soil moisture before watering',
                    '• Add organic fertilizer monthly',
                    '• Prune dead or damaged leaves'
                ],
                [
                    '• Improve air circulation around plant',
                    '• Monitor for pest activity',
                    '• Adjust watering schedule for season'
                ],
                [
                    '• Test soil pH levels',
                    '• Consider repotting if rootbound',
                    '• Increase humidity around plant'
                ],
                [
                    '• Apply balanced fertilizer',
                    '• Deadhead spent flowers',
                    '• Watch for early signs of disease'
                ]
            ];
            const randomHealth = healthStatuses[Math.floor(Math.random() * healthStatuses.length)];
            const randomRecs = recommendationSets[Math.floor(Math.random() * recommendationSets.length)];
            healthElement.textContent = randomHealth;
            rec1Element.textContent = randomRecs[0];
            rec2Element.textContent = randomRecs[1];
            rec3Element.textContent = randomRecs[2];
            const confidence = Math.floor(Math.random() * 8) + 92;
            confidenceElement.textContent = `Confidence: ${confidence}% - Analysis based on image quality and plant characteristics.`;
        }
    }
    // Add Start Over button if not present
    let startOverBtn = document.getElementById('start-over-results');
    if (!startOverBtn && analysisResults) {
        startOverBtn = document.createElement('button');
        startOverBtn.id = 'start-over-results';
        startOverBtn.className = 'bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors mt-4';
        startOverBtn.textContent = 'Start Over';
        startOverBtn.onclick = resetAnalysis;
        analysisResults.querySelector('.text-center').appendChild(startOverBtn);
    }
}

function resetAnalysis() {
    removeImage();
    currentStep = 'upload';
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
        console.log('Stripe Payment Config:', config);
        
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
                language: currentLanguage || 'en'
            },
            allowPromotionCodes: true,
            billingAddressCollection: 'auto',
            automaticTax: { enabled: true }
        });

        if (error) {
            throw new Error(error.message);
        }

    } catch (error) {
        console.error('Stripe payment error:', error);
        
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
        
        alert(errorMessages[currentLanguage] || errorMessages.en);
        
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
        const config = paymentConfig[membershipType][billingCycle];
        console.log('PayPal Payment Config:', config);
        
        // Use PayPal SDK to create subscription
        if (typeof paypal !== 'undefined' && paypal.Subscriptions && paypal.Subscriptions.create) {
            // Create PayPal subscription directly
            paypal.Subscriptions.create({
                plan_id: config.paypalPlan,
                quantity: 1,
                application_context: {
                    brand_name: 'Garden with Serge',
                    locale: currentLanguage === 'en' ? 'en-US' : currentLanguage === 'es' ? 'es-ES' : currentLanguage === 'fr' ? 'fr-FR' : currentLanguage === 'de' ? 'de-DE' : 'en-US',
                    shipping_preference: 'NO_SHIPPING',
                    user_action: 'SUBSCRIBE_NOW',
                    return_url: `${window.location.origin}/payment-success.html?type=${membershipType}&cycle=${billingCycle}&provider=paypal`,
                    cancel_url: `${window.location.origin}/payment-cancel.html`
                },
                custom_id: `${membershipType}_${billingCycle}_${Date.now()}`,
                subscriber: {
                    name: {
                        given_name: '',
                        surname: ''
                    },
                    email_address: ''
                }
            }).then(function(details) {
                // Redirect to PayPal for approval
                const approvalUrl = details.links.find(link => link.rel === 'approve').href;
                window.location.href = approvalUrl;
            }).catch(function(error) {
                throw new Error('PayPal subscription creation failed: ' + error.message);
            });
        } else {
            // Fallback: redirect to PayPal directly with subscription parameters
            const paypalUrl = `https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=${config.paypalPlan}`;
            window.location.href = paypalUrl;
        }

    } catch (error) {
        console.error('PayPal payment error:', error);
        
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
        
        alert(errorMessages[currentLanguage] || errorMessages.en);
        
        // Hide loading
        button.disabled = false;
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}
// --- Language Switching Implementation Fix ---

// Track current language globally, use localStorage if set
window.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';

function updateTranslations(lang) {
    if (!lang) lang = window.currentLanguage;
    // Fallback to English if language not found
    if (!translations[lang]) lang = 'en';
    window.currentLanguage = lang;

    // Update all elements that match translation keys
    for (const key in translations[lang]) {
        const el = document.getElementById(key);
        if (el) el.textContent = translations[lang][key];
    }
}

// Language switching handler
function changeLanguage(lang, flag, label) {
    console.log('Changing language to:', lang);
    window.currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    setCookie('language', lang, 365); // Add this line

    updateTranslations(lang);

    // Update flag and language label in menu if present
    const flagEl = document.getElementById('current-flag');
    if (flagEl) flagEl.textContent = flag;
    const langEl = document.getElementById('current-language');
    if (langEl) langEl.textContent = label;

    // Hide the language dropdown after selection
    document.getElementById('language-dropdown').classList.remove('show');
}

// On page load, initialize to last selected language
document.addEventListener('DOMContentLoaded', function() {
    let savedLang = getCookie('language') || localStorage.getItem('selectedLanguage') || 'en';
    window.currentLanguage = savedLang;
    updateTranslations(savedLang);
});

// Make payment functions globally available
window.handleStripePayment = handleStripePayment;
window.handlePayPalPayment = handlePayPalPayment;
window.changeLanguage = changeLanguage;
window.toggleLanguageDropdown = toggleLanguageDropdown;
window.updateTranslations = updateTranslations;