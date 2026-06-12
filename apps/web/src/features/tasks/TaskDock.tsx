import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleDot, Play, RadioTower } from "lucide-react";
import type { AlgorithmDefinition, AlgorithmTask } from "@geocalc/shared";
import { api } from "@/services/api";
import { useWorkbenchStore } from "@/store/workbenchStore";

interface TaskDockProps {
  tasks: AlgorithmTask[];
  algorithms: AlgorithmDefinition[];
}

export function TaskDock({ tasks, algorithms }: TaskDockProps) {
  const queryClient = useQueryClient();
  const activeDatasetIds = useWorkbenchStore((state) => state.activeDatasetIds);
  const selectedAlgorithmId = useWorkbenchStore((state) => state.selectedAlgorithmId);
  const selectedAlgorithm = algorithms.find((item) => item.id === selectedAlgorithmId);

  const createTask = useMutation({
    mutationFn: () =>
      api.createTask({
        algorithmId: selectedAlgorithmId,
        datasetIds: activeDatasetIds,
        areaName: "当前地图范围",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <div className="task-dock" aria-label="任务状态">
      <div className="task-summary">
        <RadioTower size={17} />
        <span>当前算法</span>
        <strong>{selectedAlgorithm?.name ?? "未选择"}</strong>
      </div>
      <button className="run-button" type="button" onClick={() => createTask.mutate()} disabled={!selectedAlgorithm || createTask.isPending}>
        <Play size={16} />
        {createTask.isPending ? "提交中" : "运行"}
      </button>
      <div className="task-list">
        {tasks.slice(0, 3).map((task) => (
          <div className="task-item" key={task.id}>
            <CircleDot size={14} />
            <span>{task.name}</span>
            <progress value={task.progress} max="100" />
          </div>
        ))}
      </div>
    </div>
  );
}
