define([
    'marionette',
    'text!templates/alumni/portfolio/edit/skills_form.html',
    'lib/backbone.modelbinder',
    'collections/professional/skills',
    'views/error_message_view',
    'utils/eventValidation'
], function (Marionette, Template, ModelBinder, Skills, ErrorMessageView, validationRules) {
    "use strict";

    var SkillsFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button': 'save',
            'change .validator': function (e) {
                validationRules.validatorEngine(e);
            }
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal, .save-button': 'closeModal'
        },

        onRender: function () {
            this.collection.each(function (skill, index) {
                var nameSelector = '#name-' + index;
                var rankSelector = '#ranking-' + index;
                this.$(nameSelector).val(skill.get('name'));
                this.$(rankSelector).val(skill.get('proficiency_level'));
            }, this);
        },

        save: function () {
            this.$('.save-button').attr("disabled", true);
            var newSkills = [];
            _.each(_.range(0, 10), function (index) {
                var name = this.$('#name-' + index).val();
                var rank = this.$('#ranking-' + index).val();
                if (name && rank) {
                    if (($.trim(name)).length === 0) {
                        // TODO: not allow saving, show error message?
                        this.showMessage('You cannot save empty skill name');
                    }
                    else {
                        newSkills.push({name: name, proficiency_level: rank});
                    }
                }
            }, this);

            this.collection.reset(newSkills);

            this.collection.save({
                success: _.bind(function () {
                    this.collection.trigger('saved');
                }, this),
                error: _.bind(function () {
                    // TODO: Replace with an error message
                    this.collection.trigger('saved');
                    this.$('.save-button').removeAttr("disabled");
                }, this)
            });
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });

    return SkillsFormView;
});