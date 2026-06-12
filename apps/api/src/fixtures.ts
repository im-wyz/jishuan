import type {
  AlgorithmCategory,
  AlgorithmDefinition,
  AlgorithmTask,
  DatasetGroup,
} from "@geocalc/shared";

export const datasetGroups: DatasetGroup[] = [
  {
    id: "geovis-cloud-2025",
    name: "地图数据云",
    source: "cloud",
    description: "平台默认影像、道路、地名与基础地理底图。",
    enabled: true,
    itemCount: 1,
  },
  {
    id: "public-datasets",
    name: "公开数据集",
    source: "public",
    description: "行政区、土地覆盖、DEM 等开放数据。",
    enabled: true,
    itemCount: 12,
  },
  {
    id: "daily-images",
    name: "今日影像",
    source: "daily",
    description: "近期更新的高分辨率影像资源。",
    enabled: true,
    itemCount: 8,
  },
  {
    id: "personal-assets",
    name: "个人影像资源",
    source: "personal",
    description: "用户上传或收藏的私有影像。",
    enabled: false,
    itemCount: 0,
  },
];

export const algorithmCategories: AlgorithmCategory[] = [
  { id: "interpretation", name: "智能解译", available: 25, total: 25, expanded: true },
  { id: "thematic", name: "专题算法", available: 7, total: 18, expanded: false },
  { id: "generation", name: "智能生成", available: 4, total: 4, expanded: false },
  { id: "basic", name: "基础算法", available: 9, total: 14, expanded: false },
  { id: "partner", name: "商汤模型", available: 3, total: 3, expanded: false },
];

export const algorithms: AlgorithmDefinition[] = [
  ["foundation-extract", "地物提取大模型", "new"],
  ["building-height", "建筑物高度估计", "stable"],
  ["building", "建筑物提取", "stable"],
  ["water", "水体提取", "stable"],
  ["solar", "光伏提取", "stable"],
  ["parcel", "地块提取", "stable"],
  ["road", "道路提取", "updated"],
  ["greenhouse", "大棚提取", "updated"],
  ["forest-land", "林地提取", "stable"],
  ["woods", "森林提取", "loading"],
  ["building-change", "建筑物变化检测", "stable"],
  ["bridge", "桥梁检测", "updated"],
  ["aircraft", "飞机检测", "stable"],
  ["ship", "船只检测", "stable"],
  ["oil-tank", "油罐检测", "stable"],
  ["wind-turbine", "风机检测", "stable"],
  ["block-new", "地块提取", "new"],
  ["road-change", "道路变化检测", "new"],
  ["machine", "施工器械检测", "new"],
  ["road-network", "路网提取", "new"],
  ["farmland", "耕地提取", "new"],
  ["construction-site", "施工场地提取", "new"],
  ["dust-net", "防尘网提取", "new"],
  ["forest-change", "林地变化检测", "new"],
  ["water-change", "水体变化检测", "new"],
].map(([id, name, status]) => ({
  id,
  categoryId: "interpretation",
  name,
  status,
  description: `${name}算法，可基于选定范围生成矢量或栅格结果。`,
  inputTypes: ["satellite-image", "aoi"],
  outputTypes: ["vector-layer", "report"],
})) as AlgorithmDefinition[];

export const tasks: AlgorithmTask[] = [
  {
    id: "task-demo-001",
    algorithmId: "foundation-extract",
    name: "上海样区地物解译",
    status: "running",
    progress: 64,
    areaName: "上海市中心城区",
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
];
