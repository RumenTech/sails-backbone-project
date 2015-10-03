define([
    'marionette',
    'text!templates/admin/users_index.html',
    'regions/modal_region',
    'collections/admin_users',
    'views/admin/users_compositeview'
], function (Marionette, Template, ModalRegion, AdminUsersCollection, UsersCompositeView) {
    "use strict";

    var UsersIndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion,
            users: '#usersAdmin'
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.collection = new AdminUsersCollection(null, options);
            this.listenTo(this.collection, 'loaded', this.onLoaded, this);
            $("#pageloader").fadeIn(800).delay(300).fadeOut(800);
        },

        onLoaded: function () {
            for (var i = 0; i < this.collection.length; i++) {
                this.collection.models[i].attributes.ordinal = i + 1;
            }
            this.users.show(new UsersCompositeView({
                reqres: this.reqres,
                collection: this.collection
            }));
            this.listenTo(this.users.currentView, 'showModal', this.showModal, this);
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        showModal: function (formClass) {
            var options = {
                model: this.model,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({model: this.model, reqres: this.reqres, data: this.newCategories}, options));
        }
    });

    return UsersIndexView;
});