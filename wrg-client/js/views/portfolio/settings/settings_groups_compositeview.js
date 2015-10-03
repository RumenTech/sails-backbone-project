define([
    'marionette',
    'text!templates/portfolio/settings/groups.html',
    'views/portfolio/settings/settings_group_itemview'
], function (Marionette, Template, ItemView) {
    'use strict';

    var SettingsGroupsCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.settings-list.user-list',

        initialize: function (params) {
            this.collection = params.data;
        }
    });
    return SettingsGroupsCollectionView;
});