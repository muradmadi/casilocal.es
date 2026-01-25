import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: null,
    iconUrl: null,
    shadowUrl: null
});

interface Spot {
    id: string;
    name: string;
    slug: string;
    lat: number;
    lng: number;
    wifi: string;
    noise: string;
    power: string;
    score: number;
}

interface Props {
    spots: Spot[];
}

// --------------------------------------------------------
// ISOLATED MARKER COMPONENT
// --------------------------------------------------------
const createCustomIcon = (score: number) => {
    const safeScore = score ?? '?';
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: 24px; 
            height: 24px; 
            background-color: var(--color-ember); 
            color: white;
            font-family: var(--font-mono);
            font-size: 10px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid var(--color-ink); 
            border-radius: 50%; 
            box-shadow: 2px 2px 0px 0px var(--color-ink);
            user-select: none;
            -webkit-user-select: none;
        ">${safeScore}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -14]
    });
};

const SpotMarker = ({ spot }: { spot: Spot }) => {
    // Memoize the icon to prevent Leaflet layer thrashing
    const icon = useMemo(() => createCustomIcon(spot.score), [spot.score]);

    return (
        <Marker
            position={[spot.lat, spot.lng]}
            icon={icon}
        >
            <Tooltip
                direction="top"
                offset={[0, -16]}
                opacity={1}
                interactive={false}
                className="font-display text-xs font-bold px-2 py-1 shadow-sm border border-[var(--color-ink)] bg-white text-[var(--color-ink)] rounded-xs"
            >
                {spot.name}
            </Tooltip>

            <Popup
                className="custom-popup"
                maxWidth={320}
                minWidth={300}
                closeButton={true}
            >
                <div className="flex flex-col p-6 text-center font-sans text-[var(--color-ink)]">

                    {/* Title */}
                    <h3 className="font-display font-black text-2xl leading-none mb-4 mt-2">
                        {spot.name}
                    </h3>

                    {/* Badges Overview */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {/* Score Badge */}
                        <span className="font-mono font-bold text-xs bg-[var(--color-ember)] text-white px-2 py-1 rounded-xs border border-[var(--color-ink)] shadow-[2px_2px_0_0_var(--color-ink)]">
                            {spot.score}/10
                        </span>

                        {/* Wifi Badge */}
                        <span className="font-mono text-xs uppercase px-2 py-1 bg-white border border-[var(--color-ink)] rounded-xs shadow-[2px_2px_0_0_var(--color-ink)]">
                            {spot.wifi}
                        </span>

                        {/* Noise Badge (Optional context) */}
                        <span className="font-mono text-xs uppercase px-2 py-1 bg-white border border-[var(--color-ink)] rounded-xs shadow-[2px_2px_0_0_var(--color-ink)]">
                            {spot.noise}
                        </span>
                    </div>

                    {/* Action Button */}
                    <a
                        href={`/spots/${spot.id}/`}
                        className="group relative block w-full bg-[var(--color-ink)] text-white font-display uppercase tracking-widest text-sm font-bold py-3 px-4 rounded-xs border-2 border-[var(--color-ink)] shadow-[4px_4px_0_0_var(--color-ink)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all no-underline hover:text-white visited:text-white"
                        style={{ color: 'white' }} /* Force override leaflet styles */
                    >
                        View Full Dossier
                    </a>
                </div>
            </Popup>
        </Marker>
    );
};

// --------------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------------
const MapInterface: React.FC<Props> = ({ spots }) => {
    // Filters State
    const [filterWifi, setFilterWifi] = useState<string>('all');
    const [filterNoise, setFilterNoise] = useState<string>('all');
    const [filterPower, setFilterPower] = useState<string>('all');

    // Derived State: Filtered Spots
    const filteredSpots = useMemo(() => spots.filter(spot => {
        if (filterWifi !== 'all' && spot.wifi !== filterWifi) return false;
        if (filterNoise !== 'all' && spot.noise !== filterNoise) return false;
        if (filterPower === 'available' && spot.power !== 'available') return false;
        return true;
    }), [spots, filterWifi, filterNoise, filterPower]);

    return (
        <div className="relative w-full h-[calc(100vh-64px)] bg-[var(--color-paper)] overflow-hidden isolate">
            {/* Global Styles for Popup overrides */}
            <style>{`
                /* 1. RESET & CONTAINER */
                .leaflet-popup {
                    margin-bottom: 24px !important; /* Offset from pin */
                }
                .leaflet-popup-content-wrapper {
                    background: var(--color-paper);
                    border: 2px solid var(--color-ink);
                    border-radius: 4px; /* radius-sm */
                    box-shadow: 6px 6px 0px 0px var(--color-ink); /* shadow-card-hover style for pop */
                    padding: 0;
                    overflow: visible; /* Allow close button overlap if needed, though we keep it inside */
                }
                
                /* 2. CONTENT BOX */
                .leaflet-popup-content {
                    margin: 0 !important;
                    width: 300px !important;
                    line-height: 1.5;
                }

                /* 3. HIDE ARROW/TIP */
                .leaflet-popup-tip-container {
                    display: none;
                }

                /* 4. CUSTOM CLOSE BUTTON STYLE */
                .leaflet-container a.leaflet-popup-close-button {
                    top: 10px;
                    right: 10px;
                    color: var(--color-ink) !important;
                    font-family: var(--font-mono);
                    font-weight: 400;
                    font-size: 20px;
                    width: 24px;
                    height: 24px;
                    line-height: 22px;
                    text-align: center;
                    border: 1px solid transparent;
                    border-radius: 2px;
                    padding: 0;
                    z-index: 10;
                    transition: all 0.2s ease;
                }
                
                .leaflet-container a.leaflet-popup-close-button:hover {
                    color: var(--color-ember) !important;
                    border-color: var(--color-ember);
                    background: white;
                }
            `}</style>

            {/* FLOATING FILTER PANEL */}
            <div className="absolute top-4 left-4 z-[9000] w-[calc(100%-32px)] md:w-[320px] bg-[var(--color-paper)] border-2 border-[var(--color-line-heavy)] shadow-card rounded-sm transition-transform duration-300 max-h-[calc(100vh-100px)] overflow-y-auto">
                <div className="p-4 border-b-2 border-dotted border-[var(--color-ink)]/20">
                    <h2 className="font-display font-black text-xl text-[var(--color-ink)]">Filters</h2>
                </div>

                <div className="p-4 space-y-6">
                    {/* WiFi */}
                    <div className="space-y-2">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink)]/60">WiFi</span>
                        <div className="flex gap-2 flex-wrap">
                            {['all', 'flynet', 'reliable', 'spotty', 'detox'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setFilterWifi(opt)}
                                    className={`px-3 py-1 text-xs font-mono border border-[var(--color-ink)] uppercase rounded-xs transition-all ${filterWifi === opt ? 'bg-[var(--color-ink)] text-white' : 'hover:bg-[var(--color-ink)]/10 text-[var(--color-ink)]'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Noise */}
                    <div className="space-y-2">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink)]/60">Noise</span>
                        <div className="flex gap-2 flex-wrap">
                            {[
                                { label: 'All', value: 'all' },
                                { label: 'Library', value: 'silence' },
                                { label: 'Hum', value: 'hum' },
                                { label: 'Lively', value: 'chaos' }
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setFilterNoise(opt.value)}
                                    className={`px-3 py-1 text-xs font-mono border border-[var(--color-ink)] uppercase rounded-xs transition-all ${filterNoise === opt.value ? 'bg-[var(--color-ink)] text-white' : 'hover:bg-[var(--color-ink)]/10 text-[var(--color-ink)]'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Power */}
                    <div className="space-y-2">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink)]/60">Power</span>
                        <label className="group flex items-center gap-3 cursor-pointer select-none">
                            <span className="font-display text-sm uppercase tracking-wider text-[var(--color-ink)]">
                                Plugs
                            </span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="peer sr-only"
                                    checked={filterPower === 'available'}
                                    onChange={() => setFilterPower(filterPower === 'all' ? 'available' : 'all')}
                                />
                                <div className="h-6 w-11 bg-[var(--color-paper)] border border-[var(--color-line-heavy)] transition-colors peer-checked:bg-[var(--color-ember)] duration-100 ease-linear rounded-xs"></div>
                                <div className="absolute top-[2px] left-[2px] h-5 w-5 bg-[var(--color-ink)] transition-transform peer-checked:translate-x-5 shadow-sm duration-100 ease-linear rounded-xs peer-checked:bg-white"></div>
                                <div className="absolute inset-0 pointer-events-none peer-focus-visible:outline-2 peer-focus-visible:outline-dashed peer-focus-visible:outline-text-main peer-focus-visible:outline-offset-2"></div>
                            </div>
                        </label>
                    </div>

                    <div className="pt-4 border-t-2 border-dotted border-[var(--color-ink)]/20 text-center">
                        <span className="font-mono text-xs text-[var(--color-ink)]/60 uppercase">
                            {filteredSpots.length} signals found
                        </span>
                    </div>
                </div>
            </div>

            {/* MAP VIEWPORT */}
            <MapContainer
                center={[40.416775, -3.703790]}
                zoom={13}
                style={{ height: '100%', width: '100%', background: 'var(--color-paper)' }}
                zoomControl={false}
                className="z-0"
            >
                {/* Carto Positron Tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {filteredSpots.map(spot => (
                    <SpotMarker
                        key={spot.id}
                        spot={spot}
                    />
                ))}
            </MapContainer>
        </div>
    );
};

export default MapInterface;
