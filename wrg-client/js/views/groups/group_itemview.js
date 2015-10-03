define([
    'marionette',
    'text!templates/groups/group.html',
    'regions/modal_region',
    'models/groups/group_user',
    'utils/conversionUtils'
], function (Marionette, Template, ModalRegion, GroupUser, ConversionUtils) {
    "use strict";

    var GroupItemView = Marionette.Layout.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click #checkGroup': 'checkGroup'
        },

        regions: {
            modal: ModalRegion
        },

        initialize: function (options) {
            this.model.on('saved', this.render, this);
            this.reqres = options.model.collection.reqres;
            this.config = this.reqres.request('config');
            this.groupId = this.model.get('id');
        },

        checkGroup: function () {
            var that = this;
            this.group = new GroupUser(null, {reqres: this.reqres});
            var urlCheckGroupUser = this.config.endPoints.isUserInGroup;
            var hrefValue = '#group/' + this.groupId;
            var options = {
                url: urlCheckGroupUser
            };
            this.group.fetch(
                { data: $.param({
                    group_id: this.groupId
                }),
                    url: urlCheckGroupUser,
                    type: 'GET',
                    success: _.bind(function (data) {
                        if (data.attributes.message) {
                            if (data.attributes.message === 'new') {
                                window.location = '#group_readonly/' + ConversionUtils.returnInteger(this.model.get('id'), 'Could not convert user id') + '-new';
                            } else if (data.attributes.message === 'pending') {
                                window.location = '#group_readonly/' + ConversionUtils.returnInteger(this.model.get('id'), 'Could not convert user id') + '-pending';
                            }
                        } else {
                            window.location = hrefValue;
                        }
                    }, this),
                    error: _.bind(function (model, response) {
                        // TODO handle error
                    }, this)
                },
                options
            );
        },

        showModal: function (formClass, status) {
            var options = {
                model: this.model,
                collection: this.groups,
                reqres: this.reqres,
                data: status
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({reqres: this.reqres}, options));
        }
    });
    return GroupItemView;
});



