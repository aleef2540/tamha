"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// แก้ไข Bug ไอคอน Marker ไม่ขึ้นใน Next.js
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapDetail({ lat, lng }: { lat: number; lng: number }) {
  return (
    <div className="h-full w-full rounded-3xl overflow-hidden border border-zinc-800 relative">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        {/* ใช้ Tile ของ CartoDB (Dark Matter) เพื่อให้แผนที่เป็นสีดำ */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[lat, lng]} icon={customIcon}>
          <Popup>จุดที่พบของหรือสัตว์เลี้ยง</Popup>
        </Marker>
      </MapContainer>

      {/* Overlay ตกแต่งเล็กน้อย */}
      <div className="absolute top-4 left-4 z-[1000] bg-black/60 backdrop-blur-md p-2 px-4 rounded-full border border-white/10 text-[10px] text-zinc-300">
        Live Map View
      </div>
    </div>
  );
}