define([
    'marionette',
    'text!templates/groups/post.html',
    'utils/htmlRenderer',
    'text!templates/groups/postComments.html'

], function (Marionette, Template, htmlRenderer, postCommentsTemplate) {
    "use strict";

    var PostItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click .revealComments': function (e) {
                //used only to show the input box for posts
                var commentInputBox = $("#post-" + e.target.id.split("-")[1]);
                commentInputBox.css("display", "block").fadeIn(1000);
                $("#comments-" + e.target.id.split("-")[1]).hide();
                commentInputBox.focus();
            },

            'click .commentDelete': function (e) {
                var commentId = e.currentTarget.id.split('-')[1];
                //alert("Id of the comment should be deleted: " + commentId);
                this.commentDelete(commentId);
            },

            'click .commentEditSaver': function (e) {
                //SaveComment Button is visible now
                var userId = this.model.collection.session.id;
                var commentId = e.currentTarget.id.split('-')[1];
                var saveButton = $("#saveEditComment-" + commentId);
                var commentInputBox = $("#contentHolder-" + commentId);
                var commentEditedValue = $("#contentHolder-" + commentId).val();

                //TODO: Add verification to avoid unchanged content
                this.editSingleComment(commentId, commentEditedValue, userId, saveButton, commentInputBox);
            },

            'click .commentEdit': function (e) {
                var userId = this.model.collection.session.id;
                var commentId = e.currentTarget.id.split('-')[1];
                this.revealEditableComment(commentId);
            },

            'keypress .addNewComment': function (e) {
                //TODO: extend notificator so it handles id's as well
                var post_id = e.currentTarget.id.split('-')[1],
                    commentBox = $("#post-" + post_id);
                if (e.which === 13) {
                    var commentSize = $("#post-" + post_id).val().length;
                    if (commentSize) {
                        var userId = this.model.collection.session.id;
                        this.postNewComment(userId, post_id, e);
                        commentBox.removeClass('commentValidationIsBad');
                    } else {
                        commentBox.addClass('commentValidationIsBad');
                    }
                }
            },

            'click .icon-edit.tip-top': 'edit',
            'click .icon-delete.tip-top': 'deletePost',
            'click .moreComments': 'moreComments',
            'click .postEditSaver': 'savePost'
        },

        onShow: function () {
            $('#postCont').on('change', 'textarea', function (e) {
                $(this).height(0).height(this.scrollHeight);
            }).find('textarea').change();
        },

        commentDelete: function (id) {
            var comment = $("#comment-" + id);
            this.deleteSingleComment(id, comment);
        },

        initialize: function (options) {
            this.model.on('saved', this.render, this);
            this.config = options.model.collection.reqres.request('config');
            if (this.model.get("id")) {
                this.getPostComments(this.model.get("id"));
            }
        },

        revealEditableComment: function (id) {
            var comment = $("#contentHolder-" + id);
            var saveButton = $("#saveEditComment-" + id);
            comment.removeClass('inputCommentOnLoad').removeAttr("readonly");

            saveButton.removeClass('saveEditCommentButtonDefaultState');
        },

        deleteSingleComment: function (commentId, comment) {
            $.ajax({
                type: 'DELETE',
                data: {
                    id: commentId
                },
                url: this.config.endPoints.postComment,
                dataType: 'json',
                success: function (data) {
                    comment.animate({height: 0}, 500, "linear", function () {
                            $(this).remove();
                        }
                    );
                }
            });
        },

        editSingleComment: function (commentId, editedCommentContent, userId, saveButton, commentInputBox) {
            commentInputBox.attr('readonly', true);

            var userImage = $("#imageSpinner-" + commentId).attr('src');
            $("#imageSpinner-" + commentId).attr('src', './img/ajax-comment.gif');

            $.ajax({
                type: 'POST',
                data: {
                    userId: userId,
                    postContent: editedCommentContent,
                    id: commentId
                },
                url: this.config.endPoints.editComment,
                dataType: 'json',
                success: function (data) {
                    saveButton.addClass("saveEditCommentButtonDefaultState");
                    commentInputBox.addClass("inputCommentOnLoad");
                    $("#imageSpinner-" + commentId).attr('src', userImage);
                }
            });
        },

        postNewComment: function (userId, postId, e) {
            var that = this,
                commentContainer = $("#commentContainer-" + postId),
                commentHtml = "";
            var sessionId = this.model.collection.session.id;
            var commentRenderer = Handlebars.compile(postCommentsTemplate);
            var comment = $("#" + e.target.id);
            $.ajax({
                type: 'POST',
                data: {
                    user_id: userId,
                    content: comment.val(),
                    post_id: postId
                },

                url: this.config.endPoints.postComment,
                dataType: 'json',
                success: function (data) {
                    //console.log(data);
                    $("#" + e.currentTarget.id).val("");

                    data.sessionId = sessionId;
                    commentHtml = commentRenderer(data);
                    commentContainer.append(commentHtml);
                    $("#comment-" + data.id).hide().fadeIn(1000);
                    $("#comments-" + postId).show().fadeIn(1000);
                    $("#" + e.target.id).hide().fadeOut(1000);
                }
            });
        },

        getPostComments: function (postId, limit) {
            var commentRenderer = Handlebars.compile(postCommentsTemplate)

            var gruopId = this.model.get("group_id");
            var masterHtml = "";
            var sessionId = this.model.collection.session.id;
            var that = this;
            $.ajax({
                type: 'GET',
                data: $.param({ postid: postId, limit: limit, groupid: gruopId}),
                url: this.config.endPoints.getComments,

                dataType: 'json',
                success: function (data) {
                    var sizeOfPosts = data.length;
                    for (var i = 0; i < sizeOfPosts; i++) {
                        data[i].sessionId = sessionId;
                        masterHtml += commentRenderer(data[i]);
                    }
                    $("#commentContainer-" + postId).append(masterHtml);

                    $('[id^=commentCell]').on('change', 'textarea', function (e) {
                        $(this).height(0).height(this.scrollHeight);
                    }).find('textarea').change();

                    //show input box for posts that have comments
                    if (sizeOfPosts > 0) {
                        //$("#comments-" + postId).hide();
                        //$("#post-" + postId).switchClass("hideme", "showme", 1000, "easeInOutQuad");
                        that.model.set('numberOfComments', sizeOfPosts);
                        $('#more-post-' + postId).css('display', 'block');
                    }
                }
            });
        },

        edit: function () {
            var comment = $("#postContentHolder-" + this.model.id);
            var saveButton = $("#saveEditPost-" + this.model.id);
            comment.removeAttr("readonly");

            comment.css("background-color", "#f4f1f0");

            saveButton.removeClass('saveEditCommentButtonDefaultState');
        },

        deletePost: function () {
            var post_id = this.model.get("id");
            if (post_id) {
                this.model.fetch({ data: $.param({ id: post_id }),
                    type: 'delete',
                    success: _.bind(function () {
                        this.model.trigger('saved');
                        this.model.collection.remove(this.model);
                        $('.close-reveal-modal').click();
                    }, this),
                    error: _.bind(function (model, response) {
                        //  var message = response.responseText;
                        // this.showMessage(this.model, message);
                    }, this)
                }, null);
            } else {
                //  this.showMessage(this.model, 'You must insert event first');
            }
        },

        moreComments: function (e) {
            var userId = this.model.collection.session.id;
            var post_id = e.currentTarget.id.split('-')[2];
            $('#commentContainer-' + post_id).html('');
            var limit = this.model.get('numberOfComments') + 5;
            this.getPostComments(post_id, limit, null);
        },

        savePost: function () {
            $(".inputPostOnLoad").attr('readonly', true);

            //this.message.close();
            this.model.set('content', $("#postContentHolder-" + this.model.id).val())
            this.model.save(null, {
                success: _.bind(function () {

                    var comment = $("#postContentHolder-" + this.model.id);
                    var saveButton = $("#saveEditPost-" + this.model.id);
                    saveButton.addClass("saveEditCommentButtonDefaultState");
                    comment.addClass("inputPostOnLoad");
                    comment.css("background-color", "#ffffff");
                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseText;
                    this.showMessage(this.model, message);
                }, this)
            });
        }
    });
    return PostItemView;
});




