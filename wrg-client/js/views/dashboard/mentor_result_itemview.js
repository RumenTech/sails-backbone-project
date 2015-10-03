define([
    'marionette',
    'text!templates/dashboard/mentor_result.html'
], function (Marionette, Template) {
    "use strict";

    var ResultItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click #mentorLink': 'openAlumniProfile'
        },

        initialize: function (params) {
            this.config = params.model.reqres.request('config');
            // Mentors tab type is 1
            this.model.set('type', 1);
        },

        openAlumniProfile: function () {
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
                    success: function () {
                        window.location = '#alumni_user/' + that.model.get('user_id');
                    }
                });
            }
            else {
                window.location = '#alumni_user/' + that.model.get('user_id');
            }
        }
    });
    return ResultItemView;
});