define([
    'marionette',
    'text!templates/company/findtalents/review_request_item.html'
], function (Marionette, Template) {
    "use strict";

    var ReviewRequestItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click .accept-request': 'acceptRequest',
            'click .decline-request': 'declineRequest'
        },

        acceptRequest: function () {
            this.trigger('acceptRequest');
        },

        declineRequest: function () {
            this.trigger('declineRequest');
        }
    });

    return ReviewRequestItemView;
});