define([
    'marionette',
    'text!templates/alumni/portfolio/connections.html',
    'collections/professional/connections',
    'views/alumni/portfolio/connection_itemview'
], function (Marionette, Template, Connections, ItemView) {
    "use strict";

    var ConnectionsView = Marionette.CompositeView.extend({
        template: Template,
        itemView: ItemView,
        itemViewContainer: '.connections',

        initialize: function (params) {
            this.collection = new Connections(null, params);
        },

        events: {
            'click .special': 'getAllConnections'
        },

        getAllConnections: function () {
            this.collection.fetch({
                success: _.bind(function () {
                    $('.special').css('display', 'none');
                }, this)
            });
        }
    });

    return ConnectionsView;
});