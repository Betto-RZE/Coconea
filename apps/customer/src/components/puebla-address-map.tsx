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
import type {
  CourierTrackingStep,
  GeoPoint,
  KitchenOrderStage,
} from "@coconea/types";

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
  courierStep?: CourierTrackingStep;
  kitchenStage?: KitchenOrderStage;
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
  courierStep,
  kitchenStage,
  onChangeAddressAndLocation,
}: PueblaAddressMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);
  const customerMarkerRef = useRef<LeafletMarkerInstance | null>(null);
  const restaurantMarkerRef = useRef<LeafletMarkerInstance | null>(null);
  const courierMarkerRef = useRef<LeafletMarkerInstance | null>(null);
  const routePolylineRef = useRef<LeafletPolylineInstance | null>(null);
  const referenceRoutePolylineRef = useRef<LeafletPolylineInstance | null>(
    null,
  );
  const lastFittedKeyRef = useRef<string>("");

  const [leafletReady, setLeafletReady] = useState(false);
  const [searchInput, setSearchInput] = useState(customerAddress);
  const [isSearching, setIsSearching] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [routeMetrics, setRouteMetrics] = useState<{
    distanceKm: number;
    durationMinutes: number;
  }>({ distanceKm: 1.4, durationMinutes: 8 });
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const isCourierEnRouteToCustomer =
    mode === "tracking" &&
    Boolean(courierLocation) &&
    (courierStep === "EN_ENTREGA" ||
      courierStep === "EN_DOMICILIO" ||
      kitchenStage === "EN_DELIVERY");

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

  // Inicializar Leaflet con mosaicos limpios y modernos de CartoDB Voyager (sin ruido ni elementos innecesarios)
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

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 19,
          attribution:
            "Tiles &copy; Esri &mdash; OpenStreetMap contributors",
        },
      ).addTo(map);

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
        referenceRoutePolylineRef.current = null;
      }
    };
  }, [mode]);

  // Actualizar marcadores simplificados e intuitivos (Pin de aguja, Restaurante y Repartidor)
  useEffect(() => {
    if (!leafletReady || !mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    // 1. Marcador del Restaurante de origen (Pin minimalista tipo burbuja con icono de cocina)
    const restIcon = L.divIcon({
      className: "coconea-rest-icon",
      html: `<div style="position:relative;width:34px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;filter:drop-shadow(0 4px 6px rgba(61,35,20,0.35));">
        <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:12px;height:4px;border-radius:9999px;background:rgba(61,35,20,0.35);filter:blur(1px);"></div>
        <div style="position:absolute;bottom:2px;left:50%;transform:translateX(-50%);width:2.5px;height:16px;background:#3D2314;border-radius:0 0 2px 2px;"></div>
        <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:28px;height:28px;border-radius:9999px;background:#3D2314;border:2px solid #D27D2D;box-shadow:0 3px 8px rgba(61,35,20,0.4);display:flex;align-items:center;justify-content:center;font-size:13px;color:#FFF8F5;">
          🏪
        </div>
      </div>`,
      iconSize: [34, 44],
      iconAnchor: [17, 42],
    });

    if (!restaurantMarkerRef.current) {
      restaurantMarkerRef.current = L.marker(
        [restaurantLocation.lat, restaurantLocation.lng],
        { icon: restIcon },
      )
        .addTo(map)
        .bindPopup(
          `<strong>${restaurantName}</strong><br/><span style="font-size:11px">📍 ${restaurantAddress}</span>`,
        );
    } else {
      restaurantMarkerRef.current.setLatLng([
        restaurantLocation.lat,
        restaurantLocation.lng,
      ]);
      restaurantMarkerRef.current.bindPopup(
        `<strong>${restaurantName}</strong><br/><span style="font-size:11px">📍 ${restaurantAddress}</span>`,
      );
    }

    // 2. Pin del Cliente: Figurita limpia estilo "palito con bolita arriba", sin texto intrusivo.
    // La punta inferior de la aguja indica la calle exacta.
    const custIcon = L.divIcon({
      className: "coconea-pin-icon",
      html: `<div style="position:relative;width:32px;height:46px;display:flex;align-items:center;justify-content:center;cursor:${mode === "picker" ? "grab" : "pointer"};filter:drop-shadow(0 4px 6px rgba(46,26,15,0.35));">
        <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:14px;height:5px;border-radius:9999px;background:rgba(46,26,15,0.32);filter:blur(1px);"></div>
        <div style="position:absolute;bottom:3px;left:50%;transform:translateX(-50%);width:3px;height:24px;background:#3D2314;border-radius:0 0 2px 2px;"></div>
        <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:24px;height:24px;border-radius:9999px;background:linear-gradient(135deg,#10B981,#047857);border:2.5px solid #FFFFFF;box-shadow:0 3px 8px rgba(4,120,87,0.45);display:flex;align-items:center;justify-content:center;">
          <div style="width:7px;height:7px;border-radius:9999px;background:#FFFFFF;"></div>
        </div>
      </div>`,
      iconSize: [32, 46],
      iconAnchor: [16, 43],
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

    // 3. Marcador del Repartidor (Rider en vivo con halo radar sutil)
    if (courierLocation) {
      const courierIcon = L.divIcon({
        className: "coconea-rider-icon",
        html: `<div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 4px 8px rgba(61,35,20,0.35));">
          <div style="position:absolute;width:38px;height:38px;border-radius:9999px;background:rgba(210,125,45,0.28);animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite;"></div>
          <div style="width:28px;height:28px;border-radius:9999px;background:#3D2314;border:2px solid #FFFFFF;display:flex;align-items:center;justify-content:center;font-size:14px;color:#FFFFFF;">
            🛵
          </div>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      if (!courierMarkerRef.current) {
        courierMarkerRef.current = L.marker(
          [courierLocation.lat, courierLocation.lng],
          { icon: courierIcon },
        )
          .addTo(map)
          .bindPopup(
            `<strong>Repartidor: ${courierName || "En ruta"}</strong><br/><span style="font-size:11px">${courierLocation.label || "Avanzando por calles de Puebla"}</span>`,
          );
      } else {
        courierMarkerRef.current.setLatLng([
          courierLocation.lat,
          courierLocation.lng,
        ]);
        courierMarkerRef.current.bindPopup(
          `<strong>Repartidor: ${courierName || "En ruta"}</strong><br/><span style="font-size:11px">${courierLocation.label || "Avanzando por calles de Puebla"}</span>`,
        );
      }
    } else if (courierMarkerRef.current) {
      courierMarkerRef.current.remove();
      courierMarkerRef.current = null;
    }

    // 4. Trazar ruta real por calles de Puebla con OSRM (Trazo suave y limpio)
    let cancelled = false;
    const drawCustomerMapRoutes = async () => {
      if (isCourierEnRouteToCustomer && courierLocation) {
        const [fullCorridor, activeCourierLeg] = await Promise.all([
          fetchRealOsrmRoute([restaurantLocation, customerLocation]),
          fetchRealOsrmRoute([courierLocation, customerLocation]),
        ]);
        if (cancelled || !mapInstanceRef.current) return;

        setRouteMetrics({
          distanceKm: activeCourierLeg.distanceKm,
          durationMinutes: activeCourierLeg.durationMin,
        });

        if (!referenceRoutePolylineRef.current) {
          referenceRoutePolylineRef.current = L.polyline(
            fullCorridor.coordinates,
            {
              color: "#C49A6C",
              weight: 3,
              opacity: 0.55,
              dashArray: "6, 8",
            },
          ).addTo(map);
        } else {
          referenceRoutePolylineRef.current.setLatLngs(
            fullCorridor.coordinates,
          );
        }

        if (!routePolylineRef.current) {
          routePolylineRef.current = L.polyline(activeCourierLeg.coordinates, {
            color: "#3D2314",
            weight: 5,
            opacity: 0.95,
          }).addTo(map);
        } else {
          routePolylineRef.current.setLatLngs(activeCourierLeg.coordinates);
        }
      } else {
        if (referenceRoutePolylineRef.current) {
          referenceRoutePolylineRef.current.remove();
          referenceRoutePolylineRef.current = null;
        }
        const waypoints =
          courierLocation && courierStep === "ACEPTADO_EN_RUTA_RESTAURANTE"
            ? [courierLocation, restaurantLocation, customerLocation]
            : [restaurantLocation, customerLocation];
        const route = await fetchRealOsrmRoute(waypoints);
        if (cancelled || !mapInstanceRef.current) return;

        setRouteMetrics({
          distanceKm: route.distanceKm,
          durationMinutes: route.durationMin,
        });

        if (!routePolylineRef.current) {
          routePolylineRef.current = L.polyline(route.coordinates, {
            color: "#3D2314",
            weight: 4.5,
            opacity: 0.9,
            dashArray: mode === "picker" ? "6, 6" : undefined,
          }).addTo(map);
        } else {
          routePolylineRef.current.setLatLngs(route.coordinates);
        }
      }

      const fitKey = `${mode}|${restaurantName}|${customerLocation.lat.toFixed(4)},${customerLocation.lng.toFixed(4)}|${courierStep || "none"}`;
      if (lastFittedKeyRef.current !== fitKey) {
        lastFittedKeyRef.current = fitKey;
        const boundsPoints: [number, number][] = [
          [restaurantLocation.lat, restaurantLocation.lng],
          [customerLocation.lat, customerLocation.lng],
        ];
        if (courierLocation) {
          boundsPoints.push([courierLocation.lat, courierLocation.lng]);
        }
        map.fitBounds(boundsPoints, { padding: [36, 36], maxZoom: 15 });
      }
    };

    void drawCustomerMapRoutes();

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
    restaurantAddress,
    courierLocation?.lat,
    courierLocation?.lng,
    courierLocation?.label,
    courierName,
    courierStep,
    kitchenStage,
    isCourierEnRouteToCustomer,
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
          "No encontramos esa calle exacta; toca cualquier punto en el mapa para fijar tu Pin.",
        );
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="rounded-3xl border border-cream-border/90 bg-white p-3 sm:p-4 space-y-3 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-caramel shrink-0" />
          <span className="text-xs font-extrabold text-espresso">
            {mode === "picker"
              ? "Ubicación de Entrega en Puebla"
              : isCourierEnRouteToCustomer
                ? "Repartidor en Ruta hacia tu Domicilio"
                : "Ruta del Pedido en Puebla"}
          </span>
        </div>
        <span className="rounded-full bg-cream-container border border-cream-border px-3 py-0.5 text-[11px] font-black text-espresso">
          {isCourierEnRouteToCustomer ? "Restan:" : "Ruta:"}{" "}
          {routeMetrics.distanceKm} km • ~{routeMetrics.durationMinutes} min
        </span>
      </div>

      {mode === "tracking" && (
        <div
          className={`rounded-2xl border px-3.5 py-2.5 text-xs flex items-center gap-2.5 ${
            isCourierEnRouteToCustomer
              ? "bg-emerald-50/95 border-emerald-200 text-emerald-950"
              : "bg-cream-container/70 border-cream-border text-espresso"
          }`}
        >
          {isCourierEnRouteToCustomer ? (
            <Bike className="h-4 w-4 text-emerald-700 shrink-0" />
          ) : (
            <Store className="h-4 w-4 text-caramel shrink-0" />
          )}
          <div className="min-w-0 flex-1 leading-snug">
            <p className="font-extrabold text-[11px]">
              {isCourierEnRouteToCustomer
                ? `🛵 ${courierName || "Tu repartidor"} va en camino hacia tu punto de entrega.`
                : courierLocation
                  ? `🏪 ${courierName || "Tu repartidor"} está en ${restaurantName} recogiendo tu pedido.`
                  : `🏪 ${restaurantName} (${restaurantAddress})`}
            </p>
            {courierLocation?.label && isCourierEnRouteToCustomer && (
              <p className="text-[10px] text-coffee-muted truncate font-medium mt-0.5">
                {courierLocation.label}
              </p>
            )}
          </div>
        </div>
      )}

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
                placeholder="Busca calle, colonia o zona en Puebla..."
                className="w-full rounded-2xl border border-cream-border bg-cream-soft/50 pl-8 pr-3 py-2.5 text-xs font-semibold text-espresso placeholder-coffee-muted/60 focus:outline-none focus:border-caramel"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="rounded-2xl bg-espresso text-white px-3.5 py-2.5 text-xs font-bold hover:bg-espresso-light transition cursor-pointer disabled:opacity-50 flex items-center gap-1 shrink-0"
            >
              {isSearching ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-caramel" />
              ) : (
                <Navigation className="h-3.5 w-3.5 text-caramel" />
              )}
              <span>Buscar</span>
            </button>
          </form>

          {/* Zonas rápidas limpias para fijar el Pin */}
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
                    setSearchFeedback(`Pin fijado en ${shortZone}.`);
                    onChangeAddressAndLocation?.(presetLabel, pt);
                  }}
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold border transition cursor-pointer ${
                    isSelected
                      ? "bg-espresso text-white border-espresso shadow-2xs"
                      : "bg-cream-container/60 text-espresso border-cream-border hover:bg-cream-container"
                  }`}
                >
                  📍 {shortZone}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Contenedor del Mapa Simplificado y Espacioso */}
      <div
        className={`relative w-full rounded-2xl border border-cream-border overflow-hidden bg-[#FAF5EE] shadow-inner ${
          mode === "picker" ? "h-72 sm:h-80" : "h-80 sm:h-96"
        }`}
      >
        <div ref={mapContainerRef} className="h-full w-full z-0" />
        {isReverseGeocoding && (
          <div className="absolute top-2.5 left-2.5 z-[400] rounded-full bg-espresso/90 text-cream px-3 py-1 text-[10px] font-bold flex items-center gap-1.5 shadow-md">
            <Loader2 className="h-3 w-3 animate-spin text-caramel" />
            <span>Fijando calle exacta del Pin...</span>
          </div>
        )}
        {mode === "picker" && (
          <div className="absolute bottom-2.5 left-2.5 z-[400] rounded-full bg-white/95 backdrop-blur-xs border border-cream-border px-3 py-1 text-[10px] font-bold text-espresso shadow-xs pointer-events-none">
            Toca el mapa o arrastra el Pin verde para ajustar tu dirección
          </div>
        )}
      </div>

      {/* Domicilio seleccionado */}
      <div className="rounded-2xl bg-cream-soft/80 border border-cream-border px-3 py-2 flex items-center justify-between gap-2 text-xs">
        <div className="min-w-0 flex-1">
          <p className="font-extrabold text-espresso truncate">
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
