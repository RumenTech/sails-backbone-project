/**
 * Created by semir.sabic on 30.4.2014.
 */
define([
    'marionette',
    'text!templates/feed/events.html',
    'views/feed/event_itemview',
    'collections/events'
], function (Marionette, Template, ItemView, Events) {
    "use strict";

    var EventCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '#event-list',

        events: {
            'click #load-events': 'loadMore'
        },

        initialize: function (params) {
            this.collection = new Events(null, params);
            //Scroll event
            _.bindAll(this, "checkScroll");
            $(window).scroll(this.checkScroll);
        },

        checkScroll: function () {
            if ($(window).scrollTop() === $(document).height() - $(window).height()) {
                this.loadMore();
            }
        },

        loadMore: function () {
            this.result_length = this.collection.length;
            this.collection.fetch({ data: $.param({
                    limit: this.collection.length + 10
                }),
                    success: _.bind(function () {
                        if (this.collection.length === this.result_length) {
                            $('#load-events').hide();
                        }
                    }, this)
                }
            );
        }
    });
    return EventCollectionView;
});