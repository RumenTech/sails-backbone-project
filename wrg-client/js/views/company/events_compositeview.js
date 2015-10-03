define([
    'marionette',
    'text!templates/company/events.html',
    'views/company/event_itemview',
    'collections/company/company_events',
    'views/company/edit/add_event_form_view'
], function (Marionette, Template, ItemView, EventsCollection, FormView) {
    "use strict";

    var EventsCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.event-list.event-list',

        events: {
            'click .icon-plus.tip-top': 'newEvent'
        },

        initialize: function (params) {
            this.collection = new EventsCollection(params.data, params);
        },

        newEvent: function () {
            this.trigger('showModal', this, FormView, this.collection);
        }
    });
    return EventsCollectionView;
});
