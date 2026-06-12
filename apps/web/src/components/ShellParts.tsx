import {
  Bell,
  Box,
  Braces,
  ChevronRight,
  Clock3,
  Cloud,
  Database,
  Edit3,
  Layers,
  MonitorPlay,
  Search,
  UserRound,
} from "lucide-react";
import clsx from "clsx";

export function TopBar() {
  return (
    <header className="topbar">
      <div className="brand" aria-label="遥感处理智慧平台">
        <div className="brand-mark">G</div>
        <div className="brand-text">
          <strong>遥感处理</strong>
          <span>智慧平台</span>
        </div>
      </div>

      <nav className="main-nav" aria-label="主导航">
        <button className="active" type="button">地球计算</button>
        <button type="button">场景案例</button>
      </nav>

      <div className="top-actions">
        
        <button className="top-icon" type="button" aria-label="用户"><UserRound size={18} /></button>
        <span className="counter">0</span>
        <button className="top-icon" type="button" aria-label="历史"><Clock3 size={18} /></button>
        <button className="top-icon" type="button" aria-label="编辑"><Edit3 size={18} /></button>
        <button className="top-icon" type="button" aria-label="大屏"><MonitorPlay size={18} /></button>
        <button className="top-icon" type="button" aria-label="通知"><Bell size={18} /></button>
        <button className="avatar" type="button" aria-label="头像">◎</button>
      </div>
    </header>
  );
}

const railItems = [
  { label: "数据集", icon: Database, active: true },
  { label: "工具", icon: Layers },
  { label: "云端", icon: Cloud },
  { label: "代码", icon: Braces },
];

export function ToolRail() {
  return (
    <aside className="tool-rail" aria-label="工具栏">
      {railItems.map((item) => (
        <button className={clsx("rail-button", item.active && "active")} key={item.label} type="button" title={item.label}>
          <item.icon size={18} />
        </button>
      ))}
    </aside>
  );
}

interface SearchOverlayProps {
  city: string;
}

export function SearchOverlay({ city }: SearchOverlayProps) {
  return (
    <div className="search-overlay">
      <div className="search-input">
        <input placeholder="搜索地名" aria-label="搜索地名" />
        <Search size={16} />
      </div>
      <button type="button">{city}<ChevronRight size={14} /></button>
    </div>
  );
}

export function LoadingPane() {
  return (
    <div className="loading-pane">
      <Box size={28} />
      <span>正在连接地球计算服务...</span>
    </div>
  );
}
