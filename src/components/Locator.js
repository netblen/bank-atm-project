import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Locator.css";

const customIcon = L.divIcon({
  className: "locator-marker",
  html: "<span class=\"locator-pin\"><i></i></span>",
  iconSize: [34, 42],
  iconAnchor: [17, 42],
  popupAnchor: [0, -38],
});

const atms = [
  {
    id: 1,
    name: "Downtown ATM",
    address: "120 Saint Catherine St W",
    lat: 45.5017,
    lng: -73.5673,
    status: "available",
    hours: "Open 24 hours",
  },
  {
    id: 2,
    name: "Quartier ATM",
    address: "88 De Maisonneuve Blvd",
    lat: 45.5031,
    lng: -73.5585,
    status: "busy",
    hours: "Open until 10 PM",
  },
  {
    id: 3,
    name: "Old Port ATM",
    address: "411 Saint Paul St E",
    lat: 45.5088,
    lng: -73.554,
    status: "available",
    hours: "Open 24 hours",
  },
  {
    id: 4,
    name: "Village ATM",
    address: "1580 Sainte-Catherine St E",
    lat: 45.5121,
    lng: -73.5493,
    status: "available",
    hours: "Open 24 hours",
  },
  {
    id: 5,
    name: "Plateau ATM",
    address: "3615 Saint Laurent Blvd",
    lat: 45.5155,
    lng: -73.5537,
    status: "available",
    hours: "Open until 11 PM",
  },
  {
    id: 6,
    name: "Central Station ATM",
    address: "895 De La Gauchetiere St W",
    lat: 45.5202,
    lng: -73.5608,
    status: "offline",
    hours: "Service paused",
  },
];

const FlyToLocation = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { duration: 1.1 });
    }
  }, [map, position]);

  return null;
};

const getStatusLabel = (status) => {
  if (status === "available") return "Available";
  if (status === "busy") return "Busy";
  return "Offline";
};

const Locator = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAtm, setSelectedAtm] = useState(atms[0]);

  const filteredAtms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return atms;
    }

    return atms.filter(
      (atm) =>
        atm.name.toLowerCase().includes(query) ||
        atm.address.toLowerCase().includes(query) ||
        atm.status.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const center = [45.5017, -73.5673];
  const selectedPosition = selectedAtm ? [selectedAtm.lat, selectedAtm.lng] : null;
  const availableCount = atms.filter((atm) => atm.status === "available").length;

  return (
    <div className="locator-page">
      <section className="locator-hero">
        <div>
          <p className="locator-eyebrow">ATM locator</p>
          <h1>Find a nearby banking point.</h1>
          <p className="locator-lede">
            Search by neighborhood, address, or availability and select a location to focus the map.
          </p>
        </div>

        <div className="locator-summary" aria-label="ATM network summary">
          <div>
            <strong>{atms.length}</strong>
            <span>Montreal ATMs</span>
          </div>
          <div>
            <strong>{availableCount}</strong>
            <span>Available now</span>
          </div>
        </div>
      </section>

      <section className="locator-shell">
        <aside className="locator-panel">
          <label className="locator-search">
            <span>Search locations</span>
            <input
              type="text"
              value={searchQuery}
              placeholder="Try Downtown, station, available..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>

          <div className="locator-results">
            <div className="locator-results-heading">
              <strong>{filteredAtms.length} results</strong>
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")}>
                  Clear
                </button>
              )}
            </div>

            {filteredAtms.length > 0 ? (
              filteredAtms.map((atm) => (
                <button
                  type="button"
                  key={atm.id}
                  className={`locator-card ${selectedAtm?.id === atm.id ? "is-selected" : ""}`}
                  onClick={() => setSelectedAtm(atm)}
                >
                  <span className={`locator-status locator-status-${atm.status}`}>
                    {getStatusLabel(atm.status)}
                  </span>
                  <strong>{atm.name}</strong>
                  <span>{atm.address}</span>
                  <small>{atm.hours}</small>
                </button>
              ))
            ) : (
              <p className="locator-empty">No ATMs match that search.</p>
            )}
          </div>
        </aside>

        <div className="locator-map-card">
          <MapContainer center={center} zoom={13} className="locator-map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {atms.map((atm) => (
              <Marker
                key={atm.id}
                position={[atm.lat, atm.lng]}
                icon={customIcon}
                eventHandlers={{
                  click: () => setSelectedAtm(atm),
                }}
              >
                <Popup>
                  <strong>{atm.name}</strong>
                  <br />
                  {atm.address}
                  <br />
                  Status: {getStatusLabel(atm.status)}
                </Popup>
              </Marker>
            ))}
            <FlyToLocation position={selectedPosition} />
          </MapContainer>
        </div>
      </section>
    </div>
  );
};

export default Locator;
