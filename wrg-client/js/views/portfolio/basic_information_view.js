define([
    'marionette',
    'text!templates/portfolio/basic_information.html',
    'views/portfolio/edit/basic_information_form_view',
    'models/portfolio/basic_information'
], function (Marionette, Template, FormView, BasicInformation) {
    'use strict';

    var BasicInformationView = Marionette.ItemView.extend({
        template: Template,

        events: {
            'click .icon-edit.tip-top': 'edit'
        },

        initialize: function (params) {
            this.model = new BasicInformation(params.data, params);
            this.model.on('saved', this.render, this);
            this.reqres = params.reqres;
        },

        edit: function () {
            this.trigger('showModal', this, FormView);
        },

        serializeData: function () {
            var data = Marionette.ItemView.prototype.serializeData.apply(this,
                arguments);

            var monthName = this.reqres.request('format:month',
                    this.model.get('graduation_month') - 1);

            return _.extend(data, { month: monthName.short });
        }
    });
    return BasicInformationView;
});