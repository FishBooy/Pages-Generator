/************
* name: jquery-gallery
* version: 2.0
* date: 2014-02-24
* author: kevin
* github: https://github.com/FishBooy
* email: qwk.love@gmail.com
*
**************/
;(function($) {

	/*====构造函数====*/
	var Gallery = function(opts, gallery) {
		this.opts = $.extend({}, this.defaultOpts, opts ? opts : {});
		this.gallery = gallery.addClass('Gallery');
		this.slideWrap = $('div',this.gallery).addClass('slide-wrap');

		this.setData();
		this.eventsBind();
	}

	/*====对象属性以及方法====*/
	//滑动算法
	Gallery.prototype.Tween = {
		Quart: {
			easeOut: function(t, b, c, d) {
				return -c * ((t = t / d - 1) * t * t * t - 1) + b;
			}
		},
		Back: {
			easeOut: function(t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
			}
		},
		Bounce: {
			easeOut: function(t, b, c, d) {
				if ((t /= d) < (1 / 2.75)) {
					return c * (7.5625 * t * t) + b;
				} else if (t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
				} else if (t < (2.5 / 2.75)) {
					return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
				} else {
					return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
				}
			}
		}
	};

	//默认参数
	Gallery.prototype.defaultOpts = {
		width:0,
		height:0,
		animation: 'slide',
		shaHeight: 42,
		hasTitle: true,
		hasArrow: true,
		arrType: 'inside',
		arrAni: true,
		hasBtn: true,
		btnType: 'btn',
		btnBorder: 8,
		btnShape: '',
		btnsMar: 40,
		btnMar: 5,
		btnTxt: false,
		auto: true,
		duration: 40,
		pause: 3000,
		interval: 10,
		onStart: function() {},
		onFinish: function() {}
	};

	//完善当前dom并将各主要元素的jquery对象与对象属性相对应
	Gallery.prototype.setData = function() {

		var bHtml = '',
			tHtml = '',
			btnStr = '',
			btnsWidth,
			gallery=this.gallery,
			img=$('img', gallery);

		this.mounts = img.length;
		this.width = (this.opts.width)? this.opts.width:gallery.width();
		gallery.css('width',this.width);
		this.imgsContainer = $('ul', gallery).addClass('imgs-container').css('width', this.mounts * this.width);
		this.height = (this.opts.height)? this.opts.height:gallery.height();		
		
		this.images = img.css({
			width: this.width,
			height: this.height
		});
		this.shadow = $('<div>').addClass('shadow').css('height',this.opts.shaHeight).appendTo(gallery);

		for (var i = 1; i <= this.mounts; i++) {
			btnStr = (this.opts.btnType=='img')? '<img src="'+this.images.eq(i-1).attr('src')+'"/>':i;
			bHtml += '<li><a href="">' + btnStr + '</a></li>';
			tHtml += '<a href="">' + this.images.eq(i - 1).attr('alt') + '</a>';
		};
		this.buttons = (this.opts.hasBtn)? $('<ol>').addClass('buttons'+(' '+this.opts.btnShape)+' '+((this.opts.btnTxt)?'hasTxt':'')).html(bHtml).appendTo(gallery):null;
		if(this.opts.btnType=='img'){
			btnsWidth = this.width-this.opts.btnsMar,
			bW = parseInt(btnsWidth/this.mounts)-this.opts.btnMar,
			bH = this.height*bW/this.width;
			this.buttons.removeClass('buttons').addClass('img-btns').css({
				width: btnsWidth,
				left: this.opts.btnsMar/2,
				bottom: this.opts.btnMar
			});
			this.buttons.find('img').css({
				width: bW-this.opts.btnBorder,
				height:bH
			})
		}
		this.titles = (this.opts.hasTitle)? $('<p>').addClass('titles').html(tHtml).appendTo(gallery):null;
		
		if(this.opts.hasArrow){
			var f=(this.opts.arrAni)? '':'no-fade';
				preHtml ='<a href="" class="prev-btn '+f+'"><</a>',
				nextHtml = '<a href="" class="next-btn '+f+'">></a>';
			if(this.opts.arrType==='outside'){
				this.arrows = $('<div>').addClass('arrows-out').html(preHtml+'<span class="curNum"></span><span>/'+this.mounts+'</span>'+nextHtml).appendTo(gallery);
			}else{
				this.arrows = (this.opts.hasArrow)?($(preHtml+nextHtml).appendTo(gallery)):null;
			}
		}else{
			this.arrows = null;
		}

		this.target = null;
		this.begin = this.slideWrap.scrollLeft();
		this.change = this.width;
		this.cFixed = this.width;
		this.timer = 0;
		this.timeId = null;
		this.auto = this.opts.auto;
	};

	//事件绑定
	Gallery.prototype.eventsBind = function() {

		var self = this,
			btns = self.buttons;

		btns && $('a', btns).eq(0).addClass('on');
		self.titles && $('a', self.titles).eq(0).addClass('curInfo');
		self.arrows && (self.opts.arrType==='outside') && (self.arrows.find('.curNum').text(1));

		btns && $.each($('a', btns), function(k, v) {
			$(v).bind('mouseover', {
				index: k,
				self: self
			}, self.setBeforeSlide)
				.bind('mouseleave', function() {
					self.auto = true;
					self.timer == 0 && self.setBeforeSlide()
				}).click(function(e) {
					e.preventDefault()
				})
		});

		if (self.opts.hasArrow) {
			$('a.next-btn', this.gallery).bind('click', {
				Event: 'next',
				self: self
			}, this.setBeforeSlide);
			$('a.prev-btn', this.gallery).bind('click', {
				Event: 'prev',
				self: self
			}, this.setBeforeSlide);
			(self.opts.arrType==='outside') || (!self.opts.arrAni) || self.gallery
				.bind({
					mouseover: function(e) {
						self.arrows.fadeIn(300)
					},
					mouseleave: function() {
						self.arrows.fadeOut(100)
					}
				})
				.contents()
				.not('ul,a.prev-btn,a.next-btn')
				.not($('ul', self.container).contents())
				.not('.slide-wrap')
				.bind('mouseover', function(e) {
					e.stopPropagation()
					self.arrows.fadeOut(100)
				})
		};
		self.auto && self.setBeforeSlide()
	};

	//开始滑动之前的预设
	Gallery.prototype.setBeforeSlide = function(e) {
		if (e == undefined) {
			clearTimeout(this.timeId);
			var self = this;
			self.begin = self.slideWrap.scrollLeft();
			self.change = (self.begin == (self.mounts - 1) * self.cFixed) ? -self.begin : self.cFixed;
			self.alterClassName();
			self.timeId = setTimeout(function() {self.slideRun()}, self.opts.pause)
		} else {
			e.preventDefault();
			var self = e.data.self;
			clearTimeout(self.timeId);
			self.begin = self.slideWrap.scrollLeft();

			if (e.data.Event) {
				var destination;
				e.preventDefault()
				if (e.data.Event == 'next') {
					var num = self.begin / self.cFixed;
					if (self.begin != (self.mounts - 1) * self.cFixed) {
						/*next平滑的方式是判断（Data.begin / Data.cFixed）为浮点还是整型
						 **整型则+1，浮点型+2(num=...表达式中)
						 **/
						if (num == parseInt(num)) {
							inte = parseInt(num) + 1;
						} else {
							if (parseInt(num) == (self.mounts - 2)) {
								inte = parseInt(num) + 1
							} else {
								inte = parseInt(num) + 2
							}
						};
						destination = inte * self.cFixed;
						self.alterClassName(inte);
					}else{
						destination=self.begin;
					}
				} else {
					if (self.begin != 0) {
						var index = parseInt(self.begin / self.cFixed - 1);
						destination = index * self.cFixed;
						self.alterClassName(index);
					}
				};
				self.change = destination - self.begin;
				self.timer = 0;
				self.slideRun()
			} else {
				var index = e.data.index;
				self.auto = false;
				self.target = index * self.cFixed;
				self.change = self.target - self.begin;
				self.timer = 0;
				self.alterClassName(index);
				self.slideRun();
			}
		};
	};

	//开始滑动之前按钮和标题的更换 
	Gallery.prototype.alterClassName = function(index) {
		var b=this.buttons,
			t=this.titles,
			arrNum= (this.arrows && (this.opts.arrType==='outside'))? this.arrows.find('.curNum'):null;
		b && this.buttons.find('a.on').removeClass('on');
		t && this.titles.find('.curInfo').removeClass('curInfo');
		if (typeof index == 'number') {
			b && $('a', this.buttons).eq(index).addClass('on')
			t && $('a', this.titles).eq(index).addClass('curInfo');
			arrNum && arrNum.text(index+1);
		} else {
			var next = parseInt(this.begin / this.cFixed);
			b && $('a', this.buttons).eq(next).addClass('on')
			t && $('a', this.titles).eq(next).addClass('curInfo');
			arrNum && arrNum.text(next+1);
		};
	};

	//滑动主体
	Gallery.prototype.slideRun = function() {
		var self = this;
		if (this.timer <= this.opts.duration) {
			var position = Math.round(this.Tween.Quart.easeOut(this.timer, this.begin, this.change, this.opts.duration))
			this.slideWrap.scrollLeft(position);
			this.timer++;
			this.timeId = setTimeout(function() {self.slideRun()}, this.opts.interval)
		} else {
			this.timer = 0;
			this.auto && this.setBeforeSlide()
		}
	};

	/*================转化===============*/
	//转化为jquery插件
	$.fn.gallery = function(opts) {
		return this.each(function() {
			$(this).data('gallery') || $(this).data('gallery', new Gallery(opts ? opts : {}, $(this)))
		});
	}
})(jQuery);