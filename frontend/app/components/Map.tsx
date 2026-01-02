"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  lat: number;
  lng: number;
  label?: string;
}

export default function Map({ lat, lng, label }: MapProps) {
  const position: L.LatLngExpression = [lat, lng]; // Corrige le typage pour center et Marker

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true} className="leaflet-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>{label || "Signalement"}</Popup>
      </Marker>
    </MapContainer>
  );
}
