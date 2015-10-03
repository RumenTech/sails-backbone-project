define([
    'marionette',
    'text!templates/dashboard/internship_result.html'
], function (Marionette, Template) {
    "use strict";

    var InternshipItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click #internshipLink': 'openCompanyProfile'
        },

        initialize: function (params) {
            this.config = params.model.reqres.request('config');
            // Groups tab type is 2
            this.model.set('type', 2);
        },

        openCompanyProfile: function () {
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
                        window.location = '#company/' + that.model.get('id');
                    }
                });
            }
            else {
                window.location = '#company/' + that.model.get('id');
            }
        }
    });
    return InternshipItemView;
});