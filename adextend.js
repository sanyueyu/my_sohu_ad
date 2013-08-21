/**
 * @desp 搜狐特型广告-扩展广告
 * @ver 2.0
 * @require sohuFlash1.js
 * @readme:
 *              1,改写了flash调用接口为adextend.open/adextend.close
 *              2,init函数:负责初始化包括DIV,cookie
 *                control函数:处理event事件、控制广告打开和关闭
 *                show和hide函数:打开和隐藏广告,供control调用
 *             3,加入cookie限制变量trigger_limit
 *             4,加入注入函数injectInto用于扩展
 */
window.adextend = (function ($) {
    var defaults = {
            small_flash: {
                src: null,
                name: "small_flash",
                width: 260,
                height:328,
                click: null,//连接地址
                id: "small_flash",//div的ID
                top: 0,
                left: 0
            },
            big_flash: {
                src: null,
                name: "big_flash",
                width: 520,
                height:328,
                click: null,//连接地址
                id: "big_flash",//div的ID
                top: 0,
                left: -260
            },
            $wrap_div: null,
            trigger_limit: 10000,
            auto: true,//判断是否需要自动进入control
            init: null,
            control: null,
            show: null,
            hide:null
    },
    opt,
	sohuvd = new Cookie(document, "ad_det",24);
 function injectInto (arg) {                      //注入函数
     if(typeof (opt[arg]) == 'function') opt[arg]();
 }
 function loadFlash (flash) {//加载flash
		 var sohuFlash2 = new sohuFlash(flash.src, flash.name, flash.width, flash.height,"7");
    	sohuFlash2.addParam("quality", "high");
    	sohuFlash2.addParam("wmode", "transparent");
   		sohuFlash2.addParam("allowScriptAccess", "always");
   	 	sohuFlash2.addVariable("clickthru",escape(flash.click));
    	sohuFlash2.write(flash.id);
		return this;
 }
 function createDIV(flash) {
	 	var $div = $('<div id = ' + flash.id + '></div>').css({
			position: 'absolute',
			'z-index': 1000,
			'width': flash.width,
     		'height': flash.height,
    		left: flash.left,
     		top: flash.top,
            display: 'none'
		});
     opt.$wrap_div.append($div);
 }
 function init (options) {//初始化
     opt = $.extend(true, defaults, options);
     injectInto("init");             //注入
     opt.$wrap_div.css({//配置容器DIV
         "position": "relative",
         "height": opt.small_flash.height,
         "width": opt.small_flash.width
     }).empty();
     sohuvd.load();//加载cookie
     sohuvd.vi = sohuvd.vi || 0;
	createDIV(opt.small_flash);//小flash容器
	createDIV(opt.big_flash);//大flash容器
	if(opt.auto) control();
	return this;
 }
 function show () {//显示
     injectInto("show");           //注入
     if(sohuvd.vi < opt.trigger_limit) {//后两次触发播放
         loadFlash(opt.big_flash);
         $("#big_flash").show();
         $("#small_flash").hide().empty();
         sohuvd.vi++;
         sohuvd.store();
     } else {
         return;
     }
	 return this;
 }
 function hide() {//隐藏
     injectInto("hide");      //注入
     loadFlash(opt.small_flash);
	 $("#big_flash").hide().empty();
	 $("#small_flash").show();

	 return this;
 }
 function control () {//控制
     injectInto("control");       //注入
	 if(sohuvd.vi == 0) {
		show();
	} else {
		hide();	
	}
   //可继续增加其他控制
	return this;
 }
 return {
	init: init ,
	control: control,
	open: show,
	close: hide
 };
})(jQuery);
//下面是投放代码
adextend.init({
    $wrap_div: $( ".TurnAD260328"),
    trigger_limit: 3,  //此处设置两次触发
    small_flash : {
    src: "flash/smaill_flash.swf",
    click: "http://www.sohu.com"
    },
    big_flash: {
    src: "flash/big_flash.swf",
    click: "http://www.sohu.com"
    },
    hide: function () {
        alert("this is hide callback");
    }
});

