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
		$(this).parent().remove();
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


	//左侧菜单折叠
	// var topNav=$('.top-nav'),
	// 	subNav=$('.sub-nav');

	// topNav.find('li').eq(0).addClass('open');
	// subNav.eq(0).slideDown();

	// $('.top-nav>li>a').on('click',function(e){
	// 	e.preventDefault();
	// 	var preList=$('.sub-nav:visible'),
	// 		nextList=$(this).next();
	// 	if($(this).next().css('display')==='none'){
	// 		topNav.find('.open').removeClass('open');
	// 		preList.slideUp('nomal',function(){
	// 			preList.prev().removeClass('open')
	// 		});
	// 		$(this).parent().addClass('open').find('ul').slideDown()
	// 	}else{
	// 		return false;
	// 	};
	// });

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
	removeElm();

})