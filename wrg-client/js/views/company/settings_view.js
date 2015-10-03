define([
    'marionette',
    'views/company/settings_compositeview',
    'text!templates/company/settings.html',
    'regions/modal_region',
    'collections/company/users',
    'models/company',
    'views/error_message_view',
    'views/upgrade'
], function (Marionette, UsersCompositeView, Template, ModalRegion, UsersCollection, Company, ErrorMessageView, UpgradeView) {
    "use strict";

    var IndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion,
            users: '#user-section',
            message: '.validation-messages'
        },

        events: {
            'click #editcompany-name': function () {
                this.edit('company-name');
            },
            'click #editcompany-size': function () {
                this.edit('company-size');
            },
            'click #editcompany-accounttype': function () {
                this.show_how_upgrade();
            },
            'click #savecompany-name, #savecompany-size, #savecompany-accounttype': 'save',
            'click .field': 'addColor'
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.model = new Company(null, options);
            this.listenTo(this.model, 'invalid', this.showMessage, this);
            this.model.on('saved', this.render, this);
            this.model.on('loaded', this.render, this);

            $("#pageloader").fadeIn(100).delay(300).fadeOut(100);
            this.listenTo(this.model, 'loaded', this.loadCollection, this);
        },
        loadCollection: function () {
            this.collection = new UsersCollection(null, {vent: this.vent, reqres: this.reqres});
            this.collection.fetch({
                success: _.bind(function () {
                    this.onLoaded();
                }, this)
            });
        },
        edit: function (idElement) {
            $('#span' + idElement).css("display", "none");
            $('#input' + idElement).css("display", "");
            $('#edit' + idElement).css("display", "none");
            $('#save' + idElement).css("display", "");
        },
        show_how_upgrade: function () {
            this.modal.show(new UpgradeView({message: 'WE NEED TELL TO BRIAN'}));
        },
        save: function () {
            this.message.close();
            this.model.set({
                name: $('#inputcompany-name').val(),
                company_size: $('#inputcompany-size').val(),
                account_type: $('#inputcompany-accounttype').val()});
            this.model.save(null, {
                success: _.bind(function () {
                    this.model.trigger('saved');
                    //$('.close-reveal-modal').click();
                    this.trigger('saved', this.model);
                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseJSON.message;
                    this.showMessage(this.model, message);
                }, this)
            });
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
            this.onLoaded();
        },

        onLoaded: function () {
            this.users.show(new UsersCompositeView({
                reqres: this.reqres,
                data: this.collection
            }));
            //this.listenTo(this.users.currentView, 'showModal', this.showModal, this);
            this.listenTo(this.users.currentView, 'showModal itemview:showModal', this.showModal, this);
        },

        showModal: function (view, formClass, collection) {
            var options = {
                model: view.model,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({model: view.model, collection: this.collection, reqres: this.reqres}, options));
            this.listenTo(this.modal.currentView, 'saved', this.update, this);
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });

    return IndexView;
});
