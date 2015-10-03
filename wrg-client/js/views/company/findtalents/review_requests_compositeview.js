define([
    'marionette',
    'text!templates/company/findtalents/review_requests.html',
    'views/company/findtalents/review_request_itemview'
], function (Marionette, Template, ItemView) {
    "use strict";

    var ReviewRequestsCompositeView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.review-requests-list',

        initialize: function (params) {
            this.collection = params.collection;
            var countRequest = Backbone.Model.extend({
                defaults: {
                    number: this.collection.length
                }
            });
            this.model = new countRequest();
        }
    });
    return ReviewRequestsCompositeView;
});