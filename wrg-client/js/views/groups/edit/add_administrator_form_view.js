define([
    'marionette',
    'text!templates/groups/edit/add_administrator_form.html',
    'lib/backbone.modelbinder',
    'collections/groups/group_users',
    'utils/notifier',
    'utils/conversionUtils'
], function (Marionette, Template, ModelBinder, UsersCollection, Notificator, ConversionUtils) {
    "use strict";

    var AddAdministratorView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .next-button': 'next',
            'click .close-button': function (e) {
                this.closeModal(e);
            },
            'click .save-button': function (e) {
                this.save(e);
            },
            'click .addAdministrator': function (e) {
                this.addAdmin(e);
            },
            'click .newAdmin': 'removeAdmin'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        initialize: function (options) {
            this.reqres = options.reqres;
            var config = this.reqres.request('config'),
                groupId = this.collection.models[0].attributes.group_id;
            this.temporaryCol = [];
            this.model = new Backbone.Model();
            this.model.set('noOfModerators', this.countModerator());
        },

        countModerator: function () {
            var noModerators = 0;
            this.collection.models.forEach(function (user) {
                if (user.get('role') === 'moderator') {
                    noModerators++;
                }
            });
            return noModerators;
        },

        onShow: function () {
            var moderators = [], myModerators = [];
            this.collection.models.forEach(function (user, index) {
                if (user.get('role') === 'moderator') {
                    var name = user.get('firstName') + ' ' + user.get('lastName');
                    moderators.push(user);
                    myModerators[index] = $('<li/>', {
                        text: name
                    });
                    myModerators[index].attr('class', "addAdministrator");
                    myModerators[index].attr('id', user.get('user_id') + '-' + index);
                    myModerators[index].attr('style', "cursor:pointer");
                }
            });

            for (var i = 0; i < myModerators.length; i++) {
                $('#currentModerators').append(myModerators[i]);
            }
        },

        addAdmin: function (e) {
            if (this.temporaryCol.length === 1) {
                Notificator.validate('You can add only one administrator', "error", '.validation-messages');

            } else {
                var elementId = e.currentTarget.id,
                    id = elementId.split('-'),
                    userId = id[0],
                    modelIndex = id[1];

                this.temporaryCol[0] = modelIndex;
                var newAdminImage = $('<img/>');
                newAdminImage.attr('class', "newAdmin");
                newAdminImage.attr('width', 100);
                newAdminImage.attr('height', 100);
                newAdminImage.attr('src', this.collection.models[modelIndex].get('profileImage'));
                newAdminImage.attr('id', userId + '/' + modelIndex);
                newAdminImage.attr('style', 'cursor:pointer');

                var firstName = this.collection.models[modelIndex].get('firstName'),
                    lastName = this.collection.models[modelIndex].get('lastName');
                this.model.set('name', firstName + ' ' + lastName);
                $('#newAdminImage').append(newAdminImage);
            }
        },

        removeAdmin: function () {
            $('#newAdminImage').html('');
            this.temporaryCol = [];
        },

        next: function (e) {
            e.preventDefault();
            if (this.temporaryCol.length != 1) {
                Notificator.validate('You need to add administrator', "error", '.validation-messages');
            } else {
                $('#mainContent').css('display', 'none');
                $('#userMessage').css('visibility', 'visible');
                $('#userMessage').html(' Are you sure you want to promote ' + this.model.get('name') + ' to administrator?');
                $('#next').css('visibility', 'hidden');
                $('#save').css('visibility', 'visible');
                $('#close').css('visibility', 'visible');
            }
        },

        closeModal: function (e) {
            e.preventDefault();
            $('.close-reveal-modal').click();
        },

        save: function (e) {
            e.preventDefault();
            if (this.temporaryCol.length === 0) {
                Notificator.validate('You need to add administrator first', "error", '.validation-messages');
            } else {
                var that = this,
                    colIndex = ConversionUtils.returnInteger(this.temporaryCol[0], 'Cannot convert collection index');
                this.collection.models[colIndex].set('role', 'admin');
                this.collection.models.forEach(function (admin, index) {
                    if (admin.get('role') === 'admin') {
                        if (admin.get('user_id') === that.collection.session.id) {
                            admin.set('role', 'member');
                        }
                        admin.save(null, {
                            success: _.bind(function () {
                                $('.close-reveal-modal').click();
                                location.reload();
                            }, this),
                            error: _.bind(function (model, response) {
                                var message = response.responseJSON.message;
                            }, this)
                        });
                    }
                });
            }
        }
    });
    return AddAdministratorView;
});