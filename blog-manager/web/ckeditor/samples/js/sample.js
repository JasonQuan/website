if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
    CKEDITOR.tools.enableHtml5Elements(document);
}


CKEDITOR.config.height = 150;
CKEDITOR.config.width = 'auto';
CKEDITOR.on('instanceReady', function (e) {
    loadCacheData();
})
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
    if (aid != undefined && aid !== null) {
        $('#uuid').val(localStorage.draft_id);
        $('#title').val(localStorage.draft_title);
        CKEDITOR.instances.content.insertHtml(localStorage.draft_content);
    }
}
var serverAddress = 'http://' + location.host + getContextPath();
function getContextPath() {
    var pathName = document.location.pathname;
    var index = pathName.substr(1).indexOf("/");
    var result = pathName.substr(0, index + 1);
    return result;
}
function submit(type) {
    send1Content(type, $('#title').val(), CKEDITOR.instances.content.getData());
}

function send1Content(type, title, content) {
    $.ajax({
        url: serverAddress + '/resources/article/update',
        type: 'POST',
        data: JSON.stringify({id: $('#uuid').val(), status: type, title: title, content: content}),
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

