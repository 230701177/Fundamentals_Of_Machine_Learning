import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, MapPin, Navigation } from 'lucide-react';

// Fix for default marker icon in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapSelector = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Component to handle map clicks
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        updateLocation(lat, lng);
      },
    });

    return position === null ? null : (
      <Marker position={position}></Marker>
    );
  };

  // Component to fly to search results
  const ChangeView = ({ center }) => {
    const map = useMap();
    if (center) map.flyTo(center, 13);
    return null;
  };

  const updateLocation = async (lat, lng) => {
    setPosition([lat, lng]);
    setIsLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      const areaName = data.display_name;
      setAddress(areaName);
      onLocationSelect({
        lat: lat.toFixed(6),
        lng: lng.toFixed(6),
        address: areaName,
        city: data.address.city || data.address.town || data.address.village || data.address.suburb || 'Unknown'
      });
    } catch (error) {
      console.error('Error fetching address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounce search for suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
      setShowSuggestions(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        updateLocation(parseFloat(lat), parseFloat(lon));
        setShowSuggestions(false);
      } else {
        alert('Location not found. Please try a different search.');
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const { lat, lon, display_name } = suggestion;
    setSearchQuery(display_name);
    updateLocation(parseFloat(lat), parseFloat(lon));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleAutoDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateLocation(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.error('Geolocation error:', err);
          alert('Could not detect location. Please search manually.');
        }
      );
    }
  };

  return (
    <div className="map-selector-component">
      <div className="map-controls">
        <div className="search-field-wrapper">
          <div className="search-input-group">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search for an incident location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="map-search-input"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => { setSearchQuery(''); setSuggestions([]); }}
                className="clear-search"
              >
                ×
              </button>
            )}
            <button type="button" onClick={handleSearch} className="btn-search-trigger">Search</button>
          </div>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-popover glass">
              {suggestions.map((item, index) => (
                <div 
                  key={index} 
                  className="suggestion-row"
                  onClick={() => handleSuggestionClick(item)}
                >
                  <MapPin size={16} />
                  <div className="suggestion-content">
                    <span className="suggestion-main">{item.display_name.split(',')[0]}</span>
                    <span className="suggestion-sub">{item.display_name.split(',').slice(1).join(',')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button type="button" onClick={handleAutoDetect} className="btn-locate">
          <Navigation size={18} />
          <span>Locate Me</span>
        </button>
      </div>

      <div className="map-viewport-container">
        <MapContainer center={[20.5937, 78.9629]} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="topright" />
          <LocationMarker />
          {position && <ChangeView center={position} />}
        </MapContainer>
      </div>

      {position && (
        <div className="selected-location-panel">
          <div className="location-data-pill">
            <div className="pill-item">
              <span className="pill-label">Latitude</span>
              <span className="pill-value">{position[0].toFixed(5)}</span>
            </div>
            <div className="pill-divider"></div>
            <div className="pill-item">
              <span className="pill-label">Longitude</span>
              <span className="pill-value">{position[1].toFixed(5)}</span>
            </div>
          </div>
          <div className="address-display-box">
            <MapPin size={18} className="address-icon" />
            <p className="address-text">
              {isLoading ? 'Verifying location coordinates...' : address || 'Marked on Map'}
            </p>
          </div>
        </div>
      )}

      <style>{`
        .map-selector-component {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .map-controls {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .search-field-wrapper {
          flex: 1;
          position: relative;
        }
        .search-input-group {
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid var(--border-bold);
          border-radius: var(--radius-sm);
          padding: 4px 12px;
          transition: all 0.2s;
        }
        .search-input-group:focus-within {
          border-color: var(--primary);
        }
        .map-search-input {
          border: none;
          background: transparent;
          flex: 1;
          padding: 10px;
          font-size: 0.8125rem;
          font-family: var(--font-body);
          color: var(--text);
          outline: none;
          font-weight: 600;
        }
        .search-icon {
          color: var(--primary);
        }
        .clear-search {
          background: none;
          border: none;
          color: var(--danger);
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0 8px;
          line-height: 1;
        }
        .btn-search-trigger {
          background: none;
          border: none;
          color: var(--primary);
          font-family: var(--font-heading);
          font-weight: 800;
          cursor: pointer;
          font-size: 0.7rem;
          padding-left: 12px;
          text-transform: uppercase;
          border-left: 1px solid var(--border);
        }
        .suggestions-popover {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: white;
          border-radius: var(--radius-sm);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          z-index: 2000;
          max-height: 300px;
          overflow-y: auto;
          border: 2px solid var(--border-bold);
        }
        .suggestion-row {
          padding: 12px 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          border-bottom: 1px solid var(--border);
          transition: background 0.2s;
        }
        .suggestion-row:last-child { border-bottom: none; }
        .suggestion-row:hover { background: #FFF7ED; }
        .suggestion-row svg { color: var(--primary); margin-top: 2px; }
        .suggestion-content { display: flex; flex-direction: column; gap: 2px; }
        .suggestion-main { font-weight: 700; font-size: 0.875rem; color: var(--text); }
        .suggestion-sub { font-size: 0.7rem; color: var(--text-muted); line-height: 1.4; }
        
        .btn-locate {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 2px solid var(--border-bold);
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.7rem;
          text-transform: uppercase;
          color: var(--text);
          transition: all 0.2s;
        }
        .btn-locate:hover {
          border-color: var(--secondary);
          color: var(--secondary);
          background: #F0FDFA;
        }
        
        .map-viewport-container {
          height: 350px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 2px solid var(--border-bold);
        }
        
        .selected-location-panel {
          padding: 1rem;
          background: #F3F4F6;
          border: 2px solid var(--border-bold);
          border-radius: var(--radius-sm);
        }
        .location-data-pill {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .pill-item { display: flex; flex-direction: column; }
        .pill-label { font-family: var(--font-heading); font-size: 0.6rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800; }
        .pill-value { font-size: 0.8125rem; font-weight: 700; color: var(--primary); }
        .pill-divider { width: 1px; height: 20px; background: var(--border); }
        
        .address-display-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border);
        }
        .address-icon { color: var(--primary); margin-top: 2px; flex-shrink: 0; }
        .address-text { font-size: 0.8125rem; color: var(--text); line-height: 1.5; font-weight: 700; }
      `}</style>
    </div>
  );
};

export default MapSelector;
