define([
    'marionette',
    'text!templates/portfolio/connections.html',
    'collections/portfolio/connections',
    'views/portfolio/connection_itemview'
], function (Marionette, Template, Connections, ItemView) {
    'use strict';

    var ConnectionsView = Marionette.CompositeView.extend({
        template: Template,
        itemView: ItemView,
        itemViewContainer: '.connections',

        initialize: function (params) {
            this.collection = new Connections(params.data, params);
            var that = this;

            //Worst possible way! Think of sth that can affect afterRender action
            setTimeout(function () {
                that.afterRender();
            }, 0);

        },

        events: {
            'click .special': 'getAllConnections'
        },

        afterRender: function () {
            var number = this.collection.models.length;
            if (number === 0) {
                $('#connections').css('display', 'none');
                $('.special').css('display', 'none');
            }
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