const { tkeel } = require('../../../config/default');

module.exports = {
  publicPath: '/static/console-plugin-admin-tenants/',
  basePath: '/admin-tenants',
  client: {
    documentTitle: '',
  },
  api: {
    basePath: '/apis',
  },
  webSocket: {
    basePath: '/v1/ws',
  },
  plugin: {
    identify: {
      plugin_id: 'console-plugin-admin-tenants',
      entries: [
        {
          id: 'console-plugin-admin-tenants',
          name: '租户管理',
          icon: 'PersonGroupTwoToneIcon',
          path: '/admin-tenants',
          entry: '/static/console-plugin-admin-tenants/',
        },
      ],
      dependence: [{ id: 'rudder', version: tkeel.version }],
    },
  },
};
