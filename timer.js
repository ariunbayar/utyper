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
    var now = end;
    if (now == 0){
        now = new Date();
    }
    return (now - start) / 1000;
}
