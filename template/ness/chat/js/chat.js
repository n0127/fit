function send(url, callback) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTF");
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (callback && xhr.status == 200 && xhr.responseText != '') {
                callback(xhr.responseText)
            }
        }
    }
    xhr.send();
}

HTMLElement.prototype.appendHTML = function (html, target) {
    var divTemp = document.createElement("div");
    var fragment = document.createDocumentFragment();
    divTemp.innerHTML = html;
    divTemp.childNodes.forEach(item => {
        fragment.appendChild(item.cloneNode(true));
    })
    if (target == undefined) {
        this.appendChild(fragment);
    } else {
        this.insertBefore(fragment, target);
    }
    fragment = null;
};

function _$(fun) {
    if (typeof fun != "function") {
        throw new typeError('The argument passed in is not a function');
    } else {
        var doc = document;
        if (doc.addEventListener) {
            doc.addEventListener("DOMContentLoaded", fun, false);
        } else {
            doc.onreadystatechange = function () {
                if (doc.readyState == 'loader' || doc.readyState == 'complete' || doc.readyState == 'interactive') {
                    fun();
                }
            }
        }
    }
}

var chatKey = "chatKey";
var chatMsgKey = "chatMsgKey";

var _chatAdmin = "admin";
var _delIndex = -1;

var chatMsgList = localStorage[chatMsgKey];
chatMsgList = chatMsgList == undefined ? {} : JSON.parse(chatMsgList);

var chatName = localStorage[chatKey];
var chatBox = document.querySelector(".mk-chat-box");

if (chatName == undefined) {
    document.querySelector(".login").style.display = "block";
} else {
    document.getElementById("talk").style.display = "block";
}

var keyboard = function (e) {
    if (13 == e.keyCode) return chatName == undefined ? login() : send_msg();
}
document.addEventListener('keypress', keyboard);
document.onkeypress = keyboard;


function login() {
    chatName = document.getElementById("nick").value;
    if (chatName == '') {
        for (var i = 0; i < 5; i++) {
            var ranNum = Math.ceil(Math.random() * 25);
            chatName += String.fromCharCode(65 + ranNum);
        }

    } else if (chatName == _chatAdmin) {
        chatBox.appendHTML('<div class="tips"><span>\u4fdd\u7559\u8bcd,\u8bf7\u66f4\u6362</span></div>')
        return;
    } else if (chatName == "_admin") {
        chatName = _chatAdmin;
        get_msg();
    }
    localStorage.setItem(chatKey, chatName);

    document.querySelector(".login").style.display = "none";
    document.getElementById("talk").style.display = "block";

}

function skin(setting) {
    var body = document.getElementsByTagName("body")[0];
    var skinKey = "_skin";
    var skinValue = localStorage.getItem(skinKey);
    skinValue = skinValue == undefined ? "default" : skinValue;
    if (setting) {
        var match = document.cookie.match(/ec_style=(hei|bai)|free=/)
        if (match) {
            body.classList.remove("black");
            if (match[1] == "hei") {
                body.classList.add("black");
            } else {
                body.classList.add("default");
            }
        } else {
            document.getElementById("skin").style.display = "inline";
            body.classList.add(skinValue);
        }

        return
    }
    if (skinValue == 'black') {
        body.classList.remove("black");
        window.localStorage.setItem(skinKey, "default");
    } else {
        body.classList.add("black");
        window.localStorage.setItem(skinKey, "black");
    }
}

function reset() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

function send_msg() {

    var sendButton = document.getElementById("send");

    if (sendButton.classList.contains("disabled")) {
        return;
    }

    var msg = document.getElementById("msg").value;
    if (msg.length < 1) {
        chatBox.appendHTML('<div class="tips"><span>\u5185\u5bb9\u4e3a\u7a7a</span></div>')
        reset();
        return;
    }

    sendButton.classList.add("disabled");


    chatMsgList[msg] = false;
    save_msg();


    var param;
    if (chatName == _chatAdmin) {
        var msgLen = msg.lastIndexOf(" ");

        if (msgLen <= 0) {
            chatBox.appendHTML('<div class="tips"><span>\u683c\u5f0f\u4e0d\u5bf9</span></div>')
            reset();
            sendButton.classList.remove("disabled")
            return;
        }
        //第一个是地址 第二个是片名
        param = "msg=" + msg.substr(msgLen + 1) + "&type=sys&name=" + msg.substr(0, msgLen);
    } else {
        param = "msg=" + msg + "&type=msg&name=" + chatName;
    }

    send("chat.php?" + param, function (data) {

        if (data == 'ok') {
            add_msg(chatName, msg, "right");

            setTimeout(function () {
                sendButton.classList.remove("disabled")
            }, 3000)

            if (_chatAdmin != chatName) {
                chatBox.appendHTML('<div class="tips"><span class="tips-info">\u0032\u0034\u5c0f\u65f6\u5185\u56de\u590d\u002c\u53ef\u968f\u65f6\u67e5\u770b\u8fdb\u5ea6</span></div>');
                reset();
            } else {
                _del_msg(msg);
            }

        }

    });

}


_$(function () {
    skin(true);
    get_msg();
})

function _del_msg(e, index) {
    var msg = e;
    if (typeof e != "string") {
        msg = e.innerText;
    }
    if (msg == undefined || chatName != _chatAdmin) {
        return;
    }
    if (index == undefined) {
        if (_delIndex < 0) {
            return;
        } else {
            index = _delIndex;
        }
    }

    send("chat.php?" + "msg=" + msg + "&type=msg&name=" + chatName + "&key=" + index, function (data) {
        chatBox.appendHTML('<div class="tips"><span class="tips-danger">\u5220\u9664\u6210\u529f</span></div>');
        reset();
        if (typeof e != "string") {
            e.parentNode.style.display = "none";
        }
    });
}

function save_msg() {
    if (Object.keys(chatMsgList).length > 100) {
        chatMsgList = {};
    }
    localStorage.setItem(chatMsgKey, JSON.stringify(chatMsgList));
}

function get_msg() {


    send("/json/" + (chatName == _chatAdmin ? "audit" : "verify") + ".json?t=" + new Date().getTime(), function (msg_data) {

        msg_data = JSON.parse(msg_data);
        var tipsHtml = "";
        var contentHtml = "";

        for (var key in msg_data) {

            if (msg_data[key].type == 'sys') {

                var hasUpdate = chatMsgList[msg_data[key].name]

                if (hasUpdate == false) {
                    var tips;
                    var tipsClass;
                    if (msg_data[key].msg.startsWith("/")) {
                        tips = '<a  target="_blank"  href="' + msg_data[key].msg + '">' + msg_data[key].name + '</a>\u5df2\u66f4\u65b0';
                        tipsClass = "tips-success";
                    } else {
                        tips = '<a  href="javascript:void(0)">' + msg_data[key].name + '</a><strong>' + msg_data[key].msg + '</strong>';
                        tipsClass = "tips-warning";
                    }

                    tipsHtml += '<div class="tips"><span class=' + tipsClass + '>\u7cfb\u7edf\u6d88\u606f\uff1a' + tips + '</span></div>'
                    delete chatMsgList[msg_data[key].name];

                    send("chat.php?" + "msg=" + msg_data[key].msg + "&type=sys&name=" + msg_data[key].name + "&key=" + key);

                    save_msg();
                }
            } else {
                contentHtml += '<div class="' + (msg_data[key].name == chatName ? "right" : "left") + ' msg"><img class="head" src="' + letter_avatar(msg_data[key].name, 32) + '" /><span class="name">' + msg_data[key].name + '</span><span onclick="_delIndex=' + key + ';document.getElementById(\'msg\').value=this.innerText.trim()+\' /vod/detail/id/\'" ondblclick="_del_msg(this,' + key + ')" class="content">' + msg_data[key].msg + "</span><span class='time'>" + new Date(msg_data[key].time * 1000).toLocaleString() + "</span></div>"
            }
        }

        chatBox.appendHTML(tipsHtml + contentHtml);
    })

}


function add_msg(name, content, clas) {
    chatBox.appendHTML('<div class="' + clas + ' msg"><img class="head" src="' + letter_avatar(name, 32) + '" /><span class="name">' + name + '</span><span class="content">' + content + "</span></div>");
    reset();
}

function letter_avatar(a, b, f) {
    b = b || 60;
    var g = "#1abc9c #2ecc71 #3498db #9b59b6 #34495e #16a085 #27ae60 #2980b9 #8e44ad #2c3e50 #f1c40f #e67e22 #e74c3c #00bcd4 #95a5a6 #f39c12 #d35400 #c0392b #bdc3c7 #7f8c8d".split(" ");
    a = String(a || "").split(" ");
    a = 1 == a.length ? a[0] ? a[0].charAt(0) : "?" : a[0].charAt(0) + a[1].charAt(0);
    window.devicePixelRatio && (b *= window.devicePixelRatio);
    var h = (("?" == a ? 72 : a.charCodeAt(0)) - 64) % 20;
    var d = document.createElement("canvas");
    d.width = b;
    d.height = b;
    var e = d.getContext("2d");
    e.fillStyle = f ? f : g[h - 1];
    e.fillRect(0, 0, d.width, d.height);
    e.font = Math.round(d.width / 2) + "px 'Microsoft Yahei'";
    e.textAlign = "center";
    e.fillStyle = "#FFF";
    e.fillText(a, b / 2, b / 1.5);
    return d.toDataURL()
}