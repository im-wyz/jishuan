import "mapbox-gl/dist/mapbox-gl.css";
import {
  AlertTriangle,
  BoxSelect,
  ChevronLeft,
  ChevronRight,
  Compass,
  Crosshair,
  Globe2,
  Grid3X3,
  Layers3,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  Ruler,
} from "lucide-react";
import mapboxgl from "mapbox-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MapViewState } from "@geocalc/shared";
import { SearchOverlay } from "@/components/ShellParts";
import { useWorkbenchStore } from "@/store/workbenchStore";

interface MapCanvasProps {
  view: MapViewState;
}

const labels = {
  layer: "\u56fe\u5c42",
  select: "\u6846\u9009",
  measure: "\u6d4b\u91cf",
  grid: "\u683c\u7f51",
  globe: "\u5168\u7403",
  buildings: "\u5efa\u7b51\u7269",
  water: "\u6c34\u4f53",
  roads: "\u9053\u8def",
  green: "\u7eff\u5730",
  resultLayers: "\u7ed3\u679c\u56fe\u5c42",
  missingToken: "\u7f3a\u5c11 VITE_MAPBOX_ACCESS_TOKEN\uff0c\u8bf7\u5728 apps/web/.env.local \u4e2d\u914d\u7f6e Mapbox token\u3002",
  loadFailed: "Mapbox \u5730\u56fe\u52a0\u8f7d\u5931\u8d25\u3002",
  longitude: "\u7ecf\u5ea6",
  latitude: "\u7eac\u5ea6",
  city: "\u5408\u80a5",
  mapAria: "\u5730\u7403\u5730\u56fe\u89c6\u56fe",
  collapseLeft: "\u6298\u53e0\u5de6\u4fa7\u9762\u677f",
  collapseRight: "\u6298\u53e0\u53f3\u4fa7\u9762\u677f",
  toolbar: "\u5730\u56fe\u5de5\u5177",
  zoomIn: "\u653e\u5927",
  zoomOut: "\u7f29\u5c0f",
  reset: "\u590d\u4f4d",
  locate: "\u5b9a\u4f4d",
  warn: "\u8b66\u793a",
  basemap: "\u5e95\u56fe\u5207\u6362",
} as const;

const mapTools = [
  { label: labels.layer, icon: Layers3 },
  { label: labels.select, icon: BoxSelect },
  { label: "3D", icon: Maximize2 },
  { label: labels.measure, icon: Ruler },
  { label: labels.grid, icon: Grid3X3 },
  { label: labels.globe, icon: Globe2 },
];

export function MapCanvas({ view }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const initialViewRef = useRef(view);
  const syncingFromStoreRef = useRef(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const setMapZoom = useWorkbenchStore((state) => state.setMapZoom);
  const setMapView = useWorkbenchStore((state) => state.setMapView);
  const togglePanel = useWorkbenchStore((state) => state.togglePanel);
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined;
  const collapsedLeft = useWorkbenchStore((state) => state.collapsedLeft);
  const collapsedRight = useWorkbenchStore((state) => state.collapsedRight);

  const center = useMemo<mapboxgl.LngLatLike>(() => [view.center[0], view.center[1]], [view.center]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    if (!token) {
      setMapError(labels.missingToken);
      return;
    }

    mapboxgl.accessToken = token;
    const initialView = initialViewRef.current;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [initialView.center[0], initialView.center[1]],
      zoom: initialView.zoom,
      pitch: initialView.pitch,
      bearing: initialView.bearing,
      attributionControl: false,
      logoPosition: "bottom-left",
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 80, unit: "metric" }), "bottom-right");

    map.on("moveend", () => {
      const nextCenter = map.getCenter();
      const nextZoom = map.getZoom();
      if (syncingFromStoreRef.current) {
        syncingFromStoreRef.current = false;
        return;
      }
      setMapView({
        center: [nextCenter.lng, nextCenter.lat],
        zoom: nextZoom,
        pitch: map.getPitch(),
        bearing: map.getBearing(),
      });
    });

    map.on("error", (event) => {
      setMapError(event.error?.message ?? labels.loadFailed);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [setMapView, token]);

  useEffect(() => {
    const map = mapRef.current;
    const container = containerRef.current;
    if (!map || !container) {
      return;
    }

    const resizeNow = () => map.resize();
    resizeNow();
    const firstFrame = window.requestAnimationFrame(resizeNow);
    const secondFrame = window.requestAnimationFrame(() => window.requestAnimationFrame(resizeNow));
    const timeout = window.setTimeout(resizeNow, 260);
    const observer = new ResizeObserver(resizeNow);
    observer.observe(container);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(timeout);
      observer.disconnect();
    };
  }, [collapsedLeft, collapsedRight]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const zoomDiff = Math.abs(map.getZoom() - view.zoom);
    const centerDiff = map.getCenter().distanceTo(new mapboxgl.LngLat(view.center[0], view.center[1]));
    if (zoomDiff > 0.01 || centerDiff > 1) {
      syncingFromStoreRef.current = true;
      map.easeTo({ center, zoom: view.zoom, pitch: view.pitch, bearing: view.bearing, duration: 350 });
    }
  }, [center, view.bearing, view.center, view.pitch, view.zoom]);

  const zoomIn = () => {
    const map = mapRef.current;
    if (map) {
      map.zoomIn();
      return;
    }
    setMapZoom(view.zoom + 0.5);
  };

  const zoomOut = () => {
    const map = mapRef.current;
    if (map) {
      map.zoomOut();
      return;
    }
    setMapZoom(view.zoom - 0.5);
  };

  const resetView = () => {
    const initialView = initialViewRef.current;
    setMapView({
      center: initialView.center,
      zoom: initialView.zoom,
      pitch: initialView.pitch,
      bearing: initialView.bearing,
    });
  };

  return (
    <section className="map-stage" aria-label={labels.mapAria}>
      <button className="collapse-handle left" type="button" onClick={() => togglePanel("left")} aria-label={labels.collapseLeft}><ChevronLeft size={24} /></button>
      <SearchOverlay city={labels.city} />

      <div ref={containerRef} className="mapbox-canvas" />
      {mapError && <div className="map-error">{mapError}</div>}


      <div className="map-toolbar" aria-label={labels.toolbar}>
        {mapTools.map((tool) => (
          <button key={tool.label} type="button" title={tool.label}>
            <tool.icon size={18} />
          </button>
        ))}
        <button type="button" title={labels.zoomIn} onClick={zoomIn}><Plus size={19} /></button>
        <button type="button" title={labels.zoomOut} onClick={zoomOut}><Minus size={19} /></button>
        <button type="button" title={labels.reset} onClick={resetView}><RotateCcw size={18} /></button>
        <button type="button" title={labels.locate}><Compass size={18} /></button>
        <button type="button" title={labels.warn}><AlertTriangle size={18} /></button>
        <button className="basemap-thumb" type="button" title={labels.basemap}><Crosshair size={15} /></button>
      </div>

      <button className="collapse-handle right" type="button" onClick={() => togglePanel("right")} aria-label={labels.collapseRight}><ChevronRight size={24} /></button>
      <div className="coordinate-readout">{labels.longitude} {view.center[0].toFixed(2)}?{labels.latitude} {view.center[1].toFixed(2)}?Zoom {view.zoom.toFixed(2)}</div>
    </section>
  );
}
