import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { TopBar, ToolRail, LoadingPane } from "@/components/ShellParts";
import { AlgorithmPanel } from "@/features/algorithms/AlgorithmPanel";
import { DatasetPanel } from "@/features/datasets/DatasetPanel";
import { MapCanvas } from "@/features/map/MapCanvas";
import { TaskDock } from "@/features/tasks/TaskDock";
import { api } from "@/services/api";
import { useWorkbenchStore } from "@/store/workbenchStore";
import "./App.css";

function App() {
  const datasetsQuery = useQuery({ queryKey: ["datasets"], queryFn: api.datasets });
  const algorithmsQuery = useQuery({ queryKey: ["algorithms"], queryFn: api.algorithms });
  const tasksQuery = useQuery({ queryKey: ["tasks"], queryFn: api.tasks, refetchInterval: 5000 });

  const bootstrap = useWorkbenchStore((state) => state.bootstrap);
  const mapView = useWorkbenchStore((state) => state.mapView);
  const collapsedLeft = useWorkbenchStore((state) => state.collapsedLeft);
  const collapsedRight = useWorkbenchStore((state) => state.collapsedRight);

  useEffect(() => {
    if (datasetsQuery.data && algorithmsQuery.data) {
      bootstrap(datasetsQuery.data, algorithmsQuery.data.algorithms);
    }
  }, [algorithmsQuery.data, bootstrap, datasetsQuery.data]);

  const isLoading = datasetsQuery.isLoading || algorithmsQuery.isLoading;
  const datasets = datasetsQuery.data ?? [];
  const categories = algorithmsQuery.data?.categories ?? [];
  const algorithms = algorithmsQuery.data?.algorithms ?? [];
  const tasks = tasksQuery.data ?? [];

  return (
    <div className={clsx("app-shell", collapsedLeft && "left-collapsed", collapsedRight && "right-collapsed")}>
      <TopBar />
      <main className="workbench">
        <ToolRail />
        {!collapsedLeft && <DatasetPanel datasets={datasets} />}
        <div className="center-column">
          {isLoading ? <LoadingPane /> : <MapCanvas view={mapView} />}
          <TaskDock tasks={tasks} algorithms={algorithms} />
        </div>
        {!collapsedRight && <AlgorithmPanel categories={categories} algorithms={algorithms} />}
      </main>
      <footer className="legal-line">
        <span>© 2026 遥感处理平台. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default App;
