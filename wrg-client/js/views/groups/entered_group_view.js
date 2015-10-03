define([
    'marionette',
    'text!templates/groups/entered_group.html',
    'regions/modal_region',
    'models/groups/entered_group',
    'views/groups/events_compositeview',
    'views/groups/posts_compositeview',
    'views/groups/group_users_compositeview',
    'views/groups/group_pending_users_compositeview',
    'views/groups/media_compositeview',
    'views/groups/edit/basic_information_group_view',
    'views/groups/edit/group_picture_form_view',
    'views/groups/basic_information_view',
    'views/groups/profile_picture_view',
    'views/groups/edit/new_message_form_view',
    'lib/backbone.modelbinder'
], function (Marionette, Template, ModalRegion, Model, EventsCompositeView, PostsCompositeView, GroupUsersCompositeView, GroupPendingUsersCompositeView, GroupMediaView, EditInformationView, GroupPhotoView, BasicInformation, ProfilePicture, MessageFormView, ModelBinder) {
    "use strict";

    var EnteredGroupIndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion,
            groupEvents: '#events-section',
            groupUsers: '#users-section',
            posts: '#posts-section',
            groupPendingUsers: '#pending-users-section',
            basicInformation: '#basic-information-section',
            profilePicture: '#profile-picture-section',
            mediaSection: '#media-information-section'
        },

        initialize: function (options) {
            this.reqres = options.reqres;
            this.session = this.reqres.request('session');
            this.modelBinder = new ModelBinder();
            var groupId = document.location.href.split('/');
            var length = groupId.length;
            groupId = groupId[length - 1];
            this.model = new Model(groupId, options);
            this.model.on('loaded', this.render, this);
            this.listenTo(this.model, 'loaded', this.onLoaded, this);
            this.listenTo(this.model, 'error', this.onErrorMethod, this);
        },

        showEvents: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.model.get('events'),
                reqres: this.reqres,
                company: this.model
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({
                collection: collection,
                model: view.model,
                user_id: this.session.id,
                group_id: this.model.id,
                reqres: this.reqres
            }, options));
        },

        showPosts: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.model.get('posts'),
                reqres: this.reqres,
                company: this.model
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({
                collection: collection,
                model: view.model,
                user_id: this.session.id,
                group_id: this.model.id,
                reqres: this.reqres
            }, options));
        },

        showAdmins: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.model.get('users'),
                reqres: this.reqres,
                company: this.model
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({
                collection: collection,
                model: view.model,
                user_id: this.session.id,
                group_id: this.model.id,
                reqres: this.reqres
            }, options));
        },

        onErrorMethod: function () {
            $("#pageloader").fadeIn(100).delay(200).fadeOut(100);
            $('#error').css('display', 'block');
        },

        onLoaded: function () {
            $("#pageloader").fadeIn(800).delay(300).fadeOut(800);

            this.profilePicture.show(new ProfilePicture({
                reqres: this.reqres,
                role: this.model.get('role'),
                group_id: this.model.id
            }));

            this.basicInformation.show(new BasicInformation({
                reqres: this.reqres,
                role: this.model.get('role'),
                group_id: this.model.id
            }));

            this.posts.show(new PostsCompositeView({
                reqres: this.reqres,
                role: this.model.get('role'),
                user_id: this.session.id,
                group_id: this.model.id
            }));
            this.listenTo(this.posts.currentView, 'showModal itemview:showModal', this.showPosts, this);

            this.groupEvents.show(new EventsCompositeView({
                reqres: this.reqres,
                data: this.model.get('events'),
                role: this.model.get('role')
            }));
            this.listenTo(this.groupEvents.currentView, 'showModal itemview:showModal', this.showEvents, this);

            this.groupUsers.show(new GroupUsersCompositeView({
                reqres: this.reqres,
                data: this.model.get('users'),
                role: this.model.get('role'),
                groupId: this.model.get('id')
            }));
            this.listenTo(this.groupUsers.currentView, 'showModal itemview:showModal', this.showAdmins, this);

            if (this.model.get('role') === 'admin' || this.model.get('role') === 'moderator') {
                if (this.numberOfPendingUsers() !== 0) {
                    this.groupPendingUsers.show(new GroupPendingUsersCompositeView({
                        reqres: this.reqres,
                        data: this.model.get('users'),
                        role: this.model.get('role'),
                        status: this.model.get('status')
                    }));
                }
            }

            this.mediaSection.show(new GroupMediaView({
                reqres: this.reqres,
                data: this.model.get('media'),
                role: this.model.get('role'),
                group_id: this.model.id
            }));

            this.listenTo(this.mediaSection.currentView, 'showModal itemview:showModal', this.showAdmins, this);
        },

        numberOfPendingUsers: function () {
            var pendingUsersNumber = 0;
            this.model.get('users').forEach(function (users) {
                if (users.status === 'pending') {
                    pendingUsersNumber++;
                }
            });
            return pendingUsersNumber;
        },

        showModal: function (view, formClass) {
            var options = {
                model: view.model,
                collection: this.collection
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass(options));
        }
    });
    return EnteredGroupIndexView;
});



