function create_failed(){

    var data_sent = {
        //"first_name" : "Student",
        "last_name" : "WRG",
        "email" : "student@wrg.com",
        "password" : "jajaja",
        "school":"UADY",
        "major" : "Computing",
        "graduation_year" :2012,
        "graduation_month" : 11
    };

    var url = "/user/new_student";

    $("#fail_received").html("Waiting...");
    $("#fail_sent").html(JSON.stringify(data_sent));
    $("#fail_url").html(url);

    $.ajax({
        type: "POST",
        url: url,
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify(data_sent),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function(data){

            $("#fail_received").html(JSON.stringify(data));

        },
        failure: function(errMsg) {

            $("#fail_received").html(errMsg);

        },
        statusCode: {
            500: function(err) {
                $("#fail_received").html(err.responseText);
            }

        }


    });

    // FAIL BY STUDENT

    var data_sent = {
        "first_name" : "Student",
        "last_name" : "WRG",
        "email" : "student@wrg.com",
        "password" : "jajaja",
        //"school":"UADY",
        "major" : "Computing",
        "graduation_year" :2012,
        "graduation_month" : 11
    };

    var url = "/user/new_student";

    $("#fail_received_2").html("Waiting...");
    $("#fail_sent_2").html(JSON.stringify(data_sent));
    $("#fail_url_2").html(url);

    $.ajax({
        type: "POST",
        url: url,
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify(data_sent),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function(data){

            $("#fail_received_2").html(JSON.stringify(data));

        },
        failure: function(errMsg) {

            $("#fail_received_2").html(errMsg);

        },
        statusCode: {
            500: function(err) {
                $("#fail_received_2").html(err.responseText);
            }

        }


    });



    //---------------OK REGISTER -----------------

    var data_sent = {
        "first_name" : "Student",
        "last_name" : "WRG",
        "email" : "student@wrg.com",
        "password" : "jajaja",
        "school":"UADY",
        "major" : "Computing",
        "graduation_year" :2012,
        "graduation_month" : 11
    };

    var user_id = null;
    $("#ok_received").html("Waiting...");
    $("#ok_sent").html(JSON.stringify(data_sent));
    $("#ok_url").html(url);

    $.ajax({
        type: "POST",
        url: url,
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify(data_sent),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function(data){

            $("#ok_received").html(JSON.stringify(data));
            user_id = data.user.id;

        },
        failure: function(errMsg) {

            $("#ok_received").html(errMsg);

        },
        statusCode: {
            500: function(err) {
                $("#ok_received").html(err.responseText);
            }

        }


    });


    // REPEAT USER NAME OR EMAIL



    $("#ok_received_2").html("Waiting...");
    $("#ok_sent_2").html(JSON.stringify(data_sent));
    $("#ok_url_2").html(url);

    $.ajax({
        type: "POST",
        url: url,
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify(data_sent),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function(data){

            $("#ok_received_2").html(JSON.stringify(data));

        },
        failure: function(errMsg) {

            $("#ok_received_2").html(errMsg);

        },
        statusCode: {
            500: function(err) {
                $("#ok_received_2").html(err.responseText);
            }

        }


    });


    my_student();

    //
    // DELETE USER CREATED

    /*
    var data_sent = {
    };

    url = "/user/"+user_id;
    $("#delete_received").html("Waiting...");
    $("#delete_sent").html(JSON.stringify(data_sent));
    $("#delete_url").html(url);

    $.ajax({
        type: "DELETE",
        url: url,
        // The key needs to match your method's input parameter (case-sensitive).
        dataType: "json",
        async: false,
        success: function(data){

            $("#delete_received").html(JSON.stringify(data));

        },
        failure: function(errMsg) {

            $("#delete_received").html(errMsg);

        },
        statusCode: {
            500: function(err) {
                $("#delete_received").html(err.responseText);
            }

        }


    });

    */

}

