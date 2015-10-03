/**
 * ExperienceController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

    create: function(req,res){

        if(!req.isAuthenticated()) {
            return res.view('404');
        }

        Experience.create(req.body).done(function(err,experience){
            try{
                if (err){
                    console.log("Error create experience",err);
                    return res.send(err,500);
                }else{
                    //Now create the category
                    categories = req.body.categories;
                    if (categories === undefined)
                        categories = [];

                    for (var i=0; i<categories.length; i++){
                        categories[i] .experience_id = experience.id;
                    }

                    var experiencePoints, points=[];
                    //experiencePoints = Experience.diffMonths(req.body.start_date, req.body.end_date);
                    experiencePoints = 1; // Calculate experience points based on event not on time
                    for (var i = 0; i < req.body.categories.length; i++) {
                        var cat = {
                            category_id: req.body.categories[i].category_id,
                            student_id: req.body.student_id,
                            experience_id: req.body.categories[i].experience_id,
                            points: experiencePoints
                        };
                        points.push(cat);
                        console.log("points calculated", experiencePoints);
                    }

                    //Save the categories
                    ExperienceCategory.create(categories).done(function(err,expcats){
                        try{
                            if (err){
                                return res.send(err.message,500);
                            }else{

                                experience.categories = expcats;


                                //Save the media experiences
                                //Now create the media
                                medias = req.body.media;
                                if (medias == undefined)
                                    medias = [];

                                for (i=0; i<medias.length; i++){
                                    medias[i] .experience_id = experience.id;
                                }

                                ExperienceMedia.create(medias).done(
                                    function(err,new_medias){
                                        try{
                                            if (err){
                                                return res.send(err.detail,500);
                                            }else{
                                                experience.media = new_medias;
                                                StudentPoints.create(points).done(
                                                    function (err, point) {
                                                        try {
                                                            if (err) {
                                                                return res.send(err.detail, 500);
                                                            } else {
                                                                var feedEntry = {};
                                                                feedEntry.user_id = req.session.user.id;
                                                                feedEntry.user_role = req.session.user.role;
                                                                feedEntry.event_type ='experienceAdded';
                                                                feedEntry.image = experience.title;
                                                                Feed.addFeedEvent(feedEntry);
                                                                Experience.sumPoints(res, experience);
                                                            }
                                                        } catch (err) {
                                                            return res.send(err.message, 500);
                                                        }
                                                    }
                                                );
                                            }

                                        }catch(err){
                                            return res.send(err.message,500);
                                        }
                                    }
                                );
                                   
                            }
                        } catch(err) {
                            console.log(err.message);
                            return res.send(err.message,500);
                        }

                    });
                }
            }catch(err){
                console.log(err.message);
                return res.send(err.message,500);
            }
        })
    },

    update: function(req,res){

        if(!req.isAuthenticated()) {
            return res.view('404');
        }

        var id = req.param("id");
        Experience.update({id: id},req.body,function(err, experiences){
            try{
                if (err){
                    console.log("Error create experience", err);
                    return res.send(err.message,500);
                }else{
                    if (0 < experiences.length){

                        experience = experiences[0];
                        ExperienceCategory.destroy({experience_id: experience.id}).done(
                            function(err){
                                try{
                                    if (err){
                                        console.log(err.message);
                                        return res.send(err.message,500);
                                    }else{

                                        //find the  new
                                        categories = res.req.body.categories;
                                        categories = (categories === undefined)? Array() : categories;
                                        for(var i = 0; i < categories.length ; i++){
                                            categories[i].experience_id = experience.id;
                                            delete categories.id;
                                        }

                                        var experiencePoints, points=[];
                                        //experiencePoints = Experience.diffMonths(req.body.start_date, req.body.end_date);
                                        experiencePoints = 1; // Calculate experience points based on event not on time
                                        for (var i = 0; i < req.body.categories.length; i++) {
                                            var cat = {
                                                category_id: req.body.categories[i].category_id,
                                                student_id: req.body.student_id,
                                                experience_id: req.body.categories[i].experience_id,
                                                points: experiencePoints
                                            };
                                            points.push(cat);
                                            console.log("points calculated", experiencePoints);
                                        }

                                        ExperienceCategory.create(categories).done(function(err, expcats){
                                            try{
                                                if (err){
                                                    return res.send(err.message,500);
                                                } else {
                                                    experience.categories = expcats;

                                                    var media = [];

                                                    if (res.req.body.media){
                                                        media =  res.req.body.media;
                                                    }
                                                    var media_delete = [];
                                                    for (var i=0; i< media.length; i++ ){
                                                        var media_aux = media[i];
                                                        if (media_aux.deleted != undefined) {
                                                            if (media_aux.deleted == "on" ){
                                                                media_delete[media_delete.length] = { id :media_aux.id };
                                                            }
                                                        }
                                                    }
                                                    ExperienceMedia.destroy({experience_id: experience.id}).done(
                                                        function(err,expmedia){
                                                            try{
                                                                if (err){
                                                                    return res.send(err,detail,500);
                                                                }else{
                                                                    if (expmedia != undefined){
                                                                    console.log("Experiences media deleted:",expmedia.length)
                                                                    }
                                                                    //Save the new medias
                                                                    var media =[];
                                                                    if (res.req.body.media){
                                                                        media =  res.req.body.media;
                                                                    }

                                                                    var media_new = [];
                                                                    for (var i=0; i< media.length; i++ ){
                                                                        var media_aux = media[i];

                                                                        if (media_aux.id == undefined) {

                                                                            media_new[media_new.length] = { name:  media_aux.name,
                                                                                type: media_aux.type,
                                                                                data: media_aux.data,
                                                                                experience_id : experience.id
                                                                            };
                                                                        }
                                                                    }
                                                                    ExperienceMedia.create(media_new).done(
                                                                        function(err,media){
                                                                            try{
                                                                                if (err){
                                                                                    return res.send(err,500);
                                                                                }else{
                                                                                    ExperienceMedia.find(
                                                                                        {experience_id : experience.id },
                                                                                        function(err,media){
                                                                                            try{
                                                                                                if (err){
                                                                                                    return res.send(err.detail,500);
                                                                                                }else{
                                                                                                    experience.media = media;
                                                                                                    var studentId = req.body.student_id;
                                                                                                    //return res.send(experience, 200);
                                                                                                    StudentPoints.destroy({experience_id:experience.id}).done(
                                                                                                        function (err, point) {
                                                                                                            try {
                                                                                                                if (err) {
                                                                                                                    return res.send(err.message, 500);
                                                                                                                } else {
                                                                                                                    StudentPoints.create(points).done(
                                                                                                                        function (err, point) {
                                                                                                                            try {
                                                                                                                                if (err) {
                                                                                                                                    return res.send(err.detail, 500);
                                                                                                                                } else {
                                                                                                                                    var feedEntry = {};
                                                                                                                                    feedEntry.user_id = req.session.user.id;
                                                                                                                                    feedEntry.user_role = req.session.user.role;
                                                                                                                                    feedEntry.event_type ='experienceUpdated';
                                                                                                                                    feedEntry.image = experience.title;
                                                                                                                                    Feed.addFeedEvent(feedEntry);
                                                                                                                                    Experience.sumPoints(res, experience);
                                                                                                                                    //return res.send(experience, 200);
                                                                                                                                }
                                                                                                                            } catch (err) {
                                                                                                                                return res.send(err.message, 500);
                                                                                                                            }
                                                                                                                        }
                                                                                                                    );
                                                                                                                }
                                                                                                            } catch (err) {
                                                                                                                return res.send(err.message, 500);
                                                                                                            }
                                                                                                        }
                                                                                                    );
                                                                                                }
                                                                                            }catch(err){
                                                                                                return res.send(err.message,500);
                                                                                            }
                                                                                        }

                                                                                    );
                                                                                }
                                                                            }catch(err){
                                                                                return res.send(err.message,500);
                                                                            }
                                                                        }
                                                                    );
                                                                }
                                                            }catch(err){
                                                                return res.send(err.message,500);
                                                            }
                                                        }
                                                    );
                                                }
                                            }catch(err){
                                                console.log(err.message);
                                                return res.send(err.message,500);
                                            }
                                        });
                                    }
                                }catch(err){
                                    console.log(err.message);
                                    return res.send(err.message,500);
                                }
                            }
                        );

                    }else{
                        return res.send({message:"Nothing was updated, check your params"},200);
                    }
                }
            }catch(err){
                console.log(err.message);
                return res.send(err.message,500);
            }
        });
    },

    findExperiences:function (req, res) {

        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from find professional experiences");
            return  res.view('404');
        }

        var user_id = req.session.user.id
        Student.findOneByUser_id(user_id).done(function (err, student) {

            // Error handling
            if (err) {
                sails.log.error(err);
                return res.send(err, 500);
                // The Books were found successfully!
            } else {


                Experience.find({
                    student_id:student.id
                }).done(function (err, experiences) {
                    if (err) {
                        sails.log.error(err);
                        return res.send(err, 500);
                    } else {
                        sails.log.info("Experiences found for student: ", student.id);


                        var ranking = [];
                        ranking[1] = 0;
                        ranking[2] = 0;
                        ranking[3] = 0;
                        ranking[4] = 0;
                        ranking[5] = 0;
                        ranking[6] = 0;
                        ranking[7] = 0;
                        ranking[8] = 0;

                        //Projects

                        if (experiences.length > 0) {
                            var array_where = [];
                            for (var i = 0; i < experiences.length; i++) {
                                array_where[i] = {experience_id:experiences[i].id};
                            }

                            //Categories

                           ExperienceCategory.find(
                                {
                                    where:{
                                        or:array_where
                                    }
                                }
                            ).done(
                                function (err, expcat) {

                                    if (err) {
                                        sails.log.error(err);
                                        return res.send(err, 500);
                                    } else {
                                        sails.log.info("Categories found for student: ", student.id);
                                        for (var i = 0; i < expcat.length; i++) {
                                            for (var j = 0; j < experiences.length; j++) {
                                                if (experiences[j].categories === undefined) {
                                                    var categories = [];
                                                    experiences[j].categories = categories;
                                                }
                                                if (experiences[j].id == expcat[i].experience_id) {
                                                    experiences[j].categories[experiences[j].categories.length] = expcat[i];
                                                }
                                            }
                                            ranking[expcat[i].category_id]++;
                                        }

                                        ExperienceMedia.find({
                                            where:{
                                                or:array_where
                                            }
                                        }).done(
                                            function (err, expmedia) {
                                                try {
                                                    if (err) {
                                                        return res.send(err, 500)
                                                    } else {
                                                        sails.log.info("Media found for student: ", student.id);
                                                        for (var i = 0; i < expmedia.length; i++) {
                                                            for (var j = 0; j < experiences.length; j++) {
                                                                if (experiences[j].media === undefined) {
                                                                    experiences[j].media = [];
                                                                }
                                                                if (experiences[j].id === expmedia[i].experience_id) {
                                                                    experiences[j].media[experiences[j].media.length] = expmedia[i];
                                                                }
                                                            }
                                                        }
                                                        return res.send(experiences, 200);
                                                    }
                                                } catch (err) {
                                                    return res.send(err, 500);
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }
                        else {
                            return res.send(experiences, 200);
                        }
                    }
                });
            }
        });
    }
};
