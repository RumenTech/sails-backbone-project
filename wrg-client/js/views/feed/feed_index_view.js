/**
 * Created by semir.sabic on 29.4.2014.
 */
define([
    'marionette',
    'text!templates/feed/feed_index.html',
    'collections/feed',
    'views/feed/feed_compositeview',
    'views/feed/event_compositeview'
], function (Marionette, Template, FeedCollection, FeedCompositeView, EventCompositeView) {
    "use strict";

    var FeedIndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            feedContainer: '#feed-container',
            eventsContainer: '#events-container'
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.feed = new FeedCollection(null, options);
            this.listenTo(this.feed, 'loaded', this.onLoaded, this);

            var config = this.reqres.request('config');
            $("#pageloader").fadeIn(config.spinnerTimeout).delay(config.spinnerTimeout).fadeOut(config.spinnerTimeout);
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        onLoaded: function () {
            this.feedContainer.show(new FeedCompositeView({
                reqres: this.reqres,
                data: this.feed
            }));

            this.eventsContainer.show(new EventCompositeView({
                reqres: this.reqres
            }));
        }
    });
    return FeedIndexView;
});
