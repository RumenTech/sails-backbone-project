define([
    'marionette',
    'text!templates/admin/users.html',
    'views/admin/user_itemview',
    'views/admin/mass_email',
    'utils/conversionUtils'
], function (Marionette, Template, ItemView, EmailForm, ConversionUtils) {
    "use strict";

    var UsersCollectionView = Marionette.CompositeView.extend({
        template: Template,

        itemView: ItemView,

        itemViewContainer: '.company-list.company-list',

        events: {
            'click .icon-delete': 'deleteUser',
            'click .load_users': 'moreUsers',
            'click #exportXls': 'exportXls',
            'click #summaryView': 'summaryView',
            'click #emailView': 'sendEmail',
            'click #detailedView': function () {
                this.detailedView(null);
            },
            'click #all-link': function () {
                this.detailedView(null);
            },
            'click #alumni': function (e) {
                this.filter(e, 'alumni');
            },
            'click #student': function (e) {
                this.filter(e, 'student');
            },
            'click #company': function (e) {
                this.filter(e, 'company');
            },
            'click #college': function (e) {
                this.filter(e, 'college');
            }
        },

        initialize: function (params) {
            this.collection = params.collection;
            this.model = new Backbone.Model();
            this.config = params.reqres.request('config');
        },

        moreUsers: function () {
            var that = this;
            this.result_length = this.collection.length;
            this.collection.fetch({
                    data: $.param({
                        export: false,
                        limit: this.collection.length + 100
                    }),
                    success: _.bind(function () {
                        for (var i = 0; i < that.collection.length; i++) {
                            this.collection.models[i].attributes.ordinal = i + 1;
                        }
                        that.render();
                        if (that.collection.length === this.result_length) {
                            $('.load_users').html('No more users found');
                        }
                    }, this)}
            );
        },

        filter: function (e, role) {
            e.preventDefault();
            this.detailedView(role);
        },

        detailedView: function (role) {
            var that = this;
            this.result_length = this.collection.length;
            this.collection.fetch({
                    data: $.param({
                        export: false,
                        limit: 100,
                        role: role
                    }),
                    success: _.bind(function () {
                        for (var i = 0; i < that.collection.length; i++) {
                            that.collection.models[i].attributes.ordinal = i + 1;
                        }
                        that.model.unset('count');
                        that.render();
                        $('#detailedView').css('font-weight', 'bold');
                    }, this)}
            );
        },

        exportXls: function () {
            $.ajax({
                type: 'get',
                url: this.config.restUrl + '/dbparser/detailView',
                dataType: 'json',
                success: function (data) {
                    window.location = data.url;
                },
                error: function (err) {
                    //TODO What do we do with the error object?
                }
            });
        },

        summaryView: function () {
            var that = this;
            this.collection.fetch({
                type: 'get',
                url: this.config.restUrl + '/dbparser/summaryView',
                dataType: 'json',
                success: function (data) {
                    that.model.set('count', 'count');
                    that.render();
                    $('#summaryView').css('font-weight', 'bold');
                },
                error: function (err) {
                    //TODO What do we do with the error object?
                }
            });
        },

        sendEmail: function () {
            this.trigger('showModal', EmailForm);
        },

        deleteUser: function (e) {
            var config = window.wrgSettings.currentConfig;
            var userId = ConversionUtils.returnInteger(e.currentTarget.id);
            var that = this;
            var modelForDeletion = this.collection.where({'id': userId});

            $("#delete-user-dialog").dialog({
                show: {
                    effect: "drop",
                    duration: 300
                },
                hide: {
                    effect: "drop",
                    duration: 300
                },
                width: 600,
                height: 200,
                resizable: false,
                draggable: false,
                modal: true,
                buttons: {
                    "Delete User": function () {
                        $(this).dialog("close");
                        $.ajax({
                            type: 'GET',
                            data: {
                                userId: userId,
                                user: 'administrator',
                                pass: 'supersecretwrgpass'
                            },
                            url: config.endPoints.deleteUser,
                            success: function () {
                                that.collection.remove(that.collection.where({'id': userId}));
                            }
                        });
                    },
                    "Cancel": function () {
                        $(this).dialog("close");
                    }
                },
                open: function () {
                    $("#delete-user-dialog").html("Are you sure you want to permanently delete: " + modelForDeletion[0].attributes.email + "(" + modelForDeletion[0].attributes.first_name + " " + modelForDeletion[0].attributes.last_name + ")");
                }
            });
        }
    });

    return UsersCollectionView;
});
