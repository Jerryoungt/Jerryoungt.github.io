# Jerryoungt

一个无需构建、可直接部署到 GitHub Pages 的个人博客。

## 本地预览

只需要 Node.js：

```powershell
node scripts/serve.mjs
```

然后打开 <http://127.0.0.1:4173>。

## 发布到 GitHub Pages

这个仓库按 GitHub 用户站点设计，默认地址是 <https://jerryoungt.github.io>。

1. 在 GitHub 创建公开仓库 `Jerryoungt.github.io`。
2. 完成首次提交、切换到 `main`，再关联远端并推送：

   ```powershell
   git add .
   git commit -m "Create Jerryoungt blog"
   git branch -M main
   git remote add origin https://github.com/Jerryoungt/Jerryoungt.github.io.git
   git push -u origin main
   ```

3. 打开仓库的 **Settings → Pages**，把 **Build and deployment → Source** 设为 **GitHub Actions**。
4. 推送后，工作流 [pages.yml](.github/workflows/pages.yml) 会自动发布站点。

如果 GitHub 用户名不是 `Jerryoungt`，需要同步修改仓库名、页面里的 GitHub 地址，以及 `sitemap.xml`、`feed.xml` 和页面 `<link rel="canonical">` 中的域名。

## 内容修改

- 首页：`index.html`
- 关于页：`about.html`
- 文章归档：`blog/index.html`
- 文章正文：`blog/2026/*.html`
- 全站样式：`assets/styles.css`
- 交互脚本：`assets/main.js`
- RSS：`feed.xml`
- 站点地图：`sitemap.xml`

页脚中的城市、GitHub 链接，以及「关于」页里的个人介绍目前是可编辑的初始文案。发布前请替换成真实信息。

新增文章时，复制一篇现有文章作为模板，更新标题、摘要、日期、正文和文章导航，再把链接加入首页、`blog/index.html`、`feed.xml` 与 `sitemap.xml`。
