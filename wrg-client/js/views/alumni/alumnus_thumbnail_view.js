define([
    'marionette',
    'text!templates/alumni/alumnus_thumbnail.html',
    'views/alumni/friend_request_view',
    'views/alumni/story_view'
], function (Marionette, Template, FriendRequestView, StoryView) {
    "use strict";

    var AwardsItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click .show-story': 'showStory'
        },

        showStory: function () {
            this.trigger('showModal', StoryView);
        }
    });

    return AwardsItemView;
});