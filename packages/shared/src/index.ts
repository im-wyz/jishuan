export type DatasetSource = "cloud" | "public" | "daily" | "personal";

export interface DatasetGroup {
  id: string;
  name: string;
  source: DatasetSource;
  description: string;
  enabled: boolean;
  itemCount: number;
}

export type AlgorithmCategoryId = "interpretation" | "thematic" | "generation" | "basic" | "partner";

export interface AlgorithmCategory {
  id: AlgorithmCategoryId;
  name: string;
  available: number;
  total: number;
  expanded: boolean;
}

export type AlgorithmStatus = "stable" | "new" | "updated" | "loading";

export interface AlgorithmDefinition {
  id: string;
  categoryId: AlgorithmCategoryId;
  name: string;
  status: AlgorithmStatus;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
}

export type TaskStatus = "queued" | "running" | "succeeded" | "failed";

export interface AlgorithmTask {
  id: string;
  algorithmId: string;
  name: string;
  status: TaskStatus;
  progress: number;
  areaName: string;
  createdAt: string;
}

export interface MapViewState {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
  mode: "2d" | "3d" | "globe";
}

export interface CreateTaskRequest {
  algorithmId: string;
  datasetIds: string[];
  areaName: string;
}
