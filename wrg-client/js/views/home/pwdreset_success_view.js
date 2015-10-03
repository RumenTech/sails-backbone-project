define([
    'marionette',
    'text!templates/home/pwd_reset_success.html'
], function (Marionette, Template) {
    "use strict";

    var PwdSuccessView = Marionette.ItemView.extend({
        template: Template,

        triggers: {
            'click #open-login': 'show:login'
        }
    });
    return PwdSuccessView;
});