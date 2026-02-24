// Learn more: https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages and in what order
//    NOTE: disableHierarchicalLookup is intentionally omitted — it breaks resolution
//    of sub-dependencies inside pnpm virtual store (e.g. @expo/metro-runtime from expo-router)
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Force axios to use the browser build.
//    axios 1.13.x has an `exports` field; pnpm virtual store causes Metro to
//    pick up dist/node/axios.cjs (which imports Node.js `crypto`) instead of
//    the RN-compatible dist/browser/axios.cjs.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'axios') {
    return {
      filePath: require.resolve('axios/dist/browser/axios.cjs'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

// 4. Use a persistent cache in the workspace root to speed up rebuilds
config.cacheStores = [
  new FileStore({ root: path.join(workspaceRoot, '.metro-cache') }),
];

module.exports = config;
