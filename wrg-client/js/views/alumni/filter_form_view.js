define([
    'marionette',
    'text!templates/alumni/filter_form.html',
    'models/alumnus'
], function (Marionette, Template, Alumnus) {
    "use strict";

    var FilterFormView = Marionette.ItemView.extend({
        template: Template,

        events: {
            'click .button.filter': 'filter',
            'keypress #name': 'keyManager',
            'keypress #company': 'keyManager',
            'keypress #major': 'keyManager'
        },

        bindings: {
            'name': '#name',
            'company': '#company',
            'major': '#major'
        },

        initialize: function (params) {
            this.reqres = params.reqres;
            this.model = new Alumnus(params.data, params);

            var completeSearchData = window.location.href.split("/");

            var searchParam = completeSearchData[4];
            var originLocation = completeSearchData[3];

            if (originLocation === "#success_stories" && searchParam !== "undefined") {
                this.model.attributes.name = searchParam;
            }
        },

        keyManager: function (e) {
            if (e.which === 13) {
                this.model.set('name', $('#name').val());
                this.model.set('company', $('#company').val());
                this.model.set('major', $('#major').val());
                this.filter(e);
            }
        },

        filter: function () {
            var temp = this.model.get("name");

            if (temp === "") {
                this.model.set('name', $('#name').val());
                this.model.set('company', $('#company').val());
                this.model.set('major', $('#major').val());
            }

            this.trigger('alumni:filter', this, this.model);
            this.model.set("name", "");
        }
    });

    return FilterFormView;
});