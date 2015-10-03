define([
    'marionette',
    'text!templates/readonly/group.html',
    'lib/backbone.modelbinder',
    'models/read_only_group',
    'utils/conversionUtils',
    'regions/modal_region',
    'models/groups/group_user',
    'utils/notifier',
    'views/findcompanies/media_view' // reused, no changes needed
], function (Marionette, Template, ModelBinder, ReadOnlyGroup, ConversionUtils, ModalRegion, GroupUser, Notificator, MediaView) {
    'use strict';

    var GroupView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion
        },

        events: {
            'click .project-view': 'openModal',
            'click .connection': 'viewConnection',
            'click #joinGroup': 'joinGroup'
        },

        initialize: function (params) {
            this.config = params.reqres.request('config');
            this.params = params;
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            this.modelBinder = new ModelBinder();
            var group = document.location.href.split('/')[document.location.href.split('/').length - 1];
            var groupId = group.split('-')[0];
            this.checkMembership(groupId);
        },

        onErrorMethod: function () {
            $("#pageloader").fadeOut(100);
            $('#error-message').show();
            $('#group-content').hide();
        },

        checkMembership: function (groupId) {
            var that = this;
            $.ajax({ data: $.param({group_id: groupId}),
                url: that.config.restUrl + '/group/isUserMemberOfGroup',
                type: 'get',
                success: _.bind(function (data) {
                    if (data.message === 'New' || data.message === 'pending') {
                        that.model = new ReadOnlyGroup(groupId, that.params);
                        that.status = data.message;
                        that.listenTo(that.model, 'loaded', that.onLoaded, this);
                        this.listenTo(this.model, 'error', this.onErrorMethod, this);
                    } else {
                        window.location = '#group/' + ConversionUtils.returnInteger(groupId, 'Could not convert group id');
                    }
                }, this),
                error: _.bind(function (model, response) {
                    Notificator.validate('Something went wrong', "error");
                }, this)
            });
        },

        checkStatus: function () {
            if (this.status === 'pending') {
                this.model.set('pending', 'Your request is pending for approval');
            } else {
                this.model.set('new', 'Would you like to join this group?');
            }
        },

        onLoaded: function () {
            this.checkStatus();
            $("#pageloader").fadeIn(800).delay(300).fadeOut(800);
            var media = this.model.get('media');
            for (var i = 0; i < media.length; i++) {
                if (media[i].type === 'video') {
                    var shortUrl = media[i].media_url.split("watch?v=");
                    media[i].id_video = shortUrl[1];
                    media[i].showIndex = i;
                    media[i].embedded = shortUrl[0] + 'embed/' + shortUrl[1];
                }
            }

            var numberOfUsers = this.model.get('users');
            numberOfUsers = numberOfUsers.length;
            this.model.set('numberOfUsers', numberOfUsers);

            this.render();
        },

        openModal: function (e) {
            var index = $(e.currentTarget).attr('index');
            this.showModal(MediaView, this.model);
        },

        showModal: function (formClass, model) {
            var options = {
                model: model,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({model: model, reqres: this.reqres}, options));
        },

        joinGroup: function () {
            this.groupUser = new GroupUser(null, {reqres: this.reqres});
            var urlGroupUser = this.config.restUrl + '/groupuser';
            var that = this;
            var options = {
                url: urlGroupUser
            };
            this.groupUser.fetch({ data: $.param({
                    user_id: that.model.session.id,
                    group_id: that.model.get('id'),
                    status: 'pending'
                }),
                    type: 'POST',
                    success: _.bind(function (data) {
                        Notificator.validate('Your request is pending for approval', "success");
                    }, this),
                    error: _.bind(function (model, response) {
                        if (response.responseJSON.message === 'pending') {
                            Notificator.validate('Your request is pending for approval', "success");
                        }
                    }, this)
                },
                options
            );
        }
    });
    return GroupView;
});
