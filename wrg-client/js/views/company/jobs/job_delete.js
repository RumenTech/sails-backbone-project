/**
 * Created by semir.sabic on 3/11/14.
 */
define(['marionette',
        'text!templates/company/jobs/job_delete.html',
        'models/company/job',
        'views/error_message_view'],
    function (Marionette, JobDeleteHtml, JobModel, ErrorMessageView) {
        "use strict";

        var DeleteView = Marionette.Layout.extend({
            template: JobDeleteHtml,
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
                var msg = '';

                switch (xhr.status) {
                    case 404:
                        msg = 'The experience does not longer exist.';
                        break;

                    case 500:
                        msg = 'An error occur while trying to delete. Try again later.';
                        break;
                }
                this.message.show(new ErrorMessageView({message: msg}));
            }
        });
        return DeleteView;
    }
);
