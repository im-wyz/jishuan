import { ChevronDown, ChevronRight, Cpu, LoaderCircle, Shapes, Sparkles, Target, Workflow } from "lucide-react";
import clsx from "clsx";
import type { AlgorithmCategory, AlgorithmDefinition } from "@geocalc/shared";
import { useWorkbenchStore } from "@/store/workbenchStore";

const categoryIcons = {
  interpretation: Target,
  thematic: Shapes,
  generation: Sparkles,
  basic: Workflow,
  partner: Cpu,
};

export function AlgorithmPanel({
  categories,
  algorithms,
}: {
  categories: AlgorithmCategory[];
  algorithms: AlgorithmDefinition[];
}) {
  const selectedAlgorithmId = useWorkbenchStore((state) => state.selectedAlgorithmId);
  const selectAlgorithm = useWorkbenchStore((state) => state.selectAlgorithm);

  return (
    <aside className="side-panel right-panel" aria-label="算法集">
      <h2>算法集</h2>
      {categories.map((category) => {
        const Icon = categoryIcons[category.id];
        const categoryAlgorithms = algorithms.filter((item) => item.categoryId === category.id);
        return (
          <section className={clsx("algorithm-section", category.expanded && "expanded")} key={category.id}>
            <button className="section-head" type="button">
              <span className="section-icon"><Icon size={18} /></span>
              <strong>{category.name}</strong>
              <em>（可用 {category.available} / {category.total}）</em>
              {category.expanded ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
            </button>
            {category.expanded && (
              <div className="algorithm-grid">
                {categoryAlgorithms.map((algorithm) => (
                  <button
                    className={clsx("algorithm-card", selectedAlgorithmId === algorithm.id && "selected", algorithm.status)}
                    key={algorithm.id}
                    type="button"
                    onClick={() => selectAlgorithm(algorithm.id)}
                    title={algorithm.description}
                  >
                    {algorithm.status === "loading" && <LoaderCircle size={15} className="spin" />}
                    <span>{algorithm.name}</span>
                    {algorithm.status === "new" && <b>NEW</b>}
                    {algorithm.status === "updated" && <b className="update">UPDATE</b>}
                  </button>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </aside>
  );
}
