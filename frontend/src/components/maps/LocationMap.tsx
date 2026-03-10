"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);

function ChangeView({ center }: { center: [number, number] }) {
  const { useMap } = require("react-leaflet");
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [center, map]);

  return null;
}

export function LocationMap({
  onAddressSelect,
}: {
  onAddressSelect: (addr: string) => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [Components, setComponents] = useState<any>(null);
  const [leafletLib, setLeafletLib] = useState<any>(null);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [deliveryPos, setDeliveryPos] = useState<[number, number] | null>(null);

  const [mapCenter, setMapCenter] = useState<[number, number]>([
    55.7558, 37.6173,
  ]);

  useEffect(() => {
    setIsMounted(true);

    Promise.all([import("react-leaflet"), import("leaflet")]).then(
      ([rel, L]) => {
        setComponents(rel);
        setLeafletLib(L);
      },
    );

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [
            pos.coords.latitude,
            pos.coords.longitude,
          ];
          setUserLocation(coords);
          setMapCenter(coords);
          setDeliveryPos(coords);
          fetchAddress(coords[0], coords[1]);
        },
        (err) => console.log("Геопозиция отклонена или ошибка:", err.message),
        { enableHighAccuracy: true },
      );
    }
  }, []);

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ru`,
      );
      const data = await response.json();

      const { road, house_number, city, town, village, hamlet } = data.address;

      const displayCity = city || town || village || hamlet || "";
      const displayStreet = road ? road : "";
      const displayHouse = house_number ? house_number : "";

      const cleanAddress = [displayCity, displayStreet, displayHouse]
        .filter(Boolean)
        .join(", ");

      onAddressSelect(cleanAddress || data.display_name);
    } catch (e) {
      console.error(e);
    }
  };

  const MapEvents = () => {
    Components.useMapEvents({
      click(e: any) {
        const { lat, lng } = e.latlng;
        setDeliveryPos([lat, lng]);
        fetchAddress(lat, lng);
      },
    });
    return null;
  };

  if (!isMounted || !Components || !leafletLib) {
    return (
      <div className="w-full h-[500px] md:h-[600px] bg-[#F5F0E8] animate-pulse flex items-center justify-center text-[#7a4f2a]/30 font-bold uppercase">
        Загрузка карты...
      </div>
    );
  }

  const { TileLayer, Marker, CircleMarker } = Components;

  const deliveryIcon = leafletLib.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="w-full h-[500px] md:h-[600px] relative z-0 group">
      <style jsx global>{`
        .leaflet-top.leaflet-left {
          margin-top: 30px;
          margin-left: 30px;
        }
        .leaflet-bar {
          border: none !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
          border-radius: 16px !important;
          overflow: hidden;
        }
        .leaflet-bar a {
          background-color: white !important;
          color: #7a4f2a !important;
          border-bottom: 1px solid #eaddd0 !important;
          width: 40px !important;
          height: 40px !important;
          line-height: 40px !important;
        }
      `}</style>

      <MapContainer
        center={mapCenter}
        zoom={12}
        scrollWheelZoom={true}
        attributionControl={false}
        className="h-full w-full"
        style={{
          filter: "sepia(15%) hue-rotate(-10deg) saturate(95%) contrast(95%)",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <ChangeView center={mapCenter} />

        <MapEvents />

        {userLocation && (
          <CircleMarker
            center={userLocation}
            radius={8}
            pathOptions={{
              fillColor: "#3b82f6",
              fillOpacity: 1,
              color: "white",
              weight: 2,
            }}
          />
        )}

        {deliveryPos && <Marker position={deliveryPos} icon={deliveryIcon} />}
      </MapContainer>

      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.04)]" />
    </div>
  );
}
