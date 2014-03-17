//拖拽变量
var currentDocument = null;
var timerSave = 1000;
var stopsave = 0;
var startdrag = 0;
var demoHtml = $('.demo').html();
var currenteditor = null;
function removeElm() {
	$('.demo').on('click','.remove',function(e) {
		e.preventDefault();
		$(this).parent().parent().remove();
		if (!$('.demo .lyrow').length > 0) {
			// clearDemo()
		}
	})
}
function initContainer(){
	$('.demo, .demo .col').sortable({
		connectWith: '.col',
		opacity: .5,
		handle: '.drag',
		start: function(e,t) {
			if (!startdrag) stopsave++;
			startdrag = 1;
		},
		stop: function(e,t) {
			if(stopsave>0) stopsave--;
			startdrag = 0;
		}
	});
};
$(function(){

	//尺寸调整
	var docWindow=$(window),
		docWrap=$('.doc-wrap'),
		sideBar=$('.side-bar'),
		resizeTid=null;
	function sizeInit(){
		sideBar.css('height',docWindow.height());
		resizeTid=null;		
	};
	sizeInit();
	docWindow.on('resize',function(){
		resizeTid && clearTimeout(resizeTid);
		resizeTid=setTimeout(sizeInit,20);
	});

	//左侧菜单折叠
	var topNav=$('.top-nav'),
		subNav=$('.sub-nav');
	$('.top-nav>li>a')
	.on('click',function(e){
		e.preventDefault();
		e.stopPropagation()
		var menuList=$(this).next();
		if(menuList.css('display')=='block'){
			menuList.slideUp('fast');
			$(this).removeClass('open');
		}else{
			$(this).addClass('open');
			menuList.slideDown('fast');
		}
	});

	//右侧排序初始化
	initContainer();
	//左侧菜单拖拽
	$('.sidebar-nav .lyrow').draggable({
		connectToSortable: '.demo',
		helper: 'clone',
		opacity: .5,
		start: function(e,t) {
			if (!startdrag) stopsave++;
			startdrag = 1;
		},
		drag: function(e, t) {
			t.helper.width(400)
		},
		stop: function(e, t) {
			$('.demo .col').sortable({
				opacity: .35,
				connectWith: '.col',
				start: function(e,t) {
					if (!startdrag) stopsave++;
					startdrag = 1;
				},
				stop: function(e,t) {
					// alert('sort end')
					if(stopsave>0) stopsave--;
					startdrag = 0;
				}
			});
			
			if(stopsave>0) stopsave--;
			startdrag = 0;
			//console.log('drag end',stopsave,startdrag)
		}
	});
	$('.sidebar-nav .box').draggable({
		connectToSortable: '.col',
		helper: 'clone',
		opacity: .5,
		// start: function(e,t) {
		// 	if (!startdrag) stopsave++;
		// 	startdrag = 1;
		// },
		drag: function(e, t) {
			t.helper.width(400)
		}
		// stop: function() {
		// 	handleJsIds();
		// 	if(stopsave>0) stopsave--;
		// 	startdrag = 0;
		// }
	});
	$('.sidebar-nav .wdg').draggable({
		connectToSortable: '.col',
		helper: 'clone',
		opacity: .5,
		// start: function(e,t) {
		// 	if (!startdrag) stopsave++;
		// 	startdrag = 1;
		// },
		drag: function(e, t) {
			t.helper.width(400)
		},
		stop: function() {
			// handleJsIds();
			// if(stopsave>0) stopsave--;
			// startdrag = 0;
			//幻灯初始化
			$('.demo .slider').data('gallery',null).css('width','100%').gallery({
				height:360
			});
		}
	});

	//右侧box lyrow wdg事件绑定
	var selector='.lyrow,.box,.wdg';
	$('.edit .demo')
		.on('mouseover',selector,function(e){
			e.stopPropagation();
			$(this).children('.ctrl-btns').addClass('show');
		})
		.on('mouseleave',selector,function(){
			$(this).children('.ctrl-btns').removeClass('show');
		})
		.on('mouseout',selector,function(){
			$(this).children('.ctrl-btns').removeClass('show');
		})
	removeElm();

	$('.slider').gallery({height:200});


	//顶部按钮单击事件绑定
	var docWrap=$('#doc-wrap'),
		topBtns=$('.file-btns'),
		body=$('body'),
		cN={e:'edit',sp:'source-preview',ac:'active'};
		function uiAlt(e){
			var data=e.data,ac=cN.ac;
			e.preventDefault();
			topBtns.find('.active').removeClass(ac);
			$(this).addClass(ac);
			sideBar.animate({left:data.lv},100,function(){
				body.removeClass(data.cN1);
				body.addClass(data.cN2);
			});
			return false;		
		};
	$("#edit").on('click',{cN1:cN.sp,cN2:cN.e,lv:0},uiAlt);
	$("#source-preview").on('click',{cN1:cN.e,cN2:cN.sp,lv:-100},uiAlt);


})