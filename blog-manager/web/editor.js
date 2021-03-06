
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
if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
    CKEDITOR.tools.enableHtml5Elements(document);
}
CKEDITOR.config.height = 550;
CKEDITOR.config.width = 'auto';
//CKEDITOR.config.toolbarCanCollapse = true;
CKEDITOR.on('instanceReady', function (e) {
    loadCacheData();
});
var initSample = (function () {
    var wysiwygareaAvailable = isWysiwygareaAvailable(),
            isBBCodeBuiltIn = !!CKEDITOR.plugins.get('bbcode');

    return function () {
        var editorElement = CKEDITOR.document.getById('content');
        if (isBBCodeBuiltIn) {
            editorElement.setHtml('');
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
        complete: updateArticleComplete,
        dataType: "json"
    });
}
function updateArticleComplete(data) {
    //console.log(data);
    if (data.status === 200) {
        $('#uuid').val(data.responseText);
        loadCategory();
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
function initEditor() {
    if ($('#cke_content').length === 0) {
        cleanContent();
        initEditorHtml();
        initSample();
    }
}
function initLogin() {
    $('#delete').removeAttr('onclick').click(function () {
        deleteDiary();
    });
    $('#edit').removeAttr('onclick').click(function () {
        updateDiary();
    });
    $('#write').removeAttr('onclick').click(function () {
        initEditor();
    });
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