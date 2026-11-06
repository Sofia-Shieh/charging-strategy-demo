# 充电业务经营 · 独立封面方案

这是新封面的独立项目，不修改原汇报或原封面。以白、橙、黑为视觉基调，将 Avelon 的连续镜头、画面收拢、模糊显现与分镜切换，转译为充电业务的三幕叙事：**供需连接 → 平台策略 → 经营协同**。

## 使用

需要 Node.js 18 或更新版本，无第三方依赖。

```sh
npm run dev
```

打开 `http://127.0.0.1:4174`。预览服务器仅绑定本机地址，仅提供本项目 `dist/` 内的文件。

支持滚动推进、分镜按钮、自动演示、暂停与重播；“进入汇报”打开既有汇报页面。减少动态效果偏好下提供静态可读状态。

```sh
npm run build
```

生成可独立打开的文件：

- `delivery/充电业务经营-独立封面.html`
- `delivery/cover-avelon.html`

HTML 内嵌样式、脚本及图片，不需要外部字体、框架或媒体请求。

## 文件与素材

`dist/index.html`、`dist/style.css`、`dist/main.js` 构成原生 HTML/CSS/JavaScript 页面。`dist/assets/charging-editorial.png` 是 AI 生成的新能源车充电概念图，用于主题表达，不代表真实场站、车辆品牌或经营成果；内置 imagegen 的生成记录见 `ASSET-NOTES.md`。
