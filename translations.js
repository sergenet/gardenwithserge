// Forcefully cleanup old language settings and set English as default if nothing is set
localStorage.removeItem('language'); // Remove old key
document.cookie = 'language=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // Remove old cookie

if (!localStorage.getItem('preferred-language')) {
    localStorage.setItem('preferred-language', 'en');
}
const translations = {
  en: {
    // Navigation
    'nav-home': 'Home',
    'nav-garden-styles': 'Garden Styles',
    'nav-plant-care': 'Plant Care',
    'nav-seasonal-tips': 'Seasonal Tips',
    'nav-membership': 'Membership',
    'nav-newsletter': 'Newsletter',
    'nav-plant-doctor': 'Plant Dr.',
    'nav-garden-guides': 'Garden Guides',
    'garden-guides-title': 'Essential Garden Guides',
    'remove-image': 'Remove Image',
	'nav-member-login': 'Member Login',
	'mobile-nav-member-login': 'Member Login',
	'footer-facebook-cta': 'Follow us on Facebook',
	'footer-facebook-link': 'Follow us on Facebook',
	'footer-facebook-url': 'https://www.facebook.com/profile.php?id=61576359017023',
soil-guide-title-full: 'Complete Soil Preparation Guide',
soil-guide-body: `
  <h2>Step 1 – Test Your Soil</h2>
  <p>Use a soil pH kit or send a sample to a lab. Ideal pH is 6–7 for most vegetables.</p>
  <h2>Step 2 – Add Organic Matter</h2>
  <p>Mix in 2–3 inches of compost or well-rotted manure.</p>
  <h2>Step 3 – Improve Drainage</h2>
  <p>For heavy clay, add coarse sand and gypsum; for sandy soil, add compost and peat moss.</p>
`,

compost-guide-title-full: 'Complete Composting Basics Guide',
compost-guide-body: `
  <h2>Step 1 – Balance Greens & Browns</h2>
  <p>Greens = nitrogen-rich (kitchen scraps, grass). Browns = carbon-rich (leaves, cardboard).</p>
  <h2>Step 2 – Build the Pile</h2>
  <p>Alternate 2–3 inch layers of greens and browns, adding a shovel of soil every few layers.</p>
  <h2>Step 3 – Maintain</h2>
  <p>Keep moist like a wrung-out sponge and turn weekly.</p>
`,

pruning-guide-title-full: 'Complete Pruning Techniques Guide',
pruning-guide-body: `
  <h2>Step 1 – Know When to Prune</h2>
  <p>Spring-flowering shrubs = after bloom. Summer bloomers = late winter/early spring.</p>
  <h2>Step 2 – Make Proper Cuts</h2>
  <p>Cut ¼ inch above a bud, at a 45° angle, sloping away from the bud.</p>
  <h2>Step 3 – Remove the 3 D’s</h2>
  <p>Dead, damaged, and diseased wood first, then thin for airflow.</p>
`,
soil-guide-title-full: 'Complete Soil Preparation Guide',
soil-guide-body: `
  <h2>Step 1 – Test Your Soil</h2>
  <p>Use a soil pH kit or send a sample to a lab. Ideal pH is 6–7 for most vegetables.</p>
  <h2>Step 2 – Add Organic Matter</h2>
  <p>Mix in 2–3 inches of compost or well-rotted manure.</p>
  <h2>Step 3 – Improve Drainage</h2>
  <p>For heavy clay, add coarse sand and gypsum; for sandy soil, add compost and peat moss.</p>
`,

compost-guide-title-full: 'Complete Composting Basics Guide',
compost-guide-body: `
  <h2>Step 1 – Balance Greens & Browns</h2>
  <p>Greens = nitrogen-rich (kitchen scraps, grass). Browns = carbon-rich (leaves, cardboard).</p>
  <h2>Step 2 – Build the Pile</h2>
  <p>Alternate 2–3 inch layers of greens and browns, adding a shovel of soil every few layers.</p>
  <h2>Step 3 – Maintain</h2>
  <p>Keep moist like a wrung-out sponge and turn weekly.</p>
`,

pruning-guide-title-full: 'Complete Pruning Techniques Guide',
pruning-guide-body: `
  <h2>Step 1 – Know When to Prune</h2>
  <p>Spring-flowering shrubs = after bloom. Summer bloomers = late winter/early spring.</p>
  <h2>Step 2 – Make Proper Cuts</h2>
  <p>Cut ¼ inch above a bud, at a 45° angle, sloping away from the bud.</p>
  <h2>Step 3 – Remove the 3 D’s</h2>
  <p>Dead, damaged, and diseased wood first, then thin for airflow.</p>
`,
	
	


    // Mobile navigation
    'mobile-nav-home': 'Home',
    'mobile-nav-garden-styles': 'Garden Styles',
    'mobile-nav-plant-care': 'Plant Care',
    'mobile-nav-seasonal-tips': 'Seasonal Tips',
    'mobile-nav-membership': 'Membership',
    'mobile-nav-newsletter': 'Newsletter',
    'mobile-nav-plant-doctor': 'Plant Dr.',
    'mobile-nav-garden-guides': 'Garden Guides',
	

    // Hero Section
    'hero-title': 'Free AI Plant Doctor - Instant Disease Diagnosis',
    'hero-description': 'Get instant, accurate plant disease diagnosis powered by AI. Upload a photo and receive expert analysis within seconds.',
    'partnership-badge': 'Professional Partnership Program',
    'btn-try-plant-doctor': 'Try Plant Doctor Free',
    'btn-explore-guides': 'Explore Garden Guides',

        
        // Statistics
        'stat-plants-diagnosed': 'Plants Diagnosed',
        'stat-accuracy': 'Accuracy Rate',
        'stat-available': 'Available',
        'stat-analysis': 'Plant Analysis',
        
        // Garden Guides Section - NEW
        'garden-guides-title': 'Essential Garden Guides',
        'garden-guides-intro': 'Comprehensive guides to help you succeed in every aspect of gardening, from basic techniques to advanced methods.',
        
        // Soil Preparation Guide
        'soil-guide-title': 'Soil Preparation',
        'soil-guide-desc': 'Learn the fundamentals of healthy soil for thriving plants.',
        'soil-guide-tips': 'Key Steps:',
        'soil-tip-1': '• Test soil pH and nutrients',
        'soil-tip-2': '• Add organic compost annually',
        'soil-tip-3': '• Ensure proper drainage',
        'soil-tip-4': '• Remove weeds and debris',
        
        // Composting Guide
        'composting-guide-title': 'Composting Basics',
        'composting-guide-desc': 'Create nutrient-rich compost for your garden naturally.',
        'composting-guide-tips': 'Essential Methods:',
        'composting-tip-1': '• Balance green and brown materials',
        'composting-tip-2': '• Turn pile every 2-3 weeks',
        'composting-tip-3': '• Maintain proper moisture',
        'composting-tip-4': '• Monitor temperature levels',
        
        // Pruning Guide
        'pruning-guide-title': 'Pruning Techniques',
        'pruning-guide-desc': 'Master proper pruning for healthier, more productive plants.',
        'pruning-guide-tips': 'Best Practices:',
        'pruning-tip-1': '• Use clean, sharp tools',
        'pruning-tip-2': '• Prune at the right season',
        'pruning-tip-3': '• Remove dead and diseased wood',
        'pruning-tip-4': '• Make clean, angled cuts',
        
        // Garden Styles
        'garden-styles-title': 'Discover Garden Styles',
        'garden-styles-intro': 'Explore different gardening approaches and find the perfect style for your space, climate, and lifestyle.',
        
        // Expandable content buttons
        'click-more-content': 'Click for more content',
        'click-hide-content': 'Click to hide content',
        
        'container-gardening-title': 'Container Gardening',
        'container-gardening-desc': 'Perfect for small spaces, patios, and beginners. Grow amazing plants in pots, planters, and containers.',
        'container-guidelines': 'Essential Guidelines:',
        'container-tip-1': '• Choose containers with drainage holes',
        'container-tip-2': '• Use quality potting mix, not garden soil',
        'container-tip-3': '• Water more frequently than ground plants',
        'container-tip-4': '• Consider plant size at maturity',
        
        'vertical-gardening-title': 'Vertical Gardening',
        'vertical-gardening-desc': 'Maximize your growing space by going vertical. Perfect for urban environments and small areas.',
        'vertical-principles': 'Key Principles:',
        'vertical-tip-1': '• Ensure proper structural support',
        'vertical-tip-2': '• Plan for adequate lighting',
        'vertical-tip-3': '• Install efficient irrigation systems',
        'vertical-tip-4': '• Choose lightweight growing medium',
        
        'hydroponic-gardening-title': 'Hydroponic Gardening',
        'hydroponic-gardening-desc': 'Soil-free growing using nutrient-rich water solutions. Fast growth and high yields year-round.',
        'hydroponic-getting-started': 'Getting Started:',
        'hydroponic-tip-1': '• Start with simple systems like DWC',
        'hydroponic-tip-2': '• Monitor pH and nutrient levels',
        'hydroponic-tip-3': '• Provide adequate grow lighting',
        'hydroponic-tip-4': '• Begin with leafy greens and herbs',
        
        'permaculture-title': 'Permaculture',
        'permaculture-desc': 'Sustainable design principles that work with nature to create productive, self-maintaining systems.',
        'permaculture-principles': 'Core Principles:',
        'permaculture-tip-1': '• Care for the earth and people',
        'permaculture-tip-2': '• Design for energy efficiency',
        'permaculture-tip-3': '• Use renewable resources',
        'permaculture-tip-4': '• Create beneficial relationships',
        
        'shade-gardens-title': 'Shade Gardens',
        'shade-gardens-desc': 'Transform shady areas into lush, beautiful gardens with the right plant selection and design.',
        'shade-types': 'Shade Types:',
        'shade-tip-1': '• Partial shade: 3-6 hours sunlight',
        'shade-tip-2': '• Full shade: Less than 3 hours',
        'shade-tip-3': '• Dappled shade: Filtered sunlight',
        'shade-tip-4': '• Choose shade-loving plants',
        
        'indoor-gardening-title': 'Indoor Gardening',
        'indoor-gardening-desc': 'Bring nature indoors with houseplants, herbs, and vegetables that thrive in indoor environments.',
        'indoor-success': 'Success Factors:',
        'indoor-tip-1': '• Provide adequate light sources',
        'indoor-tip-2': '• Maintain proper humidity levels',
        'indoor-tip-3': '• Ensure good air circulation',
        'indoor-tip-4': '• Choose appropriate plant varieties',
        
        // Garden Styles Expanded Content Titles
        'container-best-plants-title': 'Best Plants for Containers:',
        'container-types-title': 'Container Types:',
        'vertical-systems-title': 'Vertical System Types:',
        'vertical-perfect-plants-title': 'Perfect Plants:',
        'hydroponic-systems-title': 'System Types:',
        'hydroponic-equipment-title': 'Equipment Needed:',
        'permaculture-design-title': 'Design Elements:',
        'permaculture-benefits-title': 'Benefits:',
        'shade-plants-title': 'Shade-Loving Plants:',
        'shade-design-title': 'Design Tips:',
        'indoor-plants-title': 'Easy Indoor Plants:',
        'indoor-conditions-title': 'Growing Conditions:',
        
        // Garden Styles Expanded Content
        // Container Gardening Content
        'container-herbs': '• Herbs: Basil, rosemary, thyme, parsley',
        'container-vegetables': '• Vegetables: Tomatoes, peppers, lettuce, beans',
        'container-flowers': '• Flowers: Petunias, marigolds, pansies',
        'container-fruits': '• Fruits: Strawberries, dwarf citrus trees',
        'container-terracotta': '• Terra cotta: Good drainage, classic look',
        'container-plastic': '• Plastic: Lightweight, retains moisture',
        'container-ceramic': '• Ceramic: Beautiful but heavy',
        'container-wood': '• Wood: Natural look, good insulation',
        
        // Vertical Gardening Content
        'vertical-living-walls': '• Living walls: Soil-based growing systems',
        'vertical-hydroponic-towers': '• Hydroponic towers: Soilless vertical systems',
        'vertical-pocket-planters': '• Pocket planters: Fabric or plastic pouches',
        'vertical-trellis-systems': '• Trellis systems: Support for climbing plants',
        'vertical-climbing-vines': '• Climbing vines: Peas, beans, cucumbers',
        'vertical-trailing-plants': '• Trailing plants: Strawberries, nasturtiums',
        'vertical-compact-vegetables': '• Compact vegetables: Lettuce, spinach, herbs',
        
        // Hydroponic Gardening Content
        'hydroponic-dwc': '• DWC (Deep Water Culture): Roots in nutrient solution',
        'hydroponic-nft': '• NFT (Nutrient Film Technique): Thin film of nutrients',
        'hydroponic-ebb-flow': '• Ebb and Flow: Periodic flooding system',
        'hydroponic-aeroponic': '• Aeroponic: Roots suspended in air, misted',
        'hydroponic-containers': '• Growing containers and growing medium',
        'hydroponic-pumps': '• Water and air pumps',
        'hydroponic-testing': '• pH and nutrient testing kits',
        'hydroponic-lights': '• LED grow lights for indoor systems',
        
        // Permaculture Content
        'permaculture-food-forests': '• Food forests: Multi-layered growing systems',
        'permaculture-water-harvesting': '• Water harvesting: Rain collection and management',
        'permaculture-companion-planting': '• Companion planting: Mutually beneficial plants',
        'permaculture-pest-management': '• Natural pest management: Ecological balance',
        'permaculture-low-maintenance': '• Reduced maintenance over time',
        'permaculture-soil-health': '• Improved soil health and biodiversity',
        'permaculture-resilient': '• Resilient to climate variations',
        'permaculture-productive': '• Produces food, medicine, and materials',
        
        // Shade Gardens Content
        'shade-hostas': '• Hostas: Dramatic foliage in many varieties',
        'shade-ferns': '• Ferns: Ancient, elegant texture plants',
        'shade-impatiens': '• Impatiens: Colorful annual flowers',
        'shade-astilbe': '• Astilbe: Feathery plumes of flowers',
        'shade-heuchera': '• Heuchera: Colorful foliage perennials',
        'shade-light-plants': '• Use light-colored plants to brighten dark areas',
        'shade-paths-seating': '• Add paths and seating for enjoyment',
        'shade-layer-height': '• Layer plants by height for depth',
        'shade-fragrant-plants': '• Include fragrant plants for sensory appeal',
        
        // Indoor Gardening Content
        'indoor-pothos': '• Pothos: Low-maintenance vine',
        'indoor-snake-plant': '• Snake plant: Tolerates low light',
        'indoor-spider-plant': '• Spider plant: Easy to propagate',
        'indoor-peace-lily': '• Peace lily: Beautiful flowers',
        'indoor-herbs': '• Herbs: Basil, mint, parsley',
        'indoor-light': '• Light: South-facing windows or grow lights',
        'indoor-temperature': '• Temperature: Most plants prefer 65-75°F',
        'indoor-humidity': '• Humidity: Use humidifiers or pebble trays',
        'indoor-soil': '• Soil: Use quality potting mixes',
        
        // Plant Care
        'plant-care-title': 'Expert Plant Care',
        'plant-care-intro': 'Master the fundamentals of plant care with our comprehensive guides covering watering, pest control, and disease management.',
        'watering-guide-title': 'Watering Guide',
        'watering-intro': 'Master the art of proper plant hydration with these essential techniques:',
        'watering-tip-1': '• Check soil moisture before watering',
        'watering-tip-2': '• Water deeply but less frequently',
        'watering-tip-3': '• Morning watering is usually best',
        'watering-tip-4': '• Adjust frequency by season and weather',
        'watering-expand-btn': 'Click for more content',
        'watering-signs-title': 'Signs of Watering Issues:',
        'watering-overwater': '• Overwatering: Yellow leaves, root rot, fungal growth',
        'watering-underwater': '• Underwatering: Wilting, dry soil, brown leaf edges',
        
        'pest-control-title': 'Pest Control',
        'pest-intro': 'Protect your plants from common pests with integrated management strategies:',
        'pest-tip-1': '• Regular inspection and early detection',
        'pest-tip-2': '• Encourage beneficial insects',
        'pest-tip-3': '• Use organic treatments when possible',
        'pest-tip-4': '• Maintain plant health for resistance',
        'pest-expand-btn': 'Click for more content',
        'pest-common-title': 'Common Garden Pests:',
        'pest-aphids': '• Aphids: Small, soft-bodied insects on new growth',
        'pest-spider-mites': '• Spider mites: Tiny pests causing stippled leaves',
        'pest-whiteflies': '• Whiteflies: Small white flying insects',
        
        'disease-mgmt-title': 'Disease Management',
        'disease-intro': 'Prevent and treat plant diseases with proper management techniques:',
        'disease-tip-1': '• Ensure proper air circulation',
        'disease-tip-2': '• Avoid overhead watering',
        'disease-tip-3': '• Remove infected plant material',
        'disease-tip-4': '• Choose disease-resistant varieties',
        'disease-expand-btn': 'Click for more content',
        'disease-common-title': 'Common Plant Diseases:',
        'disease-powdery-mildew': '• Powdery mildew: White powdery coating on leaves',
        'disease-black-spot': '• Black spot: Dark spots on leaves and stems',
        'disease-root-rot': '• Root rot: Mushy, dark roots from overwatering',

        // Seasonal Tips
        'seasonal-tips-title': 'Seasonal Gardening Tips',
        'seasonal-tips-intro': 'Discover season-specific guidance to keep your garden thriving year-round with our comprehensive seasonal gardening calendar.',
        
        'spring-title': 'Spring',
        'spring-period': 'March - May',
        'spring-description': 'The season of renewal and growth. Prepare your garden for the growing season ahead.',
        'spring-tasks-title': 'Key Tasks:',
        'spring-task-1': 'Start seeds indoors for warm-season crops',
        'spring-task-2': 'Prepare garden beds and add compost',
        'spring-task-3': 'Prune fruit trees and flowering shrubs',
        'spring-task-4': 'Begin pest and disease monitoring',
        
        'summer-title': 'Summer',
        'summer-period': 'June - August',
        'summer-description': 'Peak growing season with abundant harvests. Focus on maintenance and water management.',
        'summer-tasks-title': 'Key Tasks:',
        'summer-task-1': 'Deep watering during hot, dry periods',
        'summer-task-2': 'Harvest vegetables at peak ripeness',
        'summer-task-3': 'Deadhead flowers to encourage blooming',
        'summer-task-4': 'Monitor and treat pest infestations',
        
        'autumn-title': 'Autumn',
        'autumn-period': 'September - November',
        'autumn-description': 'Harvest time and preparation for winter. Focus on cleanup and protection.',
        'autumn-tasks-title': 'Key Tasks:',
        'autumn-task-1': 'Harvest remaining crops before frost',
        'autumn-task-2': 'Plant spring-blooming bulbs',
        'autumn-task-3': 'Clean up fallen leaves and debris',
        'autumn-task-4': 'Protect tender plants from cold',
        
        'winter-title': 'Winter',
        'winter-period': 'December - February',
        'winter-description': 'Planning and protection season. Focus on indoor growing and garden planning.',
        'winter-tasks-title': 'Key Tasks:',
        'winter-task-1': 'Plan next year\'s garden layout',
        'winter-task-2': 'Order seeds and plant catalogs',
        'winter-task-3': 'Maintain houseplants and indoor herbs',
        'winter-task-4': 'Check and maintain garden tools',
        
        // Membership
        'membership-title': 'Choose Your Gardening Journey',
        'membership-intro': 'Get expert guidance, AI plant diagnosis, and premium features to take your gardening to the next level',
        
        'basic-membership-name': 'Basic Membership',
        'basic-membership-subtitle': 'Perfect for gardening beginners',
        'basic-monthly-title': 'Monthly Plan',
        'basic-yearly-title': 'Yearly Plan',
        'basic-save-badge': 'Save 20%',
        'basic-feature-1': 'Member discounts',
        'basic-feature-2': 'Weekly newsletter',
        'basic-feature-3': 'Basic plant identification',
        'basic-feature-4': 'Community forum access',
        
        'green-thumb-name': 'Green Thumb Membership',
        'green-thumb-subtitle': 'For serious gardeners and plant enthusiasts',
        'green-thumb-monthly-title': 'Monthly Plan',
        'green-thumb-yearly-title': 'Yearly Plan',
        'green-thumb-save-badge': 'Save 20%',
        'most-popular-badge': 'Most Popular',
        'green-thumb-feature-1': 'Everything in Basic Plan',
        'green-thumb-feature-2': 'AI garden planning & insights',
        'green-thumb-feature-3': 'Expert consultations & support',
        'green-thumb-feature-4': 'Advanced disease identification AI',
        'green-thumb-feature-5': 'Location-specific calendars',
        
        // Newsletter
        'newsletter-title': 'Join Our Garden Community',
        'newsletter-description': 'Get weekly gardening advice, seasonal tips, and exclusive content delivered to your inbox.',
        'newsletter-submit-btn': 'Subscribe Free',
        
        // Plant Doctor
        'plant-doctor-title': 'Plant Doctor - AI Plant Analysis',
        'plant-doctor-description': 'Upload or take a photo of your plant for instant AI analysis and expert recommendations.',
        'free-analysis-counter': '3 Free analysis per day',
        'analysis-left': 'left',
        'no-analysis-left': 'No free analysis left today',
        'upgrade-basic-prompt': 'Upgrade to Basic Membership ($4.99/month) for unlimited plant identification and disease analysis.',
        'upgrade-now': 'Upgrade Now',
        'maybe-later': 'Maybe Later',
        
        'stat-plants-analyzed': 'Plants Analyzed',
        'stat-accuracy-rate': 'Accuracy Rate',
        'stat-instant-analysis': 'Instant Analysis',
        
        'upload-title': 'Drag and drop your plant photo here',
        'upload-description': 'or click to select from your device',
        'upload-file-btn': 'Upload File',
        'take-photo-btn': 'Take Photo',
        'analyze-btn': 'Analyze Plant',
        
        // Plant identification step
        'identification-title': 'Plant Identification',
        'identified-plant': 'We identified your plant as:',
        'plant-name-label': 'Plant Name:',
        'is-this-correct': 'Is this identification correct?',
        'yes-correct': 'Yes, this is correct',
        'no-incorrect': 'No, this is incorrect',
        'provide-plant-name': 'Please provide the correct plant name:',
        'continue-analysis': 'Continue to Disease Analysis',
        
        'analysis-complete-title': 'Analysis Complete!',
        'analysis-plant-name': 'Rose (Rosa)',
        'analysis-health-title': 'Health Status:',
        'analysis-health-status': 'Your plant appears to be in excellent health!',
        'analysis-recommendations-title': 'Recommendations:',
        'analysis-rec-1': '• Water regularly but avoid overwatering',
        'analysis-rec-2': '• Ensure good drainage',
        'analysis-rec-3': '• Provide 6-8 hours of sunlight daily',
        'analysis-confidence': 'Confidence: 98% - Analysis based on image quality and plant characteristics.',
        'analyze-another-btn': 'Analyze Another Plant',
        
        // Footer
        'footer-description': 'Your trusted companion for successful gardening. From beginner tips to advanced techniques, we help you grow the garden of your dreams.',
        'footer-quick-links-title': 'Quick Links',
        'footer-home': 'Home',
        'footer-garden-styles': 'Garden Styles',
        'footer-plant-care': 'Plant Care',
        'footer-plant-doctor': 'Plant Doctor',
        'footer-contact-title': 'Get In Touch',
        'footer-contact-description': 'Join our community of passionate gardeners and start your journey to gardening success today.',
        'footer-copyright': '© 2025 Garden with Serge. All rights reserved.'
    },
    
    es: {
    // Navigation
    'nav-home': 'Inicio',
    'nav-garden-styles': 'Estilos de Jardín',
    'nav-plant-care': 'Cuidado de Plantas',
    'nav-seasonal-tips': 'Consejos Estacionales',
    'nav-membership': 'Membresía',
    'nav-newsletter': 'Boletín',
    'nav-plant-doctor': 'Dr. Plantas',
    'nav-garden-guides': 'Guías de Jardín',
    'garden-guides-title': 'Guías Esenciales de Jardín',
    'remove-image': 'eliminar imagen',
	'nav-member-login': 'Ingresar Miembro',
	'mobile-nav-member-login': 'Ingresar Miembro',
	'footer-facebook-cta': 'Síguenos en Facebook',
	'footer-facebook-link': 'Síguenos en Facebook',
	'footer-facebook-url': 'https://www.facebook.com/profile.php?id=61576359017023',
soil-guide-title-full: 'Guía Completa de Preparación del Suelo',
soil-guide-body: `
  <h2>Paso 1 – Analiza tu suelo</h2>
  <p>Usa un kit de pH o envía una muestra a un laboratorio. El pH ideal es 6–7 para la mayoría de vegetales.</p>
  <h2>Paso 2 – Añade materia orgánica</h2>
  <p>Mezcla 5–7 cm de compost o estiércol bien descompuesto.</p>
  <h2>Paso 3 – Mejora el drenaje</h2>
  <p>Para arcilla pesada, agrega arena gruesa y yeso; para suelo arenoso, agrega compost y turba.</p>
`,

compost-guide-title-full: 'Guía Completa de Bases del Compostaje',
compost-guide-body: `
  <h2>Paso 1 – Equilibra verdes y marrones</h2>
  <p>Verdes = ricos en nitrógeno (restos de cocina, césped). Marrones = ricos en carbono (hojas, cartón).</p>
  <h2>Paso 2 – Construye la pila</h2>
  <p>Alterna capas de 5–7 cm de verdes y marrones, añadiendo una pala de tierra cada pocas capas.</p>
  <h2>Paso 3 – Mantén</h2>
  <p>Mantén húmedo como una esponja escurrida y remueve semanalmente.</p>
`,

pruning-guide-title-full: 'Guía Completa de Técnicas de Poda',
pruning-guide-body: `
  <h2>Paso 1 – Sabe cuándo podar</h2>
  <p>Arbustos de floración primaveral = después de florecer. De verano = fines de invierno.</p>
  <h2>Paso 2 – Realiza cortes correctos</h2>
  <p>Corta 6 mm por encima de una yema, en ángulo de 45°, alejado de la yema.</p>
  <h2>Paso 3 – Elimina las 3 D</h2>
  <p>Madera muerta, dañada y enferma primero, luego adelgaza para mejorar la ventilación.</p>
`,
soil-guide-title-full: 'Guía Completa de Preparación del Suelo',
soil-guide-body: `
  <h2>Paso 1 – Analiza tu suelo</h2>
  <p>Usa un kit de pH o envía una muestra a un laboratorio. El pH ideal es 6–7.</p>
  <h2>Paso 2 – Añade materia orgánica</h2>
  <p>Mezcla 5–7 cm de compost o estiércol bien descompuesto.</p>
  <h2>Paso 3 – Mejora el drenaje</h2>
  <p>Para arcilla pesada, agrega arena gruesa y yeso; para suelo arenoso, añade compost y turba.</p>
`,

compost-guide-title-full: 'Guía Completa de Bases del Compostaje',
compost-guide-body: `
  <h2>Paso 1 – Equilibra verdes y marrones</h2>
  <p>Verdes = ricos en nitrógeno (restos de cocina, césped). Marrones = ricos en carbono (hojas, cartón).</p>
  <h2>Paso 2 – Construye la pila</h2>
  <p>Alterna capas de 5–7 cm de verdes y marrones, añadiendo una pala de tierra cada pocas capas.</p>
  <h2>Paso 3 – Mantén</h2>
  <p>Mantén húmedo como una esponja escurrida y remueve cada 2–3 semanas.</p>
`,

pruning-guide-title-full: 'Guía Completa de Técnicas de Poda',
pruning-guide-body: `
  <h2>Paso 1 – Sabe cuándo podar</h2>
  <p>Arbustos de floración primaveral = después de florecer. Veraniegos = fines de invierno.</p>
  <h2>Paso 2 – Realiza cortes correctos</h2>
  <p>Corta 6 mm por encima de una yema, en ángulo de 45°, orientado hacia afuera.</p>
  <h2>Paso 3 – Elimina las 3 D</h2>
  <p>Madera muerta, dañada y enferma primero, luego adelgaza para ventilación.</p>
`,
	
	

    // Mobile navigation
    'mobile-nav-home': 'Inicio',
    'mobile-nav-garden-styles': 'Estilos de Jardín',
    'mobile-nav-plant-care': 'Cuidado de Plantas',
    'mobile-nav-seasonal-tips': 'Consejos Estacionales',
    'mobile-nav-membership': 'Membresía',
    'mobile-nav-newsletter': 'Boletín',
    'mobile-nav-plant-doctor': 'Dr. Plantas',
    'mobile-nav-garden-guides': 'Guías de Jardín',
	


        
        // Hero Section
        'hero-title': 'Doctor IA de Plantas Gratuito - Diagnóstico Instantáneo de Enfermedades',
        'hero-description': 'Obtén diagnósticos instantáneos y precisos de enfermedades de plantas impulsados por IA. Sube una foto y recibe análisis experto en segundos.',
        'partnership-badge': 'Programa de Asociación Profesional',
        'btn-try-plant-doctor': 'Probar Doctor de Plantas Gratis',
        'btn-explore-guides': 'Explorar Guías de Jardín',
        
        // Statistics
        'stat-plants-diagnosed': 'Plantas Diagnosticadas',
        'stat-accuracy': 'Tasa de Precisión',
        'stat-available': 'Disponible',
        'stat-analysis': 'Análisis de Plantas',
        
        // Garden Guides Section
        'garden-guides-title': 'Guías Esenciales de Jardín',
        'garden-guides-intro': 'Guías completas para ayudarte a tener éxito en todos los aspectos de la jardinería, desde técnicas básicas hasta métodos avanzados.',
        
        // Soil Preparation Guide
        'soil-guide-title': 'Preparación del Suelo',
        'soil-guide-desc': 'Aprende los fundamentos de un suelo saludable para plantas prósperas.',
        'soil-guide-tips': 'Pasos Clave:',
        'soil-tip-1': '• Probar el pH y los nutrientes del suelo',
        'soil-tip-2': '• Añadir compost orgánico anualmente',
        'soil-tip-3': '• Asegurar un drenaje adecuado',
        'soil-tip-4': '• Eliminar malezas y escombros',
        
        // Composting Guide
        'composting-guide-title': 'Fundamentos del Compostaje',
        'composting-guide-desc': 'Crea compost rico en nutrientes para tu jardín de manera natural.',
        'composting-guide-tips': 'Métodos Esenciales:',
        'composting-tip-1': '• Equilibrar materiales verdes y marrones',
        'composting-tip-2': '• Voltear la pila cada 2-3 semanas',
        'composting-tip-3': '• Mantener la humedad adecuada',
        'composting-tip-4': '• Monitorear los niveles de temperatura',
        
        // Pruning Guide
        'pruning-guide-title': 'Técnicas de Poda',
        'pruning-guide-desc': 'Domina la poda adecuada para plantas más saludables y productivas.',
        'pruning-guide-tips': 'Mejores Prácticas:',
        'pruning-tip-1': '• Usar herramientas limpias y afiladas',
        'pruning-tip-2': '• Podar en la estación correcta',
        'pruning-tip-3': '• Eliminar madera muerta y enferma',
        'pruning-tip-4': '• Hacer cortes limpios y angulados',
        
        // Garden Styles
        'garden-styles-title': 'Descubre Estilos de Jardín',
        'garden-styles-intro': 'Explora diferentes enfoques de jardinería y encuentra el estilo perfecto para tu espacio, clima y estilo de vida.',
        
        // Expandable content buttons
        'click-more-content': 'Clic para más contenido',
        'click-hide-content': 'Clic para ocultar contenido',
        
        'container-gardening-title': 'Jardinería en Contenedores',
        'container-gardening-desc': 'Perfecto para espacios pequeños, patios y principiantes. Cultiva plantas increíbles en macetas, jardineras y contenedores.',
        'container-guidelines': 'Pautas Esenciales:',
        'container-tip-1': '• Elegir contenedores con orificios de drenaje',
        'container-tip-2': '• Usar mezcla de macetas de calidad, no tierra de jardín',
        'container-tip-3': '• Regar más frecuentemente que las plantas de suelo',
        'container-tip-4': '• Considerar el tamaño de la planta en la madurez',
        
        'vertical-gardening-title': 'Jardinería Vertical',
        'vertical-gardening-desc': 'Maximiza tu espacio de cultivo yendo vertical. Perfecto para entornos urbanos y áreas pequeñas.',
        'vertical-principles': 'Principios Clave:',
        'vertical-tip-1': '• Asegurar soporte estructural adecuado',
        'vertical-tip-2': '• Planificar iluminación adecuada',
        'vertical-tip-3': '• Instalar sistemas de riego eficientes',
        'vertical-tip-4': '• Elegir medio de cultivo liviano',
        
        'hydroponic-gardening-title': 'Jardinería Hidropónica',
        'hydroponic-gardening-desc': 'Cultivo sin suelo usando soluciones de agua ricas en nutrientes. Crecimiento rápido y altos rendimientos durante todo el año.',
        'hydroponic-getting-started': 'Comenzando:',
        'hydroponic-tip-1': '• Comenzar con sistemas simples como DWC',
        'hydroponic-tip-2': '• Monitorear niveles de pH y nutrientes',
        'hydroponic-tip-3': '• Proporcionar iluminación de cultivo adecuada',
        'hydroponic-tip-4': '• Comenzar con verduras de hoja verde y hierbas',
        
        'permaculture-title': 'Permacultura',
        'permaculture-desc': 'Principios de diseño sostenible que trabajan con la naturaleza para crear sistemas productivos y autosostenibles.',
        'permaculture-principles': 'Principios Fundamentales:',
        'permaculture-tip-1': '• Cuidar la tierra y las personas',
        'permaculture-tip-2': '• Diseñar para la eficiencia energética',
        'permaculture-tip-3': '• Usar recursos renovables',
        'permaculture-tip-4': '• Crear relaciones beneficiosas',
        
        'shade-gardens-title': 'Jardines de Sombra',
        'shade-gardens-desc': 'Transforma áreas sombreadas en jardines exuberantes y hermosos con la selección y diseño de plantas adecuados.',
        'shade-types': 'Tipos de Sombra:',
        'shade-tip-1': '• Sombra parcial: 3-6 horas de luz solar',
        'shade-tip-2': '• Sombra completa: Menos de 3 horas',
        'shade-tip-3': '• Sombra moteada: Luz solar filtrada',
        'shade-tip-4': '• Elegir plantas amantes de la sombra',
        
        'indoor-gardening-title': 'Jardinería Interior',
        'indoor-gardening-desc': 'Trae la naturaleza al interior con plantas de casa, hierbas y vegetales que prosperan en ambientes interiores.',
        'indoor-success': 'Factores de Éxito:',
        'indoor-tip-1': '• Proporcionar fuentes de luz adecuadas',
        'indoor-tip-2': '• Mantener niveles de humedad apropiados',
        'indoor-tip-3': '• Asegurar buena circulación de aire',
        'indoor-tip-4': '• Elegir variedades de plantas apropiadas',
        
        // Garden Styles Expanded Content Titles
        'container-best-plants-title': 'Mejores Plantas para Contenedores:',
        'container-types-title': 'Tipos de Contenedores:',
        'vertical-systems-title': 'Tipos de Sistemas Verticales:',
        'vertical-perfect-plants-title': 'Plantas Perfectas:',
        'hydroponic-systems-title': 'Tipos de Sistemas:',
        'hydroponic-equipment-title': 'Equipo Necesario:',
        'permaculture-design-title': 'Elementos de Diseño:',
        'permaculture-benefits-title': 'Beneficios:',
        'shade-plants-title': 'Plantas Amantes de la Sombra:',
        'shade-design-title': 'Consejos de Diseño:',
        'indoor-plants-title': 'Plantas de Interior Fáciles:',
        'indoor-conditions-title': 'Condiciones de Crecimiento:',
        
        // Garden Styles Expanded Content
        // Container Gardening Content
        'container-herbs': '• Hierbas: Albahaca, romero, tomillo, perejil',
        'container-vegetables': '• Vegetales: Tomates, pimientos, lechuga, frijoles',
        'container-flowers': '• Flores: Petunias, caléndulas, pensamientos',
        'container-fruits': '• Frutas: Fresas, árboles cítricos enanos',
        'container-terracotta': '• Terracota: Buen drenaje, aspecto clásico',
        'container-plastic': '• Plástico: Liviano, retiene humedad',
        'container-ceramic': '• Cerámica: Hermoso pero pesado',
        'container-wood': '• Madera: Aspecto natural, buen aislamiento',
        
        // Vertical Gardening Content
        'vertical-living-walls': '• Paredes vivas: Sistemas de cultivo basados en suelo',
        'vertical-hydroponic-towers': '• Torres hidropónicas: Sistemas verticales sin suelo',
        'vertical-pocket-planters': '• Jardineras de bolsillo: Bolsas de tela o plástico',
        'vertical-trellis-systems': '• Sistemas de enrejado: Soporte para plantas trepadoras',
        'vertical-climbing-vines': '• Enredaderas trepadoras: Guisantes, frijoles, pepinos',
        'vertical-trailing-plants': '• Plantas colgantes: Fresas, capuchinas',
        'vertical-compact-vegetables': '• Vegetales compactos: Lechuga, espinaca, hierbas',
        
        // Hydroponic Gardening Content
        'hydroponic-dwc': '• DWC (Cultivo en Agua Profunda): Raíces en solución nutritiva',
        'hydroponic-nft': '• NFT (Técnica de Película Nutritiva): Película delgada de nutrientes',
        'hydroponic-ebb-flow': '• Flujo y Reflujo: Sistema de inundación periódica',
        'hydroponic-aeroponic': '• Aeropónico: Raíces suspendidas en aire, nebulizadas',
        'hydroponic-containers': '• Contenedores de cultivo y medio de crecimiento',
        'hydroponic-pumps': '• Bombas de agua y aire',
        'hydroponic-testing': '• Kits de prueba de pH y nutrientes',
        'hydroponic-lights': '• Luces LED de crecimiento para sistemas interiores',
        
        // Permaculture Content
        'permaculture-food-forests': '• Bosques de alimentos: Sistemas de cultivo en múltiples capas',
        'permaculture-water-harvesting': '• Cosecha de agua: Recolección y manejo de lluvia',
        'permaculture-companion-planting': '• Plantación de compañía: Plantas mutuamente beneficiosas',
        'permaculture-pest-management': '• Manejo natural de plagas: Balance ecológico',
        'permaculture-low-maintenance': '• Mantenimiento reducido con el tiempo',
        'permaculture-soil-health': '• Mejora de la salud del suelo y biodiversidad',
        'permaculture-resilient': '• Resistente a variaciones climáticas',
        'permaculture-productive': '• Produce alimentos, medicina y materiales',
        
        // Shade Gardens Content
        'shade-hostas': '• Hostas: Follaje dramático en muchas variedades',
        'shade-ferns': '• Helechos: Plantas de textura antigua y elegante',
        'shade-impatiens': '• Impatiens: Flores anuales coloridas',
        'shade-astilbe': '• Astilbe: Plumas espumosas de flores',
        'shade-heuchera': '• Heuchera: Perennes de follaje colorido',
        'shade-light-plants': '• Usar plantas de colores claros para iluminar áreas oscuras',
        'shade-paths-seating': '• Agregar senderos y asientos para el disfrute',
        'shade-layer-height': '• Disponer plantas en capas por altura para profundidad',
        'shade-fragrant-plants': '• Incluir plantas fragantes para atractivo sensorial',
        
        // Indoor Gardening Content
        'indoor-pothos': '• Pothos: Enredadera de bajo mantenimiento',
        'indoor-snake-plant': '• Planta serpiente: Tolera poca luz',
        'indoor-spider-plant': '• Planta araña: Fácil de propagar',
        'indoor-peace-lily': '• Lirio de la paz: Flores hermosas',
        'indoor-herbs': '• Hierbas: Albahaca, menta, perejil',
        'indoor-light': '• Luz: Ventanas orientadas al sur o luces de crecimiento',
        'indoor-temperature': '• Temperatura: La mayoría de plantas prefieren 18-24°C',
        'indoor-humidity': '• Humedad: Usar humidificadores o bandejas de guijarros',
        'indoor-soil': '• Suelo: Usar mezclas de macetas de calidad',
        
        // Plant Care
        'plant-care-title': 'Cuidado Experto de Plantas',
        'plant-care-intro': 'Domina los fundamentos del cuidado de plantas con nuestras guías completas que cubren riego, control de plagas y manejo de enfermedades.',
        'watering-guide-title': 'Guía de Riego',
        'watering-intro': 'Domina el arte de la hidratación adecuada de plantas con estas técnicas esenciales:',
        'watering-tip-1': '• Verificar la humedad del suelo antes de regar',
        'watering-tip-2': '• Regar profundamente pero con menos frecuencia',
        'watering-tip-3': '• El riego matutino es generalmente mejor',
        'watering-tip-4': '• Ajustar frecuencia según temporada y clima',
        'watering-expand-btn': 'Clic para más contenido',
        'watering-signs-title': 'Señales de Problemas de Riego:',
        'watering-overwater': '• Exceso de riego: Hojas amarillas, pudrición de raíces, crecimiento de hongos',
        'watering-underwater': '• Falta de riego: Marchitamiento, suelo seco, bordes de hojas marrones',
        
        'pest-control-title': 'Control de Plagas',
        'pest-intro': 'Protege tus plantas de plagas comunes con estrategias de manejo integrado:',
        'pest-tip-1': '• Inspección regular y detección temprana',
        'pest-tip-2': '• Fomentar insectos beneficiosos',
        'pest-tip-3': '• Usar tratamientos orgánicos cuando sea posible',
        'pest-tip-4': '• Mantener la salud de las plantas para resistencia',
        'pest-expand-btn': 'Clic para más contenido',
        'pest-common-title': 'Plagas Comunes del Jardín:',
        'pest-aphids': '• Pulgones: Insectos pequeños de cuerpo blando en crecimiento nuevo',
        'pest-spider-mites': '• Ácaros araña: Plagas diminutas que causan hojas moteadas',
        'pest-whiteflies': '• Moscas blancas: Pequeños insectos voladores blancos',
        
        'disease-mgmt-title': 'Manejo de Enfermedades',
        'disease-intro': 'Prevén y trata enfermedades de plantas con técnicas de manejo adecuadas:',
        'disease-tip-1': '• Asegurar circulación de aire adecuada',
        'disease-tip-2': '• Evitar riego por encima',
        'disease-tip-3': '• Eliminar material vegetal infectado',
        'disease-tip-4': '• Elegir variedades resistentes a enfermedades',
        'disease-expand-btn': 'Clic para más contenido',
        'disease-common-title': 'Enfermedades Comunes de Plantas:',
        'disease-powdery-mildew': '• Mildiu polvoriento: Recubrimiento polvoriento blanco en hojas',
        'disease-black-spot': '• Mancha negra: Manchas oscuras en hojas y tallos',
        'disease-root-rot': '• Pudrición de raíces: Raíces blandas y oscuras por exceso de riego',

        // Seasonal Tips
        'seasonal-tips-title': 'Consejos de Jardinería Estacional',
        'seasonal-tips-intro': 'Descubre orientación específica por temporada para mantener tu jardín próspero durante todo el año con nuestro calendario completo de jardinería estacional.',
        
        'spring-title': 'Primavera',
        'spring-period': 'Marzo - Mayo',
        'spring-description': 'La temporada de renovación y crecimiento. Prepara tu jardín para la temporada de cultivo que viene.',
        'spring-tasks-title': 'Tareas Clave:',
        'spring-task-1': 'Iniciar semillas en interior para cultivos de temporada cálida',
        'spring-task-2': 'Preparar camas de jardín y añadir compost',
        'spring-task-3': 'Podar árboles frutales y arbustos florales',
        'spring-task-4': 'Comenzar monitoreo de plagas y enfermedades',
        
        'summer-title': 'Verano',
        'summer-period': 'Junio - Agosto',
        'summer-description': 'Temporada pico de crecimiento con cosechas abundantes. Enfócate en mantenimiento y manejo del agua.',
        'summer-tasks-title': 'Tareas Clave:',
        'summer-task-1': 'Riego profundo durante períodos calurosos y secos',
        'summer-task-2': 'Cosechar vegetales en su punto óptimo de maduración',
        'summer-task-3': 'Quitar flores marchitas para fomentar la floración',
        'summer-task-4': 'Monitorear y tratar infestaciones de plagas',
        
        'autumn-title': 'Otoño',
        'autumn-period': 'Septiembre - Noviembre',
        'autumn-description': 'Tiempo de cosecha y preparación para el invierno. Enfócate en limpieza y protección.',
        'autumn-tasks-title': 'Tareas Clave:',
        'autumn-task-1': 'Cosechar cultivos restantes antes de las heladas',
        'autumn-task-2': 'Plantar bulbos que florecen en primavera',
        'autumn-task-3': 'Limpiar hojas caídas y escombros',
        'autumn-task-4': 'Proteger plantas tiernas del frío',
        
        'winter-title': 'Invierno',
        'winter-period': 'Diciembre - Febrero',
        'winter-description': 'Temporada de planificación y protección. Enfócate en cultivo interior y planificación del jardín.',
        'winter-tasks-title': 'Tareas Clave:',
        'winter-task-1': 'Planificar el diseño del jardín del próximo año',
        'winter-task-2': 'Ordenar semillas y catálogos de plantas',
        'winter-task-3': 'Mantener plantas de casa y hierbas de interior',
        'winter-task-4': 'Verificar y mantener herramientas de jardín',
        
        // Membership
        'membership-title': 'Elige Tu Viaje de Jardinería',
        'membership-intro': 'Obtén orientación experta, diagnóstico de IA de plantas y funciones premium para llevar tu jardinería al siguiente nivel',
        
        'basic-membership-name': 'Membresía Básica',
        'basic-membership-subtitle': 'Perfecto para principiantes en jardinería',
        'basic-monthly-title': 'Plan Mensual',
        'basic-yearly-title': 'Plan Anual',
        'basic-save-badge': 'Ahorra 20%',
        'basic-feature-1': 'Descuentos para miembros',
        'basic-feature-2': 'Boletín semanal',
        'basic-feature-3': 'Identificación básica de plantas',
        'basic-feature-4': 'Acceso al foro comunitario',
        
        'green-thumb-name': 'Membresía Pulgar Verde',
        'green-thumb-subtitle': 'Para jardineros serios y entusiastas de las plantas',
        'green-thumb-monthly-title': 'Plan Mensual',
        'green-thumb-yearly-title': 'Plan Anual',
        'green-thumb-save-badge': 'Ahorra 20%',
        'most-popular-badge': 'Más Popular',
        'green-thumb-feature-1': 'Todo en el Plan Básico',
        'green-thumb-feature-2': 'Planificación de jardín con IA',
        'green-thumb-feature-3': 'Consultas y soporte experto',
        'green-thumb-feature-4': 'IA avanzada de identificación de enfermedades',
        'green-thumb-feature-5': 'Calendarios específicos por ubicación',
        
        // Newsletter
        'newsletter-title': 'Únete a Nuestra Comunidad de Jardín',
        'newsletter-description': 'Recibe consejos de jardinería semanales, tips estacionales y contenido exclusivo en tu bandeja de entrada.',
        'newsletter-submit-btn': 'Suscribirse Gratis',
        
        // Plant Doctor
        'plant-doctor-title': 'Doctor de Plantas - Análisis IA de Plantas',
        'plant-doctor-description': 'Sube o toma una foto de tu planta para análisis instantáneo de IA y recomendaciones expertas.',
        'free-analysis-counter': '3 análisis gratuitos por día',
        'analysis-left': 'restantes',
        'no-analysis-left': 'No quedan análisis gratuitos hoy',
        'upgrade-basic-prompt': 'Actualiza a Membresía Básica ($4.99/mes) para identificación y análisis ilimitado de plantas.',
        'upgrade-now': 'Actualizar Ahora',
        'maybe-later': 'Tal vez más tarde',
        
        'stat-plants-analyzed': 'Plantas Analizadas',
        'stat-accuracy-rate': 'Tasa de Precisión',
        'stat-instant-analysis': 'Análisis Instantáneo',
        
        'upload-title': 'Arrastra y suelta tu foto de planta aquí',
        'upload-description': 'o haz clic para seleccionar desde tu dispositivo',
        'upload-file-btn': 'Subir Archivo',
        'take-photo-btn': 'Tomar Foto',
        'analyze-btn': 'Analizar Planta',
        
        // Plant identification step
        'identification-title': 'Identificación de Planta',
        'identified-plant': 'Identificamos tu planta como:',
        'plant-name-label': 'Nombre de la Planta:',
        'is-this-correct': '¿Es correcta esta identificación?',
        'yes-correct': 'Sí, esto es correcto',
        'no-incorrect': 'No, esto es incorrecto',
        'provide-plant-name': 'Por favor proporciona el nombre correcto de la planta:',
        'continue-analysis': 'Continuar al Análisis de Enfermedades',
        
        'analysis-complete-title': '¡Análisis Completo!',
        'analysis-plant-name': 'Rosa (Rosa)',
        'analysis-health-title': 'Estado de Salud:',
        'analysis-health-status': '¡Tu planta parece estar en excelente salud!',
        'analysis-recommendations-title': 'Recomendaciones:',
        'analysis-rec-1': '• Riega regularmente pero evita el exceso de riego',
        'analysis-rec-2': '• Asegura buen drenaje',
        'analysis-rec-3': '• Proporciona 6-8 horas de luz solar diaria',
        'analysis-confidence': 'Confianza: 98% - Análisis basado en calidad de imagen y características de planta.',
        'analyze-another-btn': 'Analizar Otra Planta',
        
        // Footer
        'footer-description': 'Tu compañero confiable para jardinería exitosa. Desde consejos para principiantes hasta técnicas avanzadas, te ayudamos a cultivar el jardín de tus sueños.',
        'footer-quick-links-title': 'Enlaces Rápidos',
        'footer-home': 'Inicio',
        'footer-garden-styles': 'Estilos de Jardín',
        'footer-plant-care': 'Cuidado de Plantas',
        'footer-plant-doctor': 'Doctor de Plantas',
        'footer-contact-title': 'Contacto',
        'footer-contact-description': 'Únete a nuestra comunidad de jardineros apasionados y comienza tu viaje hacia el éxito en jardinería hoy.',
        'footer-copyright': '© 2025 Garden with Serge. Todos los derechos reservados.'
    },
    
    fr: {
    // Navigation
    'nav-home': 'Accueil',
    'nav-garden-styles': 'Styles de Jardin',
    'nav-plant-care': 'Soin des Plantes',
    'nav-seasonal-tips': 'Conseils Saisonniers',
    'nav-membership': 'Adhésion',
    'nav-newsletter': 'Bulletin',
    'nav-plant-doctor': 'Docteur Plantes',
    'nav-garden-guides': 'Guides de Jardin',
    'garden-guides-title': 'Guides Essentiels de Jardinage',
    'remove-image': 'supprimer l\'image',
	'nav-member-login': 'Connexion Membre',
	'mobile-nav-member-login': 'Connexion Membre',
	'footer-facebook-cta': 'Suivez-nous sur Facebook',
	'footer-facebook-link': 'Suivez-nous sur Facebook',
	'footer-facebook-url': 'https://www.facebook.com/profile.php?id=61576359017023',
soil-guide-title-full: 'Guide Complet de Préparation du Sol',
soil-guide-body: `
  <h2>Étape 1 – Testez votre sol</h2>
  <p>Utilisez un kit pH ou envoyez un échantillon au laboratoire. Le pH idéal est 6–7.</p>
  <h2>Étape 2 – Ajoutez de la matière organique</h2>
  <p>Incorporez 5–7 cm de compost ou de fumier bien décomposé.</p>
  <h2>Étape 3 – Améliorez le drainage</h2>
  <p>Pour l’argile lourde, ajoutez du sable grossier et du gypse ; pour le sableux, du compost et de la tourbe.</p>
`,

compost-guide-title-full: 'Guide Complet des Bases du Compostage',
compost-guide-body: `
  <h2>Étape 1 – Équilibrez verts et bruns</h2>
  <p>Verts = riches en azote (déchets de cuisine, gazon). Bruns = riches en carbone (feuilles, carton).</p>
  <h2>Étape 2 – Construisez le tas</h2>
  <p>Alternez des couches de 5–7 cm de verts et bruns, ajoutez une pelle de terre de temps en temps.</p>
  <h2>Étape 3 – Entretenez</h2>
  <p>Gardez humide comme une éponge essorée et retournez chaque semaine.</p>
`,

pruning-guide-title-full: 'Guide Complet des Techniques de Taille',
pruning-guide-body: `
  <h2>Étape 1 – Sachez quand tailler</h2>
  <p>Arbustes à floraison printanière = après floraison ; floraison estivale = fin hiver.</p>
  <h2>Étape 2 – Faites des coupes propres</h2>
  <p>Coupez 6 mm au-dessus d’un bourgeon, angle de 45°, orienté vers l’extérieur.</p>
  <h2>Étape 3 – Retirez les 3 D</h2>
  <p>Supprimez le bois mort, endommagé et malade, puis éclaircissez pour l’aération.</p>
`,
soil-guide-title-full: 'Guide Complet de Préparation du Sol',
soil-guide-body: `
  <h2>Étape 1 – Testez votre sol</h2>
  <p>Utilisez un kit pH ou envoyez un échantillon au laboratoire. Le pH idéal est 6–7.</p>
  <h2>Étape 2 – Ajoutez de la matière organique</h2>
  <p>Incorporez 5–7 cm de compost ou de fumier bien décomposé.</p>
  <h2>Étape 3 – Améliorez le drainage</h2>
  <p>Pour l’argile lourde, ajoutez du sable grossier et du gypse ; pour le sableux, du compost et de la tourbe.</p>
`,

compost-guide-title-full: 'Guide Complet des Bases du Compostage',
compost-guide-body: `
  <h2>Étape 1 – Équilibrez verts et bruns</h2>
  <p>Verts = riches en azote (déchets de cuisine, gazon). Bruns = riches en carbone (feuilles, carton).</p>
  <h2>Étape 2 – Construisez le tas</h2>
  <p>Alternez des couches de 5–7 cm de verts et bruns, ajoutez une pelle de terre toutes les quelques couches.</p>
  <h2>Étape 3 – Entretenez</h2>
  <p>Gardez humide comme une éponge essorée et retournez chaque semaine.</p>
`,

pruning-guide-title-full: 'Guide Complet des Techniques de Taille',
pruning-guide-body: `
  <h2>Étape 1 – Sachez quand tailler</h2>
  <p>Arbustes à floraison printanière = après floraison ; estivale = fin hiver.</p>
  <h2>Étape 2 – Faites des coupes propres</h2>
  <p>Coupez 6 mm au-dessus d’un bourgeon, angle de 45°, orienté vers l’extérieur.</p>
  <h2>Étape 3 – Retirez les 3 D</h2>
  <p>Supprimez le bois mort, endommagé et malade, puis éclaircissez pour l’aération.</p>
`,
	
	

    // Mobile navigation
    'mobile-nav-home': 'Accueil',
    'mobile-nav-garden-styles': 'Styles de Jardin',
    'mobile-nav-plant-care': 'Soin des Plantes',
    'mobile-nav-seasonal-tips': 'Conseils Saisonniers',
    'mobile-nav-membership': 'Adhésion',
    'mobile-nav-newsletter': 'Bulletin',
    'mobile-nav-garden-guides': 'Guides de Jardin',
    'mobile-nav-plant-doctor': 'Docteur Plantes',
	

        // Hero Section
        'hero-title': 'Docteur IA de Plantes Gratuit - Diagnostic Instantané des Maladies',
        'hero-description': 'Obtenez un diagnostic instantané et précis des maladies des plantes alimenté par IA. Téléchargez une photo et recevez une analyse experte en quelques secondes.',
        'partnership-badge': 'Programme de Partenariat Professionnel',
        'btn-try-plant-doctor': 'Essayer le Docteur de Plantes Gratuitement',
        'btn-explore-guides': 'Explorer les Guides de Jardin',
        
        // Statistics
        'stat-plants-diagnosed': 'Plantes Diagnostiquées',
        'stat-accuracy': 'Taux de Précision',
        'stat-available': 'Disponible',
        'stat-analysis': 'Analyse de Plantes',
        
        // Garden Guides Section
        'garden-guides-title': 'Guides Essentiels de Jardinage',
        'garden-guides-intro': 'Guides complets pour vous aider à réussir dans tous les aspects du jardinage, des techniques de base aux méthodes avancées.',
        
        // Soil Preparation Guide
        'soil-guide-title': 'Préparation du Sol',
        'soil-guide-desc': 'Apprenez les fondamentaux d\'un sol sain pour des plantes prospères.',
        'soil-guide-tips': 'Étapes Clés:',
        'soil-tip-1': '• Testez le pH et les nutriments du sol',
        'soil-tip-2': '• Ajoutez du compost organique annuellement',
        'soil-tip-3': '• Assurez un drainage approprié',
        'soil-tip-4': '• Enlevez les mauvaises herbes et débris',
        
        // Composting Guide
        'composting-guide-title': 'Bases du Compostage',
        'composting-guide-desc': 'Créez du compost riche en nutriments pour votre jardin naturellement.',
        'composting-guide-tips': 'Méthodes Essentielles:',
        'composting-tip-1': '• Équilibrez les matières vertes et brunes',
        'composting-tip-2': '• Retournez le tas toutes les 2-3 semaines',
        'composting-tip-3': '• Maintenez une humidité appropriée',
        'composting-tip-4': '• Surveillez les niveaux de température',
        
        // Pruning Guide
        'pruning-guide-title': 'Techniques de Taille',
        'pruning-guide-desc': 'Maîtrisez la taille appropriée pour des plantes plus saines et productives.',
        'pruning-guide-tips': 'Meilleures Pratiques:',
        'pruning-tip-1': '• Utilisez des outils propres et tranchants',
        'pruning-tip-2': '• Taillez à la bonne saison',
        'pruning-tip-3': '• Enlevez le bois mort et malade',
        'pruning-tip-4': '• Faites des coupes nettes et angulaires',
        
        // Garden Styles
        'garden-styles-title': 'Découvrez les Styles de Jardin',
        'garden-styles-intro': 'Explorez différentes approches de jardinage et trouvez le style parfait pour votre espace, climat et style de vie.',
        
        // Expandable content buttons
        'click-more-content': 'Cliquez pour plus de contenu',
        'click-hide-content': 'Cliquez pour masquer le contenu',
        
        'container-gardening-title': 'Jardinage en Contenants',
        'container-gardening-desc': 'Parfait pour les petits espaces, patios et débutants. Cultivez des plantes incroyables dans des pots, jardinières et contenants.',
        'container-guidelines': 'Directives Essentielles:',
        'container-tip-1': '• Choisissez des contenants avec des trous de drainage',
        'container-tip-2': '• Utilisez un mélange de terreau de qualité, pas de terre de jardin',
        'container-tip-3': '• Arrosez plus fréquemment que les plantes en pleine terre',
        'container-tip-4': '• Considérez la taille de la plante à maturité',
        
        'vertical-gardening-title': 'Jardinage Vertical',
        'vertical-gardening-desc': 'Maximisez votre espace de culture en allant vertical. Parfait pour les environnements urbains et les petites zones.',
        'vertical-principles': 'Principes Clés:',
        'vertical-tip-1': '• Assurez un support structurel approprié',
        'vertical-tip-2': '• Planifiez un éclairage adéquat',
        'vertical-tip-3': '• Installez des systèmes d\'irrigation efficaces',
        'vertical-tip-4': '• Choisissez un milieu de culture léger',
        
        'hydroponic-gardening-title': 'Jardinage Hydroponique',
        'hydroponic-gardening-desc': 'Culture sans sol utilisant des solutions d\'eau riches en nutriments. Croissance rapide et rendements élevés toute l\'année.',
        'hydroponic-getting-started': 'Pour Commencer:',
        'hydroponic-tip-1': '• Commencez avec des systèmes simples comme DWC',
        'hydroponic-tip-2': '• Surveillez les niveaux de pH et nutriments',
        'hydroponic-tip-3': '• Fournissez un éclairage de culture adéquat',
        'hydroponic-tip-4': '• Commencez avec des légumes verts et herbes',
        
        'permaculture-title': 'Permaculture',
        'permaculture-desc': 'Principes de conception durable qui travaillent avec la nature pour créer des systèmes productifs et auto-entretenus.',
        'permaculture-principles': 'Principes Fondamentaux:',
        'permaculture-tip-1': '• Prendre soin de la terre et des gens',
        'permaculture-tip-2': '• Concevoir pour l\'efficacité énergétique',
        'permaculture-tip-3': '• Utiliser des ressources renouvelables',
        'permaculture-tip-4': '• Créer des relations bénéfiques',
        
        'shade-gardens-title': 'Jardins d\'Ombre',
        'shade-gardens-desc': 'Transformez les zones ombragées en jardins luxuriants et beaux avec la bonne sélection et conception de plantes.',
        'shade-types': 'Types d\'Ombre:',
        'shade-tip-1': '• Ombre partielle: 3-6 heures de soleil',
        'shade-tip-2': '• Ombre complète: Moins de 3 heures',
        'shade-tip-3': '• Ombre tachetée: Lumière solaire filtrée',
        'shade-tip-4': '• Choisissez des plantes qui aiment l\'ombre',
        
        'indoor-gardening-title': 'Jardinage d\'Intérieur',
        'indoor-gardening-desc': 'Amenez la nature à l\'intérieur avec des plantes d\'intérieur, herbes et légumes qui prospèrent dans les environnements intérieurs.',
        'indoor-success': 'Facteurs de Succès:',
        'indoor-tip-1': '• Fournissez des sources de lumière adéquates',
        'indoor-tip-2': '• Maintenez des niveaux d\'humidité appropriés',
        'indoor-tip-3': '• Assurez une bonne circulation d\'air',
        'indoor-tip-4': '• Choisissez des variétés de plantes appropriées',
        
        // Garden Styles Expanded Content Titles
        'container-best-plants-title': 'Meilleures Plantes pour Conteneurs:',
        'container-types-title': 'Types de Conteneurs:',
        'vertical-systems-title': 'Types de Systèmes Verticaux:',
        'vertical-perfect-plants-title': 'Plantes Parfaites:',
        'hydroponic-systems-title': 'Types de Systèmes:',
        'hydroponic-equipment-title': 'Équipement Nécessaire:',
        'permaculture-design-title': 'Éléments de Conception:',
        'permaculture-benefits-title': 'Avantages:',
        'shade-plants-title': 'Plantes qui Aiment l\'Ombre:',
        'shade-design-title': 'Conseils de Conception:',
        'indoor-plants-title': 'Plantes d\'Intérieur Faciles:',
        'indoor-conditions-title': 'Conditions de Croissance:',
        
        // Garden Styles Expanded Content
        // Container Gardening Content
        'container-herbs': '• Herbes: Basilic, romarin, thym, persil',
        'container-vegetables': '• Légumes: Tomates, poivrons, laitue, haricots',
        'container-flowers': '• Fleurs: Pétunias, soucis, pensées',
        'container-fruits': '• Fruits: Fraises, agrumes nains',
        'container-terracotta': '• Terre cuite: Bon drainage, aspect classique',
        'container-plastic': '• Plastique: Léger, retient l\'humidité',
        'container-ceramic': '• Céramique: Beau mais lourd',
        'container-wood': '• Bois: Aspect naturel, bonne isolation',
        
        // Vertical Gardening Content
        'vertical-living-walls': '• Murs végétaux: Systèmes de culture basés sur le sol',
        'vertical-hydroponic-towers': '• Tours hydroponiques: Systèmes verticaux sans sol',
        'vertical-pocket-planters': '• Jardinières à poches: Sacs en tissu ou plastique',
        'vertical-trellis-systems': '• Systèmes de treillis: Support pour plantes grimpantes',
        'vertical-climbing-vines': '• Vignes grimpantes: Pois, haricots, concombres',
        'vertical-trailing-plants': '• Plantes retombantes: Fraises, capucines',
        'vertical-compact-vegetables': '• Légumes compacts: Laitue, épinards, herbes',
        
        // Hydroponic Gardening Content
        'hydroponic-dwc': '• DWC (Culture en Eau Profonde): Racines dans solution nutritive',
        'hydroponic-nft': '• NFT (Technique du Film Nutritif): Film mince de nutriments',
        'hydroponic-ebb-flow': '• Va-et-vient: Système d\'inondation périodique',
        'hydroponic-aeroponic': '• Aéroponique: Racines suspendues dans l\'air, vaporisées',
        'hydroponic-containers': '• Contenants de culture et milieu de croissance',
        'hydroponic-pumps': '• Pompes à eau et à air',
        'hydroponic-testing': '• Kits de test pH et nutriments',
        'hydroponic-lights': '• Éclairage LED de croissance pour systèmes intérieurs',
        
        // Permaculture Content
        'permaculture-food-forests': '• Forêts alimentaires: Systèmes de culture multi-couches',
        'permaculture-water-harvesting': '• Récupération d\'eau: Collecte et gestion de pluie',
        'permaculture-companion-planting': '• Plantation associée: Plantes mutuellement bénéfiques',
        'permaculture-pest-management': '• Gestion naturelle des parasites: Équilibre écologique',
        'permaculture-low-maintenance': '• Maintenance réduite au fil du temps',
        'permaculture-soil-health': '• Amélioration de la santé du sol et biodiversité',
        'permaculture-resilient': '• Résistant aux variations climatiques',
        'permaculture-productive': '• Produit nourriture, médecine et matériaux',
        
        // Shade Gardens Content
        'shade-hostas': '• Hostas: Feuillage dramatique en nombreuses variétés',
        'shade-ferns': '• Fougères: Plantes de texture ancienne et élégante',
        'shade-impatiens': '• Impatiens: Fleurs annuelles colorées',
        'shade-astilbe': '• Astilbe: Plumes vaporeuses de fleurs',
        'shade-heuchera': '• Heuchera: Vivaces à feuillage coloré',
        'shade-light-plants': '• Utiliser des plantes claires pour éclaircir les zones sombres',
        'shade-paths-seating': '• Ajouter des sentiers et sièges pour l\'agrément',
        'shade-layer-height': '• Étager les plantes par hauteur pour la profondeur',
        'shade-fragrant-plants': '• Inclure des plantes parfumées pour l\'attrait sensoriel',
        
        // Indoor Gardening Content
        'indoor-pothos': '• Pothos: Vigne à faible entretien',
        'indoor-snake-plant': '• Plante serpent: Tolère la faible lumière',
        'indoor-spider-plant': '• Plante araignée: Facile à propager',
        'indoor-peace-lily': '• Lys de la paix: Belles fleurs',
        'indoor-herbs': '• Herbes: Basilic, menthe, persil',
        'indoor-light': '• Lumière: Fenêtres orientées sud ou éclairage de croissance',
        'indoor-temperature': '• Température: La plupart des plantes préfèrent 18-24°C',
        'indoor-humidity': '• Humidité: Utiliser humidificateurs ou plateaux de galets',
        'indoor-soil': '• Sol: Utiliser des mélanges de rempotage de qualité',
        
        // Plant Care
        'plant-care-title': 'Soin Expert des Plantes',
        'plant-care-intro': 'Maîtrisez les fondamentaux du soin des plantes avec nos guides complets couvrant l\'arrosage, le contrôle des parasites et la gestion des maladies.',
        'watering-guide-title': 'Guide d\'Arrosage',
        'watering-intro': 'Maîtrisez l\'art de l\'hydratation appropriée des plantes avec ces techniques essentielles:',
        'watering-tip-1': '• Vérifiez l\'humidité du sol avant d\'arroser',
        'watering-tip-2': '• Arrosez profondément mais moins fréquemment',
        'watering-tip-3': '• L\'arrosage matinal est généralement meilleur',
        'watering-tip-4': '• Ajustez la fréquence selon la saison et la météo',
        'watering-expand-btn': 'Cliquez pour plus de contenu',
        'watering-signs-title': 'Signes de Problèmes d\'Arrosage:',
        'watering-overwater': '• Surarrosage: Feuilles jaunes, pourriture des racines, croissance fongique',
        'watering-underwater': '• Sous-arrosage: Flétrissement, sol sec, bords de feuilles bruns',
        
        'pest-control-title': 'Contrôle des Parasites',
        'pest-intro': 'Protégez vos plantes des parasites communs avec des stratégies de gestion intégrée:',
        'pest-tip-1': '• Inspection régulière et détection précoce',
        'pest-tip-2': '• Encouragez les insectes bénéfiques',
        'pest-tip-3': '• Utilisez des traitements biologiques quand possible',
        'pest-tip-4': '• Maintenez la santé des plantes pour la résistance',
        'pest-expand-btn': 'Cliquez pour plus de contenu',
        'pest-common-title': 'Parasites Communs du Jardin:',
        'pest-aphids': '• Pucerons: Petits insectes à corps mou sur nouvelle croissance',
        'pest-spider-mites': '• Acariens: Petits parasites causant des feuilles tachetées',
        'pest-whiteflies': '• Mouches blanches: Petits insectes volants blancs',
        
        'disease-mgmt-title': 'Gestion des Maladies',
        'disease-intro': 'Prévenez et traitez les maladies des plantes avec des techniques de gestion appropriées:',
        'disease-tip-1': '• Assurez une circulation d\'air appropriée',
        'disease-tip-2': '• Évitez l\'arrosage par le haut',
        'disease-tip-3': '• Enlevez le matériel végétal infecté',
        'disease-tip-4': '• Choisissez des variétés résistantes aux maladies',
        'disease-expand-btn': 'Cliquez pour plus de contenu',
        'disease-common-title': 'Maladies Communes des Plantes:',
        'disease-powdery-mildew': '• Oïdium: Revêtement poudreux blanc sur les feuilles',
        'disease-black-spot': '• Tache noire: Taches sombres sur feuilles et tiges',
        'disease-root-rot': '• Pourriture des racines: Racines molles et sombres par surarrosage',

        // Seasonal Tips
        'seasonal-tips-title': 'Conseils de Jardinage Saisonnier',
        'seasonal-tips-intro': 'Découvrez des conseils spécifiques à chaque saison pour maintenir votre jardin prospère toute l\'année avec notre calendrier complet de jardinage saisonnier.',
        
        'spring-title': 'Printemps',
        'spring-period': 'Mars - Mai',
        'spring-description': 'La saison du renouveau et de la croissance. Préparez votre jardin pour la saison de croissance à venir.',
        'spring-tasks-title': 'Tâches Clés:',
        'spring-task-1': 'Commencer les graines à l\'intérieur pour les cultures de saison chaude',
        'spring-task-2': 'Préparer les plates-bandes et ajouter du compost',
        'spring-task-3': 'Tailler les arbres fruitiers et arbustes à fleurs',
        'spring-task-4': 'Commencer la surveillance des parasites et maladies',
        
        'summer-title': 'Été',
        'summer-period': 'Juin - Août',
        'summer-description': 'Saison de croissance maximale avec des récoltes abondantes. Concentrez-vous sur l\'entretien et la gestion de l\'eau.',
        'summer-tasks-title': 'Tâches Clés:',
        'summer-task-1': 'Arrosage profond pendant les périodes chaudes et sèches',
        'summer-task-2': 'Récolter les légumes à maturité optimale',
        'summer-task-3': 'Enlever les fleurs fanées pour encourager la floraison',
        'summer-task-4': 'Surveiller et traiter les infestations de parasites',
        
        'autumn-title': 'Automne',
        'autumn-period': 'Septembre - Novembre',
        'autumn-description': 'Temps de récolte et de préparation pour l\'hiver. Concentrez-vous sur le nettoyage et la protection.',
        'autumn-tasks-title': 'Tâches Clés:',
        'autumn-task-1': 'Récolter les cultures restantes avant le gel',
        'autumn-task-2': 'Planter les bulbes qui fleurissent au printemps',
        'autumn-task-3': 'Nettoyer les feuilles tombées et débris',
        'autumn-task-4': 'Protéger les plantes tendres du froid',
        
        'winter-title': 'Hiver',
        'winter-period': 'Décembre - Février',
        'winter-description': 'Saison de planification et de protection. Concentrez-vous sur la culture intérieure et la planification du jardin.',
        'winter-tasks-title': 'Tâches Clés:',
        'winter-task-1': 'Planifier l\'aménagement du jardin de l\'année prochaine',
        'winter-task-2': 'Commander graines et catalogues de plantes',
        'winter-task-3': 'Entretenir plantes d\'intérieur et herbes d\'intérieur',
        'winter-task-4': 'Vérifier et entretenir les outils de jardin',
        
        // Membership
        'membership-title': 'Choisissez Votre Voyage de Jardinage',
        'membership-intro': 'Obtenez des conseils d\'experts, un diagnostic IA des plantes et des fonctionnalités premium pour faire passer votre jardinage au niveau supérieur',
        
        'basic-membership-name': 'Adhésion de Base',
        'basic-membership-subtitle': 'Parfait pour les débutants en jardinage',
        'basic-monthly-title': 'Plan Mensuel',
        'basic-yearly-title': 'Plan Annuel',
        'basic-save-badge': 'Économisez 20%',
        'basic-feature-1': 'Remises pour membres',
        'basic-feature-2': 'Newsletter hebdomadaire',
        'basic-feature-3': 'Identification de base des plantes',
        'basic-feature-4': 'Accès au forum communautaire',
        
        'green-thumb-name': 'Adhésion Pouce Vert',
        'green-thumb-subtitle': 'Pour les jardiniers sérieux et les passionnés de plantes',
        'green-thumb-monthly-title': 'Plan Mensuel',
        'green-thumb-yearly-title': 'Plan Annuel',
        'green-thumb-save-badge': 'Économisez 20%',
        'most-popular-badge': 'Plus Populaire',
        'green-thumb-feature-1': 'Tout dans le Plan de Base',
        'green-thumb-feature-2': 'Planification de jardin IA et insights',
        'green-thumb-feature-3': 'Consultations et support d\'experts',
        'green-thumb-feature-4': 'IA avancée d\'identification des maladies',
        'green-thumb-feature-5': 'Calendriers spécifiques à la localisation',
        
        // Newsletter
        'newsletter-title': 'Rejoignez Notre Communauté de Jardin',
        'newsletter-description': 'Recevez des conseils de jardinage hebdomadaires, des astuces saisonnières et du contenu exclusif dans votre boîte de réception.',
        'newsletter-submit-btn': 'S\'abonner Gratuitement',
        
        // Plant Doctor
        'plant-doctor-title': 'Docteur de Plantes - Analyse IA de Plantes',
        'plant-doctor-description': 'Téléchargez ou prenez une photo de votre plante pour une analyse IA instantanée et des recommandations expertes.',
        'free-analysis-counter': '3 analyses gratuites par jour',
        'analysis-left': 'restantes',
        'no-analysis-left': 'Aucune analyse gratuite restante aujourd\'hui',
        'upgrade-basic-prompt': 'Passez à l\'Adhésion de Base (4,99$/mois) pour l\'identification et l\'analyse illimitée des plantes.',
        'upgrade-now': 'Mettre à Niveau Maintenant',
        'maybe-later': 'Peut-être plus tard',
        
        'stat-plants-analyzed': 'Plantes Analysées',
        'stat-accuracy-rate': 'Taux de Précision',
        'stat-instant-analysis': 'Analyse Instantanée',
        
        'upload-title': 'Glissez et déposez votre photo de plante ici',
        'upload-description': 'ou cliquez pour sélectionner depuis votre appareil',
        'upload-file-btn': 'Télécharger Fichier',
        'take-photo-btn': 'Prendre Photo',
        'analyze-btn': 'Analyser Plante',
        
        // Plant identification step
        'identification-title': 'Identification de Plante',
        'identified-plant': 'Nous avons identifié votre plante comme:',
        'plant-name-label': 'Nom de la Plante:',
        'is-this-correct': 'Cette identification est-elle correcte?',
        'yes-correct': 'Oui, c\'est correct',
        'no-incorrect': 'Non, c\'est incorrect',
        'provide-plant-name': 'Veuillez fournir le nom correct de la plante:',
        'continue-analysis': 'Continuer vers l\'Analyse des Maladies',
        
        'analysis-complete-title': 'Analyse Terminée!',
        'analysis-plant-name': 'Rose (Rosa)',
        'analysis-health-title': 'État de Santé:',
        'analysis-health-status': 'Votre plante semble être en excellente santé!',
        'analysis-recommendations-title': 'Recommandations:',
        'analysis-rec-1': '• Arrosez régulièrement mais évitez le surarrosage',
        'analysis-rec-2': '• Assurez un bon drainage',
        'analysis-rec-3': '• Fournissez 6-8 heures de lumière solaire quotidienne',
        'analysis-confidence': 'Confiance: 98% - Analyse basée sur la qualité d\'image et les caractéristiques de plante.',
        'analyze-another-btn': 'Analyser Une Autre Plante',
        
        // Footer
        'footer-description': 'Votre compagnon de confiance pour un jardinage réussi. Des conseils pour débutants aux techniques avancées, nous vous aidons à cultiver le jardin de vos rêves.',
        'footer-quick-links-title': 'Liens Rapides',
        'footer-home': 'Accueil',
        'footer-garden-styles': 'Styles de Jardin',
        'footer-plant-care': 'Soin des Plantes',
        'footer-plant-doctor': 'Docteur de Plantes',
        'footer-contact-title': 'Prendre Contact',
        'footer-contact-description': 'Rejoignez notre communauté de jardiniers passionnés et commencez votre voyage vers le succès en jardinage aujourd\'hui.',
        'footer-copyright': '© 2025 Garden with Serge. Tous droits réservés.'
    },
    
    de: {
    // Navigation
    'nav-home': 'Startseite',
    'nav-garden-styles': 'Gartenstile',
    'nav-plant-care': 'Pflanzenpflege',
    'nav-seasonal-tips': 'Saisonale Tipps',
    'nav-membership': 'Mitgliedschaft',
    'nav-newsletter': 'Newsletter',
    'nav-plant-doctor': 'Pflanzen-Dr.',
    'nav-garden-guides': 'Gartenratgeber',
    'garden-guides-title': 'Wesentliche Gartenanleitungen',
    'remove-image': 'Bild entfernen',
	'nav-member-login': 'Mitglieder Login',
	'mobile-nav-member-login': 'Mitglieder Login',
	'footer-facebook-cta': 'Folge uns auf Facebook',
	'footer-facebook-link': 'Folge uns auf Facebook',
	'footer-facebook-url': 'https://www.facebook.com/profile.php?id=61576359017023',
soil-guide-title-full: 'Kompletter Leitfaden zur Bodenvorbereitung',
soil-guide-body: `
  <h2>Schritt 1 – Boden testen</h2>
  <p>Verwenden Sie einen pH-Test oder ein Labor. Ideal ist pH 6–7.</p>
  <h2>Schritt 2 – Organische Substanz einarbeiten</h2>
  <p>Mischen Sie 5–7 cm Kompost oder reifen Stallmist ein.</p>
  <h2>Schritt 3 – Drainage verbessern</h2>
  <p>Bei schwerem Ton: grober Sand und Gips; bei Sandboden: Kompost und Torf.</p>
`,

compost-guide-title-full: 'Kompletter Leitfaden zur Kompostierung',
compost-guide-body: `
  <h2>Schritt 1 – Grün und Braun ausbalancieren</h2>
  <p>Grün = stickstoffreich (Küchenabfälle, Rasenschnitt). Braun = kohlenstoffreich (Laub, Karton).</p>
  <h2>Schritt 2 – Haufen aufbauen</h2>
  <p>5–7 cm Schichten abwechseln, alle paar Lagen eine Schaufel Erde dazwischen.</p>
  <h2>Schritt 3 – Pflege</h2>
  <p>Feucht wie ein ausgewrungener Schwamm halten, wöchentlich wenden.</p>
`,

pruning-guide-title-full: 'Kompletter Leitfaden zur Schnitttechnik',
pruning-guide-body: `
  <h2>Schritt 1 – Richtigen Zeitpunkt wählen</h2>
  <p>Frühlingsblüher = nach der Blüte, Sommerblüher = Ende Winter.</p>
  <h2>Schritt 2 – Sauber schneiden</h2>
  <p>6 mm über einer Knospe, 45°-Winkel, nach außen geneigt.</p>
  <h2>Schritt 3 – Die 3 D entfernen</h2>
  <p>Totes, beschädigtes und krankes Holz zuerst, dann lichten für Durchlüftung.</p>
`,
soil-guide-title-full: 'Kompletter Leitfaden zur Bodenvorbereitung',
soil-guide-body: `
  <h2>Schritt 1 – Boden testen</h2>
  <p>Verwenden Sie einen pH-Test oder ein Labor. Ideal ist pH 6–7.</p>
  <h2>Schritt 2 – Organische Substanz einarbeiten</h2>
  <p>Mischen Sie 5–7 cm Kompost oder reifen Stallmist ein.</p>
  <h2>Schritt 3 – Drainage verbessern</h2>
  <p>Bei schwerem Ton: grober Sand und Gips; bei Sandboden: Kompost und Torf.</p>
`,

compost-guide-title-full: 'Kompletter Leitfaden zur Kompostierung',
compost-guide-body: `
  <h2>Schritt 1 – Grün und Braun ausbalancieren</h2>
  <p>Grün = stickstoffreich (Küchenabfälle, Rasenschnitt). Braun = kohlenstoffreich (Laub, Karton).</p>
  <h2>Schritt 2 – Haufen aufbauen</h2>
  <p>5–7 cm Schichten abwechseln und jede paar Lagen eine Schaufel Erde dazwischen.</p>
  <h2>Schritt 3 – Pflege</h2>
  <p>Feucht wie ein ausgewrungener Schwamm halten und wöchentlich wenden.</p>
`,

pruning-guide-title-full: 'Kompletter Leitfaden zur Schnitttechnik',
pruning-guide-body: `
  <h2>Schritt 1 – Richtigen Zeitpunkt wählen</h2>
  <p>Frühlingsblüher = nach der Blüte; Sommerblüher = Ende Winter.</p>
  <h2>Schritt 2 – Sauber schneiden</h2>
  <p>6 mm über einer Knospe, 45°-Winkel, nach außen geneigt.</p>
  <h2>Schritt 3 – Die 3 D entfernen</h2>
  <p>Totes, beschädigtes und krankes Holz zuerst, dann lichten für Belüftung.</p>
`,
	
	

    // Mobile navigation
    'mobile-nav-home': 'Startseite',
    'mobile-nav-garden-styles': 'Gartenstile',
    'mobile-nav-plant-care': 'Pflanzenpflege',
    'mobile-nav-seasonal-tips': 'Saisonale Tipps',
    'mobile-nav-membership': 'Mitgliedschaft',
    'mobile-nav-newsletter': 'Newsletter',
    'mobile-nav-garden-guides': 'Gartenratgeber',
    'mobile-nav-plant-doctor': 'Pflanzen-Dr.',
	

        
        // Hero Section
        'hero-title': 'Kostenloser KI-Pflanzendoktor - Sofortige Krankheitsdiagnose',
        'hero-description': 'Erhalten Sie sofortige, genaue Pflanzenkriankheitsdiagnosen powered by KI. Laden Sie ein Foto hoch und erhalten Sie Expertenanalyse in Sekunden.',
        'partnership-badge': 'Professionelles Partnerschaftsprogramm',
        'btn-try-plant-doctor': 'Pflanzendoktor Kostenlos Testen',
        'btn-explore-guides': 'Gartenanleitungen Erkunden',
        
        // Statistics
        'stat-plants-diagnosed': 'Pflanzen Diagnostiziert',
        'stat-accuracy': 'Genauigkeitsrate',
        'stat-available': 'Verfügbar',
        'stat-analysis': 'Pflanzenanalyse',
        
        // Garden Guides Section
        'garden-guides-title': 'Wesentliche Gartenanleitungen',
        'garden-guides-intro': 'Umfassende Anleitungen, um Ihnen in allen Aspekten der Gartenarbeit zum Erfolg zu verhelfen, von Grundtechniken bis zu fortgeschrittenen Methoden.',
        
        // Soil Preparation Guide
        'soil-guide-title': 'Bodenvorbereitung',
        'soil-guide-desc': 'Lernen Sie die Grundlagen gesunden Bodens für gedeihende Pflanzen.',
        'soil-guide-tips': 'Wichtige Schritte:',
        'soil-tip-1': '• Boden-pH und Nährstoffe testen',
        'soil-tip-2': '• Jährlich organischen Kompost hinzufügen',
        'soil-tip-3': '• Ordnungsgemäße Entwässerung sicherstellen',
        'soil-tip-4': '• Unkraut und Ablagerungen entfernen',
        
        // Composting Guide
        'composting-guide-title': 'Kompostierung Grundlagen',
        'composting-guide-desc': 'Erstellen Sie nährstoffreichen Kompost für Ihren Garten auf natürliche Weise.',
        'composting-guide-tips': 'Wesentliche Methoden:',
        'composting-tip-1': '• Grüne und braune Materialien ausbalancieren',
        'composting-tip-2': '• Haufen alle 2-3 Wochen wenden',
        'composting-tip-3': '• Ordnungsgemäße Feuchtigkeit aufrechterhalten',
        'composting-tip-4': '• Temperaturniveaus überwachen',
        
        // Pruning Guide
        'pruning-guide-title': 'Schnitttechniken',
        'pruning-guide-desc': 'Meistern Sie ordnungsgemäßes Schneiden für gesündere, produktivere Pflanzen.',
        'pruning-guide-tips': 'Beste Praktiken:',
        'pruning-tip-1': '• Saubere, scharfe Werkzeuge verwenden',
        'pruning-tip-2': '• Zur richtigen Jahreszeit schneiden',
        'pruning-tip-3': '• Totes und krankes Holz entfernen',
        'pruning-tip-4': '• Saubere, abgewinkelte Schnitte machen',
        
        // Garden Styles
        'garden-styles-title': 'Gartenstile Entdecken',
        'garden-styles-intro': 'Erkunden Sie verschiedene Gartenansätze und finden Sie den perfekten Stil für Ihren Raum, Ihr Klima und Ihren Lebensstil.',
        
        // Expandable content buttons
        'click-more-content': 'Klicken für mehr Inhalt',
        'click-hide-content': 'Klicken zum Verstecken',
        
        'container-gardening-title': 'Containergärtnerei',
        'container-gardening-desc': 'Perfekt für kleine Räume, Terrassen und Anfänger. Züchten Sie erstaunliche Pflanzen in Töpfen, Pflanzgefäßen und Containern.',
        'container-guidelines': 'Wesentliche Richtlinien:',
        'container-tip-1': '• Container mit Drainagelöchern wählen',
        'container-tip-2': '• Qualitäts-Blumenerde verwenden, nicht Gartenerde',
        'container-tip-3': '• Häufiger gießen als Bodenpflanzen',
        'container-tip-4': '• Pflanzengröße bei Reife berücksichtigen',
        
        'vertical-gardening-title': 'Vertikale Gärtnerei',
        'vertical-gardening-desc': 'Maximieren Sie Ihren Wachstumsraum durch vertikales Gehen. Perfekt für städtische Umgebungen und kleine Bereiche.',
        'vertical-principles': 'Schlüsselprinzipien:',
        'vertical-tip-1': '• Ordnungsgemäße strukturelle Unterstützung sicherstellen',
        'vertical-tip-2': '• Angemessene Beleuchtung planen',
        'vertical-tip-3': '• Effiziente Bewässerungssysteme installieren',
        'vertical-tip-4': '• Leichtes Wachstumsmedium wählen',
        
        'hydroponic-gardening-title': 'Hydroponische Gärtnerei',
        'hydroponic-gardening-desc': 'Bodenfreier Anbau mit nährstoffreichen Wasserlösungen. Schnelles Wachstum und hohe Erträge ganzjährig.',
        'hydroponic-getting-started': 'Erste Schritte:',
        'hydroponic-tip-1': '• Mit einfachen Systemen wie DWC beginnen',
        'hydroponic-tip-2': '• pH- und Nährstoffniveaus überwachen',
        'hydroponic-tip-3': '• Angemessene Wachstumsbeleuchtung bereitstellen',
        'hydroponic-tip-4': '• Mit Blattgemüse und Kräutern beginnen',
        
        'permaculture-title': 'Permakultur',
        'permaculture-desc': 'Nachhaltige Designprinzipien, die mit der Natur arbeiten, um produktive, selbsterhaltende Systeme zu schaffen.',
        'permaculture-principles': 'Kernprinzipien:',
        'permaculture-tip-1': '• Für Erde und Menschen sorgen',
        'permaculture-tip-2': '• Für Energieeffizienz entwerfen',
        'permaculture-tip-3': '• Erneuerbare Ressourcen nutzen',
        'permaculture-tip-4': '• Vorteilhafte Beziehungen schaffen',
        
        'shade-gardens-title': 'Schattengärten',
        'shade-gardens-desc': 'Verwandeln Sie schattige Bereiche in üppige, schöne Gärten mit der richtigen Pflanzenauswahl und -gestaltung.',
        'shade-types': 'Schattentypen:',
        'shade-tip-1': '• Teilschatten: 3-6 Stunden Sonnenlicht',
        'shade-tip-2': '• Vollschatten: Weniger als 3 Stunden',
        'shade-tip-3': '• Gesprenkelter Schatten: Gefiltertes Sonnenlicht',
        'shade-tip-4': '• Schattenliebende Pflanzen wählen',
        
        'indoor-gardening-title': 'Innengärtnerei',
        'indoor-gardening-desc': 'Bringen Sie die Natur ins Haus mit Zimmerpflanzen, Kräutern und Gemüse, die in Innenumgebungen gedeihen.',
        'indoor-success': 'Erfolgsfaktoren:',
        'indoor-tip-1': '• Angemessene Lichtquellen bereitstellen',
        'indoor-tip-2': '• Ordnungsgemäße Feuchtigkeitsniveaus aufrechterhalten',
        'indoor-tip-3': '• Gute Luftzirkulation sicherstellen',
        'indoor-tip-4': '• Geeignete Pflanzensorten wählen',
        
        // Garden Styles Expanded Content Titles
        'container-best-plants-title': 'Beste Pflanzen für Container:',
        'container-types-title': 'Container-Typen:',
        'vertical-systems-title': 'Vertikale Systemtypen:',
        'vertical-perfect-plants-title': 'Perfekte Pflanzen:',
        'hydroponic-systems-title': 'Systemtypen:',
        'hydroponic-equipment-title': 'Benötigte Ausrüstung:',
        'permaculture-design-title': 'Design-Elemente:',
        'permaculture-benefits-title': 'Vorteile:',
        'shade-plants-title': 'Schattenliebende Pflanzen:',
        'shade-design-title': 'Design-Tipps:',
        'indoor-plants-title': 'Einfache Zimmerpflanzen:',
        'indoor-conditions-title': 'Wachstumsbedingungen:',
        
        // Garden Styles Expanded Content
        // Container Gardening Content
        'container-herbs': '• Kräuter: Basilikum, Rosmarin, Thymian, Petersilie',
        'container-vegetables': '• Gemüse: Tomaten, Paprika, Salat, Bohnen',
        'container-flowers': '• Blumen: Petunien, Ringelblumen, Stiefmütterchen',
        'container-fruits': '• Früchte: Erdbeeren, Zwerg-Zitrusbäume',
        'container-terracotta': '• Terrakotta: Gute Drainage, klassisches Aussehen',
        'container-plastic': '• Kunststoff: Leicht, behält Feuchtigkeit',
        'container-ceramic': '• Keramik: Schön aber schwer',
        'container-wood': '• Holz: Natürliches Aussehen, gute Isolierung',
        
        // Vertical Gardening Content
        'vertical-living-walls': '• Lebende Wände: Bodenbasierte Anbausysteme',
        'vertical-hydroponic-towers': '• Hydroponische Türme: Bodenlose vertikale Systeme',
        'vertical-pocket-planters': '• Taschenpflanzgefäße: Stoff- oder Plastikbeutel',
        'vertical-trellis-systems': '• Spalier-Systeme: Unterstützung für Kletterpflanzen',
        'vertical-climbing-vines': '• Kletterpflanzen: Erbsen, Bohnen, Gurken',
        'vertical-trailing-plants': '• Hängende Pflanzen: Erdbeeren, Kapuzinerkresse',
        'vertical-compact-vegetables': '• Kompaktes Gemüse: Salat, Spinat, Kräuter',
        
        // Hydroponic Gardening Content
        'hydroponic-dwc': '• DWC (Deep Water Culture): Wurzeln in Nährlösung',
        'hydroponic-nft': '• NFT (Nährstoff-Film-Technik): Dünner Nährstofffilm',
        'hydroponic-ebb-flow': '• Ebbe und Flut: Periodisches Überflutungssystem',
        'hydroponic-aeroponic': '• Aeroponik: Wurzeln in Luft hängend, vernebelt',
        'hydroponic-containers': '• Anbaubehälter und Wachstumsmedium',
        'hydroponic-pumps': '• Wasser- und Luftpumpen',
        'hydroponic-testing': '• pH- und Nährstoff-Testkits',
        'hydroponic-lights': '• LED-Wachstumslampen für Innensysteme',
        
        // Permaculture Content
        'permaculture-food-forests': '• Nahrungswälder: Mehrschichtige Anbausysteme',
        'permaculture-water-harvesting': '• Wassersammlung: Regensammlung und -management',
        'permaculture-companion-planting': '• Mischkultur: Gegenseitig vorteilhafte Pflanzen',
        'permaculture-pest-management': '• Natürliches Schädlingsmanagement: Ökologisches Gleichgewicht',
        'permaculture-low-maintenance': '• Reduzierte Wartung über die Zeit',
        'permaculture-soil-health': '• Verbesserte Bodengesundheit und Biodiversität',
        'permaculture-resilient': '• Widerstandsfähig gegen Klimaschwankungen',
        'permaculture-productive': '• Produziert Nahrung, Medizin und Materialien',
        
        // Shade Gardens Content
        'shade-hostas': '• Hostas: Dramatisches Laub in vielen Sorten',
        'shade-ferns': '• Farne: Uralte, elegante Texturpflanzen',
        'shade-impatiens': '• Fleißige Lieschen: Bunte einjährige Blumen',
        'shade-astilbe': '• Prachtspiere: Federige Blütenrispen',
        'shade-heuchera': '• Purpurglöckchen: Bunte Laubstauden',
        'shade-light-plants': '• Helle Pflanzen verwenden, um dunkle Bereiche aufzuhellen',
        'shade-paths-seating': '• Wege und Sitzgelegenheiten für Genuss hinzufügen',
        'shade-layer-height': '• Pflanzen nach Höhe schichten für Tiefe',
        'shade-fragrant-plants': '• Duftpflanzen für sinnlichen Reiz einbeziehen',
        
        // Indoor Gardening Content
        'indoor-pothos': '• Efeutute: Pflegeleichte Kletterpflanze',
        'indoor-snake-plant': '• Bogenhanf: Verträgt wenig Licht',
        'indoor-spider-plant': '• Grünlilie: Einfach zu vermehren',
        'indoor-peace-lily': '• Friedenslilie: Schöne Blüten',
        'indoor-herbs': '• Kräuter: Basilikum, Minze, Petersilie',
        'indoor-light': '• Licht: Südfenster oder Wachstumslampen',
        'indoor-temperature': '• Temperatur: Meiste Pflanzen bevorzugen 18-24°C',
        'indoor-humidity': '• Luftfeuchtigkeit: Luftbefeuchter oder Kieselschalen verwenden',
        'indoor-soil': '• Erde: Hochwertige Blumenerde verwenden',
        
        // Plant Care
        'plant-care-title': 'Experten-Pflanzenpflege',
        'plant-care-intro': 'Meistern Sie die Grundlagen der Pflanzenpflege mit unseren umfassenden Anleitungen zu Bewässerung, Schädlingsbekämpfung und Krankheitsmanagement.',
        'watering-guide-title': 'Bewässerungsanleitung',
        'watering-intro': 'Meistern Sie die Kunst der ordnungsgemäßen Pflanzenhydratation mit diesen wesentlichen Techniken:',
        'watering-tip-1': '• Bodenfeuchtigkeit vor dem Gießen prüfen',
        'watering-tip-2': '• Tief aber weniger häufig gießen',
        'watering-tip-3': '• Morgendliches Gießen ist meist am besten',
        'watering-tip-4': '• Häufigkeit nach Jahreszeit und Wetter anpassen',
        'watering-expand-btn': 'Klicken für mehr Inhalt',
        'watering-signs-title': 'Anzeichen von Bewässerungsproblemen:',
        'watering-overwater': '• Überwässerung: Gelbe Blätter, Wurzelfäule, Pilzwachstum',
        'watering-underwater': '• Unterwässerung: Welken, trockener Boden, braune Blattränder',
        
        'pest-control-title': 'Schädlingsbekämpfung',
        'pest-intro': 'Schützen Sie Ihre Pflanzen vor häufigen Schädlingen mit integrierten Managementstrategien:',
        'pest-tip-1': '• Regelmäßige Inspektion und frühe Erkennung',
        'pest-tip-2': '• Nützliche Insekten fördern',
        'pest-tip-3': '• Biologische Behandlungen wenn möglich verwenden',
        'pest-tip-4': '• Pflanzengesundheit für Widerstand aufrechterhalten',
        'pest-expand-btn': 'Klicken für mehr Inhalt',
        'pest-common-title': 'Häufige Gartenschädlinge:',
        'pest-aphids': '• Blattläuse: Kleine, weichkörprige Insekten an neuem Wachstum',
        'pest-spider-mites': '• Spinnmilben: Winzige Schädlinge, die gesprenkelte Blätter verursachen',
        'pest-whiteflies': '• Weiße Fliegen: Kleine weiße fliegende Insekten',
        
        'disease-mgmt-title': 'Krankheitsmanagement',
        'disease-intro': 'Verhindern und behandeln Sie Pflanzenkrankheiten mit ordnungsgemäßen Managementtechniken:',
        'disease-tip-1': '• Ordnungsgemäße Luftzirkulation sicherstellen',
        'disease-tip-2': '• Überkopfbewässerung vermeiden',
        'disease-tip-3': '• Infiziertes Pflanzenmaterial entfernen',
        'disease-tip-4': '• Krankheitsresistente Sorten wählen',
        'disease-expand-btn': 'Klicken für mehr Inhalt',
        'disease-common-title': 'Häufige Pflanzenkrankheiten:',
        'disease-powdery-mildew': '• Echter Mehltau: Weißer pudriger Belag auf Blättern',
        'disease-black-spot': '• Schwarzfleckenkrankheit: Dunkle Flecken auf Blättern und Stielen',
        'disease-root-rot': '• Wurzelfäule: Matschige, dunkle Wurzeln durch Überwässerung',

        // Seasonal Tips
        'seasonal-tips-title': 'Saisonale Gartentipps',
        'seasonal-tips-intro': 'Entdecken Sie saisonspezifische Anleitungen, um Ihren Garten das ganze Jahr über gedeihen zu lassen mit unserem umfassenden saisonalen Gartenkalender.',
        
        'spring-title': 'Frühling',
        'spring-period': 'März - Mai',
        'spring-description': 'Die Saison der Erneuerung und des Wachstums. Bereiten Sie Ihren Garten auf die kommende Wachstumssaison vor.',
        'spring-tasks-title': 'Hauptaufgaben:',
        'spring-task-1': 'Samen drinnen für Warmwetterkulturen starten',
        'spring-task-2': 'Gartenbeete vorbereiten und Kompost hinzufügen',
        'spring-task-3': 'Obstbäume und blühende Sträucher beschneiden',
        'spring-task-4': 'Schädlings- und Krankheitsüberwachung beginnen',
        
        'summer-title': 'Sommer',
        'summer-period': 'Juni - August',
        'summer-description': 'Hauptwachstumssaison mit reichlichen Ernten. Konzentrieren Sie sich auf Wartung und Wassermanagement.',
        'summer-tasks-title': 'Hauptaufgaben:',
        'summer-task-1': 'Tiefes Gießen während heißer, trockener Perioden',
        'summer-task-2': 'Gemüse bei optimaler Reife ernten',
        'summer-task-3': 'Verblühte Blüten entfernen um Blühen zu fördern',
        'summer-task-4': 'Schädlingsbefälle überwachen und behandeln',
        
        'autumn-title': 'Herbst',
        'autumn-period': 'September - November',
        'autumn-description': 'Erntezeit und Vorbereitung auf den Winter. Konzentrieren Sie sich auf Aufräumen und Schutz.',
        'autumn-tasks-title': 'Hauptaufgaben:',
        'autumn-task-1': 'Verbleibende Kulturen vor Frost ernten',
        'autumn-task-2': 'Frühjahrsblühende Zwiebeln pflanzen',
        'autumn-task-3': 'Gefallene Blätter und Ablagerungen aufräumen',
        'autumn-task-4': 'Empfindliche Pflanzen vor Kälte schützen',
        
        'winter-title': 'Winter',
        'winter-period': 'Dezember - Februar',
        'winter-description': 'Planungs- und Schutzsaison. Konzentrieren Sie sich auf Innenanbau und Gartenplanung.',
        'winter-tasks-title': 'Hauptaufgaben:',
        'winter-task-1': 'Gartenlayout des nächsten Jahres planen',
        'winter-task-2': 'Samen und Pflanzenkataloge bestellen',
        'winter-task-3': 'Zimmerpflanzen und Innenkräuter pflegen',
        'winter-task-4': 'Gartenwerkzeuge prüfen und warten',
        
        // Membership
        'membership-title': 'Wählen Sie Ihre Gartenreise',
        'membership-intro': 'Erhalten Sie Expertenberatung, KI-Pflanzendiagnose und Premium-Funktionen, um Ihre Gartenarbeit auf die nächste Stufe zu bringen',
        
        'basic-membership-name': 'Basis-Mitgliedschaft',
        'basic-membership-subtitle': 'Perfekt für Gartenanfänger',
        'basic-monthly-title': 'Monatsplan',
        'basic-yearly-title': 'Jahresplan',
        'basic-save-badge': 'Sparen Sie 20%',
        'basic-feature-1': 'Mitgliederrabatte',
        'basic-feature-2': 'Wöchentlicher Newsletter',
        'basic-feature-3': 'Grundlegende Pflanzenidentifikation',
        'basic-feature-4': 'Zugang zum Community-Forum',
        
        'green-thumb-name': 'Grüner Daumen Mitgliedschaft',
        'green-thumb-subtitle': 'Für ernsthafte Gärtner und Pflanzenliebhaber',
        'green-thumb-monthly-title': 'Monatsplan',
        'green-thumb-yearly-title': 'Jahresplan',
        'green-thumb-save-badge': 'Sparen Sie 20%',
        'most-popular-badge': 'Am Beliebtesten',
        'green-thumb-feature-1': 'Alles im Basis-Plan',
        'green-thumb-feature-2': 'KI-Gartenplanung & Einblicke',
        'green-thumb-feature-3': 'Expertenberatungen & Support',
        'green-thumb-feature-4': 'Erweiterte Krankheitsidentifikations-KI',
        'green-thumb-feature-5': 'Ortsspezifische Kalender',
        
        // Newsletter
        'newsletter-title': 'Treten Sie Unserer Gartengemeinschaft Bei',
        'newsletter-description': 'Erhalten Sie wöchentliche Gartentipps, saisonale Ratschläge und exklusiven Inhalt in Ihr Postfach.',
        'newsletter-submit-btn': 'Kostenlos Abonnieren',
        
        // Plant Doctor
        'plant-doctor-title': 'Pflanzendoktor - KI-Pflanzenanalyse',
        'plant-doctor-description': 'Laden Sie ein Foto Ihrer Pflanze hoch oder machen Sie eines für sofortige KI-Analyse und Expertenempfehlungen.',
        'free-analysis-counter': '3 kostenlose Analysen pro Tag',
        'analysis-left': 'übrig',
        'no-analysis-left': 'Keine kostenlosen Analysen heute übrig',
        'upgrade-basic-prompt': 'Upgraden Sie auf Basis-Mitgliedschaft (4,99$/Monat) für unbegrenzte Pflanzenidentifikation und Krankheitsanalyse.',
        'upgrade-now': 'Jetzt Upgraden',
        'maybe-later': 'Vielleicht später',
        
        'stat-plants-analyzed': 'Pflanzen Analysiert',
        'stat-accuracy-rate': 'Genauigkeitsrate',
        'stat-instant-analysis': 'Sofortanalyse',
        
        'upload-title': 'Ziehen Sie Ihr Pflanzenfoto hierher',
        'upload-description': 'oder klicken Sie, um von Ihrem Gerät auszuwählen',
        'upload-file-btn': 'Datei Hochladen',
        'take-photo-btn': 'Foto Aufnehmen',
        'analyze-btn': 'Pflanze Analysieren',
        
        // Plant identification step
        'identification-title': 'Pflanzenidentifikation',
        'identified-plant': 'Wir haben Ihre Pflanze identifiziert als:',
        'plant-name-label': 'Pflanzenname:',
        'is-this-correct': 'Ist diese Identifikation korrekt?',
        'yes-correct': 'Ja, das ist richtig',
        'no-incorrect': 'Nein, das ist falsch',
        'provide-plant-name': 'Bitte geben Sie den korrekten Pflanzennamen an:',
        'continue-analysis': 'Weiter zur Krankheitsanalyse',
        
        'analysis-complete-title': 'Analyse Abgeschlossen!',
        'analysis-plant-name': 'Rose (Rosa)',
        'analysis-health-title': 'Gesundheitsstatus:',
        'analysis-health-status': 'Ihre Pflanze scheint in ausgezeichneter Gesundheit zu sein!',
        'analysis-recommendations-title': 'Empfehlungen:',
        'analysis-rec-1': '• Regelmäßig gießen aber Überwässerung vermeiden',
        'analysis-rec-2': '• Gute Entwässerung sicherstellen',
        'analysis-rec-3': '• 6-8 Stunden Sonnenlicht täglich bereitstellen',
        'analysis-confidence': 'Vertrauen: 98% - Analyse basierend auf Bildqualität und Pflanzenmerkmalen.',
        'analyze-another-btn': 'Eine Andere Pflanze Analysieren',
        
        // Footer
        'footer-description': 'Ihr vertrauensvoller Begleiter für erfolgreiche Gartenarbeit. Von Anfängertipps bis zu fortgeschrittenen Techniken helfen wir Ihnen, den Garten Ihrer Träume zu züchten.',
        'footer-quick-links-title': 'Schnelle Links',
        'footer-home': 'Startseite',
        'footer-garden-styles': 'Gartenstile',
        'footer-plant-care': 'Pflanzenpflege',
        'footer-plant-doctor': 'Pflanzendoktor',
        'footer-contact-title': 'Kontaktieren Sie Uns',
        'footer-contact-description': 'Treten Sie unserer Gemeinschaft leidenschaftlicher Gärtner bei und beginnen Sie heute Ihre Reise zum Gartenerfolg.',
        'footer-copyright': '© 2025 Garden with Serge. Alle Rechte vorbehalten.'
    },
    
    el: {
    // Navigation
    'nav-home': 'Αρχική',
    'nav-garden-styles': 'Στυλ Κήπων',
    'nav-plant-care': 'Φροντίδα Φυτών',
    'nav-seasonal-tips': 'Εποχιακές Συμβουλές',
    'nav-membership': 'Συνδρομή',
    'nav-newsletter': 'Ενημερωτικό Δελτίο',
    'nav-plant-doctor': 'Δρ. Φυτών',
    'nav-garden-guides': 'Οδηγοί Κήπου',
    'garden-guides-title': 'Βασικοί Οδηγοί Κήπου',
    'remove-image': 'αφαίρεση εικόνας',
	'nav-member-login': 'Σύνδεση Μέλους',
	'mobile-nav-member-login': 'Σύνδεση Μέλους',
	'footer-facebook-cta': 'Ακολουθήστε μας στο Facebook',
	'footer-facebook-link': 'Ακολουθήστε μας στο Facebook',
	'footer-facebook-url': 'https://www.facebook.com/profile.php?id=61576359017023',
soil-guide-title-full: 'Πλήρης Οδηγός Προετοιμασίας Εδάφους',
soil-guide-body: `
  <h2>Βήμα 1 – Τεστάρετε το έδαφος</h2>
  <p>Χρησιμοποιήστε ένα κιτ pH ή στείλτε δείγμα σε εργαστήριο. Ιδανικό pH 6–7.</p>
  <h2>Βήμα 2 – Προσθέστε οργανική ύλη</h2>
  <p>Ενσωματώστε 5–7 cm κομπόστ ή καλά χωνεμένη κοπριά.</p>
  <h2>Βήμα 3 – Βελτιώστε την αποστράγγιση</h2>
  <p>Για βαρύ πηλό προσθέστε χοντρή άμμο και γύψο. Για αμμώδες, κομπόστ και τύρφη.</p>
`,

compost-guide-title-full: 'Πλήρης Οδηγός Βασικών Κομποστοποίησης',
compost-guide-body: `
  <h2>Βήμα 1 – Ισορροπία πράσινων και καφέ</h2>
  <p>Πράσινα = πλούσια σε άζωτο (υπολείμματα κουζίνας, γρασίδι). Καφέ = πλούσια σε άνθρακα (φύλλα, χαρτόνι).</p>
  <h2>Βήμα 2 – Κατασκευάστε τη στοίβα</h2>
  <p>Εναλλάξ στρώσεις 5–7 cm πράσινων και καφέ, προσθέτοντας μια σπάτουλα χώματος ανά λίγες στρώσεις.</p>
  <h2>Βήμα 3 – Συντήρηση</h2>
  <p>Διατηρήστε υγρό σαν στυμμένο σφουγγάρι και ανακατέψτε εβδομαδιαίως.</p>
`,

pruning-guide-title-full: 'Πλήρης Οδηγός Τεχνικών Κλαδέματος',
pruning-guide-body: `
  <h2>Βήμα 1 – Γνωρίστε πότε να κλαδέψετε</h2>
  <p>Ανοιξιάτικοι θάμνοι = μετά την άνθηση. Καλοκαιρινοί = τέλη χειμώνα.</p>
  <h2>Βήμα 2 – Κάντε σωστές τομές</h2>
  <p>Κόψτε 6 mm πάνω από ένα μάτι, σε γωνία 45°, γέρνοντας προς τα έξω.</p>
  <h2>Βήμα 3 – Αφαιρέστε τα 3 Ν</h2>
  <p>Νεκρό, νοσούν και κατεστραμμένο ξύλο πρώτα, μετά αραιώστε για αερισμό.</p>
`,
soil-guide-title-full: 'Πλήρης Οδηγός Προετοιμασίας Εδάφους',
soil-guide-body: `
  <h2>Βήμα 1 – Ελέγξτε το έδαφος</h2>
  <p>Χρησιμοποιήστε κιτ pH ή στείλτε δείγμα στο εργαστήριο. Ιδανικό pH 6–7.</p>
  <h2>Βήμα 2 – Προσθέστε οργανική ύλη</h2>
  <p>Ενσωματώστε 5–7 cm κομπόστ ή καλά χωνεμένη κοπριά.</p>
  <h2>Βήμα 3 – Βελτιώστε την αποστράγγιση</h2>
  <p>Για βαρύ πηλό: χοντρή άμμος και γύψος· για αμμώδες: κομπόστ και τύρφη.</p>
`,

compost-guide-title-full: 'Πλήρης Οδηγός Βασικών Κομποστοποίησης',
compost-guide-body: `
  <h2>Βήμα 1 – Ισορροπήστε πράσινα και καφέ</h2>
  <p>Πράσινα = πλούσια σε άζωτο (υπολείμματα κουζίνας, γρασίδι). Καφέ = πλούσια σε άνθρακα (φύλλα, χαρτόνι).</p>
  <h2>Βήμα 2 – Κατασκευάστε τη στοίβα</h2>
  <p>Εναλλάξ στρώσεις 5–7 cm πράσινων και καφέ, προσθέτοντας μια σπάτουλα χώματος ανά λίγες στρώσεις.</p>
  <h2>Βήμα 3 – Συντήρηση</h2>
  <p>Διατηρήστε υγρασία σαν στυμμένη σφουγγαρίστρα και ανακατέψτε εβδομαδιαίως.</p>
`,

pruning-guide-title-full: 'Πλήρης Οδηγός Τεχνικών Κλαδέματος',
pruning-guide-body: `
  <h2>Βήμα 1 – Γνωρίστε πότε να κλαδέψετε</h2>
  <p>Ανοιξιάτικοι θάμνοι = μετά την άνθηση· καλοκαιρινοί = τέλη χειμώνα.</p>
  <h2>Βήμα 2 – Κάντε σωστές τομές</h2>
  <p>Κόψτε 6 mm πάνω από μία μπουμπούκια, σε γωνία 45°, προς τα έξω.</p>
  <h2>Βήμα 3 – Αφαιρέστε τα 3Ν</h2>
  <p>Νεκρό, νοσούν και κατεστραμμένο ξύλο πρώτα, μετά αραιώστε για αερισμό.</p>
`,
	

    // Mobile navigation
    'mobile-nav-home': 'Αρχική',
    'mobile-nav-garden-styles': 'Στυλ Κήπων',
    'mobile-nav-plant-care': 'Φροντίδα Φυτών',
    'mobile-nav-seasonal-tips': 'Εποχιακές Συμβουλές',
    'mobile-nav-membership': 'Συνδρομή',
    'mobile-nav-newsletter': 'Ενημερωτικό Δελτίο',
    'mobile-nav-garden-guides': 'Οδηγοί Κήπου',
    'mobile-nav-plant-doctor': 'Δρ. Φυτών',
	

        
        // Hero Section
        'hero-title': 'Δωρεάν Γιατρός Φυτών ΑΙ - Άμεση Διάγνωση Ασθενειών',
        'hero-description': 'Λάβετε άμεση, ακριβή διάγνωση ασθενειών φυτών με τεχνητή νοημοσύνη. Ανεβάστε μια φωτογραφία και λάβετε εμπειρογνώμονα ανάλυση σε δευτερόλεπτα.',
        'partnership-badge': 'Πρόγραμμα Επαγγελματικής Συνεργασίας',
        'btn-try-plant-doctor': 'Δοκιμάστε τον Γιατρό Φυτών Δωρεάν',
        'btn-explore-guides': 'Εξερευνήστε Οδηγούς Κήπου',
        
        // Statistics
        'stat-plants-diagnosed': 'Φυτά Διαγνωσμένα',
        'stat-accuracy': 'Ποσοστό Ακρίβειας',
        'stat-available': 'Διαθέσιμο',
        'stat-analysis': 'Ανάλυση Φυτών',
        
        // Garden Guides Section
        'garden-guides-title': 'Βασικοί Οδηγοί Κήπου',
        'garden-guides-intro': 'Ολοκληρωμένοι οδηγοί για να σας βοηθήσουν να επιτύχετε σε όλες τις πτυχές της κηπουρικής, από βασικές τεχνικές έως προηγμένες μεθόδους.',
        
        // Soil Preparation Guide
        'soil-guide-title': 'Προετοιμασία Εδάφους',
        'soil-guide-desc': 'Μάθετε τα θεμέλια υγιούς εδάφους για ευημερούντα φυτά.',
        'soil-guide-tips': 'Βασικά Βήματα:',
        'soil-tip-1': '• Δοκιμάστε το pH και τα θρεπτικά στοιχεία του εδάφους',
        'soil-tip-2': '• Προσθέστε οργανικό κομπόστ ετησίως',
        'soil-tip-3': '• Εξασφαλίστε σωστή αποστράγγιση',
        'soil-tip-4': '• Αφαιρέστε ζιζάνια και υπολείμματα',
        
        // Composting Guide
        'composting-guide-title': 'Βασικές Αρχές Κομποστοποίησης',
        'composting-guide-desc': 'Δημιουργήστε πλούσιο σε θρεπτικά στοιχεία κομπόστ για τον κήπο σας φυσικά.',
        'composting-guide-tips': 'Βασικές Μέθοδοι:',
        'composting-tip-1': '• Ισορροπήστε πράσινα και καφέ υλικά',
        'composting-tip-2': '• Γυρίστε τον σωρό κάθε 2-3 εβδομάδες',
        'composting-tip-3': '• Διατηρήστε κατάλληλη υγρασία',
        'composting-tip-4': '• Παρακολουθήστε τα επίπεδα θερμοκρασίας',
        
        // Pruning Guide
        'pruning-guide-title': 'Τεχνικές Κλαδέματος',
        'pruning-guide-desc': 'Κατακτήστε το σωστό κλάδεμα για πιο υγιή, παραγωγικά φυτά.',
        'pruning-guide-tips': 'Καλύτερες Πρακτικές:',
        'pruning-tip-1': '• Χρησιμοποιήστε καθαρά, κοφτερά εργαλεία',
        'pruning-tip-2': '• Κλαδέψτε στη σωστή εποχή',
        'pruning-tip-3': '• Αφαιρέστε νεκρό και άρρωστο ξύλο',
        'pruning-tip-4': '• Κάντε καθαρές, γωνιασμένες κοπές',
        
        // Garden Styles
        'garden-styles-title': 'Ανακαλύψτε Στυλ Κήπων',
        'garden-styles-intro': 'Εξερευνήστε διαφορετικές προσεγγίσεις κηπουρικής και βρείτε το τέλειο στυλ για τον χώρο, το κλίμα και τον τρόπο ζωής σας.',
        
        // Expandable content buttons
        'click-more-content': 'Κλικ για περισσότερο περιεχόμενο',
        'click-hide-content': 'Κλικ για απόκρυψη περιεχομένου',
        
        'container-gardening-title': 'Κηπουρική σε Δοχεία',
        'container-gardening-desc': 'Τέλειο για μικρούς χώρους, αυλές και αρχάριους. Καλλιεργήστε απίστευτα φυτά σε γλάστρες, ζαρντινιέρες και δοχεία.',
        'container-guidelines': 'Βασικές Οδηγίες:',
        'container-tip-1': '• Επιλέξτε δοχεία με οπές αποστράγγισης',
        'container-tip-2': '• Χρησιμοποιήστε ποιοτικό μίγμα φυτόχωμα, όχι χώμα κήπου',
        'container-tip-3': '• Ποτίστε πιο συχνά από τα φυτά εδάφους',
        'container-tip-4': '• Λάβετε υπόψη το μέγεθος φυτού στην ωριμότητα',
        
        'vertical-gardening-title': 'Κάθετη Κηπουρική',
        'vertical-gardening-desc': 'Μεγιστοποιήστε τον χώρο καλλιέργειας πηγαίνοντας κάθετα. Τέλειο για αστικά περιβάλλοντα και μικρές περιοχές.',
        'vertical-principles': 'Βασικές Αρχές:',
        'vertical-tip-1': '• Εξασφαλίστε κατάλληλη δομική υποστήριξη',
        'vertical-tip-2': '• Σχεδιάστε για επαρκή φωτισμό',
        'vertical-tip-3': '• Εγκαταστήστε αποδοτικά συστήματα άρδευσης',
        'vertical-tip-4': '• Επιλέξτε ελαφρό μέσο καλλιέργειας',
        
        'hydroponic-gardening-title': 'Υδροπονική Κηπουρική',
        'hydroponic-gardening-desc': 'Καλλιέργεια χωρίς χώμα χρησιμοποιώντας πλούσια σε θρεπτικά στοιχεία διαλύματα νερού. Γρήγορη ανάπτυξη και υψηλές αποδόσεις όλο τον χρόνο.',
        'hydroponic-getting-started': 'Ξεκινώντας:',
        'hydroponic-tip-1': '• Ξεκινήστε με απλά συστήματα όπως DWC',
        'hydroponic-tip-2': '• Παρακολουθήστε τα επίπεδα pH και θρεπτικών στοιχείων',
        'hydroponic-tip-3': '• Παρέχετε επαρκή φωτισμό καλλιέργειας',
        'hydroponic-tip-4': '• Ξεκινήστε με φυλλώδη λαχανικά και μυρωδικά',
        
        'permaculture-title': 'Μόνιμη Καλλιέργεια',
        'permaculture-desc': 'Βιώσιμες αρχές σχεδιασμού που συνεργάζονται με τη φύση για τη δημιουργία παραγωγικών, αυτοσυντηρούμενων συστημάτων.',
        'permaculture-principles': 'Βασικές Αρχές:',
        'permaculture-tip-1': '• Φροντίδα για τη γη και τους ανθρώπους',
        'permaculture-tip-2': '• Σχεδιασμός για ενεργειακή απόδοση',
        'permaculture-tip-3': '• Χρήση ανανεώσιμων πόρων',
        'permaculture-tip-4': '• Δημιουργία ωφέλιμων σχέσεων',
        
        'shade-gardens-title': 'Κήποι Σκιάς',
        'shade-gardens-desc': 'Μετατρέψτε σκιασμένες περιοχές σε πολυτελείς, όμορφους κήπους με τη σωστή επιλογή και σχεδιασμό φυτών.',
        'shade-types': 'Τύποι Σκιάς:',
        'shade-tip-1': '• Μερική σκιά: 3-6 ώρες ηλιοφάνεια',
        'shade-tip-2': '• Πλήρης σκιά: Λιγότερο από 3 ώρες',
        'shade-tip-3': '• Κηλιδωτή σκιά: Φιλτραρισμένο ηλιακό φως',
        'shade-tip-4': '• Επιλέξτε φυτά που αγαπούν τη σκιά',
        
        'indoor-gardening-title': 'Εσωτερική Κηπουρική',
        'indoor-gardening-desc': 'Φέρτε τη φύση στο εσωτερικό με φυτά εσωτερικού χώρου, μυρωδικά και λαχανικά που ευδοκιμούν σε εσωτερικά περιβάλλοντα.',
        'indoor-success': 'Παράγοντες Επιτυχίας:',
        'indoor-tip-1': '• Παρέχετε επαρκείς πηγές φωτός',
        'indoor-tip-2': '• Διατηρήστε κατάλληλα επίπεδα υγρασίας',
        'indoor-tip-3': '• Εξασφαλίστε καλή κυκλοφορία αέρα',
        'indoor-tip-4': '• Επιλέξτε κατάλληλες ποικιλίες φυτών',
        
        // Garden Styles Expanded Content Titles
        'container-best-plants-title': 'Καλύτερα Φυτά για Δοχεία:',
        'container-types-title': 'Τύποι Δοχείων:',
        'vertical-systems-title': 'Τύποι Κάθετων Συστημάτων:',
        'vertical-perfect-plants-title': 'Τέλεια Φυτά:',
        'hydroponic-systems-title': 'Τύποι Συστημάτων:',
        'hydroponic-equipment-title': 'Απαιτούμενος Εξοπλισμός:',
        'permaculture-design-title': 'Στοιχεία Σχεδιασμού:',
        'permaculture-benefits-title': 'Οφέλη:',
        'shade-plants-title': 'Φυτά που Αγαπούν τη Σκιά:',
        'shade-design-title': 'Συμβουλές Σχεδιασμού:',
        'indoor-plants-title': 'Εύκολα Φυτά Εσωτερικού:',
        'indoor-conditions-title': 'Συνθήκες Καλλιέργειας:',
        
        // Garden Styles Expanded Content
        // Container Gardening Content
        'container-herbs': '• Μυρωδικά: Βασιλικός, δεντρολίβανο, θυμάρι, μαϊντανός',
        'container-vegetables': '• Λαχανικά: Ντομάτες, πιπεριές, μαρούλι, φασόλια',
        'container-flowers': '• Λουλούδια: Πετούνιες, καλέντουλες, βιόλες',
        'container-fruits': '• Φρούτα: Φράουλες, νάνα εσπεριδοειδή',
        'container-terracotta': '• Τερακότα: Καλή αποστράγγιση, κλασική εμφάνιση',
        'container-plastic': '• Πλαστικό: Ελαφρύ, διατηρεί υγρασία',
        'container-ceramic': '• Κεραμικό: Όμορφο αλλά βαρύ',
        'container-wood': '• Ξύλο: Φυσική εμφάνιση, καλή μόνωση',
        
        // Vertical Gardening Content
        'vertical-living-walls': '• Ζωντανοί τοίχοι: Συστήματα καλλιέργειας με βάση το έδαφος',
        'vertical-hydroponic-towers': '• Υδροπονικοί πύργοι: Κάθετα συστήματα χωρίς έδαφος',
        'vertical-pocket-planters': '• Τσέπης φυτοδοχεία: Τσάντες από ύφασμα ή πλαστικό',
        'vertical-trellis-systems': '• Συστήματα περγκόλας: Υποστήριξη για αναρριχώμενα φυτά',
        'vertical-climbing-vines': '• Αναρριχώμενα φυτά: Μπιζέλια, φασόλια, αγγούρια',
        'vertical-trailing-plants': '• Κρεμώδη φυτά: Φράουλες, καπουτσίνο',
        'vertical-compact-vegetables': '• Συμπαγή λαχανικά: Μαρούλι, σπανάκι, μυρωδικά',
        
        // Hydroponic Gardening Content
        'hydroponic-dwc': '• DWC (Καλλιέργεια Βαθέος Νερού): Ρίζες σε θρεπτικό διάλυμα',
        'hydroponic-nft': '• NFT (Τεχνική Θρεπτικού Φιλμ): Λεπτή μεμβράνη θρεπτικών',
        'hydroponic-ebb-flow': '• Παλίρροια: Σύστημα περιοδικής πλημμύρας',
        'hydroponic-aeroponic': '• Αεροπονικά: Ρίζες κρεμασμένες στον αέρα, εκνεφωμένες',
        'hydroponic-containers': '• Δοχεία καλλιέργειας και μέσο ανάπτυξης',
        'hydroponic-pumps': '• Αντλίες νερού και αέρα',
        'hydroponic-testing': '• Κιτ δοκιμών pH και θρεπτικών στοιχείων',
        'hydroponic-lights': '• Φώτα LED ανάπτυξης για εσωτερικά συστήματα',
        
        // Permaculture Content
        'permaculture-food-forests': '• Δάση τροφίμων: Πολυστρωματικά συστήματα καλλιέργειας',
        'permaculture-water-harvesting': '• Συλλογή νερού: Συλλογή και διαχείριση βροχής',
        'permaculture-companion-planting': '• Συντροφική φύτευση: Αμοιβαία ωφέλιμα φυτά',
        'permaculture-pest-management': '• Φυσική διαχείριση επιβλαβών: Οικολογική ισορροπία',
        'permaculture-low-maintenance': '• Μειωμένη συντήρηση με τον χρόνο',
        'permaculture-soil-health': '• Βελτιωμένη υγεία εδάφους και βιοποικιλότητα',
        'permaculture-resilient': '• Ανθεκτικό σε κλιματικές μεταβολές',
        'permaculture-productive': '• Παράγει τρόφιμα, φάρμακα και υλικά',
        
        // Shade Gardens Content
        'shade-hostas': '• Χόστας: Δραματικό φύλλωμα σε πολλές ποικιλίες',
        'shade-ferns': '• Φτέρες: Αρχαία, κομψά φυτά υφής',
        'shade-impatiens': '• Ιμπάτιενς: Χρωματιστά ετήσια λουλούδια',
        'shade-astilbe': '• Αστίλμπε: Αφράτα φτερά λουλουδιών',
        'shade-heuchera': '• Χεουχέρα: Χρωματιστά πολυετή φυλλώματα',
        'shade-light-plants': '• Χρησιμοποιήστε φωτεινά φυτά για να φωτίσετε σκοτεινές περιοχές',
        'shade-paths-seating': '• Προσθέστε μονοπάτια και καθίσματα για απόλαυση',
        'shade-layer-height': '• Στρωματοποιήστε φυτά κατά ύψος για βάθος',
        'shade-fragrant-plants': '• Συμπεριλάβετε αρωματικά φυτά για αισθητική έλξη',
        
        // Indoor Gardening Content
        'indoor-pothos': '• Πόθος: Αμπέλι χαμηλής συντήρησης',
        'indoor-snake-plant': '• Φυτό φίδι: Ανέχεται χαμηλό φως',
        'indoor-spider-plant': '• Φυτό αράχνη: Εύκολο στην αναπαραγωγή',
        'indoor-peace-lily': '• Κρίνος ειρήνης: Όμορφα λουλούδια',
        'indoor-herbs': '• Μυρωδικά: Βασιλικός, μέντα, μαϊντανός',
        'indoor-light': '• Φως: Παράθυρα με νότιο προσανατολισμό ή φώτα ανάπτυξης',
        'indoor-temperature': '• Θερμοκρασία: Τα περισσότερα φυτά προτιμούν 18-24°C',
        'indoor-humidity': '• Υγρασία: Χρησιμοποιήστε υγραντήρες ή δίσκους χαλικιών',
        'indoor-soil': '• Έδαφος: Χρησιμοποιήστε ποιοτικά μείγματα γλαστρών',
        
        // Plant Care
        'plant-care-title': 'Εμπειρογνώμονα Φροντίδα Φυτών',
        'plant-care-intro': 'Κατακτήστε τα θεμέλια της φροντίδας φυτών με τους ολοκληρωμένους οδηγούς μας που καλύπτουν πότισμα, έλεγχο επιβλαβών και διαχείριση ασθενειών.',
        'watering-guide-title': 'Οδηγός Ποτίσματος',
        'watering-intro': 'Κατακτήστε την τέχνη της σωστής ενυδάτωσης φυτών με αυτές τις βασικές τεχνικές:',
        'watering-tip-1': '• Ελέγξτε την υγρασία του εδάφους πριν το πότισμα',
        'watering-tip-2': '• Ποτίστε βαθιά αλλά λιγότερο συχνά',
        'watering-tip-3': '• Το πρωινό πότισμα είναι συνήθως καλύτερο',
        'watering-tip-4': '• Προσαρμόστε τη συχνότητα ανάλογα με την εποχή και τον καιρό',
        'watering-expand-btn': 'Κλικ για περισσότερο περιεχόμενο',
        'watering-signs-title': 'Σημάδια Προβλημάτων Ποτίσματος:',
        'watering-overwater': '• Υπερβολικό πότισμα: Κίτρινα φύλλα, σήψη ρίζας, μυκητιακή ανάπτυξη',
        'watering-underwater': '• Ανεπαρκές πότισμα: Μάρανση, ξηρό χώμα, καφέ άκρα φύλλων',
        
        'pest-control-title': 'Έλεγχος Επιβλαβών',
        'pest-intro': 'Προστατέψτε τα φυτά σας από συνήθη επιβλαβή με ολοκληρωμένες στρατηγικές διαχείρισης:',
        'pest-tip-1': '• Τακτική επιθεώρηση και πρώιμη ανίχνευση',
        'pest-tip-2': '• Ενθαρρύνετε τα ωφέλιμα έντομα',
        'pest-tip-3': '• Χρησιμοποιήστε βιολογικές θεραπείες όταν είναι δυνατόν',
        'pest-tip-4': '• Διατηρήστε την υγεία των φυτών για αντίσταση',
        'pest-expand-btn': 'Κλικ για περισσότερο περιεχόμενο',
        'pest-common-title': 'Συνήθη Επιβλαβή του Κήπου:',
        'pest-aphids': '• Αφίδες: Μικρά, μαλακά έντομα σε νέα ανάπτυξη',
        'pest-spider-mites': '• Ακάρεα αράχνης: Μικροσκοπικά επιβλαβή που προκαλούν στικτά φύλλα',
        'pest-whiteflies': '• Λευκές μυγίτσες: Μικρά λευκά ιπτάμενα έντομα',
        
        'disease-mgmt-title': 'Διαχείριση Ασθενειών',
        'disease-intro': 'Προλάβετε και θεραπεύστε ασθένειες φυτών με κατάλληλες τεχνικές διαχείρισης:',
        'disease-tip-1': '• Εξασφαλίστε κατάλληλη κυκλοφορία αέρα',
        'disease-tip-2': '• Αποφύγετε το πότισμα από πάνω',
        'disease-tip-3': '• Αφαιρέστε μολυσμένο φυτικό υλικό',
        'disease-tip-4': '• Επιλέξτε ποικιλίες ανθεκτικές στις ασθένειες',
        'disease-expand-btn': 'Κλικ για περισσότερο περιεχόμενο',
        'disease-common-title': 'Συνήθεις Ασθένειες Φυτών:',
        'disease-powdery-mildew': '• Ωίδιο: Λευκή σκονώδης επικάλυψη στα φύλλα',
        'disease-black-spot': '• Μαύρη κηλίδα: Σκοτεινές κηλίδες σε φύλλα και βλαστούς',
        'disease-root-rot': '• Σήψη ρίζας: Μαλακές, σκοτεινές ρίζες από υπερβολικό πότισμα',

        // Seasonal Tips
        'seasonal-tips-title': 'Εποχιακές Συμβουλές Κηπουρικής',
        'seasonal-tips-intro': 'Ανακαλύψτε εποχιακές οδηγίες για να διατηρήσετε τον κήπο σας ευημερούντα όλο τον χρόνο με το ολοκληρωμένο εποχιακό ημερολόγιο κηπουρικής μας.',
        
        'spring-title': 'Άνοιξη',
        'spring-period': 'Μάρτιος - Μάιος',
        'spring-description': 'Η εποχή ανανέωσης και ανάπτυξης. Προετοιμάστε τον κήπο σας για την επερχόμενη περίοδο καλλιέργειας.',
        'spring-tasks-title': 'Βασικές Εργασίες:',
        'spring-task-1': 'Ξεκινήστε σπόρους στο εσωτερικό για καλλιέργειες θερμής εποχής',
        'spring-task-2': 'Προετοιμάστε τα παρτέρια και προσθέστε κομπόστ',
        'spring-task-3': 'Κλαδέψτε οπωροφόρα δέντρα και ανθοφόρους θάμνους',
        'spring-task-4': 'Ξεκινήστε την παρακολούθηση επιβλαβών και ασθενειών',
        
        'summer-title': 'Καλοκαίρι',
        'summer-period': 'Ιούνιος - Αύγουστος',
        'summer-description': 'Περίοδος μέγιστης ανάπτυξης με άφθονες συγκομιδές. Εστιάστε στη συντήρηση και τη διαχείριση νερού.',
        'summer-tasks-title': 'Βασικές Εργασίες:',
        'summer-task-1': 'Βαθύ πότισμα κατά τις ζεστές, ξηρές περιόδους',
        'summer-task-2': 'Συγκομίστε λαχανικά στη βέλτιστη ωριμότητα',
        'summer-task-3': 'Αφαιρέστε μαραμένα άνθη για να ενθαρρύνετε την άνθηση',
        'summer-task-4': 'Παρακολουθήστε και θεραπεύστε προσβολές επιβλαβών',
        
        'autumn-title': 'Φθινόπωρο',
        'autumn-period': 'Σεπτέμβριος - Νοέμβριος',
        'autumn-description': 'Χρόνος συγκομιδής και προετοιμασίας για τον χειμώνα. Εστιάστε στον καθαρισμό και την προστασία.',
        'autumn-tasks-title': 'Βασικές Εργασίες:',
        'autumn-task-1': 'Συγκομίστε τις υπόλοιπες καλλιέργειες πριν τον παγετό',
        'autumn-task-2': 'Φυτέψτε βολβούς που ανθίζουν την άνοιξη',
        'autumn-task-3': 'Καθαρίστε πεσμένα φύλλα και υπολείμματα',
        'autumn-task-4': 'Προστατέψτε ευαίσθητα φυτά από το κρύο',
        
        'winter-title': 'Χειμώνας',
        'winter-period': 'Δεκέμβριος - Φεβρουάριος',
        'winter-description': 'Περίοδος σχεδιασμού και προστασίας. Εστιάστε στην εσωτερική καλλιέργεια και τον σχεδιασμό κήπου.',
        'winter-tasks-title': 'Βασικές Εργασίες:',
        'winter-task-1': 'Σχεδιάστε τη διάταξη του κήπου του επόμενου έτους',
        'winter-task-2': 'Παραγγείλετε σπόρους και καταλόγους φυτών',
        'winter-task-3': 'Συντηρήστε φυτά εσωτερικού χώρου και εσωτερικά μυρωδικά',
        'winter-task-4': 'Ελέγξτε και συντηρήστε εργαλεία κήπου',
        
        // Membership
        'membership-title': 'Επιλέξτε το Ταξίδι της Κηπουρικής σας',
        'membership-intro': 'Λάβετε συμβουλές εμπειρογνωμόνων, διάγνωση φυτών με ΑΙ και premium λειτουργίες για να πάτε την κηπουρική σας στο επόμενο επίπεδο',
        
        'basic-membership-name': 'Βασική Συνδρομή',
        'basic-membership-subtitle': 'Τέλειο για αρχάριους κηπουρούς',
        'basic-monthly-title': 'Μηνιαίο Πλάνο',
        'basic-yearly-title': 'Ετήσιο Πλάνο',
        'basic-save-badge': 'Εξοικονομείστε 20%',
        'basic-feature-1': 'Εκπτώσεις μελών',
        'basic-feature-2': 'Εβδομαδιαίο ενημερωτικό δελτίο',
        'basic-feature-3': 'Βασική αναγνώριση φυτών',
        'basic-feature-4': 'Πρόσβαση στο φόρουμ κοινότητας',
        
        'green-thumb-name': 'Συνδρομή Πράσινου Αντίχειρα',
        'green-thumb-subtitle': 'Για σοβαρούς κηπουρούς και λάτρεις των φυτών',
        'green-thumb-monthly-title': 'Μηνιαίο Πλάνο',
        'green-thumb-yearly-title': 'Ετήσιο Πλάνο',
        'green-thumb-save-badge': 'Εξοικονομείστε 20%',
        'most-popular-badge': 'Πιο Δημοφιλής',
        'green-thumb-feature-1': 'Όλα όσα στο Βασικό Πλάνο',
        'green-thumb-feature-2': 'ΑΙ σχεδιασμός κήπου & insights',
        'green-thumb-feature-3': 'Συμβουλές εμπειρογνωμόνων & υποστήριξη',
        'green-thumb-feature-4': 'Προηγμένη ΑΙ αναγνώρισης ασθενειών',
        'green-thumb-feature-5': 'Τοποθεσιακά ημερολόγια',
        
        // Newsletter
        'newsletter-title': 'Ελάτε στην Κοινότητα Κήπου μας',
        'newsletter-description': 'Λάβετε εβδομαδιαίες συμβουλές κηπουρικής, εποχιακές συμβουλές και αποκλειστικό περιεχόμενο στα εισερχόμενά σας.',
        'newsletter-submit-btn': 'Εγγραφή Δωρεάν',
        
        // Plant Doctor
        'plant-doctor-title': 'Γιατρός Φυτών - Ανάλυση ΑΙ Φυτών',
        'plant-doctor-description': 'Ανεβάστε ή τραβήξτε μια φωτογραφία του φυτού σας για άμεση ανάλυση ΑΙ και εμπειρογνώμονες συστάσεις.',
        'free-analysis-counter': '3 δωρεάν αναλύσεις ημερησίως',
        'analysis-left': 'απομένουν',
        'no-analysis-left': 'Δεν απομένουν δωρεάν αναλύσεις σήμερα',
        'upgrade-basic-prompt': 'Αναβαθμίστε σε Βασική Συνδρομή (4,99$/μήνα) για απεριόριστη αναγνώριση φυτών και ανάλυση ασθενειών.',
        'upgrade-now': 'Αναβάθμιση Τώρα',
        'maybe-later': 'Ίσως αργότερα',
        
        'stat-plants-analyzed': 'Φυτά Αναλυμένα',
        'stat-accuracy-rate': 'Ποσοστό Ακρίβειας',
        'stat-instant-analysis': 'Άμεση Ανάλυση',
        
        'upload-title': 'Σύρετε και αφήστε τη φωτογραφία φυτού εδώ',
        'upload-description': 'ή κάντε κλικ για επιλογή από τη συσκευή σας',
        'upload-file-btn': 'Ανέβασμα Αρχείου',
        'take-photo-btn': 'Λήψη Φωτογραφίας',
        'analyze-btn': 'Ανάλυση Φυτού',
        
        // Plant identification step
        'identification-title': 'Αναγνώριση Φυτού',
        'identified-plant': 'Αναγνωρίσαμε το φυτό σας ως:',
        'plant-name-label': 'Όνομα Φυτού:',
        'is-this-correct': 'Είναι σωστή αυτή η αναγνώριση;',
        'yes-correct': 'Ναι, αυτό είναι σωστό',
        'no-incorrect': 'Όχι, αυτό είναι λάθος',
        'provide-plant-name': 'Παρακαλώ δώστε το σωστό όνομα φυτού:',
        'continue-analysis': 'Συνέχεια στην Ανάλυση Ασθενειών',
        
        'analysis-complete-title': 'Ανάλυση Ολοκληρώθηκε!',
        'analysis-plant-name': 'Τριαντάφυλλο (Rosa)',
        'analysis-health-title': 'Κατάσταση Υγείας:',
        'analysis-health-status': 'Το φυτό σας φαίνεται να είναι σε άριστη υγεία!',
        'analysis-recommendations-title': 'Συστάσεις:',
        'analysis-rec-1': '• Ποτίστε τακτικά αλλά αποφύγετε το υπερβολικό πότισμα',
        'analysis-rec-2': '• Εξασφαλίστε καλή αποστράγγιση',
        'analysis-rec-3': '• Παρέχετε 6-8 ώρες ηλιοφάνεια καθημερινά',
        'analysis-confidence': 'Εμπιστοσύνη: 98% - Ανάλυση βασισμένη στην ποιότητα εικόνας και τα χαρακτηριστικά φυτού.',
        'analyze-another-btn': 'Ανάλυση Άλλου Φυτού',
        
        // Footer
        'footer-description': 'Ο αξιόπιστος σύντροφός σας για επιτυχημένη κηπουρική. Από συμβουλές για αρχάριους έως προηγμένες τεχνικές, σας βοηθάμε να καλλιεργήσετε τον κήπο των ονείρων σας.',
        'footer-quick-links-title': 'Γρήγοροι Σύνδεσμοι',
        'footer-home': 'Αρχική',
        'footer-garden-styles': 'Στυλ Κήπων',
        'footer-plant-care': 'Φροντίδα Φυτών',
        'footer-plant-doctor': 'Γιατρός Φυτών',
        'footer-contact-title': 'Επικοινωνήστε',
        'footer-contact-description': 'Ελάτε στην κοινότητά μας παθιασμένων κηπουρών και ξεκινήστε το ταξίδι σας προς την επιτυχία στην κηπουρική σήμερα.',
        'footer-copyright': '© 2025 Garden with Serge. Όλα τα δικαιώματα διατηρούνται.'
    },
    
    ru: {
    // Navigation
    'nav-home': 'Главная',
    'nav-garden-styles': 'Стили Сада',
    'nav-plant-care': 'Уход за Растениями',
    'nav-seasonal-tips': 'Сезонные Советы',
    'nav-membership': 'Членство',
    'nav-newsletter': 'Рассылка',
    'nav-plant-doctor': 'Доктор Растений',
    'nav-garden-guides': 'Садовые руководства',
    'garden-guides-title': 'Основные Руководства по Садоводству',
    'remove-image': 'удалить изображение',
	'nav-member-login': 'Вход для участников',
	'mobile-nav-member-login': 'Вход для участников',
	'footer-facebook-cta': 'Подписывайтесь на нас в Facebook',
	'footer-facebook-link': 'Подписывайтесь на нас в Facebook',
	'footer-facebook-url': 'https://www.facebook.com/profile.php?id=61576359017023',
soil-guide-title-full: 'Полное руководство по подготовке почвы',
soil-guide-body: `
  <h2>Шаг 1 – Проверьте почву</h2>
  <p>Используйте pH-тест или лабораторию. Оптимальный pH 6–7.</p>
  <h2>Шаг 2 – Добавьте органику</h2>
  <p>Вмешайте 5–7 см компоста или перепревшего навоза.</p>
  <h2>Шаг 3 – Улучшите дренаж</h2>
  <p>Для тяжелой глины добавьте крупный песок и гипс; для песчаной — компост и торф.</p>
`,

compost-guide-title-full: 'Полное руководство по основам компостирования',
compost-guide-body: `
  <h2>Шаг 1 – Баланс зелёного и коричневого</h2>
  <p>Зелёное = богато азотом (кухонные отходы, трава). Коричневое = богато углеродом (листва, картон).</p>
  <h2>Шаг 2 – Сформируйте кучу</h2>
  <p>Слой 5–7 см зелёного и коричневого, чередуя, и добавляйте лопату земли раз в несколько слоёв.</p>
  <h2>Шаг 3 – Уход</h2>
  <p>Держите влажность как отжатая губка и переворачивайте каждую неделю.</p>
`,

pruning-guide-title-full: 'Полное руководство по технике обрезки',
pruning-guide-body: `
  <h2>Шаг 1 – Узнайте, когда обрезать</h2>
  <p>Весеннецветущие кусты — после цветения; летнецветущие — конец зимы.</p>
  <h2>Шаг 2 – Правильные срезы</h2>
  <p>Срезайте 6 мм над почкой под 45° от неё.</p>
  <h2>Шаг 3 – Удалите 3D</h2>
  <p>Мёртвую, повреждённую и больную древесину сначала, затем проредите для вентиляции.</p>
`,
soil-guide-title-full: 'Полное руководство по подготовке почвы',
soil-guide-body: `
  <h2>Шаг 1 – Проверьте почву</h2>
  <p>Используйте pH-тест или лабораторию. Оптимальный pH 6–7.</p>
  <h2>Шаг 2 – Добавьте органику</h2>
  <p>Вмешайте 5–7 см компоста или перепревшего навоза.</p>
  <h2>Шаг 3 – Улучшите дренаж</h2>
  <p>Для тяжёлой глины: крупный песок и гипс; для песчаной: компост и торф.</p>
`,

compost-guide-title-full: 'Полное руководство по основам компостирования',
compost-guide-body: `
  <h2>Шаг 1 – Баланс зелёного и коричневого</h2>
  <p>Зелёное = богато азотом (остатки кухни, трава). Коричневое = богато углеродом (листва, картон).</p>
  <h2>Шаг 2 – Сформируйте кучу</h2>
  <p>Слой 5–7 см зелёного и коричневого, чередуя, и добавляйте лопату земли раз в несколько слоёв.</p>
  <h2>Шаг 3 – Уход</h2>
  <p>Держите влажность как отжатая губка и переворачивайте каждую неделю.</p>
`,

pruning-guide-title-full: 'Полное руководство по технике обрезки',
pruning-guide-body: `
  <h2>Шаг 1 – Узнайте, когда обрезать</h2>
  <p>Весеннецветущие кусты — после цветения; летнецветущие — конец зимы.</p>
  <h2>Шаг 2 – Правильные срезы</h2>
  <p>Срезайте 6 мм над почкой под 45° от неё.</p>
  <h2>Шаг 3 – Удалите 3D</h2>
  <p>Мёртвую, повреждённую и больную древесину сначала, затем проредите для вентиляции.</p>
`,
	
	

    // Mobile navigation
    'mobile-nav-home': 'Главная',
    'mobile-nav-garden-styles': 'Стили Сада',
    'mobile-nav-plant-care': 'Уход за Растениями',
    'mobile-nav-seasonal-tips': 'Сезонные Советы',
    'mobile-nav-membership': 'Членство',
    'mobile-nav-newsletter': 'Рассылка',
    'mobile-nav-garden-guides': 'Садовые руководства',
    'mobile-nav-plant-doctor': 'Доктор Растений',
	

        
        // Hero Section
        'hero-title': 'Бесплатный ИИ Доктор Растений - Мгновенная Диагностика Болезней',
        'hero-description': 'Получите мгновенную, точную диагностику болезней растений на основе ИИ. Загрузите фото и получите экспертный анализ за секунды.',
        'partnership-badge': 'Профессиональная Партнерская Программа',
        'btn-try-plant-doctor': 'Попробовать Доктора Растений Бесплатно',
        'btn-explore-guides': 'Изучить Руководства по Садоводству',
        
        // Statistics
        'stat-plants-diagnosed': 'Растений Диагностировано',
        'stat-accuracy': 'Точность',
        'stat-available': 'Доступно',
        'stat-analysis': 'Анализ Растений',
        
        // Garden Guides Section
        'garden-guides-title': 'Основные Руководства по Садоводству',
        'garden-guides-intro': 'Полные руководства, чтобы помочь вам преуспеть во всех аспектах садоводства, от базовых техник до продвинутых методов.',
        
        // Soil Preparation Guide
        'soil-guide-title': 'Подготовка Почвы',
        'soil-guide-desc': 'Изучите основы здоровой почвы для процветающих растений.',
        'soil-guide-tips': 'Ключевые Шаги:',
        'soil-tip-1': '• Проверьте pH и питательные вещества почвы',
        'soil-tip-2': '• Добавляйте органический компост ежегодно',
        'soil-tip-3': '• Обеспечьте правильный дренаж',
        'soil-tip-4': '• Удалите сорняки и мусор',
        
        // Composting Guide
        'composting-guide-title': 'Основы Компостирования',
        'composting-guide-desc': 'Создайте богатый питательными веществами компост для своего сада естественным путем.',
        'composting-guide-tips': 'Основные Методы:',
        'composting-tip-1': '• Балансируйте зеленые и коричневые материалы',
        'composting-tip-2': '• Переворачивайте кучу каждые 2-3 недели',
        'composting-tip-3': '• Поддерживайте правильную влажность',
        'composting-tip-4': '• Контролируйте уровни температуры',
        
        // Pruning Guide
        'pruning-guide-title': 'Техники Обрезки',
        'pruning-guide-desc': 'Освойте правильную обрезку для более здоровых, продуктивных растений.',
        'pruning-guide-tips': 'Лучшие Практики:',
        'pruning-tip-1': '• Используйте чистые, острые инструменты',
        'pruning-tip-2': '• Обрезайте в правильный сезон',
        'pruning-tip-3': '• Удаляйте мертвую и больную древесину',
        'pruning-tip-4': '• Делайте чистые, угловатые срезы',
        
        // Garden Styles
        'garden-styles-title': 'Откройте Стили Сада',
        'garden-styles-intro': 'Исследуйте различные подходы к садоводству и найдите идеальный стиль для вашего пространства, климата и образа жизни.',
        
        // Expandable content buttons
        'click-more-content': 'Нажмите для большего содержания',
        'click-hide-content': 'Нажмите чтобы скрыть содержание',
        
        'container-gardening-title': 'Контейнерное Садоводство',
        'container-gardening-desc': 'Идеально для небольших пространств, патио и новичков. Выращивайте удивительные растения в горшках, кашпо и контейнерах.',
        'container-guidelines': 'Основные Рекомендации:',
        'container-tip-1': '• Выбирайте контейнеры с дренажными отверстиями',
        'container-tip-2': '• Используйте качественную почвенную смесь, не садовую землю',
        'container-tip-3': '• Поливайте чаще, чем грунтовые растения',
        'container-tip-4': '• Учитывайте размер растения при созревании',
        
        'vertical-gardening-title': 'Вертикальное Садоводство',
        'vertical-gardening-desc': 'Максимизируйте пространство для выращивания, используя вертикальные конструкции. Идеально для городской среды и небольших площадей.',
        'vertical-principles': 'Ключевые Принципы:',
        'vertical-tip-1': '• Обеспечьте правильную структурную поддержку',
        'vertical-tip-2': '• Спланируйте адекватное освещение',
        'vertical-tip-3': '• Установите эффективные системы орошения',
        'vertical-tip-4': '• Выберите легкую питательную среду',
        
        'hydroponic-gardening-title': 'Гидропонное Садоводство',
        'hydroponic-gardening-desc': 'Выращивание без почвы с использованием богатых питательными веществами водных растворов. Быстрый рост и высокие урожаи круглый год.',
        'hydroponic-getting-started': 'Начало Работы:',
        'hydroponic-tip-1': '• Начните с простых систем типа DWC',
        'hydroponic-tip-2': '• Контролируйте уровни pH и питательных веществ',
        'hydroponic-tip-3': '• Обеспечьте адекватное освещение для роста',
        'hydroponic-tip-4': '• Начните с листовой зелени и трав',
        
        'permaculture-title': 'Пермакультура',
        'permaculture-desc': 'Принципы устойчивого дизайна, которые работают с природой для создания продуктивных, самоподдерживающихся систем.',
        'permaculture-principles': 'Основные Принципы:',
        'permaculture-tip-1': '• Забота о земле и людях',
        'permaculture-tip-2': '• Дизайн для энергоэффективности',
        'permaculture-tip-3': '• Использование возобновляемых ресурсов',
        'permaculture-tip-4': '• Создание взаимовыгодных отношений',
        
        'shade-gardens-title': 'Теневые Сады',
        'shade-gardens-desc': 'Превратите тенистые области в пышные, красивые сады с правильным выбором и дизайном растений.',
        'shade-types': 'Типы Тени:',
        'shade-tip-1': '• Частичная тень: 3-6 часов солнечного света',
        'shade-tip-2': '• Полная тень: Менее 3 часов',
        'shade-tip-3': '• Пятнистая тень: Фильтрованный солнечный свет',
        'shade-tip-4': '• Выберите теневыносливые растения',
        
        'indoor-gardening-title': 'Комнатное Садоводство',
        'indoor-gardening-desc': 'Принесите природу в дом с комнатными растениями, травами и овощами, которые процветают в помещении.',
        'indoor-success': 'Факторы Успеха:',
        'indoor-tip-1': '• Обеспечьте адекватные источники света',
        'indoor-tip-2': '• Поддерживайте правильные уровни влажности',
        'indoor-tip-3': '• Обеспечьте хорошую циркуляцию воздуха',
        'indoor-tip-4': '• Выберите подходящие сорта растений',
        
        // Garden Styles Expanded Content Titles
        'container-best-plants-title': 'Лучшие Растения для Контейнеров:',
        'container-types-title': 'Типы Контейнеров:',
        'vertical-systems-title': 'Типы Вертикальных Систем:',
        'vertical-perfect-plants-title': 'Идеальные Растения:',
        'hydroponic-systems-title': 'Типы Систем:',
        'hydroponic-equipment-title': 'Необходимое Оборудование:',
        'permaculture-design-title': 'Элементы Дизайна:',
        'permaculture-benefits-title': 'Преимущества:',
        'shade-plants-title': 'Теневыносливые Растения:',
        'shade-design-title': 'Советы по Дизайну:',
        'indoor-plants-title': 'Простые Комнатные Растения:',
        'indoor-conditions-title': 'Условия Выращивания:',
        
        // Garden Styles Expanded Content
        // Container Gardening Content
        'container-herbs': '• Травы: Базилик, розмарин, тимьян, петрушка',
        'container-vegetables': '• Овощи: Помидоры, перцы, салат, бобы',
        'container-flowers': '• Цветы: Петунии, бархатцы, анютины глазки',
        'container-fruits': '• Фрукты: Клубника, карликовые цитрусовые',
        'container-terracotta': '• Терракота: Хороший дренаж, классический вид',
        'container-plastic': '• Пластик: Легкий, удерживает влагу',
        'container-ceramic': '• Керамика: Красивая, но тяжелая',
        'container-wood': '• Дерево: Естественный вид, хорошая изоляция',
        
        // Vertical Gardening Content
        'vertical-living-walls': '• Живые стены: Почвенные системы выращивания',
        'vertical-hydroponic-towers': '• Гидропонные башни: Вертикальные беспочвенные системы',
        'vertical-pocket-planters': '• Карманные сажалки: Тканевые или пластиковые мешочки',
        'vertical-trellis-systems': '• Шпалерные системы: Поддержка для вьющихся растений',
        'vertical-climbing-vines': '• Вьющиеся лозы: Горох, бобы, огурцы',
        'vertical-trailing-plants': '• Висячие растения: Клубника, настурции',
        'vertical-compact-vegetables': '• Компактные овощи: Салат, шпинат, травы',
        
        // Hydroponic Gardening Content
        'hydroponic-dwc': '• DWC (Глубоководная Культура): Корни в питательном растворе',
        'hydroponic-nft': '• NFT (Техника Питательной Пленки): Тонкая пленка питательных веществ',
        'hydroponic-ebb-flow': '• Прилив-отлив: Система периодического затопления',
        'hydroponic-aeroponic': '• Аэропоника: Корни подвешены в воздухе, распыляются',
        'hydroponic-containers': '• Контейнеры для выращивания и питательная среда',
        'hydroponic-pumps': '• Водяные и воздушные насосы',
        'hydroponic-testing': '• Наборы для тестирования pH и питательных веществ',
        'hydroponic-lights': '• LED лампы для роста для внутренних систем',
        
        // Permaculture Content
        'permaculture-food-forests': '• Пищевые леса: Многослойные системы выращивания',
        'permaculture-water-harvesting': '• Сбор воды: Сбор и управление дождевой водой',
        'permaculture-companion-planting': '• Совместная посадка: Взаимовыгодные растения',
        'permaculture-pest-management': '• Естественное управление вредителями: Экологический баланс',
        'permaculture-low-maintenance': '• Сниженное обслуживание со временем',
        'permaculture-soil-health': '• Улучшенное здоровье почвы и биоразнообразие',
        'permaculture-resilient': '• Устойчивость к климатическим изменениям',
        'permaculture-productive': '• Производит пищу, лекарства и материалы',
        
        // Shade Gardens Content
        'shade-hostas': '• Хосты: Драматическая листва в многих сортах',
        'shade-ferns': '• Папоротники: Древние, элегантные текстурные растения',
        'shade-impatiens': '• Бальзамины: Красочные однолетние цветы',
        'shade-astilbe': '• Астильба: Пушистые метелки цветов',
        'shade-heuchera': '• Гейхера: Красочные многолетники с листвой',
        'shade-light-plants': '• Используйте светлые растения для освещения темных участков',
        'shade-paths-seating': '• Добавьте дорожки и места для сидения для наслаждения',
        'shade-layer-height': '• Располагайте растения по высоте для глубины',
        'shade-fragrant-plants': '• Включите ароматные растения для сенсорной привлекательности',
        
        // Indoor Gardening Content
        'indoor-pothos': '• Потос: Неприхотливая лиана',
        'indoor-snake-plant': '• Сансевиерия: Переносит слабое освещение',
        'indoor-spider-plant': '• Хлорофитум: Легко размножается',
        'indoor-peace-lily': '• Спатифиллум: Красивые цветы',
        'indoor-herbs': '• Травы: Базилик, мята, петрушка',
        'indoor-light': '• Освещение: Южные окна или лампы для роста',
        'indoor-temperature': '• Температура: Большинство растений предпочитают 18-24°C',
        'indoor-humidity': '• Влажность: Используйте увлажнители или поддоны с галькой',
        'indoor-soil': '• Почва: Используйте качественные почвенные смеси',
        
        // Plant Care
        'plant-care-title': 'Экспертный Уход за Растениями',
        'plant-care-intro': 'Освойте основы ухода за растениями с нашими полными руководствами, охватывающими полив, борьбу с вредителями и управление болезнями.',
        'watering-guide-title': 'Руководство по Поливу',
        'watering-intro': 'Освойте искусство правильной гидратации растений с этими основными техниками:',
        'watering-tip-1': '• Проверяйте влажность почвы перед поливом',
        'watering-tip-2': '• Поливайте глубоко, но реже',
        'watering-tip-3': '• Утренний полив обычно лучше',
        'watering-tip-4': '• Регулируйте частоту по сезону и погоде',
        'watering-expand-btn': 'Нажмите для большего содержания',
        'watering-signs-title': 'Признаки Проблем с Поливом:',
        'watering-overwater': '• Переувлажнение: Желтые листья, гниль корней, рост грибков',
        'watering-underwater': '• Недоувлажнение: Увядание, сухая почва, коричневые края листьев',
        
        'pest-control-title': 'Борьба с Вредителями',
        'pest-intro': 'Защитите свои растения от обычных вредителей с интегрированными стратегиями управления:',
        'pest-tip-1': '• Регулярный осмотр и раннее обнаружение',
        'pest-tip-2': '• Поощрение полезных насекомых',
        'pest-tip-3': '• Используйте органические средства когда возможно',
        'pest-tip-4': '• Поддерживайте здоровье растений для сопротивляемости',
        'pest-expand-btn': 'Нажмите для большего содержания',
        'pest-common-title': 'Обычные Садовые Вредители:',
        'pest-aphids': '• Тли: Маленькие, мягкотелые насекомые на новом росте',
        'pest-spider-mites': '• Паутинные клещи: Крошечные вредители, вызывающие пятнистые листья',
        'pest-whiteflies': '• Белокрылки: Маленькие белые летающие насекомые',
        
        'disease-mgmt-title': 'Управление Болезнями',
        'disease-intro': 'Предотвращайте и лечите болезни растений с правильными техниками управления:',
        'disease-tip-1': '• Обеспечьте правильную циркуляцию воздуха',
        'disease-tip-2': '• Избегайте полива сверху',
        'disease-tip-3': '• Удаляйте зараженный растительный материал',
        'disease-tip-4': '• Выбирайте устойчивые к болезням сорта',
        'disease-expand-btn': 'Нажмите для большего содержания',
        'disease-common-title': 'Обычные Болезни Растений:',
        'disease-powdery-mildew': '• Мучнистая роса: Белый порошкообразный налет на листьях',
        'disease-black-spot': '• Черная пятнистость: Темные пятна на листьях и стеблях',
        'disease-root-rot': '• Корневая гниль: Мягкие, темные корни от переувлажнения',

        // Seasonal Tips
        'seasonal-tips-title': 'Сезонные Советы по Садоводству',
        'seasonal-tips-intro': 'Откройте сезонные рекомендации, чтобы сохранить ваш сад процветающим круглый год с нашим полным сезонным календарем садоводства.',
        
        'spring-title': 'Весна',
        'spring-period': 'Март - Май',
        'spring-description': 'Сезон обновления и роста. Подготовьте свой сад к предстоящему вегетационному сезону.',
        'spring-tasks-title': 'Ключевые Задачи:',
        'spring-task-1': 'Начните семена в помещении для теплолюбивых культур',
        'spring-task-2': 'Подготовьте садовые грядки и добавьте компост',
        'spring-task-3': 'Обрежьте фруктовые деревья и цветущие кустарники',
        'spring-task-4': 'Начните мониторинг вредителей и болезней',
        
        'summer-title': 'Лето',
        'summer-period': 'Июнь - Август',
        'summer-description': 'Пиковый сезон роста с обильными урожаями. Сосредоточьтесь на обслуживании и управлении водой.',
        'summer-tasks-title': 'Ключевые Задачи:',
        'summer-task-1': 'Глубокий полив в жаркие, сухие периоды',
        'summer-task-2': 'Собирайте овощи при оптимальной спелости',
        'summer-task-3': 'Удаляйте увядшие цветы для поощрения цветения',
        'summer-task-4': 'Мониторьте и лечите заражения вредителями',
        
        'autumn-title': 'Осень',
        'autumn-period': 'Сентябрь - Ноябрь',
        'autumn-description': 'Время урожая и подготовки к зиме. Сосредоточьтесь на уборке и защите.',
        'autumn-tasks-title': 'Ключевые Задачи:',
        'autumn-task-1': 'Соберите оставшиеся культуры до заморозков',
        'autumn-task-2': 'Посадите луковицы весеннего цветения',
        'autumn-task-3': 'Уберите опавшие листья и мусор',
        'autumn-task-4': 'Защитите нежные растения от холода',
        
        'winter-title': 'Зима',
        'winter-period': 'Декабрь - Февраль',
        'winter-description': 'Сезон планирования и защиты. Сосредоточьтесь на комнатном выращивании и планировании сада.',
        'winter-tasks-title': 'Ключевые Задачи:',
        'winter-task-1': 'Спланируйте планировку сада на следующий год',
        'winter-task-2': 'Закажите семена и каталоги растений',
        'winter-task-3': 'Ухаживайте за комнатными растениями и травами',
        'winter-task-4': 'Проверьте и обслужите садовые инструменты',
        
        // Membership
        'membership-title': 'Выберите Ваше Садоводческое Путешествие',
        'membership-intro': 'Получите экспертные советы, ИИ диагностику растений и премиум функции для развития вашего садоводства на новый уровень',
        
        'basic-membership-name': 'Базовое Членство',
        'basic-membership-subtitle': 'Идеально для начинающих садоводов',
        'basic-monthly-title': 'Месячный План',
        'basic-yearly-title': 'Годовой План',
        'basic-save-badge': 'Сэкономьте 20%',
        'basic-feature-1': 'Скидки для членов',
        'basic-feature-2': 'Еженедельная рассылка',
        'basic-feature-3': 'Базовая идентификация растений',
        'basic-feature-4': 'Доступ к форуму сообщества',
        
        'green-thumb-name': 'Членство Зеленый Палец',
        'green-thumb-subtitle': 'Для серьезных садоводов и любителей растений',
        'green-thumb-monthly-title': 'Месячный План',
        'green-thumb-yearly-title': 'Годовой План',
        'green-thumb-save-badge': 'Сэкономьте 20%',
        'most-popular-badge': 'Самый Популярный',
        'green-thumb-feature-1': 'Все в Базовом Плане',
        'green-thumb-feature-2': 'ИИ планирование сада и аналитика',
        'green-thumb-feature-3': 'Экспертные консультации и поддержка',
        'green-thumb-feature-4': 'Продвинутая ИИ идентификация болезней',
        'green-thumb-feature-5': 'Календари для конкретных локаций',
        
        // Newsletter
        'newsletter-title': 'Присоединяйтесь к Нашему Садоводческому Сообществу',
        'newsletter-description': 'Получайте еженедельные советы по садоводству, сезонные рекомендации и эксклюзивный контент в свою почту.',
        'newsletter-submit-btn': 'Подписаться Бесплатно',
        
        // Plant Doctor
        'plant-doctor-title': 'Доктор Растений - ИИ Анализ Растений',
        'plant-doctor-description': 'Загрузите или сделайте фото вашего растения для мгновенного ИИ анализа и экспертных рекомендаций.',
        'free-analysis-counter': '3 бесплатных анализа в день',
        'analysis-left': 'осталось',
        'no-analysis-left': 'Не осталось бесплатных анализов сегодня',
        'upgrade-basic-prompt': 'Обновитесь до Базового Членства ($4.99/месяц) для неограниченной идентификации растений и анализа болезней.',
        'upgrade-now': 'Обновить Сейчас',
        'maybe-later': 'Может быть позже',
        
        'stat-plants-analyzed': 'Растений Проанализировано',
        'stat-accuracy-rate': 'Точность',
        'stat-instant-analysis': 'Мгновенный Анализ',
        
        'upload-title': 'Перетащите фото растения сюда',
        'upload-description': 'или нажмите для выбора с устройства',
        'upload-file-btn': 'Загрузить Файл',
        'take-photo-btn': 'Сделать Фото',
        'analyze-btn': 'Анализировать Растение',
        
        // Plant identification step
        'identification-title': 'Идентификация Растения',
        'identified-plant': 'Мы определили ваше растение как:',
        'plant-name-label': 'Название Растения:',
        'is-this-correct': 'Правильна ли эта идентификация?',
        'yes-correct': 'Да, это правильно',
        'no-incorrect': 'Нет, это неправильно',
        'provide-plant-name': 'Пожалуйста, укажите правильное название растения:',
        'continue-analysis': 'Продолжить к Анализу Болезней',
        
        'analysis-complete-title': 'Анализ Завершен!',
        'analysis-plant-name': 'Роза (Rosa)',
        'analysis-health-title': 'Состояние Здоровья:',
        'analysis-health-status': 'Ваше растение выглядит в отличном состоянии!',
        'analysis-recommendations-title': 'Рекомендации:',
        'analysis-rec-1': '• Поливайте регулярно, но избегайте переувлажнения',
        'analysis-rec-2': '• Обеспечьте хороший дренаж',
        'analysis-rec-3': '• Обеспечьте 6-8 часов солнечного света ежедневно',
        'analysis-confidence': 'Уверенность: 98% - Анализ основан на качестве изображения и характеристиках растения.',
        'analyze-another-btn': 'Анализировать Другое Растение',
        
        // Footer
        'footer-description': 'Ваш надежный спутник для успешного садоводства. От советов для новичков до продвинутых техник, мы помогаем вам вырастить сад вашей мечты.',
        'footer-quick-links-title': 'Быстрые Ссылки',
        'footer-home': 'Главная',
        'footer-garden-styles': 'Стили Сада',
        'footer-plant-care': 'Уход за Растениями',
        'footer-plant-doctor': 'Доктор Растений',
        'footer-contact-title': 'Связаться',
        'footer-contact-description': 'Присоединяйтесь к нашему сообществу увлеченных садоводов и начните свой путь к успеху в садоводстве сегодня.',
        'footer-copyright': '© 2025 Garden with Serge. Все права защищены.'
    },
    
    ar: {
    // Navigation
    'nav-home': 'الرئيسية',
    'nav-garden-styles': 'أساليب الحديقة',
    'nav-plant-care': 'العناية بالنباتات',
    'nav-seasonal-tips': 'نصائح موسمية',
    'nav-membership': 'العضوية',
    'nav-newsletter': 'النشرة الإخبارية',
    'nav-plant-doctor': 'دكتور النباتات',
    'nav-garden-guides': 'أدلة الحديقة',
    'garden-guides-title': 'أدلة الحدائق الأساسية',
    'remove-image': 'إزالة الصورة',
	'nav-member-login': 'تسجيل دخول الأعضاء',
	'mobile-nav-member-login': 'تسجيل دخول الأعضاء',
	'footer-facebook-cta': 'تابعنا على فيسبوك',
	'footer-facebook-link': 'تابعنا على فيسبوك',
	'footer-facebook-url': 'https://www.facebook.com/profile.php?id=61576359017023',
soil-guide-title-full: 'الدليل الكامل لإعداد التربة',
soil-guide-body: `
  <h2>الخطوة 1 – اختبر تربتك</h2>
  <p>استخدم عدة pH أو أرسل عينة إلى المختبر. الرقم الهيدروجيني المثالي 6–7.</p>
  <h2>الخطوة 2 – أضف المادة العضوية</h2>
  <p>اخلط 5–7 سم من السماد أو السماد العضوي المتحلل.</p>
  <h2>الخطوة 3 – حسّن الصرف</h2>
  <p>للطين الثقيل أضف رمل خشن وجبس؛ للرملي أضف سماد وطمي.</p>
`,

compost-guide-title-full: 'الدليل الكامل لأساسيات السماد العضوي',
compost-guide-body: `
  <h2>الخطوة 1 – توازن الأخضر والبني</h2>
  <p>الأخضر = غني بالنتروجين (بقايا المطبخ، العشب). البني = غني بالكربون (أوراق، كرتون).</p>
  <h2>الخطوة 2 – بناء الكومة</h2>
  <p>طبقات متناوبة 5–7 سم من الأخضر والبني، مع إضافة مجرفة تراب كل عدة طبقات.</p>
  <h2>الخطوة 3 – الصيانة</h2>
  <p>اجعله رطباً كالإسفنجة المصفاة وقلّبه أسبوعياً.</p>
`,

pruning-guide-title-full: 'الدليل الكامل لتقنيات التقليم',
pruning-guide-body: `
  <h2>الخطوة 1 – اعرف متى تقلّم</h2>
  <p>الشجيرات الربيعية = بعد الإزهار؛ الصيفية = نهاية الشتاء.</p>
  <h2>الخطوة 2 – اجعل القطع صحيحة</h2>
  <p>قطع بزاوية 45° فوق البرعم 6 مم، موجهاً للخارج.</p>
  <h2>الخطوة 3 – أزل الـ3Ds</h2>
  <p>الخشب الميت، التالف، والمريض أولاً، ثم خفف لتحسين التهوية.</p>
`,
soil-guide-title-full: 'الدليل الكامل لإعداد التربة',
soil-guide-body: `
  <h2>الخطوة 1 – اختبر تربتك</h2>
  <p>استخدم عدة pH أو أرسل عينة إلى المختبر. الرقم الهيدروجيني المثالي 6–7.</p>
  <h2>الخطوة 2 – أضف المادة العضوية</h2>
  <p>اخلط 5–7 سم من السماد أو السماد العضوي المتحلل.</p>
  <h2>الخطوة 3 – حسّن الصرف</h2>
  <p>للطين الثقيل أضف رمل خشن وجبس؛ للرملي أضف سماد وطمي.</p>
`,

compost-guide-title-full: 'الدليل الكامل لأساسيات السماد العضوي',
compost-guide-body: `
  <h2>الخطوة 1 – توازن الأخضر والبني</h2>
  <p>الأخضر = غني بالنتروجين (بقايا المطبخ، العشب). البني = غني بالكربون (أوراق، كرتون).</p>
  <h2>الخطوة 2 – بناء الكومة</h2>
  <p>طبقات متناوبة 5–7 سم من الأخضر والبني، مع إضافة مجرفة تراب كل عدة طبقات.</p>
  <h2>الخطوة 3 – الصيانة</h2>
  <p>اجعله رطباً كالإسفنجة المصفاة وقلّبه أسبوعياً.</p>
`,

pruning-guide-title-full: 'الدليل الكامل لتقنيات التقليم',
pruning-guide-body: `
  <h2>الخطوة 1 – اعرف متى تقلّم</h2>
  <p>الشجيرات الربيعية = بعد الإزهار؛ الصيفية = نهاية الشتاء.</p>
  <h2>الخطوة 2 – اجعل القطع صحيحة</h2>
  <p>قطع بزاوية 45° فوق البرعم 6 مم، موجهاً للخارج.</p>
  <h2>الخطوة 3 – أزل الـ3Ds</h2>
  <p>الخشب الميت، التالف، والمريض أولاً، ثم خفف لتحسين التهوية.</p>
`,
	
	

    // Mobile navigation
    'mobile-nav-home': 'الرئيسية',
    'mobile-nav-garden-styles': 'أساليب الحديقة',
    'mobile-nav-plant-care': 'العناية بالنباتات',
    'mobile-nav-seasonal-tips': 'نصائح موسمية',
    'mobile-nav-membership': 'العضوية',
    'mobile-nav-newsletter': 'النشرة الإخبارية',
    'mobile-nav-garden-guides': 'أدلة الحديقة',
    'mobile-nav-plant-doctor': 'دكتور النباتات',
	

        
        // Hero Section
        'hero-title': 'دكتور نباتات ذكي مجاني - تشخيص فوري للأمراض',
        'hero-description': 'احصل على تشخيص فوري ودقيق لأمراض النباتات بالذكاء الاصطناعي. ارفع صورة واحصل على تحليل خبير في ثوان.',
        'partnership-badge': 'برنامج الشراكة المهنية',
        'btn-try-plant-doctor': 'جرب دكتور النباتات مجاناً',
        'btn-explore-guides': 'استكشف أدلة الحدائق',
        
        // Statistics
        'stat-plants-diagnosed': 'النباتات المشخصة',
        'stat-accuracy': 'معدل الدقة',
        'stat-available': 'متوفر',
        'stat-analysis': 'تحليل النباتات',
        
        // Garden Guides Section
        'garden-guides-title': 'أدلة الحدائق الأساسية',
        'garden-guides-intro': 'أدلة شاملة لمساعدتك على النجاح في جميع جوانب البستنة، من التقنيات الأساسية إلى الطرق المتقدمة.',
        
        // Soil Preparation Guide
        'soil-guide-title': 'إعداد التربة',
        'soil-guide-desc': 'تعلم أساسيات التربة الصحية للنباتات المزدهرة.',
        'soil-guide-tips': 'خطوات أساسية:',
        'soil-tip-1': '• اختبار درجة حموضة التربة والمغذيات',
        'soil-tip-2': '• إضافة السماد العضوي سنوياً',
        'soil-tip-3': '• ضمان التصريف المناسب',
        'soil-tip-4': '• إزالة الأعشاب الضارة والحطام',
        
        // Composting Guide
        'composting-guide-title': 'أساسيات السماد العضوي',
        'composting-guide-desc': 'اصنع سماداً عضوياً غنياً بالمغذيات لحديقتك بطريقة طبيعية.',
        'composting-guide-tips': 'طرق أساسية:',
        'composting-tip-1': '• توازن المواد الخضراء والبنية',
        'composting-tip-2': '• قلب الكومة كل 2-3 أسابيع',
        'composting-tip-3': '• الحفاظ على الرطوبة المناسبة',
        'composting-tip-4': '• مراقبة مستويات الحرارة',
        
        // Pruning Guide
        'pruning-guide-title': 'تقنيات التقليم',
        'pruning-guide-desc': 'أتقن التقليم الصحيح للنباتات الأكثر صحة وإنتاجية.',
        'pruning-guide-tips': 'أفضل الممارسات:',
        'pruning-tip-1': '• استخدم أدوات نظيفة وحادة',
        'pruning-tip-2': '• قلم في الموسم المناسب',
        'pruning-tip-3': '• أزل الخشب الميت والمريض',
        'pruning-tip-4': '• اعمل قطعاً نظيفة ومائلة',
        
        // Garden Styles
        'garden-styles-title': 'اكتشف أساليب الحدائق',
        'garden-styles-intro': 'استكشف مقاربات مختلفة للبستنة وجد الأسلوب المثالي لمساحتك ومناخك وأسلوب حياتك.',
        
        // Expandable content buttons
        'click-more-content': 'انقر للمزيد من المحتوى',
        'click-hide-content': 'انقر لإخفاء المحتوى',
        
        'container-gardening-title': 'البستنة في الحاويات',
        'container-gardening-desc': 'مثالية للمساحات الصغيرة والشرفات والمبتدئين. ازرع نباتات رائعة في الأصص والمزارع والحاويات.',
        'container-guidelines': 'إرشادات أساسية:',
        'container-tip-1': '• اختر حاويات بها فتحات تصريف',
        'container-tip-2': '• استخدم خليط تربة عالي الجودة، ليس تربة الحديقة',
        'container-tip-3': '• اسق أكثر من نباتات الأرض',
        'container-tip-4': '• اعتبر حجم النبات عند النضج',
        
        'vertical-gardening-title': 'البستنة العمودية',
        'vertical-gardening-desc': 'عظم مساحة الزراعة بالذهاب عمودياً. مثالية للبيئات الحضرية والمناطق الصغيرة.',
        'vertical-principles': 'مبادئ أساسية:',
        'vertical-tip-1': '• ضمان الدعم الهيكلي المناسب',
        'vertical-tip-2': '• خطط للإضاءة الكافية',
        'vertical-tip-3': '• ركب أنظمة ري فعالة',
        'vertical-tip-4': '• اختر وسط نمو خفيف',
        
        'hydroponic-gardening-title': 'البستنة المائية',
        'hydroponic-gardening-desc': 'الزراعة بدون تربة باستخدام محاليل مائية غنية بالمغذيات. نمو سريع وإنتاج عالي على مدار السنة.',
        'hydroponic-getting-started': 'البداية:',
        'hydroponic-tip-1': '• ابدأ بأنظمة بسيطة مثل DWC',
        'hydroponic-tip-2': '• راقب مستويات الحموضة والمغذيات',
        'hydroponic-tip-3': '• وفر إضاءة نمو كافية',
        'hydroponic-tip-4': '• ابدأ بالخضروات الورقية والأعشاب',
        
        'permaculture-title': 'الزراعة المستدامة',
        'permaculture-desc': 'مبادئ تصميم مستدامة تعمل مع الطبيعة لإنشاء أنظمة منتجة ومكتفية ذاتياً.',
        'permaculture-principles': 'مبادئ أساسية:',
        'permaculture-tip-1': '• العناية بالأرض والناس',
        'permaculture-tip-2': '• التصميم لكفاءة الطاقة',
        'permaculture-tip-3': '• استخدام الموارد المتجددة',
        'permaculture-tip-4': '• إنشاء علاقات مفيدة',
        
        'shade-gardens-title': 'حدائق الظل',
        'shade-gardens-desc': 'حول المناطق المظللة إلى حدائق خصبة وجميلة مع الاختيار والتصميم المناسب للنباتات.',
        'shade-types': 'أنواع الظل:',
        'shade-tip-1': '• ظل جزئي: 3-6 ساعات ضوء شمس',
        'shade-tip-2': '• ظل كامل: أقل من 3 ساعات',
        'shade-tip-3': '• ظل منقط: ضوء شمس مرشح',
        'shade-tip-4': '• اختر نباتات محبة للظل',
        
        'indoor-gardening-title': 'البستنة الداخلية',
        'indoor-gardening-desc': 'اجلب الطبيعة للداخل مع النباتات المنزلية والأعشاب والخضروات التي تزدهر في البيئات الداخلية.',
        'indoor-success': 'عوامل النجاح:',
        'indoor-tip-1': '• وفر مصادر ضوء كافية',
        'indoor-tip-2': '• حافظ على مستويات رطوبة مناسبة',
        'indoor-tip-3': '• ضمن دوران هواء جيد',
        'indoor-tip-4': '• اختر أصناف نباتات مناسبة',
        
        // Garden Styles Expanded Content Titles
        'container-best-plants-title': 'أفضل النباتات للحاويات:',
        'container-types-title': 'أنواع الحاويات:',
        'vertical-systems-title': 'أنواع الأنظمة العمودية:',
        'vertical-perfect-plants-title': 'النباتات المثالية:',
        'hydroponic-systems-title': 'أنواع الأنظمة:',
        'hydroponic-equipment-title': 'المعدات المطلوبة:',
        'permaculture-design-title': 'عناصر التصميم:',
        'permaculture-benefits-title': 'الفوائد:',
        'shade-plants-title': 'النباتات المحبة للظل:',
        'shade-design-title': 'نصائح التصميم:',
        'indoor-plants-title': 'النباتات الداخلية السهلة:',
        'indoor-conditions-title': 'ظروف النمو:',
        
        // Garden Styles Expanded Content
        // Container Gardening Content
        'container-herbs': '• الأعشاب: الريحان، إكليل الجبل، الزعتر، البقدونس',
        'container-vegetables': '• الخضروات: الطماطم، الفلفل، الخس، الفاصوليا',
        'container-flowers': '• الزهور: البتونيا، القطيفة، البنفسج',
        'container-fruits': '• الفواكه: الفراولة، أشجار الحمضيات القزمة',
        'container-terracotta': '• الطين المحروق: تصريف جيد، مظهر كلاسيكي',
        'container-plastic': '• البلاستيك: خفيف الوزن، يحتفظ بالرطوبة',
        'container-ceramic': '• السيراميك: جميل لكن ثقيل',
        'container-wood': '• الخشب: مظهر طبيعي، عزل جيد',
        
        // Vertical Gardening Content
        'vertical-living-walls': '• الجدران الحية: أنظمة زراعة قائمة على التربة',
        'vertical-hydroponic-towers': '• الأبراج المائية: أنظمة عمودية بدون تربة',
        'vertical-pocket-planters': '• أحواض الجيوب: أكياس من القماش أو البلاستيك',
        'vertical-trellis-systems': '• أنظمة التعريش: دعم للنباتات المتسلقة',
        'vertical-climbing-vines': '• الكروم المتسلقة: البازلاء، الفاصوليا، الخيار',
        'vertical-trailing-plants': '• النباتات المتدلية: الفراولة، أبو خنجر',
        'vertical-compact-vegetables': '• الخضروات المدمجة: الخس، السبانخ، الأعشاب',
        
        // Hydroponic Gardening Content
        'hydroponic-dwc': '• DWC (الزراعة المائية العميقة): جذور في محلول مغذي',
        'hydroponic-nft': '• NFT (تقنية الفيلم المغذي): فيلم رقيق من المغذيات',
        'hydroponic-ebb-flow': '• المد والجزر: نظام إغراق دوري',
        'hydroponic-aeroponic': '• الزراعة الهوائية: جذور معلقة في الهواء، مرشوشة',
        'hydroponic-containers': '• حاويات الزراعة ووسط النمو',
        'hydroponic-pumps': '• مضخات الماء والهواء',
        'hydroponic-testing': '• أطقم اختبار الحموضة والمغذيات',
        'hydroponic-lights': '• أضواء LED للنمو للأنظمة الداخلية',
        
        // Permaculture Content
        'permaculture-food-forests': '• غابات الطعام: أنظمة زراعة متعددة الطبقات',
        'permaculture-water-harvesting': '• حصاد المياه: جمع وإدارة مياه الأمطار',
        'permaculture-companion-planting': '• الزراعة المصاحبة: نباتات مفيدة متبادلة',
        'permaculture-pest-management': '• إدارة الآفات الطبيعية: التوازن البيئي',
        'permaculture-low-maintenance': '• صيانة مخفضة مع مرور الوقت',
        'permaculture-soil-health': '• تحسين صحة التربة والتنوع البيولوجي',
        'permaculture-resilient': '• مقاوم للتغيرات المناخية',
        'permaculture-productive': '• ينتج الطعام والدواء والمواد',
        
        // Shade Gardens Content
        'shade-hostas': '• الهوستا: أوراق شجر دراماتيكية في أصناف كثيرة',
        'shade-ferns': '• السراخس: نباتات ملمس قديمة وأنيقة',
        'shade-impatiens': '• اللمسة: أزهار سنوية ملونة',
        'shade-astilbe': '• الأستيلب: ريش رقيق من الزهور',
        'shade-heuchera': '• الهيوكيرا: نباتات معمرة بأوراق ملونة',
        'shade-light-plants': '• استخدم نباتات فاتحة اللون لإضاءة المناطق المظلمة',
        'shade-paths-seating': '• أضف مسارات ومقاعد للاستمتاع',
        'shade-layer-height': '• رتب النباتات حسب الارتفاع للعمق',
        'shade-fragrant-plants': '• اشمل نباتات عطرة للجاذبية الحسية',
        
        // Indoor Gardening Content
        'indoor-pothos': '• البوثوس: كرمة قليلة الصيانة',
        'indoor-snake-plant': '• نبات الثعبان: يتحمل الإضاءة المنخفضة',
        'indoor-spider-plant': '• نبات العنكبوت: سهل التكاثر',
        'indoor-peace-lily': '• زنبقة السلام: أزهار جميلة',
        'indoor-herbs': '• الأعشاب: الريحان، النعناع، البقدونس',
        'indoor-light': '• الإضاءة: نوافذ جنوبية أو أضواء نمو',
        'indoor-temperature': '• درجة الحرارة: معظم النباتات تفضل 18-24 درجة مئوية',
        'indoor-humidity': '• الرطوبة: استخدم أجهزة ترطيب أو صواني حصى',
        'indoor-soil': '• التربة: استخدم مخاليط تأصيص عالية الجودة',
        
        // Plant Care
        'plant-care-title': 'العناية الخبيرة بالنباتات',
        'plant-care-intro': 'أتقن أساسيات العناية بالنباتات مع أدلتنا الشاملة التي تغطي الري ومكافحة الآفات وإدارة الأمراض.',
        'watering-guide-title': 'دليل الري',
        'watering-intro': 'أتقن فن الترطيب المناسب للنباتات مع هذه التقنيات الأساسية:',
        'watering-tip-1': '• تحقق من رطوبة التربة قبل الري',
        'watering-tip-2': '• اسق بعمق لكن بتكرار أقل',
        'watering-tip-3': '• الري الصباحي عادة أفضل',
        'watering-tip-4': '• اضبط التكرار حسب الموسم والطقس',
        'watering-expand-btn': 'انقر للمزيد من المحتوى',
        'watering-signs-title': 'علامات مشاكل الري:',
        'watering-overwater': '• فرط الري: أوراق صفراء، عفن الجذور، نمو فطري',
        'watering-underwater': '• نقص الري: ذبول، تربة جافة، حواف أوراق بنية',
        
        'pest-control-title': 'مكافحة الآفات',
        'pest-intro': 'احم نباتاتك من الآفات الشائعة بستراتيجيات إدارة متكاملة:',
        'pest-tip-1': '• التفتيش المنتظم والاكتشاف المبكر',
        'pest-tip-2': '• شجع الحشرات المفيدة',
        'pest-tip-3': '• استخدم العلاجات العضوية عند الإمكان',
        'pest-tip-4': '• حافظ على صحة النباتات للمقاومة',
        'pest-expand-btn': 'انقر للمزيد من المحتوى',
        'pest-common-title': 'آفات الحديقة الشائعة:',
        'pest-aphids': '• المن: حشرات صغيرة طرية الجسم على النمو الجديد',
        'pest-spider-mites': '• عث العنكبوت: آفات صغيرة تسبب أوراق منقطة',
        'pest-whiteflies': '• الذباب الأبيض: حشرات بيضاء صغيرة طائرة',
        
        'disease-mgmt-title': 'إدارة الأمراض',
        'disease-intro': 'امنع وعالج أمراض النباتات بتقنيات إدارة مناسبة:',
        'disease-tip-1': '• ضمن دوران هواء مناسب',
        'disease-tip-2': '• تجنب الري من الأعلى',
        'disease-tip-3': '• أزل المواد النباتية المصابة',
        'disease-tip-4': '• اختر أصناف مقاومة للأمراض',
        'disease-expand-btn': 'انقر للمزيد من المحتوى',
        'disease-common-title': 'أمراض النباتات الشائعة:',
        'disease-powdery-mildew': '• البياض الدقيقي: طلاء أبيض مسحوقي على الأوراق',
        'disease-black-spot': '• البقعة السوداء: بقع داكنة على الأوراق والسيقان',
        'disease-root-rot': '• عفن الجذور: جذور طرية وداكنة من فرط الري',

        // Seasonal Tips
        'seasonal-tips-title': 'نصائح البستنة الموسمية',
        'seasonal-tips-intro': 'اكتشف إرشادات موسمية محددة للحفاظ على حديقتك مزدهرة على مدار السنة مع تقويمنا الشامل للبستنة الموسمية.',
        
        'spring-title': 'الربيع',
        'spring-period': 'مارس - مايو',
        'spring-description': 'موسم التجديد والنمو. حضر حديقتك لموسم النمو القادم.',
        'spring-tasks-title': 'مهام أساسية:',
        'spring-task-1': 'ابدأ البذور في الداخل لمحاصيل الموسم الدافئ',
        'spring-task-2': 'حضر أحواض الحديقة وأضف السماد العضوي',
        'spring-task-3': 'قلم أشجار الفاكهة والشجيرات المزهرة',
        'spring-task-4': 'ابدأ مراقبة الآفات والأمراض',
        
        'summer-title': 'الصيف',
        'summer-period': 'يونيو - أغسطس',
        'summer-description': 'موسم النمو الذروة مع محاصيل وفيرة. ركز على الصيانة وإدارة المياه.',
        'summer-tasks-title': 'مهام أساسية:',
        'summer-task-1': 'ري عميق خلال الفترات الحارة والجافة',
        'summer-task-2': 'احصد الخضروات عند النضج الأمثل',
        'summer-task-3': 'أزل الأزهار الذابلة لتشجيع الإزهار',
        'summer-task-4': 'راقب وعالج إصابات الآفات',
        
        'autumn-title': 'الخريف',
        'autumn-period': 'سبتمبر - نوفمبر',
        'autumn-description': 'وقت الحصاد والتحضير للشتاء. ركز على التنظيف والحماية.',
        'autumn-tasks-title': 'مهام أساسية:',
        'autumn-task-1': 'احصد المحاصيل المتبقية قبل الصقيع',
        'autumn-task-2': 'ازرع بصيلات الإزهار الربيعي',
        'autumn-task-3': 'نظف الأوراق المتساقطة والحطام',
        'autumn-task-4': 'احم النباتات الحساسة من البرد',
        
        'winter-title': 'الشتاء',
        'winter-period': 'ديسمبر - فبراير',
        'winter-description': 'موسم التخطيط والحماية. ركز على الزراعة الداخلية وتخطيط الحديقة.',
        'winter-tasks-title': 'مهام أساسية:',
        'winter-task-1': 'خطط لتخطيط الحديقة للعام القادم',
        'winter-task-2': 'اطلب البذور وكتالوجات النباتات',
        'winter-task-3': 'اعتن بالنباتات المنزلية والأعشاب الداخلية',
        'winter-task-4': 'تحقق من وصيانة أدوات الحديقة',
        
        // Membership
        'membership-title': 'اختر رحلة البستنة الخاصة بك',
        'membership-intro': 'احصل على إرشادات الخبراء وتشخيص النباتات بالذكاء الاصطناعي والميزات المتميزة لرفع البستنة إلى المستوى التالي',
        
        'basic-membership-name': 'العضوية الأساسية',
        'basic-membership-subtitle': 'مثالية للمبتدئين في البستنة',
        'basic-monthly-title': 'الخطة الشهرية',
        'basic-yearly-title': 'الخطة السنوية',
        'basic-save-badge': 'وفر 20%',
        'basic-feature-1': 'خصومات الأعضاء',
        'basic-feature-2': 'نشرة أسبوعية',
        'basic-feature-3': 'تحديد أساسي للنباتات',
        'basic-feature-4': 'الوصول لمنتدى المجتمع',
        
        'green-thumb-name': 'عضوية الإبهام الأخضر',
        'green-thumb-subtitle': 'للبستانيين الجادين وعشاق النباتات',
        'green-thumb-monthly-title': 'الخطة الشهرية',
        'green-thumb-yearly-title': 'الخطة السنوية',
        'green-thumb-save-badge': 'وفر 20%',
        'most-popular-badge': 'الأكثر شعبية',
        'green-thumb-feature-1': 'كل شيء في الخطة الأساسية',
        'green-thumb-feature-2': 'تخطيط الحديقة بالذكاء الاصطناعي والرؤى',
        'green-thumb-feature-3': 'استشارات الخبراء والدعم',
        'green-thumb-feature-4': 'ذكاء اصطناعي متقدم لتحديد الأمراض',
        'green-thumb-feature-5': 'تقاويم خاصة بالموقع',
        
        // Newsletter
        'newsletter-title': 'انضم لمجتمع الحدائق',
        'newsletter-description': 'احصل على نصائح بستنة أسبوعية ونصائح موسمية ومحتوى حصري في بريدك الوارد.',
        'newsletter-submit-btn': 'اشترك مجاناً',
        
        // Plant Doctor
        'plant-doctor-title': 'دكتور النباتات - تحليل ذكي للنباتات',
        'plant-doctor-description': 'ارفع أو التقط صورة لنباتك للحصول على تحليل ذكي فوري وتوصيات خبيرة.',
        'free-analysis-counter': '3 تحليلات مجانية يومياً',
        'analysis-left': 'متبقية',
        'no-analysis-left': 'لا توجد تحليلات مجانية متبقية اليوم',
        'upgrade-basic-prompt': 'ترقى للعضوية الأساسية ($4.99/شهر) لتحديد وتحليل نباتات غير محدود.',
        'upgrade-now': 'ترقى الآن',
        'maybe-later': 'ربما لاحقاً',
        
        'stat-plants-analyzed': 'النباتات المحللة',
        'stat-accuracy-rate': 'معدل الدقة',
        'stat-instant-analysis': 'تحليل فوري',
        
        'upload-title': 'اسحب وأفلت صورة نباتك هنا',
        'upload-description': 'أو انقر للاختيار من جهازك',
        'upload-file-btn': 'رفع ملف',
        'take-photo-btn': 'التقط صورة',
        'analyze-btn': 'حلل النبات',
        
        // Plant identification step
        'identification-title': 'تحديد النبات',
        'identified-plant': 'حددنا نباتك كـ:',
        'plant-name-label': 'اسم النبات:',
        'is-this-correct': 'هل هذا التحديد صحيح؟',
        'yes-correct': 'نعم، هذا صحيح',
        'no-incorrect': 'لا، هذا غير صحيح',
        'provide-plant-name': 'يرجى تقديم اسم النبات الصحيح:',
        'continue-analysis': 'متابعة لتحليل الأمراض',
        
        'analysis-complete-title': 'التحليل مكتمل!',
        'analysis-plant-name': 'وردة (Rosa)',
        'analysis-health-title': 'الحالة الصحية:',
        'analysis-health-status': 'نباتك يبدو في حالة صحية ممتازة!',
        'analysis-recommendations-title': 'التوصيات:',
        'analysis-rec-1': '• اسق بانتظام لكن تجنب فرط الري',
        'analysis-rec-2': '• ضمن التصريف الجيد',
        'analysis-rec-3': '• وفر 6-8 ساعات ضوء شمس يومياً',
        'analysis-confidence': 'الثقة: 98% - التحليل مبني على جودة الصورة وخصائص النبات.',
        'analyze-another-btn': 'حلل نبات آخر',
        
        // Footer
        'footer-description': 'رفيقك الموثوق للبستنة الناجحة. من نصائح المبتدئين إلى التقنيات المتقدمة، نساعدك في زراعة حديقة أحلامك.',
        'footer-quick-links-title': 'روابط سريعة',
        'footer-home': 'الرئيسية',
        'footer-garden-styles': 'أساليب الحدائق',
        'footer-plant-care': 'العناية بالنباتات',
        'footer-plant-doctor': 'دكتور النباتات',
        'footer-contact-title': 'تواصل معنا',
        'footer-contact-description': 'انضم لمجتمعنا من البستانيين المتحمسين وابدأ رحلتك نحو نجاح البستنة اليوم.',
        'footer-copyright': '© 2025 Garden with Serge. جميع الحقوق محفوظة.'
    }
};

// Language switching functionality
let currentLanguage = 'en';

function updateContent(language) {
    const elements = translations[language];
    if (!elements) return;

    // Update all translatable elements (textContent)
    Object.keys(elements).forEach(key => {
        const element = document.getElementById(key);
        if (element) element.textContent = elements[key];
    });

    // Translate guide pages
    ['soil', 'compost', 'prune'].forEach(t => translateGuidePage(t, language));

    // Facebook link
    const fbLink = document.getElementById('footer-facebook-link');
    if (fbLink && elements['footer-facebook-url']) {
        fbLink.href = elements['footer-facebook-url'];
    }

    // Newsletter placeholder
    const newsletterEmail = document.getElementById('newsletter-email');
    if (newsletterEmail && elements['newsletter-email-placeholder']) {
        newsletterEmail.placeholder = elements['newsletter-email-placeholder'];
    }
}
    // Set newsletter email input placeholder
    const newsletterEmail = document.getElementById('newsletter-email');
    if (newsletterEmail && elements['newsletter-email-placeholder']) {
        newsletterEmail.placeholder = elements['newsletter-email-placeholder'];
    }
	
    
    // Update expandable content buttons with current language
    updateExpandableButtons(language);
    
    // Initialize free analysis counter text
    const freeAnalysisText = elements['free-analysis-counter'] || '3 Free analysis per day';
    const freeCounterElement = document.getElementById('free-analysis-counter');
    const freeCounterTextElement = document.getElementById('free-analysis-counter-text');
    if (freeCounterElement && !freeCounterElement.textContent) {
        freeCounterElement.textContent = freeAnalysisText;
    }
    if (freeCounterTextElement && !freeCounterTextElement.textContent) {
        freeCounterTextElement.textContent = freeAnalysisText;
    }
    
    // Update analysis counter with current language
    if (typeof updateAnalysisCounter === 'function') {
        updateAnalysisCounter();
    }
    
    // Update direction for RTL languages
    const body = document.body;
    if (language === 'ar') {
        body.setAttribute('dir', 'rtl');
        body.classList.add('rtl');
    } else {
        body.setAttribute('dir', 'ltr');
        body.classList.remove('rtl');
    }
	// Set the "Continue to Disease Analysis" button text when language changes
const continueBtn = document.getElementById('continue-analysis-btn');
if (continueBtn) {
    continueBtn.textContent = t('continue-analysis');
}
}

// Function to update all expandable content buttons with current language
function updateExpandableButtons(language) {
    const elements = translations[language];
    if (!elements) return;
    
    // Get translated text for buttons
    const hideText = elements['click-hide-content'] || 'Click to hide content';
    const moreText = elements['click-more-content'] || 'Click for more content';
    
    // Update all expandable content buttons
    const expandButtons = document.querySelectorAll('[id$="-expand-btn"]');
    expandButtons.forEach(button => {
        const sectionId = button.id.replace('-expand-btn', '');
        
        // Check if content is expanded by looking for expanded elements
        const expandedElement = document.getElementById(sectionId + '-expanded') || 
                               document.getElementById(sectionId + '-expanded-content');
        
        if (expandedElement) {
            if (expandedElement.classList.contains('hidden')) {
                button.textContent = moreText;
            } else {
                button.textContent = hideText;
            }
        }
    });
}

function changeLanguage(langCode, flag, shortName) {
    currentLanguage = langCode;
    
    // Update main language display
    document.getElementById('current-flag').textContent = flag;
    document.getElementById('current-language').textContent = shortName;
    
    // Update mobile language display if exists
    const mobileFlag = document.getElementById('current-flag-mobile');
    const mobileLang = document.getElementById('current-language-mobile');
    if (mobileFlag) mobileFlag.textContent = flag;
    if (mobileLang) mobileLang.textContent = shortName;
    
    // Update content
    updateContent(langCode);
    
    // Close dropdown
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
    
    // Store language preference
    localStorage.setItem('preferred-language', langCode);
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    let storedLang = localStorage.getItem('preferred-language');
    if (!storedLang || !translations[storedLang]) {
        storedLang = 'en';
        localStorage.setItem('preferred-language', 'en');
    }
    const langInfo = {
        'en': { flag: '🇺🇸', short: 'EN' },
        'es': { flag: '🇪🇸', short: 'ES' },
        'fr': { flag: '🇫🇷', short: 'FR' },
        'de': { flag: '🇩🇪', short: 'DE' },
        'el': { flag: '🇬🇷', short: 'EL' },
        'ru': { flag: '🇷🇺', short: 'RU' },
        'ar': { flag: '🇸🇦', short: 'AR' }
    };
    const info = langInfo[storedLang] || langInfo['en'];
    changeLanguage(storedLang, info.flag, info.short);
});
window.changeLanguage = changeLanguage;
console.log("changeLanguage is now global:", typeof window.changeLanguage);
function t(key) {
  return translations[currentLanguage][key] || translations['en'][key] || key;
}
// Make translateGuidePage available globally
window.translateGuidePage = function(topic, lang) {
  const langObj = translations[lang] || translations.en;
  const titleEl = document.getElementById(topic + '-guide-title-full');
  const bodyEl  = document.getElementById(topic + '-guide-content');

  if (titleEl) titleEl.textContent = langObj[topic + '_guide_title_full'] || topic;
  if (bodyEl)  bodyEl.innerHTML    = langObj[topic + '_guide_body'] || '<p>Guide coming soon…</p>';
};
