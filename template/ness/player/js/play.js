//全局开关
//mui-player.min.js 找到 $method.toggleControlsDisplay({type:e.type||"timer"})}, 前添加if(_isCloseControl()){return}
//长按事件
//long-press-event.min.js 搜索clearTimeout 增加了 if(_video.playbackRate===3){_video.playbackRate=1}
window.addEventListener("load", () => {
    console.log(`页面加载完毕消耗了${Math.round(performance.now() * 100) / 100}ms`);
});
document.oncontextmenu = function () {
    return false;
};
document.onselectstart = function () {
    return false;
};
document.oncontextmenu = function () {
    return false;
};
document.onkeydown = function () {
    if (window.event && window.event.keyCode === 123) {
        event.keyCode = 0;
        event.returnValue = false;
        return false;
    }
};
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

function getRequest() {
    var url = location.search;
    var theRequest = {};
    if (url.indexOf("?") != -1) {
        var strs = url.substr(1).split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

var request = getRequest();
var _video;
var _config;
var _reloadCount = 0;
var _reloadAsync = false;
var mp;
var playerConfig;
var danmaku;
var dmkuId;
var dmkCallback;
var dmkuFont = "25";
var dmkuColor = "FFFFFF";
var dmkuTime = 0;


function _loadType() {
    if (_type == 'm3u8') {
        playerConfig.parse = {
            type: 'hls', loader: Hls, config: {
                debug: false, p2pConfig
            }
        };
    } else if (_type == 'flv') {
        playerConfig.parse = {
            type: 'flv', loader: flvjs, config: {
                cors: true,
            },
        };
    } else {
        playerConfig.parse = {}
    }
}


//控制弹幕的时候不关闭
function _isCloseControl() {
    var _process = document.getElementById("progress");
    return _process != undefined && _process.style.display == "none";
}

function _decrypt(data, pwd) {
    var cipher = '';
    var key = [];
    var box = [];
    var pwd_length = pwd.length;
    var data_length = data.length;
    var tmp;
    var k;
    for (var i = 0; i < 256; i++) {
        key[i] = pwd[i % pwd_length].charCodeAt();
        box[i] = i;
    }
    for (var j = i = 0; i < 256; i++) {
        j = (j + box[i] + key[i]) % 256;
        tmp = box[i];
        box[i] = box[j];
        box[j] = tmp;
    }
    for (var a = j = i = 0; i < data_length; i++) {
        a = (a + 1) % 256;
        j = (j + box[a]) % 256;
        tmp = box[a];
        box[a] = box[j];
        box[j] = tmp;
        k = box[((box[a] + box[j]) % 256)];
        cipher += String.fromCharCode(data[i].charCodeAt() ^ k);
    }
    return cipher;
}

function _player(config) {
    if (_device == 'n') {
        alert("本播放器在IE浏览器和兼容模式下无法播放，请将浏览器设置为 极速模式！");
        return;
    }
    var url = config.direct == undefined ? _decrypt(window.atob(config.url), config.id == undefined ? '1234' : config.id) : config.direct;
    if (url == '') {
        repair(config.line != 'b' ? 'true' : undefined);
        return;
    }
    var title = decodeURIComponent(config.title);
    title = title.length > 9 ? title.substring(0, 7) + config.line + "..." : title + config.line;
    if (mp) {
        _loadType();
        mp.reloadUrl(url);
        _video.play();
        document.getElementById("title-name").innerText = title;
        return;
    }
    var body = document.getElementsByTagName("body")[0];
    body.innerHTML = "";
    body.appendHTML(`<div class=content id=mui-player><template slot=download><svg height=20 width=20 viewbox="0 0 1024 1024" xmlns=http://www.w3.org/2000/svg><path d="M258.402 433.521l202.221 202.256c13.723 13.675 31.975 21.201 51.369 21.201 19.439 0 37.688-7.544 51.394-21.25l202.216-202.202c15.794-15.799 15.794-41.489 0-57.283-7.649-7.651-17.821-11.861-28.639-11.861s-20.989 4.211-28.639 11.861L552.503 532.046 552.503 94.211c0-22.341-18.168-40.505-40.505-40.505-22.337 0-40.5 18.171-40.5 40.505L471.498 532.08 315.68 376.243c-7.649-7.651-17.822-11.861-28.639-11.861-10.818 0-20.988 4.212-28.639 11.861-7.651 7.649-11.863 17.822-11.863 28.639S250.753 425.872 258.402 433.521zM811.947 160.836c-22.337 0-40.5 18.163-40.5 40.5s18.169 40.5 40.5 40.5c48.551 0 88.051 39.501 88.051 88.052l0 471.348c0 48.552-39.501 88.052-88.051 88.052L212.053 889.288c-48.552 0-88.051-39.501-88.051-88.052L124.002 329.888c0-48.552 39.496-88.052 88.051-88.052 22.337 0 40.5-18.163 40.5-40.5s-18.169-40.5-40.5-40.5C118.836 160.836 43 236.67 43 329.891l0 471.348c0 93.218 75.833 169.055 169.053 169.055l0 0 599.894 0c93.217 0 169.053-75.834 169.053-169.055L981 329.891C981 236.672 905.167 160.836 811.947 160.836z" fill=#ffffff></path></svg></template><template slot=castScreen><svg height=20 width=20 viewbox="0 0 1024 1024" xmlns=http://www.w3.org/2000/svg><path d="M853.015273 814.545455h-161.419637a34.909091 34.909091 0 0 1 0-69.818182h161.419637A54.690909 54.690909 0 0 0 907.636364 690.106182V264.075636A54.690909 54.690909 0 0 0 853.015273 209.454545H170.961455A54.667636 54.667636 0 0 0 116.363636 264.075636v426.030546A54.667636 54.667636 0 0 0 170.961455 744.727273h141.358545a34.909091 34.909091 0 0 1 0 69.818182H170.961455A124.555636 124.555636 0 0 1 46.545455 690.106182V264.075636A124.555636 124.555636 0 0 1 170.961455 139.636364h682.053818A124.578909 124.578909 0 0 1 977.454545 264.075636v426.030546A124.578909 124.578909 0 0 1 853.015273 814.545455zM674.909091 907.636364H349.090909l162.909091-209.454546 162.909091 209.454546z" fill=#ffffff></path></svg></template><template slot=nextMedia><svg height=20 width=20 viewbox="0 0 1024 1024" xmlns=http://www.w3.org/2000/svg><path d="M783.14692466 563.21664097L240.85307534 879.55472126c-39.1656664 24.10194914-90.38230866-6.02548665-90.38230865-51.21664226v-632.676158c0-45.19115433 51.21664097-75.31859011 90.38230865-51.21664226l542.29384932 316.33808029c39.1656664 21.08920518 39.1656664 81.34407804 0 102.43328194z" fill=#ffffff></path><path d="M873.52923331 734.94302767c0 42.17841036-39.1656664 78.33133408-90.38230865 78.33133407s-90.38230866-36.15292371-90.38230735-78.33133407V289.05697233c0-42.17841036 39.1656664-78.33133408 90.38230735-78.33133407s90.38230866 36.15292371 90.38230865 78.33133407v445.88605534z" fill=#ffffff></path></svg></template><template slot=danmaku-icon><svg viewbox="0 0 68 65" xmlns=http://www.w3.org/2000/svg><path d=M45.7,31.48a3,3,0,0,1,2,.52,3.65,3.65,0,0,1,.39,2.19V40.1c0,1.29-.77,2-2.32,2.06H42.48a.34.34,0,0,0-.39.39L42,45.64a.34.34,0,0,0,.39.38h3c1.89-.17,2.74.69,2.57,2.58V54a10.88,10.88,0,0,1-.64,4.12c-.69,1.8-3,2.4-7,1.8a1.81,1.81,0,0,1-1.67-1.8c.17-1.12.77-1.63,1.8-1.55q4.5.78,4.12-1.67V49.75a.34.34,0,0,0-.39-.38H40.81q-2.72.39-2.32-3l.26-5.66c0-1.46.81-2.15,2.44-2.06h3.09a.34.34,0,0,0,.39-.39v-3a.34.34,0,0,0-.39-.38H40a1.71,1.71,0,0,1-1.67-1.8,1.83,1.83,0,0,1,1.8-1.68Zm14,3.48,1.8-3.61a1.7,1.7,0,0,1,2.32-.9,1.59,1.59,0,0,1,.9,2.19c-.34.77-.73,1.55-1.16,2.32h.9c1.63,0,2.45.9,2.45,2.7v9.78c.17,1.71-.82,2.53-3,2.44H59.72v2.19h7a1.59,1.59,0,0,1,1.54,1.67,1.46,1.46,0,0,1-1.41,1.68H59.72v4.37c-.09.86-.64,1.33-1.67,1.42-1-.09-1.59-.56-1.67-1.42V55.42H49.94a1.68,1.68,0,0,1,0-3.35h6.44V49.88H52.13c-2.15.18-3.13-.77-3-2.83V37.66c-.09-1.89.73-2.79,2.44-2.7h1a11.88,11.88,0,0,0-1-2.32,1.54,1.54,0,0,1,.78-2.32,1.74,1.74,0,0,1,2.44.91c.52,1,1.07,2.27,1.67,3.73Zm-7.08,6.17h3.74V37.92H53c-.26,0-.39.12-.39.38Zm3.74,5.79V43.71H52.64v2.83c.09.25.22.38.39.38Zm3.34-5.79h3.73V38.3a.33.33,0,0,0-.38-.38H59.72Zm0,5.79h3.35a.78.78,0,0,0,.38-.38V43.71H59.72Z style=fill:#fff></path><path d=M53.64,6.83c-6.22-.13-12.45,0-18.68,0v0c-6.56,0-13.12-.15-19.67,0C7.84,7.09,2.15,12.55,2,19.89Q1.63,34.13,2,48.38A13.16,13.16,0,0,0,14,61.09c4.24.33,8.51.14,12.77.16,1.56,0,3.15-.17,3-2.26S28,57,26.54,57c-3.44,0-6.89.11-10.32,0-6-.27-9.88-4-10-9.92q-.32-13,0-26c.13-5.74,3.9-9.73,9.56-9.83,12.78-.23,25.57-.21,38.35,0,5.69.09,9.35,4,9.76,9.69.14,2,0,3.93.09,5.89a2,2,0,0,0,2.12,2.16,1.85,1.85,0,0,0,2-1.75C69.32,17.26,66.49,7.08,53.64,6.83Z style=fill:#fff></path><path d=M42.38,17.77H21.8c-1.43,0-2.73.39-2.91,2-.22,2,1.31,2.49,2.86,2.51q10.29.07,20.58,0c1.54,0,3.09-.48,2.91-2.47C45.09,18.17,43.8,17.77,42.38,17.77Z style=fill:#fff></path><path d=M33.1,29.59c-1.47.11-2.58.81-2.41,2.4.2,1.9,1.8,2.14,3.29,2s2.53-.69,2.45-2.54C36,29.79,34.66,29.47,33.1,29.59Z style=fill:#fff></path><path d=M27.29,31.88a2.5,2.5,0,0,0-2.49-2.49H15.72a2.49,2.49,0,1,0,0,5H24.8A2.49,2.49,0,0,0,27.29,31.88Z style=fill:#fff></path><path d=M18.11,46.12h9.08a2.49,2.49,0,1,0,0-5H18.11a2.49,2.49,0,1,0,0,5Z style=fill:#fff></path></svg></template><template slot=line><svg width=22 height=22 viewbox="0 0 1024 1024" xmlns=http://www.w3.org/2000/svg><path d="M233.92 230.250667l61.76 61.76A255.872 255.872 0 0 0 170.666667 512c0 139.2 111.125333 252.458667 249.493333 255.914667L426.666667 768h96.469333l-65.536-65.536 60.330667-60.330667 25.365333 25.365334-0.064 0.085333 166.741333 166.72c-31.893333 11.157333-65.92 17.706667-101.333333 18.837333l-0.192 0.170667-0.170667-0.149333-5.461333 0.128L597.333333 853.333333h-170.666666c-188.522667 0-341.333333-152.810667-341.333334-341.333333 0-116.992 58.88-220.245333 148.586667-281.749333zM597.333333 170.666667c188.522667 0 341.333333 152.810667 341.333334 341.333333 0 116.992-58.88 220.245333-148.586667 281.749333l-61.76-61.76A255.872 255.872 0 0 0 853.333333 512c0-141.376-114.624-256-256-256h-96.469333l65.514667 65.514667-60.330667 60.330666-118.016-118.037333 0.064-0.042667-74.069333-74.069333a340.288 340.288 0 0 1 101.333333-18.837333L415.509333 170.666667l0.213334 0.170666 5.44-0.128L426.666667 170.666667h170.666666z" fill=#ffffff></path></svg></template></div>`)

    playerConfig = {
        container: '#mui-player',
        title: title,
        themeColor: "#66CCCC",
        src: url,
        poster: 'img/background.png',
        autoplay: true,
        initFullFixed: true,
        preload: 'auto',
        autoOrientaion: true,
        dragSpotShape: 'square',
        lang: 'zh-cn',
        volume: '1',
        videoAttribute: [{attrKey: 'webkit-playsinline', attrValue: 'webkit-playsinline'}, {
            attrKey: 'playsinline', attrValue: 'playsinline'
        }, {attrKey: 'x5-video-player-type', attrValue: 'h5-page'}, {
            attrKey: 'x-webkit-airplay', attrValue: 'allow'
        }, {attrKey: 'controlslist', attrValue: 'nodownload'}]

    }

    if (_device == 'p') {
        playerConfig.plugins = [new MuiPlayerDesktopPlugin({
            leaveHiddenControls: true, fullScaling: 1, contextmenu: [{
                name: 'muiplayer', context: "NX", zIndex: 0, show: true, click: function () {
                    window.open("#", '_blank');
                }
            }]
        })];
    } else {
        playerConfig.plugins = [new MuiPlayerMobilePlugin({
            key: '01F01H01E01F01I01E01E01I01D01F01D01E01E01L01L',
            showMenuButton: true,
            hotKeyConfig: {luminanceHandle: true},
            defaultMenuConfig: {showLoopSwitch: false}
        })];
    }

    _loadType();

    var nextControl;
    if (!!config.next) {
        nextControl = {
            slot: 'nextMedia', position: 'left', tooltip: '下一集', oftenShow: true, click: function (e) {
                top.location.href = config.next;
            },
        };
    } else {
        nextControl = {};
    }
    playerConfig.custom = {
        headControls: [{
            slot: 'download', click: function (e) {
                if (_device == 'i') {
                    mp.showToast("暂不支持下载,请耐心等候..", 2000);
                    return;
                }
                var downAdKey = "downAdKey";
                var downCount = localStorage[downAdKey];
                if (downCount == undefined) {
                    downCount = 0;
                }
                var downCallback = function (count) {
                    localStorage[downAdKey] = count;
                    ness.addDown(encodeURIComponent(url), config.title);
                    mp.showToast('下载成功,请去[我的]->[下载记录]查看', 5000);
                }
                if (downCount < 1) {
                    try {
                        ness.loadVideo();
                        downCallback(2);
                    } catch (e) {
                    }
                } else {
                    downCallback(downCount - 1);
                }
            }
        }, {
            slot: 'castScreen', click: function (e) {
                if (_device == 'i') {
                    if (window.WebKitPlaybackTargetAvailabilityEvent) {
                        _video.webkitShowPlaybackTargetPicker();
                    } else {
                        mp.showToast("请点击右下角全屏后在点击左下角投屏软件", 2000);
                    }
                    return;
                }

                try {
                    ness.playDlna(encodeURI(url));
                } catch (e) {
                    mp.showToast("投屏失败", 2000);
                }

            }
        }, {
            slot: 'line', click: function (e) {
                repair('true')
            }
        }], footerControls: [{
            slot: 'danmaku-icon', position: 'right', tooltip: '弹幕', oftenShow: true, click: function (e) {
                dmkuId = config.id;
                document.getElementById("progress").style.display = "none";
                document.querySelector(".danmuku-root").style.display = "flex";
                if (localStorage['dmkuSwitch'] == 'off') {
                    document.querySelector(".danmuku-switch").click();
                }
            }
        }, nextControl]
    };
    mp = new MuiPlayer(playerConfig);
    var ratechange = "ratechange";
    mp.on('ready', function () {
        _video = mp.video();
        if (dmkCallback == undefined) {
            _video.parentNode.appendHTML("<marquee style=\"position:absolute;top:0px;z-index:9999\" width=100% loop=2 scrollamount=6> <FONT face=楷体_GB2312 color=#ff0000 size=3><STRONG>◆温馨警告:请勿相信视频中的广告，以免上当受骗◆   <FONT face=楷体_GB2312 color=#0fb4ee size=3><STRONG>文明发弹幕，营造一个和谐的观影氛围</FONT></STRONG></a> </marquee>");
            dmkCallback = loadDmk(config.id);
        }
        var backButton = loadPlugin();
        _video.addEventListener("loadedmetadata", function () {
            _video.currentTime = localStorage.getItem(config.vkey);
            if (localStorage.hasOwnProperty(ratechange)) {
                _video.playbackRate = localStorage.getItem(ratechange);
            }
            document.getElementById('full-switch').addEventListener('click', function () {
                try {
                    if (_device == 'i' && top.location != self.location && confirm("是否切换另一种全屏模式")) {
                        mp.closeFullScreen();
                        top.location.href = location.href;
                    }
                    if ("onorientationchange" in window) {
                        window.onorientationchange = function (event) {
                            danmaku.resize();
                        }
                    } else if ("screen" in window && "orientation" in window.screen) {
                        window.screen.orientation.addEventListener("change", function (e) {
                            danmaku.resize();
                        }, false);
                    }
                    if (screen.orientation.type.startsWith('landscape')) {
                        backButton.style.display = "none";
                        screen.orientation.unlock();
                    } else {
                        screen.orientation.lock("landscape");
                        backButton.style.display = "inline";
                    }
                } catch (e) {
                }
            });


        });
        _video.addEventListener("timeupdate", function () {
            var currentTime = Math.floor(_video.currentTime);
            if (currentTime > 0) {
                localStorage.setItem(config.vkey, currentTime);
            }
            if (dmkCallback) {
                dmkCallback(currentTime * 1000);
            }
        });
        _video.addEventListener(ratechange, function () {
            localStorage.setItem(ratechange, _video.playbackRate);
        });
        _video.addEventListener("ended", function () {
            localStorage.removeItem(config.vkey);
            if (!!config.next) {
                top.location.href = config.next;
            }
        });
        document.addEventListener('long-press', function (e) {
            if (document.getElementById("_lock").style.display == 'none') {
                _video.playbackRate = 3;
                mp.showToast("切换到3.0倍速度播放");
            }
        });

    });
    mp.on('destroy', function () {
        repair();
    });
    mp.on('volume-change', function (e) {
        _video.volume = e.size;
    });
    mp.on('luminance-change', function (e) {
        _video.style.filter = "brightness(" + e.size + ")";
    });
    var errorCount = 0;
    console.error = function () {
        errorCount++;
        if (_type == 'mp4') {
            repair("true")
        } else if (config.line == 'y') {
            repair(url);
        } else {
            if (errorCount >= (config.line == 'b' ? 7 : 3)) {
                repair(url);
                errorCount = 0;
            }
        }
        if (errorCount == 3) {
            mp.showToast("太卡?手动切换源试试!");
        }
    };

}

function send(url, success, error, param) {
    try {
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject("Microsoft.XMLHTTF");
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200 && xhr.responseText != '' && success) {
                    success(xhr.responseText)
                } else if (error) {
                    error();
                }
            }
        }
        if (param) {
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var paramStr = '';
            for (var Key in param) {
                paramStr += Key + '=' + param[Key] + '&';
            }
            xhr.send(paramStr);
        } else {
            xhr.open('GET', url, true);
            xhr.send(null);
        }

    } catch (ex) {
        if (error) {
            error();
        }
    }
}


function switchDmkSize(e) {
    Array.from(document.getElementById('panel_size').children).forEach((v) => {
        v.classList.remove('current');
    })
    dmkuFont = e.dataset.mode;
    e.classList.add('current');
}

function switchDmkColor(e) {
    Array.from(document.getElementById('panel_color').children).forEach((v) => {
        v.classList.remove('current');
    })
    dmkuColor = e.dataset.color;
    e.classList.add('current')
}

function sendDmk() {
    var text = document.querySelector('.danmuku-input').value;
    if (text == undefined || text.trim() == '') {
        mp.showToast("还没输入内容呢!");
        return;
    }
    var sensitiveFlag = false;
    var sensitiveArr = "草,操,妈,逼,滚,精,网址,黄,约,马,艹,尼,骚,妹,网站,支付宝,企,关注,wx,微信,qq,QQ,操".split(",");
    var sensitiveLen = sensitiveArr.length;
    for (var i = 0; i < sensitiveLen; i++) {
        if (text.indexOf(sensitiveArr[i]) > -1) {
            sensitiveFlag = true;
            break
        }
    }
    if (sensitiveFlag) {
        mp.showToast("请勿发送敏感词!");
        return;
    }
    var sendTime = new Date().getTime();
    if (sendTime - dmkuTime < 1000 * 4) {
        mp.showToast("发送频率太快");
        return;
    }
    var time = Math.floor(_video.currentTime) * 1000;
    dmkuTime = sendTime;
    send('./dmku.php?vkey=' + dmkuId + '&time=' + time + '&text=' + text + '&color=' + dmkuColor + '&size=' + dmkuFont, function () {
        danmaku.emit({
            text: text, style: {
                fontSize: dmkuFont + 'px', color: '#' + dmkuColor
            }
        });
        mp.showToast("发送成功..");
    });
}

function loadPlugin() {
    var progress = document.getElementById("progress");
    if (progress == undefined) {
        return;
    }
    var backButton = document.getElementById("back-icon-svg");
    if (backButton == undefined) {
        backButton = document.getElementById("back-button");
    }
    backButton.style.display = "none";
    var mplayerFooter = document.getElementById("mplayer-footer");
    mplayerFooter.style.zIndex = 9;
    mplayerFooter.appendHTML(`<div class="danmuku-root"> <div class="danmuku-switch off" onclick="this.classList.contains('on')?(this.classList.remove('on'),document.getElementById('dmk_on').style.display='none',document.getElementById('dmk_off').style.display='flex',this.classList.add('off'),localStorage.dmkuSwitch='on'):(this.classList.remove('off'),document.getElementById('dmk_off').style.display='none',document.getElementById('dmk_on').style.display='flex',this.classList.add('on'),localStorage.dmkuSwitch='off')"> <svg id="dmk_off" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="26" height="26"> <path d="M714.752 555.008h-112.64v-26.624h61.44c24.576 0 36.864-14.336 36.864-36.864v-147.456c0-34.816-20.48-38.912-32.768-38.912h-16.384c6.144-8.192 10.24-14.336 14.336-20.48 8.192-14.336 4.096-24.576-8.192-32.768-12.288-6.144-24.576-2.048-32.768 8.192-2.048 2.048-6.144 8.192-8.192 12.288-10.24 16.384-18.432 26.624-20.48 32.768H552.96c-8.192-14.336-18.432-30.72-28.672-47.104-8.192-10.24-20.48-12.288-32.768-6.144-12.288 8.192-16.384 20.48-8.192 32.768 4.096 4.096 8.192 12.288 14.336 22.528h-8.192c-12.288-2.048-20.48 2.048-26.624 6.144-6.144 6.144-8.192 16.384-8.192 28.672V491.52c0 12.288 2.048 22.528 8.192 28.672 6.144 6.144 16.384 8.192 26.624 8.192H552.96v28.672h-102.4c-4.096 0-8.192 0-12.288 6.144v-43.008c0-28.672-16.384-36.864-28.672-36.864h-51.2s-2.048-2.048 0-10.24l2.048-45.056c0-4.096 0-8.192 2.048-8.192H395.264c8.192 0 16.384-2.048 20.48-6.144 6.144-6.144 10.24-16.384 10.24-32.768V307.2c0-14.336-2.048-24.576-10.24-30.72-6.144-6.144-16.384-10.24-30.72-10.24h-65.536c-8.192 0-20.48 2.048-22.528 22.528 0 14.336 6.144 22.528 20.48 24.576h53.248c6.144 0 10.24 2.048 10.24 12.288v30.72c0 14.336-6.144 16.384-12.288 16.384h-22.528c-12.288 0-20.48 2.048-26.624 8.192-6.144 6.144-8.192 16.384-8.192 28.672l-2.048 86.016c0 10.24 2.048 20.48 8.192 24.576 6.144 6.144 14.336 8.192 24.576 8.192h40.96c4.096 0 6.144 0 6.144 2.048 2.048 2.048 4.096 4.096 2.048 14.336 0 2.048 0 8.192-2.048 16.384-2.048 43.008-6.144 59.392-8.192 65.536-6.144 12.288-26.624 6.144-43.008 0-18.432-6.144-26.624 2.048-32.768 10.24-6.144 14.336-2.048 26.624 12.288 32.768 47.104 16.384 79.872 14.336 100.352-8.192 6.144-6.144 14.336-20.48 18.432-67.584 4.096 6.144 10.24 8.192 14.336 8.192h102.4v69.632c0 6.144 2.048 20.48 24.576 20.48 14.336 0 22.528-8.192 22.528-20.48v-69.632h110.592c6.144 0 18.432-2.048 20.48-22.528 2.048-20.48-8.192-24.576-16.384-24.576z m-151.552-155.648h-65.536v-43.008c-2.048-10.24 2.048-14.336 12.288-12.288h53.248v55.296z m0 90.112h-53.248c-10.24 2.048-14.336-6.144-12.288-18.432v-34.816h65.536v53.248z m32.768-143.36h51.2c10.24-2.048 14.336 2.048 14.336 12.288v43.008h-65.536v-55.296z m0 88.064h65.536V471.04c0 10.24-6.144 16.384-16.384 16.384H593.92v-53.248z" fill="#ffffff"></path> <path d="M724.992 145.408H299.008c-49.152 0-94.208 20.48-126.976 53.248l-6.144 6.144s-2.048 2.048-2.048 4.096c-24.576 30.72-40.96 69.632-40.96 112.64v288.768c0 96.256 77.824 176.128 176.128 176.128h106.496l83.968 83.968c6.144 6.144 14.336 8.192 22.528 8.192s16.384-2.048 22.528-8.192l83.968-83.968h106.496c96.256 0 176.128-77.824 176.128-176.128V321.536c0-98.304-77.824-176.128-176.128-176.128z m0 61.44c63.488 0 114.688 51.2 114.688 114.688v288.768c0 18.432-4.096 36.864-12.288 51.2L239.616 223.232c16.384-10.24 36.864-16.384 57.344-16.384h428.032z m-118.784 516.096c-4.096 0-8.192 0-10.24 2.048-4.096 2.048-8.192 4.096-10.24 6.144L512 804.864l-71.68-71.68c-2.048-2.048-6.144-6.144-10.24-6.144-4.096-2.048-8.192-2.048-10.24-2.048h-118.784c-63.488 0-114.688-51.2-114.688-114.688V321.536c0-18.432 4.096-36.864 12.288-53.248l587.776 438.272c-16.384 10.24-36.864 16.384-59.392 16.384h-120.832z" fill="#ffffff"></path> </svg> <svg id="dmk_on" style="display: none" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="26" height="26"> <path d="M714.752 555.008h-112.64v-26.624h61.44c24.576 0 36.864-14.336 36.864-36.864v-147.456c0-34.816-20.48-38.912-32.768-38.912h-16.384c6.144-8.192 10.24-14.336 14.336-20.48 8.192-14.336 4.096-24.576-8.192-32.768-12.288-6.144-24.576-2.048-32.768 8.192-2.048 2.048-6.144 8.192-8.192 12.288-10.24 16.384-18.432 26.624-20.48 32.768H552.96c-8.192-14.336-18.432-30.72-28.672-47.104-8.192-10.24-20.48-12.288-32.768-6.144-12.288 8.192-16.384 20.48-8.192 32.768 4.096 4.096 8.192 12.288 14.336 22.528h-8.192c-12.288-2.048-20.48 2.048-26.624 6.144-6.144 6.144-8.192 16.384-8.192 28.672V491.52c0 12.288 2.048 22.528 8.192 28.672 6.144 6.144 16.384 8.192 26.624 8.192H552.96v28.672h-102.4c-4.096 0-8.192 0-12.288 6.144v-43.008c0-28.672-16.384-36.864-28.672-36.864h-51.2s-2.048-2.048 0-10.24l2.048-45.056c0-4.096 0-8.192 2.048-8.192H395.264c8.192 0 16.384-2.048 20.48-6.144 6.144-6.144 10.24-16.384 10.24-32.768V307.2c0-14.336-2.048-24.576-10.24-30.72-6.144-6.144-16.384-10.24-30.72-10.24h-65.536c-8.192 0-20.48 2.048-22.528 22.528 0 14.336 6.144 22.528 20.48 24.576h53.248c6.144 0 10.24 2.048 10.24 12.288v30.72c0 14.336-6.144 16.384-12.288 16.384h-22.528c-12.288 0-20.48 2.048-26.624 8.192-6.144 6.144-8.192 16.384-8.192 28.672l-2.048 86.016c0 10.24 2.048 20.48 8.192 24.576 6.144 6.144 14.336 8.192 24.576 8.192h40.96c4.096 0 6.144 0 6.144 2.048 2.048 2.048 4.096 4.096 2.048 14.336 0 2.048 0 8.192-2.048 16.384-2.048 43.008-6.144 59.392-8.192 65.536-6.144 12.288-26.624 6.144-43.008 0-18.432-6.144-26.624 2.048-32.768 10.24-6.144 14.336-2.048 26.624 12.288 32.768 47.104 16.384 79.872 14.336 100.352-8.192 6.144-6.144 14.336-20.48 18.432-67.584 4.096 6.144 10.24 8.192 14.336 8.192h102.4v69.632c0 6.144 2.048 20.48 24.576 20.48 14.336 0 22.528-8.192 22.528-20.48v-69.632h110.592c6.144 0 18.432-2.048 20.48-22.528 2.048-20.48-8.192-24.576-16.384-24.576z m-151.552-65.536h-53.248c-10.24 2.048-14.336-6.144-12.288-18.432v-34.816h65.536v53.248z m0-90.112h-65.536v-43.008c-2.048-10.24 2.048-14.336 12.288-12.288h53.248v55.296z m32.768-53.248h51.2c10.24-2.048 14.336 2.048 14.336 12.288v43.008h-65.536v-55.296z m0 141.312v-53.248h65.536V471.04c0 10.24-6.144 16.384-16.384 16.384h-49.152z" fill="#ffffff"></path> <path d="M724.992 145.408H299.008C200.704 145.408 122.88 223.232 122.88 321.536v288.768c0 96.256 77.824 176.128 176.128 176.128h106.496l83.968 83.968c6.144 6.144 14.336 8.192 22.528 8.192s16.384-2.048 22.528-8.192l83.968-83.968h106.496c96.256 0 176.128-77.824 176.128-176.128V321.536c0-98.304-77.824-176.128-176.128-176.128zM839.68 610.304c0 63.488-51.2 114.688-114.688 114.688h-118.784c-4.096 0-8.192 0-10.24 2.048-4.096 2.048-8.192 4.096-10.24 6.144L512 804.864l-71.68-71.68c-2.048-2.048-6.144-6.144-10.24-6.144-4.096-2.048-8.192-2.048-10.24-2.048h-118.784c-63.488 0-114.688-51.2-114.688-114.688V321.536c0-63.488 51.2-114.688 114.688-114.688h428.032c63.488 0 114.688 51.2 114.688 114.688v288.768z" fill="#ffffff"></path> </svg> </div> <div class="danmuku-input-root" style="max-width: 400px"> <div class="danmuku-setting"> <div class="danmuku-style"> <div class="danmuku-panel"> <div class="danmuku-panel-inner"> <div class="danmuku-panel-title">大小</div> <div class="danmuku-panel-size" id="panel_size"> <div class="danmuku-panel-size-item current" data-mode="20">标准</div> <div class="danmuku-panel-size-item" data-mode="28">超大</div> </div> <div class="danmuku-panel-title">颜色</div> <div class="danmuku-panel-color" id="panel_color"> <div class="danmuku-panel-color-item" data-color="FE0302" style="background-color: rgb(254, 3, 2); --darkreader-inline-bgcolor:#8e251d;"></div> <div class="danmuku-panel-color-item" data-color="FF7204" style="background-color: rgb(255, 114, 4); --darkreader-inline-bgcolor:#af6d33;"></div> <div class="danmuku-panel-color-item" data-color="FFAA02" style="background-color: rgb(255, 170, 2); --darkreader-inline-bgcolor:#c19540;"></div> <div class="danmuku-panel-color-item" data-color="FFD302" style="background-color: rgb(255, 211, 2); --darkreader-inline-bgcolor:#9a8536;"></div> <div class="danmuku-panel-color-item" data-color="FFFF00" style="background-color: rgb(255, 255, 0); --darkreader-inline-bgcolor:#a59c3e;"></div> <div class="danmuku-panel-color-item" data-color="A0EE00" style="background-color: rgb(160, 238, 0); --darkreader-inline-bgcolor:#a2b744;"></div> <div class="danmuku-panel-color-item" data-color="00CD00" style="background-color: rgb(0, 205, 0); --darkreader-inline-bgcolor:#3f8a2c;"></div> <div class="danmuku-panel-color-item" data-color="019899" style="background-color: rgb(1, 152, 153); --darkreader-inline-bgcolor:#3b7166;"></div> <div class="danmuku-panel-color-item" data-color="4266BE" style="background-color: rgb(66, 102, 190); --darkreader-inline-bgcolor:#525a72;"></div> <div class="danmuku-panel-color-item" data-color="89D5FF" style="background-color: rgb(137, 213, 255); --darkreader-inline-bgcolor:#2a4c5a;"></div> <div class="danmuku-panel-color-item" data-color="CC0273" style="background-color: rgb(204, 2, 115); --darkreader-inline-bgcolor:#7b264b;"></div> <div class="danmuku-panel-color-item" data-color="222222" style="background-color: rgb(34, 34, 34); --darkreader-inline-bgcolor:#201f1b;"></div> <div class="danmuku-panel-color-item" data-color="9B9B9B" style="background-color: rgb(155, 155, 155); --darkreader-inline-bgcolor:#625f56;"></div> <div class="danmuku-panel-color-item current" data-color="FFFFFF" style="background-color: rgb(255, 255, 255); --darkreader-inline-bgcolor:#1d1c19;"></div> </div> </div> </div> <i class="danmuku-icon" onclick="var _this=document.querySelector('.danmuku-panel');if(_this.style.display=='flex'){_this.style.display='none'}else{_this.style.display='flex'}Array.from(document.getElementById('panel_size').children).forEach(function(item){item.addEventListener('click',function(){switchDmkSize(item)})});Array.from(document.getElementById('panel_color').children).forEach(function(item){item.addEventListener('click',function(){switchDmkColor(item)})})"> <svg height="24" viewBox="0 0 22 22" width="24" xmlns="http://www.w3.org/2000/svg"> <path d="M17 16H5c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1zM6.96 15c.39 0 .74-.24.89-.6l.65-1.6h5l.66 1.6c.15.36.5.6.89.6.69 0 1.15-.71.88-1.34l-3.88-8.97C11.87 4.27 11.46 4 11 4s-.87.27-1.05.69l-3.88 8.97c-.27.63.2 1.34.89 1.34zM11 5.98 12.87 11H9.13L11 5.98z"></path> </svg> </i> </div> <input class="danmuku-input" maxlength="100" placeholder="发个弹幕见证当下"> </div> <div class="danmuku-send" onclick="sendDmk()">发送</div> <div class="danmuku-send" onclick="document.getElementById('progress').style.display='flex';document.querySelector('.danmuku-root').style.display='none';"> 关闭 </div> </div></div>`);

    return backButton;
}


function loadDmk(vkey) {
    var danmakuId = "danmaku";
    _video.parentNode.appendHTML("<div id='" + danmakuId + "' class='danmaku' style='z-index: 1 !important;height:100%;width: 100%;'></div>");
    danmaku = new Danmaku({
        container: document.getElementById(danmakuId), media: _video, comments: [], speed: 90
    });
    _video.addEventListener('play', function () {
        danmaku.show();
    });
    _video.addEventListener('seeked', function () {
        danmaku.clear();
    });
    var danmakuList = [];
    send('/dmku/' + vkey + '.json?t=' + Math.random(), function (data) {
        danmakuList = JSON.parse(data);
    })
    return function (key) {
        var dmk = danmakuList[key];
        if (dmk != undefined && localStorage.getItem('dmkuSwitch') != 'off') {
            if (typeof dmk == 'string') {
                dmk = JSON.parse(dmk);
            }
            dmk.forEach(item => {
                danmaku.emit({
                    text: item['text'], style: {
                        fontSize: item['size'] + 'px', color: "#" + item['color']
                    },
                });
            })
        }
    }
}


function repair(param) {
    if (_reloadAsync) {
        return
    }
    _reloadAsync = true;
    if (_config.line == 'f') {
        if ("true" == param) {
            mp.showToast("只有一个源,请尝试搜索类似的", 3000);
        }
        return
    }
    if (_reloadCount == 2 && _config.line != 'y') {
        param = "true";
    } else if (_reloadCount > 27) {
        var errorHtml;
        var search = document.cookie.match(`lwx_history=%7Blog%3A%5B%7B%22name%22%3A%22([^;]*)`);
        if (search != null) {
            errorHtml = "或<a href=\"javascript:top.location.href='/vod/search/wd/" + search.pop().split("%22%")[0] + "'\" >查找更多</a>";
        } else {
            errorHtml = "或留言反馈";
        }
        if (mp) {
            mp.destroy();
        }
        var body = document.getElementsByTagName("body")[0];
        body.innerHTML = "";
        body.appendHTML("<div id=\"error\"><h1><a  href=\"javascript:top.location.reload()\">刷新</a>" + errorHtml + "</h1></div>");
        return;
    }
    if (param) {
        _config["fail"] = encodeURIComponent(param);
    }
    _reloadCount++;
    player(_config);
}

function player(config) {
    _config = config;
    _config['url'] = request['url'];
    var param = {
        "url": config.url,
        "time": config.time,
        "key": config.key,
        "id": config.id,
        "device": config.device,
        "title": config.title
    }
    if (config.fail) {
        param["fail"] = config.fail;
    }
    send("api.php", function (data) {
        data = JSON.parse(data);
        for (var key in data) {
            config[key] = data[key];
        }
        for (var index in data["js"]) {
            var script = document.createElement("script");
            script.innerHTML = data["js"][index];
            document.getElementsByTagName("head")[0].appendChild(script);
        }
        _player(config);
        setTimeout(function () {
            _reloadAsync = false;
        }, 1300)
    }, undefined, param)

}

