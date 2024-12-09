import { extname, join } from "node:path";
import type { RouteConfigEntry } from "@react-router/dev/routes";
import { PrefixLookupTrie, createRoutePath, getRouteSegments, normalizeSlashes } from "./utils";

export type RouteManifestEntry = {
  path?: string;
  index?: boolean;
  caseSensitive?: boolean;
  id: string;
  parentId?: string;
  file: string;
};

export type RouteManifest = {
  [routeId: string]: RouteManifestEntry;
};

export const routeManifestToRouteConfig = (routeManifest: RouteManifest, rootId = "root"): RouteConfigEntry[] => {
  const routeConfigById: {
    [id: string]: Omit<RouteConfigEntry, "id"> & Required<Pick<RouteConfigEntry, "id">>;
  } = {};

  for (const id in routeManifest) {
    const route = routeManifest[id];
    routeConfigById[id] = {
      id: route.id,
      file: route.file,
      path: route.path,
      index: route.index,
      caseSensitive: route.caseSensitive,
    };
  }

  const routeConfig: RouteConfigEntry[] = [];

  for (const id in routeConfigById) {
    const route = routeConfigById[id];
    const parentId = routeManifest[route.id].parentId;
    if (parentId === rootId) {
      routeConfig.push(route);
    } else {
      const parentRoute = parentId && routeConfigById[parentId];
      if (parentRoute) {
        parentRoute.children = parentRoute.children || [];
        parentRoute.children.push(route);
      }
    }
  }

  return routeConfig;
};

export const filesToRouteManifest = (routesDirectory: string, files: string[]) => {
  const routeManifest: RouteManifest = {};
  const routeIds = new Map<string, string>();
  const routeIdConflicts = new Map<string, string[]>();

  for (const file of files) {
    const normalizedFile = normalizeSlashes(join(routesDirectory, file));
    const normalizedFileName = normalizedFile.slice(0, -extname(normalizedFile).length);
    const routeId =
      normalizedFileName.slice(-7) == "_layout"
        ? normalizedFileName.slice(0, -"_layout".length - 1)
        : normalizedFileName;

    const conflict = routeIds.get(routeId);

    if (conflict) {
      const currentConflicts = routeIdConflicts.get(routeId) ?? [conflict];
      currentConflicts.push(normalizedFile);
      routeIdConflicts.set(routeId, currentConflicts);
      continue;
    }

    routeIds.set(routeId, normalizedFile);
  }

  const prefixLookup = new PrefixLookupTrie();
  const sortedRouteIds = Array.from(routeIds).sort(([a], [b]) => b.length - a.length);

  for (const [routeId, file] of sortedRouteIds) {
    const [segments, raw] = getRouteSegments(routeId.slice(routesDirectory.length + 1));
    const index = routeId.slice(-6) == "_index";
    const pathname = createRoutePath(segments, raw, index);

    routeManifest[routeId] = {
      file: file,
      id: routeId,
      path: pathname,
    };

    if (index) {
      routeManifest[routeId].index = true;
    }

    const childRouteIds = prefixLookup.findAndRemove(routeId, (value) => {
      return [".", "/"].includes(value.slice(routeId.length).charAt(0));
    });
    prefixLookup.add(routeId);

    if (childRouteIds.length > 0) {
      for (const childRouteId of childRouteIds) {
        routeManifest[childRouteId].parentId = routeId;
      }
    }
  }

  const parentChildrenMap = new Map<string, RouteManifestEntry[]>();

  for (const [routeId] of sortedRouteIds) {
    const config = routeManifest[routeId];

    if (!config.parentId) {
      continue;
    }

    const existingChildren = parentChildrenMap.get(config.parentId) || [];
    existingChildren.push(config);
    parentChildrenMap.set(config.parentId, existingChildren);
  }

  const uniqueRoutes = new Map<string, RouteManifestEntry>();
  const urlConflicts = new Map<string, RouteManifestEntry[]>();

  for (const [routeId] of sortedRouteIds) {
    const config = routeManifest[routeId];
    const originalPathname = config.path || "";
    const parentConfig = config.parentId ? routeManifest[config.parentId] : null;
    let pathname = config.path;

    if (parentConfig?.path && pathname) {
      pathname = pathname.slice(parentConfig.path.length).replace(/^\//, "").replace(/\/$/, "");
    }

    if (!config.parentId) {
      config.parentId = "root";
    }

    config.path = pathname || undefined;

    const lastRouteSegment = config.id
      .replace(new RegExp(`^${routesDirectory}/`), "")
      .split(/[./]/)
      .pop();

    if (lastRouteSegment && lastRouteSegment[0] == "_" && lastRouteSegment !== "_index") {
      continue;
    }

    const conflictRouteId = originalPathname + (config.index ? "?index" : "");
    const conflict = uniqueRoutes.get(conflictRouteId);

    uniqueRoutes.set(conflictRouteId, config);

    if (conflict && (originalPathname || config.index)) {
      let currentConflicts = urlConflicts.get(originalPathname);
      if (!currentConflicts) {
        currentConflicts = [conflict];
      }
      currentConflicts.push(config);
      urlConflicts.set(originalPathname, currentConflicts);
    }
  }

  if (routeIdConflicts.size > 0) {
    for (const [routeId, files] of routeIdConflicts.entries()) {
      const [taken, ...others] = files;

      const othersRoute = others.map((route) => `⭕ ${route}`).join("\n");

      console.error(
        `!Route ID 冲突: "${routeId}"\n\n下列路由都定义了相同的路由 ID，但只有第一个会生效\n\n🟢 ${taken}\n${othersRoute}\n`,
      );
    }
  }

  if (urlConflicts.size > 0) {
    for (const [path, routes] of urlConflicts.entries()) {
      for (let i = 1; i < routes.length; i++) {
        delete routeManifest[routes[i].id];
      }

      const [taken, ...others] = routes.map((r) => r.file);

      const pathLocal = path[0] == "/" ? path : `/${path}`;
      const othersRoute = others.map((route) => `⭕ ${route}`).join("\n");

      console.error(
        `! Route 路径冲突: "${pathLocal}"\n\n下列路由都定义了相同的 URL，但只有第一个会生效\n\n🟢 ${taken}\n${othersRoute}\n`,
      );
    }
  }

  return routeManifest;
};
