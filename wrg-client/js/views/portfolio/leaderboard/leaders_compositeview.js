define([
    'marionette',
    'text!templates/portfolio/leaderboard/leaders.html',
    'views/portfolio/leaderboard/leader_itemview'

], function (Marionette, Template, ItemView) {
    'use strict';

    var LeadersCollectionView = Marionette.CompositeView.extend({
        template: Template,
        itemViewContainer: '.company-list.leaderboard-list',
        itemView: ItemView,

        events: {
            'click #moreStudents': 'moreStudents',
            'click #public-leaders': 'loadPublicLeaders',
            'click #internship-leaders': 'loadInternshipLeaders',
            'click #community-leaders': 'loadCommunityLeaders',
            'click #research-leaders': 'loadResearchLeaders',
            'click #leadership-leaders': 'loadLeadershipLeaders',
            'click #innovation-leaders': 'loadInnovationLeaders',
            'click #grit-leaders': 'loadGritLeaders',
            'click #industry-leaders': 'loadIndustryLeaders',
            'click #quantity-link': 'loadPointLeaders',
            'click #quality-link': 'loadVoteLeaders'
        },

        initialize: function (params) {
            this.collection = params.data;
            this.category = 1;
            this.filter = 1;
            //Scroll event
            _.bindAll(this, "checkScroll");
            $(window).scroll(this.checkScroll);
        },

        checkScroll: function () {
            if ($(window).scrollTop() === $(document).height() - $(window).height()) {
                this.moreStudents();
            }
        },

        onShow: function () {
            $('#internship-leaders').css('text-decoration', 'underline');
        },

        moreStudents: function () {
            this.result_length = this.collection.length;
            this.collection.fetch({ data: $.param({
                    category: this.category,
                    limit: this.collection.length + 10,
                    filter: this.filter
                }),
                    success: _.bind(function () {
                    }, this)
                }
            );
        },

        loadPointLeaders: function () {
            this.collection.fetch({ data: $.param({
                    category: this.category,
                    filter: 1
                }),
                    success: _.bind(function () {
                        this.filter = 1;
                    }, this)
                }
            );
        },

        loadVoteLeaders: function () {
            this.collection.fetch({ data: $.param({
                    category: this.category,
                    filter: 2
                }),
                    success: _.bind(function () {
                        this.filter = 2;
                    }, this)
                }
            );
        },

        loadInternshipLeaders: function () {
            this.collection.fetch({ data: $.param({
                    category: 1,
                    filter: this.filter
                }),
                    success: _.bind(function () {
                        $('#internship-leaders').css('text-decoration', 'underline');
                        $('#community-leaders').css('text-decoration', 'none');
                        $('#public-leaders').css('text-decoration', 'none');
                        $('#research-leaders').css('text-decoration', 'none');
                        $('#leadership-leaders').css('text-decoration', 'none');
                        $('#innovation-leaders').css('text-decoration', 'none');
                        $('#industry-leaders').css('text-decoration', 'none');
                        this.category = 1;
                    }, this)
                }
            );
        },

        loadCommunityLeaders: function () {
            this.collection.fetch({ data: $.param({
                    category: 2,
                    filter: this.filter
                }),
                    success: _.bind(function () {
                        $('#internship-leaders').css('text-decoration', 'none');
                        $('#community-leaders').css('text-decoration', 'underline');
                        $('#public-leaders').css('text-decoration', 'none');
                        $('#research-leaders').css('text-decoration', 'none');
                        $('#leadership-leaders').css('text-decoration', 'none');
                        $('#innovation-leaders').css('text-decoration', 'none');
                        $('#industry-leaders').css('text-decoration', 'none');
                        this.category = 2;
                    }, this)
                }
            );
        },

        loadPublicLeaders: function () {
            this.collection.fetch({ data: $.param({
                    category: 3,
                    filter: this.filter
                }),
                    success: _.bind(function () {
                        $('#internship-leaders').css('text-decoration', 'none');
                        $('#community-leaders').css('text-decoration', 'none');
                        $('#public-leaders').css('text-decoration', 'underline');
                        $('#research-leaders').css('text-decoration', 'none');
                        $('#leadership-leaders').css('text-decoration', 'none');
                        $('#innovation-leaders').css('text-decoration', 'none');
                        $('#industry-leaders').css('text-decoration', 'none');
                        this.category = 3;
                    }, this)
                }
            );
        },

        loadResearchLeaders: function () {
            this.collection.fetch({ data: $.param({
                    category: 4,
                    filter: this.filter
                }),
                    success: _.bind(function () {
                        $('#internship-leaders').css('text-decoration', 'none');
                        $('#community-leaders').css('text-decoration', 'none');
                        $('#public-leaders').css('text-decoration', 'none');
                        $('#research-leaders').css('text-decoration', 'underline');
                        $('#leadership-leaders').css('text-decoration', 'none');
                        $('#innovation-leaders').css('text-decoration', 'none');
                        $('#industry-leaders').css('text-decoration', 'none');
                        this.category = 4;
                    }, this)
                }
            );
        },

        loadLeadershipLeaders: function () {
            this.collection.fetch({ data: $.param({
                    category: 5,
                    filter: this.filter
                }),
                    success: _.bind(function () {
                        $('#internship-leaders').css('text-decoration', 'none');
                        $('#community-leaders').css('text-decoration', 'none');
                        $('#public-leaders').css('text-decoration', 'none');
                        $('#research-leaders').css('text-decoration', 'none');
                        $('#leadership-leaders').css('text-decoration', 'underline');
                        $('#innovation-leaders').css('text-decoration', 'none');
                        $('#industry-leaders').css('text-decoration', 'none');
                        this.category = 5;
                    }, this)
                }
            );
        },

        loadInnovationLeaders: function () {
            this.collection.fetch({ data: $.param({
                    category: 6,
                    filter: this.filter
                }),
                    success: _.bind(function () {
                        $('#internship-leaders').css('text-decoration', 'none');
                        $('#community-leaders').css('text-decoration', 'none');
                        $('#public-leaders').css('text-decoration', 'none');
                        $('#research-leaders').css('text-decoration', 'none');
                        $('#leadership-leaders').css('text-decoration', 'none');
                        $('#innovation-leaders').css('text-decoration', 'underline');
                        $('#industry-leaders').css('text-decoration', 'none');
                        this.category = 6;
                    }, this)
                }
            );
        },

        loadIndustryLeaders: function () {
            this.collection.fetch({ data: $.param({
                    category: 7,
                    filter: this.filter
                }),
                    success: _.bind(function () {
                        $('#internship-leaders').css('text-decoration', 'none');
                        $('#community-leaders').css('text-decoration', 'none');
                        $('#public-leaders').css('text-decoration', 'none');
                        $('#research-leaders').css('text-decoration', 'none');
                        $('#leadership-leaders').css('text-decoration', 'none');
                        $('#innovation-leaders').css('text-decoration', 'none');
                        $('#industry-leaders').css('text-decoration', 'underline');
                        this.category = 7;
                    }, this)
                }
            );
        },

        loadGritLeaders: function () {
            this.collection.fetch({ data: $.param({
                    category: 8,
                    filter: this.filter
                }),
                    success: _.bind(function () {
                        $('#internship-leaders').css('text-decoration', 'none');
                        $('#community-leaders').css('text-decoration', 'none');
                        $('#public-leaders').css('text-decoration', 'none');
                        $('#research-leaders').css('text-decoration', 'none');
                        $('#leadership-leaders').css('text-decoration', 'none');
                        $('#innovation-leaders').css('text-decoration', 'none');
                        $('#industry-leaders').css('text-decoration', 'none');
                        $('#grit-leaders').css('text-decoration', 'underline');
                        this.category = 8;
                    }, this)
                }
            );
        }
    });
    return LeadersCollectionView;
});


