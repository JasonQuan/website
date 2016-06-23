var serverAddress = 'http://' + location.host + getContextPath();
function getContextPath() {
    var pathName = document.location.pathname;
    var index = pathName.substr(1).indexOf("/");
    var result = pathName.substr(0, index + 1);
    return result;
}

function loadCategory() {
    $('.tempMenu').remove();
    $.ajax({
        url: serverAddress + '/resources/article/category',
        async: false,
        type: 'get',
        success: readCategory});
}
var menu = $('<span id="SubMenu" class="tempMenu MenuSideMainLink bordersOfMenuSide" onclick="Showcase.openSubMenu(this);">'
        + '<img src="main/images/mono/misc.svg" />'
        + '<img src="main/images/mono/miscBlue.svg" class="hiddenIcons" />'
        + '<span class="MainLinkText"></span>'
        + '</span>');
var subMenu = $('<div class="tempMenu SubMenuLinkContainer"></div>');
function readCategory(data, textStatus, jqXHR) {
    var titles = $('#MENUSIDEindent');
    var cacheCategory = {version: 1, data: []};
    for (var i = 0; i < data.length; i++) {
        var newMenu = menu.clone();
        newMenu.find('.MainLinkText').text(data[i].name);
        newMenu.attr('id', data[i].id);
        titles.append(newMenu);
        var newSubMenu = subMenu.clone();
        var articles = data[i].articles;
        if (data[i].articles.length > 0) {
            for (var ii = 0; ii < articles.length; ii++) {
                newSubMenu.append($('<a class="SubMenuLink" href="#" onclick="viewArticle(\'' + articles[ii].id + '\');">' + articles[ii].title + '</a>'));
            }
        } else {
            newSubMenu.append($('<a class="SubMenuLink"></a>'));
        }
        titles.append(newSubMenu);
        cacheCategory.data.push({id: data[i].id, name: data[i].name});
    }
    restoreMenuState();
    localStorage.cache_category = JSON.stringify(cacheCategory);
}

function viewArticle(eid) {
    $.ajax({
        url: serverAddress + '/resources/article/article/' + eid,
        async: false,
        type: 'get',
        success: readArticle});
}
function readArticle(data) {
    //console.log(data);
    cleanContent();
    //update content
    var editorHtml = '<div class="ContentSideSections temp">'
            + '  <div class="Content100 overHidden TextShadow">'
            + '      <span class="fontSize28 TextShadow orange regularFont marginBottom10 dispBlock">'
            + '          <input type="hidden" id="uuid" value="' + data.id + '"/>'
            + '          <input type="hidden" id="category" value="' + data.category.id + '"/>'
            + '          <div class="title" id="radioset">'
            + data.title
            + '      </div>'
            + '  </span>'
            + '</div>'
            + '</div>'
            + '<div class="temp">'

            + '</div>'
            + '       <div id="SourceContentSide" class="temp ContentSideSections Source">'
            + '           <div class="Content100 overHidden TextShadow content">'
            + data.content
            + '           </div>'
            + '      </div>    ';
    $('#PFTopLinksCover').after($(editorHtml));
}

function cleanContent() {
    $('.temp').remove();
    $('#cke_content').remove();
}
function initIndex() {
//    if(sessionStorageoken){
//        if(sessionStorage.token.length > 0){
//            $('.opt').show();
//        }
//    }
    $.ajax({
        url: serverAddress + '/resources/article/index',
        async: false,
        type: 'get',
        success: readArticle});
}

function showMessage(msg) {
    var timestamp = Date.parse(new Date());
    $("<div id=" + timestamp + " class='message'></div>").html(msg).dialog({
        position: {at: 'right bottom'},
        show: {effect: "blind", duration: 500},
        hide: {effect: "blind", duration: 1000},
        open: function (event, ui) {
            setTimeout("$('#" + timestamp + "').dialog('close')", 2000);
            setTimeout("$('.ui-dialog').remove()", 3000);
        }
    });
    //$('.ui-dialog-titlebar').remove();
}

function login() {
    //console.log(0);
    $('.login').dialog({
        show: {effect: "blind", duration: 500},
        hide: {effect: "blind", duration: 500}
    });
    $('.button').button();
}
function doLogin() {
    $.ajax({
        url: serverAddress + '/resources/article/login/' + $('#loginId').val() + '/' + $('#password').val(),
        type: 'GET',
        complete: loginComplete
    });
}
function loginComplete(data) {
    if (data.status === 200) {
        //TODO:load editor js
        $('.login').dialog('close');
        var completeJson = JSON.parse(data.responseText);
        sessionStorage.token = completeJson.session;
        $(completeJson.sc1).appendTo(completeJson.ps);
        $(completeJson.sc2).appendTo(completeJson.ps);
        eval(completeJson.eval);
//        $('.opt').show();
        $('.button').button('refresh');
        showMessage("登陆成功");
    } else {
        //message
    }
}