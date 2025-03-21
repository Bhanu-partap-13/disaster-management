import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

// Pre-defined sample data arrays for demonstration:
const disasterZones = [
  { id: 1, position: [37.7749, -122.4194], title: "San Francisco - Disaster Zone" },
  { id: 2, position: [35.6895, 139.6917], title: "Tokyo - Disaster Zone" },
  { id: 3, position: [48.8566, 2.3522], title: "Paris - Disaster Zone" },
  { id: 4, position: [19.4326, -99.1332], title: "Mexico City - Disaster Zone" },
];

const resourcePins = [
  { id: 1, position: [40.7128, -74.0060], title: "New York - Food Supply" },
  { id: 2, position: [51.5074, -0.1278], title: "London - Medical Aid" },
];

const volunteerLocations = [
  { id: 1, position: [55.7558, 37.6176], title: "Moscow - Volunteer Group" },
];

const MapComponent = ({ userMarkers = [] }) => {
  // Global center for a world view
  const center = [20, 0];

  return (
    <MapContainer center={center} zoom={2} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Pre-defined Disaster Zones */}
      {disasterZones.map((zone) => (
        <Marker key={`zone-${zone.id}`} position={zone.position}>
          <Popup>{zone.title}</Popup>
        </Marker>
      ))}

      {/* Pre-defined Resource Pins */}
      {resourcePins.map((resource) => (
        <Marker key={`resource-${resource.id}`} position={resource.position}>
          <Popup>{resource.title}</Popup>
        </Marker>
      ))}

      {/* Pre-defined Volunteer Locations */}
      {volunteerLocations.map((volunteer) => (
        <Marker key={`volunteer-${volunteer.id}`} position={volunteer.position}>
          <Popup>{volunteer.title}</Popup>
        </Marker>
      ))}

      {/* User-added markers */}
      {userMarkers.map((marker, index) => (
        <Marker key={`user-marker-${index}`} position={marker.position}>
          <Popup>{marker.description}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
