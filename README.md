# Geocalc Workbench

一个可扩展的“地球计算器”GIS 算法工作台原型。项目根据参考截图搭建了三栏工作台、地图视图、数据集管理、算法目录和任务 API 骨架。

## 启动

```bash
npm install
npm run dev
```

- 前端：http://localhost:5173
- 后端：http://localhost:4100

## 项目结构

```text
apps/
  web/   React + Vite 前端工作台
  api/   Express mock API 与任务接口
packages/
  shared/ 前后端共享类型
docs/
  architecture.md 架构说明
```

## 说明

当前地图为自制仿真画布，用来验证布局和工作流，没有复制目标网站的地图瓦片、商标素材或私有资源。后续可通过 `features/map` 接入真实地图引擎。
