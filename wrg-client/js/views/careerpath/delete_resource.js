/**
 * Created by semir.sabic on 28.4.2014.
 */
define(['marionette',
        'text!templates/careerpath/delete_resource.html',
        'models/careerpath/careerpath_resource',
        'views/error_message_view'],
    function (Marionette, Template, ExperienceModel, ErrorMessageView) {
        "use strict";

        var DeleteView = Marionette.Layout.extend({
            template: Template,

            regions: {
                message: '.error-messages'
            },

            events: {
                'click .confirm-delete': 'onDelete'
            },

            triggers: {
                'click .cancel-delete': 'closeModal',
                'click .close-reveal-modal': 'closeModal'
            },

            initialize: function (options) {
                this.listenToOnce(this.model, 'error', this.showMessage);
                this.listenToOnce(this.model, 'sync', this.close);
            },

            onDelete: function () {
                this.collection.remove(this.model);
                this.model.destroy();
            },

            close: function () {
                this.trigger('closeModal');
            },

            showMessage: function (model, xhr, options) {
                var msg = '';

                if (xhr.status === 500) {
                    msg = 'An error occur while trying to delete the resource, try again later.';
                }
                this.message.show(new ErrorMessageView({message: msg}));
            }
        });
        return DeleteView;
    }
);