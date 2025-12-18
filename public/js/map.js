// Leaflet map with curated student spots in Madrid
// Initialize map and add markers for popular student locations

let map;
let markers = [];
let currentCategory = 'all';

// Helper function to get CSS variable value
function getCSSVariable(variableName) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
}

// Color mapping using CSS variables
const colors = {
    primary: () => getCSSVariable('--color-primary'),
    accent: () => getCSSVariable('--color-accent'),
    orange: () => getCSSVariable('--color-orange'),
    secondary: () => getCSSVariable('--color-secondary'),
    white: () => getCSSVariable('--color-white'),
    textInk: () => getCSSVariable('--text-ink'),
    textMuted: () => getCSSVariable('--text-muted'),
    grayLight: () => getCSSVariable('--color-gray-light'),
    grayMedium: () => getCSSVariable('--color-gray-medium'),
    shadowBlack10: () => getCSSVariable('--shadow-black-10'),
    shadowBlack20: () => getCSSVariable('--shadow-black-20')
};

// Curated list of student spots from all guides
const studentSpots = [
    // ============================================
    // RESTAURANTS - From Cheap Student Meals Guide
    // ============================================
    {
        name: 'Bar El Tigre',
        lat: 40.4203,
        lng: -3.6988,
        category: 'restaurant',
        description: 'Legendary student favorite. Order a drink, get free tapas. Arrive around 8pm for biggest portions.',
        neighborhood: 'Chueca',
        price: '€',
        article: '/eat-drink/restaurants/cheap-student-meals.html'
    },
    {
        name: 'Restaurante La Barraca',
        lat: 40.4453,
        lng: -3.7276,
        category: 'restaurant',
        description: 'Huge portions, €10 menú del día includes wine or beer. Near Complutense.',
        neighborhood: 'Moncloa',
        price: '€',
        article: '/eat-drink/restaurants/cheap-student-meals.html'
    },
    {
        name: '100 Montaditos',
        lat: 40.4350,
        lng: -3.7198,
        category: 'restaurant',
        description: '€1 mini sandwiches on Wednesdays and Sundays. Perfect for groups.',
        neighborhood: 'Moncloa',
        price: '€',
        article: '/eat-drink/restaurants/cheap-student-meals.html'
    },
    {
        name: 'La Taquería de Birra',
        lat: 40.4401,
        lng: -3.7234,
        category: 'restaurant',
        description: 'Authentic Mexican with huge portions. €7-9 meals near Ciudad Universitaria.',
        neighborhood: 'Moncloa',
        price: '€',
        article: '/eat-drink/restaurants/cheap-student-meals.html'
    },

    // ============================================
    // MARKETS - From Madrid Markets Guide
    // ============================================
    {
        name: 'Mercado de Antón Martín',
        lat: 40.4115,
        lng: -3.6998,
        category: 'restaurant',
        description: 'The real deal. Spanish grandmas, students, and authentic food. €5-12 meals.',
        neighborhood: 'Lavapiés',
        price: '€',
        article: '/eat-drink/restaurants/madrid-markets.html'
    },
    {
        name: 'Mercado de Vallehermoso',
        lat: 40.4365,
        lng: -3.7055,
        category: 'restaurant',
        description: 'Hidden gem in Chamberí. Less crowded, great tapas, actual sitting areas.',
        neighborhood: 'Chamberí',
        price: '€€',
        article: '/eat-drink/restaurants/madrid-markets.html'
    },
    {
        name: 'Mercado de San Fernando',
        lat: 40.4088,
        lng: -3.7015,
        category: 'restaurant',
        description: 'Multicultural Lavapiés market. Artsy vibe, diverse food, budget-friendly.',
        neighborhood: 'Lavapiés',
        price: '€',
        article: '/eat-drink/restaurants/madrid-markets.html'
    },
    {
        name: 'Mercado de San Miguel',
        lat: 40.4150,
        lng: -3.7088,
        category: 'restaurant',
        description: 'Beautiful tourist market near Plaza Mayor. Share plates to keep it affordable.',
        neighborhood: 'Centro',
        price: '€€',
        article: '/eat-drink/restaurants/madrid-markets.html'
    },

    // ============================================
    // BARS - From Best Bars Guide
    // ============================================
    {
        name: 'La Visitación de la Virgen',
        lat: 40.4262,
        lng: -3.7045,
        category: 'bar',
        description: 'Cheapest bar in Malasaña. €2 beers, €3 vermouth. Tiny, authentic, perfect for pre-drinks.',
        neighborhood: 'Malasaña',
        price: '€',
        article: '/eat-drink/bars/best-bars-madrid.html'
    },
    {
        name: 'Ojalá',
        lat: 40.4252,
        lng: -3.7028,
        category: 'bar',
        description: 'Famous beach bar with sand floor downstairs. Great cocktails €6-9.',
        neighborhood: 'Malasaña',
        price: '€€',
        article: '/eat-drink/bars/best-bars-madrid.html'
    },
    {
        name: 'Fábrica Maravillas',
        lat: 40.4268,
        lng: -3.7035,
        category: 'bar',
        description: 'Craft beer brewed on-site. €4-7 for quality beer. Not pretentious.',
        neighborhood: 'Malasaña',
        price: '€€',
        article: '/eat-drink/bars/best-bars-madrid.html'
    },
    {
        name: 'Wurlitzer Ballroom',
        lat: 40.4258,
        lng: -3.7042,
        category: 'bar',
        description: 'Vintage bar with dance floor. Dancing without club cover charges.',
        neighborhood: 'Malasaña',
        price: '€€',
        article: '/eat-drink/bars/best-bars-madrid.html'
    },
    {
        name: 'Irreale',
        lat: 40.4245,
        lng: -3.7038,
        category: 'bar',
        description: 'Speakeasy-style cocktail bar. Perfect for dates. €8-12 cocktails.',
        neighborhood: 'Malasaña',
        price: '€€',
        article: '/eat-drink/bars/best-bars-madrid.html'
    },
    {
        name: 'Kikekeller',
        lat: 40.4215,
        lng: -3.6975,
        category: 'bar',
        description: 'Tiny basement bar in Chueca. LGBTQ+ friendly, cheap drinks, great music.',
        neighborhood: 'Chueca',
        price: '€',
        article: '/eat-drink/bars/best-bars-madrid.html'
    },
    {
        name: 'La Vía Láctea',
        lat: 40.4255,
        lng: -3.7052,
        category: 'bar',
        description: 'Legendary Malasaña dive bar since the 80s. Super cheap, punk rock vibes.',
        neighborhood: 'Malasaña',
        price: '€',
        article: '/eat-drink/bars/best-bars-madrid.html'
    },
    {
        name: 'Gorila',
        lat: 40.4248,
        lng: -3.7032,
        category: 'bar',
        description: 'Reliable neighborhood bar. Good drinks, friendly staff, comfortable.',
        neighborhood: 'Malasaña',
        price: '€€',
        article: '/eat-drink/bars/best-bars-madrid.html'
    },
    {
        name: 'Sala Equis',
        lat: 40.4095,
        lng: -3.7008,
        category: 'bar',
        description: 'Converted cinema with huge patio. Perfect for groups and board games.',
        neighborhood: 'Lavapiés',
        price: '€€',
        article: '/eat-drink/bars/best-bars-madrid.html'
    },
    {
        name: 'Tupperware',
        lat: 40.4260,
        lng: -3.7048,
        category: 'bar',
        description: 'Eclectic bar with DJ sets. Fun vibes, late nights without cover.',
        neighborhood: 'Malasaña',
        price: '€€',
        article: '/eat-drink/bars/best-bars-madrid.html'
    },
    {
        name: 'Cervecería La Ardosa',
        lat: 40.4272,
        lng: -3.7038,
        category: 'bar',
        description: 'Classic Madrid cervecería since 1892. Famous tortilla, €3 vermouth.',
        neighborhood: 'Malasaña',
        price: '€',
        article: '/eat-drink/bars/best-bars-madrid.html'
    },

    // ============================================
    // CLUBS - From Clubbing Guide
    // ============================================
    {
        name: 'Independance Club',
        lat: 40.4098,
        lng: -3.7025,
        category: 'bar',
        description: 'Budget indie/alternative club. Free entry before 1:30am most nights.',
        neighborhood: 'Lavapiés',
        price: '€',
        article: '/eat-drink/bars/clubbing-guide.html'
    },
    {
        name: 'Sala Cool',
        lat: 40.4198,
        lng: -3.7015,
        category: 'bar',
        description: 'Mainstream club near Gran Vía. Reggaeton, Latin hits. €12-15 with drink.',
        neighborhood: 'Centro',
        price: '€€',
        article: '/eat-drink/bars/clubbing-guide.html'
    },
    {
        name: 'Kapital',
        lat: 40.4108,
        lng: -3.6935,
        category: 'bar',
        description: 'Iconic 7-floor mega-club. Thursday student nights. Must-do experience.',
        neighborhood: 'Atocha',
        price: '€€',
        article: '/eat-drink/bars/clubbing-guide.html'
    },
    {
        name: 'Mondo Disko',
        lat: 40.4325,
        lng: -3.7065,
        category: 'bar',
        description: 'Disco, funk, soul club. For people who want to actually dance.',
        neighborhood: 'Chamberí',
        price: '€€',
        article: '/eat-drink/bars/clubbing-guide.html'
    },
    {
        name: 'Chango',
        lat: 40.4265,
        lng: -3.7055,
        category: 'bar',
        description: 'Latin club in Malasaña. Less touristy than Sala Cool, good energy.',
        neighborhood: 'Malasaña',
        price: '€€',
        article: '/eat-drink/bars/clubbing-guide.html'
    },
    {
        name: 'Sala But',
        lat: 40.4218,
        lng: -3.6968,
        category: 'bar',
        description: 'LGBTQ+ friendly club in Chueca. Pop hits, inclusive atmosphere.',
        neighborhood: 'Chueca',
        price: '€€',
        article: '/eat-drink/bars/clubbing-guide.html'
    },
    {
        name: 'Fabrik',
        lat: 40.3215,
        lng: -3.7985,
        category: 'bar',
        description: 'Massive warehouse rave outside Madrid. Techno until sunrise.',
        neighborhood: 'Fuenlabrada',
        price: '€€',
        article: '/eat-drink/bars/clubbing-guide.html'
    },

    // ============================================
    // LIBRARIES - From Free Study Spots Guide
    // ============================================
    {
        name: 'Biblioteca Nacional de España',
        lat: 40.4238,
        lng: -3.6892,
        category: 'study',
        description: 'The crown jewel. Stunning reading rooms, free Wi-Fi. Need reader\'s card.',
        neighborhood: 'Recoletos',
        article: '/survival/study-spots/free-study-spots.html'
    },
    {
        name: 'Biblioteca Eugenio Trías (Retiro)',
        lat: 40.4165,
        lng: -3.6825,
        category: 'study',
        description: 'Modern library inside Retiro Park. Glass building, natural light, terraces.',
        neighborhood: 'Retiro',
        article: '/survival/study-spots/free-study-spots.html'
    },
    {
        name: 'Biblioteca Regional Joaquín Leguina',
        lat: 40.4055,
        lng: -3.6985,
        category: 'study',
        description: 'Huge regional library. Group study rooms, always seats available.',
        neighborhood: 'Embajadores',
        article: '/survival/study-spots/free-study-spots.html'
    },
    {
        name: 'Círculo de Bellas Artes Library',
        lat: 40.4185,
        lng: -3.6975,
        category: 'study',
        description: 'Free library in gorgeous cultural center. Quiet, artsy atmosphere.',
        neighborhood: 'Centro',
        article: '/survival/study-spots/free-study-spots.html'
    },
    {
        name: 'Casa del Lector (Matadero)',
        lat: 40.3925,
        lng: -3.6975,
        category: 'study',
        description: 'Modern reading space at Matadero arts center. Creative atmosphere.',
        neighborhood: 'Legazpi',
        article: '/survival/study-spots/free-study-spots.html'
    },

    // ============================================
    // STUDY CAFÉS - From Study Cafés Guide
    // ============================================
    {
        name: 'OSOM Coffee Lab',
        lat: 40.4355,
        lng: -3.7018,
        category: 'cafe',
        description: 'The gold standard for study cafés. Large tables, natural light, specialty coffee.',
        neighborhood: 'Chamberí',
        price: '€€',
        article: '/survival/study-spots/study-cafes.html'
    },
    {
        name: 'Casa Victoria',
        lat: 40.4285,
        lng: -3.7025,
        category: 'cafe',
        description: 'Budget pick. Traditional café, laptop-friendly, €2.50 coffee.',
        neighborhood: 'Malasaña',
        price: '€',
        article: '/survival/study-spots/study-cafes.html'
    },
    {
        name: 'Delish Vegan Doughnuts',
        lat: 40.4225,
        lng: -3.6985,
        category: 'cafe',
        description: 'Cozy café in Chueca. Perfect for solo study, amazing snacks.',
        neighborhood: 'Chueca',
        price: '€€',
        article: '/survival/study-spots/study-cafes.html'
    },
    {
        name: 'Hola Coffee Lagasca',
        lat: 40.4265,
        lng: -3.6845,
        category: 'cafe',
        description: 'Serious focus mode. Minimalist, quiet, everyone working.',
        neighborhood: 'Salamanca',
        price: '€€',
        article: '/survival/study-spots/study-cafes.html'
    },
    {
        name: 'Café de la Luz',
        lat: 40.4275,
        lng: -3.7008,
        category: 'cafe',
        description: 'Traditional café with warm vibes. Great for reading and writing.',
        neighborhood: 'Malasaña',
        price: '€',
        article: '/survival/study-spots/study-cafes.html'
    },
    {
        name: 'La Infinito Specialty Coffee',
        lat: 40.4242,
        lng: -3.7015,
        category: 'cafe',
        description: 'Reliable pick. Modern, relaxed, good for solo and group study.',
        neighborhood: 'Malasaña',
        price: '€€',
        article: '/survival/study-spots/study-cafes.html'
    },

    // ============================================
    // MUSEUMS - From Free Museums Guide
    // ============================================
    {
        name: 'Museo del Prado',
        lat: 40.4138,
        lng: -3.6921,
        category: 'culture',
        description: 'World-class art museum. Free last 2 hours daily. Velázquez, Goya, Bosch.',
        neighborhood: 'Retiro',
        article: '/city-life/culture/free-museums-january.html'
    },
    {
        name: 'Museo Reina Sofía',
        lat: 40.4085,
        lng: -3.6945,
        category: 'culture',
        description: 'Modern art museum. Home to Guernica. Free Mon, Wed-Sat evenings.',
        neighborhood: 'Atocha',
        article: '/city-life/culture/free-museums-january.html'
    },
    {
        name: 'Museo Thyssen-Bornemisza',
        lat: 40.4160,
        lng: -3.6948,
        category: 'culture',
        description: 'Diverse art collection. Free all day Monday. Renaissance to modern.',
        neighborhood: 'Centro',
        article: '/city-life/culture/free-museums-january.html'
    },
    {
        name: 'Museo de Historia de Madrid',
        lat: 40.4278,
        lng: -3.7025,
        category: 'culture',
        description: 'Always free. Madrid history from medieval to today. In Malasaña.',
        neighborhood: 'Malasaña',
        article: '/city-life/culture/free-museums-january.html'
    },
    {
        name: 'CaixaForum Madrid',
        lat: 40.4108,
        lng: -3.6932,
        category: 'culture',
        description: 'Free permanent collection. Stunning vertical garden outside.',
        neighborhood: 'Atocha',
        article: '/city-life/culture/free-museums-january.html'
    },
    {
        name: 'Andén 0 (Ghost Metro Station)',
        lat: 40.4335,
        lng: -3.7065,
        category: 'culture',
        description: 'Always free. Museum in abandoned Chamberí metro station.',
        neighborhood: 'Chamberí',
        article: '/city-life/culture/free-museums-january.html'
    },

    // ============================================
    // HISTORIC SITES - From Free Tours Guide
    // ============================================
    {
        name: 'Plaza Mayor',
        lat: 40.4155,
        lng: -3.7074,
        category: 'culture',
        description: 'Habsburg masterpiece from 1619. Free to explore. Best weekday mornings.',
        neighborhood: 'Centro',
        article: '/city-life/culture/free-tours-history.html'
    },
    {
        name: 'Puerta del Sol',
        lat: 40.4169,
        lng: -3.7035,
        category: 'culture',
        description: 'Madrid\'s center. Bear statue, Kilometer Zero. Free walking tours start here.',
        neighborhood: 'Centro',
        article: '/city-life/culture/free-tours-history.html'
    },
    {
        name: 'Casa Museo de Lope de Vega',
        lat: 40.4135,
        lng: -3.6985,
        category: 'culture',
        description: 'Writer\'s house from the 1600s. Usually €3, sometimes free.',
        neighborhood: 'Barrio de las Letras',
        article: '/city-life/culture/free-tours-history.html'
    },
    {
        name: 'Convento de las Trinitarias',
        lat: 40.4128,
        lng: -3.6992,
        category: 'culture',
        description: 'Where Cervantes is buried. External viewing only, free.',
        neighborhood: 'Barrio de las Letras',
        article: '/city-life/culture/free-tours-history.html'
    },
    {
        name: 'Ángel Caído (Fallen Angel)',
        lat: 40.4155,
        lng: -3.6795,
        category: 'culture',
        description: 'One of few Lucifer statues in the world. 666m above sea level.',
        neighborhood: 'Retiro',
        article: '/city-life/culture/free-tours-history.html'
    },
    {
        name: 'Temple of Debod',
        lat: 40.4242,
        lng: -3.7178,
        category: 'culture',
        description: 'Egyptian temple gifted to Spain. Best sunset spot in Madrid. Free.',
        neighborhood: 'Moncloa',
        article: '/city-life/culture/free-tours-history.html'
    },

    // ============================================
    // PARKS & OUTDOOR - From Various Guides
    // ============================================
    {
        name: 'Parque del Retiro',
        lat: 40.4153,
        lng: -3.6845,
        category: 'culture',
        description: 'Madrid\'s central park. Crystal Palace, rowboats, quiet study spots.',
        neighborhood: 'Retiro',
        article: '/survival/study-spots/free-study-spots.html'
    },
    {
        name: 'Cerro del Tío Pío',
        lat: 40.3885,
        lng: -3.6455,
        category: 'culture',
        description: 'Seven hills park with best skyline views. Perfect for sunset.',
        neighborhood: 'Vallecas',
        article: '/city-life/neighborhoods/winter-walks.html'
    },

    // ============================================
    // SUPERMARKETS - From Cheap Meals Guide
    // ============================================
    {
        name: 'Mercadona (Malasaña)',
        lat: 40.4265,
        lng: -3.7035,
        category: 'restaurant',
        description: 'Best supermarket for students. Red sticker discounts after 8pm.',
        neighborhood: 'Malasaña',
        price: '€',
        article: '/eat-drink/restaurants/cheap-student-meals.html'
    }
];

// Get icon emoji based on category
function getCategoryIcon(category) {
    const icons = {
        'restaurant': '🍽️',
        'bar': '🍺',
        'study': '📚',
        'cafe': '☕',
        'culture': '🏛️'
    };
    return icons[category] || '📍';
}

// Create custom icon for markers with category-specific icons
function createMarkerIcon(color, category) {
    const iconEmoji = getCategoryIcon(category);
    const whiteColor = colors.white();
    const shadow20 = colors.shadowBlack20();
    const shadow10 = colors.shadowBlack10();
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div class="marker-container" style="
                background-color: ${color};
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 3px solid ${whiteColor};
                box-shadow: 0 4px 8px ${shadow20}, 0 2px 4px ${shadow10};
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                cursor: pointer;
            ">
                ${iconEmoji}
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    });
}

// Get marker color based on category
function getMarkerColor(category) {
    const categoryColors = {
        'restaurant': colors.accent(),   // accent (peach)
        'bar': colors.orange(),          // orange
        'study': colors.primary(),       // primary (blue)
        'cafe': colors.secondary(),      // secondary (yellow)
        'culture': '#8b5cf6'             // purple for culture
    };
    return categoryColors[category] || colors.primary();
}

// Create popup content with inline styles and Read More link
function createPopupContent(spot) {
    const textInk = colors.textInk();
    const textMuted = colors.textMuted();
    const primary = colors.primary();
    
    let content = `<div style="padding: 0; max-width: 280px; font-family: Georgia, serif;">`;
    content += `<h3 style="font-family: 'Open Sans', Arial, sans-serif; font-weight: 700; font-size: 1.125rem; color: ${textInk}; margin: 0 0 0.5rem 0; line-height: 1.3;">${spot.name}</h3>`;
    content += `<p style="font-family: Georgia, serif; font-size: 0.9375rem; color: ${textInk}; line-height: 1.6; margin: 0 0 0.75rem 0;">${spot.description}</p>`;
    content += `<div style="display: flex; gap: 0.75rem; align-items: center; margin: 0 0 0.75rem 0; font-size: 0.875rem; flex-wrap: wrap;">`;
    if (spot.neighborhood) {
        content += `<span style="color: ${textMuted}; font-family: Georgia, serif;">📍 ${spot.neighborhood}</span>`;
    }
    if (spot.price) {
        content += `<span style="color: ${textInk}; font-weight: 600; font-family: 'Open Sans', sans-serif;">${spot.price}</span>`;
    }
    content += `</div>`;
    if (spot.article) {
        content += `<a href="${spot.article}" style="
            display: inline-block;
            background: ${primary};
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            text-decoration: none;
            font-family: 'Open Sans', sans-serif;
            font-size: 0.875rem;
            font-weight: 600;
            transition: opacity 0.2s;
        " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">Read More →</a>`;
    }
    content += `</div>`;
    return content;
}

// Initialize map
function initMap() {
    // Hide loading indicator
    const loadingIndicator = document.getElementById('map-loading');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
    
    // Center on Madrid center
    const center = [40.4168, -3.7038];
    
    // Initialize map
    map = L.map('map', {
        center: center,
        zoom: 13,
        zoomControl: true
    });
    
    // Add minimal/clean tile layer (CartoDB Positron)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    
    // Add resize handler
    window.addEventListener('resize', function() {
        if (map && markers.length > 0) {
            map.invalidateSize();
            fitMapToMarkers();
        }
    });
    
    // Add all markers
    addMarkers();
    
    // Setup filter buttons
    setupFilters();
}

// Fit map to show all visible markers
function fitMapToMarkers() {
    if (markers.length === 0) {
        return;
    }
    
    const bounds = L.latLngBounds(markers.map(marker => marker.getLatLng()));
    map.fitBounds(bounds, { 
        padding: [50, 50]
    });
    
    // Don't zoom in too much if only one marker
    if (markers.length === 1) {
        map.setZoom(15);
    }
}

// Add markers to map
function addMarkers() {
    // Clear existing markers
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    markers = [];
    
    // Hide no results message
    const noResultsMsg = document.getElementById('map-no-results');
    if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
    
    studentSpots.forEach(spot => {
        // Skip if filtered out
        if (currentCategory !== 'all' && spot.category !== currentCategory) {
            return;
        }
        
        // Choose marker color based on category
        const markerColor = getMarkerColor(spot.category);
        const icon = createMarkerIcon(markerColor, spot.category);
        
        // Create marker
        const marker = L.marker([spot.lat, spot.lng], {
            icon: icon,
            title: spot.name
        }).addTo(map);
        
        // Create popup content
        const popupContent = createPopupContent(spot);
        marker.bindPopup(popupContent, {
            className: 'custom-popup',
            closeButton: true,
            autoPan: true,
            autoPanPadding: [50, 50],
            autoPanPaddingTopLeft: [50, 50],
            autoPanPaddingBottomRight: [50, 50]
        });
        
        markers.push(marker);
    });
    
    // Handle empty filter state
    if (markers.length === 0) {
        // Show no results message
        if (noResultsMsg) {
            noResultsMsg.style.display = 'block';
        }
        // Center on default location
        if (map) {
            map.setView([40.4168, -3.7038], 13);
        }
    } else {
        // Fit map to show all visible markers
        fitMapToMarkers();
    }
}

// Setup filter buttons
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-button-map');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state and ARIA attributes
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
            
            // Update current category
            currentCategory = button.getAttribute('data-category');
            
            // Refresh markers
            addMarkers();
        });
    });
}

// Initialize map when Leaflet and DOM are ready
function initializeMapWhenReady() {
    // Show loading indicator
    const loadingIndicator = document.getElementById('map-loading');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
    
    if (typeof L !== 'undefined' && document.getElementById('map')) {
        initMap();
    } else if (typeof L === 'undefined') {
        // Leaflet failed to load
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        showMapError();
    } else {
        // Wait a bit and try again (max 10 seconds)
        let attempts = 0;
        const maxAttempts = 100;
        const checkInterval = setInterval(() => {
            attempts++;
            if (typeof L !== 'undefined' && document.getElementById('map')) {
                clearInterval(checkInterval);
                initMap();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }
                showMapError();
            }
        }, 100);
    }
}

// Show error message if map fails to load
function showMapError() {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        const grayLight = colors.grayLight();
        const textInk = colors.textInk();
        const grayMedium = colors.grayMedium();
        mapContainer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: ${grayLight}; border-radius: 8px; padding: 2rem;">
                <div style="text-align: center;">
                    <p style="font-family: 'Open Sans', sans-serif; font-size: 1.125rem; color: ${textInk}; margin-bottom: 0.5rem;">Unable to load map</p>
                    <p style="font-family: Georgia, serif; font-size: 0.9375rem; color: ${grayMedium};">Please check your internet connection and try refreshing the page.</p>
                </div>
            </div>
        `;
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMapWhenReady);
} else {
    initializeMapWhenReady();
}
