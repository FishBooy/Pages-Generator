

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



	/*
	**拖拽及排序:
	**变量&&绑定&&初始化
	**控制按钮组
	*/
	var drag=0,
		sort=0,
		demo=$('.demo'),
		htmlData={count:0,step:[demo.html()]},
		selector='.lyrow,.box,.wdg',
		body=$('body').addClass('edit');
	function htmlRec(del){ 
		var html=$('.demo').html(),
			data=htmlData;
		data.count++;
		if(del){ data.step.push(html);console.log('save!!!',htmlData);return false;}
		!drag && !sort && data.step.push(html);
	};
	function initContainer(){
		$('.demo, .demo .col').sortable({
			connectWith: '.col',
			opacity: .5,
			handle: '.drag',
			start: function(e,t) {(sort===0) && (sort++)},
			stop: function(e,t) {console.log('demo排序结束',t.item.parent());sort--;}
		});
	};
	function removeElm() {
		$('.demo').on('click','.remove',function(e) {
			e.preventDefault();
			$(this).parent().parent().remove();
			htmlRec(true);
		})
	};
	//排序初始化
	initContainer();
	//左侧拖拽&&右侧排序
	$('.sidebar-nav .lyrow').draggable({
		connectToSortable: '.demo',
		helper: 'clone',
		opacity: .5,
		start: function(e,t) {drag++},
		drag: function(e, t) {t.helper.width(400)},
		stop: function(e, t) {
			drag--;
			htmlRec();
			$('.demo .col').sortable({
				opacity: .35,
				connectWith: '.col',
				start: function(e,t) {(sort===0) && (sort++)},
				stop: function(e,t) {console.log('col排序结束',t);sort--;}
			});
		}
	});
	$('.sidebar-nav .box').draggable({
		connectToSortable: '.col',
		helper: 'clone',
		opacity: .5,
		start: function(e,t) {drag++},
		drag: function(e, t) {t.helper.width(400)},
		stop: function() {drag--;htmlRec()}
	});
	$('.sidebar-nav .wdg').draggable({
		connectToSortable: '.col',
		helper: 'clone',
		opacity: .5,
		start: function(e,t) {drag++},
		drag: function(e, t) {t.helper.width(400)},
		stop: function() {
			$('.demo .slider').data('gallery',null).css('width','100%').gallery({
				height:360
			});
			drag--;
			htmlRec();
		}
	});
	//按钮组件相关
	removeElm();
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
		});
	$('.slider').gallery({height:200});


	/*
	**顶部操作按钮
	**编辑-预览-撤销-重做-清空-下载-保存
	*/
	var docWrap=$('#doc-wrap'),
		topBtns=$('.file-btns'),
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
	function reWrite(e){
		e.preventDefault();
		var data=htmlData,
			id=$(this).attr('id');
		if((id==='back') && (data.count!==0)){
			data.count-- ;
		}else{
			if((id==='forward') && (data.count<(data.step.length-1))){data.count++}
		};
		$('.demo').html(data.step[data.count]);
		initContainer();	
	};
	$('#edit').on('click',{cN1:cN.sp,cN2:cN.e,lv:0},uiAlt);
	$('#preview').on('click',{cN1:cN.e,cN2:cN.sp,lv:-100},uiAlt);
	$('#back').on('click',reWrite);
	$('#forward').on('click',reWrite)
	// $('#download-source').on({'click'},{},);


})