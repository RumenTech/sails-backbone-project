define(['marionette',
        'text!templates/alumni/portfolio/award_delete.html',
        'models/professional/award',
        'views/error_message_view'],
    function (Marionette, ExperienceDeleteHtml, ExperienceModel, ErrorMessageView) {
        "use strict";

        var DeleteView = Marionette.Layout.extend({
            template: ExperienceDeleteHtml,
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
                this.model.destroy();
            },

            close: function () {
                this.trigger('closeModal');
            },

            showMessage: function (model, xhr, options) {
                var msg = "";

                switch (xhr.status) {
                    case 404:
                        msg = "The award does not longer exist.";
                        break;

                    case 500:
                        msg = "An error occur while trying to delete the award, try again later.";
                        break;
                }

                this.message.show(new ErrorMessageView({message: msg}));
            }
        });
        return DeleteView;
    }
);