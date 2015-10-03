/**
 * Created by semir.sabic on 29.4.2014.
 */
define([
    'marionette',
    'text!templates/feed/feeds.html',
    'views/feed/feed_itemview',
    'collections/feed'
], function (Marionette, Template, ItemView, Feeds) {
    "use strict";

    var FeedCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '#feed-list',

        events: {
            'click #load-feed': 'loadMore'
        },

        initialize: function (params) {
            this.collection = new Feeds(params.data, params);
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
                            $('#load-feed').hide();
                        }
                    }, this)
                }
            );
        }
    });
    return FeedCollectionView;
});