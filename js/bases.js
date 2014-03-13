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
		// docWrap.css('height',docWindow.height()-parseInt(docWrap.css('paddingTop'))-parseInt(docWrap.css('paddingBottom')));
		resizeTid=null;		
	};
	sizeInit();
	docWindow.on('resize',function(){
		resizeTid && clearTimeout(resizeTid);
		resizeTid=setTimeout(sizeInit,20);
	});

	//右侧box lyrow wdg事件绑定
	var selector='.lyrow,.box,.wdg';
	$('.demo')
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
	//左侧菜单折叠
	var topNav=$('.top-nav'),
		subNav=$('.sub-nav');

	$('.top-nav>li>a').on('click',function(e){
		e.preventDefault();
		e.stopPropagation()
		var menuList=$(this).next();
		if(menuList.css('display')=='block'){menuList.hide()}else{menuList.show()}
	});

	//右侧排序初始化
	initContainer();
	//左侧菜单'布局'拖拽
	$('.sidebar-nav .lyrow').draggable({
		connectToSortable: '.demo',
		helper: 'clone',
		handle: '.drag',
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
					if(stopsave>0) stopsave--;
					startdrag = 0;
				}
			});

			if(stopsave>0) stopsave--;
			startdrag = 0;
		}
	});
	//左侧菜单'布局'拖拽
	$('.sidebar-nav .box').draggable({
		connectToSortable: '.col',
		helper: 'clone',
		handle: '.drag',
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
	//左侧'组件'拖拽
	$('.sidebar-nav .wdg').draggable({
		connectToSortable: '.col',
		helper: 'clone',
		handle: '.drag',
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
	removeElm();

$('.slider').gallery({height:200});






$('body').on('click',function(){
	$('.sub-nav').hide();
})
})