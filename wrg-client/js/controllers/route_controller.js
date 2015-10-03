"use strict";


define([
    'marionette',
    'wreqr',
    'models/session',
    'models/logout'
], function(
    Marionette,
    Wreqr,
    Session,
    Logout
    ) {

    var RouteController = Marionette.Controller.extend({
        isHome : false,
        isLoggedIn: false,
        initialize: function(params) {
            this.isHome = false;
            this.vent = params.vent;
            this.reqres = params.reqres;

            // Wrapping these in an object to conveniently pass to views.
            this.eventObjects = {
                vent: this.vent,
                reqres: this.reqres
            };
            this.isLoggedIn  = this.reqres.request('session');
            //Find the session.
            this.model = new Session(null, params);
            this.vent.on('login:success', _.bind(this.onLogin, this));
            this.vent.on('login:redirect', _.bind(this.onRedirect, this));
        },

        /**
         * Route handlers
         */

        about: function() {
            var that = this;
            requirejs(['views/home/about_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        feed: function() {
            var that = this;
            requirejs(['views/feed/feed_index_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        dashboard: function() {
            var that = this;
            requirejs(['views/dashboard/index_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        alumni: function() {
            var that = this;

            requirejs(['views/alumni/index_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        alumni_portfolio: function() {
            var that = this;

            requirejs(['views/alumni/portfolio/portfolio_index_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        success_stories: function() {
            var that = this;

            requirejs(['views/alumni/index_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        careerPath: function() {
            var that = this;

            requirejs(['views/careerpath/index_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        adminCareerPath: function() {
            var that = this;

            requirejs(['views/admin/careerpath_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        alumni_user: function() {
            var that = this;
            requirejs(['views/readonly/alumni'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        student: function() {
            var that = this;
            requirejs(['views/readonly/student'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        contact: function() {
            var that = this;
            requirejs(['views/home/contact_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        news: function() {
            var that = this;
            requirejs(['views/home/news_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        companies: function() {
            var that = this;
            requirejs(['views/home/companies_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        friends: function() {
            var that = this;

            requirejs(['views/findfriends/index_view'], function(View) {
                var method  = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        find_companies: function() {
            var that = this;

            requirejs(['views/findcompanies/index_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        find_colleges: function() {
            var that = this;

            requirejs(['views/findcolleges/index_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        collegeProfile: function() {
            var that = this;

            requirejs(['views/findcolleges/college_profile_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        find_groups: function() {
            var that = this;

            requirejs(['views/groups/groups_index_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        jobs: function() {
            var that = this;
            requirejs(['views/company/jobs/jobs_index_view'], function(View){
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        job: function() {
            var that = this;
            requirejs(['views/company/jobs/job_details_view'], function(View){
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        jobs_student: function() {
            var that = this;
            requirejs(['views/portfolio/jobs/jobs_index_view'], function(View){
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        job_student: function() {
            var that = this;
            requirejs(['views/portfolio/jobs/job_details_view'], function(View){
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        messages: function() {
            var that = this;

            requirejs(['views/messages/messages_index_view'], function(View){
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        home: function() {
            var that = this;
            that.isHome = true;
            requirejs(['views/home/index_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, false);
            });

        },

        //--------------------------------------------------- ADMIN ----------------------------------------------------

        admin: function () {
            var that = this;

            requirejs(['views/admin/index_view'], function (View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        users: function () {
            var that = this;

            requirejs(['views/admin/users_view'], function (View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        //--------------------------------------------------------------------------------------------------------------

        logout: function() {
            var logout = new Logout(null, this.eventObjects);
            logout.fetch({
                success: _.bind(function() {
                    //console.log("Logout succeeded.");
                    this.reqres.setHandler('session', _.bind(function() {
                        return null;
                    }, this));
                    this.model.fetch({
                        success: _.bind(function() {
                            this.isLoggedIn = false;
                            //window.location = '#home';
                            var config = this.reqres.request('config');
                            window.location = config.clientLocation;
                        }, this)
                    });
                }, this),
                errors: _.bind(function() {
                    //console.log('Logout failed.');
                }, this)
            });
        },

        portfolio: function() {
            var that = this;

            requirejs(['views/portfolio/index_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        portfolio_new: function() {
            var that = this;

            requirejs(['views/portfolio_new/index_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        company: function() {
            var that = this;

            requirejs(['views/company/index_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        companyProfile: function(){
            var that = this;

            requirejs(['views/findcompanies/company_profile_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        group: function() {
            var that = this;
            requirejs(['views/groups/entered_group_view'], function(View){
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        group_readonly: function() {
            var that = this;
            requirejs(['views/readonly/group'], function(View){
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        //-------------- under construction ------------------------------

        talent: function () {
            var that = this;
            requirejs(['views/company/findtalents/index_view'], function (View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        challenges: function() {
            var that = this;

            requirejs(['views/company/challenges/challenges_index_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        leaderboard: function() {
            var that = this;

            requirejs(['views/portfolio/leaderboard/leaderboard_index_view'], function(View) {
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },


        challenge: function() {
            var that = this;
            requirejs(['views/company/challenges/challenge_details_view'], function(View){
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        challenges_student: function() {
            var that = this;
            requirejs(['views/portfolio/challenges/challenges_index_view'], function(View){
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        challenge_student: function() {
            var that = this;
            requirejs(['views/portfolio/challenges/challenge_details_view'], function(View){
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        challenge_dashboard: function() {
            var that = this;
            requirejs(['views/dashboard/readonly/challenge_details_view'], function(View){
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        pointoflight: function() {
            var that = this;
            requirejs(['views/pointoflight/poi_index_view'], function(View){
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        //--------------------------------------------------------

        college: function() {
            var that = this;

            requirejs(['views/college/index_view'], function(View){
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        reporting: function() {
            var that = this;

            requirejs(['views/reporting/index_view'], function(View){
                var method = _.bind(that.regionCaller, that);
                method(View, true);
            });
        },

        settings: function() {
            var that = this;

            if(!this.reqres.request('session')) {

                this.model.fetch({
                    success: _.bind(function() {
                        //update the session
                        var session = this.model.get('session');
                        this.reqres.setHandler('session', _.bind(function() {
                            return session;
                        }, this));

                        if (this.model.get('message') === 'login failed'){
                            //console.log('Session does not exist, redirect to home');
                            window.location = '#home'
                        } else if(this.reqres.request('session').role === 'company') { //If there is a session
                            //console.log('There is a session, redirect to settings regions');
                            requirejs(['views/company/settings_view'], function(View){
                                var method = _.bind(that.regionCaller, that);
                                method(View, true);
                            });
                        } else if(this.reqres.request('session').role === 'student') { //If there is a session
                            //console.log('There is a session, redirect to settings regions');
                            requirejs(['views/portfolio/settings/settings_view'], function(View){
                                var method = _.bind(that.regionCaller, that);
                                method(View, true);
                            });
                        }
                        else if(this.reqres.request('session').role === 'alumni') { //If there is a session
                           // console.log('There is a session, redirect to settings regions');
                            requirejs(['views/alumni/settings/settings_view'], function(View){
                                var method = _.bind(that.regionCaller, that);
                                method(View, true);
                            });
                        }
                    }, this)
                });
            }
            else if(this.reqres.request('session').role === 'company') {
                requirejs(['views/company/settings_view'], function(View){
                    var method = _.bind(that.regionCaller, that);
                    method(View, true);
                });
            }  else if(this.reqres.request('session').role === 'student' ) { //If there is a session
                //console.log('There is a session, redirect to settings regions');
                requirejs(['views/portfolio/settings/settings_view'], function(View){
                    var method = _.bind(that.regionCaller, that);
                    method(View, true);
                });
            } else if(this.reqres.request('session').role === 'alumni' ) { //If there is a session
                //console.log('There is a session, redirect to settings regions');
                requirejs(['views/alumni/settings/settings_view'], function(View){
                    var method = _.bind(that.regionCaller, that);
                    method(View, true);
                });
            }
            else {
                window.location = '#home'
            }
        },

        /**
         * Region caller
         * Show the appropriate view based on navigation request and login
         * status.
         */

        regionCaller: function(viewClass, requireSession) {
            if(!this.isLoggedIn){

                // IE Bug Fixed - IE caches and fetch did not work
                var caching = true;
                if (this.isLoggedIn === false) {
                    caching = false;
                }
                this.model.fetch({

                    cache: false,
                    success: _.bind(function() {
                        //update the session
                        var session = this.model.get('session');
                        this.reqres.setHandler('session', _.bind(function() {
                            return session;
                        }, this));

                        if (this.model.get('message') === 'login failed') {
                            //console.log('Session does not exist')
                            this.isLoggedIn = false;
                        } else {
                           // console.log('There is a session')
                            this.isLoggedIn = true;
                        }

                        if(requireSession && ! this.isLoggedIn) {
                            if(window.location.hash !== '#about' && window.location.hash !== '#contact' && window.location.hash !== '#news' && window.location.hash !== '#companies'){
                                window.location = '#home';
                            }
                        }
                        else if (this.isHome && this.isLoggedIn) {
                            this.onRedirect();
                        }

                        var view = new viewClass(this.eventObjects);
                        this.vent.trigger('app:main:show', view, this.isLoggedIn);
                        this.isHome = false;
                    }, this)
                });
            } else {
                if (this.isHome) {
                    if (!this.isLoggedIn) {
                        window.location = '#home';
                    } else {
                        if (window.location.hash === '#home') {
                            this.onRedirect();
                        }
                    }
                }

                var view = new viewClass(this.eventObjects);
                this.vent.trigger('app:main:show', view, this.isLoggedIn);
            }
        },

        /*
         * Login routing based on user role
         */
        onLogin: function(loginResponse) {
            if (loginResponse.get('message') !== 'login successful') {
                //console.log('Login error: ' + loginResponse.get('message'));
            } else {
                this.reqres.setHandler('session', _.bind(function() {
                    return loginResponse.get('session');
                }, this));
                this.onRedirect();
            }
        },

        onRedirect: function() {
            if (this.reqres.request('session') !== undefined) {
                switch(this.reqres.request('session').role) {
                    case 'student':
                        window.location = '#portfolio';
                        break;
                    case 'alumni':
                        window.location = '#alumni_portfolio';
                        break;
                    case 'company':
                        window.location = '#company';
                        break;
                    case 'college':
                        window.location = '#college';
                        break;
                    case 'admin':
                        window.location = '#admin';
                        break;
                    default:
                        //console.log('Login was successful, but the user role has no default route.');
                }
            } else {
                window.location = '#home';
            }
        }
    });

    return RouteController;
});