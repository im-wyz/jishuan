import cors from "cors";
import express from "express";
import { nanoid } from "nanoid";
import type { AlgorithmTask, CreateTaskRequest } from "@geocalc/shared";
import { algorithmCategories, algorithms, datasetGroups, tasks } from "./fixtures.js";

const app = express();
const port = Number(process.env.PORT ?? 4100);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "geocalc-api", time: new Date().toISOString() });
});

app.get("/api/datasets", (_req, res) => {
  res.json(datasetGroups);
});

app.get("/api/algorithms", (_req, res) => {
  res.json({ categories: algorithmCategories, algorithms });
});

app.get("/api/tasks", (_req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const body = req.body as Partial<CreateTaskRequest>;
  if (!body.algorithmId || !body.areaName || !Array.isArray(body.datasetIds)) {
    res.status(400).json({ message: "algorithmId, areaName and datasetIds are required" });
    return;
  }

  const algorithm = algorithms.find((item) => item.id === body.algorithmId);
  if (!algorithm) {
    res.status(404).json({ message: "Algorithm not found" });
    return;
  }

  const task: AlgorithmTask = {
    id: `task-${nanoid(8)}`,
    algorithmId: algorithm.id,
    name: `${body.areaName}${algorithm.name}`,
    status: "queued",
    progress: 0,
    areaName: body.areaName,
    createdAt: new Date().toISOString(),
  };
  tasks.unshift(task);
  res.status(201).json(task);
});

app.listen(port, () => {
  console.log(`Geo calculator API listening on http://localhost:${port}`);
});
