Package.describe({
  name: 'fongandrew:user-settings',
  version: '0.1.0',
  summary: 'Templates for basic account setting stuff',
  git: 'https://github.com/fongandrew/meteor-user-settings.git'
});

Package.onUse(function(api) {
  'use strict';
  api.versionsFrom('METEOR@1.1.0.2');
  api.use('fongandrew:spacebars-helpers@0.1.0');
  api.use('fongandrew:save-button@0.1.0');
  api.use('fongandrew:instance-vars@0.2.0');
  api.use('accounts-password');
  api.use('templating', 'client');
  api.use('underscore');
  api.addFiles([
    '_config.js'
  ], ['client', 'server']);
  api.addFiles([
    'account_settings.html',
    'account_settings.js'
  ], 'client');
  api.addFiles([
    'account_server.js'
  ], 'server');
});
