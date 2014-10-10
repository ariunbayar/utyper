var getUsername = function() {
   user = prompt("Нэрээ оруулна уу:","");
   if (user != "" && user != null) {
       return user;
   }
}
//var username = getUsername();

var total_chars = 0;
var current_pos = 0;
var chars = -1;
var start = 0;
var end = 0;
var cpm1 = 0;
var cpm2 = 0;
var cpm3 = 0;
var refresh_handle = null;

var cars = [ "Red", "Green", "Blue", "Black", "Purple", "Black"];

var multi_race    = [];

var topic = 0;
var is_single = false;
var name = null;
var random = Math.floor((Math.random()*5)+1);
var color  = cars[random];

var commands = {

    menu: function() {
        $("#game").hide();
        $("#menu").show();
        location.reload();
    },
    start_single: function() {
        $("#menu").hide();
        $("#game").show();
        is_single = true;

        racer1();

        $('#text').html($('#hidden_text' + random).html());
        commands.init_jquery();
        commands.timer(4);
    },
    start_multiple: function() {
        $("#menu").hide();
        $("#game").show();
        commands.init_jquery();

        $.ajax({
            url: "controller.php",
            type: "GET",
            data: "action=checkTable",
            success: function(rsp) {
                if (rsp == 0) {
                    $.ajax({
                        url: "controller.php",
                        type: "GET",
                        data: "is_first=" + true,
                        success: function(rsp) {
                            if (rsp == 1) {
                                startCountdown(1, random);
                            }
                            var promise = getGameData();
                            promise.success(function(rsp) {
                                var data        = rsp.split(" ");
                                var countdown   = data[0];
                                var name        = data[1];
                                var topic       = data[2]

                                $('#text').html($('#hidden_text' + topic).html());
                                // TODO remove topic in parameter
                                commands.timer(countdown, name, topic);
                            });
                        }
                    });
                } else {
                    var promise = getGameData();
                    promise.success(function(rsp) {
                        var data        = rsp.split(" ");
                        var countdown   = data[0];
                        var name        = data[1];
                        var topic       = data[2]

                        $('#text').html($('#hidden_text' + topic).html());
                        // TODO remove topic in parameter
                        commands.timer(countdown, name, topic);
                    });
                }
            }
        });

    },
    init_jquery: function() {
        var typer = $('#typer');
        typer.keyup(commands.key);
        typer.keypress(commands.key);
    },
    timer: function(countdown, name, topic) {

        var countdown_el = $('#timer');
        var content_el = $('#text');
        var tmp_name_el = $('#4dfe5');
        var tmp_topic_el = $('#s7Dw2');

        if (countdown_el.data('countdown')) {
            if (countdown == undefined) {
                countdown = countdown_el.data('countdown') - 1;
            }
        }
        if (tmp_name_el.data('name')) {
            name = tmp_name_el.data('name');
        }
        if (tmp_topic_el.data('topic')) {
            topic = tmp_topic_el.data('topic');
        }

        countdown_el.data('countdown', countdown);
        tmp_name_el.data('name', name);
        tmp_topic_el.data('topic', topic);

        countdown_el.html(countdown);
        if (countdown <= 30 && countdown > 3) {

            $.ajax({
                url: "controller.php",
                type: "GET",
                data: "name=" + name,
                dataType: "json",
                success: function(racers_data) {
                    var count = Object.keys(racers_data).length;
                    if (count == 1) {
                        racer1();
                    } else if (count == 2) {
                        racer1();
                        racer2();
                    } else if (count == 3) {
                        racer1();
                        racer2();
                        racer3();
                    }
                }
            });
        }
        if (countdown < 4) {
            countdown_el.css('background-color', 'red');
        }

        if (countdown < 2) {
            countdown_el.css('background-color', 'green');
        }

        // continue countdown or start typing
        if (countdown > 0) {
            setTimeout('commands.timer();', 1000);
        } else {
            commands.startRace();
        }
    },
    startRace: function() {
        setTimeout('commands.refresh();', 100);
        total_chars = $('#text').html().length;
        chars = 0;
        start = new Date();
        $('#timer').hide();
        $('#typer').focus();
    },
    getSecondsPassed: function() {
        if (end){
            now = end;
        }else{
            now = new Date();
        }
        return (now - start) / 1000;
    },
    refresh: function() {
        var cpm_container1 = $('#cpm1');
        var cpm_container2 = $('#cpm2');
        var cpm_container3 = $('#cpm3');
        var cpm_container4 = $('#cpm4');
        var cpm_container5 = $('#cpm5');
        var game_timer = $('#game_timer');
        cpm = chars / commands.getSecondsPassed() * 60;
        cpm = Math.round(cpm);
        if (!is_single) {
            if (cpm == 0) cpm = 1;
            $.ajax({
                url: "controller.php",
                type: "GET",
                data: "cpm=" + cpm + "&name=" + name + "&startTimer=" + true,
                dataType: "json",
                success: function(cpms) {
                    var length = Object.keys(cpms).length;
                    game_timer.html('time left: ' + cpms[0]["timer"]);

                    if (length == 1) {
                        cpm_container1.html(" : " + Math.round(cpm) + " cpm");
                    }
                    if (length == 2) {
                        cpm_container1.html(" : " + parseInt(cpms[0]["cpm"]) + " cpm");
                        cpm_container2.html(" : " + parseInt(cpms[1]["cpm"]) + " cpm");
                    }
                    if (length == 3) {
                        cpm_container1.html(" : " + parseInt(cpms[0]["cpm"]) + " cpm");
                        cpm_container2.html(" : " + parseInt(cpms[1]["cpm"]) + " cpm");
                        cpm_container3.html(" : " + parseInt(cpms[2]["cpm"]) + " cpm");
                    }
                    if (length == 4) {
                        cpm_container1.html(" : " + parseInt(cpms[0]["cpm"]) + " cpm");
                        cpm_container2.html(" : " + parseInt(cpms[1]["cpm"]) + " cpm");
                        cpm_container3.html(" : " + parseInt(cpms[2]["cpm"]) + " cpm");
                        cpm_container4.html(" : " + parseInt(cpms[3]["cpm"]) + " cpm");
                    }
                    if (length == 5) {
                        cpm_container1.html(" : " + parseInt(cpms[0]["cpm"]) + " cpm");
                        cpm_container2.html(" : " + parseInt(cpms[1]["cpm"]) + " cpm");
                        cpm_container3.html(" : " + parseInt(cpms[2]["cpm"]) + " cpm");
                        cpm_container4.html(" : " + parseInt(cpms[3]["cpm"]) + " cpm");
                        cpm_container5.html(" : " + parseInt(cpms[4]["cpm"]) + " cpm");
                    }
                }
            });
        } else {
            cpm_container1.html(" : " + Math.round(cpm) + " cpm");
        }
        refresh_handle = setTimeout('commands.refresh();', 1000);
    },
    key: function(e) {
        var el = $('#typer');
        var cur_char = null;
        var text = $('#text').html().substr(current_pos) + ' ';
        var word = text.substr(0, text.indexOf(' ') + 1);
        var value = el.val();

        if (!total_chars){
            el.val('');
            return;
        }

        if (!word.match('^' + value)) {
            el.css('background-color', 'red');
        } else {
            el.css('background-color', 'white');
        }

        if (value == word) {
            current_pos += value.length;
            chars = current_pos;
            el.val('');
        }

        if (total_chars == (current_pos - 1)) {
            clearTimeout(refresh_handle);
            end = new Date();
        }
    }
}

var removePlayer = function() {
    $.ajax({
        url: "destroy.php",
        type: "GET",
        data: "remove=player",
        success: function(rsp) {
        }
    });
}
removePlayer();

var startCountdown = function(arg1, arg2) {
    if (arg2) topic = "&topic=" + arg2;
    else topic = "&topic=-1";

    $.ajax({
        url: "countdown.php",
        type: "GET",
        data: "action=" + arg1 + topic,
        success: function(rsp) {
            var data = rsp.split(" ");
            var countdown = data[0];
            if (countdown > 0) {
                setTimeout('startCountdown(2);', 1000);
            }
        }
    });
}

var getGameData = function() {
    return $.ajax({
        url: "countdown.php",
        type: "GET",
        data: "action=" + 3,
    });
}


var racer1 = function() {
    var img_el1 = document.createElement("img");
    var racer1_el = $('#racer1');
    var racer1_cur_el = $('#racer1_current');

    multi_race.push(cars.shift());
    img_el1.src = '/static/img/' + multi_race[0] + '.png';
    racer1_cur_el.html('___');
    racer1_el.html(img_el1);
}

var racer2 = function() {
    var img_el2 = document.createElement("img");
    var racer2_el = $('#racer2');
    var racer2_cur_el = $('#racer2_current');

    multi_race.push(cars.shift());
    img_el2.src = '/static/img/' + multi_race[1] + '.png';
    racer2_cur_el.html('___');
    racer2_el.html(img_el2);
}

var racer3 = function() {
    var img_el3 = document.createElement("img");
    var racer3_el = $('#racer3');
    var racer3_cur_el = $('#racer3_current');

    multi_race.push(cars.shift());
    img_el3.src = '/static/img/' + multi_race[2] + '.png';
    racer3_cur_el.html('___');
    racer3_el.html(img_el3);
}

var racer4 = function() {
    var img_el4 = document.createElement("img");
    var racer4_el = $('#racer4');
    var racer4_cur_el = $('#racer4_current');

    multi_race.push(cars.shift());
    img_el4.src = '/static/img/' + multi_race[3] + '.png';
    racer4_el.html(img_el4);
}

var racer5 = function() {
    var img_el5 = document.createElement("img");
    var racer5_el = $('#racer5');
    var racer5_cur_el = $('#racer5_current');

    img_el5.src = '/static/img/' + cars[random] + '.png';
    racer5_cur_el.html('___');
    racer5_el.html(img_el5);
}

// Remove racer when browser close
window.onbeforeunload = function() {
    removePlayer(); // it also removes race.
}
