/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 12/23/13
 * Time: 8:51 AM
 * Deep dependency flow implemented
 * If required, instead of one big file... segment it in 2 or more modules??!?!?
 * To change this template use File | Settings | File Templates.
 */

({
    appDir: './',
    baseUrl: './js',
    dir: './dist',
    modules: [
        {
            name: 'main'
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    removeCombined: true,
    findNestedDependencies: true,
    paths: {
        underscore  : 'lib/underscore',
        backbone    : 'lib/backbone',
        babysitter  : 'lib/backbone.babysitter',
        wreqr       : 'lib/backbone.wreqr',
        marionette  : 'lib/backbone.marionette',
        handlebars  : 'lib/handlebars',
        jquery      : 'lib/jquery',
        jqueryui    : 'lib/jqueryui',
        jcrop       : 'lib/jquery.jcrop',
        jqueryform  : 'lib/jquery.form',
        wysiwyg     : 'lib/jquery.wysiwyg',
        text        : 'lib/text',
        tagsinput   : 'lib/jquery.tagsinput',
        ddslick     : 'lib/ddslick',
        templates   : '../templates'
    },
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
        'jcrop': {
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
})