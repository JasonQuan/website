if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
    CKEDITOR.tools.enableHtml5Elements(document);
}


CKEDITOR.config.height = 450;
CKEDITOR.config.width = 'auto';
CKEDITOR.on('instanceReady', function (e) {
    loadCacheData();
});
var initSample = (function () {
    var wysiwygareaAvailable = isWysiwygareaAvailable(),
            isBBCodeBuiltIn = !!CKEDITOR.plugins.get('bbcode');

    return function () {
        var editorElement = CKEDITOR.document.getById('content');
        if (isBBCodeBuiltIn) {
            loadCacheData();
            editorElement.setHtml(
                    'Hello world!\n\n' +
                    'I\'m an instance of [url=http://ckeditor.com]CKEditor[/url].'
                    );
        }
        if (wysiwygareaAvailable) {
            CKEDITOR.replace('content');
        } else {
            editorElement.setAttribute('contenteditable', 'true');
            CKEDITOR.inline('content');
        }
    };
    function isWysiwygareaAvailable() {
        if (CKEDITOR.revision == ('%RE' + 'V%')) {
            return true;
        }
        return !!CKEDITOR.plugins.get('wysiwygarea');
    }

})();

function initEditor() {
    if ($('#cke_content').length === 0) {
        cleanContent();
        initEditorHtml();
        initSample();
    }
}

function initEditorHtml() {
    var editorHtml = '<div class="ContentSideSections temp">'
            + '  <div class="Content100 overHidden TextShadow">'
            + '      <span class="fontSize28 TextShadow orange regularFont marginBottom10 dispBlock">'
            + '          <div class="title" id="radioset">'
            + '          <input type="hidden" id="uuid"/>'
            + '             <span>标题：</span><input id="title" maxlength="50"/><br/>'
            + '            <span class="button" onclick="cleanCache()">清空</span>'
            + '          <span class="button" onclick="submit(1)">保存</span>'
            + '          <span style="font-size:12px;">置顶：</span><input type="checkbox" id="isTop" name="isTop"/>'
            + '      </div>'
            + '  </span>'
            + '</div>'
            + '</div>'
            + '<div class="select_category temp orange">'
            + '        <span>标签:</span>'
            + '</div>'
            + '<div id="content" class="temp">'
            + '</div>';
    $('#PFTopLinksCover').after($(editorHtml));
    $(".button").button();
}
function loadCacheData() {
    var aid = localStorage.draft_id;
    if (aid !== undefined && aid !== null) {
        $('#uuid').val(localStorage.draft_id);
        $('#title').val(localStorage.draft_title);
        //draft_category
        CKEDITOR.instances.content.insertHtml(localStorage.draft_content);
    }
    //category
    var category = JSON.parse(localStorage.cache_category).data;
    var $e = $('.select_category');
    for (var i in category) {
        $e.append('<input type="radio" id="' + category[i].id + '" name="category" label="' + category[i].name + '"><label for="' + category[i].id + '">' + category[i].name + '</label>');
    }
    $e.buttonset();
    var draft_category = localStorage.draft_category;
    if (draft_category !== undefined && draft_category.length > 0) {
        $('input[id=' + draft_category + ']').attr('checked', 'checked');
    } else {
        $('input[name="category"]').first().attr('checked', 'checked');
    }
    $e.buttonset('refresh');
}
var serverAddress = 'http://' + location.host + getContextPath();
function getContextPath() {
    var pathName = document.location.pathname;
    var index = pathName.substr(1).indexOf("/");
    var result = pathName.substr(0, index + 1);
    return result;
}
function submit(type) {
    var content = CKEDITOR.instances.content.getData();
    var categoryId = $('label[aria-pressed="true"]').attr('for');
    var title = $('#title').val();
    if (content.length !== 0 || title.length !== 0) {
        updateArticle(type, categoryId, title, content);
    } else {
        //TOOD:message
        console.log('empty request');
    }
}

function updateArticle(type, categoryId, title, content) {
    $.ajax({
        url: serverAddress + '/resources/article/update',
        type: 'POST',
        data: JSON.stringify(
                {
                    id: $('#uuid').val(),
                    category: {id: categoryId},
                    token: sessionStorage.token,
                    status: type,
                    isTop: $('#isTop').is(":checked"),
                    title: title,
                    content: content
                }),
        contentType: "application/json;charset=GB2312",
        complete: send1ContentComplete,
        dataType: "json"
    });
}
function send1ContentComplete(data) {
    //console.log(data);
    if (data.status === 200) {
        $('#uuid').val(data.responseText);
        showMessage("已保存！");
    } else if (data.status === 400) {
        showMessage(data.responseText);
    } else {
        showMessage("保存失败！");
    }
}
function cleanCache() {
    //TODO:message
    $('#title').val('');
    $('#uuid').val('');
    CKEDITOR.instances.content.setData('');
    $('input[name="category"]').first().attr('checked', 'checked');
    $('.select_category').buttonset('refresh');
    localStorage.draft_id = '';
    localStorage.draft_title = '';
    localStorage.draft_category = '';
    localStorage.draft_content = '';
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
                newSubMenu.append($('<a class="SubMenuLink" href="#" onclick="showSubList(\'' + articles[ii].id + '\');">' + articles[ii].title + '</a>'));
            }
        } else {
            newSubMenu.append($('<a class="SubMenuLink"></a>'));
        }
        titles.append(newSubMenu);
//        if (data[i].categorys.length > 0) {
//            var newSubMenu = subMenu.clone();
//            for (var ii = 0; ii < data[ii].categorys.length; ii++) {
//                newSubMenu.append($('<a class="SubMenuLink" href="#" onclick="showSubList(' + data[ii].id + ');">' + data[ii].name + '</a>'));
//            }
//            titles.append(newSubMenu);
//        }

        cacheCategory.data.push({id: data[i].id, name: data[i].name});
    }
    restoreMenuState();
    localStorage.cache_category = JSON.stringify(cacheCategory);
}

function showSubList(categoryId) {
    $.ajax({
        url: serverAddress + '/resources/article/article/' + categoryId,
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

function deleteDiary() {
    $.ajax({
        url: serverAddress + '/resources/article/remove/' + $('#uuid').val() + '/' + sessionStorage.token,
        async: false,
        type: 'get',
        success: deleteDiarySuccess});
}
function deleteDiarySuccess(data) {
    loadCategory();
    initIndex();
    showMessage('删除成功');
}
function updateDiary() {
    if (localStorage.draft_id !== undefined && localStorage.draft_id !== null) {
        //TODO: message        
    }
    localStorage.draft_id = $('#uuid').val();
    localStorage.draft_title = $('.title').text();
    localStorage.draft_category = $('#category').val();
    localStorage.draft_content = $('.content').html();
    initEditor();
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
        //
        sessionStorage.token = data.responseText;
        $('.login').dialog('close');
        $('.opt').show();
        $('.button').button('refresh');
        showMessage("登陆成功");
    } else {
        //message
    }
}