import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


// Custom marker icon configuration
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Component to handle zooming to a location
const FlyToLocation = ({ position }) => {
  const map = useMap();

  if (position) {
    map.flyTo(position, 16); // Zoom level 16
  }

  return null;
};

const Locator = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [selectedPosition, setSelectedPosition] = useState(null); // Selected marker position
  const inputRef = useRef();

  const atms = [
    { id: 1, name: "ATM 1", lat: 45.5017, lng: -73.5673, status: "available" },
    { id: 2, name: "ATM 2", lat: 45.5031, lng: -73.5585, status: "" },
    { id: 3, name: "ATM 3", lat: 45.5088, lng: -73.554, status: "available" },
    { id: 4, name: "ATM 4", lat: 45.5121, lng: -73.5493, status: "available" },
    { id: 5, name: "ATM 5", lat: 45.5155, lng: -73.5537, status: "available" },
    { id: 6, name: "ATM 6", lat: 45.5202, lng: -73.5608, status: "" },
  ];

  const handleSearch = () => {
    // Perform case-insensitive search
    const result = atms.find(
      (atm) => atm.name.toLowerCase() === searchQuery.trim().toLowerCase()
    );
    if (result) {
      setSelectedPosition([result.lat, result.lng]);
    } else {
      alert("ATM not found");
    }
    inputRef.current.value = ""; // Clear the search field
  };

  const center = [45.5017, -73.5673]; // Default center coordinates (Montreal)

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          ref={inputRef}
          placeholder="Search ATM by name"
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <button onClick={handleSearch} style={{ padding: "5px" }}>
          Search
        </button>
      </div>
      <MapContainer center={center} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {atms.map((atm) => (
          <Marker key={atm.id} position={[atm.lat, atm.lng]} icon={customIcon}>
            <Popup>
              {atm.name} <br />
              Status: {atm.status === "available" ? "Available" : "Not available"}
            </Popup>
          </Marker>
        ))}
        <FlyToLocation position={selectedPosition} />
      </MapContainer>
    </div>
  );
};

export default Locator;
