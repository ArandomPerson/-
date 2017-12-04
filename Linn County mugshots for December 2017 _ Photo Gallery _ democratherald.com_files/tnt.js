window.__tnt || (window.__tnt = {});

/*
__tnt.appName = 'TownNews Templates';
__tnt.appVersion = '0.1.0.0';
*/

__tnt.client = ( function( window, undefined ) {
    this.obj = {};

    this.obj.userAgent = navigator.userAgent.toLowerCase();

    this.obj.browser = window["eb.browser"] = {
        version: (this.obj.userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        safari: /webkit/.test(this.obj.userAgent),
        opera: /opera/.test(this.obj.userAgent),
        msie: /msie/.test(this.obj.userAgent) && !/opera/.test(this.userAgent),
        mozilla: /mozilla/.test(this.obj.userAgent) && !/(compatible|webkit)/.test(this.obj.userAgent),
        silk: /silk/.test(this.obj.userAgent),
        chrome: /chrome/.test(this.obj.userAgent)
    };

    this.obj.platform = window["eb.platform"] = {
        win:/win/.test(this.obj.userAgent),
        mac:/mac/.test(this.obj.userAgent),
        touchDevice: (function(){
            try {
                return 'ontouchstart' in document.documentElement;
            } catch (e) {
                return false;
            } 
        })(),
        android: (this.obj.userAgent.indexOf("android") > -1),
        ipad: (this.obj.userAgent.match(/ipad/i) ? true : false),
        iphone: (this.obj.userAgent.match(/iphone/i) ? true : false),
        ipod: (this.obj.userAgent.match(/ipod/i) ? true : false),
        winphone: (this.obj.userAgent.match(/Windows Phone/i) ? true : false),
        blackberry: (this.obj.userAgent.match(/BlackBerry/i) ? true : false),
        webos: (this.obj.userAgent.match(/webOS/i) ? true : false)
    };
    this.obj.platform.ios = ( this.obj.platform.ipad || this.obj.platform.ipod || this.obj.platform.iphone );

    this.obj.touchOnly = this.obj.platform.touchDevice && (this.obj.platform.android || this.obj.platform.ios || this.obj.platform.winphone || this.obj.platform.blackberry || this.obj.platform.webos || this.obj.platform.silk );

    this.obj.clickEvent = ( this.obj.touchOnly ) ? 'touchend' : 'click';

    this.obj.capabilities = {
            supportsCookies: (navigator.cookieEnabled) ? true : false,
            supportsLocalStorage: function() {
                var test = 'test';
                try {
                    localStorage.setItem(test, test);
                    localStorage.removeItem(test);
                    return true;
                } catch(e) {
                    return false;
                }
            },
            supportsFlash: function(){
            }
        }

    return this.obj;
} )( window );

__tnt.user = ( function( window, undefined ) {
    this.obj = {
        authToken: jQuery.cookie('tncms-authtoken'),
        screenName: TNCMS.User.getScreenName(),
        avatar: jQuery.cookie('tncms-avatarurl'),
        remember: jQuery.cookie('tncms-rememberme'),
        services: jQuery.cookie('tncms-services')
    };
    this.obj.loggedIn = TNCMS.User.isLoggedIn();
    
    return this.obj;
} )( window );

__tnt.log = function( obj ) {
    if( window.console ) console.log(obj);
}

/** get a url hash param */
__tnt.urlHash = function( p ) {
     var pRegex = new RegExp("#.*[?&]" + p + "=([^&]+)(&|$)");
     var pMatch = location.href.match(pRegex);
     return pMatch ? pMatch[1] : '';
}

/** set default author validation as false */
__tnt.isAuthor = false;

__tnt.trackEventLater = [];
__tnt.trackEvent = function( obj ) {
    if( jQuery.type(obj) === 'object' ){
        __tnt.trackEventLater.push(obj);
    }
}

/** string truncate */
__tnt.truncateStr = function(sContent, iLen, sAppend) {
    if( sContent.length > iLen ){
        sAppend = sAppend ? sAppend : '';
        sContent = sContent.substring(0,iLen)+sAppend;
    }
    return sContent;
}

/** 
 * compare array
 * @description Returns true if any source item matches a target
 */
__tnt.compareArray = function (source, target) {
    if (typeof source == 'undefined' || typeof target == 'undefined') return;
    var result = source.filter(function(item){ return target.indexOf(item) > -1});
    return (result.length > 0);
}

/** check if element is in viewport */
__tnt.elementOnScreen = function(sElem, iThreshold) {
    if( $(sElem).length === 0 ) { return false; }
    var $e = $(sElem);
    var $w = $(window);
    var iThreshold = iThreshold ? iThreshold : 5;
    var docViewTop = $w.scrollTop();
    var docViewBottom = docViewTop + $w.height();
    var elemTop = $e.offset().top - iThreshold;
    var elemBottom = elemTop + $e.height() - iThreshold;
    return (docViewBottom >= elemTop && docViewTop <= elemBottom);
}

/*
 * Template Code
 * @param template = element
 * @param insertionPoint = element
 * @param inesrtionBefore = boolean
 * @param data = array of objects [{'element':'css selector', 'html':'inserted content', 'attr':{'key':'value',}}]
 * @param callback = function(t){}
 * @param protect = boolean - may no longer be needed
 * @param id = string, id to apply to top level element
 *
 * @description - takes a template element and inserts provided data before running a callback
 */
__tnt.template = function(template, insertionPoint, insertionBefore, data, callback, protect) {
    var t = '';
    var foundTemplate = false;

    if(typeof(insertionBefore) == "undefined") {
        insertionBefore = false;
    }
    
    if(typeof(protect) == "undefined") {
        protect = true;
    }

    if(typeof(limit) == "undefined"){
        limit = data.length;
    }

    if(template.prop('nodeName')=='TEMPLATE'){
        // New awesome HTML5 templates
 
        var wrapper = $('<div></div>');
        var fragment = template.html();

        var t = wrapper.append(fragment).children().first().unwrap();
        
        foundTemplate = true;
        
    }else if($(template).length){
        // Legacy behavior

        // if the template element has no children, check for a commented out block of code and use that.
        // this should help keep google out

        if (!$(template).children().length && $(template).html().trim() != ""){
            $(template).html($(template).html().replace(/<!--|-->/g, ''));
        }
       
        // clone the contents of the template element
        var t = $(template).first().children().first().clone();
    
        // protect the template again to allow js to act on the live copy.
        if(protect){
            if(!template.html().match(/<!--|-->/g, '')){
                $(template).html('<!--'+$(template).html()+'-->');
            }
        }
        
        foundTemplate = true;
        
    }else{
        __tnt.log("__tnt.template - no template element found");
    }
    
    if(foundTemplate){
        if (typeof(data) == "object") {
            $.each(data, function() {
        
                var element = t;
                if(this.element){
                    element = $(t.find(this.element));
                
                    if(this.first){
                        element = $(t.find(element).first());
                    }
                }
            
                if(element){
            
                    if (typeof(this.attr)!="undefined") {
                        $.each(this.attr, function() {
                            element.attr(this.attr, this.value);
                        });
                    }

                    if (typeof(this.html)!="undefined") {
                        element.html(this.html);
                    }
            
                    if (typeof(this.url)!="undefined") {
                        element.wrap('<a href="'+this.url+'"></a>');
                    }
                }
            });
        }

        if(typeof(callback)=='function'){
            callback(t);
        }
    
        if (insertionBefore) {
            insertionPoint.prepend(t);
        } else {
            insertionPoint.append(t);
        }

    }

    return t;
}; 

/**
  Youtube helper class
 */ 
__tnt.youtube = (function(window, undefined){
    o = {};
    o.create = [];
    o.playing = false;
    o.state = {
        change: function(event){
            switch(event.data){
                case YT.PlayerState.ENDED:
                    __tnt.trackEvent({'category':'tnt-video', 'action':'end', 'label':'youtube', 'value':'1'});
                    break;
                case YT.PlayerState.PLAYING:
                    /** dont allow more than one video to play at a time */
                    if(event.target != o.playing) o.state.pause();
                    o.playing = event.target;
                    __tnt.trackEvent({'category':'tnt-video', 'action':'play', 'label':'youtube', 'value':'1'});
                    break;
                case YT.PlayerState.PAUSED:
                    __tnt.trackEvent({'category':'tnt-video', 'action':'pause', 'label':'youtube', 'value':'1'});
                    break;
            }
        },
        pause: function(){
           if(o.playing) o.playing.pauseVideo();
        }
    },
    o.players = {
        register: function(id){
            if( o.create.length === 0 ){
                var _yTag = document.createElement('script');
                    _yTag.src = 'https://www.youtube.com/iframe_api';
                var _yScript = document.getElementsByTagName('script')[0];
                    _yScript.parentNode.insertBefore(_yTag, _yScript);
            }
            o.create.push(id);
        },
        init: function(){
            if(o.create.length > 0){
                __tnt.log('  Players:');
                $.each(o.create, function(i, video){
                    __tnt.log('    '+ video);
                    new YT.Player(video, {
                        events: {
                            'onStateChange': o.state.change
                        }
                    });
                });
            }
        }
    }
    return o;
})(window);

/** 
  Fire youtube onload function when called.
 */
function onYouTubeIframeAPIReady(){
    /** 
      Wait will window load to ensure all players registered.
      For some reason attaching YT class to a player before its fully loaded, can cause event bindings to fail.
     */
    jQuery(window).load(function(){
        __tnt.log('Init YT:');
        __tnt.youtube.players.init();
    });
}