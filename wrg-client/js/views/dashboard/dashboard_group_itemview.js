define([
    'marionette',
    'text!templates/dashboard/dashboard_group.html'
], function (Marionette, Template) {
    "use strict";

    var DashboardGroupItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click #groupLink': 'openGroup'
        },

        initialize: function (params) {
            this.config = params.model.reqres.request('config');
            // Groups tab type is 4
            this.model.set('type', 4);
        },

        openGroup: function () {
            var that = this;
            if (this.model.get('is_seen') === false) {
                $.ajax({
                    type: 'post',
                    data: {
                        resultId: this.model.get('id'),
                        type: this.model.get('type')
                    },
                    url: this.config.restUrl + '/dashboard/update',
                    dataType: 'json',
                    success: function () {
                        window.location = '#group_readonly/' + that.model.get('id');
                    }
                });
            }
        }
    });
    return DashboardGroupItemView;
});