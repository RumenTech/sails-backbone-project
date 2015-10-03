/**
 * Created by Mistral on 2/19/14.
 */
define([
    'marionette',
    'text!templates/groups/events.html',
    'views/groups/event_itemview',
    'collections/groups/group_events',
    'views/groups/edit/add_event_form_view',
    'models/groups/group_event'

], function (Marionette, Template, ItemView, EventsCollection, FormView, Model) {
    "use strict";

    var EventsCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.event-list.event-list',

        initialize: function (params) {
            this.role = params.role;
            this.collection = new EventsCollection(params.data, params);
        },

        events: {
            'click .icon-plus.tip-top': 'newEvent'
        },

        onShow: function () {
            if (this.role !== 'admin' && this.role !== 'moderator') {
                $("#newEvent").hide();
            }
        },

        newEvent: function () {
            this.trigger('showModal', this, FormView, this.collection);
        }

    });
    return EventsCollectionView;
});
