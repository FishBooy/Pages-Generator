/*=================可编辑样式====================*/
var Data={
	type:{
		head:{
			css:['size','background','border','text']
		},
		paragraph:{
			css:['size','background','border','text']		
		},
		list:{
			css:['size','background','border','text']
		},
		image:{
			css:['size','background','border']
		}
	}	
};

// function(cssArr){
// 	var i=0,l=cssArr.length,html;
// 	for(i;i<cssArr.length;i++){
// 		switch (cssArr[i]){
// 			case 'align':
// 		}
// 	}
// }
/*=============================================*/
$(function(){
	/*
	**获取本地存储并填充
	*/
	var demo=$('.demo'),
		htmlData;
	function supportstorage() {
		if (typeof window.localStorage=='object') 
			return true;
		else
			return false;		
	};
	function clearResizeHtml(){//填充之前清除之前resize时动态增加的html 避免重新初始化时冲突
			$('.ui-resizable').removeClass('ui-resizable');
			$('.ui-resizable-handle').remove();
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
			clearResizeHtml()
		}
	};
	function reBuild(e){
		var html='<div><ul>'+$('ul',e).html()+'</ul></div>',
			p=e.parent(),
			w=p.width(),
			h=w/2;

		e.empty()
		.data('gallery',null)
		.removeClass()
		.addClass('slider')
		.html(html)
		.gallery({height:h,width:w});
	}
	function reSlide(wrap,reb){
		box=wrap?wrap:demo;
		$.each($('.slider',box),function(k,v){
			if(reb){reBuild($(this));}
			else{
				var h=$(this).parent().width()/2;
				$(this).gallery({height:h});
			}
		});
	}
	restoreData();
	//尺寸调整
	var docWindow=$(window),
		wrap=$('.doc-wrap'),
		sideBar=$('.side-bar'),
		mp=parseInt(wrap.css('paddingTop'))
		+parseInt(wrap.css('paddingTop'))
		+parseInt(wrap.css('marginTop')),
		resizeTid=null;
	function modalMove(){
		$('.modal:visible').each(function(){
			$(this).css({left:($(window).width()-$(this).width())/2});
		})
	}
	function heightChe(r){
		if(demo.innerHeight()>wrap.height()){
			wrap.addClass('scroll');
			resizeInit($('.row',demo).data('resize',0));
			reSlide(demo,1);
		}else{
			if(wrap.hasClass('scroll')){
				wrap.removeClass('scroll');
				reSlide(demo,1)
			}else{
				r && reSlide(demo,1);
			};
			r && resizeInit($('.row',demo).data('resize',0));
		}
	};
	function sizeInit(){
		var H=docWindow.height();
		sideBar.css('height',H);
		wrap.css('height',H-mp);
		modalMove();

		heightChe(1)
		resizeTid=null;	
	};
	document.onselectstart=function(){return false;};
	sizeInit();
	docWindow.on('resize',function(){
		resizeTid && clearTimeout(resizeTid);
		resizeTid=setTimeout(sizeInit,50);
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
	function htmlRec(d){ 
		var html=demo.html(),
			data=htmlData;
		data.count++;
		if(d){ data.step.push(html);heightChe();return false;}
		!drag && !sort && data.step.push(html);
		heightChe();
	};
	function initContainer(){
		var opts={
			connectWith: '.col',
			opacity: .5,
			handle: '.drag',
			start: function(e,t) {(sort===0) && (sort++)},
			stop: function(e,t) {sort--;drag || htmlRec();}	
		},opts2=$.extend({},opts,{
			stop: function(e,t) {
				sort--;
				if(!drag){
					console.log('sort stop')
					htmlRec();
				}
			}
		});
		
		demo.sortable(opts);
		$('.col',demo).sortable(opts2);
	};
	function resizeInit(rows){
		$.each(rows,function(){
			if(!$(this).data('resize')){
				var row=$(this).addClass('resizable'),
					cols=$('.col',row),
					rWidth=row.width(),
					dis=(100/$('.col',row).length).toFixed(1);

				$.each(cols,function(k,v){
					var col=$(v),
						next=col.next();
					if(next.length){
						var drag;
						if(!next.hasClass('resize-handle')){
							drag=$('<div></div>').addClass('resize-handle').insertAfter(col).css('left',(k+1)*dis+'%');
						}else{drag=col.next()}
						var prevs=drag.prevAll('.resize-handle'),
							prev=prevs.eq(0),
							len=prevs.length,
							nextCol=drag.next();
							
						drag.iqlDrag({
							ready:function(opts){
								opts.max=parseInt(drag.css('left'))+nextCol.width(),
								opts.min=(len)?parseInt(prev.css('left')):0;
							},
							upCall:function(o,l,max,min){
								o.css('left',(l/rWidth*100).toFixed(1)+'%');
								col.css('width',((l-min)/rWidth*100).toFixed(1)+'%');
								nextCol.css('width',((max-l)/rWidth*100).toFixed(1)+'%');

								reSlide(row,1);
								htmlRec();
							}
						});
					}
				});
				$(this).data('resize',1);
			}
		})
	};
	function setId(){};
	//排序初始化
	initContainer();
	//左侧拖拽&&右侧排序
	$('.sidebar-nav .lyrow').draggable({
		connectToSortable: '.demo',
		helper: 'clone',
		opacity: .5,
		start: function(e,t) {drag++},
		drag: function(e,t) {t.helper.width(400);},
		stop: function(e,t) {
			drag--;
			htmlRec();
			var cols=$('.col',demo);
			cols.sortable({
				opacity: .5,
				connectWith: '.col',
				handle:'.drag',
				start: function(e,t) {(sort===0) && (sort++)},
				stop: function(e,t) {
					sort--;
					if(!drag){
						reSlide(t.item.eq(0),1);
						htmlRec();
					} 
				}
			});
			resizeInit($('.row',demo));
			t.helper.attr('id','idname')
		}
	});
	$('.sidebar-nav .box').draggable({
		connectToSortable: '.col',
		helper: 'clone',
		opacity: .5,
		start: function(e,t) {drag++},
		drag: function(e,t) {t.helper.width(400);},
		stop: function(e,t) {drag--;htmlRec();}
	});
	$('.sidebar-nav .wdg').draggable({
		connectToSortable: '.col',
		helper: 'clone',
		opacity: .5,
		start: function(e,t) {drag++},
		drag: function(e, t) {t.helper.width(400)},
		stop: function() {
			reSlide();
			drag--;
			htmlRec();
		}
	});
	//按钮组件相关
	$('.tabs').tinyTab();
	demo
	.on('click','.remove',function(e) {
		e.preventDefault();
		$(this).parent().parent().remove();
		htmlRec(true);
	})
	.on('click','.edit',function(e) {
		e.preventDefault();
		var p=$(this).parent().parent(),type=p.data('type');
		$('.modals').fadeIn(200, function() {
			var layer=$('.edit-layer',this),
				css=Data['type'][type]['css'].join(','),trs=$('tr',layer).removeClass('show'),len=trs.length-1,i;
				for(i=0;i<len;i++){
					if(css.indexOf(trs[i].className)===-1){trs.eq(i).addClass('show')}
				}
			layer.css({left:($(window).width()-layer.width())/2})
			.on('click',function(e){
				e.preventDefault();
				$(e.target).hasClass('close') || e.stopPropagation();
			}).fadeIn(100);
		});
	});

	$(".color-picker").cxColor();
	$('.modals').on('click',function() {
		$(this).fadeOut(100, function() {
			$(this).find('.edit-layer').hide();
		});
	});
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


	/*
	**顶部操作按钮
	**编辑-预览-撤销-重做-清空-下载-保存
	*/
	var topBtns=$('.file-btns'),
		cN={e:'edit',sp:'source-preview',ac:'active'};
	function uiAlt(e){
		var data=e.data,
			ac=cN.ac,
			x=(data.cN1===cN.sp)? 1:0;
		e.preventDefault();
		topBtns.find('.active').removeClass(ac);
		$(this).addClass(ac);
		x && body.removeClass(data.cN1).addClass(data.cN2);
		sideBar.animate({left:data.lv},180,function(){
			!x && body.removeClass(data.cN1).addClass(data.cN2);
			reSlide(demo,1);
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
			if((id==='forward') && (data.count<(data.step.length-1))){data.count++}else{
				return false;
			}
		};
		$('.demo').html(data.step[data.count]);

		initContainer();
		resizeInit($('.row',demo));
		reSlide(demo,1);	
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
	$('#save').on('click',function(e){
		e.preventDefault();
		saveLayout();
		console.log('保存成功')
	});












})