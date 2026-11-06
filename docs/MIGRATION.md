# 仓库合并说明

2026 年 11 月 6 日，将充电运营汇报的维护源码统一迁入 `Sofia-Shieh/charging-strategy-demo`。

## 合并内容

- 主汇报采用本地最新版本的入口、18 个 JavaScript 模块、19 个 CSS 文件与三张案例原图。
- 保留独立封面 `independent-covers/avelon/` 的源码、素材及使用说明。
- 保留公开仓库原有根目录 `index.html`、`cover-avelon.html` 与 `.nojekyll`。
- 新增本地检查、站点构建和 GitHub Actions 自动发布。

主汇报之后统一编辑 `dist/`。Actions 从源码生成 `_site/`，并发布到原有地址：

[https://sofia-shieh.github.io/charging-strategy-demo/](https://sofia-shieh.github.io/charging-strategy-demo/)

根目录 `index.html` 是合并时的已发布快照，不是日后手工维护的另一份源码。独立封面原发布文件继续保留，未替换主汇报封面。

## 历史与归档

本次迁移是将可维护文件集中到公开仓库，**没有将旧私有仓库的 Git 提交历史合并进来**。公开仓库保留自身原有历史；旧私有仓库 `Sofia-Shieh/charging-strategy-deck` 在迁移和发布确认完成后归档，以只读形式保留原文件及历史。

临时目录、工具运行记录、生成文件、检查截图和未启用的旧版设计不作为当前源码迁移。旧版记录仍保留在原仓库和本地项目中。

## 后续协作

协作者只需访问本仓库。分支或 Pull Request 用于共同修改；`main` 是发布分支。合并后的自动构建与部署取代原先在两个仓库间手工同步文件的流程。
