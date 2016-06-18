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
        newArticle(data[i].title, data[i].content);
    }
}
function newArticle(title, content) {
    var newEle = $('#template').clone();
    newEle.removeClass('hidden');
    newEle.find(".title").text(title);
    newEle.find(".content").text(content);
    $('.articles').append(newEle);
}