define([
    'marionette',
    'text!templates/dashboard/index.html' ,
    'views/dashboard/mentor_results_compositeview',
    'views/dashboard/internships_compositeview',
    'views/dashboard/challenge_results_compositeview',
    'views/dashboard/fellow_students_compositeview',
    'views/dashboard/dashboard_groups_compositeview',
    'views/dashboard/moocs_compositeview',
    'views/dashboard/pointoflight_compositeview',
    'collections/dashboard/alumni_mentors',
    'collections/dashboard/dashboard_internships',
    'collections/dashboard/dashboard_challenges',
    'collections/dashboard/fellow_students',
    'collections/dashboard/dashboard_groups',
    'collections/dashboard/dashboard',
    'collections/dashboard/dashboard_moocs',
    'collections/dashboard/dashboard_pointoflight',
    'utils/customSearchEngine',
    'text!templates/dashboard/pointoflight.html',
    'text!templates/dashboard/pointoflightwidget.html'

], function (Marionette, Template, MentorsCompositeVew, InternshipsCompositeView, ChallengesCompositeView, FellowStudentsCompositeView, GroupsCompositeView, MoocsCompositeView, PointOfLightCompositeView, MentorsCollection, InternshipsCollection, ChallengesCollection, FellowStudentsCollection, GroupsCollection, Dashboard, Moocs, PointOfLight, CSE, polTemplate, widgetTemplate) {
    'use strict';

    var DashboardIndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            results: '#dashboard-results'
        },
        events: {
            'click #mentors': 'loadMentors',
            'mouseover .pointOfLightList': function (e) {
                $("#" + e.currentTarget.id).removeClass("zoomInDown");
                $("#" + e.currentTarget.id).addClass("animated pulse");
            },
            'mouseleave .pointOfLightList': function (e) {
                $("#" + e.currentTarget.id).removeClass("animated pulse");
            },
            'click #internships': 'loadInternships',
            'keypress #customLocation': function (e) {
                if (e.which === 13) {
                    this.loadPointOfLight();
                }
            },
            'click #challenges': 'loadChallenges',
            'click #fellows': 'loadFellowStudents',
            'click #groups': 'loadGroups',
            'click #moocs': 'loadMOOCs',
            'click #customLocation': function () {
                var autocomplete = new google.maps.places.Autocomplete(
                    (document.getElementById('customLocation')),
                    { types: ['geocode'] });
                google.maps.event.addListener(autocomplete, 'place_changed', function () {
                });

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var geolocation = new google.maps.LatLng(
                            position.coords.latitude, position.coords.longitude);
                        autocomplete.setBounds(new google.maps.LatLngBounds(geolocation, geolocation));
                    });
                }
            },
            'click #pointoflight': function () {
                this.model.set("newSearch", false);
                this.loadPointOfLight();
            },
            'click .polclass': function (e) {
                var whatIsClicked = e.currentTarget.id.split("-")[1];
                this.loadPointOfLight(whatIsClicked);
            },
            'click #customSearch': function () {
                //reset the search model
                this.model.set("newSearch", false);
                this.model.set("customDistance", $("#customDistance").val());
                this.loadPointOfLight();
            },
            'click .mapstart': function (e) {
                //mapData contains array --> lat,long and town
                var mapData = e.currentTarget.id.split(",");
                //TODO Error checking
                this.googleMapInjector(mapData);
            }
        },

        initialize: function (options) {
            var myLocation;
            //Prefetch Script functions
            //Check if we already have maps object. If not load it!!!
            //Not used at the moment. This is loaded from the main page.
            //Reason why we load it from the main page is we use autocmplete places from google.
            //and the library we need is not loading in Async. It should be a part of maps libs.
            //THe only way to load it is by including it on the main page.
            //If there is performance drop in page load speed, then uncomment this and comment the
            // <script type="text/javascript" src="js/lib/placeholder.js"></script>
            /* if (!google.maps) {
             var script = document.createElement('script');
             script.type = 'text/javascript';
             script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
             'callback=initialize';
             document.body.appendChild(script);
             }*/

            //Prefetch the users location, so we dont have to wait
            //TODO: Find reliable way to detect user location

            //DEFENSE
            //Do we have valid Google object to work with?
            try {
                myLocation = google.loader.ClientLocation.address.city;
            } catch (err) {
                myLocation = "Chicago";//If we fail to detect the users location, then use Chicago as a default
            }
            //Google returns falsy object value
            if (!myLocation) {
                myLocation = "Chicago";
            } else {
                wrgSettings.userLocation = myLocation;
            }

            this.reqres = options.reqres;
            this.session = this.reqres.request('session');
            this.options = options;
            this.config = this.reqres.request('config');
            this.collection = new Dashboard(null, options);
            this.listenTo(this.collection, 'loaded', this.loadMentors);
            this.model = new Backbone.Model();
        },

        loadMentors: function () {
            $("#pageloader").fadeIn(100).delay(this.config.spinnerTimeout).fadeOut(100);
            this.mentors = new MentorsCollection(this.collection.models[0].attributes.alumniMentors, this.options);
            if (this.collection.models[0].attributes.alumniUnSeenCounter) {
                $('#newAlumnus').html(this.collection.models[0].attributes.alumniUnSeenCounter);
                $('#newAlumnus').css('display', 'block');
            }
            if (this.collection.models[0].attributes.internshipsUnSeenCounter) {
                $('#newInternships').html(this.collection.models[0].attributes.internshipsUnSeenCounter);
                $('#newInternships').css('display', 'block');
            }
            if (this.collection.models[0].attributes.challengesUnSeenCounter) {
                $('#newChallenges').html(this.collection.models[0].attributes.challengesUnSeenCounter);
                $('#newChallenges').css('display', 'block');
            }
            if (this.collection.models[0].attributes.groupsUnSeenCounter) {
                $('#newGroups').html(this.collection.models[0].attributes.groupsUnSeenCounter);
                $('#newGroups').css('display', 'block');
            }
            if (this.collection.models[0].attributes.fellowUnSeenCounter) {
                $('#newStudents').html(this.collection.models[0].attributes.fellowUnSeenCounter);
                $('#newStudents').css('display', 'block');
            }
            this.results.reset();
            this.results.show(new MentorsCompositeVew({
                reqres: this.reqres,
                collection: this.mentors
            }));
        },

        loadInternships: function () {
            this.internships = new InternshipsCollection(this.collection.models[0].attributes.internships, this.options);
            this.results.reset();
            this.results.show(new InternshipsCompositeView({
                reqres: this.reqres,
                collection: this.internships
            }));
        },

        loadChallenges: function () {
            this.challenges = new ChallengesCollection(this.collection.models[0].attributes.challenges, this.options);
            this.results.reset();
            this.results.show(new ChallengesCompositeView({
                reqres: this.reqres,
                collection: this.challenges
            }));
        },

        loadFellowStudents: function () {
            this.fellowStudents = new FellowStudentsCollection(this.collection.models[0].attributes.fellowStudents, this.options);
            this.results.reset();
            this.results.show(new FellowStudentsCompositeView({
                reqres: this.reqres,
                collection: this.fellowStudents
            }));
        },

        loadGroups: function () {
            this.groups = new GroupsCollection(this.collection.models[0].attributes.groups, this.options);
            this.results.reset();
            this.results.show(new GroupsCompositeView({
                reqres: this.reqres,
                collection: this.groups
            }));
        },

        googleMapInjector: function (location) {

            $("#map-dialogue").append('<div id="map-canvas"></div>');

            $("#map-dialogue").dialog({
                dialogClass: 'customDialogue',

                show: {
                    effect: "drop",
                    duration: 600
                },
                hide: {
                    effect: "drop",
                    duration: 300
                },
                width: 800,
                height: 600,
                resizable: false,
                draggable: true,
                modal: true,
                close: function () {
                    $("#dialog-message").html("");
                },
                buttons: {
                    Close: function () {
                        $(this).dialog("close");
                        $("#map-dialogue").html("");
                    }
                },
                open: function () {

                    $('.ui-dialog-buttonset').find('button:first').addClass('customDialogueButton');
                    initialize();

                    function initialize() {

                        var myLatLng = new google.maps.LatLng(location[0], location[1]);
                        var mapOptions = {
                            zoom: 13,
                            center: myLatLng
                        };
                        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

                        var marker = new google.maps.Marker({
                            position: myLatLng,
                            map: map,
                            animation: google.maps.Animation.DROP = 1,
                            title: 'WRG Point of Light Oportunity'
                        });
                    }
                    google.maps.event.addDomListener(window, 'load', initialize);
                }
            });
        },

        loadPointOfLight: function (pagination) {

            $("#dashboardloader").append("<img id='theImg' src='/img/ajax-loader-small.gif'/>");

            var that = this,
                customLocation = $("#customLocation").val(),
                customDistance = $("#customDistance").val();

            if (customDistance) {
                this.model.set("customDistance", customDistance);
            }
            if (customLocation) {
                this.model.set("customLocation", customLocation);
            }
            if (pagination) {
                customLocation = this.model.get("customLocation");
                customDistance = this.model.get("customDistance");
                $("#dashboard-results").empty();
            }

            var htmlPolItems = "";
            var widgetRenderer = Handlebars.compile(widgetTemplate);
            var lightRenderer = Handlebars.compile(polTemplate);

            var query = "";
            var objective = this.collection.models[0].attributes.currentUser.objective;
            if (objective) {
                query = objective;
            }
            else {
                //inject warning to html about career needed to be set
                query = "pilot";
            }

            CSE.getPointOfLightJobs(query, customLocation, customDistance, pagination, function (datas) {
                $("#dashboardloader").empty();
                //Strip the data on server
                var data = datas.items, counter = "";
                var timer = 500;

                //Always render the custom search box and distance marker
                $("#dashboard-results").html(widgetRenderer);

                if (query === "pilot") {
                    //<a href="http://www.w3schools.com">Visit W3Schools.com!</a>
                    //TODO: Add ability so that user can quickly add his objective within the same window!!!. For the time being, just navigate him to profile
                    //var profileLink = "<a href=" + that.config.clientLocation + ":7000" + "/#portfolio" + ">" + "Change" + "</a>";
                    //$("#dashboard-results").append(profileLink + "<br>");
                    $("#dashboard-results").append("<div style='color: red'>Please add career objective to your profile. Search is being performed using default value</div>" + "<br>");
                }

                if (datas.TotalMatch > 10) {
                    counter = Math.round(datas.TotalMatch / 10);

                    $("#offset").empty();
                    for (var i = 0; i <= counter; i++) {
                        //render pagination links
                        $("#offset").append("<a id=offset-" + i + " class='polclass'> " + i + " </a>");
                    }
                }

                data.forEach(function (key, index, complete) {
                    timer = timer + 100;
                    //bounceIn
                    //key.fixedTime = that.dateExtractor(key.pubDate);
                    //htmlPolItems += lightRenderer(key);

                    setTimeout(function () {
                        key.distance = Math.round(key.Distance);
                        key.userLocation = wrgSettings.userLocation;
                        key.searchLocation = datas.searchLocation;
                        //key.introClass = "animate bounceIn";
                        key.introClass = "animated zoomInDown";
                        $("#dashboard-results").append(lightRenderer(key));
                    }, timer);
                });

                $("#dashboard-results").append("You searched for: " + "<b>" + query + "</b>");
                $("#dashboard-results").append("<br>" + "Total Results: " + datas.TotalMatch + "<br>" + "<br>");
                //$("#dashboard-results").append(htmlPolItems);

                var searchUrl = that.model.get("newSearch");
                that.model.set("myProperty", searchUrl);

                //Check for cached version of Jqueryui Object, to avoid reload every time the page is changed
                if ($.ui) {
                    that.slideBarInjector(customDistance);
                } else {
                    $.getScript("/js/lib/jqueryui.js")//TODO: make sure this script is locally/outside available, also make sure it contains only slider functionality
                        .done(function (script, textStatus) {
                            that.slideBarInjector();
                        })
                        .fail(function (jqxhr, settings, exception) {
                            //TODO Log this failure
                            //console.log("Script failed to load");
                        });
                }
            });
        },

        dateExtractor: function (dateString) {
            var tempTime = dateString.split(" ");
            return  tempTime[0] + " " + tempTime[1] + " " + tempTime[2] + " " + tempTime[3];
        },

        slideBarInjector: function (customDistance) {
            var that = this;

            if (!customDistance) {
                customDistance = 15;
            }
            //Preserve the input box value after the search
            $("#customLocation").val(this.model.get("customLocation"));

            $("#distanceselector").slider({
                //range: "max",
                min: 0,
                max: 6000,
                value: customDistance,
                slide: function (event, ui) {
                    $("#distanceselector").find(".ui-slider-handle").text(ui.value);
                },
                stop: function (event, ui) {
                    $("#customDistance").val(ui.value);
                    that.model.set("sliderValue", ui.value);
                    that.loadPointOfLight();
                    //Preserve the Slider Value
                    $("#distanceselector").find(".ui-slider-handle").text(ui.value);
                },
                create: function (event, ui) {
                    $("#distanceselector").find(".ui-slider-handle").text(that.model.get("sliderValue"));
                }
            });
        },

        loadMOOCs: function () {
            $("#dashboardloader").append("<img id='theImg' src='/img/ajax-loader-small.gif'/>");
            var that = this;
            var query = '';
            var objective = this.collection.models[0].attributes.currentUser.objective;
            var major = this.collection.models[0].attributes.currentUser.major;

            if (objective !== '' && objective !== undefined) {
                query = objective;
            }
            else if (major !== '' && major !== undefined) {
                query = major;
            }
            else {
                query = 'begginer course';
            }

            CSE.getResults(query, function (data) {
                $("#dashboardloader").empty();

                that.moocs = new Moocs(data.items, that.options);
                that.results.reset();
                that.results.show(new MoocsCompositeView({
                    reqres: that.reqres,
                    collection: that.moocs
                }));
            });
        }
    });
    return DashboardIndexView;
});