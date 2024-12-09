import type { RouteConfigEntry } from "@react-router/dev/routes";
import { describe, expect, it } from "vitest";
import { filesToRouteManifest, routeManifestToRouteConfig } from "../src/manifest";

describe("flexRoutes", () => {
  it("test flex routes", () => {
    const files: string[] = [
      "_site/_layout.ts",
      "_site/_home/$.ts",
      "_site/_home/_index.ts",
      "_site/_home/login.ts",
      "_site/_home/about-us.ts",
      "_site/_user/_layout.ts",
      "_site/_user/settings.ts",
      "_site/_user/user.$name.ts",
      "_site/ui/_layout.ts",
      "_site/ui/$.ts",
      "_site/ui/_mdx/_index.mdx",
      "_site/ui/_mdx/getting-start.mdx",
      "_site/ui/_mdx/components/button.mdx",
      "admin/_layout.ts",
      "admin/$.ts",
      "admin/_index.ts",
      "admin/user/_layout.ts",
      "admin/user/$.ts",
      "admin/user/$id.ts",
      "admin/user/_index.ts",
      "admin/user/new.ts",
    ];

    const routeConfigEntries: RouteConfigEntry[] = [
      {
        id: "routes/_site",
        file: "routes/_site/_layout.ts",
        path: undefined,
        index: undefined,
        caseSensitive: undefined,
        children: [
          {
            caseSensitive: undefined,
            file: "routes/_site/_home/about-us.ts",
            id: "routes/_site/_home/about-us",
            index: undefined,
            path: "about-us",
          },
          {
            caseSensitive: undefined,
            file: "routes/_site/_home/_index.ts",
            id: "routes/_site/_home/_index",
            index: true,
            path: undefined,
          },
          {
            caseSensitive: undefined,
            file: "routes/_site/_home/login.ts",
            id: "routes/_site/_home/login",
            index: undefined,
            path: "login",
          },
          {
            caseSensitive: undefined,
            file: "routes/_site/_home/$.ts",
            id: "routes/_site/_home/$",
            index: undefined,
            path: "*",
          },
          {
            caseSensitive: undefined,
            file: "routes/_site/_user/_layout.ts",
            id: "routes/_site/_user",
            index: undefined,
            path: undefined,
            children: [
              {
                caseSensitive: undefined,
                file: "routes/_site/_user/user.$name.ts",
                id: "routes/_site/_user/user.$name",
                index: undefined,
                path: "user/:name",
              },
              {
                caseSensitive: undefined,
                file: "routes/_site/_user/settings.ts",
                id: "routes/_site/_user/settings",
                index: undefined,
                path: "settings",
              },
            ],
          },
          {
            caseSensitive: undefined,
            file: "routes/_site/ui/_layout.ts",
            id: "routes/_site/ui",
            index: undefined,
            path: "ui",
            children: [
              {
                caseSensitive: undefined,
                file: "routes/_site/ui/_mdx/components/button.mdx",
                id: "routes/_site/ui/_mdx/components/button",
                index: undefined,
                path: "components/button",
              },
              {
                caseSensitive: undefined,
                file: "routes/_site/ui/_mdx/getting-start.mdx",
                id: "routes/_site/ui/_mdx/getting-start",
                index: undefined,
                path: "getting-start",
              },
              {
                caseSensitive: undefined,
                file: "routes/_site/ui/_mdx/_index.mdx",
                id: "routes/_site/ui/_mdx/_index",
                index: true,
                path: undefined,
              },
              {
                caseSensitive: undefined,
                file: "routes/_site/ui/$.ts",
                id: "routes/_site/ui/$",
                index: undefined,
                path: "*",
              },
            ],
          },
        ],
      },
      {
        id: "routes/admin",
        file: "routes/admin/_layout.ts",
        path: "admin",
        index: undefined,
        caseSensitive: undefined,
        children: [
          {
            caseSensitive: undefined,
            file: "routes/admin/_index.ts",
            id: "routes/admin/_index",
            index: true,
            path: undefined,
          },
          {
            caseSensitive: undefined,
            file: "routes/admin/user/_layout.ts",
            id: "routes/admin/user",
            index: undefined,
            path: "user",
            children: [
              {
                caseSensitive: undefined,
                file: "routes/admin/user/_index.ts",
                id: "routes/admin/user/_index",
                index: true,
                path: undefined,
              },
              {
                caseSensitive: undefined,
                file: "routes/admin/user/$id.ts",
                id: "routes/admin/user/$id",
                index: undefined,
                path: ":id",
              },
              {
                caseSensitive: undefined,
                file: "routes/admin/user/new.ts",
                id: "routes/admin/user/new",
                index: undefined,
                path: "new",
              },
              {
                caseSensitive: undefined,
                file: "routes/admin/user/$.ts",
                id: "routes/admin/user/$",
                index: undefined,
                path: "*",
              },
            ],
          },
          {
            caseSensitive: undefined,
            file: "routes/admin/$.ts",
            id: "routes/admin/$",
            index: undefined,
            path: "*",
          },
        ],
      },
    ];

    const resultConfigEntries = routeManifestToRouteConfig(filesToRouteManifest("routes", files));

    expect(resultConfigEntries).toEqual(routeConfigEntries);
  });
});
