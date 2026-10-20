"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import { SchoolItem } from "@/data/schoolsData";
import {
  Compass,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  MapPin,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
} from "lucide-react";

interface DanapurSchoolsMapProps {
  schools: SchoolItem[];
  isHindi: boolean;
  selectedSchoolId?: string | null;
  onSchoolSelect?: (school: SchoolItem) => void;
  className?: string;
}

// Center of Patna cluster
const PATNA_CENTER = {
  lat: 25.626,
  lng: 85.044,
  zoom: 13,
};

export function DanapurSchoolsMap({
  schools,
  isHindi,
  selectedSchoolId,
  onSchoolSelect,
  className = "",
}: DanapurSchoolsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showLegend, setShowLegend] = useState(true);

  // Initialize Leaflet map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return; // Already initialized

      try {
        const L = (await import("leaflet")).default;

        if (!isMounted || !mapContainerRef.current) return;

        // Create Leaflet map instance
        const map = L.map(mapContainerRef.current, {
          center: [PATNA_CENTER.lat, PATNA_CENTER.lng],
          zoom: PATNA_CENTER.zoom,
          zoomControl: false, // Custom accessible controls placed on top right
          attributionControl: true,
          scrollWheelZoom: true,
        });

        // Add OpenStreetMap Tile Layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 10,
        }).addTo(map);

        // Marker layer group
        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;
        mapInstanceRef.current = map;

        setMapLoaded(true);
      } catch (err) {
        console.error("Failed to initialize Leaflet map:", err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore cleanup errors
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers whenever filtered schools or language changes
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !markersLayerRef.current) return;

    async function updateMarkers() {
      const L = (await import("leaflet")).default;
      const markersLayer = markersLayerRef.current;
      const map = mapInstanceRef.current;

      markersLayer.clearLayers();
      const bounds = L.latLngBounds([]);

      schools.forEach((school) => {
        if (!school.geo || !school.geo.lat || !school.geo.lng) return;

        const schoolName = isHindi ? school.name_hi : school.name_en;
        const schoolAddress = isHindi ? school.address_hi : school.address_en;
        const isAudited = school.auditStatus === "audited";
        const isFollowUp = school.auditStatus === "follow_up_required";
        const isPending = school.auditStatus === "pending";

        // Non-colour-only marker configuration (WCAG 1.4.1)
        // Audited: Circle with checkmark ✓
        // Follow-up Required: Rounded diamond / square with alert triangle ▲
        // Pending: Rounded octagon / clock with ⏳
        let markerHtml = "";
        let statusBadgeText = "";
        let statusBg = "";
        let shapeDesc = "";

        if (isAudited) {
          statusBadgeText = isHindi ? "✓ सत्यापित" : "✓ Audited";
          statusBg = "bg-emerald-700 text-white border-2 border-white shadow-md";
          shapeDesc = "Circle";
          markerHtml = `
            <div class="marker-pin-wrapper flex items-center justify-center cursor-pointer" role="button" aria-label="${schoolName}: ${statusBadgeText} (${shapeDesc})">
              <div class="w-9 h-9 rounded-full bg-teal-700 border-2 border-white shadow-lg flex items-center justify-center text-white font-black text-sm transition-transform">
                <span>✓</span>
              </div>
            </div>
          `;
        } else if (isFollowUp) {
          statusBadgeText = isHindi ? "▲ पुनः निरीक्षण" : "▲ Follow-up Required";
          statusBg = "bg-amber-600 text-white border-2 border-white shadow-md";
          shapeDesc = "Diamond";
          markerHtml = `
            <div class="marker-pin-wrapper flex items-center justify-center cursor-pointer" role="button" aria-label="${schoolName}: ${statusBadgeText} (${shapeDesc})">
              <div class="w-8 h-8 rounded-lg rotate-45 bg-amber-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-black text-sm transition-transform">
                <span class="-rotate-45">▲</span>
              </div>
            </div>
          `;
        } else {
          statusBadgeText = isHindi ? "⏳ प्रतीक्षित" : "⏳ Audit Pending";
          statusBg = "bg-slate-700 text-white border-2 border-white shadow-md";
          shapeDesc = "Square";
          markerHtml = `
            <div class="marker-pin-wrapper flex items-center justify-center cursor-pointer" role="button" aria-label="${schoolName}: ${statusBadgeText} (${shapeDesc})">
              <div class="w-8 h-8 rounded-md bg-slate-700 border-2 border-white shadow-lg flex items-center justify-center text-white font-black text-xs transition-transform">
                <span>⏳</span>
              </div>
            </div>
          `;
        }

        const customIcon = L.divIcon({
          className: "custom-school-marker",
          html: markerHtml,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -18],
        });

        // Rich Accessible Popup Content
        const facilitiesList = [
          { key: "ramp", label: isHindi ? "रैंप" : "Ramp", val: school.facilities.ramp },
          { key: "toilet", label: isHindi ? "शौचालय" : "CwSN Toilet", val: school.facilities.toilet },
          { key: "drinkingWater", label: isHindi ? "पेयजल" : "Drinking Water", val: school.facilities.drinkingWater },
          { key: "wideDoors", label: isHindi ? "चौड़े द्वार" : "Wide Doors", val: school.facilities.wideDoors },
          { key: "tactilePath", label: isHindi ? "स्पर्शनीय पाथवे" : "Tactile Path", val: school.facilities.tactilePath },
          { key: "emergencyExit", label: isHindi ? "आपात निकास" : "Emergency Exit", val: school.facilities.emergencyExit },
        ];

        const popupHtml = `
          <div class="bg-white p-4 rounded-xl space-y-3 font-sans text-slate-900">
            <!-- Header Badges -->
            <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <span class="text-[11px] font-bold px-2 py-0.5 rounded ${
                school.type === "government" ? "bg-blue-50 text-blue-800 border border-blue-200" : "bg-purple-50 text-purple-800 border border-purple-200"
              }">
                ${school.type === "government" ? (isHindi ? "सरकारी विद्यालय" : "Government School") : (isHindi ? "निजी विद्यालय" : "Private School")}
              </span>

              <span class="text-[11px] font-bold px-2 py-0.5 rounded ${statusBg}">
                ${statusBadgeText}
              </span>
            </div>

            <!-- Title & Address -->
            <div class="space-y-1">
              <h3 class="font-bold text-sm text-navy-900 leading-snug font-hindi">
                ${schoolName}
              </h3>
              <p class="text-xs text-slate-500 leading-relaxed flex items-start gap-1">
                <span>📍</span>
                <span>${schoolAddress}</span>
              </p>
            </div>

            <!-- Score Strip -->
            <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span class="font-semibold text-slate-600">
                ${isHindi ? "शोध सुगम्यता स्कोर:" : "Research Score:"}
              </span>
              ${
                school.auditStatus === "pending"
                  ? `<span class="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">${isHindi ? "प्रतीक्षित" : "Pending"}</span>`
                  : `<div class="flex items-baseline gap-1">
                       <span class="text-base font-black text-navy-900">${school.score}</span>
                       <span class="text-[10px] text-slate-500 font-bold">/100 pts</span>
                     </div>`
              }
            </div>

            <!-- Facilities Checklist -->
            <div class="space-y-1.5 pt-1">
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                ${isHindi ? "भौतिक सुविधाएं (सत्यापित स्थिति)" : "Verified Facilities:"}
              </span>
              <div class="grid grid-cols-2 gap-1 text-[11px]">
                ${facilitiesList
                  .map(
                    (f) => `
                  <div class="flex items-center gap-1.5 p-1 rounded ${
                    f.val ? "text-emerald-800 font-semibold" : "text-slate-400 line-through"
                  }">
                    <span>${f.val ? "✓" : "✕"}</span>
                    <span class="truncate">${f.label}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>

            <!-- Action Link Button -->
            <div class="pt-2 border-t border-slate-100 flex justify-end">
              <a
                href="/schools/${school.id}"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-colors shadow-xs"
              >
                <span>${isHindi ? "पूर्ण प्रोफ़ाइल व स्कोरकार्ड देखें" : "View Full Profile & Scorecard"}</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        `;

        const marker = L.marker([school.geo.lat, school.geo.lng], {
          icon: customIcon,
          title: schoolName,
          alt: `${schoolName} - ${statusBadgeText}`,
          riseOnHover: true,
        }).addTo(markersLayer);

        marker.bindPopup(popupHtml, {
          className: "custom-school-popup",
          maxWidth: 350,
        });

        marker.on("click", () => {
          if (onSchoolSelect) onSchoolSelect(school);
        });

        bounds.extend([school.geo.lat, school.geo.lng]);
      });

      // Fit bounds if schools exist
      if (schools.length > 0 && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }

    updateMarkers();
  }, [schools, isHindi, mapLoaded, onSchoolSelect]);

  // Handle controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [PATNA_CENTER.lat, PATNA_CENTER.lng],
        PATNA_CENTER.zoom
      );
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 ${className}`}
      style={{ minHeight: "520px", height: "65vh" }}
      role="region"
      aria-label={
        isHindi
          ? "विद्यालय सुगम्यता इंटरएक्टिव मानचित्र"
          : "School Accessibility Interactive Map"
      }
    >
      {/* Map DOM Target */}
      <div
        ref={mapContainerRef}
        id="patna-leaflet-map"
        className="w-full h-full z-0"
        tabIndex={0}
        aria-label={
          isHindi
            ? "पटना के विद्यालयों का मानचित्र। कीबोर्ड उपयोगकर्ताओं के लिए नीचे सुलभ सूची विकल्प उपलब्ध है।"
            : "Map of schools in Patna. Keyboard users can use the accessible list alternative below."
        }
      />

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-10 bg-slate-50 flex flex-col items-center justify-center gap-3 text-navy-800">
          <div
            className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <span className="text-sm font-semibold">
            {isHindi ? "मानचित्र लोड हो रहा है..." : "Loading map..."}
          </span>
        </div>
      )}

      {/* Top Floating Control Bar: Center & Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleResetCenter}
          title={isHindi ? "मानचित्र केंद्र पर रीसेट करें" : "Reset Map Center"}
          aria-label={isHindi ? "मानचित्र केंद्र पर रीसेट करें" : "Reset Map Center"}
          className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-xs border border-slate-200 shadow-md text-slate-700 hover:text-navy-900 hover:bg-white flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-teal-600"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="flex flex-col rounded-xl bg-white/95 backdrop-blur-xs border border-slate-200 shadow-md overflow-hidden">
          <button
            onClick={handleZoomIn}
            title={isHindi ? "ज़ूम इन" : "Zoom In"}
            aria-label={isHindi ? "ज़ूम इन" : "Zoom In"}
            className="w-10 h-10 text-slate-700 hover:text-navy-900 hover:bg-slate-50 flex items-center justify-center border-b border-slate-200 transition-all focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title={isHindi ? "ज़ूम आउट" : "Zoom Out"}
            aria-label={isHindi ? "ज़ूम आउट" : "Zoom Out"}
            className="w-10 h-10 text-slate-700 hover:text-navy-900 hover:bg-slate-50 flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Left Floating Pill: Filtered Schools Counter */}
      <div className="absolute top-4 left-4 z-20">
        <div className="px-3.5 py-1.5 rounded-full bg-navy-900/90 text-white backdrop-blur-xs border border-navy-700 shadow-md flex items-center gap-2 text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" aria-hidden="true" />
          <span>
            {isHindi
              ? `पटना: ${schools.length} विद्यालय प्रदर्शित`
              : `Patna: ${schools.length} Schools Shown`}
          </span>
        </div>
      </div>

      {/* Bottom Left Legend Drawer (Accessible, Non-Colour-Only) */}
      <div className="absolute bottom-6 left-4 z-20 max-w-xs">
        {showLegend ? (
          <div className="p-3.5 rounded-xl bg-white/95 backdrop-blur-xs border border-slate-200 shadow-lg space-y-2 text-xs text-slate-800 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="font-bold text-navy-900 text-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                <span>{isHindi ? "मानचित्र संकेतिका (Legend)" : "Map Legend"}</span>
              </span>
              <button
                onClick={() => setShowLegend(false)}
                className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                aria-label={isHindi ? "संकेतिका छिपाएं" : "Hide legend"}
              >
                {isHindi ? "छिपाएं" : "Hide"}
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-700 text-white font-black text-[10px] flex items-center justify-center shadow-xs">
                  ✓
                </span>
                <span className="text-[11px] font-medium">
                  {isHindi ? "सत्यापित (Audited) — गोल वृत्त" : "Audited — Circle"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md rotate-45 bg-amber-600 text-white font-black text-[10px] flex items-center justify-center shadow-xs">
                  <span className="-rotate-45">▲</span>
                </span>
                <span className="text-[11px] font-medium">
                  {isHindi ? "पुनः निरीक्षण (Follow-up) — डायमंड" : "Follow-up — Diamond"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-sm bg-slate-700 text-white font-black text-[10px] flex items-center justify-center shadow-xs">
                  ⏳
                </span>
                <span className="text-[11px] font-medium">
                  {isHindi ? "प्रतीक्षित (Pending) — चौकोर" : "Pending — Square"}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 italic">
              {isHindi
                ? "प्रत्येक स्थिति अलग आकार एवं चिह्न द्वारा पहचानी जाती है (WCAG 1.4.1)।"
                : "Indicators use distinct shapes & icons, not color alone."}
            </p>
          </div>
        ) : (
          <button
            onClick={() => setShowLegend(true)}
            className="px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-xs border border-slate-200 shadow-md text-xs font-semibold text-slate-700 hover:text-navy-900 flex items-center gap-1.5 transition-all"
            aria-label={isHindi ? "मानचित्र संकेतिका दिखाएं" : "Show map legend"}
          >
            <Layers className="w-3.5 h-3.5 text-teal-700" />
            <span>{isHindi ? "संकेतिका दिखाएं" : "Show Legend"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
