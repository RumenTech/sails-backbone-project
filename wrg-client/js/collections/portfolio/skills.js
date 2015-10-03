define([
    'backbone',
    'models/portfolio/skill',
    'models/portfolio/skills_wrapper'
], function(Backbone, Skill, SkillsWrapper ) {

    var SkillsCollection = Backbone.Collection.extend({
        model: Skill,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');


            this.fetch({
                success: _.bind(function() {
                    this.trigger('loaded');
                }, this)
            });

        },

        parse: function(response) {
            return response;
        },


        save : function() {
            var skillsWrapper = new SkillsWrapper(null, this.reqres);
            skillsWrapper.set('skills', this.toJSON());

            return skillsWrapper.save(null, {
                success: _.bind(function() {

                    return [];

                }, this),
                error: _.bind(function(model, response) {
                    return response;
                }, this)
            });

        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/skill/findSkills';
        }
    });

    return SkillsCollection;
});


