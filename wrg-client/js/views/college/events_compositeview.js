define([
    'marionette',
    'text!templates/college/events.html',
    'views/college/event_itemview',
    'collections/college/college_events',
    'views/college/edit/add_event_form_view'
], function (Marionette, Template, ItemView, EventsCollection, FormView) {
    "use strict";

    var EventsCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.event-list.event-list',

        initialize: function (params) {
            this.collection = new EventsCollection(params.data, params);
        },

        events: {
            'click .icon-plus.tip-top': 'newEvent'
        },

        newEvent: function () {
            this.trigger('showModal', this, FormView, this.collection);
        }
    });

    return EventsCollectionView;
});
