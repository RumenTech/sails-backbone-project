define([
    'marionette',
    'text!templates/careerpath/comment.html',
    'models/careerpath/careerpath_comment'
], function (Marionette, Template, Comment) {
    "use strict";

    var CommentItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click #remove-comment': 'remove',
            'click #edit-comment': 'edit',
            'click .save-comment': 'save'
        },

        initialize: function (params) {
            this.params = params;
            var userRole = this.model.collection.session.role;
            if (this.model.get('user_id') === this.model.collection.session.id) {
                this.model.set('editable', true);
                this.model.set('allowDelete', true);
            }
            if (userRole === 'college' || userRole === 'admin') {
                this.model.set('allowDelete', true);
            }
        },

        edit: function () {
            this.id = this.model.get('id');
            $('#comment-content-' + this.id).removeAttr("readonly");
            $('#comment-content-' + this.id).css('background-color', 'darkgrey');
            $('#save-' + this.id).css('display', 'block');
        },

        save: function () {
            var that = this;
            this.model.set('content', $('#comment-content-' + this.id).val());
            this.model.save(null, {
                success: _.bind(function () {
                    $('#comment-content-' + that.id).attr("readonly", true);
                    $('#comment-content-' + that.id).css('background-color', 'lightgrey');
                    $('#save-' + this.id).css('display', 'none');
                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseText;
                    this.showMessage(this.model, message);
                }, this)
            });
        },

        remove: function () {
            var options = {};
            options.reqres = this.params.model.reqres;
            var id = this.model.get('resource_id');
            this.model.collection.remove(this.model);
            this.model.destroy({
                success: _.bind(function () {
                    $('[resid=' + id + ']').click();
                }, this),
                error: _.bind(function (model, response) {
                    $('[resid=' + id + ']').click();
                }, this)
            });

        }
    });
    return CommentItemView;
});