# 充电运营策略 · 经验分享

[打开演示页面](https://sofia-shieh.github.io/charging-strategy-demo/#00)

**让增长，成为运营的结果。** 从城市策略，到可复用的运营方法。

王榕榕（rowan）的滴滴充电运营经验分享。17 页交互式 HTML，页面编号 00–16，约 23 分钟主讲。内容覆盖供需份额、城市阶段、分层定价、健康度、用户与商户生命周期、营销、工具及中台与城市协同。

本仓库统一维护源码与演示发布。演示网址保持不变；`dist/` 是主汇报的唯一编辑入口，GitHub Actions 根据最新源码生成并发布网站。

## 本地开发与检查

需要 Node.js 22 或更新版本，无第三方依赖，无需运行 `npm install`。

```sh
npm run dev
```

在 [本地预览](http://127.0.0.1:4173/#00) 查看，修改 `dist/` 文件后刷新即可。

```sh
npm run check
npm run build
```

- `check` 验证所有入口依赖、JavaScript 语法及案例图片。
- `build` 先检查源码，再生成 `delivery/充电业务经营汇报.html` 和用于 Pages 发布的 `_site/`。
- 离线文件内嵌 CSS、JavaScript 和三张案例原图，可直接在浏览器打开。
- `_site/` 与 `delivery/` 是生成目录，不提交 Git。根目录 `index.html` 是迁移时保留的演示快照，**不要手动编辑它**；线上页面以 Actions 生成的 `_site/index.html` 为准。

## 源码结构

```text
dist/
  index.html                   主汇报入口
  app.js                       页面内容、路由、目录与交互
  notes.js                     逐页讲稿
  hero-tech*                   首页数字能源场景与动画
  presenter-profile*           自我介绍
  opening-transition*          跨页图形衔接
  slide-*                      内容页模块与对应样式
  assets/                      三张用户提供的案例原图
independent-covers/avelon/      独立封面的源码与素材，保留作单独方案
bundle.mjs                     将主汇报打包成离线 HTML
verify.mjs                     源码检查
build-site.mjs                 生成 Pages 发布目录
serve.mjs                      本地预览服务器
.github/workflows/pages.yml    检查与自动发布
docs/MIGRATION.md              仓库合并说明
docs/ASSETS.md                 素材说明
```

独立封面在自己的目录中运行 `npm run dev`（端口 4174）或 `npm run build`。根目录 `cover-avelon.html` 保留原发布版本，主汇报构建不会替换它。

## 演示操作

- 常规主讲顺序为 **00 首页 → 02 正文 → … → 16 总结**。
- **01 自我介绍只从首页姓名模块进入**，可返回 00 或继续 02。
- 左右方向键、PageUp / PageDown、空格：翻页；手机可左右滑动。
- G：页面目录；N：讲稿；F：全屏；H：帮助；Esc：关闭面板。
- 顶部“首页动画”返回并重播开场；各内容页保留暂停、重播及可点击的讲解节点。
- 案例表可切换场站、人群与时段，也可展开原图对照、缩放及滚动。
- 帮助菜单支持打印／保存为 PDF。

## GitHub 协作与自动发布

1. 协作者在本仓库创建分支，修改 `dist/` 中的内容、样式或交互。
2. 本地运行 `npm run check` 和 `npm run build`，检查预览后提交 Pull Request。
3. Pull Request 自动执行构建检查；合并到 `main` 后，GitHub Actions 自动发布到现有演示地址。
4. 在 Actions 页面查看发布结果；只有成功构建的版本才会进入部署步骤。

不需要把文件再同步到另一仓库，也不需要手工上传生成的 HTML。仓库管理员通过 Settings → Collaborators 管理代码协作权限；演示访客无需成为协作者。

## 内容口径

04 页以 60,000 枪、供给份额 58%，以及 160,000 × 24 = 3,840,000 度、需求份额 7/16 = 43.75% 展示计算；反推的全城分母标注为近似值。用户分层比例表示用户人数范围，不解释为收入或利润贡献。价格、比例、趋势及工具界面按各页标注区分历史案例、经验范围和示意，不代表实时监测结果。重绘案例表保留原图对照，实验结果不作为分享者个人业绩。
