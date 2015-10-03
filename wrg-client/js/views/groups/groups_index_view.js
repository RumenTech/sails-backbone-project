define([
    'marionette',
    'text!templates/groups/groups_index.html',
    'regions/modal_region',
    'views/groups/groups_compositeview',
    'views/groups/filter_form_view',
    'collections/groups/groups',
    'views/groups/edit/add_group_form_view'
], function (Marionette, Template, ModalRegion, GroupsCompositeView, FilterFormView, GroupsCollection, FormView) {
    "use strict";

    var GroupsIndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion,
            groupsResult: '#groups-result',
            filterForm: '#filter-form-section'
        },

        events: {
            'click #new-group': 'newGroup'
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.session = this.reqres.request('session');
            this.groups = new GroupsCollection(options.data, options);
            this.config = this.reqres.request('config');
            this.listenTo(this.groups, 'loaded', this.onLoaded, this);
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        onLoaded: function () {
            $("#pageloader").fadeIn(this.config.spinnerTimeout).delay(this.config.spinnerTimeout).fadeOut(this.config.spinnerTimeout);
            this.filterForm.show(new FilterFormView({
                reqres: this.reqres,
                collection: null
            }));

            this.groupsResult.show(new GroupsCompositeView({
                reqres: this.reqres,
                data: this.groups
            }));

            this.listenTo(this.filterForm.currentView, 'filter', this.onFilter, this);
            $("#searchGroups").click();
            this.listenTo(this.filterForm.currentView, 'filterMyGroups', this.onFilterMyGroups, this);
            this.listenTo(this.filterForm.currentView, 'filterPendingGroups', this.onFilterPendingGroups, this);
            this.listenTo(this.groupsResult.currentView, 'showModal itemview:showModal', this.showModal, this);
        },

        onFilter: function (view, model) {
            this.groups.reset();
            this.groups.fetch({
                data: $.param({ name: model.get('groupName')})
            });

            this.groupsResult.close();
            this.groupsResult.show(new GroupsCompositeView({
                reqres: this.reqres,
                data: this.groups
            }));
        },

        onFilterMyGroups: function (view, model) {
            this.groups.reset();
            this.groups.fetch({
                url: this.config.endPoints.usersGroups
            });

            this.groupsResult.close();
            this.groupsResult.show(new GroupsCompositeView({
                reqres: this.reqres,
                data: this.groups
            }));
        },

        onFilterPendingGroups: function (view, model) {
            this.groups.reset();
            this.groups.fetch({
                url: this.config.endPoints.userPendingGroups
            });

            this.groupsResult.close();
            this.groupsResult.show(new GroupsCompositeView({
                reqres: this.reqres,
                data: this.groups
            }));
        },

        newGroup: function (e) {
            e.preventDefault();
            var options = {
                collection: this.groups,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new FormView({model: this.model, collection: this.groups, reqres: this.reqres}, options));
            this.listenTo(this.modal.currentView, 'saved', this.update, this);
        },

        showModal: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.groups,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({reqres: this.reqres}, options));
        }
    });
    return GroupsIndexView;
});



