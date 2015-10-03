define([
    'marionette',
    'text!templates/college/candidate.html',
    'views/college/edit/candidate_form_view'
], function (Marionette, Template, FormView) {
    "use strict";

    var CandidateItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        events: {
            'click .icon-edit.tip-top': 'editCandidate'
        },

        initialize: function () {
            this.model.on('saved', this.render, this);
            _.bindAll(this, 'beforeRender', 'render', 'afterRender');
            var _this = this;
            this.render = _.wrap(this.render, function (render) {
                _this.beforeRender();
                render();
                _this.afterRender();
                return _this;
            });
        },

        onRender: function () {
            if (this.model.changed[0] !== undefined) {
                $('#descriptionDiv').html("");
            }
            if (this.model.get('first')) {
                $('#descriptionDiv').html($('#descriptiondiv' + this.model.get('id')).html());
            }
        },

        afterRender: function () {
            if (this.model.get('first')) {
                $('#descriptionDiv').html($('#descriptiondiv' + this.model.get('id')).html());
            }
        },

        beforeRender: function () {
            if (this.model.get('first')) {
                $('#descriptionDiv').html($('#descriptiondiv' + this.model.get('id')).html());
            }
        },

        editCandidate: function () {
            this.trigger('showModal', FormView);
        }
    });
    return CandidateItemView;
});
