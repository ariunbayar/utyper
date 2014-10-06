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

// Racers
var first_racer  = false;
var second_racer1 = false;
var second_racer2 = false;
var second_racer3 = false;
var third_racer1  = false;
var third_racer2  = false;
var fourth_racer  = false;
var fifth_racer   = false;
var multi_race    = [];

var topic = 0;
var is_single = false;
var is_creator = true;

var commands = {

    menu: function() {
        $("#game").hide();
        $("#menu").show();
        changeStatus(false);
        location.reload();
    },
    start_single: function() {
        $("#menu").hide();
        $("#game").show();
        is_single = true;

        racer1(false);
        commands.init_jquery(4);
    },
    start_multiple: function() {
        $("#menu").hide();
        $("#game").show();

        $.ajax({
            url: "controller.php",
            data: "status=2",
            type: "GET",
            success: function(rsp) {
                if (rsp == 1) {
                    // Racer 1 - creator - current racer
                    racer1(true);
                    commands.init_jquery(30);
                } else if (rsp == 2) {
                    // Racer 1
                    racer1(false);
                    // Racer 2 - current racer
                    racer2(true);
                    second_racer1 = true;

                    $.ajax({
                        url: "race.php",
                        type: "GET",
                        data: "getCountdownAndTopic=true",
                        success: function(rsp) {
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
                    // Racer 1,2
                    racer1(false);
                    racer2(false);
                    // Racer 3 - current racer
                    racer3(true);
                    second_racer2 = true;
                    third_racer1 = true;

                    $.ajax({
                        url: "race.php",
                        type: "GET",
                        data: "getCountdownAndTopic=true",
                        success: function(rsp) {
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
                } else if (rsp == 4) {
                    // Racer 1,2,3
                    racer1(false);
                    racer2(false);
                    racer3(false);
                    // Racer 4 - current racer
                    racer4(true);
                    second_racer3 = true;
                    third_racer2 = true;
                    fourth_racer = true;

                    $.ajax({
                        url: "race.php",
                        type: "GET",
                        data: "getCountdownAndTopic=true",
                        success: function(rsp) {
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
                } else if (rsp == 5) {
                    // Racer 1,2,3,4
                    racer1(false);
                    racer2(false);
                    racer3(false);
                    racer4(false);
                    // Racer 5 - current racer
                    racer5(true);

                    $.ajax({
                        url: "race.php",
                        type: "GET",
                        data: "getCountdownAndTopic=true",
                        success: function(rsp) {
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
                data: "status=2",
                type: "GET",
                success: function(player_count) {
                    console.log(player_count);
                    if (player_count == 2) {
                        is_creator = false;
                        // Add racer 2 in racer1's game
                        racer2(false);
                        $("#r2").show();

                        $.ajax({
                            url: "race.php",
                            type: "GET",
                            data: "topic=" + topic + "&countdown=" + countdown + "&follower=1",
                            success: function(rsp) {
                            }
                        });
                    } else if (player_count == 3) {
                        is_creator = false;
                        // Add racer 3 in racer1's game
                        racer3(false);
                        $("#r3").show();

                        $.ajax({
                            url: "race.php",
                            type: "GET",
                            data: "topic=" + topic + "&countdown=" + countdown + "&follower=2",
                            success: function(rsp) {
                            }
                        });
                    } else if (player_count == 4) {
                        is_creator = false;
                        // Add racer 4 in racer1's game
                        racer4(false);
                        $("#r4").show();

                        $.ajax({
                            url: "race.php",
                            type: "GET",
                            data: "topic=" + topic + "&countdown=" + countdown + "&follower=3",
                            success: function(rsp) {
                            }
                        });
                    } else if (player_count == 5) {
                        is_creator = false;
                        // Add racer 5 in racer1's game
                        racer5(false);
                        $("#r5").show();

                        $.ajax({
                            url: "race.php",
                            type: "GET",
                            data: "topic=" + topic + "&countdown=" + countdown + "&follower=4",
                            success: function(rsp) {
                            }
                        });
                    }
                }
            });
            checkRacers(2);
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
            changeStatus(true);
        }
        checkRacers(2);
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
                    if (length == 3) {
                        cpm_container1.html(" : " + parseInt(data[0]) + " cpm");
                        cpm_container2.html(" : " + parseInt(data[1]) + " cpm");
                        cpm_container3.html(" : " + parseInt(data[2]) + " cpm");
                    }
                    if (length == 4) {
                        cpm_container1.html(" : " + parseInt(data[0]) + " cpm");
                        cpm_container2.html(" : " + parseInt(data[1]) + " cpm");
                        cpm_container3.html(" : " + parseInt(data[2]) + " cpm");
                        cpm_container4.html(" : " + parseInt(data[3]) + " cpm");
                    }
                    if (length == 5) {
                        cpm_container1.html(" : " + parseInt(data[0]) + " cpm");
                        cpm_container2.html(" : " + parseInt(data[1]) + " cpm");
                        cpm_container3.html(" : " + parseInt(data[2]) + " cpm");
                        cpm_container4.html(" : " + parseInt(data[3]) + " cpm");
                        cpm_container5.html(" : " + parseInt(data[4]) + " cpm");
                    }
                }
            });
            checkRacers(3);
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

// status 1 - ready
// status 2 - waiting
// status 3 - playing

var changeStatus = function(tmp) {
    if (tmp) {
        $.ajax({
            url: "controller.php",
            type: "GET",
            data: "status=3",
            success: function(rsp) {
            }
        });
    } else {
        $.ajax({
            url: "controller.php",
            type: "GET",
            data: "status=1&cpm=1",
            success: function(rsp) {
            }
        });
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
//removePlayer();

var removeRace = function() {
    $.ajax({
        url: "destroy.php",
        type: "GET",
        data: "remove=race",
        success: function(rsp) {
        }
    });
}
removeRace();

var checkRacers = function(status_num) {
    $.ajax({
        url: "controller.php",
        data: "check_stat=" + status_num,
        type: "GET",
        success: function(rsp) {
            if (rsp == 1) {
                $("#r1").show();
                $("#r2").hide();
                $("#r3").hide();
                $("#r4").hide();
                $("#r5").hide();
            }
            if (rsp == 2) {
                $("#r1").show();
                $("#r2").show();
                $("#r3").hide();
                $("#r4").hide();
                $("#r5").hide();
            }
            if (rsp == 3) {
                $("#r1").show();
                $("#r2").show();
                $("#r3").show();
                $("#r4").hide();
                $("#r5").hide();
            }
            if (rsp == 4) {
                $("#r1").show();
                $("#r2").show();
                $("#r3").show();
                $("#r4").show();
                $("#r5").hide();
            }
            if (rsp == 5) {
                $("#r1").show();
                $("#r2").show();
                $("#r3").show();
                $("#r4").show();
                $("#r5").show();
            }
            if (rsp == 3 && second_racer1) {
                // Add Racer 3 in Racer 2's game
                racer3(false);
                $("#r3").show();

                $("#r4").hide();
                $("#r5").hide();
                second_racer1 = false;
            } else if (rsp == 4 && second_racer2) {
                // Add Racer 3,4 in Racer 2's game
                racer3(false);
                racer4(false);
                $("#r3").show();
                $("#r4").show();

                $("#r5").hide();
                second_racer2 = false;
            } else if (rsp == 4 && third_racer1) {
                // Add Racer 4 in Racer 3's game
                racer4(false);
                $("#r4").show();
                third_racer1 = false;
            } else if (rsp == 5 && second_racer3) {
                // Add Racer 3,4,5 in Racer 2's game
                racer3(false);
                racer4(false);
                racer5(false);
                $("#r3").show();
                $("#r4").show();
                $("#r5").show();
                second_racer3 = false;
            } else if (rsp == 5 && third_racer2) {
                // Add Racer 4,5 in Racer 3's game
                racer4(false);
                racer5(false);
                $("#r4").show();
                $("#r5").show();
                third_racer2 = false;
            } else if (rsp == 5 && fourth_racer) {
                // Add Racer 5 in Racer 4's game
                racer5(false);
                $("#r5").show();
                fourth_racer = false;
            }
        }
    });
}

var racer1 = function(current) {
    var img_el1 = document.createElement("img");
    var racer1_el = $('#racer1');
    var racer1_cur_el = $('#racer1_current');

    multi_race.push(cars.shift());
    img_el1.src = '/static/img/' + multi_race[0] + '.png';
    if (current) {
        racer1_cur_el.html('Та : ');
    } else {
        racer1_cur_el.html('___');
    }
    racer1_el.html(img_el1);
}

var racer2 = function(current) {
    var img_el2 = document.createElement("img");
    var racer2_el = $('#racer2');
    var racer2_cur_el = $('#racer2_current');

    multi_race.push(cars.shift());
    img_el2.src = '/static/img/' + multi_race[1] + '.png';
    if (current) {
        racer2_cur_el.html('Та : ');
    } else {
        racer2_cur_el.html('___');
    }
    racer2_el.html(img_el2);
}

var racer3 = function(current) {
    var img_el3 = document.createElement("img");
    var racer3_el = $('#racer3');
    var racer3_cur_el = $('#racer3_current');

    multi_race.push(cars.shift());
    img_el3.src = '/static/img/' + multi_race[2] + '.png';
    if (current) {
        racer3_cur_el.html('Та : ');
    } else {
        racer3_cur_el.html('___');
    }
    racer3_el.html(img_el3);
}

var racer4 = function(current) {
    var img_el4 = document.createElement("img");
    var racer4_el = $('#racer4');
    var racer4_cur_el = $('#racer4_current');

    multi_race.push(cars.shift());
    img_el4.src = '/static/img/' + multi_race[3] + '.png';
    if (current) {
        racer4_cur_el.html('Та : ');
    } else {
        racer4_cur_el.html('___');
    }
    racer4_el.html(img_el4);
}

var racer5 = function(current) {
    var img_el5 = document.createElement("img");
    var racer5_el = $('#racer5');
    var racer5_cur_el = $('#racer5_current');

    multi_race.push(cars.shift());
    img_el5.src = '/static/img/' + multi_race[4] + '.png';
    if (current) {
        racer5_cur_el.html('Та : ');
    } else {
        racer5_cur_el.html('___');
    }
    racer5_el.html(img_el5);
}

// Remove racer when browser close
window.onbeforeunload = function() {
    removePlayer(); // it also removes race.
}
