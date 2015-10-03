define([
    'marionette',
    'text!templates/home/registration_success.html'
], function (Marionette, Template) {
    "use strict";

    var RegistrationSuccessView = Marionette.ItemView.extend({
        template: Template,

        triggers: {
            'click #open-login': 'show:login'
        }
    });
    return RegistrationSuccessView;
});