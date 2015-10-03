define([
    'marionette',
    'text!templates/dashboard/fellow_student.html'
], function (Marionette, Template) {
    "use strict";

    var FellowStudentItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click #studentLink': 'openStudent'
        },

        initialize: function (params) {
            this.config = params.model.reqres.request('config');
            // Fellow Student tab type is 5
            this.model.set('type', 5);
        },

        openStudent: function () {
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
                        window.location = '#student/' + that.model.get('user_id');
                    }
                });
            }
            else {
                window.location = '#student/' + that.model.get('user_id');
            }
        }
    });
    return FellowStudentItemView;
});