var total_chars = 0;
var current_pos = 0;
var chars = -1;
var start = 0;
var end = 0;
var cpm = 0;
var refresh_handle = null;

$(function(){
    var random_number = Math.floor((Math.random()*5)+1);
    $('#text').html($('#hidden_text' + random_number).html());
    timer();
});

var timer = function() {
    var countdown_el = $('#timer');
    var content_el = $('#text');
    var countdown = 5;

    if (countdown_el.data('countdown')) {
        countdown = countdown_el.data('countdown') - 1;
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
        setTimeout('timer();', 1000);
    } else {
        startRace();
    }
}

var startRace = function() {
    setTimeout('refresh();', 100);
    total_chars = $('#text').html().length;
    chars = 0;
    start = new Date();
    $('#timer').hide();
    $('#typer').focus();
}

var getSecondsPassed = function() {
    if (end){
        now = end;
    }else{
        now = new Date();
    }
    return (now - start) / 1000;
}

var refresh = function() {
    var cpm_container = $('#cpm');
    cpm = chars / getSecondsPassed() * 60;
    cpm_container.html(Math.round(cpm)+" cpm");
    refresh_handle = setTimeout('refresh();', 1000);
}

var key = function(e) {
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

$(function() {
    var typer = $('#typer');
    typer.keyup(key);
    typer.keypress(key);
});

var commands = {
    menu: function(){
            $("#game").hide();
            $("#menu").show();
    }
}
