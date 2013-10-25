var key = function(e) {
    var el = $('#typer');
    var cur_char = null;
    var text = $('#text').html().substr(current_pos);
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
        el.val('');
    }
    if (chars == current_pos) {
        clearTimeout(refresh_handle);
        end = new Date();
        console.log(end);
    }

}

$(function() {
    var typer = $('#typer');
    typer.keyup(key);
    typer.keypress(key);
});
