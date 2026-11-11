"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Search,
  Navigation,
  Compass,
  Bike,
  Store,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  PUEBLA_CENTER,
  PUEBLA_QUICK_LOCATIONS,
  geocodePueblaAddress,
  reverseGeocodePuebla,
  fetchRealOsrmRoute,
  latLngToPueblaPoint,
} from "@coconea/shared";
import type { GeoPoint } from "@coconea/types";

interface LeafletMapInstance {
  setView: (center: [number, number], zoom?: number) => void;
  fitBounds: (bounds: [number, number][], options?: { padding?: [number, number]; maxZoom?: number }) => void;
  on: (event: string, handler: (e: { latlng: { lat: number; lng: number } }) => void) => void;
  remove: () => void;
  invalidateSize: () => void;
}

interface LeafletMarkerInstance {
  setLatLng: (latlng: [number, number]) => void;
  getLatLng: () => { lat: number; lng: number };
  bindPopup: (html: string) => LeafletMarkerInstance;
  on: (event: string, handler: () => void) => void;
  remove: () => void;
}

interface LeafletPolylineInstance {
  setLatLngs: (latlngs: [number, number][]) => void;
  remove: () => void;
}

interface LeafletGlobal {
  map: (el: HTMLElement, opts?: Record<string, unknown>) => LeafletMapInstance;
  tileLayer: (
    url: string,
    opts?: Record<string, unknown>,
  ) => { addTo: (map: LeafletMapInstance) => void };
  marker: (
    latlng: [number, number],
    opts?: Record<string, unknown>,
  ) => { addTo: (map: LeafletMapInstance) => LeafletMarkerInstance };
  polyline: (
    latlngs: [number, number][],
    opts?: Record<string, unknown>,
  ) => { addTo: (map: LeafletMapInstance) => LeafletPolylineInstance };
  divIcon: (opts: Record<string, unknown>) => unknown;
}

declare global {
  interface Window {
    L?: LeafletGlobal;
  }
}

let leafletLoadPromise: Promise<LeafletGlobal | null> | null = null;

function ensureLeafletLoaded(): Promise<LeafletGlobal | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.L) return Promise.resolve(window.L);
  if (leafletLoadPromise) return leafletLoadPromise;

  leafletLoadPromise = new Promise((resolve) => {
    if (!document.getElementById("coconea-leaflet-css")) {
      const link = document.createElement("link");
      link.id = "coconea-leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const existingScript = document.getElementById("coconea-leaflet-js");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.L || null));
      existingScript.addEventListener("error", () => resolve(null));
      return;
    }

    const script = document.createElement("script");
    script.id = "coconea-leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => resolve(window.L || null);
    script.onerror = () => resolve(null);
    document.body.appendChild(script);
  });

  return leafletLoadPromise;
}

export interface PueblaAddressMapProps {
  mode: "picker" | "tracking";
  customerAddress: string;
  customerLocation: GeoPoint;
  restaurantName: string;
  restaurantAddress: string;
  restaurantLocation: GeoPoint;
  courierName?: string | null;
  courierLocation?: GeoPoint | null;
  onChangeAddressAndLocation?: (address: string, location: GeoPoint) => void;
}

export function PueblaAddressMap({
  mode,
  customerAddress,
  customerLocation,
  restaurantName,
  restaurantAddress,
  restaurantLocation,
  courierName,
  courierLocation,
  onChangeAddressAndLocation,
}: PueblaAddressMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);
  const customerMarkerRef = useRef<LeafletMarkerInstance | null>(null);
  const restaurantMarkerRef = useRef<LeafletMarkerInstance | null>(null);
  const courierMarkerRef = useRef<LeafletMarkerInstance | null>(null);
  const routePolylineRef = useRef<LeafletPolylineInstance | null>(null);

  const [leafletReady, setLeafletReady] = useState(false);
  const [searchInput, setSearchInput] = useState(customerAddress);
  const [isSearching, setIsSearching] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [routeMetrics, setRouteMetrics] = useState<{
    distanceKm: number;
    durationMinutes: number;
  }>({ distanceKm: 1.4, durationMinutes: 8 });
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  useEffect(() => {
    setSearchInput(customerAddress);
  }, [customerAddress]);

  const handlePinMoved = async (lat: number, lng: number) => {
    if (mode !== "picker" || !onChangeAddressAndLocation) return;
    setIsReverseGeocoding(true);
    setSearchFeedback(null);
    try {
      const resolvedLabel = await reverseGeocodePuebla(lat, lng);
      const updatedPoint = latLngToPueblaPoint(lat, lng, resolvedLabel);
      setSearchInput(resolvedLabel);
      onChangeAddressAndLocation(resolvedLabel, updatedPoint);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Inicializar Leaflet y OpenStreetMap en Puebla
  useEffect(() => {
    let disposed = false;
    void ensureLeafletLoaded().then((L) => {
      if (disposed || !L || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [
          customerLocation.lat || PUEBLA_CENTER.lat,
          customerLocation.lng || PUEBLA_CENTER.lng,
        ],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors · Zona Puebla",
      }).addTo(map);

      if (mode === "picker") {
        map.on("click", (e) => {
          void handlePinMoved(e.latlng.lat, e.latlng.lng);
        });
      }

      mapInstanceRef.current = map;
      setLeafletReady(true);
      setTimeout(() => map.invalidateSize(), 150);
    });

    return () => {
      disposed = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        customerMarkerRef.current = null;
        restaurantMarkerRef.current = null;
        courierMarkerRef.current = null;
        routePolylineRef.current = null;
      }
    };
  }, [mode]);

  // Actualizar marcadores y ruta real OSRM por calles de Puebla
  useEffect(() => {
    if (!leafletReady || !mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    // 1. Marcador del Restaurante en Puebla
    const restIcon = L.divIcon({
      className: "coconea-map-icon",
      html: `<div style="background:#3D2314;color:#FFF8F5;border:2px solid #D27D2D;border-radius:9999px;padding:4px 10px;font-size:11px;font-weight:800;white-space:nowrap;box-shadow:0 4px 12px rgba(61,35,20,0.35);display:flex;align-items:center;gap:4px;">
        <span>🏪 ${restaurantName}</span>
      </div>`,
      iconSize: [120, 28],
      iconAnchor: [60, 14],
    });

    if (!restaurantMarkerRef.current) {
      restaurantMarkerRef.current = L.marker(
        [restaurantLocation.lat, restaurantLocation.lng],
        { icon: restIcon },
      )
        .addTo(map)
        .bindPopup(
          `<strong>${restaurantName}</strong><br/><span style="font-size:11px">${restaurantAddress}</span>`,
        );
    } else {
      restaurantMarkerRef.current.setLatLng([
        restaurantLocation.lat,
        restaurantLocation.lng,
      ]);
    }

    // 2. Pin del Cliente (Arrastrable en modo picker)
    const custIcon = L.divIcon({
      className: "coconea-map-icon",
      html: `<div style="background:#047857;color:#FFFFFF;border:2px solid #FFF8F5;border-radius:9999px;padding:5px 11px;font-size:11px;font-weight:800;white-space:nowrap;box-shadow:0 4px 14px rgba(4,120,87,0.45);display:flex;align-items:center;gap:4px;cursor:grab;">
        <span>📍 Tu Pin de Entrega</span>
      </div>`,
      iconSize: [140, 30],
      iconAnchor: [70, 15],
    });

    if (!customerMarkerRef.current) {
      const marker = L.marker([customerLocation.lat, customerLocation.lng], {
        icon: custIcon,
        draggable: mode === "picker",
      })
        .addTo(map)
        .bindPopup(
          `<strong>Tu Domicilio en Puebla</strong><br/><span style="font-size:11px">${customerAddress}</span>`,
        );

      if (mode === "picker") {
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          void handlePinMoved(pos.lat, pos.lng);
        });
      }
      customerMarkerRef.current = marker;
    } else {
      customerMarkerRef.current.setLatLng([
        customerLocation.lat,
        customerLocation.lng,
      ]);
      customerMarkerRef.current.bindPopup(
        `<strong>Tu Domicilio en Puebla</strong><br/><span style="font-size:11px">${customerAddress}</span>`,
      );
    }

    // 3. Marcador del Repartidor (si está activo)
    if (courierLocation) {
      const courierIcon = L.divIcon({
        className: "coconea-map-icon",
        html: `<div style="background:#D27D2D;color:#FFFFFF;border:2px solid #3D2314;border-radius:9999px;padding:4px 10px;font-size:11px;font-weight:800;white-space:nowrap;box-shadow:0 4px 12px rgba(210,125,45,0.45);display:flex;align-items:center;gap:4px;">
          <span>🛵 ${courierName ? courierName.split(" ")[0] : "Repartidor"}</span>
        </div>`,
        iconSize: [120, 28],
        iconAnchor: [60, 14],
      });

      if (!courierMarkerRef.current) {
        courierMarkerRef.current = L.marker(
          [courierLocation.lat, courierLocation.lng],
          { icon: courierIcon },
        ).addTo(map);
      } else {
        courierMarkerRef.current.setLatLng([
          courierLocation.lat,
          courierLocation.lng,
        ]);
      }
    } else if (courierMarkerRef.current) {
      courierMarkerRef.current.remove();
      courierMarkerRef.current = null;
    }

    // 4. Trazar ruta real por calles de Puebla con OSRM
    const waypoints = courierLocation
      ? [courierLocation, restaurantLocation, customerLocation]
      : [restaurantLocation, customerLocation];

    let cancelled = false;
    void fetchRealOsrmRoute(waypoints).then((route) => {
      if (cancelled || !mapInstanceRef.current) return;
      setRouteMetrics({
        distanceKm: route.distanceKm,
        durationMinutes: route.durationMin,
      });

      if (!routePolylineRef.current) {
        routePolylineRef.current = L.polyline(route.coordinates, {
          color: "#3D2314",
          weight: 4,
          opacity: 0.88,
          dashArray: mode === "picker" ? "6, 6" : undefined,
        }).addTo(map);
      } else {
        routePolylineRef.current.setLatLngs(route.coordinates);
      }

      const boundsPoints: [number, number][] = [
        [restaurantLocation.lat, restaurantLocation.lng],
        [customerLocation.lat, customerLocation.lng],
      ];
      if (courierLocation) {
        boundsPoints.push([courierLocation.lat, courierLocation.lng]);
      }
      map.fitBounds(boundsPoints, { padding: [36, 36], maxZoom: 15 });
    });

    return () => {
      cancelled = true;
    };
  }, [
    leafletReady,
    customerLocation.lat,
    customerLocation.lng,
    restaurantLocation.lat,
    restaurantLocation.lng,
    restaurantName,
    courierLocation?.lat,
    courierLocation?.lng,
    courierName,
    mode,
  ]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim() || !onChangeAddressAndLocation) return;
    setIsSearching(true);
    setSearchFeedback(null);
    try {
      const results = await geocodePueblaAddress(searchInput.trim());
      const first = results[0];
      if (first) {
        const label = first.displayName.split(",").slice(0, 4).join(", ");
        const point = latLngToPueblaPoint(first.lat, first.lng, label);
        onChangeAddressAndLocation(label, point);
        setSearchInput(label);
        setSearchFeedback("Dirección localizada en el mapa de Puebla.");
      } else {
        setSearchFeedback(
          "No encontramos esa calle exacta; toca cualquier punto en el mapa de Puebla para fijar tu Pin.",
        );
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="rounded-2xl border border-cream-border bg-white p-3 space-y-2.5 shadow-2xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-caramel shrink-0" />
          <span className="text-xs font-extrabold text-espresso">
            {mode === "picker"
              ? "Dirección de Envío y Pin en Puebla"
              : "Mapa en Vivo y Ruta Real en Puebla"}
          </span>
        </div>
        <span className="rounded-full bg-cream-container border border-cream-border px-2.5 py-0.5 text-[10px] font-bold text-caramel">
          Ruta real: {routeMetrics.distanceKm} km • ~{routeMetrics.durationMinutes} min
        </span>
      </div>

      {mode === "picker" && (
        <>
          <form onSubmit={(e) => void handleSearchSubmit(e)} className="flex gap-1.5">
            <div className="relative flex-1">
              <Search className="h-3.5 w-3.5 text-coffee-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  onChangeAddressAndLocation?.(e.target.value, {
                    ...customerLocation,
                    label: e.target.value,
                  });
                }}
                placeholder="Ej. Av. Juárez 1905, La Paz, Puebla..."
                className="w-full rounded-xl border border-cream-border bg-cream-soft/50 pl-8 pr-3 py-2 text-xs font-semibold text-espresso placeholder-coffee-muted/60 focus:outline-none focus:border-caramel"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="rounded-xl bg-espresso text-white px-3 py-2 text-xs font-bold hover:bg-espresso-light transition cursor-pointer disabled:opacity-50 flex items-center gap-1 shrink-0"
            >
              {isSearching ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-caramel" />
              ) : (
                <Navigation className="h-3.5 w-3.5 text-caramel" />
              )}
              <span>Buscar</span>
            </button>
          </form>

          {/* Zonas rápidas de Puebla para fijar el Pin */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-coffee-muted block">
              O elige una zona rápida en Puebla (o mueve el Pin en el mapa):
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {PUEBLA_QUICK_LOCATIONS.map((preset) => {
                const presetLabel = preset.label || `${preset.lat}, ${preset.lng}`;
                const shortZone = presetLabel.split(",")[1]?.trim() || presetLabel.split(",")[0] || "Puebla";
                const isSelected =
                  Math.abs(customerLocation.lat - preset.lat) < 0.0008 &&
                  Math.abs(customerLocation.lng - preset.lng) < 0.0008;
                return (
                  <button
                    key={presetLabel}
                    type="button"
                    onClick={() => {
                      const pt = latLngToPueblaPoint(
                        preset.lat,
                        preset.lng,
                        presetLabel,
                      );
                      setSearchInput(presetLabel);
                      setSearchFeedback(`Pin movido a ${shortZone}.`);
                      onChangeAddressAndLocation?.(presetLabel, pt);
                    }}
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold border transition cursor-pointer ${
                      isSelected
                        ? "bg-espresso text-white border-espresso"
                        : "bg-cream-container/70 text-espresso border-cream-border hover:bg-cream-container"
                    }`}
                  >
                    📍 {shortZone}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Contenedor del Mapa Real OpenStreetMap de Puebla */}
      <div className="relative h-56 w-full rounded-2xl border border-cream-border overflow-hidden bg-[#FAF5EE]">
        <div ref={mapContainerRef} className="h-full w-full z-0" />
        {isReverseGeocoding && (
          <div className="absolute top-2.5 left-2.5 z-[400] rounded-full bg-espresso/90 text-cream px-3 py-1 text-[10px] font-bold flex items-center gap-1.5 shadow-md">
            <Loader2 className="h-3 w-3 animate-spin text-caramel" />
            <span>Actualizando dirección del Pin en Puebla...</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 z-[400] rounded-xl bg-white/95 backdrop-blur-xs border border-cream-border px-2.5 py-1 text-[10px] font-bold text-espresso shadow-xs flex items-center gap-1.5">
          <Compass className="h-3 w-3 text-caramel shrink-0" />
          <span>
            {mode === "picker"
              ? "Toca el mapa o arrastra el Pin verde para elegir tu punto exacto"
              : "Ruta real por calles de Puebla (OSRM)"}
          </span>
        </div>
      </div>

      {/* Confirmación visual de coordenadas y dirección seleccionada */}
      <div className="rounded-xl bg-cream-soft/80 border border-cream-border px-2.5 py-2 flex items-start justify-between gap-2 text-[11px]">
        <div className="min-w-0">
          <span className="font-bold text-caramel uppercase text-[9px] tracking-wider block">
            Domicilio con Pin confirmado en Puebla:
          </span>
          <p className="font-bold text-espresso leading-snug break-words">
            {customerAddress}
          </p>
          {searchFeedback && (
            <p className="text-[10px] font-semibold text-emerald-700 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 shrink-0" />
              <span>{searchFeedback}</span>
            </p>
          )}
        </div>
        <span className="shrink-0 rounded-lg bg-white border border-cream-border px-2 py-0.5 text-[10px] font-mono text-coffee-muted">
          {customerLocation.lat.toFixed(4)}, {customerLocation.lng.toFixed(4)}
        </span>
      </div>
    </div>
  );
}
