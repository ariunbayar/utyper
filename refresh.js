var refresh = function() {
    var cpm_container = $('#cpm');
    cpm = chars / getSecondsPassed() * 60;
    cpm_container.html(Math.round(cpm));
    refresh_handle = setTimeout('refresh();', 1000);
}
