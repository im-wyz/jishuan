import { create } from "zustand";
import type { AlgorithmDefinition, DatasetGroup, MapViewState } from "@geocalc/shared";

interface WorkbenchState {
  activeDatasetIds: string[];
  selectedAlgorithmId: string;
  mapView: MapViewState;
  collapsedLeft: boolean;
  collapsedRight: boolean;
  selectAlgorithm: (id: string) => void;
  toggleDataset: (dataset: DatasetGroup) => void;
  setMapZoom: (zoom: number) => void;
  setMapView: (view: Partial<MapViewState>) => void;
  togglePanel: (side: "left" | "right") => void;
  bootstrap: (datasets: DatasetGroup[], algorithms: AlgorithmDefinition[]) => void;
}

const clampZoom = (zoom: number) => Math.max(2, Math.min(20, zoom));

export const useWorkbenchStore = create<WorkbenchState>((set, get) => ({
  activeDatasetIds: [],
  selectedAlgorithmId: "foundation-extract",
  mapView: {
    center: [121.43, 31.25],
    zoom: 12.68,
    pitch: 0,
    bearing: 0,
    mode: "globe",
  },
  collapsedLeft: false,
  collapsedRight: false,
  selectAlgorithm: (id) => set({ selectedAlgorithmId: id }),
  toggleDataset: (dataset) =>
    set((state) => ({
      activeDatasetIds: state.activeDatasetIds.includes(dataset.id)
        ? state.activeDatasetIds.filter((id) => id !== dataset.id)
        : [...state.activeDatasetIds, dataset.id],
    })),
  setMapZoom: (zoom) =>
    set((state) => ({
      mapView: { ...state.mapView, zoom: clampZoom(zoom) },
    })),
  setMapView: (view) =>
    set((state) => ({
      mapView: {
        ...state.mapView,
        ...view,
        zoom: view.zoom === undefined ? state.mapView.zoom : clampZoom(view.zoom),
      },
    })),
  togglePanel: (side) =>
    set((state) =>
      side === "left"
        ? { collapsedLeft: !state.collapsedLeft }
        : { collapsedRight: !state.collapsedRight },
    ),
  bootstrap: (datasets, algorithms) => {
    const { activeDatasetIds, selectedAlgorithmId } = get();
    set({
      activeDatasetIds: activeDatasetIds.length
        ? activeDatasetIds
        : datasets.filter((item) => item.enabled).map((item) => item.id),
      selectedAlgorithmId: algorithms.some((item) => item.id === selectedAlgorithmId)
        ? selectedAlgorithmId
        : (algorithms[0]?.id ?? selectedAlgorithmId),
    });
  },
}));
