import { ChevronDown, ChevronRight, Database, Image, Link2, MoreHorizontal, UserRoundCog } from "lucide-react";
import clsx from "clsx";
import type { DatasetGroup } from "@geocalc/shared";
import { useWorkbenchStore } from "@/store/workbenchStore";

const icons = {
  cloud: Image,
  public: Link2,
  daily: Database,
  personal: UserRoundCog,
};

export function DatasetPanel({ datasets }: { datasets: DatasetGroup[] }) {
  const activeDatasetIds = useWorkbenchStore((state) => state.activeDatasetIds);
  const toggleDataset = useWorkbenchStore((state) => state.toggleDataset);

  return (
    <aside className="side-panel left-panel" aria-label="数据集">
      <h2>数据集</h2>
      <div className="dataset-stack">
        {datasets.map((dataset) => {
          const Icon = icons[dataset.source];
          const active = activeDatasetIds.includes(dataset.id);
          return (
            <button
              className={clsx("dataset-row", active && "active")}
              key={dataset.id}
              type="button"
              onClick={() => toggleDataset(dataset)}
            >
              <span className={clsx("dataset-icon", dataset.source)}><Icon size={18} /></span>
              <span className="dataset-copy">
                <strong>{dataset.name}</strong>
                <small>{dataset.itemCount ? `${dataset.itemCount} 项资源` : dataset.description}</small>
              </span>
              {dataset.source === "daily" && <span className="more-link">更多</span>}
              {active ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          );
        })}
      </div>
      <div className="panel-empty-note">
        <MoreHorizontal size={18} />
        <span>选择数据集后，图层会进入地图叠加队列。</span>
      </div>
    </aside>
  );
}
