<?php
// Detect membership type for JS (default to visitor)
// session_start();
$membership_type = $_SESSION['membership_type'] ?? '';
?>
<!-- AI Plant Doctor Component -->
<section id="ai-plant-doctor-anchor" class="py-8 bg-gray-50 rounded-xl shadow-lg mb-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-8">
        <div class="text-center mb-8">
            <h2 class="text-2xl sm:text-3xl font-bold text-green-800 mb-2">
                AI Plant Doctor
                <?php if ($membership_type === 'green_thumb'): ?>
                    <span class="ml-2 px-2 py-1 rounded bg-green-600 text-white text-xs font-semibold align-top">Enhanced</span>
                <?php elseif ($membership_type === 'basic'): ?>
                    <span class="ml-2 px-2 py-1 rounded bg-yellow-400 text-green-900 text-xs font-semibold align-top">Member</span>
                <?php endif; ?>
            </h2>
            <p class="text-gray-700 mb-4">
                Upload or snap a photo of your plant for instant AI-powered identification and care recommendations.
            </p>
            <div id="analysis-counter" class="text-sm text-green-600 mb-4"></div>
        </div>
        <!-- Upload & Camera UI -->
        <div id="upload-area" class="bg-white border-2 border-dashed border-green-300 rounded-lg p-8 flex flex-col items-center mb-6">
            <i data-lucide="camera" class="h-10 w-10 text-gray-400 mb-2"></i>
            <label for="plant-photo-input" class="mb-2 font-semibold cursor-pointer text-green-700 hover:underline">
                Click to upload a photo
            </label>
            <input type="file" id="plant-photo-input" accept="image/*" class="hidden" onchange="handleFileSelect(event)">
            <button onclick="startCamera()" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-2">
                Take Photo
            </button>
            <span class="text-xs text-gray-500">JPG, PNG, or GIF. Max 4MB.</span>
        </div>
        <!-- Image Preview & Actions -->
        <div id="image-preview" class="hidden mb-6">
            <img id="preview-img" src="" alt="Preview" class="max-w-xs mx-auto rounded-lg mb-4 shadow">
            <div class="flex justify-center gap-4">
                <button id="analyze-btn" onclick="analyzeImage()" class="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">Analyze Plant</button>
                <button onclick="removeImage()" class="bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600">Remove</button>
            </div>
        </div>
        <!-- Analysis Results -->
        <div id="results-area" class="hidden">
            <div class="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-4">
                <div class="text-sm text-gray-700 mb-2">Identified Plant:</div>
                <div id="identified-plant" class="text-xl font-bold text-green-900 mb-2"></div>
                <div id="plant-benefits-section" class="mt-2 mb-2 p-3 bg-green-100 rounded-lg text-green-800 text-sm shadow-inner hidden">
                    <div class="font-semibold mb-1">🌟 Plant Benefits</div>
                    <div id="plant-benefits-content">Loading...</div>
                </div>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <div class="font-semibold text-gray-900 mb-1">Health Status:</div>
                <div id="plant-health-status" class="mb-2 text-green-700"></div>
                <div class="font-semibold text-gray-900 mb-1">Recommended Care:</div>
                <ul id="care-recommendations" class="list-disc list-inside text-gray-700 mb-2"></ul>
                <div id="confidence-score" class="text-xs text-gray-500"></div>
            </div>
            <div class="flex justify-center gap-4 mt-4">
                <button onclick="resetAnalysis()" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">Analyze Another</button>
                <?php if ($membership_type === 'green_thumb'): ?>
                    <button id="plant-benefits-btn" onclick="showBenefitsModal()" class="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600">View Plant Benefits</button>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <script>
    // Membership type from PHP
    window.membershipType = "<?php echo $membership_type; ?>";

    // Track analysis count for visitors (localStorage)
    let dailyLimit = 3;
    let analysisCount = 0;
    function updateAnalysisCounter() {
        const area = document.getElementById('analysis-counter');
        if (window.membershipType === 'green_thumb' || window.membershipType === 'basic') {
            area.textContent = 'Unlimited analyses';
        } else {
            // Use localStorage to track
            const today = new Date().toLocaleDateString();
            let data = JSON.parse(localStorage.getItem('plantAnalysisCounter') || '{}');
            if (data.date !== today) { data = { date: today, count: 0 }; }
            analysisCount = data.count;
            area.innerHTML = `<b>${dailyLimit - analysisCount} free analyses left today</b>`;
        }
    }
    updateAnalysisCounter();

    // File & camera handling
    let selectedFile = null;
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        selectedFile = file;
        showImagePreview(file);
    }
    function showImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('preview-img').src = e.target.result;
            document.getElementById('image-preview').classList.remove('hidden');
            document.getElementById('upload-area').classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
    function removeImage() {
        selectedFile = null;
        document.getElementById('plant-photo-input').value = "";
        document.getElementById('image-preview').classList.add('hidden');
        document.getElementById('upload-area').classList.remove('hidden');
    }

    // Camera functionality (simple modal)
    function startCamera() {
        alert('Camera functionality coming soon! For now, please upload a photo.');
    }

    // Analysis logic
    async function analyzeImage() {
        if (!selectedFile) return alert('Please select an image.');
        // Check visitor limit
        if ((window.membershipType !== 'green_thumb' && window.membershipType !== 'basic')) {
            const today = new Date().toLocaleDateString();
            let data = JSON.parse(localStorage.getItem('plantAnalysisCounter') || '{}');
            if (data.date !== today) { data = { date: today, count: 0 }; }
            if (data.count >= dailyLimit) {
                if (confirm('You have used your daily limit of free analyses. Upgrade to unlock unlimited!')) {
                    window.location.href = '/#membership';
                }
                return;
            }
        }
        // UI state
        document.getElementById('analyze-btn').textContent = 'Analyzing...';
        document.getElementById('analyze-btn').disabled = true;

        // Prepare data
        const formData = new FormData();
        formData.append('image', selectedFile);
        // Enhanced prompt for Green Thumb
        if (window.membershipType === 'green_thumb') {
            formData.append('enhanced', '1');
        }

        // Plant identification
        let plantName = '', scientificName = '', confidence = '';
        let healthStatus = '', recommendations = [];
        let benefits = '';
        try {
            // Step 1: Identify plant
            const res1 = await fetch('/api/plant-identify', { method: 'POST', body: formData });
            const data1 = await res1.json();
            if (!data1.plantName) throw new Error("Could not identify plant.");
            plantName = data1.plantName;
            scientificName = data1.scientificName || '';
            confidence = (data1.confidence ? Math.round(data1.confidence * 100) + '%' : '');
            // Step 2: Analyze disease/care
            formData.append('plantName', plantName);
            if (scientificName) formData.append('scientificName', scientificName);
            const res2 = await fetch('/api/plant-analyze', { method: 'POST', body: formData });
            const data2 = await res2.json();
            healthStatus = data2.healthStatus || '';
            recommendations = data2.careRecommendations || [];
            // Step 3: If Green Thumb, fetch benefits
            if (window.membershipType === 'green_thumb') {
                document.getElementById('plant-benefits-section').classList.remove('hidden');
                document.getElementById('plant-benefits-content').textContent = 'Loading...';
                const benRes = await fetch('/get_plant_benefits.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ plant: plantName })
                });
                const benData = await benRes.json();
                benefits = benData.benefits || 'No benefits found.';
                document.getElementById('plant-benefits-content').textContent = benefits;
            } else {
                document.getElementById('plant-benefits-section').classList.add('hidden');
            }
            // Show results
            showResults({ plantName, scientificName, confidence, healthStatus, recommendations });
        } catch (e) {
            alert("Error: " + (e.message || "Analysis failed."));
            resetAnalysis();
        } finally {
            document.getElementById('analyze-btn').textContent = 'Analyze Plant';
            document.getElementById('analyze-btn').disabled = false;
            // Increment visitor count if needed
            if ((window.membershipType !== 'green_thumb' && window.membershipType !== 'basic')) {
                const today = new Date().toLocaleDateString();
                let data = JSON.parse(localStorage.getItem('plantAnalysisCounter') || '{}');
                if (data.date !== today) { data = { date: today, count: 0 }; }
                data.count++;
                localStorage.setItem('plantAnalysisCounter', JSON.stringify(data));
                updateAnalysisCounter();
            }
        }
    }
    function showResults({ plantName, scientificName, confidence, healthStatus, recommendations }) {
        document.getElementById('upload-area').classList.add('hidden');
        document.getElementById('image-preview').classList.add('hidden');
        document.getElementById('results-area').classList.remove('hidden');
        document.getElementById('identified-plant').textContent = plantName + (scientificName ? ' (' + scientificName + ')' : '');
        document.getElementById('plant-health-status').textContent = healthStatus;
        const careList = document.getElementById('care-recommendations');
        careList.innerHTML = '';
        recommendations.forEach(r => {
            if (r) {
                const li = document.createElement('li');
                li.textContent = r;
                careList.appendChild(li);
            }
        });
        document.getElementById('confidence-score').textContent = confidence ? 'Confidence: ' + confidence : '';
    }
    function resetAnalysis() {
        document.getElementById('results-area').classList.add('hidden');
        document.getElementById('image-preview').classList.add('hidden');
        document.getElementById('upload-area').classList.remove('hidden');
        document.getElementById('plant-photo-input').value = "";
        selectedFile = null;
        updateAnalysisCounter();
    }

    // Modal logic for Plant Benefits button (Step 2: to be enhanced)
    function showBenefitsModal() {
        // For now, just scroll to and highlight the benefits section
        const benefitsSection = document.getElementById('plant-benefits-section');
        if (benefitsSection) {
            benefitsSection.classList.remove('hidden');
            benefitsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Optionally highlight for a moment
            benefitsSection.style.boxShadow = "0 0 10px 2px #fde68a";
            setTimeout(() => { benefitsSection.style.boxShadow = ""; }, 1000);
        }
    }
    </script>
</section>