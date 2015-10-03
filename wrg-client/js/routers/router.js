define([
	'marionette',
	'controllers/route_controller'
], function(Marionette, RouteController) {

	var Router = Marionette.AppRouter.extend({
		appRoutes: {
			'': 			          'home',
			'about': 		          'about',
			'alumni':                 'alumni',
            'success_stories/:query': 'alumni',
			'contact': 		          'contact',
            'news':                   'news',
            'companies':              'companies',
			'friends/:query': 	      'friends',
			'home': 	    	      'home',
			'logout': 		          'logout',
			'portfolio':    	      'portfolio',
            'portfolio_new':   	      'portfolio_new',
            'company': 	              'company',
            'jobs': 	              'jobs',
            'talent': 	              'talent',
            'college': 	              'college',
			'settings': 	          'settings',
            'find_companies':         'find_companies',
            'reporting':              'reporting',
            'jobs_student' :          'jobs_student',
            'messages': 	          'messages',
            'find_groups/:query':     'find_groups',
            'group/:id':              'group',
            'group_readonly/:id':     'group_readonly',
            'job/:id':                'job',
            'job_student/:id':        'job_student',
            'student/:id':            'student',
            'alumni_user/:id':        'alumni_user',
            'challenges': 	          'challenges',
            'challenge/:id':          'challenge',
            'challenges_student' :    'challenges_student',
            'challenge_student/:id':  'challenge_student',
            'challenge_dashboard/:id':  'challenge_dashboard',
            'alumni_portfolio':       'alumni_portfolio',
            'company/:id':            'companyProfile',
            'find_colleges':          'find_colleges',
            'college/:id':            'collegeProfile',
            'admin':                  'admin',
            'users':                  'users',
            'leaderboard': 	          'leaderboard',
            'career_path':            'careerPath',
            'feed':                   'feed',
            'admin_career_path':      'adminCareerPath',
            'dashboard':              'dashboard',
            'point_of_light':         'pointoflight'
		},

		initialize: function(params) {
			// Instantiating controller here since the Marionette.Router doesn't
			// do this on its own.
			this.controller = new RouteController(params);
            this.bind('route', this.pageView);
        },

        pageView : function(){
            var url = Backbone.history.getFragment();

            if (!/^\//.test(url) && url != "")
            {
                url = "/" + url;
            }

            if(! _.isUndefined(_gaq)){
                _gaq.push(['_trackPageview', url]);
            }
        }
	});

	return Router;
});