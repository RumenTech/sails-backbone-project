define([
    'marionette',
    'text!templates/groups/basic_information.html',
    'models/groups/basic_information_group',
    'views/groups/edit/basic_information_group_view',
    'regions/modal_region'
], function (Marionette, Template, BasicInformation, EditInformationView, ModalRegion) {
    "use strict";

    var BasicInformationGroupView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion
        },

        events: {
            'click #editBasicInformation': 'editBasicInformation'
        },

        initialize: function (options) {
            this.reqres = options.reqres;
            this.session = this.reqres.request('session');
            this.model = new BasicInformation(options.group_id, options);
            this.config = this.reqres.request('config');
            if (options.role === 'admin' || options.role === 'moderator') {
                this.model.set('role', options.role);
            }
            this.listenTo(this.model, 'loaded', this.render, this);
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        editBasicInformation: function () {
            var options = {
                model: this.model,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new EditInformationView({model: this.model, reqres: this.reqres}, options));
            this.listenTo(this.modal.currentView, 'saved', this.update, this);
        },

        onLoaded: function () {
            $("#pageloader").fadeIn(300).delay(this.config.spinnerTimeout).fadeOut(300);
        },

        update: function () {
            var groupId = document.location.href.split('/');
            var length = groupId.length;
            groupId = groupId[length - 1];
            var options = {};
            options.reqres = this.reqres;
            this.model = new BasicInformation(groupId, options);
            this.model.set('role', 'admin');
            this.model.on('loaded', this.render, this);
        }
    });
    return BasicInformationGroupView;
});



