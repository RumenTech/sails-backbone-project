define([
    'marionette',
    'text!templates/admin/company.html'
], function (Marionette, Template) {
    "use strict";

    var CompanyItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        bindings: {
            'payment_flag': '[name=onoffswitch]'
        },

        initialize: function () {
            this.on_off = this.model.get('payment_flag');
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        onShow: function () {
            $('#payment' + this.model.get('id')).prop('checked', this.on_off);
        }
    });

    return CompanyItemView;
});
