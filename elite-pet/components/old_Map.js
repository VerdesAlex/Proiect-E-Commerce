import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix pentru iconițele Leaflet care nu se încarcă în Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export default function Map() {
  // Coordonate centru București
  const position = [44.4268, 26.1025]; 

  const stores = [
    { id: 1, name: "ElitePet Magazin Unirii", coords: [44.4268, 26.1025], type: "Magazin" },
    { id: 2, name: "Veterinar Non-Stop", coords: [44.4350, 26.1100], type: "Veterinar" },
  ];

  return (
    <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {stores.map(store => (
        <Marker key={store.id} position={store.coords} icon={icon}>
          <Popup>
            <b>{store.name}</b> <br /> {store.type}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}