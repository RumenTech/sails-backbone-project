define([
    'marionette',
    'lib/marionette.handlebars',
    'wreqr',
    'routers/router',
    'views/header_view',
    'views/footer_view',
    'lib/foundation',
    'lib/foundation.dropdown',
    'lib/foundation.orbit',
    'lib/foundation.reveal',
    'controllers/format_controller'
], function (Marionette, MarionetteHandlebars, Wreqr, Router, HeaderView, FooterView, Foundation, Dropdown, Orbit, Reveal, FormatController) {
    "use strict";

    var App = new Marionette.Application();

    App.addRegions({
        header: '#header',
        main: '#main',
        footer: '#footer'
    });

    App.addInitializer(function (config) {
        // Use withCredentials to send the server cookies
        // The server must allow this through response headers
        $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
            options.xhrFields = {
                withCredentials: true
            };

        });
        // Make the application config available via request/response.
        this.reqres.setHandler('config', _.bind(function () {
            return config;
        }, this));
        // Make the application session available via request/response.
        this.reqres.setHandler('session', _.bind(function () {
            return null;
        }, this));
    });

    App.addInitializer(function (config) {
        App.request = new Wreqr.RequestResponse();
        // TODO: Pass application level event to every object at the framework
        // level for a mediator implementation, or re-design application
        // structure to allow this. Passing App.vent to individual objects isn't
        // very convenient for development.
        new Router({vent: App.vent, reqres: App.reqres});
        Backbone.history.start();
        //FIX for IE -
    });

    // Initialize any utilities that will be available through vent or reqres.
    App.addInitializer(function (config) {
        // String formatter for dates, etc.
        new FormatController({vent: App.vent, reqres: App.reqres});
        wrgSettings.currentConfig = this.reqres.request('config');
    });

    App.vent.on('app:main:show', function (view, isLoggedIn) {
        App.header.close();
        App.main.close();
        App.footer.close();

        // The number of top-level regions we will show.
        var totalRegionsShown = (isLoggedIn) ? 3 : 1;

        // After all regions have been rendered, initialize Foundation. The
        // regions render asyncronously, so we only want to execute this
        // function when they have all finished rendering. If, for example, we
        // are going to show three regions (e.g. header, main, and footer), the
        // function is set to execute on the third time it is called.
        var initFoundation = _.after(totalRegionsShown, function () {
            $(document).foundation();
        });

        if (isLoggedIn && window.location.hash !== '#about' && window.location.hash !== '#contact' && window.location.hash !== '#news' && window.location.hash !== '#companies') {
            var headerView = new HeaderView({
                reqres: view.reqres
            });
            headerView.on('show', _.bind(initFoundation, this));
            App.header.show(headerView);

            var footerView = new FooterView();
            footerView.on('show', _.bind(initFoundation, this));
            App.footer.show(footerView);
        }

        view.on('show', _.bind(initFoundation, this));
        App.main.show(view);
    });

    return App;
});