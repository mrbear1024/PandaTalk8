---
title: 我给博客写了一个 CLI
---

# 我给博客写了一个 CLI

PandaTalk 后台我自己一直用得不顺手——浏览器里粘 Markdown、补封面、点保存，三步操作做一篇文章已经算流畅；
要批量导入十几篇旧稿就完全是体力活了。今天花了一个下午把发文这件事搬到了命令行。

## 它能做什么

- `publish <file.md>`：把单篇本地 markdown 推到线上
- `publish-batch <dir>`：扫一个目录里的所有 `.md` 一次发完
- `edit <slug> <file.md>`：覆盖一篇已有的文章
- `delete <slug>`：删
- `--dry`：所有写操作都可以先空跑一遍，看看会插什么

## 设计上的几个取舍

不依赖 Next.js dev server，CLI 直接打 Supabase REST + R2 + DeepSeek。
封面写本地路径就上传到 R2、写 URL 就直接用；slug 和 tag 没填的话，
DeepSeek 会读完标题和正文后给一个简短的中文 keyword slug。

```bash
node scripts/blog.mjs publish drafts/post.md
```

## 一个反直觉的决定

CLI 里的 `.env.local` 是**覆盖** shell 环境变量的——和 Next.js 默认相反。
原因很简单：之前调过一次 bug，shell 里残留了一个旧的 `DEEPSEEK_API_KEY`，
和 `.env.local` 里的新 key 冲突，结果在终端里改完文件还死活不生效。
对一个本地命令行工具来说，"项目文件说了算"比"shell 说了算"靠谱得多。

## 顺带一个 skill

写完 CLI 顺手做了个 Claude Code skill，放在 `.claude/skills/pt-blog/` 下。
以后想发文章直接 `/pt-blog` 就能让 agent 走完整个流程，连确认提示都帮我写好了。
