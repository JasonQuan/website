var serverAddress = 'http://' + location.host + getContextPath();
function getContextPath() {
    var pathName = document.location.pathname;
    var index = pathName.substr(1).indexOf("/");
    var result = pathName.substr(0, index + 1);
    return result;
}
function loadTitles() {
    $.ajax({
        url: serverAddress + '/resources/article/titles',
        async: false,
        type: 'get',
        success: readTitles});
}
function readTitles(data, textStatus, jqXHR) {
    var titles = $('.titles');
    for (var i = 0; i < data.length; i++) {
        titles.append('<li>' + data[i].title + '</li>');
    }
}
function loadContent() {
    $.ajax({
        url: serverAddress + '/resources/article/list',
        async: false,
        type: 'get',
        success: readlist});
}
function readlist(data, textStatus, jqXHR) {
    $('#loading').remove();
    for (var i = 0; i < data.length; i++) {
        newArticle(data[i]);
    }
}
function newArticle(article) {
    var newEle = $('#template').clone();
    newEle.removeClass('hidden');
    newEle.attr('id', article.id);
    newEle.find(".title").text(article.title);
    newEle.find(".create_date").text(article.createTime);
    newEle.find(".a_content").html(article.content);
    if (true) {//TODO: permission
        var $trash = $('<span class="ui-icon ui-icon-trash trash"></span>');
        var $refresh = $('<span class="ui-icon ui-icon-refresh refresh"></span>');
        $trash.click(function () {
            var aid = $(this).parent().parent().parent().parent().attr('id');
            removeA(aid);
            $('#' + aid).remove();
        }).hover(
                function () {
                    $(this).addClass("ui-state-hover");
                },
                function () {
                    $(this).removeClass("ui-state-hover");
                }
        );
        $refresh.click(function () {
            var aid = $(this).parent().parent().parent().parent().attr('id');
            editA(aid);
            console.log(($(this).parent().parent().parent().parent().attr('id')));
        }).hover(
                function () {
                    $(this).addClass("ui-state-hover");
                },
                function () {
                    $(this).removeClass("ui-state-hover");
                }
        );
        ;
        newEle.find(".create_date").parent().append($trash).append($refresh);
    }
    $('.articles').append(newEle);
}
function removeA(aid) {
    $.ajax({
        url: serverAddress + '/resources/article/remove/' + aid,
        async: false,
        type: 'get',
        success: readlist});
}
function editA(aid) {
    if (localStorage.draft_id !== undefined && localStorage.draft_id !== null) {
        //TODO: message        
    }
    var a = $('#' + aid);
    localStorage.draft_id = aid;
    localStorage.draft_title = a.find('.title').text();
    localStorage.draft_content = a.find('.a_content').html();
    window.location.href = "m.html";
}