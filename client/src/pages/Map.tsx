"use client";

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";     
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState("");
  const mapRef = useRef<LeafletMap | null>(null);
  const navigate = useNavigate();               


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  const handleRoute = async () => {
    const map = mapRef.current;
    if (!map || !userLocation) return;

    
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        destination
      )}`
    );
    const data = await res.json();
    if (!data.length) {
      alert("Address not found");
      return;
    }
    const destLat = parseFloat(data[0].lat);
    const destLon = parseFloat(data[0].lon);

    
    L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(destLat, destLon),
      ],
      routeWhileDragging: false,
    }).addTo(map);
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      <button
        onClick={() => navigate("/responder-menu")}
        className="mb-4 ml-4 mt-4 self-start px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back
      </button>

      
      <div className="p-4 bg-gray-100 flex gap-2 items-center">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          placeholder="Enter destination address"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <button
          onClick={handleRoute}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Show Route
        </button>
      </div>

      {userLocation && (
        <MapContainer
          center={userLocation}
          zoom={13}
          style={{ flex: 1 }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={userLocation}>
            <Popup>Your Location</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}


