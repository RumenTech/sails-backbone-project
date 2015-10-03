define([
    'marionette',
    'text!templates/company/candidate.html',
    'views/company/edit/candidate_form_view'
], function (Marionette, Template, FormView) {
    "use strict";

    var ExperienceItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        attributes: function () {
            return {
                'class': this.model.get('item_class'),
                'id': "li" + this.model.get('id')
            };
        },

        events: {
            'click .icon-edit.tip-top': 'edit'
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

            this.reducePositionSizeOnUI();
        },

        reducePositionSizeOnUI: function () {
            var position = this.model.get('position');

            if (position !== null && position !== undefined) {
                var positionStrings = position.split(" "),
                    reducedPosition = '';
                for (var i = 0; i < positionStrings.length; i++) {
                    if (positionStrings[i].length > 18) {
                        positionStrings[i] = positionStrings[i].slice(0, 15) + '...';
                    }
                    reducedPosition += positionStrings[i] + " ";
                }
                this.model.set('reducedPosition', reducedPosition);
            }
        },

        onRender: function () {
            $("#li" + this.model.attributes.id).empty();
            $("#li" + this.model.attributes.id).append(this.el.innerHTML);
            $('#descriptionDiv').empty();
            $('#descriptionDiv').append($('#descriptiondiv' + this.model.get('id')).html());
        },

        afterRender: function () {
            $("#li" + this.model.attributes.id).empty();
            $("#li" + this.model.attributes.id).append(this.el.innerHTML);
            $('#descriptionDiv').empty();
            $('#descriptionDiv').append($('#descriptiondiv' + this.model.get('id')).html());
        },
        beforeRender: function () {
            if (this.model.get('first')) {
                $('#descriptionDiv').html($('#descriptiondiv' + this.model.get('id')).html());
            }
        },

        edit: function () {
            this.trigger('showModal', FormView);
        }
    });
    return ExperienceItemView;
});
