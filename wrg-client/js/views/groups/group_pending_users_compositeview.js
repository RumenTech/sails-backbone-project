define([
    'marionette',
    'text!templates/groups/group_pending_users.html',
    'views/groups/group_pending_user_itemview',
    'collections/groups/group_users',
    'utils/conversionUtils',
    'utils/htmlRenderer'

], function (Marionette, Template, ItemView, UsersCollection, conversionHelpers, htmlRenderer) {
    "use strict";

    var GroupUsersCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '#groupPendingImages',

        events: {
            'click .userPending': function (e) {
                this.userResolver(e);
            },
            'mouseover .userPending': function (e) {
                var myId = e.currentTarget.id;
                $("#" + myId).css({ opacity: 0.5 });  //TODO Fix fade in of image itself!!!
            },
            'mouseleave .userPending': function (e) {
                var myId = e.currentTarget.id;
                $("#" + myId).css({ opacity: 1 });
            }
        },

        initialize: function (params) {
            this.role = params.role;
            this.collection = new UsersCollection(params.data, params);
            this.model = new Backbone.Model();

            var pendingUsersNumber = this.numberOfPendingUsers();
            this.model.set('pendingUsersNumber', pendingUsersNumber);
            this.listenTo(this.model, 'loaded', this.render, this);
        },

        numberOfPendingUsers: function () {
            var pendingUsersNumber = 0;
            this.collection.models.forEach(function (users) {
                if (users.get('status') === 'pending') {
                    pendingUsersNumber++;
                }
            });
            return pendingUsersNumber;
        },

        userResolver: function (e) {
            var domUserId = conversionHelpers.returnInteger(e.currentTarget.id.split('-')[0], "Problem while converting number");      // Gets user_id as seen in users table
            var collectionNumber = 0,
                that = this;

            for (var i = 0; i < this.collection.length; i++) {

                var tempModelValue = this.collection.models[i];
                if (tempModelValue.attributes.user_id === domUserId) {
                    collectionNumber = i;
                }
            }
            //Call modal here
            $("#dialog").dialog({
                show: {
                    effect: "drop",
                    duration: 300
                },
                hide: {
                    effect: "drop",
                    duration: 300
                },

                width: 500,
                height: 400,
                resizable: false,
                draggable: false,
                modal: true,
                buttons: {
                    "Add Member": function () {
                        var pendingUsersNumber = that.numberOfPendingUsers() - 1;
                        that.model.set('pendingUsersNumber', pendingUsersNumber);
                        that.model.trigger('loaded');
                        $("#dialog").html();
                        $(this).dialog("close");
                        //Promote the user to a member
                        that.collection.models[collectionNumber].attributes.status = 'approved';
                        that.collection.models[collectionNumber].attributes.role = 'member';

                        var current = $("#" + e.currentTarget.id);
                        var prependToDiv = $('#groupImages');

                        current.fadeOut(600).animate({
                            top: -300,
                            left: -200
                        }, 1000, function () {
                            current.prependTo(prependToDiv).css({
                                top: 'auto',
                                left: 'auto'
                            });
                        });
                        current.fadeIn(600);
                        that.save(collectionNumber);
                    },
                    "Delete Request": function () {
                        var pendingUsersNumber = that.numberOfPendingUsers() - 1;
                        that.model.set('pendingUsersNumber', pendingUsersNumber);
                        that.model.trigger('loaded');
                        $("#dialog").html();
                        $(this).dialog("close");
                        that.deleteCollection(collectionNumber);
                    },
                    "Cancel": function () {
                        $("#dialog").html();
                        $(this).dialog("close");
                    }
                },
                open: function () {
                    $("#dialog").html("");

                    var userImage = e.currentTarget.lastElementChild.src;   //pure image url
                    var userName = e.currentTarget.title;
                    var userDetails = htmlRenderer.dialogPendingMember(userName, userImage);

                    $("#dialog").append(userDetails);

                    $('button').eq(0).attr('title', 'Cancel');
                    $('button').eq(1).attr('title', 'Add a member to your group.');
                    $('button').eq(2).attr('title', 'Delete this request permanently.');
                    $('button').eq(3).attr('title', 'Cancel');
                }
            });
        },

        onShow: function () {
        },

        save: function (index) {
            this.collection.models[index].save(null, {
                success: _.bind(function () {

                }, this),
                error: _.bind(function (model, response) {

                    var message = response.responseJSON.message;
                }, this)
            });
        },

        deleteCollection: function (index) {
            this.collection.models[index].destroy(
                { data: $.param({
                    id: this.collection.models[index].get('id'),
                    groupId: this.collection.models[index].get('group_id')
                }),
                    success: _.bind(function () {
                        this.collection.remove(this.collection.at(index));

                    }, this),
                    error: _.bind(function (model, response) {

                        var message = response;
                    }, this)
                });
        }
    });
    return GroupUsersCollectionView;
});
