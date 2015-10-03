/**
 * Created by semir.sabic on 21.4.2014.
 */
define([
    'marionette',
    'regions/modal_region',
    'text!templates/careerpath/resource.html',
    'models/careerpath/careerpath_comment',
    'models/careerpath/careerpath_vote',
    'models/careerpath/careerpath_resource',
    'views/careerpath/add_resource_view',
    'views/careerpath/delete_resource',
    'utils/conversionUtils'
], function (Marionette, ModalRegion, Template, CommentModel, VoteModel, ResourceModel, AddResourceView, DeleteResourceView, ConversionUtils) {
    "use strict";

    var ResourceCommentItemView = Marionette.Layout.extend({
        template: Template,

        tagName: 'li',

        regions: {
            modal: ModalRegion
        },

        events: {
            'keypress #resourceComment': 'addComment',
            'click .glyphicon-thumbs-up': 'vote',
            'click #remove-resource': 'removeResource',
            'click #edit-resource': 'edit'
        },

        initialize: function (params) {
            this.model.on('saved', this.render, this);
            this.params = params;
            this.reqres = params.model.collection.reqres;
            this.config = this.reqres.request('config');
            this.addHelperVariables();
            this.getCommentNumber();
        },

        addHelperVariables: function () {
            var userRole = this.model.collection.session.role;
            if (this.model.get('votes')) {
                var votes = this.model.get('votes');
                this.model.set('votes_sum', votes.length);

                for (var i = 0; i < votes.length; i++) {
                    if (votes[i].user_id === this.model.collection.session.id) {
                        this.model.set('voted', true);
                    }
                }
            } else {
                this.model.set('votes_sum', 0);
            }
            if (this.model.get('user_id') === this.model.collection.session.id) {
                this.model.set('editable', true);
                this.model.set('allowDelete', true);
            }
            if (userRole === 'college' || userRole === 'admin') {
                this.model.set('allowDelete', true);
            }
        },

        getCommentNumber: function () {
            var that = this;
            $.ajax({
                type: 'get',
                url: this.config.restUrl + '/CareerPathResourceComment/getNumberOfComments',
                dataType: 'json',
                data: $.param({ resId: this.model.get('id')}),
                success: function (data) {
                    var noOfComments = 0;
                    if (data.rows[0]) {
                        noOfComments = data.rows[0].count;
                    }
                    that.model.set('numberOfComments', noOfComments);
                    that.render();
                },
                error: function (err) {
                }
            });
        },

        addComment: function (e) {
            var content = e.currentTarget.value;
            var that = this;
            if (content) {
                this.comment = new CommentModel(null, this.params);
                var resource_id = this.model.get('id');
                this.comment.set('resource_id', resource_id);
                this.comment.set('user_id', this.model.collection.session.id);
                this.comment.set('content', content);
                if (e.which === 13) {
                    this.comment.save(null, {
                        success: _.bind(function () {
                            this.model.trigger('saved');
                            $('[resid=' + this.model.get('id') + ']').click();
                            var prevNoComments = ConversionUtils.returnInteger(that.model.get('numberOfComments'));
                            var newNoComments = prevNoComments + 1;
                            that.model.set('numberOfComments', newNoComments);
                            that.render();
                        }, this),
                        error: _.bind(function (model, response) {
                            var message = response.responseText;
                            this.showMessage(this.model, message);
                        }, this)
                    });
                }
            }
        },

        vote: function () {
            this.vote = new VoteModel(null, this.params);
            this.vote.set('resource_id', this.model.get('id'));
            this.vote.set('user_id', this.reqres.request('session').id);
            this.vote.set('vote', 1);
            if (!this.model.get('voted')) {
                this.vote.save(null, {
                    success: _.bind(function () {
                        this.model.set('votes_sum', this.model.get('votes_sum') + 1);
                        this.model.set('voted', true);
                        this.model.trigger('saved');
                        $('#' + this.model.get('id')).css('color', 'dodgerblue');
                    }, this),
                    error: _.bind(function (model, response) {
                        var message = response.responseText;
                        this.showMessage(this.model, message);
                    }, this)
                });
            }
        },

        edit: function () {
            var options = {};
            options.reqres = this.reqres;
            var resource = {};
            resource.cp_tab_category_id = this.model.get('cp_tab_category_id');
            resource.user_id = this.model.get('user_id');
            resource.college_id = this.model.get('college_id');
            resource.content = this.model.get('content');
            resource.title = this.model.get('title');
            resource.id = this.model.get('id');
            this.model = new ResourceModel(resource, options);
            var options = {
                model: this.model,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new AddResourceView({model: this.model, reqres: this.reqres}, options));
        },

        removeResource: function () {
            var res = new ResourceModel(this.model.attributes, {reqres: this.reqres});
            var options = {
                model: this.model,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new DeleteResourceView({model: res, collection: this.model.collection, reqres: this.reqres}, options));
        }
    });
    return ResourceCommentItemView;
});