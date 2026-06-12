# 地球计算器仿真工作台架构

这个项目不是单页静态仿图，而是按 GIS 算法平台的产品结构搭建的可扩展原型。

## 截图功能拆解

- 顶部导航：品牌区、地球计算/场景案例、会员入口、用户、历史、编辑、大屏、通知。
- 左侧数据集：平台数据云、公开数据集、今日影像、个人影像资源，承担图层来源管理。
- 中央地图：卫星底图、地名搜索、城市切换、地物标签、地图工具、缩放、3D、图层、底图切换、比例尺。
- 右侧算法集：智能解译、专题算法、智能生成、基础算法、第三方模型，承担算法选择与权限展示。
- 任务流：选择算法和数据集后发起任务，后续应展示进度、结果图层、报告与导出。

## 技术栈

- `apps/web`：React + TypeScript + Vite。适合构建复杂工作台，组件化拆分清晰。
- `zustand`：管理地图视图、当前算法、启用数据集、面板折叠等客户端状态。
- `@tanstack/react-query`：管理数据集、算法列表、任务列表等服务端状态。
- `lucide-react`：统一工具图标。
- `apps/api`：Express + TypeScript。提供数据集、算法目录、任务创建与任务查询接口。
- `packages/shared`：共享业务类型，避免前后端接口漂移。

## 地图引擎预留

当前 `features/map/MapCanvas.tsx` 使用 CSS 仿真卫星地图，目的是先完成交互框架。后续可新增地图适配器：

- `MapLibreAdapter`：接入 Mapbox Style、矢量瓦片和栅格瓦片。
- `CesiumAdapter`：接入 3D Globe、地形、倾斜摄影和三维量测。
- `TileProviderAdapter`：封装天地图、高德、自有影像服务等瓦片源。

建议接口保持：

```ts
interface MapEngineAdapter {
  mount(container: HTMLElement): void;
  setView(center: [number, number], zoom: number): void;
  addRasterLayer(layer: RasterLayer): void;
  addVectorLayer(layer: VectorLayer): void;
  drawAOI(): Promise<GeoJSON.Polygon>;
  destroy(): void;
}
```

## 后续路线

1. 接真实地图引擎：优先 MapLibre GL，若必须全三维再接 Cesium。
2. 补 AOI 绘制：矩形、多边形、行政区选择、当前屏幕范围。
3. 任务系统升级：Express mock 替换为队列服务，推荐 BullMQ/Redis 或 Python FastAPI 算法服务。
4. 结果图层：任务完成后加载 GeoJSON/MBTiles/COG，并支持透明度、显隐、导出。
5. 权限体系：算法可用次数、会员权限、个人资源权限与审计日志。
