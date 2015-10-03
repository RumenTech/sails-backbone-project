define([
    'marionette',
    'text!templates/groups/filter_form.html',
    'models/groups/search',
    'lib/backbone.modelbinder'
], function (Marionette, Template, Search, ModelBinder) {
    "use strict";

    var FilterFormView = Marionette.ItemView.extend({
        template: Template,

        events: {
            'click .button.filter': function (e) {
                this.filter('filter', e);
            },
            'click .button.filter-my': function (e) {
                this.filter('filterMyGroups', e);
            },
            'click .button.filter-pending': function (e) {
                this.filter('filterPendingGroups', e);
            },

            'keydown #groupname': function (e) {
                if (e.which === 13) {
                    e.preventDefault();
                    this.filter('filter', e);
                }
            }
        },

        bindings: {
            'groupName': '#groupname'
        },

        initialize: function (params) {
            var str = window.location.href.split("/")[4];
            this.reqres = params.reqres;
            this.modelBinder = new ModelBinder();

            if (!this.model) {
                this.model = new Backbone.Model(); //Search(params.data, params);
            }

            if (str !== "wrggroups") {
                this.model.set("groupName", str);
            }
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        filter: function (setTrigger, e) {
            e.preventDefault();

            if (setTrigger === "undefined") {    //call comes from URL
                this.trigger("filter", this, this.model);

            } else {

                var groupName = $('#groupname').val();
                this.model.set('groupName', groupName);
                this.trigger(setTrigger, this, this.model);
            }
        }
    });
    return FilterFormView;
});

