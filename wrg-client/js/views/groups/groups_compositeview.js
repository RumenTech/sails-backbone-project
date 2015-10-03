define([
    'marionette',
    'text!templates/groups/groups.html',
    'views/groups/group_itemview',
    'views/groups/edit/add_group_form_view'

], function (Marionette, Template, ItemView, FormView) {
    "use strict";

    var GroupsCollectionView = Marionette.CompositeView.extend({
        template: Template,
        itemViewContainer: '.company-list.group-list',
        itemView: ItemView,

        initialize: function (params) {
            this.collection = params.data;
            //Scroll event
            _.bindAll(this, "checkScroll");
            $(window).scroll(this.checkScroll);
        },

        events: {
            'click #new-group': 'newGroup',
            'click .load_groups': 'moreGroups'
        },

        checkScroll: function () {
            if ($(window).scrollTop() === $(document).height() - $(window).height()) {
                this.moreGroups();
            }
        },

        newGroup: function () {
            this.trigger('showModal', this, FormView, this.collection);
        },

        moreGroups: function () {
            this.result_length = this.collection.length;
            this.collection.fetch({
                data: $.param({
                    name: $('#groupname').val(),
                    limit: this.collection.length + 5
                }),
                success: _.bind(function () {
                    if (this.collection.length === this.result_length) {
                        $('.load_groups').html('No more groups found');
                    }
                }, this)
            });
        }
    });
    return GroupsCollectionView;
});



