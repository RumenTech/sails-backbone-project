/**
 * Global adapter config
 * 
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which 
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */

var mc = (require('../config/mainConfig.js')());

module.exports.adapters = {

  // If you leave the adapter config unspecified 
  // in a model definition, 'default' will be used.
  'default': 'pg',

  // In-memory adapter for DEVELOPMENT ONLY
  memory: {
    module: 'sails-memory'
  },

  // Persistent adapter for DEVELOPMENT ONLY
  // (data IS preserved when the server shuts down)
  disk: {
    module: 'sails-disk'
  },

  // MySQL is the world's most popular relational database.
  // Learn more: http://en.wikipedia.org/wiki/MySQL
  pg: {
    module: 'sails-postgresql',
    //host: '192.168.1.200',
    host: mc.dbSettings.host,
    user: mc.dbSettings.user,
    port: 5432,
    // Psst.. You can put your password in config/local.js instead
    // so you don't inadvertently push it up if you're using version control
    password: mc.dbSettings.password,
    database: mc.dbSettings.dbName
  }
};