# @resolid/flex-routes

[简体中文](README.zh_CN.md)

React Router v7 uses a new routing config, so I developed a routing system that mixes directories and files.

## Install

```
npm install -D @resolid/flex-routes
```

## Configuration

Edit `app/routes.ts` file

```ts
// app/routes.ts
import type { RouteConfig } from "@react-router/dev/routes";
import { flexRoutes } from "@resolid/flex-routes";

export default flexRoutes() satisfies RouteConfig;
```

## Router Rules

- Routes are defined and nested using folders, very similar to how HTML files are laid out on the nginx server
- The `_layout` file wraps all downstream routes, which require an `<Outlet />` to render sub-routes
- The `_index` file is the default file for the folder, for example: `/users/_index.tsx` will match `/users`
- Variables are represented by `$` in the file path, for example: `/users/$id/edit.tsx` will match `/users/123/edit`
- Enclosing a route segment in parentheses will make the segment optional, for example: `/($lang)/categories.tsx` will
  match `/categories`, `/zh/categories`
- You can use `[]` to escape special characters in routing conventions, for example: `/make-[$$$]-fast-online.tsx` will
  match `/make-$$$-fast-online`
- Files and folders prefixed with `_` become invisible, allowing folder organization without affecting routing paths,
  for example: `/_legal-pages/privacy-policy.tsx` will match `/ privacy-policy`
- `$.tsx` splash route will match the rest of the URL, including slashes, e.g. `/files/$.tsx` will match `/files`,
  `/files/one`, `/files/one/two`
