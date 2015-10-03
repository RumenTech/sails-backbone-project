define([
    'marionette',
    'text!templates/company/user.html',
    'views/company/edit/remove_user_form_view',
    'views/error_message_view',
    'models/company/user'
], function (Marionette, Template, FormView, ErrorMessageView, User) {
    "use strict";

    var UserItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click #delete-item': 'deleteUser',
            'click .icon-edit.tip-top': 'edit',
            'click #save-user': 'update',
            'click #change-password': 'changepwd',
            'click .save-password': 'savepwd'
        },
        regions: {
            message: '.validation-messages'
        },

        initialize: function () {

            var aux = this.model.collection.session.id;
            var user_id = this.model.get('user_id');
            if (user_id == aux) {
                this.model.set('aux', '1');
            }
            this.model.on('saved', this.render, this);
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

       changepwd: function () {
            this.$('.span-email').css('display', 'none');
            this.$('.input-password').css('display', '');
            this.$('.span-actions').css('display', 'none');
            this.$('.save-password').css('display', '');
        },

        savepwd: function () {
            this.model.set({
                'id': this.model.get('company_user_id'),
                'password': $('.input-password').val()
            });
            this.model.save(null, {
                success: _.bind(function () {
                    // Add the model to the awards collection.
                    //this.collection.add(this.model);
                    this.model.trigger('saved');
                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseJSON.message;
                    this.showMessage(this.model, message);
                }, this)
            });
        },

        deleteUser: function () {
            this.trigger('showModal', FormView);
        },

        edit: function () {
            // this.trigger('showModal', FormView);
            this.$('.span-first_name').css('display', 'none');
            this.$('.input-first_name').css('display', '');
            this.$('.span-last_name').css('display', 'none');
            this.$('.input-last_name').css('display', '');
            this.$('.span-email').css('display', 'none');
            this.$('.input-email').css('display', '');
            this.$('.span-actions').css('display', 'none');
            this.$('.input-actions').css('display', '');
        },

        update: function () {
            //this.message.close();
            this.model.set({
                'first_name': this.$('.input-first_name').val(),
                'last_name': this.$('.input-last_name').val(),
                'email': this.$('.input-email').val(),
                'id': this.model.get('company_user_id'),
                'password': this.model.get('password')
            });
            this.model.save(null, {
                success: _.bind(function () {
                    // Add the model to the awards collection.
                    //this.collection.add(this.model);
                    this.model.trigger('saved');
                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseJSON.message;
                    alert('We have a problem: \n' + message);
                    //this.showMessage(this.model,message)
                }, this)
            });
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }

    });

    return UserItemView;
});