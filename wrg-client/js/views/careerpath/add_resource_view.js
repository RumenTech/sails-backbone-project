/**
 * Created by semir.sabic on 22.4.2014.
 */
define([
    'marionette',
    'text!templates/careerpath/add_resource.html',
    'lib/backbone.modelbinder',
    'models/careerpath/careerpath_resource',
    'views/error_message_view',
    'utils/conversionUtils'
], function (Marionette, Template, ModelBinder, Resource, ErrorMessageView, ConversionUtils) {
    "use strict";

    var AddResourceView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click #saveResource': 'save'
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        bindings: {
            'cp_tab_category_id': '#resCategory',
            'title': '#resTitle',
            'content': '#resDescription'
        },

        initialize: function (params) {
            this.modelBinder = new ModelBinder();
            if (params.data) {
                this.collection = params.data.models;
            } else {
                this.collection = [];
                this.collection.push('Category');
                this.editable = true;
            }
            this.reqres = params.reqres;
            if (!this.model) {
                this.model = new Resource(null, params);
                this.reqres = params.reqres;
                this.config = this.reqres.request('config');
            }

            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        onShow: function () {
            if (this.editable) {
                $('#resCategory').prop("readOnly", true);
                var select = document.getElementById('resCategory');
                select.length = 0;
                select.options.add(new Option('Category', 0));
            } else {
                ConversionUtils.insertCategories(this.collection, 'resCategory', 'Resource Category');
            }
        },

        save: function () {
            var session = this.reqres.request('session');
            this.model.set('user_id', session.id);
            this.model.save(null, {
                success: _.bind(function () {
                    this.model.trigger('saved');
                    $('[catid=' + this.model.get('cp_tab_category_id') + ']').click();
                    $('.close-reveal-modal').click();
                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseText;
                    this.showMessage(this.model, message);
                }, this)
            });
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({ message: message }));
        }
    });
    return AddResourceView;
});
