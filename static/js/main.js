var total_chars = 0;
var current_pos = 0;
var chars = -1;
var start = 0;
var end = 0;
var cpm1 = 0;
var cpm2 = 0;
var cpm3 = 0;
var refresh_handle = null;

var cars = [ "Red", "Green", "Blue", "Black", "Purple"];
var first_racer = false;
var second_racer = false;
var third_racer = false;
var multi_race = [];

var topic = 0;
var is_single = false;
var is_creator = true;

var commands = {

    menu: function() {
        $("#game").hide();
        $("#menu").show();
        removePlayer();
        location.reload();
    },
    start_single: function() {
        $("#menu").hide();
        $("#game").show();
        is_single = true;

        var img_el = document.createElement("img");
        var racer1_el = $('#racer1');
        var random_car = Math.floor((Math.random()*4));
        img_el.src = '/static/img/' + cars[random_car] + '.png';
        racer1_el.html(img_el);

        commands.init_jquery(5);
    },
    start_multiple: function() {
        $("#menu").hide();
        $("#game").show();

        $.ajax({
            url: "controller.php",
            type: "GET",
            success: function(rsp) {
                if (rsp == 1) {
                    var img_el = document.createElement("img");
                    var racer1_el = $('#racer1');
                    var racer1_cur_el = $('#racer1_current');

                    // Racer 1 - creator - current racer
                    multi_race.push(cars.shift());
                    img_el.src = '/static/img/' + multi_race[0] + '.png';
                    racer1_cur_el.html('Та : ');
                    racer1_el.html(img_el);

                    commands.init_jquery(30);
                } else if (rsp == 2) {
                    var img_el1 = document.createElement("img");
                    var racer1_el = $('#racer1');
                    var racer1_cur_el = $('#racer1_current');

                    var img_el2 = document.createElement("img");
                    var racer2_el = $('#racer2');
                    var racer2_cur_el = $('#racer2_current');

                    // Racer 1
                    multi_race.push(cars.shift());
                    img_el1.src = '/static/img/' + multi_race[0] + '.png';
                    racer1_cur_el.html('___');
                    racer1_el.html(img_el1);

                    // Racer 2 - current racer
                    multi_race.push(cars.shift());
                    img_el2.src = '/static/img/' + multi_race[1] + '.png';
                    racer2_cur_el.html('Та : ');
                    racer2_el.html(img_el2);

                    $.ajax({
                        url: "race.php",
                        type: "GET",
                        data: "getCountdownAndTopic=true",
                        success: function(rsp) {
                            console.log(rsp);
                            data = rsp.split(" ");
                            cnt = data[0];
                            topic = data[1];

                            $('#text').html($('#hidden_text' + topic).html());
                            var typer = $('#typer');
                            typer.keyup(commands.key);
                            typer.keypress(commands.key);
                            commands.timer(cnt);
                        }
                    });
                } else if (rsp == 3) {
                    var img_el1 = document.createElement("img");
                    var racer1_el = $('#racer1');
                    var racer1_cur_el = $('#racer1_current');

                    var img_el2 = document.createElement("img");
                    var racer2_el = $('#racer2');
                    var racer2_cur_el = $('#racer2_current');

                    var img_el3 = document.createElement("img");
                    var racer3_el = $('#racer3');
                    var racer3_cur_el = $('#racer3_current');

                    // Racer 1
                    multi_race.push(cars.shift());
                    img_el1.src = '/static/img/' + multi_race[0] + '.png';
                    racer1_cur_el.html('___');
                    racer1_el.html(img_el1);

                    // Racer 2
                    multi_race.push(cars.shift());
                    img_el2.src = '/static/img/' + multi_race[1] + '.png';
                    racer2_cur_el.html('___');
                    racer2_el.html(img_el2);

                    // Racer 3 - current racer
                    multi_race.push(cars.shift());
                    img_el3.src = '/static/img/' + multi_race[2] + '.png';
                    racer3_cur_el.html('Та : ');
                    racer3_el.html(img_el3);

                    $.ajax({
                        url: "race.php",
                        type: "GET",
                        data: "getCountdownAndTopic=true",
                        success: function(rsp) {
                            console.log(rsp);
                            data = rsp.split(" ");
                            cnt = data[0];
                            topic = data[1];

                            $('#text').html($('#hidden_text' + topic).html());
                            var typer = $('#typer');
                            typer.keyup(commands.key);
                            typer.keypress(commands.key);
                            commands.timer(cnt);
                        }
                    });
                }
            }
        });
    },
    player_timer: function(topic, countdown) {
        var countdown_el = $('#timer');
        var temp_el = $('#temp');
        if (countdown_el.data('countdown')) {
            countdown = countdown_el.data('countdown') - 1;
        }
        if (temp_el.data('topic')) {
            topic = temp_el.data('topic');
        }
        countdown_el.data('countdown', countdown);
        temp_el.data('topic', topic);

        if (countdown < 30 && countdown > 4) {
            if (is_creator) {
                $.ajax({
                    url: "race.php",
                    type: "GET",
                    data: "topic=" + topic + "&countdown=" + countdown + "&follower=0",
                    success: function(rsp) {
                    }
                });
            }

            $.ajax({
                url: "controller.php",
                type: "GET",
                success: function(player_count) {
                    console.log(player_count);
                    if (player_count == 2) {
                        is_creator = false;
                        var img_el = document.createElement("img");
                        var racer2_el = $('#racer2');
                        var racer2_cur_el = $('#racer2_current');

                        multi_race.push(cars.shift());
                        img_el.src = '/static/img/' + multi_race[1] + '.png';
                        racer2_cur_el.html('___');
                        racer2_el.html(img_el);

                        $.ajax({
                            url: "race.php",
                            type: "GET",
                            data: "topic=" + topic + "&countdown=" + countdown + "&follower=1",
                            success: function(rsp) {
                            }
                        });
                    } else if (player_count == 3) {
                        is_creator = false;
                        var img_el2 = document.createElement("img");
                        var racer2_el = $('#racer2');
                        var racer2_cur_el = $('#racer2_current');

                        var img_el3 = document.createElement("img");
                        var racer3_el = $('#racer3');
                        var racer3_cur_el = $('#racer3_current');

                        // Racer 2
                        multi_race.push(cars.shift());
                        img_el2.src = '/static/img/' + multi_race[1] + '.png';
                        racer2_cur_el.html('___');
                        racer2_el.html(img_el);

                        // Racer 3
                        multi_race.push(cars.shift());
                        img_el2.src = '/static/img/' + multi_race[1] + '.png';
                        racer2_cur_el.html('___');
                        racer2_el.html(img_el);

                        $.ajax({
                            url: "race.php",
                            type: "GET",
                            data: "topic=" + topic + "&countdown=" + countdown + "&follower=2",
                            success: function(rsp) {
                            }
                        });
                    }
                    // TODO: Racer 4,5
                }
            });
        }
        countdown_el.html(countdown);
        if (countdown > 4) {
            setTimeout('commands.player_timer();', 1000);
        } else {
            commands.timer(countdown);
        }
    },
    init_jquery: function(countdown) {
        $(function(){
            var random_number = Math.floor((Math.random()*5)+1);
            $('#text').html($('#hidden_text' + random_number).html());
            commands.player_timer(random_number, countdown);
            var typer = $('#typer');
            typer.keyup(commands.key);
            typer.keypress(commands.key);
        });
    },
    timer: function(countdown) {
        var countdown_el = $('#timer');
        var content_el = $('#text');

        if (countdown_el.data('countdown')) {
            if (countdown == undefined) {
                countdown = countdown_el.data('countdown') - 1;
            }
        }
        countdown_el.data('countdown', countdown);

        countdown_el.html(countdown);
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
        cpm = chars / commands.getSecondsPassed() * 60;
        if (!is_single) {
            $.ajax({
                url: "controller.php",
                type: "GET",
                data: "cpm=" + Math.round(cpm),
                success: function(rsp) {
                    console.log(rsp);
                    var data = rsp.split(" ");
                    var length = data.length;

                    if (length == 1) {
                        cpm_container1.html(" : " + Math.round(cpm) + " cpm");
                    }
                    if (length == 2) {
                        cpm_container1.html(" : " + parseInt(data[0]) + " cpm");
                        cpm_container2.html(" : " + parseInt(data[1]) + " cpm");
                    }
                    //TODO
                    if (length == 3) {
                        cpm_container1.html(" : " + parseInt(data[0]) + " cpm");
                        cpm_container2.html(" : " + parseInt(data[1]) + " cpm");
                        cpm_container3.html(" : " + parseInt(data[2]) + " cpm");
                    }
                    last_cpm = Math.round(cpm);
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
            console.log(rsp);
        }
    });
}
removePlayer();

var removeGame = function() {
    $.ajax({
        url: "destroy.php",
        type: "GET",
        data: "remove=game",
        success: function(rsp) {
            console.log(rsp);
        }
    });
}
