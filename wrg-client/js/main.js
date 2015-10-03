//Check this place for JavaScript function comparison: http://kangax.github.io/es5-compat-table/

require.config({
    baseURL: '.',
    paths: {
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        babysitter: 'lib/backbone.babysitter',
        wreqr: 'lib/backbone.wreqr',
        marionette: 'lib/backbone.marionette',
        handlebars: 'lib/handlebars',
        jquery: 'lib/jquery',
        jqueryui: 'lib/jqueryui',
        jqueryform: 'lib/jquery.form',
        text: 'lib/text',
        jcrop: 'lib/jquery.jcrop',
        wysiwyg: 'lib/jquery.wysiwyg',
        //json2              : 'lib/json2',
        tagsinput: 'lib/jquery.tagsinput',
        ddslick: 'lib/ddslick',
        templates: '../templates'
    },
    waitSeconds: 60,
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            exports: 'Backbone',
            deps: ['jquery', 'underscore']
        },
        jqueryui: {
            exports: '$',
            deps: ['jquery']
        },
        babysitter: {
            exports: 'Backbone.Babysitter',
            deps: ['backbone']
        },
        wreqr: {
            exports: 'Backbone.Wreqr',
            deps: ['backbone']
        },
        marionette: {
            exports: 'Backbone.Marionette',
            deps: [
                'backbone',
                'babysitter',
                'wreqr',
                'lib/json2'
            ]
        },
        handlebars: {
            exports: 'Handlebars'
        },
        'lib/marionette.handlebars': {
            exports: 'Marionette.Handlebars',
            deps: ['handlebars', 'marionette']
        },
        'lib/foundation': {
            exports: '$',
            deps: ['jquery']
        },
        'lib/foundation.orbit': {
            exports: '$',
            deps: ['lib/foundation']
        },
        'lib/foundation.reveal': {
            exports: '$',
            deps: ['lib/foundation']
        },
        'lib/foundation.dropdown': {
            exports: '$',
            deps: ['lib/foundation']
        },
        jcrop: {
            exports: '$',
            deps: ['jquery']
        },
        jqueryform: {
            exports: '$',
            deps: ['jquery']
        },
        wysiwyg: {
            exports: '$',
            deps: ['jquery']
        },
        tagsinput: {
            exports: '$',
            deps: ['jquery']
        },
        ddslick: {
            exports: '$',
            deps: ['jquery']
        }
    },
    deps: ['jquery', 'underscore']
});

require(['app', 'backbone', 'config'], function(App, Backbone, Config) {


    $.ajaxSetup({
        cache: false
    });

    // Avoid `console` errors in browsers that lack a console.
   /* (function() {
        //TODO Determine what browser is used and use this override only in IE case

        var method;
        var noop = function () {};
        var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
        ];
        var length = methods.length;
        var console = (window.console = window.console || {});

        while (length--) {
            method = methods[length];

            // Only stub undefined methods.
            if (!console[method]) {
                console[method] = noop;
            }
        }
    }());

*/



    //forEach Implementation
    //Internet Explorer 8 does not support forEach... add it so we do note  break the code
    if (!Array.prototype.forEach)
    {
        Array.prototype.forEach = function(fun /*, thisArg */)
        {
            "use strict";

            if (this === void 0 || this === null)
                throw new TypeError();

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function")
                throw new TypeError();

            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; i++)
            {
                if (i in t)
                    fun.call(thisArg, t[i], i, t);
            }
        };
    }

    //Main Entry to our application
    var runEnvironment = "loc";
    //TODO This can potentialy interfere with FF and IE. TEST IT.
    //if(!Config[runEnvironment].consoleEnabled){ console = { log: function() { /*console.log("WRG Team is best");*/ } };}

    App.start(Config[runEnvironment]);
});