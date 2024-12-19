import { getAppDirectory } from "@react-router/dev/routes";
import { makeRe } from "minimatch";
import { extname, join } from "node:path";
import { filesToRouteManifest, routeManifestToRouteConfig } from "./manifest";
import { visitFiles } from "./utils";

export type FolderRoutesOptions = {
  routesDirectory?: string;
  ignoredRouteFiles?: string[];
};

const routeModuleExtensions = [".js", ".jsx", ".ts", ".tsx", ".md", ".mdx"];

// noinspection JSUnusedGlobalSymbols
export const flexRoutes = async (options: FolderRoutesOptions = {}) => {
  const { routesDirectory = "routes", ignoredRouteFiles = [] } = options;

  const appDirectory = getAppDirectory();
  const ignoredFileRegex = ignoredRouteFiles.map((re) => makeRe(re)).filter((re): re is RegExp => !!re);

  const files: string[] = [];

  await visitFiles(join(appDirectory, routesDirectory), (file) => {
    if (ignoredFileRegex.some((regex) => regex.test(file))) {
      return;
    }

    if (!routeModuleExtensions.includes(extname(file))) {
      return;
    }

    files.push(file);
  });

  const routeManifest = filesToRouteManifest(routesDirectory, files);

  return routeManifestToRouteConfig(routeManifest);
};
