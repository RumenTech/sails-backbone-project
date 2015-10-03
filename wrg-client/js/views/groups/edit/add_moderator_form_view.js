define([
    'marionette',
    'text!templates/groups/edit/add_moderator_form.html',
    'lib/backbone.modelbinder',
    'utils/conversionUtils'

], function (Marionette, Template, ModelBinder, ConversionUtils) {
    "use strict";

    var AddModeratorView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .add': 'addModerator',
            'click .save-button': 'save',
            'click .icon-delete': 'removeModerator',
            'submit #saveModerator': 'save'
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        initialize: function (options) {

            this.reqres = options.reqres;
            $('#groupImages').html('');

            var config = this.reqres.request('config'); //Use this configuration as necessary

            var that = this,
                groupId = this.collection.models[0].attributes.group_id;

            this.collection.reset();
            //Native Ajax is used vs overidden fetch method since it overides GET URL permanently
            $.ajax({
                type: 'GET',
                data: $.param({ group_id: groupId}),  //restulr
                url: config.endPoints.userPendingResolution,
                dataType: 'json',
                success: function (data) {
                    that.collection.set(data);
                    that.onShow();
                }
            });
        },

        onShow: function () {
            for (var i = 0; i < this.collection.length; i++) {
                var userPhoto = this.collection.models[i].attributes.profileImage;
                if (userPhoto === null || userPhoto === undefined) {
                    userPhoto = '//placehold.it/100x100';
                }
                var myLoadedImages = [],
                    role = this.collection.models[i].get('role'),
                    status = this.collection.models[i].get('status');
                if (role !== 'admin' && role !== 'moderator' && status === 'approved') {
                    var userId = this.collection.models[i].attributes.user_id;
                    myLoadedImages[i] = $('<img/>');
                    myLoadedImages[i].attr('class', "add");
                    myLoadedImages[i].attr('width', 100);
                    myLoadedImages[i].attr('height', 100);
                    myLoadedImages[i].attr('src', userPhoto);
                    myLoadedImages[i].attr('id', userId + '-' + i);

                    $('#usersList').append(myLoadedImages[i]);
                }
                if (role === 'moderator' && status === 'approved') {
                    this.createModeratorHtml(i);
                }
            }
        },

        addModerator: function (e) {
            var elementId = e.currentTarget.id;
            var id = elementId.split('-');
            var userId = id[0], modelIndex = id[1];
            this.createModeratorHtml(modelIndex);
            this.collection.models[modelIndex].attributes.role = 'moderator';
            this.collection.models[modelIndex].attributes.changed = 'yes';
            $('.addedModerators').html('');
            $('#usersList').html('');
            this.onShow();
        },

        createModeratorHtml: function (modelIndex) {
            var firstName = this.collection.models[modelIndex].attributes.firstName,
                lastName = this.collection.models[modelIndex].attributes.lastName,
                name = firstName + ' ' + lastName;
            var myLoadedAdmins = $('<span/>', {
                html: name
            });
            myLoadedAdmins.attr('class', 'addedAdmin');
            var deleteImage = $('<i/>');
            deleteImage.attr('class', 'icon-delete tip-top');
            deleteImage.attr('id', modelIndex);
            deleteImage.attr('title', 'delete');
            deleteImage.attr('style', 'cursor: pointer; ');

            $('.addedModerators').append(myLoadedAdmins);
            $('.addedModerators').append(deleteImage);
        },

        removeModerator: function (e) {
            var modelIndex = e.toElement.id;
            this.collection.models[modelIndex].attributes.role = 'member';
            this.collection.models[modelIndex].attributes.changed = 'yes';
            $('.addedModerators').html('');
            $('#usersList').html('');
            this.onShow();
        },

        save: function (e) {
            e.preventDefault();
            this.collection.models.forEach(function (admin) {
                if (admin.get('changed') === 'yes') {
                    admin.save(null, {
                        success: _.bind(function () {

                        }, this),
                        error: _.bind(function (model, response) {
                            var message = response.responseJSON.message;
                        }, this)
                    });
                }
            });
            $('.close-reveal-modal').click();
        }
    });
    return AddModeratorView;
});
