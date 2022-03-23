const fs = require('fs-extra');
const shell = require('shelljs');

const logger = require('../utils/logger');
const paths = require('../utils/paths');
const { createJsonFiles, deleteJsonFiles } = require('./json');
const { createNginxConfigFile, deleteNginxConfigFile } = require('./nginx');

function deleteTmpDirectory() {
  const path = paths.resolveRoot('.tmp/');
  fs.removeSync(path);
  logger.success('deleted .tmp/\n');
}

function execCommand(packageInfo) {
  const { directoryName, docker } = packageInfo;
  const { imageName, imageTag } = docker;
  const command = `docker build -t=${imageName}:${imageTag} --build-arg DIRECTORY_NAME=${directoryName} .`;
  logger.info(`${command}\n`);
  shell.exec(command);
  logger.success('docker build success\n');
}

module.exports = function build(packageInfo) {
  deleteTmpDirectory();
  createJsonFiles(packageInfo);
  createNginxConfigFile(packageInfo);
  execCommand(packageInfo);
  deleteJsonFiles();
  deleteNginxConfigFile();
};
