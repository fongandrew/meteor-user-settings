Package.describe({
  name: 'fongandrew:user-settings',
  version: '0.1.0',
  summary: 'Views for basic account setting stuff'
});

Package.onUse(function(api) {
  'use strict';
  api.versionsFrom('METEOR@1.1.0.2');
  api.use('fongandrew:spacebars-helpers');
  api.use('fongandrew:save-button');
  api.use('fongandrew:instance-vars');
  api.use('fongandrew:re-common');
  api.use('templating', 'client');
  api.use('underscore');
  api.export('LoginComponents');
  api.addFiles([
    'account_settings.html',
    'account_settings.js'
  ], 'client');
});
