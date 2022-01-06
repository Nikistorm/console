const fs = require('fs-extra');
const _ = require('lodash');
const dotenvFlow = require('dotenv-flow');
const dotenvExpand = require('dotenv-expand');
const { isPort } = require('validator');
const readPkg = require('read-pkg');

const {
  PACKAGE_DIRECTORY_NAME_PREFIX,
  PLUGIN_PACKAGE_DIRECTORY_NAME_PREFIX,
  PORTAL_PACKAGE_SIMPLE_NAME,
  SHARED_PACKAGE_SIMPLE_NAMES,
  EXCLUDE_PACKAGE_NAMES,
} = require('../constants');
const paths = require('./paths');

function getSimpleName({ directoryName }) {
  return directoryName.replace(PACKAGE_DIRECTORY_NAME_PREFIX, '');
}

function getPluginName({ directoryName }) {
  return directoryName.replace(PLUGIN_PACKAGE_DIRECTORY_NAME_PREFIX, '');
}

function getPluginPackageDirectoryName({ pluginName }) {
  return `${PLUGIN_PACKAGE_DIRECTORY_NAME_PREFIX}${pluginName}`;
}

function getDirectoryNames({ portalFirst } = {}) {
  const directoryNames = fs
    .readdirSync(paths.packages.self)
    .filter((directoryName) => !EXCLUDE_PACKAGE_NAMES.includes(directoryName));

  if (portalFirst) {
    return directoryNames.sort((directoryName) =>
      directoryName ===
      `${PACKAGE_DIRECTORY_NAME_PREFIX}${PORTAL_PACKAGE_SIMPLE_NAME}`
        ? -1
        : 1
    );
  }

  return directoryNames;
}

function getPackages({
  portalFirst = true,
  directoryNames = getDirectoryNames({ portalFirst }),
} = {}) {
  const packages = [];

  directoryNames.forEach((directoryName) => {
    const absolutePath = paths.resolvePackages(directoryName);
    const stat = fs.statSync(absolutePath);
    const isDirectory = stat.isDirectory();

    if (!isDirectory) {
      return;
    }

    const isPlugin = directoryName.startsWith(
      PLUGIN_PACKAGE_DIRECTORY_NAME_PREFIX
    );
    const simpleName = getSimpleName({ directoryName });
    const pluginName = isPlugin ? getPluginName({ directoryName }) : '';
    const canRun = !SHARED_PACKAGE_SIMPLE_NAMES.includes(simpleName);

    const packageJson = readPkg.sync({ cwd: absolutePath });

    const dotenvFiles = dotenvFlow
      .listDotenvFiles(absolutePath, {
        node_env: 'development',
      })
      .filter((path) => fs.existsSync(path));
    const dotenvConfig = dotenvExpand(dotenvFlow.parse(dotenvFiles));

    packages.push({
      directoryName,
      absolutePath,
      isPlugin,
      canRun,
      simpleName,
      pluginName,
      packageJson,
      dotenvConfig,
    });
  });

  return packages;
}

function getCanRunPackageDirectoryNames() {
  return getPackages()
    .filter(({ canRun }) => canRun)
    .map(({ directoryName }) => directoryName);
}

function getPluginPackageDotenvConfigs() {
  return getPackages()
    .filter(({ isPlugin }) => isPlugin)
    .map(({ dotenvConfig }) => dotenvConfig);
}

function checkPluginName({ pluginName }) {
  const directoryNames = getPackages()
    .filter(({ isPlugin }) => isPlugin)
    .map(({ directoryName }) => directoryName);
  const directoryName = getPluginPackageDirectoryName({ pluginName });
  const flag = !directoryNames.includes(directoryName);
  let message = '';

  if (!flag) {
    message = 'Error: Duplicate Name';
  }

  return { flag, message };
}

function checkPluginBasePath({ basePath }) {
  const pluginPackageDotenvConfigs = getPluginPackageDotenvConfigs();
  // eslint-disable-next-line unicorn/prefer-array-some
  const flag = !_.find(pluginPackageDotenvConfigs, { BASE_PATH: basePath });
  let message = '';

  if (!flag) {
    message = 'Error: Duplicate BASE_PATH';
  }

  return { flag, message };
}

function checkPluginDevServerPort({ devServerPort }) {
  const pluginPackageDotenvConfigs = getPluginPackageDotenvConfigs();
  const value = _.find(pluginPackageDotenvConfigs, {
    DEV_SERVER_PORT: String(devServerPort),
  });

  let flag = true;
  let message = '';

  if (value) {
    flag = false;
    message = 'Error: Duplicate BASE_PATH';
  }

  if (devServerPort && !isPort(String(devServerPort))) {
    flag = false;
    message = 'Error: Unavailable Port';
  }

  return { flag, message };
}

module.exports = {
  getPluginPackageDirectoryName,
  getPackages,
  getCanRunPackageDirectoryNames,
  checkPluginName,
  checkPluginBasePath,
  checkPluginDevServerPort,
};
