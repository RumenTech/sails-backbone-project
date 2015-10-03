define([
    'marionette',
    'text!templates/alumni/portfolio/experience_points.html',
    'models/professional/ranking',
    'utils/conversionUtils'
], function (Marionette, Template, Model, ConversionUtils) {
    "use strict";

    var ExperiencePointsView = Marionette.ItemView.extend({
        template: Template,
        initialize: function (params) {
            var calculatedValue,
                inlineStyle;

            this.model = new Model();
            this.ranking = ConversionUtils.calculateProfessionalPoints(params.data);

            for (var i = 0; i < this.ranking.length; i++) {
                if (this.ranking[i] < 7) {
                    calculatedValue = this.ranking[i] * 11 + '%'; //Fix for Internet explorer all browsers.
                    //IE cant render "style" HTML attribute properly, therefore it is served as a model property
                    inlineStyle = "style=width:" + calculatedValue + ";";

                    this.model.set('percent_' + i, inlineStyle);
                    this.model.set('number_' + i, this.ranking[i]);
                } else {
                    inlineStyle = "style=width:" + "88%;";
                    this.model.set('percent_' + i, inlineStyle);
                    this.model.set('number_' + i, this.ranking[i] + "+");
                }
            }
        }
    });

    return ExperiencePointsView;
});