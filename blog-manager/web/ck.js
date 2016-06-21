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
function loadCacheData() {
    var aid = localStorage.draft_id;
    if (aid !== undefined && aid !== null) {
        $('#uuid').val(localStorage.draft_id);
        $('#title').val(localStorage.draft_title);
        CKEDITOR.instances.content.insertHtml(localStorage.draft_content);
    }
    //category
    var category = JSON.parse(localStorage.cache_category).data;
    var $e = $('.select_category');
    for (var i in category) {
        $e.append('<input type="radio" id="' + category[i].id + '" name="category" label="' + category[i].name + '"><label for="' + category[i].id + '">' + category[i].name + '</label>');
    }
    $e.buttonset();
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
    var category = $('input[name="category"]:checked');
    var title = $('#title').val();
    if (content.length !== 0 || title.length !== 0) {
        send1Content(type, category, title, content);
    } else {
        //TOOD:message
        console.log('empty request');
    }
}

function send1Content(type, category, title, content) {
    $.ajax({
        url: serverAddress + '/resources/article/update',
        type: 'POST',
        data: JSON.stringify(
                {
                    id: $('#uuid').val(),
                    categoryId: category.attr('id'),
                    categoryName: category.attr('label'),
                    status: type,
                    title: title,
                    content: content
                }),
        contentType: "application/json;charset=GB2312",
        complete: send1ContentComplete,
        dataType: "json"
    });
}
function send1ContentComplete(data) {
    console.log(data);
    if (data.status === 200) {
        $('#uuid').val(data.responseText);
    }
}
function cleanCache() {
    //TODO:message
    $('#title').val('');
    CKEDITOR.instances.content.setData('');
    localStorage.draft_id = '';
    localStorage.draft_title = '';
    localStorage.draft_content = '';
}

function loadCategory() {
    $.ajax({
        url: serverAddress + '/resources/article/category',
        async: false,
        type: 'get',
        success: readCategory});
}
var menu = $('<span id="SubMenu-Misc" class="MenuSideMainLink bordersOfMenuSide" onclick="Showcase.openSubMenu(this);">'
        + '<img src="main/images/mono/misc.svg" />'
        + '<img src="main/images/mono/miscBlue.svg" class="hiddenIcons" />'
        + '<span class="MainLinkText"></span>'
        + '</span>');
var subMenu = $('<div class="SubMenuLinkContainer"></div>');
function readCategory(data, textStatus, jqXHR) {
    var titles = $('#MENUSIDEindent');
    var cacheCategory = {version: 1, data: []};
    for (var i = 0; i < data.length; i++) {
        var newMenu = menu.clone();
        newMenu.find('.MainLinkText').text(data[i].name);
        titles.append(newMenu);
        if (data[i].categorys.length > 0) {
            var newSubMenu = subMenu.clone();
            for (var ii = 0; ii < data[ii].categorys.length; ii++) {
                newSubMenu.append($('<a class="SubMenuLink" href="#">' + data[ii].name + '</a>'));
            }
            titles.append(newSubMenu);
        }

        cacheCategory.data.push({id: data[i].id, name: data[i].name});
    }
    localStorage.cache_category = JSON.stringify(cacheCategory);
}