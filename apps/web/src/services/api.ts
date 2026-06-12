import type {
  AlgorithmCategory,
  AlgorithmDefinition,
  AlgorithmTask,
  CreateTaskRequest,
  DatasetGroup,
} from "@geocalc/shared";

export interface AlgorithmPayload {
  categories: AlgorithmCategory[];
  algorithms: AlgorithmDefinition[];
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  datasets: () => request<DatasetGroup[]>("/api/datasets"),
  algorithms: () => request<AlgorithmPayload>("/api/algorithms"),
  tasks: () => request<AlgorithmTask[]>("/api/tasks"),
  createTask: (payload: CreateTaskRequest) =>
    request<AlgorithmTask>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
