!function (t, e) {
    "object" == typeof exports ? module.exports = e(t) : "function" == typeof define && define.amd ? define([], e) : t.LazyLoad = e(t)
}("undefined" != typeof global ? global : this.window || this.global, function (t) {
    "use strict";

    function e(t, e) {
        this.settings = s(r, e || {}), this.images = t || document.querySelectorAll(this.settings.selector), this.observer = null, this.init()
    }

    "function" == typeof define && define.amd && (t = window);
    const r = {
        src: "data-src",
        srcset: "data-srcset",
        selector: ".lazyload",
        root: null,
        rootMargin: "0px",
        threshold: 0
    }, s = function () {
        let t = {}, e = !1, r = 0, o = arguments.length;
        "[object Boolean]" === Object.prototype.toString.call(arguments[0]) && (e = arguments[0], r++);
        for (; r < o; r++) !function (r) {
            for (let o in r) Object.prototype.hasOwnProperty.call(r, o) && (e && "[object Object]" === Object.prototype.toString.call(r[o]) ? t[o] = s(!0, t[o], r[o]) : t[o] = r[o])
        }(arguments[r]);
        return t
    };
    if (e.prototype = {
        init: function () {
            if (!t.IntersectionObserver) return void this.loadImages();
            let e = this, r = {
                root: this.settings.root,
                rootMargin: this.settings.rootMargin,
                threshold: [this.settings.threshold]
            };
            this.observer = new IntersectionObserver(function (t) {
                Array.prototype.forEach.call(t, function (t) {
                    if (t.isIntersecting) {
                        e.observer.unobserve(t.target);
                        let r = t.target.getAttribute(e.settings.src), s = t.target.getAttribute(e.settings.srcset);
                        "img" === t.target.tagName.toLowerCase() ? (r && (t.target.src = r), s && (t.target.srcset = s)) : t.target.style.backgroundImage = "url(" + r + ")"
                    }
                })
            }, r), Array.prototype.forEach.call(this.images, function (t) {
                e.observer.observe(t)
            })
        }, loadAndDestroy: function () {
            this.settings && (this.loadImages(), this.destroy())
        }, loadImages: function () {
            if (!this.settings) return;
            let t = this;
            Array.prototype.forEach.call(this.images, function (e) {
                let r = e.getAttribute(t.settings.src), s = e.getAttribute(t.settings.srcset);
                "img" === e.tagName.toLowerCase() ? (r && (e.src = r), s && (e.srcset = s)) : e.style.backgroundImage = "url('" + r + "')"
            })
        }, destroy: function () {
            this.settings && (this.observer.disconnect(), this.settings = null)
        }
    }, t.lazyload = function (t, r) {
        return new e(t, r)
    }, t.jQuery) {
        const r = t.jQuery;
        r.fn.lazyload = function (t) {
            return t = t || {}, t.attribute = t.attribute || "data-src", new e(r.makeArray(this), t), this
        }
    }
    return e
});
var book = {
    init: function () {
        $("img.lazy").lazyload();
        var mySwiper = new Swiper('.swiper-container', {
            autoplay: 5e3
        });
        $('.go-back').click(function () {
            if (!$(this).attr('href')) {
                goBack();
            }
        });

        function goBack() {
            if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) { // IE
                if (history.length > 0) {
                    window.history.go(-1);
                } else {
                    window.location.href = $('.go-back').data('link');
                }
            } else { //非IE浏览器
                if (navigator.userAgent.indexOf('Firefox') >= 0 ||
                    navigator.userAgent.indexOf('Opera') >= 0 ||
                    navigator.userAgent.indexOf('Safari') >= 0 ||
                    navigator.userAgent.indexOf('Chrome') >= 0 ||
                    navigator.userAgent.indexOf('WebKit') >= 0) {
                    if (window.history.length > 1) {
                        window.history.go(-1);
                    } else {
                        window.location.href = $('.go-back').data('link');
                    }
                } else { //未知的浏览器
                    window.history.go(-1);
                }
            }
        }

        //返回顶部
        mccms.gotop('.mescroll-totop');
    },
    search: function () {
        if ($('.getmore').length > 0) {
            var page = 1, end = 0, isloading = false;
            $(window).bind("scroll", function () {
                if ($(document).scrollTop() + $(window).height()
                    > $(document).height() - 10 && !isloading) {
                    isloading = true;
                    get_data();
                }
            });
        }
        $("#searchInput").focus(function () {
            $(".search-history").hide();
        }).blur(function () {
            $.trim($(this).val()) || ($(".hot-search").show(), $(".search-history").show(), $(".search-active").hide());
        }),
            $(".search-btn").click(function () {
                var key = $("#searchInput").val();
                if (key == '') {
                    mccms.msg('请输入要搜索的关键字');
                } else {
                    history_save(key);
                    window.location.href = $('#search_form').attr('action') + '?key=' + key;
                }
            });
        $(".clear-all").click(function () {
            mccms.layer.open({
                content: "亲，确定要删除历史吗？",
                btn: ["确定", "取消"],
                yes: function (t) {
                    mccms.layer.close(t),
                        mccms.del_cookie('search_history_book');
                }
            })
        });
        //删除历史
        $('body').on('click', '.del-btn', function () {
            history_del($(this));
        });
        $("#searchInput").bind('input propertychange', function () {
            var key = $("#searchInput").val();
            if (key != '') {
                $.getJSON('//' + Mcpath.url + Mcpath.web + 'index.php/api/data/book?callback=?', {key: key}, function (res) {
                    if (res.code == 1) {
                        var t = res.data;
                        var n = new RegExp(key, "ig"),
                            a = t.length,
                            c = "";
                        if (a > 0) {
                            $(".hot-search").hide();
                            for (var o = 0; o < a; o++) c += '<div class="search-active-item" data-link="' + t[o].url + '" data-cid="' + t[o].id + '"><p class="comic-name">' + t[o].name.replace(n,
                                function (t) {
                                    return '<span style="color:red">' + t + "</span>"
                                }) + '</p><p class="comic-author">' + t[o].author.replace(n,
                                function (t) {
                                    return '<span style="color:red">' + t + "</span>"
                                }) + "</p></div>";
                            0 != $(".search-result").length && $(".search-result").hide(),
                                $(".search-active").html(c).show();
                        }
                    }
                });
            } else {
                $(".hot-search").show();
                $(".search-active").html('');
            }
        });
        //点击搜索跳转
        $('body').on('click', '.search-active-item', function () {
            window.location.href = $(this).data('link');
        });

        function history_list() {
            var i = mccms.get_cookie('search_history_book') ? JSON.parse(mccms.get_cookie('search_history_book')) : [],
                n = "";
            for (a = 0; a < i.length; a++) {
                n = '<p class="search-history-item clearfix"><a href="' + $('#search_form').attr('action') + '?key=' + i[a] + '"><span class="search-his-txt">' + i[a] + '</span></a><span class="del-btn"><i class="ift-searchlist_clearo"></i></span></p>';
            }
            $(".search-history-list").append(n);
        }

        function history_save(t) {
            var e = mccms.get_cookie('search_history_book'),
                i = [],
                n = $.trim(t);
            if (e) {
                i = JSON.parse(e);
                for (var a = i.length,
                         c = 0; c < a; c++) if (i[c] === n) {
                    i.splice(c, 1);
                    break
                }
            }
            "" != n && i.push(n),
            i.length > 10 && i.splice(0, 1),
                mccms.set_cookie('search_history_book', JSON.stringify(i));
        }

        function history_del(t) {
            var i = mccms.get_cookie('search_history_book') ? JSON.parse(mccms.get_cookie('search_history_book')) : [];
            var n = t.prev().find(".search-his-txt").text();
            for (a = 0; a < i.length; a++) {
                if (i[a] === n) {
                    i.splice(a, 1);
                    break;
                }
            }
            t.parents(".search-history-item").remove(),
                mccms.set_cookie('search_history_book', JSON.stringify(i));
        }

        function get_data() {
            var key = $("#searchInput").val();
            if (end == 0) {
                page++;
                $.getJSON('//' + Mcpath.url + Mcpath.web + 'index.php/api/data/book?callback=?', {
                    key: key,
                    page: page
                }, function (res) {
                    if (res.code == 1) {
                        var d = res.data;
                        if (d.length == 0) {
                            end = 1;
                            $('.getmore').html('没有更多了~!');
                        } else {
                            var str = '';
                            for (var i = 0; i < d.length; i++) {
                                var type = '';
                                for (var k = 0; k < d[i].tags.length; k++) type += '<span>' + d[i].tags[k] + '</span>&nbsp;';
                                str += '<div class="comic-list-item clearfix"><a class="cover" href="' + d[i].url + '"><img src="' + d[i].pic + '" alt="' + d[i].name + '"></a><div class="comic-item-info"><p class="comic-name"><a href="' + d[i].url + '">' + d[i].name + '</a></p><p class="comic-author">' + d[i].author + '</p><p class="comic-update-at">' + d[i].chapter_name + '</p><p class="comic-author" style="height: 38px;overflow: hidden;">' + d[i].content + '</p></div><a class="fast-read-btn" href="' + d[i].url + '"><i class="ift-searchlist_read1"></i><span>速看</span></a></div>';
                            }
                            $(".search-result").append(str);
                        }
                        isloading = false;
                    }
                });
            }
        }

        if ($(".search-history-list").length > 0) history_list();
    },
    custom: function (type) {
        var page = 1, end = 0, isloading = false;
        $('.mescroll').bind("scroll", function () {
            var viewH = $(this).height(), contentH = $(this).get(0).scrollHeight, scrollTop = $(this).scrollTop();//滚动高度
            if (scrollTop / (contentH - viewH) >= 0.99 && !isloading) { //到达
                isloading = true;
                get_data(type);
            }
        });

        function get_data(type) {
            var post = {};
            if (type == 'reco') post.tid = 1;
            if (type == 'free') post.pay = 0;
            if (end == 0) {
                page++;
                post.page = page;
                $.getJSON('//' + Mcpath.url + Mcpath.web + 'index.php/api/data/book?callback=?', post, function (res) {
                    if (res.code == 1) {
                        var d = res.data;
                        if (d.length == 0) {
                            end = 1;
                            $('.upwarp-tip').html('没有更多了~!');
                        } else {
                            var str = '';
                            for (var i = 0; i < d.length; i++) {
                                str += '<li class="story-recommend__page-item"><a href="' + d[i].url + '" class="item-link"><div class="item-cover"><img class="lazy cover loaded" src="' + Mcpath.tpl + 'img/bg_loading_img_3.4.png" data-src="' + d[i].pic + '" alt="' + d[i].name + '"> </div><div class="item-info"><div class="title">' + d[i].name + '</div><div class="desc">' + d[i].content + '</div><div class="l-row"><div class="author">' + d[i].author + '</div><div class="group"><div class="theme-item color3">' + d[i].tags + '</div><div class="count">' + mccms.get_wan(d[i].text_num) + '字</div></div></div></div></a></li>';
                            }
                            $("#j-recommend-datalist").append(str);
                            $("img.lazy").lazyload();
                        }
                        isloading = false;
                    }
                });
            }
        }
    },
    hot: function (order) {
        var page = 1, end = 0, isloading = false;
        $(window).bind("scroll", function () {
            if ($(document).scrollTop() + $(window).height()
                > $(document).height() - 10 && !isloading) {
                isloading = true;
                get_data(order);
            }
        });

        function get_data(order) {
            if (end == 0) {
                page++;
                $.getJSON('//' + Mcpath.url + Mcpath.web + 'index.php/api/data/book?callback=?', {
                    order: order,
                    page: page,
                    size: 15
                }, function (res) {
                    if (res.code == 1) {
                        var d = res.data;
                        if (d.length == 0) {
                            end = 1;
                            $('.upwarp-tip').html('没有更多了~!');
                        } else {
                            var str = '';
                            for (var i = 0; i < d.length; i++) {
                                if (order == 'shits') {
                                    var hits = '收藏 ' + mccms.get_wan(d[i].shits) + '次';
                                } else {
                                    var hits = '周人气 ' + mccms.get_wan(d[i].zhits);
                                }
                                str += '<a href="' + d[i].url + '" class="story-top__rank-item"><div class="cover-wrapper"><img class="lazy cover loaded" src="' + Mcpath.tpl + 'img/bg_loading_img_3.4.png" data-src="' + d[i].pic + '" alt="' + d[i].name + '"><div class="count-info">' + hits + '</div></div><div class="info-wrapper"><div class="title">' + d[i].name + '</div><div class="author">' + d[i].author + '</div><div class="desc">' + d[i].content + '</div><div class="tags"><div class="tag-item">' + d[i].tags + '</div><div class="tag-item">' + mccms.get_wan(d[i].text_num) + '字</div></div></div><div class="rank-num">' + ((page - 1) * 15 + i + 1) + '</div></a>';
                            }
                            $(".story-top__rank-list").append(str);
                            $("img.lazy").lazyload();
                        }
                        isloading = false;
                    }
                });
            }
        }
    },
    category: function () {
        var page = 1, end = 0, isloading = false, sindex = null;
        $('.mescroll').bind("scroll", function () {
            var viewH = $(this).height(), contentH = $(this).get(0).scrollHeight, scrollTop = $(this).scrollTop();//滚动高度
            if (scrollTop / (contentH - viewH) >= 0.95 && !isloading) { //到达
                console.log('ok');
                isloading = true;
                $('.mescroll-upwarp').show();
                get_data();
            }
        });
        //筛选
        $('.j-info-filter').click(function () {
            $('.j-filter__reset').click();
            sindex = mccms.layer.open({
                content: $('.xuan-box').html(),
                className: "dialog-full",
                skin: "footer"
            });
        });
        //关闭筛选
        $('body').on('click', '.j-filter-close', function () {
            mccms.layer.close(sindex);
        });
        //排序
        $('body').on('click', '.multi-item .j-info-nav', function () {
            $('.multi-item .j-info-nav').removeClass('active');
            $(this).addClass('active');
            _json_.order = $(this).data('order');
            end = page = 0;
            get_data();
        });
        //选择筛选条件
        $('body').on('click', '.j-filter__row .item', function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
        });
        //重置
        $('body').on('click', '.j-filter__reset', function () {
            $('.j-filter__row .item').removeClass('active');
            $('div[data-cid=' + _json_['list'] + '],div[data-size=' + _json_['size'] + '],div[data-pay=' + _json_['pay'] + '],div[data-finish=' + _json_['finish'] + ']').addClass('active');
            $('.tags-box div').each(function () {
                if ($(this).data('tags') == _json_['tags']) {
                    $(this).addClass('active');
                }
            });
        });
        //确定
        $('body').on('click', '.j-filter__submit', function () {
            _json_['list'] = $('.dialog-full .list-box .active').data('cid');
            _json_['tags'] = $('.dialog-full .tags-box .active').data('tags');
            _json_['size'] = $('.dialog-full .size-box .active').data('size');
            _json_['pay'] = $('.dialog-full .pay-box .active').data('pay');
            _json_['finish'] = $('.dialog-full .finish-box .active').data('finish');
            $('.j-info__theme-name').html($('.dialog-full .list-box .active').html());
            end = page = 0;
            get_data();
            mccms.layer.close(sindex);
        });

        function get_data() {
            if (end == 0) {
                page++;
                _json_.page = page;
                _json_.cid = _json_.list;
                $.getJSON('//' + Mcpath.url + Mcpath.web + 'index.php/api/data/book?callback=?', _json_, function (res) {
                    if (res.code == 1) {
                        var d = res.data;
                        var str = '';
                        for (var i = 0; i < d.length; i++) {
                            str += '<li class="story-category-info__item"><a href="' + d[i].url + '" class="item-link"><div class="item-cover"><img class="lazy cover loaded" src="' + Mcpath.tpl + 'img/bg_loading_img_3.4.png" data-src="' + d[i].pic + '" alt="' + d[i].name + '"> </div><div class="item-info"><div class="title">' + d[i].name + '</div><div class="desc">' + d[i].content + '</div><div class="l-row"><div class="author">' + d[i].author + '</div><div class="count">' + mccms.get_wan(d[i].text_num) + '字</div></div></div></a></li>';
                        }
                        if (d.length == 0) {
                            end = 1;
                            $('.mescroll-upwarp p').html('没有更多了~!');
                            if (page == 1) {
                                str = '<div class="mescroll-empty"><p class="empty-tip"></p><div class="upwarp-empty"><div class="tip--bg"></div><p class="tip--title">主人,没有相匹配小说</p><p class="tip--small">换个筛选条件试试</p></div><p></p></div>';
                            }
                        }
                        if (page > 1) {
                            $(".book-list").append(str);
                        } else {
                            $(".book-list").html(str);
                        }
                        $("img.lazy").lazyload();
                        $('.mescroll-upwarp').hide();
                        isloading = false;
                    }
                });
            }
        }
    },
    readbuy: function (bid) {
        $.getJSON('//' + Mcpath.url + Mcpath.web + 'index.php/api/book/buyread?callback=?', {bid: bid}, function (res) {
            if (res.code == 1) {
                var read = res.read, buy = res.buy, pay = res.pay;
                for (var i = 0; i < read.length; i++) {
                    $('.book-chapter-' + read[i].cid).children('.j-catalog-look').removeClass('hide');
                }
                for (var i = 0; i < buy.length; i++) {
                    $('.book-chapter-' + buy[i].cid).children('.j-catalog-buyed,.icon-chapter-unlock').removeClass('hide');
                }
                for (var i = 0; i < pay.length; i++) {
                    $('.book-chapter-' + pay[i].id).children('.j-catalog-lock,.icon-chapter-lock').removeClass('hide');
                }
            }
        });
    },
    comment: function (bid, page) {
        mccms.comment({bid: bid, page: page}, function (res) {
            if (res.code == 1) {
                $('.getmore').hide();
                if (page > 1) {
                    $('.comment-wrap').append(res.html);
                } else {
                    $('.comment-wrap').html(res.html);
                }
                if (res.html) {
                    $('.no-comment').hide();
                } else {
                    $('.getmore').attr('more', '0').html('没有更多了');
                    if (page > 1) $('.getmore').show();
                }
            }
        });
    },
    info: function (bid, shareTxt, sharePic) {
        //章节阅读状态
        book.readbuy(bid);
        //评论
        book.comment(bid, 1);
        var page = 1, end = 0, isloading = false;
        $(window).bind("scroll", function () {
            if ($(document).scrollTop() + $(window).height()
                > $(document).height() - 10 && !isloading) {
                isloading = true;
                console.log($('.getmore').attr('more'));
                if ($('.getmore').attr('more') == '1') {
                    $('.getmore').show();
                    page++;
                    book.comment(bid, page);
                    setTimeout(function () {
                        isloading = false;
                    }, 2000);
                }
            }
        });
        //评论点赞
        $('body').on('click', '.zan-btn', function () {
            if (mccms.user.log == 0) {
                window.location.href = '//' + Mcpath.url + Mcpath.web + 'index.php/user/login';
            } else {
                var _this = $(this);
                var id = _this.data('cid');
                $.getJSON('//' + Mcpath.url + Mcpath.web + 'index.php/api/comment/zan?callback=?', {id: id}, function (res) {
                    if (res.code == 1) {
                        mccms.msg(res.msg, 1);
                        _this.children('.num').html(res.zan);
                        if (res.zt == 0) {
                            _this.removeClass('zaned');
                            _this.children('i').attr('class', 'ift-coment_like_off');
                        } else {
                            _this.addClass('zaned');
                            _this.children('i').attr('class', 'ift-coment_like_on');
                        }
                    } else {
                        mccms.msg(res.msg);
                    }
                });
            }
        });
        //评论框
        $('body').on('click', '.j-comment-btn', function () {
            if (mccms.user.log == 0) {
                window.location.href = '//' + Mcpath.url + Mcpath.web + 'index.php/user/login';
            } else {
                $('.comment-txt').html('发表评论');
                $('.comment-layout').show();
            }
        });
        //关闭评论框
        $('body').on('click', '.ift-nav_close', function () {
            $('.comment-layout').hide();
        });
        //表情
        $('body').on('click', '.J_face_btn', function () {
            $('.face-wrapper').show();
        });
        $('body').on('click', '.face-list .item', function () {
            var html = $('#commentArea').val();
            var em = $(this).data('id');
            $('#commentArea').val(html + em);
            $('.comment-sumit').css('background', '#f60');
        });
        $("#commentArea").bind('input propertychange', function () {
            var str = $(this).val();
            if (str != '') {
                $('.comment-sumit').css('background', '#f60');
            } else {
                $('.comment-sumit').css('background', '#ccc');
            }
        });
        $('body').on('click', '.comment-content', function () {
            var user = $(this).data('user'), id = $(this).data('id');
            $('.comment-txt').html('回复：' + user);
            $('.comment-sumit').attr('data-cid', id);
            $('.comment-layout').show();
        });
        //提交评论
        $('.comment-sumit').click(function () {
            var cid = $(this).attr('data-cid');
            var text = $('#commentArea').val().replace(/<.*?>/g, "");
            if (text == '') {
                mccms.msg('请填写内容');
            } else {
                mccms.comment_send({bid: bid, text: text, cid: cid, fid: 0}, function (res) {
                    if (res.code == 1) {
                        mccms.msg(res.msg, 1);
                        $('.comment-layout').hide();
                        $('#commentArea').val('');
                        book.comment(bid, 1);
                    } else {
                        mccms.msg(res.msg);
                    }
                });
            }
        });
        //阅读点击
        $('.j-footer-read').click(function () {
            window.location.href = $(this).data('href');
        });
        //分享
        $('.j-share').click(function () {
            mccms.layer.open({
                content: $('.bdshare').html(),
                btn: ["取消"],
                className: "dialog-share",
                skin: "footer",
                yes: function (e) {
                    mccms.layer.close(e);
                }
            });
        });
        $('body').on('click', '.ctrl-item .btn', function () {
            book.share($(this).data('cmd'), window.location.href, shareTxt, sharePic);
        });
        //判断是否收藏
        setTimeout(function () {
            $('.gift-confirm .txt').html(mccms.user.cion);
            $('.ticket-box .num').html(mccms.user.ticket);
            //收藏
            if (mccms.user.log == 1) {
                $.getJSON('//' + Mcpath.url + Mcpath.web + 'index.php/api/rend/isfav?callback=?', {
                    type: 'book',
                    did: bid
                }, function (res) {
                    if (res.code == 1) {
                        $('.j-footer-collect').addClass('active').children('.j-footer-collect-text').html('已收藏');
                    }
                });
            }
        }, 200);
        //收藏
        $('.j-footer-collect').click(function () {
            if (mccms.user.log == 0) {
                window.location.href = '//' + Mcpath.url + Mcpath.web + 'index.php/user/login';
            } else {
                $.getJSON('//' + Mcpath.url + Mcpath.web + 'index.php/api/rend/favadd?callback=?', {
                    type: 'book',
                    did: bid
                }, function (res) {
                    if (res.code == 1) {
                        if (res.cid == 1) {
                            $('.j-footer-collect').addClass('active').children('.j-footer-collect-text').html('已收藏');
                        } else {
                            $('.j-footer-collect').removeClass('active').children('.j-footer-collect-text').html('收藏');
                        }
                        $('.j-footer-collect-num').html('(' + res.shits + ')');
                        mccms.msg(res.msg, 1);
                    } else {
                        mccms.msg(res.msg);
                    }
                });
            }
        });
        //展开
        if ($('.j-desc-text').html().length > 120) $('.j-desc-more').removeClass('hide');
        $('.j-desc-more').click(function () {
            if ($(this).hasClass('off')) {
                $('.j-desc-text').css('max-height', '4.5em');
                $(this).removeClass('off').html('- 展开 -');
            } else {
                $('.j-desc-text').css('max-height', 'none');
                $(this).addClass('off').html('- 收起 -');
            }
        });
        //目录
        $('.j-catalog-nav').click(function () {
            mccms.index = mccms.layer.open({
                content: $('.j-catalog-conainer').html(),
                btn: ["取消"],
                className: "dialog-story-catalog",
                skin: "footer"
            });
        });
        $('body').on('click', '.j-dialog-catalog-back', function () {
            mccms.layer.close(mccms.index);
        });
        //倒序
        $('body').on('click', '.j-catalog-sort', function () {

            if ($(this).hasClass('reversed')) {
                $(this).removeClass('reversed');
                $(this).children('i').removeClass('icon-ic_detail_mldx').addClass('icon-ic_detail_mlsx');
                $(this).children('span').html('正序');
            } else {
                $(this).addClass('reversed');
                $(this).children('i').addClass('icon-ic_detail_mldx').removeClass('icon-ic_detail_mlsx');
                $(this).children('span').html('倒序');
            }
            var list = $('.j-catalog-list');
            var newList = list.find('.item').get();
            list.html("");
            for (var i = newList.length - 1; i >= 0; i--) {
                list.append(newList[i]);
            }
        });
    },
    read: function () {
        //章节阅读状态
        book.readbuy(bid);
        var type = 'gift', theme = mccms.get_cookie('theme'), size = mccms.get_cookie('size');
        if (!theme) theme = 5;
        if (!size) size = 18;
        get_setting();
        //显隐菜单
        $('.chapter-preview').click(function () {
            if ($('.read-tools').hasClass('hide')) {
                $('.read-tools').removeClass('hide');
            } else {
                $('.read-tools').addClass('hide');
            }
            $('.read-setting-popup').addClass('hide');
        });
        //白天黑夜切换
        $('.button-image-night').click(function () {
            theme = 6;
            get_setting();
        });
        $('.button-image-day').click(function () {
            theme = 5;
            get_setting();
        });
        //目录显隐
        $('.read-foot-button-category').click(function () {
            $('.read-chapters-wrapper').removeClass('hide');
        });
        $('.read-chapters-shadow').click(function () {
            $('.read-chapters-wrapper').addClass('hide');
        });
        //章节跳转
        $('.read-chapter-item').click(function () {
            window.location.href = $(this).data('href');
        });
        //目录排序
        $('body').on('click', '.chapters-sort', function () {
            if ($(this).hasClass('reversed')) {
                $(this).removeClass('reversed');
            } else {
                $(this).addClass('reversed');
            }
            var list = $('.read-chapters');
            list.append(list.find('.read-chapter-item').get().reverse());
        });
        //设置显隐
        $('.read-foot-button').click(function () {
            if ($('.read-setting-popup').hasClass('hide')) {
                $('.read-setting-popup').removeClass('hide');
            } else {
                $('.read-setting-popup').addClass('hide');
            }
        });
        //主题背景
        $('.read-theme-setting .read-theme-item').click(function () {
            theme = $(this).data('theme');
            get_setting();
        });
        //字体大小
        $('.range').on('input propertychange', function () {//实时事件（获取每个变化的值）
            size = $(this).val();
            get_setting();
        });
        //上下章
        $('.read-prev-chapter').click(function () {
            if (slink == '') {
                mccms.msg('已经是第一章了', 1);
            } else {
                window.location.href = slink;
            }
        });
        $('.read-next-chapter').click(function () {
            if (xlink == '') {
                mccms.msg('已经是最后一章', 1);
            } else {
                window.location.href = xlink;
            }
        });
        //判断VIP
        if (vip > 0 || cion > 0) {
            var index = mccms.layer.open({type: 2, content: '请稍后'});
            $.getJSON('//' + Mcpath.url + Mcpath.web + 'index.php/api/book/isbuy?callback=?', {
                bid: bid,
                cid: cid
            }, function (res) {
                mccms.layer.close(index);
                if (res.code == 2) {
                    layer.open({
                        content: '浏览该章节您需要先登陆',
                        btn: '去登陆',
                        no: function (index) {
                            window.location.href = '//' + Mcpath.url + Mcpath.web + 'index.php/user/login';
                        }
                    });
                } else if (res.code == 3) {
                    if (res.type == 'vip') {
                        $('.read-pay-title').html('Vip专属章节');
                        $('.read-pay-tip').html('该章节是Vip章节，需购买VIP后方可阅读');
                        $('.read-pay-button-pay').html('立即购买Vip&gt;');
                        $('.read-pay-info').addClass('hide');
                    } else {
                        $('.read-pay-tip').html('该章节是收费章节，需购买后方可阅读');
                        $('.price-number').html(cion);
                        $('.read-pay-info').removeClass('hide');
                        $('.ucion').html(mccms.user.cion);
                        if (mccms.user.cion < cion) {
                            $('.read-pay-button-pay').html('余额不足，去充值&gt;');
                        }
                    }
                    $('.read-pay-wrapper').removeClass('hide');
                } else if (res.code == 1) {
                    $('.chapter-preview').html(res.text);
                    $('.read-pay-wrapper').addClass('hide');
                    if (res.cion) mccms.msg('已消耗：' + res.cion, 1);
                } else {
                    mccms.msg(res.msg, -1);
                }
            });
            $('.read-pay-button-pay').click(function () {
                if (vip > 0) {
                    window.location.href = '//' + Mcpath.url + Mcpath.web + 'index.php/user/pay/index/vip';
                } else {
                    if (mccms.user.cion < cion) {
                        window.location.href = '//' + Mcpath.url + Mcpath.web + 'index.php/user/pay/index/cion';
                    } else {
                        var auto = $('.read-pay-auto-checkbox').prop("checked") ? 1 : 0;
                        var index = mccms.layer.open({type: 2, content: '请稍后'});
                        $.getJSON('//' + Mcpath.url + Mcpath.web + 'index.php/api/book/buy/' + bid + '/' + cid + '/' + auto + '?callback=?', function (res) {
                            mccms.layer.close(index);
                            if (res.code == 2) {
                                window.location.href = '//' + Mcpath.url + Mcpath.web + 'index.php/user/login';
                            } else if (res.code == 3) {
                                window.location.href = '//' + Mcpath.url + Mcpath.web + 'index.php/user/pay/index/cion';
                            } else if (res.code == 1) {
                                if (res.cion) mccms.msg('已消耗：' + res.cion, 1);
                                $('.chapter-preview').html(res.text);
                                $('.read-pay-wrapper').addClass('hide');
                            } else {
                                mccms.msg(res.msg, -1);
                            }
                        });
                    }
                }
            });
        }

        $('body').on('click', '.ctrl-item .btn', function () {
            book.share($(this).data('cmd'), window.location.href, shareTxt, sharePic);
        });

        function get_setting() {
            mccms.set_cookie('theme', theme);
            mccms.set_cookie('size', size);
            $('.read-theme-setting .read-theme-item').removeClass('selected');
            $('.theme-' + theme).addClass('selected');
            if (theme == 6) {
                $('.story-read-page').attr('class', 'story-read-page theme-night');
            } else {
                $('.story-read-page').attr('class', 'story-read-page theme-' + theme);
            }
            $('.range').val(size);
            $('.chapter-preview').css('font-size', size + 'px');
            $('.chapter-title-mini').css('font-size', (parseInt(size) - 2) + 'px');
        }

        //离开前记录阅读记录
        window.onbeforeunload = function () {
            mccms.read({did: bid, cid: cid, type: 'book'});
        }
    },
    shelfcase: function (type) {
        //跳转
        $('div[data-href]').click(function (e) {
            var target = e.target;
            if ($('.item--editor').find(target).length == 0) {
                window.location.href = $(this).data('href');
            }
        });
        //显示删除
        $('.j-toolbar-editor__i').click(function () {
            $(this).hide();
            $('.j-toolbar-editor__text').show();
            $('.mescroll .item').addClass('item--editor');
            $('.j-his-toolbar').addClass('active');
        });
        //隐藏删除
        $('.j-toolbar-editor__text').click(function () {
            $(this).hide();
            $('.j-toolbar-editor__i').show();
            $('.mescroll .item').removeClass('item--editor');
            $('.j-his-toolbar').removeClass('active');
        });
        //单条选择
        $('body').on('click', '.item--editor', function () {
            if ($(this).hasClass('item--select')) {
                $(this).removeClass('item--select');
            } else {
                $(this).addClass('item--select');
            }
            get_xuan();
        });
        //全选
        $('.btn-selectall').click(function () {
            if ($(this).hasClass('active')) {
                $('.item--editor').removeClass('item--select');
                $(this).removeClass('active');
                $('.btn-selectall span').html('全选');
            } else {
                $('.item--editor').addClass('item--select');
                $(this).addClass('active');
                $('.btn-selectall span').html('反选');
            }
            get_xuan();
        });
        //删除
        $('.btn-delete').click(function () {
            var ids = [];
            $('.item--select').each(function () {
                ids.push($(this).data('id'));
            });
            if (ids.length == 0) {
                $('.j-toolbar-editor__text').click();
            } else {
                mccms.layer.open({
                    content: '确定删除吗?',
                    btn: ['确定', '取消'],
                    yes: function (index) {
                        mccms.layer.close(index);
                        var index = mccms.layer.open({type: 2, content: '请稍后'});
                        $.getJSON('//' + Mcpath.url + Mcpath.web + 'index.php/user/' + type + '/del/book?ids=' + ids.join(',') + '&callback=?', function (res) {
                            mccms.layer.close(index);
                            if (res.code == 1) {
                                mccms.msg(res.msg, 1);
                                setTimeout(function () {
                                    location.reload();
                                }, 2000);
                            } else {
                                mccms.msg(res.msg);
                            }
                        });
                    }
                });
            }
        });

        //选择数量
        function get_xuan() {
            var ids = [];
            $('.item--select').each(function () {
                ids.push($(this).data('id'));
            });
            if (ids.length == 0) {
                $('.btn-delete').addClass('disabled').html('删除');
            } else {
                $('.btn-delete').removeClass('disabled').html('删除(' + ids.length + ')');
            }
        }
    }
};
$(function () {
    book.init();
});