function my_student(){

    //first the alumni is unable, and I need login

    var url = "/student/me";
    var method ="GET";
    $("#access_denied_received").html("Waiting...");
    $("#access_denied_url").html(url);
    $("#access_denied_method").html(method);


    $.ajax({
        type: method,
        url: url ,
        // The key needs to match your method's input parameter (case-sensitive).
        dataType: "json",
        async: false,
        success: function(data){

            $("#access_denied_received").html(JSON.stringify(data));

        },
        failure: function(errMsg) {

            $("#access_denied_received").html(errMsg);

        },
        statusCode: {
            403: function() {
                $("#access_denied_received").html("Forbidden Code 403");
            }

        }


    });

    //now loggin
    url = "/auth/process";
    method = "POST";
    var data_sent = {
        username : "student@wrg.com",
        password: "jajaja"
    };
    $("#login_received").html("waiting");
    $("#login_sent").html(JSON.stringify(data_sent));
    $("#login_url").html(url);
    $("#login_method").html(method);


    $.ajax({
        type: method,
        url: url,
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify(data_sent),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function(data){

            $("#login_received").html(JSON.stringify(data));

        },
        failure: function(errMsg) {

            $("#login_received").html(errMsg);

        }


    });

    //--------------------------------------------
    // now I can see my student story
    var url = "/student/me";
    var method ="GET";
    $("#me_received").html("Waiting...");
    $("#me_url").html(url);
    $("#me_method").html(method);
    $("#me_sent").html("none");


    $.ajax({
        type: method,
        url: url ,
        // The key needs to match your method's input parameter (case-sensitive).
        dataType: "json",
        async: false,
        success: function(data){

            $("#me_received").html(JSON.stringify(data));

        },
        failure: function(errMsg) {

            $("#me_received").html(errMsg);

        },
        statusCode: {
            403: function() {
                $("#me_received").html("Forbidden Code 403");
            }

        }


    });

    //LOGOUT

    var url = "/logout";
    var method ="GET";
    // $("#access_denied_received").html("Waiting...");
    //$("#access_denied_url").html(url);
    //$("#access_denied_method").html(method);

    $.ajax({
        type: method,
        url: url ,
        // The key needs to match your method's input parameter (case-sensitive).
        dataType: "json",
        async: false,
        success: function(data){

            //$("#access_denied_received").html(JSON.stringify(data));

        },
        failure: function(errMsg) {

            //$("#access_denied_received").html(errMsg);

        },
        statusCode: {
            403: function() {
               // $("#access_denied_received").html("Forbidden Code 403");
            }

        }


    });


}

