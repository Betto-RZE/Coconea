"use client";

import React, { useEffect, useRef, useState } from "react";
import { Compass, Route, Loader2 } from "lucide-react";
import {
  PUEBLA_CENTER,
  PUEBLA_RESTAURANT_BRANCHES,
  fetchRealOsrmRoute,
  formatCurrencyMXN,
  checkOrderRouteCompatibility,
  KITCHEN_STAGE_LABELS,
} from "@coconea/shared";
import type { ActiveOrder, GeoPoint } from "@coconea/types";

interface LeafletMapInstance {
  setView: (center: [number, number], zoom?: number) => void;
  fitBounds: (
    bounds: [number, number][],
    options?: { padding?: [number, number]; maxZoom?: number },
  ) => void;
  remove: () => void;
  invalidateSize: () => void;
}

interface LeafletMarkerInstance {
  setLatLng: (latlng: [number, number]) => void;
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

export interface PueblaDeliveryMapProps {
  courierLocation: GeoPoint;
  courierName: string;
  availableOrders: ActiveOrder[];
  activeRouteOrders: ActiveOrder[];
  previewOrder: ActiveOrder | null;
  onSelectPreviewOrder: (orderId: string) => void;
  onSelectActiveOrder: (orderId: string) => void;
}

export function PueblaDeliveryMap({
  courierLocation,
  courierName,
  availableOrders,
  activeRouteOrders,
  previewOrder,
  onSelectPreviewOrder,
  onSelectActiveOrder,
}: PueblaDeliveryMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);
  const markersLayerRef = useRef<LeafletMarkerInstance[]>([]);
  const activeRoutePolylineRef = useRef<LeafletPolylineInstance | null>(null);
  const previewPolylineRef = useRef<LeafletPolylineInstance | null>(null);
  const lastFittedKeyRef = useRef<string>("");

  const [leafletReady, setLeafletReady] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeSummary, setRouteSummary] = useState<{
    distanceKm: number;
    durationMinutes: number;
  } | null>(null);

  const mapStateSignature = [
    courierLocation.lat.toFixed(4),
    courierLocation.lng.toFixed(4),
    courierName,
    previewOrder?.id || "none",
    availableOrders
      .map(
        (o) =>
          `${o.id}:${o.kitchenStage}:${o.customerLocation.lat.toFixed(4)},${o.customerLocation.lng.toFixed(4)}`,
      )
      .join(","),
    activeRouteOrders
      .map(
        (o) =>
          `${o.id}:${o.kitchenStage}:${o.courierStep}:${o.customerLocation.lat.toFixed(4)},${o.customerLocation.lng.toFixed(4)}`,
      )
      .join(","),
  ].join("|");

  useEffect(() => {
    let disposed = false;
    void ensureLeafletLoaded().then((L) => {
      if (disposed || !L || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [
          courierLocation.lat || PUEBLA_CENTER.lat,
          courierLocation.lng || PUEBLA_CENTER.lng,
        ],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors · Rutas Reales Puebla",
      }).addTo(map);

      mapInstanceRef.current = map;
      setLeafletReady(true);
      setTimeout(() => map.invalidateSize(), 150);
    });

    return () => {
      disposed = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = [];
        activeRoutePolylineRef.current = null;
        previewPolylineRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!leafletReady || !mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    // Limpiar marcadores previos
    for (const m of markersLayerRef.current) {
      m.remove();
    }
    markersLayerRef.current = [];

    const boundsPoints: [number, number][] = [
      [courierLocation.lat, courierLocation.lng],
    ];

    // 1. Marcador de la ubicación actual del Repartidor en Puebla
    const courierIcon = L.divIcon({
      className: "coconea-delivery-icon",
      html: `<div style="background:#3D2314;color:#FFF8F5;border:2px solid #D27D2D;border-radius:9999px;padding:4px 10px;font-size:11px;font-weight:800;white-space:nowrap;box-shadow:0 4px 12px rgba(61,35,20,0.45);display:flex;align-items:center;gap:4px;">
        <span>🛵 Tú (${courierName.split(" ")[0]})</span>
      </div>`,
      iconSize: [120, 28],
      iconAnchor: [60, 14],
    });
    const courierMarker = L.marker(
      [courierLocation.lat, courierLocation.lng],
      { icon: courierIcon },
    )
      .addTo(map)
      .bindPopup(
        `<strong>Tu ubicación en Puebla</strong><br/><span style="font-size:11px">${courierLocation.label}</span>`,
      );
    markersLayerRef.current.push(courierMarker);

    // 1.B Marcadores fijos de las 5 sucursales de Restaurantes registrados en Puebla
    const busyBranchNames = new Set<string>([
      ...availableOrders.map((o) => o.restaurantName.toLowerCase()),
      ...activeRouteOrders.map((o) => o.restaurantName.toLowerCase()),
    ]);
    for (const branch of PUEBLA_RESTAURANT_BRANCHES) {
      if (busyBranchNames.has(branch.name.toLowerCase())) continue;
      const branchIcon = L.divIcon({
        className: "coconea-delivery-icon",
        html: `<div style="background:#FFF8F5;color:#6F4E37;border:1.5px solid #C49A6C;border-radius:9999px;padding:2px 8px;font-size:10px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(61,35,20,0.18);opacity:0.92;">
          ${branch.emoji} ${branch.name}
        </div>`,
        iconSize: [120, 22],
        iconAnchor: [60, 11],
      });
      const branchMarker = L.marker(
        [branch.location.lat, branch.location.lng],
        { icon: branchIcon },
      )
        .addTo(map)
        .bindPopup(
          `<strong>${branch.emoji} Sucursal ${branch.name} (${branch.zone})</strong><br/>
          <span style="font-size:11px">📍 ${branch.address}<br/>
          <em>Sin pedidos pendientes en este instante</em></span>`,
        );
      markersLayerRef.current.push(branchMarker);
    }

    // 2. Marcadores de Pedidos Disponibles en Puebla (Restaurante + Cliente solicitante)
    for (const ord of availableOrders) {
      const compat = checkOrderRouteCompatibility(
        ord,
        courierLocation,
        activeRouteOrders,
      );
      const isSelected = previewOrder?.id === ord.id;
      const badgeBg = isSelected
        ? "#D27D2D"
        : compat.compatible
          ? "#FFFFFF"
          : "#E5E7EB";
      const badgeColor = isSelected
        ? "#FFFFFF"
        : compat.compatible
          ? "#3D2314"
          : "#6B7280";
      const borderCol = isSelected || compat.compatible ? "#D27D2D" : "#9CA3AF";

      const availRestIcon = L.divIcon({
        className: "coconea-delivery-icon",
        html: `<div style="background:${badgeBg};color:${badgeColor};border:2px solid ${borderCol};border-radius:9999px;padding:3px 9px;font-size:10px;font-weight:800;white-space:nowrap;box-shadow:0 3px 10px rgba(61,35,20,0.25);cursor:pointer;">
          🏪 ${ord.restaurantName} (+${formatCurrencyMXN(ord.courierEarnings)})
        </div>`,
        iconSize: [150, 24],
        iconAnchor: [75, 12],
      });

      const restMarker = L.marker(
        [ord.restaurantLocation.lat, ord.restaurantLocation.lng],
        { icon: availRestIcon },
      )
        .addTo(map)
        .bindPopup(
          `<strong>Disponible #${ord.id}: ${ord.restaurantName}</strong><br/>
          <span style="font-size:11px">📍 Recoger en: ${ord.restaurantAddress}<br/>
          Cocina: <strong>${KITCHEN_STAGE_LABELS[ord.kitchenStage]}</strong><br/>
          Cliente: <strong>${ord.customerName}</strong> (${ord.dishName})<br/>
          Destino: ${ord.customerAddress}</span>`,
        );

      restMarker.on("click", () => {
        onSelectPreviewOrder(ord.id);
      });
      markersLayerRef.current.push(restMarker);
      boundsPoints.push([
        ord.restaurantLocation.lat,
        ord.restaurantLocation.lng,
      ]);

      // Pin del usuario que solicitó el pedido (si está previsualizado)
      if (isSelected) {
        const previewCustIcon = L.divIcon({
          className: "coconea-delivery-icon",
          html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 4px 6px rgba(4,120,87,0.38));">
            <div style="width:22px;height:22px;border-radius:9999px;background:#047857;border:3px solid #FFF8F5;display:flex;align-items:center;justify-content:center;">
              <div style="width:7px;height:7px;border-radius:9999px;background:#FFF8F5;"></div>
            </div>
            <div style="width:3px;height:16px;background:#3D2314;margin-top:-1px;"></div>
            <div style="width:8px;height:3.5px;border-radius:9999px;background:rgba(46,26,15,0.45);margin-top:-1px;"></div>
          </div>`,
          iconSize: [26, 40],
          iconAnchor: [13, 38],
        });
        const custPreviewMarker = L.marker(
          [ord.customerLocation.lat, ord.customerLocation.lng],
          { icon: previewCustIcon },
        )
          .addTo(map)
          .bindPopup(
            `<strong>Cliente Solicitante: ${ord.customerName}</strong><br/><span style="font-size:11px">${ord.customerAddress}</span>`,
          );
        markersLayerRef.current.push(custPreviewMarker);
        boundsPoints.push([
          ord.customerLocation.lat,
          ord.customerLocation.lng,
        ]);
      }
    }

    // 3. Marcadores de Pedidos Aceptados en Ruta Activa (Paradas de Restaurante y Domicilio de Usuario)
    activeRouteOrders.forEach((ord, idx) => {
      const isReadyForPickup = ord.kitchenStage === "EN_ESPERA_REPARTIDOR";
      const activeRestIcon = L.divIcon({
        className: "coconea-delivery-icon",
        html: `<div style="background:${isReadyForPickup ? "#047857" : "#3D2314"};color:#FFFFFF;border:2px solid #D27D2D;border-radius:9999px;padding:4px 10px;font-size:10px;font-weight:900;white-space:nowrap;box-shadow:0 4px 12px rgba(61,35,20,0.4);">
          🏪 R${idx + 1}: ${ord.restaurantName} (${KITCHEN_STAGE_LABELS[ord.kitchenStage]})
        </div>`,
        iconSize: [185, 26],
        iconAnchor: [92, 13],
      });
      const rMarker = L.marker(
        [ord.restaurantLocation.lat, ord.restaurantLocation.lng],
        { icon: activeRestIcon },
      )
        .addTo(map)
        .bindPopup(
          `<strong>Parada Recolección R${idx + 1}: ${ord.restaurantName}</strong><br/>
          <span style="font-size:11px">📍 ${ord.restaurantAddress}<br/>
          Estado en cocina: <strong>${KITCHEN_STAGE_LABELS[ord.kitchenStage]}</strong></span>`,
        );
      rMarker.on("click", () => onSelectActiveOrder(ord.id));
      markersLayerRef.current.push(rMarker);

      const activeCustIcon = L.divIcon({
        className: "coconea-delivery-icon",
        html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 4px 6px rgba(4,120,87,0.42));">
          <div style="width:24px;height:24px;border-radius:9999px;background:#047857;border:3px solid #FFF8F5;display:flex;align-items:center;justify-content:center;">
            <div style="width:8px;height:8px;border-radius:9999px;background:#FFF8F5;"></div>
          </div>
          <div style="width:3.5px;height:18px;background:#3D2314;margin-top:-1px;"></div>
          <div style="width:9px;height:4px;border-radius:9999px;background:rgba(46,26,15,0.45);margin-top:-1px;"></div>
        </div>`,
        iconSize: [28, 44],
        iconAnchor: [14, 42],
      });
      const cMarker = L.marker(
        [ord.customerLocation.lat, ord.customerLocation.lng],
        { icon: activeCustIcon },
      )
        .addTo(map)
        .bindPopup(
          `<strong>Entrega C${idx + 1}: ${ord.customerName}</strong><br/><span style="font-size:11px">${ord.customerAddress}<br/>Platillo: ${ord.dishName}</span>`,
        );
      cMarker.on("click", () => onSelectActiveOrder(ord.id));
      markersLayerRef.current.push(cMarker);

      boundsPoints.push(
        [ord.restaurantLocation.lat, ord.restaurantLocation.lng],
        [ord.customerLocation.lat, ord.customerLocation.lng],
      );
    });

    const fitKey = `${previewOrder?.id || "none"}|${activeRouteOrders.map((o) => o.id).join(",")}|${availableOrders.length}`;
    if (boundsPoints.length > 1 && lastFittedKeyRef.current !== fitKey) {
      lastFittedKeyRef.current = fitKey;
      map.fitBounds(boundsPoints, { padding: [32, 32], maxZoom: 15 });
    }

    // 4. Calcular y dibujar ruta real por calles de Puebla con OSRM
    let cancelled = false;
    const drawRoutes = async () => {
      setIsCalculatingRoute(true);
      try {
        // A) Ruta activa real del repartidor (Restaurante -> Dirección del Cliente en Puebla)
        if (activeRouteOrders.length > 0) {
          const firstOrd = activeRouteOrders[0]!;
          const waypoints: GeoPoint[] =
            firstOrd.courierStep === "ESPERANDO_PEDIDO"
              ? []
              : [courierLocation];
          for (const ord of activeRouteOrders) {
            if (
              ord.courierStep === "ACEPTADO_EN_RUTA_RESTAURANTE" ||
              ord.courierStep === "ESPERANDO_PEDIDO"
            ) {
              waypoints.push(ord.restaurantLocation);
            }
            waypoints.push(ord.customerLocation);
          }
          const osrmRoute = await fetchRealOsrmRoute(waypoints);
          if (cancelled || !mapInstanceRef.current) return;
          setRouteSummary({
            distanceKm: osrmRoute.distanceKm,
            durationMinutes: osrmRoute.durationMin,
          });
          if (!activeRoutePolylineRef.current) {
            activeRoutePolylineRef.current = L.polyline(
              osrmRoute.coordinates,
              {
                color: "#3D2314",
                weight: 5,
                opacity: 0.92,
              },
            ).addTo(map);
          } else {
            activeRoutePolylineRef.current.setLatLngs(osrmRoute.coordinates);
          }
        } else if (activeRoutePolylineRef.current) {
          activeRoutePolylineRef.current.remove();
          activeRoutePolylineRef.current = null;
        }

        // B) Ruta de previsualización de un pedido disponible seleccionado en Puebla
        if (previewOrder) {
          const previewWaypoints: GeoPoint[] = [
            courierLocation,
            previewOrder.restaurantLocation,
            previewOrder.customerLocation,
          ];
          const previewOsrm = await fetchRealOsrmRoute(previewWaypoints);
          if (cancelled || !mapInstanceRef.current) return;
          if (activeRouteOrders.length === 0) {
            setRouteSummary({
              distanceKm: previewOsrm.distanceKm,
              durationMinutes: previewOsrm.durationMin,
            });
          }
          if (!previewPolylineRef.current) {
            previewPolylineRef.current = L.polyline(previewOsrm.coordinates, {
              color: "#D27D2D",
              weight: 3.5,
              opacity: 0.85,
              dashArray: "7, 7",
            }).addTo(map);
          } else {
            previewPolylineRef.current.setLatLngs(previewOsrm.coordinates);
          }
        } else if (previewPolylineRef.current) {
          previewPolylineRef.current.remove();
          previewPolylineRef.current = null;
        }
      } finally {
        if (!cancelled) setIsCalculatingRoute(false);
      }
    };

    void drawRoutes();

    return () => {
      cancelled = true;
    };
  }, [leafletReady, mapStateSignature]);

  return (
    <div className="relative h-[68vh] min-h-[480px] sm:h-[72vh] w-full rounded-3xl border border-cream-border bg-[#FAF5EE] overflow-hidden shadow-md">
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* HUD Superior Flotante estilo Rappi / DiDi */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col items-end gap-1.5 pointer-events-none">
        <span className="rounded-full bg-espresso/95 text-cream px-3 py-1 text-[10px] font-extrabold shadow-md border border-caramel/40 flex items-center gap-1.5">
          <Route className="h-3 w-3 text-caramel shrink-0" />
          <span>
            {activeRouteOrders.length > 0
              ? `En ruta (${activeRouteOrders.length})`
              : "Mapa en Vivo · Puebla"}
          </span>
        </span>
        {routeSummary && (
          <span className="rounded-full bg-white/95 backdrop-blur-xs border border-cream-border px-3 py-1 font-extrabold text-espresso text-[11px] shadow-md">
            {routeSummary.distanceKm} km • ~{routeSummary.durationMinutes} min
          </span>
        )}
      </div>

      {isCalculatingRoute && (
        <div className="absolute top-3 left-12 z-[400] rounded-full bg-espresso/90 text-cream px-3 py-1 text-[10px] font-bold flex items-center gap-1.5 shadow-md">
          <Loader2 className="h-3 w-3 animate-spin text-caramel" />
          <span>Trazando ruta real...</span>
        </div>
      )}

      <div className="absolute bottom-2.5 left-2.5 z-[400] rounded-xl bg-white/95 backdrop-blur-xs border border-cream-border px-2.5 py-1 text-[10px] font-bold text-espresso shadow-xs flex items-center gap-1.5 pointer-events-none">
        <Compass className="h-3 w-3 text-caramel shrink-0" />
        <span>
          Puebla, Pue. (La Paz · Centro · Huexotitla · Angelópolis)
        </span>
      </div>
    </div>
  );
}
