# @resolid/flex-routes

[English](README.md)

React Router v7 现在使用配置路由, 所以我开发了这个基于文件系统的路由.

## 安装

```
npm install -D @resolid/flex-routes
```

## 配置

编辑 `app/routes.ts` 文件

```ts
// app/routes.ts
import type {RouteConfig} from "@react-router/dev/routes";
import {flexRoutes} from "@resolid/flex-routes";

export default flexRoutes() satisfies RouteConfig;
```

## 规则

- 路由是使用文件夹定义和嵌套的, 与在 nginx 服务器上布局 HTML 文件的方式非常相似
- `_layout` 文件包装了下游的所有路由, 这些需要一个 `<Outlet />` 来渲染子路由
- `_index` 文件是文件夹的默认文件, 例如：`/users/_index.tsx` 将匹配 `/users`
- 变量在文件路径中使用 `$` 表示, 例如: `/users/$id/edit.tsx` 将匹配 `/users/123/edit`
- 将路线段括在括号中将使该段成为可选, 例如: `/($lang)/categories.tsx` 将匹配 `/categories`, `/zh/categories`
- 可以使用 `[]` 对路由约定的特殊字符进行转义, 例如: `/make-[$$$]-fast-online.tsx` 将匹配 `/make-$$$-fast-online`
- 以 `_` 为前缀的文件和文件夹变得不可见, 从而允许在不影响路由路径的情况下进行文件夹组织, 例如:
  `/_legal-pages/privacy-policy.tsx` 将匹配 `/privacy-policy`
- `$.tsx` 泼溅路由将匹配 URL 的其余部分, 包括斜杠, 比如 `/files/$.tsx` 将匹配 `/files`, `/files/one`, `/files/one/two`
