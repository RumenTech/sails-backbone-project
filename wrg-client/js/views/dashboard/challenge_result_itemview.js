define([
    'marionette',
    'text!templates/dashboard/challenge_result.html'
], function (Marionette, Template) {
    "use strict";

    var DashboardChallengeItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click #challengeLink': 'openChallenge'
        },

        initialize: function (params) {
            this.config = params.model.reqres.request('config');
            // Challenges tab type is 3
            this.model.set('type', 3);
        },

        openChallenge: function () {
            var that = this;
            if (this.model.get('is_seen') === false || this.model.get('is_seen') === undefined) {
                $.ajax({
                    type: 'post',
                    data: {
                        resultId: this.model.get('id'),
                        type: this.model.get('type')
                    },
                    url: this.config.restUrl + '/dashboard/update',
                    dataType: 'json',
                    success: function (data) {
                        window.location = '#challenge_dashboard/' + that.model.get('id');
                    }
                });
            }
            else {
                window.location = '#challenge_dashboard/' + that.model.get('id');
            }
        }
    });
    return DashboardChallengeItemView;
});