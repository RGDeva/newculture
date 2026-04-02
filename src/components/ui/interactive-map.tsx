import React, { useState, useEffect, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polygon,
  Polyline,
  useMap,
  useMapEvents
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
// @ts-expect-error Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type MarkerSize = 'small' | 'medium' | 'large';

const createCustomIcon = (color = 'blue', size: MarkerSize = 'medium') => {
  const sizes: Record<MarkerSize, [number, number]> = {
    small: [20, 32],
    medium: [25, 41],
    large: [30, 50]
  };

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: sizes[size],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

interface MapEventsProps {
  onMapClick?: (latlng: L.LatLng) => void;
  onLocationFound?: (latlng: L.LatLng) => void;
}

const MapEvents: React.FC<MapEventsProps> = ({ onMapClick, onLocationFound }) => {
  const map = useMapEvents({
    click: (e) => {
      onMapClick && onMapClick(e.latlng);
    },
    locationfound: (e) => {
      onLocationFound && onLocationFound(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  return null;
};

interface CustomControlsProps {
  onLocate: () => void;
  onToggleLayer: (layer: string) => void;
}

const CustomControls: React.FC<CustomControlsProps> = ({ onLocate, onToggleLayer }) => {
  const map = useMap();

  useEffect(() => {
    const control = L.control({ position: 'topright' });

    control.onAdd = () => {
      const div = L.DomUtil.create('div', 'custom-controls');
      div.innerHTML = `
        <div style="background: rgba(0,0,0,0.85); padding: 8px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.4); display: flex; flex-direction: column; gap: 4px;">
          <button id="locate-btn" style="padding: 6px 10px; border: 1px solid #333; border-radius: 4px; cursor: pointer; background: #1a1a1a; color: #ccc; font-size: 11px; font-family: monospace;">📍 LOCATE</button>
          <button id="satellite-btn" style="padding: 6px 10px; border: 1px solid #333; border-radius: 4px; cursor: pointer; background: #1a1a1a; color: #ccc; font-size: 11px; font-family: monospace;">🛰️ SATELLITE</button>
        </div>
      `;

      L.DomEvent.disableClickPropagation(div);

      const locateBtn = div.querySelector('#locate-btn') as HTMLButtonElement;
      const satelliteBtn = div.querySelector('#satellite-btn') as HTMLButtonElement;

      locateBtn.onclick = () => onLocate();
      satelliteBtn.onclick = () => onToggleLayer('satellite');

      return div;
    };

    control.addTo(map);
    return () => { control.remove(); };
  }, [map, onLocate, onToggleLayer]);

  return null;
};

interface SearchControlProps {
  onSearch?: (result: { latLng: [number, number]; name: string }) => void;
}

const SearchControl: React.FC<SearchControlProps> = ({ onSearch }) => {
  const map = useMap();

  useEffect(() => {
    const control = L.control({ position: 'topleft' });
    let queryValue = '';

    const handleSearch = async () => {
      if (!queryValue.trim()) return;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryValue)}`
        );
        const results = await response.json();
        if (results.length > 0) {
          const { lat, lon, display_name } = results[0];
          const latLng: [number, number] = [parseFloat(lat), parseFloat(lon)];
          map.flyTo(latLng, 13);
          onSearch && onSearch({ latLng, name: display_name });
        }
      } catch (error) {
        console.error('Search error:', error);
      }
    };

    control.onAdd = () => {
      const div = L.DomUtil.create('div', 'search-control');
      div.innerHTML = `
        <div style="background: rgba(0,0,0,0.85); padding: 8px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.4); display: flex; gap: 4px;">
          <input id="search-input" type="text" placeholder="Search places..." style="padding: 6px 10px; border: 1px solid #333; border-radius: 4px; width: 180px; background: #1a1a1a; color: #ccc; font-size: 11px; font-family: monospace;" />
          <button id="search-btn" style="padding: 6px 10px; border: 1px solid #333; border-radius: 4px; cursor: pointer; background: #1a1a1a; color: #ccc; font-size: 11px;">🔍</button>
        </div>
      `;

      L.DomEvent.disableClickPropagation(div);

      const input = div.querySelector('#search-input') as HTMLInputElement;
      const button = div.querySelector('#search-btn') as HTMLButtonElement;

      input.addEventListener('input', (e) => { queryValue = (e.target as HTMLInputElement).value; });
      input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSearch(); });
      button.addEventListener('click', handleSearch);

      return div;
    };

    control.addTo(map);
    return () => { control.remove(); };
  }, [map, onSearch]);

  return null;
};

export interface MapMarker {
  id?: string | number;
  position: [number, number];
  color?: string;
  size?: MarkerSize;
  icon?: L.Icon;
  popup?: {
    title?: string;
    content?: string;
    image?: string;
  };
}

export interface MapPolygon {
  id?: string | number;
  positions: [number, number][];
  style?: L.PathOptions;
  popup?: string;
}

export interface MapCircle {
  id?: string | number;
  center: [number, number];
  radius: number;
  style?: L.PathOptions;
  popup?: string;
}

export interface MapPolyline {
  id?: string | number;
  positions: [number, number][];
  style?: L.PathOptions;
  popup?: string;
}

interface AdvancedMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  polygons?: MapPolygon[];
  circles?: MapCircle[];
  polylines?: MapPolyline[];
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (latlng: L.LatLng) => void;
  enableClustering?: boolean;
  enableSearch?: boolean;
  enableControls?: boolean;
  mapLayers?: Record<string, boolean>;
  className?: string;
  style?: React.CSSProperties;
}

export const AdvancedMap: React.FC<AdvancedMapProps> = ({
  center = [39.8283, -98.5795],
  zoom = 4,
  markers = [],
  polygons = [],
  circles = [],
  polylines = [],
  onMarkerClick,
  onMapClick,
  enableClustering = true,
  enableSearch = true,
  enableControls = true,
  mapLayers = { openstreetmap: true, satellite: false },
  className = '',
  style = { height: '500px', width: '100%' }
}) => {
  const [currentLayers, setCurrentLayers] = useState(mapLayers);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchResult, setSearchResult] = useState<{ latLng: [number, number]; name: string } | null>(null);
  const [clickedLocation, setClickedLocation] = useState<L.LatLng | null>(null);

  const handleToggleLayer = useCallback((layerType: string) => {
    setCurrentLayers(prev => ({
      ...prev,
      openstreetmap: layerType === 'satellite' ? !prev.openstreetmap : prev.openstreetmap,
      satellite: layerType === 'satellite' ? !prev.satellite : prev.satellite,
    }));
  }, []);

  const handleLocate = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => console.error('Geolocation error:', error)
      );
    }
  }, []);

  const handleMapClick = useCallback((latlng: L.LatLng) => {
    setClickedLocation(latlng);
    onMapClick && onMapClick(latlng);
  }, [onMapClick]);

  const handleSearch = useCallback((result: { latLng: [number, number]; name: string }) => {
    setSearchResult(result);
  }, []);

  const renderMarkers = (markerList: MapMarker[]) =>
    markerList.map((marker, index) => (
      <Marker
        key={marker.id || index}
        position={marker.position}
        icon={marker.icon || createCustomIcon(marker.color, marker.size)}
        eventHandlers={{
          click: () => onMarkerClick && onMarkerClick(marker)
        }}
      >
        {marker.popup && (
          <Popup>
            <div>
              {marker.popup.title && <h3 className="font-bold text-sm">{marker.popup.title}</h3>}
              {marker.popup.content && <p className="text-xs mt-1">{marker.popup.content}</p>}
              {marker.popup.image && (
                <img src={marker.popup.image} alt={marker.popup.title} style={{ maxWidth: '200px', height: 'auto' }} />
              )}
            </div>
          </Popup>
        )}
      </Marker>
    ));

  return (
    <div className={`advanced-map ${className}`} style={style}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        {currentLayers.openstreetmap && !currentLayers.satellite && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}

        {currentLayers.satellite && (
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        <MapEvents onMapClick={handleMapClick} onLocationFound={setUserLocation} />
        {enableSearch && <SearchControl onSearch={handleSearch} />}
        {enableControls && <CustomControls onLocate={handleLocate} onToggleLayer={handleToggleLayer} />}

        {enableClustering ? (
          <MarkerClusterGroup>{renderMarkers(markers)}</MarkerClusterGroup>
        ) : (
          renderMarkers(markers)
        )}

        {userLocation && (
          <Marker position={userLocation} icon={createCustomIcon('red', 'medium')}>
            <Popup>Your current location</Popup>
          </Marker>
        )}

        {searchResult && (
          <Marker position={searchResult.latLng} icon={createCustomIcon('green', 'large')}>
            <Popup>{searchResult.name}</Popup>
          </Marker>
        )}

        {clickedLocation && (
          <Marker position={[clickedLocation.lat, clickedLocation.lng]} icon={createCustomIcon('orange', 'small')}>
            <Popup>
              Lat: {clickedLocation.lat.toFixed(6)}<br />
              Lng: {clickedLocation.lng.toFixed(6)}
            </Popup>
          </Marker>
        )}

        {polygons.map((polygon, index) => (
          <Polygon
            key={polygon.id || index}
            positions={polygon.positions}
            pathOptions={polygon.style || { color: 'purple', weight: 2, fillOpacity: 0.3 }}
          >
            {polygon.popup && <Popup>{polygon.popup}</Popup>}
          </Polygon>
        ))}

        {circles.map((circle, index) => (
          <Circle
            key={circle.id || index}
            center={circle.center}
            radius={circle.radius}
            pathOptions={circle.style || { color: 'blue', weight: 2, fillOpacity: 0.2 }}
          >
            {circle.popup && <Popup>{circle.popup}</Popup>}
          </Circle>
        ))}

        {polylines.map((polyline, index) => (
          <Polyline
            key={polyline.id || index}
            positions={polyline.positions}
            pathOptions={polyline.style || { color: 'red', weight: 3 }}
          >
            {polyline.popup && <Popup>{polyline.popup}</Popup>}
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
};
