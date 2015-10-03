/**
 * Logger configuration
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which 
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 */

var mc = (require('./mainConfig.js')());

module.exports = {

  // Valid `level` configs:
  // i.e. the minimum log level to capture with sails.log.*()
  //
  // 'error'	: Display calls to `.error()`
  // 'warn'	: Display calls from `.error()` to `.warn()`
  // 'debug'	: Display calls from `.error()`, `.warn()` to `.debug()`
  // 'info'	: Display calls from `.error()`, `.warn()`, `.debug()` to `.info()`
  // 'verbose': Display calls from `.error()`, `.warn()`, `.debug()`, `.info()` to `.verbose()`
  //
  log: {
    level: 'info',
    maxSize: 1000,
    filePath: mc.logger.filePath,
    maxFiles: mc.logger.maxFiles,
    colorize: true,
    timestamp: true,
    alertAdminByEmail: function (message) {
          //implement log send by email

    },
    alertAdminBySMS: function (message) {
        //implement log send by SMS
    }
  }
};
