define([
    'marionette',
    'text!templates/company/users.html',
    'views/company/settings_itemview',
    'collections/company/users',
    'views/company/edit/company_user_form_view'
], function (Marionette, Template, ItemView, UsersCollection, FormView) {
    "use strict";

    var UsersCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.settings-list.user-list',

        events: {
            'click .icon-plus.tip-top': 'edit'
        },

        initialize: function (params) {
            this.collection = params.data;
        },

        edit: function () {
            //Evento mostrar y ocultar elementos
            this.trigger('showModal', this, FormView, this.collection);
        }
    });

    return UsersCollectionView;
});