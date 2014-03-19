

$(function(){

	/*
	**获取本地存储并填充
	**
	*/
	var demo=$('.demo');
	function supportstorage() {
		if (typeof window.localStorage=='object') 
			return true;
		else
			return false;		
	};
	function restoreData(){
		if (supportstorage()) {
			htmlData = JSON.parse(localStorage.getItem("htmlData"));
			if(!htmlData){
				htmlData={count:0,step:[demo.html()]};
				return false;
			};
			if(!htmlData.count){return false;}
			demo.html(htmlData.step[htmlData.count]);
		}
	};
	restoreData();

	//尺寸调整
	var docWindow=$(window),
		wrap=$('.doc-wrap'),
		sideBar=$('.side-bar'),
		mp=parseInt(wrap.css('paddingTop'))
		+parseInt(wrap.css('paddingTop'))
		+parseInt(wrap.css('marginTop')),
		resizeTid=null;
	function heightChe(){
		if(demo.innerHeight()>wrap.height()){
			wrap.addClass('scroll')
		}else{wrap.removeClass('scroll')}
	}
	function sizeInit(){
		var H=docWindow.height();
		sideBar.css('height',H);
		wrap.css('height',H-mp);
		heightChe()
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
		selector='.lyrow,.box,.wdg',
		body=$('body').addClass('edit');
	function htmlRec(del){ 
		var html=demo.html(),
			data=htmlData;
		data.count++;
		if(del){ data.step.push(html);return false;}
		!drag && !sort && data.step.push(html);
		heightChe();
	};
	function initContainer(){
		$('.demo, .demo .col').sortable({
			connectWith: '.col',
			opacity: .5,
			handle: '.drag',
			start: function(e,t) {(sort===0) && (sort++)},
			stop: function(e,t) {sort--;drag || htmlRec();}
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
				stop: function(e,t) {sort--;drag || htmlRec(); }
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
	var topBtns=$('.file-btns'),
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
	function saveLayout(){
		var data = htmlData,
			len=data.step.length,
			count=data.count,
			n;
		if (len>count) {
			n=len-count;
			data.step.splice(count+1,len-count+1)
		}
		if (supportstorage()) {
			localStorage.setItem("htmlData",JSON.stringify(data));
		}
		//console.log(data);
		/*$.ajax({  
			type: "POST",  
			url: "/build/saveLayout",  
			data: { layout: $('.demo').html() },  
			success: function(data) {
				//updateButtonsVisibility();
			}
		});*/
	}
	$('#edit').on('click',{cN1:cN.sp,cN2:cN.e,lv:0},uiAlt);
	$('#preview').on('click',{cN1:cN.e,cN2:cN.sp,lv:-100},uiAlt);
	$('#back').on('click',reWrite);
	$('#forward').on('click',reWrite);
	$('#clean-up').on('click',function(e){
		e.preventDefault();
		demo.empty();
		htmlData={count:0,step:[demo.html()]}
	});
	// $('#download-source').on({'click'},{},);
	$('#save').on('click',function(e){
		e.preventDefault();
		saveLayout();
		alert('保存成功')
	})

})