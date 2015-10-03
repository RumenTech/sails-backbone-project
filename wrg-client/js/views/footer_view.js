define([
    'marionette',
    'text!templates/footer.html'
], function (Marionette, Template) {
    'use strict';

    var FooterView = Marionette.ItemView.extend({
        template: Template
    });
    return FooterView;
});