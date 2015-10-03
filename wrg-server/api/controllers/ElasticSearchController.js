'use strict';

var request = require('request');

var elasticsearch = require('elasticsearch');

var mc = (require('../../config/mainConfig.js')());

module.exports = {

    searchIndex: function (req, res) {

       var clientSearchterm = req.param('term');

       //var clientSearchterm =  req.body.q.keys;

        var client = new elasticsearch.Client();


// Connect to the this host's cluster, sniff
// for the rest of the cluster right away, and
// again every 5 minutes
        var client = elasticsearch.Client({
            host: mc.appSettings.elasticSearchHost
            //sniffOnStart: false,  //Use if we have clusters in environment
            //sniffInterval: 300000
        });
        client.search({
            index: 'schools',
            type: 'school',
            body: {
                query: {
                    match_phrase_prefix: {
                        schoolname: {
                            query: clientSearchterm,
                            slop: 10,
                            max_expansions: 50,
                            fuzzy : {
                                fuzziness : 2
                            }
                        }
                    }
                }
            }
        }).then(function (resp) {

            var hits = resp.hits.hits;
            var returnContainer = {};
            var resultSet = [];

            for (var i = 0; i < hits.length; i++){
                var returnContainer = {};
                returnContainer.value = hits[i]._source.schoolname;
                resultSet.push(returnContainer);
            }
            return res.send(resultSet, 200);

        }, function (err) {
            console.trace(err.message);
        });


        ///FILLER for schools
/*
        try {

            var query = "SELECT SchoolList.* " +
                " FROM SchoolList";// + mc.dbSettings.dbName;
          var idSelector = 1;


            SchoolList.query(query, null,
                function (err, request) {

                    var tempObjectA = [];
                    var allSchools = request.rows;

                    allSchools.forEach(function (key, index, whole){
                        var tempObject = {};

                        tempObject.schoolname = key.name;
                        tempObject.schoolstate = key.state;
                        tempObject._id = idSelector;
                        idSelector++;
                        tempObjectA.push(tempObject);
                    });

                    var a = 1;
                    setInterval(
                        function (){
                            a++;

                            client.index({
                                index: 'schools',
                                type: 'school',
                                id: tempObjectA[a]._id,
                                body: {
                                    schoolname: tempObjectA[a].schoolname,
                                    schoolstate: tempObjectA[a].schoolstate
                                }
                            }, function (err, resp) {
                                console.log(tempObjectA[a]);

                            });
                    },250)
                });

        } catch (err) {
            res.send({message: err.message}, 500);
        }
        */
    },
    _config: {}
};