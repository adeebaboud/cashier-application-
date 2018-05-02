//var api_url = 'http://shawermatac.com/api2/index.php/api/cashier/';
//var login_api = 'http://shawermatac.com/api2/index.php/api/';
//-------------------------------------------------------------------
var api_url = 'http://localhost/Shawermatac-New/src/mobapi/index.php/api/cashier/';
var login_api = 'http://localhost/Shawermatac-New/src/mobapi/index.php/api/';
//var api_url = 'http://das-360.net/shawermatac/mobapi/index.php/api/cashier/';
//var login_api = 'http://das-360.net/shawermatac/mobapi/index.php/api/';
var userFullName = 'Shawermatec';
var myApp = new Framework7({
    init: false,
    cache: false,
    template7Pages: true,
    swipeBackPage: true,
    swipeBackPageAnimateOpacity:false,
    swipeBackPageAnimateShadow:false,
    uniqueHistory: true,
    sortable :false,
    precompileTemplates: true,
    hideNavbarOnPageScroll: false,
    showBarsOnPageScrollEnd: false,
    tapHold: true,
    onAjaxStart: function (xhr) {
        //myApp.showIndicator();
        isLoadingData = true;
    },
    onAjaxComplete: function (xhr) {
        //  myApp.hideIndicator();
        isLoadingData = false;
    }
});
var $$ = Dom7,
    menuCategories = {},
    USERNAME, PASSWORD, lang = {},
    slides = [],
    formA, formB, formC, addrssData = {},
    branches = [],
    branche_city = [],
    namesList = [],
    branchesCities = [],
    user_adrs = [],
    total_cart,
    monthNames = [],
    daysNames = [],
    reqorder_date, card_items = [],
    itemslist = [],
    or_details = {};
//--------------------------- ---------------------------
//----------------      view-main        ----------------
//--------------------------- ---------------------------
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
    domCache: false,
});
//--------------------------- ---------------------------
//----------------      TEMPLATES        ----------------
//--------------------------- ---------------------------

function trust(trust){
    if ( trust > 0)
        return '<i class="icon star-icon"></i>';
    else
        return '';
}

Template7.registerHelper('compare', function(index, compareWith, options){
   if (parseInt(index)  === parseInt(compareWith))
        return options.fn(this);
   else
        return options.inverse(this);
});
function temp(templateId) {
    var templateHtml = $$(templateId).html(),
        template = Template7.compile(templateHtml);
    return template;
}
var ordertemplate = temp('#ordertemplate');
//--------------------------- ---------------------------
//----------------      Language        ----------------
//--------------------------- ---------------------------
function getLang(language) {
    $$.getJSON('js/lang-' + language + '.json', function (data) {
        lang = data;
        var indexHtml = Template7.templates.IndexTemplate(lang);
        $$('.indexBtns').html(indexHtml);
        $$.each(lang.monthnames, function (i, month) {
            monthNames.push(month);
        });
    });
    //
}
getLang('en');
//--------------------------- ---------------------------
//function-------         AJAX SETUP     ----------------
//--------------------------- ---------------------------
$$.ajaxSetup({
    xhrFields: {
        withCredentials: false
    },
    crossDomain: true,
    beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa(localStorage.getItem('cuser') + ":" + localStorage.getItem('cpass')));
    },
});
$$(document).on('ajaxStart', function (e) {
    myApp.showIndicator();
}).on('ajaxComplete', function () {
    myApp.hideIndicator();
}).on('ajaxError', function (e) {
    var xhr = e.detail.xhr;
    var pageName = mainView.activePage.name;
});
////--------------------------- ---------------------------
////function-------       SHOW MESSAGE     ----------------
////--------------------------- ---------------------------
function showMessage(options, timetoclose) {
    var defaults = {
        type: 'success',
        icon: 'icon-success',
        content: 'content',
        haslink: false,
        href: '',
        linkText: ''
    };
    options = options || {};
    for (var def in defaults) {
        if (typeof options[def] === 'undefined' || options[def] === null) {
            options[def] = defaults[def];
        }
    }
    if (typeof timetoclose === 'undefined' || timetoclose === null) {
        timetoclose = 2000;
    }
    var messageHtml = Template7.templates.messagestemplate(options);
    myApp.popup(messageHtml);
    setTimeout(function () {
        myApp.closeModal('#messages-popup');
    }, timetoclose);
}
//--------------------------- ---------------------------
//function--------------   imgError     -----------------
//--------------------------- ---------------------------
function imgError(image) {
    image.onerror = "";
    image.src = "img/noimage.jpg";
    return true;
}
//-----------------------------------------------------
//pbi-------------  document start app ----------------
//-----------------------------------------------------
$$(document).once('pageBeforeInit', '.page[data-page="index"]', function (page) {
    myApp.mainView.history = [];
    mainView.router.load({
        template: Template7.templates.loginTemplate,
        animatePages: false
    });
    $$(".page.page-on-left").remove();
    $$(".navbar-inner.navbar-on-left").remove();
});
////--------------------------- ---------------------------
////function--------------  isLoggedIn    -------------------
////--------------------------- ---------------------------
function isLoggedIn() {
    return localStorage.getItem("islogin") == "yes";
} ////--------------------------- ---------------------------
////function--------------  setlogin    -------------------
////--------------------------- ---------------------------
function setlogin() {
    localStorage.setItem("islogin", "yes");
    localStorage.setItem("cuser", USERNAME);
    localStorage.setItem("cpass", PASSWORD);
    try {
        callNoti(api_url);
    } catch (e) {}
}
////--------------------------- ---------------------------
////function--------------   setlogout  -------------------
////--------------------------- ---------------------------
function setlogout() {
    localStorage.removeItem("islogin");
    localStorage.removeItem("cuser");
    localStorage.removeItem("cpass");
}
//--------------------------------------------------------
//--------------------  login      --------------------
//--------------------------------------------------------
myApp.onPageAfterAnimation('signup', function (page) {
    mainView.hideNavbar();
    if (localStorage.getItem('cuser')) {
        $$('#signin-form input[name="username"]').val(localStorage.getItem('cuser'));
        $$('#signin-form input[name="password"]').val(localStorage.getItem('cpass'));
        $$('#signin-form button[type="submit"]').click();
    }
    var pageleft = $$(".page.page-on-left");
    var navbarleft = $$(".navbar-inner.navbar-on-left");
    mainView.history = [];
    if (pageleft.length > 0 || navbarleft.length > 0) {
        pageleft.remove();
        navbarleft.remove();
    }
});
myApp.onPageInit('signup', function (page) {
    $$('#signin-form').on('submit', function (event) {
        event.preventDefault();
        var form_Login = myApp.formToJSON('#signin-form');
        PASSWORD = form_Login.password;
        USERNAME = form_Login.username;
        $$.ajax({
            url: login_api + 'member/login',
            type: 'POST',
            data: form_Login,
            dataType: "json",
            success: function (data, status, xhr) {
                mainView.history = [];
                setlogin();
                userFullName = data.user.name;
                myApp.mainView.router.loadPage("index.html");
                mainView.showNavbar();
                getOrders();
            },
            error: function (xhr, status) {
                myApp.alert(lang.loginErrorText, lang.loginErrorTitle);
            }
        });
    });
});
////---------------------------------------------------
////-------------------   logout  ----------------
////---------------------------------------------------
////--------------------------- ---------------------------
////init-------------   GLOBAL PAGEINIT    ----------------
////--------------------------- ---------------------------
$$(document).on('pageAfterAnimation', function (e) {
    var page = e.detail.page;
    $$('.contet-panel li a.link-' + page.name).addClass('disabled');
    $$('.contet-panel li a:not(.link-' + page.name + ')').removeClass('disabled');
});

function setOrderStatus(order_id, status, onDone) {
    $$.getJSON(api_url + 'order_status/' + order_id + "/" + status,
        function (result) {
            if (typeof (onDone) == 'function')
                onDone(result);
        });
}
var a = [];

function SaveToStorage(data) {
    a.push(data);
    localStorage.setItem('notification', JSON.stringify(a));
}

function countbadge(remove) {
    var badg = localStorage.getItem('notification');
    if (badg) {
        $$('.noti-badge').show().text(JSON.parse(badg).length);
    } else {
        $$('.noti-badge').hide();
    }
    if (remove) {
        $$('.noti-badge').hide();
        localStorage.removeItem('notification');
        a = [];
    }
}
//---------------------------------------
function getOrders(options, onDone) {
    var defaultOptions = {
        filter: activeOrdersFilter,
        makeList: true,
        offset: 0,
        count: 10,
        appendToList: false
    };
    options = options || {};
    $$.each(options, function (i, j) {
        if (defaultOptions[i] != undefined)
            defaultOptions[i] = j;
    });
    activeOrdersFilter = defaultOptions.filter;
    var ordersURL = api_url + 'branch_orders/' + defaultOptions.filter + '?';
    if (defaultOptions.offset > 0)
        ordersURL += '&offset=' + defaultOptions.offset;
    if (defaultOptions.count > -1)
        ordersURL += '&count=' + defaultOptions.count;
    $$.getJSON(ordersURL, function (data) {
        if (defaultOptions.makeList)
            makeOrdersList(data);
        if (!defaultOptions.makeList && defaultOptions.appendToList)
            appendToList(data);
        if (typeof (onDone) == 'function')
            onDone(data);
    });
}


function makeDays(data){
    var d =  new Date(), td = d.toLocaleDateString();
    for(var i=0;i<data.length;i++){
        var or_Card = ordertemplate(data[i]),
            orderDate = new Date(data[i].order_date),
            odd = orderDate.toLocaleDateString();

        if(odd !== td && i > 0){

            var nd = new Date(data[parseInt(i-1)].order_date),
                ndd = nd.toLocaleDateString();
            if(ndd !== odd){
                var html = '<div class=""><p class="time">'+odd+'</p></div>'
                $$('#myorders').append(html);
                $$('#myorders').append(or_Card);
            }else{
                $$('#myorders').append(or_Card);
            }
        }else{
            $$('#myorders').append(or_Card);
        }
    }
}


function appendToList(data) {
    for (var i = 0; i < data.length; i++)
        or_details.push(data[i]);
        makeDays(data)
}


function makeOrdersList(data) {
    or_details = data;
    $$('#myorders').html('');

    makeDays(data)

    statusBTNS();
}

function statusBTNS() {
    $$.each($$('#myorders li'), function (i, item) {
        var filterbtn = $$(item).find('.order-actions a.active').data('status');
        switch (filterbtn) {
        case 'ready':
            $$(item).find('.btn-cancelled').addClass('disabled');
            break;
        case 'delivered':
            $$(item).find('.btn-cancelled,.btn-ready').addClass('disabled');
            break;
        case 'cancelled':
            $$(item).find('a[data-status="delivered"] ,a[data-status="ready"]').addClass('disabled');
            break;
        }
    });
}
//--------------------------------------------------------
//--------------------  index page    --------------------
//--------------------------------------------------------
myApp.onPageInit('index', function (page) {
    $$('#myorders').on('click', '.order-actions a', function () {
        var btn = $$(this);
        var orderId = btn.data('order-id');
        var filter = $$('a[data-filter="all"]');
        if (btn.hasClass('active')) {
            return false;
        } else if (btn.data('status') == 'cancelled') {
            myApp.confirm('Are you sure?', 'Cancelled',
                function () {
                    changeStatus(true);
                    return false;
                },
                function () {
                    changeStatus(false);
                    return false;
                });
        } else {
            changeStatus(true);
        }

        function changeStatus(cancelled) {
            var newStatus = btn.data('status');
            var card = btn.parents('li[id="or-' + orderId + '"]');
            if (cancelled) {
                setOrderStatus(orderId, newStatus, function (result) {
                    if (filter.hasClass('active')) {
                        $$('.order-actions a').removeClass('active disabled');
                        $$('.order-actions').find('[data-status="' + result.order.or_status_name + '"]').addClass('active');
                        card.find('.card-footer span').attr('data-status', newStatus).text(newStatus);
                        statusBTNS();
                    } else {
                        myApp.swipeoutDelete(card, function () {});
                    }
                });
            }
        }
    })
    $$('.noti-badge').hide();
    $$('#logout').click(function () {
        userFullName = "Shawermatec";
        setlogout();
        mainView.router.load({
            template: Template7.templates.loginTemplate,
            animatePages: false
        });
        setTimeout(function () {
            mainView.history = [];
            $$(".page.page-on-left").remove();
            $$(".navbar-inner.navbar-on-left").remove();
        }, 400)
    });
    $$('.app-title').text('All Orders');
    $$('[data-filter="' + activeOrdersFilter + '"]').addClass('active');
    // Add 'refresh' listener on it
    $$('.pull-to-refresh-content').on('refresh', function (e) {
        getOrders({
            filter: activeOrdersFilter
        }, function () {
            myApp.pullToRefreshDone();
            statusBTNS();
        });
    });
    // Add Infinite Scroll listener
    $$('.infinite-scroll').on('infinite', function () {
        if (isLoadingData)
            return;
        isLoadingData = true;
        setTimeout(function () {
            var currentItemsCount = or_details.length;
            getOrders({
                filter: activeOrdersFilter,
                makeList: false,
                appendToList: true,
                offset: currentItemsCount,
                count: 10
            }, function (data) {
                statusBTNS();
                if (data.length == 0) {
                    myApp.detachInfiniteScroll($$('.infinite-scroll'));
                    $$('.infinite-scroll-preloader').hide();
                }
                isLoadingData = false;
            });
        }, 1000);
    });
    //attach see order details button
    $$('#myorders').on('click', '.see-order-btn', function () {
        var order_id = $$(this).parents('.card').data('order-id');
        var orderData = {};
        $$.each(or_details, function (i, order) {
            if (order.order_id == order_id)
                orderData = order;
        });
        mainView.router.load({
            template: Template7.templates.order_details,
            context: orderData
        });
    });
    $$('.app-title').text(activeOrdersFilter.replace(/(.)/, function ($1) {
        return $1.toUpperCase();
    }) + ' Orders');
    //attach filter buttons event
    $$('.filter-btn').click(function () {
        activeOrdersFilter = $$(this).data('filter');
        if (activeOrdersFilter == 'waiting') {
            setTimeout(function () {
                countbadge(true);
            }, 3000);
        }
        $$('.filter-btn').removeClass('active');
        $$(this).addClass('active');
        $$('#myorders').html('');
        $$('.app-title').text(activeOrdersFilter.replace(/(.)/, function ($1) {
            return $1.toUpperCase();
        }) + ' Orders');
        getOrders({
            filter: activeOrdersFilter
        }, function () {
            $$('.infinite-scroll-preloader').show();
            myApp.attachInfiniteScroll($$('.infinite-scroll'));
        });
    });
});
myApp.onPageAfterAnimation('index', function (page) {
    $$(".page.page-on-left").remove();
    $$(".navbar-inner.navbar-on-left").remove();
});

function switchStatus(orderStatus) {
    var Status = orderStatus.data('status');
    switch (Status) {
    case 'waiting':
        orderStatus.find('a').removeClass('disabled');
        orderStatus.find('.btn-delivered').addClass('disabled');
        break;
    case 'ready':
        orderStatus.find('a').removeClass('disabled');
        orderStatus.find('.btn-cancelled').addClass('disabled');
        break;
    case 'delivered':
        orderStatus.find('a').removeClass('disabled');
        orderStatus.find('.btn-cancelled,.btn-ready').addClass('disabled');
        break;
    case 'cancelled':
        orderStatus.find('a').removeClass('disabled');
        orderStatus.find('.btn-delivered,.btn-ready').addClass('disabled');
        break;
    }
}
myApp.onPageInit('order-items', function (page) {
    var orderStatus = $$('.buttons-row');
    switchStatus(orderStatus);
    //attach set status buttons events
    $$('.order-toolbar a').click(function () {
        var btn = $$(this);
        var btnRow = btn.parents('.buttons-row');
        var orderId = btn.data('order-id');
        var newStatus = btn.data('status');
        if (btn.hasClass('active')) {
            return;
        } else if (btn.data('status') == 'cancelled') {
            myApp.confirm('Are you sure?', 'cancelled',
                function () {
                    setStatus(btnRow, orderId, newStatus, true);
                    return false;
                },
                function () {
                    setStatus(btnRow, orderId, newStatus, false);
                    return false;
                });
        } else {
            setStatus(btnRow, orderId, newStatus, true);
        }
    });
});

function setStatus(btnRow, orderId, newStatus, cancelled) {
    if (cancelled) {
        setOrderStatus(orderId, newStatus, function (result) {
            //toggle btn active
            btnRow.find('a').removeClass('active');
            btnRow.find('[data-status="' + result.order.or_status_name + '"]').addClass('active');
            $$('.order-details-status').attr('data-status', result.order.or_status_name).text(result.order.or_status_name);
            btnRow.attr('data-status', newStatus)
            switchStatus(btnRow);
            //update order status in local data
            for (var i = 0; i < or_details.length; i++) {
                if (or_details[i].order_id == orderId)
                    or_details[i].order_status = result.order.order_status;
                or_details[i].or_status_name = result.order.or_status_name;
                break;
            }
            if (activeOrdersFilter == 'all' || activeOrdersFilter == result.order.or_status_name) {
                var newCardHtml = ordertemplate(result.order);
                $$("#myorders").find("#order-" + result.order.order_id).html($$(newCardHtml.trim()).html());
            } else {
                $$("#myorders").find("#or-" + result.order.order_id).remove();
            }
        });
    }
}

function formatDate(date) {
    if(typeof date != 'undefined'){
       var time =  date.split(" ");
       var hour = time[1].split(":");
       var hh =  parseInt(hour[0]);
       var h = hh;
       var d = 'AM';
        if(hh >= 12){
            h = hh-12;
            d = "PM";
        }
        if(h==0){
           h = 12;
        }
        return time[0] +" | "+h+":"+hour[1]+" "+d;
    }
}

myApp.init();
