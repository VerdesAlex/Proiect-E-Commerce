'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Această bucată de cod evită eroarea de iconițe și re-randarea dublă în React 18+
const customIcon = typeof window !== 'undefined' ? new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
}) : null;

export default function Map() {
  const position: [number, number] = [44.4268, 26.1025]; // București
  const [mounted, setMounted] = useState(false);

  // Ne asigurăm că harta este randată DOAR după ce componenta este montată complet în browser
  useEffect(() => {
    setMounted(true);
    
    // O mică corecție suplimentară pentru Leaflet în Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  if (!mounted || !customIcon) return <div className="p-4 text-center text-gray-500">Harta se pregătește...</div>;

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "10px", overflow: "hidden" }}>
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={true} // Evităm zoom-ul accidental când dăm scroll pe pagină
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[44.4268, 26.1025]} icon={customIcon}>
          <Popup>
            <b>ElitePet Unirii</b> <br /> Magazin Fizic.
          </Popup>
        </Marker>
        <Marker position={[44.4350, 26.1100]} icon={customIcon}>
          <Popup>
            <b>Veterinar Partener</b> <br /> Consultanță non-stop.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}