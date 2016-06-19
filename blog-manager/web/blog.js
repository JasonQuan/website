var serverAddress = 'http://' + location.host + getContextPath();
function getContextPath() {
    var pathName = document.location.pathname;
    var index = pathName.substr(1).indexOf("/");
    var result = pathName.substr(0, index + 1);
    return result;
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
    newEle.find(".content").html(article.content);
    if (true) {//TODO: permission
        var $trash = $('<span class="ui-icon ui-icon-trash"></span>');
        var $refresh = $('<span class="ui-icon ui-icon-refresh"></span>');
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
    window.location.href = "m.html";
    var a = $('#' + aid);
    localStorage.draft_id = aid;
    localStorage.draft_title = a.find('.title').text();
    localStorage.draft_content = a.find('.content').html();
}