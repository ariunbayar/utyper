var total_chars = 0;
var current_pos = 0;
var chars = -1;
var start = 0;
var end = 0;
var cpm1 = 0;
var cpm2 = 0;
var cpm3 = 0;
var refresh_handle = null;
var cars = [ "Red", "Green", "Blue", "Yellow", "Purple"];
var first_racer = false;
var second_racer = false;
var third_racer = false;
var multi_race = [];
var topic = 0;
var status = "";
var last_cpm = 0;

var commands = {

    menu: function() {
        $("#game").hide();
        $("#menu").show();
        location.reload();
    },
    start_single: function() {
        $("#menu").hide();
        $("#game").show();
        commands.init_jquery(5);
    },
    start_multiple: function() {
        $("#menu").hide();
        $("#game").show();
        $.ajax({
            url: "controller.php",
            type: "GET",
            data: "phpsessid=" + getCookie("PHPSESSID") + "&count=true",
            success: function(rsp) {
                if (rsp == 1 && !first_racer) {
                    multi_race.push(cars.shift());

                    var racer1_el = $('#racer1');
                    var racer1_cur_el = $('#racer1_current');
                    racer1_el.css('color', multi_race[0]);
                    racer1_cur_el.html('Та : ');
                    racer1_el.html(multi_race[0]);

                    status = "r";
                    first_racer = true;
                    commands.init_jquery(30);
                    checkPlayer();
                } else if (rsp == 2 && !second_racer) {
                    multi_race.push(cars.shift());
                    var racer1_el = $('#racer1');
                    racer1_el.css('color', multi_race[0]);
                    racer1_el.html(multi_race[0]);

                    multi_race.push(cars.shift());
                    var racer2_el = $('#racer2');
                    var racer2_cur_el = $('#racer2_current');
                    racer2_el.css('color', multi_race[1]);
                    racer2_cur_el.html('Та : ');
                    racer2_el.html(multi_race[1]);
                    status = "g";
                    second_racer = true;

                    $.ajax({
                        url: "controller.php",
                        type: "GET",
                        data: "phpsessid=" + getCookie("PHPSESSID") + "&getSession=true",
                        success: function(rsp_session) {
                            if (rsp_session) {
                                $.ajax({
                                    url: "game.php",
                                    type: "GET",
                                    data: "getCountdown=true" + "&phpsessid=" + rsp_session,
                                    success: function(rsp) {
                                        data = rsp.split(" ");
                                        topic = data[0];
                                        follower = data[1];
                                        cnt = data[2];
                                        $('#text').html($('#hidden_text' + topic).html());
                                        var typer = $('#typer');
                                        typer.keyup(commands.key);
                                        typer.keypress(commands.key);
                                        commands.timer(cnt);
                                    }
                                })
                            }
                        }
                    });
                    checkPlayer();
                } else if (rsp == 3 && !third_racer) {
                    multi_race.push(cars.shift());
                    var racer1_el = $('#racer1');
                    racer1_el.css('color', multi_race[0]);
                    racer1_el.html(multi_race[0]);

                    multi_race.push(cars.shift());
                    var racer2_el = $('#racer2');
                    racer2_el.css('color', multi_race[1]);
                    racer2_el.html(multi_race[1]);

                    multi_race.push(cars.shift());
                    var racer3_el = $('#racer3');
                    var racer3_cur_el = $('#racer3_current');
                    racer3_el.css('color', multi_race[2]);
                    racer3_cur_el.html('You: ');
                    racer3_el.html(multi_race[2]);
                    third_racer = true;

                    // TODO:
                    //$.ajax({
                    //    url: "controller.php",
                    //    type: "GET",
                    //    data: "phpsessid=" + getCookie("PHPSESSID") + "&getSession=true",
                    //    success: function(rsp_session) {
                    //        if (rsp_session) {
                    //            $.ajax({
                    //                url: "game.php",
                    //                type: "GET",
                    //                data: "getCountdown=true" + "&phpsessid=" + rsp_session,
                    //                success: function(rsp) {
                    //                    data = rsp.split(" ");
                    //                    topic = data[0];
                    //                    follower = data[1];
                    //                    cnt = data[2];
                    //                    $('#text').html($('#hidden_text' + topic).html());
                    //                    var typer = $('#typer');
                    //                    typer.keyup(commands.key);
                    //                    typer.keypress(commands.key);
                    //                    commands.timer(cnt);
                    //                }
                    //            })
                    //        }
                    //    }
                    //});
                    //checkPlayer();
                }
            }
        });
    },
    player_timer: function(topic, countdown) {
        if (commands.stop) return;
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
            $.ajax({
                url: "game.php",
                type: "GET",
                data: "phpsessid=" + getCookie("PHPSESSID") + "&topic=" + topic + "&countdown=" + countdown + "&follower=0",
                success: function(rsp) {
                    var data = rsp.split(" ");
                    var follower = data[1];
                    var cnt = data[2];

                    $.ajax({
                        url: "controller.php",
                        type: "GET",
                        data: "phpsessid=" + getCookie("PHPSESSID") + "&count=true",
                        success: function(rsp) {
                            if (rsp == 2) {
                                multi_race.push(cars.shift());

                                var racer2_el = $('#racer2');
                                racer2_el.css('color', multi_race[1]);
                                racer2_el.html(multi_race[1]);
                                $.ajax({
                                    url: "controller.php",
                                    type: "GET",
                                    data: "phpsessid=" + getCookie("PHPSESSID") + "&getSession=true",
                                    success: function(rsp_session) {
                                        if (rsp_session) {
                                            var follower_cnt = 1;
                                            $.ajax({
                                                url: "game.php",
                                                type: "GET",
                                                data: "phpsessid=" + getCookie("PHPSESSID") + "&topic=" + topic + "&countdown=" + countdown + "&follower=" + follower_cnt,
                                                success: function(rsp) {
                                                }
                                            });
                                        }
                                    }
                                });

                            } else if (rsp == 3) {
                                multi_race.push(cars.shift());

                                var racer2_el = $('#racer2');
                                racer2_el.css('color', multi_race[1]);
                                racer2_el.html(multi_race[1]);
                                $.ajax({
                                    url: "controller.php",
                                    type: "GET",
                                    data: "phpsessid=" + getCookie("PHPSESSID") + "&getSession=true",
                                    success: function(rsp_session) {
                                        if (rsp_session) {
                                            var follower_cnt = 2;
                                            $.ajax({
                                                url: "game.php",
                                                type: "GET",
                                                data: "phpsessid=" + getCookie("PHPSESSID") + "&topic=" + topic + "&countdown=" + countdown + "&follower=" + follower_cnt,
                                                success: function(rsp) {
                                                }
                                            })
                                        }
                                    }
                                });
                            }
                        }
                    });
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
        $.ajax({
            url: "controller.php",
            type: "GET",
            data: "phpsessid=" + getCookie("PHPSESSID") + "&cpm=" + Math.round(cpm),
            success: function(rsp) {
                console.log(rsp);
                var data = rsp.split(" ");
                var length = data.length;

                if (length == 1) {
                    cpm_container1.html(" : " + Math.round(cpm) + " cpm");
                }
                if (length == 2) {
                    cpm_container1.html(" : " + parseInt(data[1]) + " cpm");
                    cpm_container2.html(" : " + parseInt(data[0]) + " cpm");
                }
                if (length == 3) {
                    cpm_container1.html(" : " + parseInt(data[0]) + " cpm");
                    cpm_container2.html(" : " + parseInt(data[1]) + " cpm");
                    cpm_container3.html(" : " + parseInt(data[2]) + " cpm");
                }
                last_cpm = Math.round(cpm);
                refresh_handle = setTimeout('commands.refresh();', 1000);
            }
        });
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
            var cpm_container1 = $('#cpm1');
            var cpm_container2 = $('#cpm2');
            var cpm_container3 = $('#cpm3');

            if (status == 'r') {
                cpm_container1.html(last_cpm + " cpm");
                //$.ajax({
                //    url: "controller.php",
                //    type: "GET",
                //    data: "phpsessid=" + getCookie("PHPSESSID") + "&cpm=" + last_cpm,
                //    success: function(rsp) {
                //        console.log(rsp);
                //    }
                //});
            }
            if (status == 'g') {
                cpm_container2.html(last_cpm + " cpm");
            }
            if (status == 'b') {
                cpm_container3.html(last_cpm + " cpm");
            }
            end = new Date();
        }
    }
}

var getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}

var checkPlayer = function() {
    $.ajax({
        url: "controller.php",
        type: "GET",
        data: "phpsessid=" + getCookie("PHPSESSID") + "&count=true",
        success: function(rsp) {
            setTimeout('checkPlayer()', 1000);
        }
    });
}
