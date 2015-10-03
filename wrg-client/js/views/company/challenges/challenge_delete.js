define(['marionette',
        'text!templates/company/challenges/challenge_delete.html',
        'models/company/challenge',
        'views/error_message_view'],
    function (Marionette, ChallengeDeleteHtml, ChallengeModel, ErrorMessageView) {
        "use strict";

        var DeleteView = Marionette.Layout.extend({
            template: ChallengeDeleteHtml,
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

                /* var challenge_id = this.model.get("id");
                 if(challenge_id) {
                 this.model.fetch({ data: $.param({ id: challenge_id }),
                 type: 'delete',
                 success: _.bind(function() {
                 this.model.trigger('saved');
                 this.model.collection.remove(this.model);
                 $('.close-reveal-modal').click();
                 }, this),
                 error: _.bind(function(model, response) {
                 var message = response.responseText;
                 this.showMessage(this.model, message);
                 }, this)
                 }, null);
                 } else {
                 this.showMessage(this.model, 'You must insert challenge first');
                 }*/
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