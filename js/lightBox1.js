(function($){
	var lightBox=function(setting){
		this.settings={
				speed:300
			}
		$.extend(this.settings,setting);
		
		var self=this;
		this.mask_div=$('<div class="div_mask">');						//定义遮罩层
		this.xianshi_div=$('<div class="div_xianshi">');				//定义显示层
		this.body_d=$(document.body);									//定义body
		
		this.xuanran()													//执行显示遮罩层和显示层的方法(+0)
		
		this.div_imgArea= this.xianshi_div.find("div.div_img");			//div标签 放置图片、按钮区域
		this.imgArea= this.xianshi_div.find("img.xianshi_img");			//img标签 放置图片
		this.lBtnArea= this.xianshi_div.find("span.leftBtn");				//span标签 放置左边按钮
		this.rBtnArea= this.xianshi_div.find("span.rightBtn");				//span标签 放置右边按钮
		
		this.div_imgDesArea= this.xianshi_div.find("div.div_imgDes");		//div标签 图片描述区域
		this.desCont_pArea= this.xianshi_div.find("p.desCont_p");			//p标签 图片内容
		this.desCont_spanArea= this.xianshi_div.find("p.desCont_span");	//p标签 图片索引
		this.closeBtnArea= this.xianshi_div.find("div.closeBtn");			//div标签 关闭按钮

		
		this.groupName=null;
		this.groupData=[];
		this.timer=null;
		this.isResize=false;
		this.body_d.delegate(".lightTrue,*[data-role='d_lightTrue']","click",function(e){
			e.stopPropagation();
			var currentGpName=$(this).attr("data-group")
			if(currentGpName!=self.groupName){
				self.groupName=currentGpName;
				self.setGroup();														//获取组名(+1)
			}
			
			self.initUp($(this));														//初始化弹出层(+2)
			
		})
		
		this.mask_div.click(function(){												//点击淡出弹出框和遮罩层
			$(this).fadeOut();
			self.xianshi_div.fadeOut();
			self.isResize=false;
		})
		
		this.closeBtnArea.click(function(){											//点击淡出弹出框和遮罩层
			self.xianshi_div.fadeOut();
			self.mask_div.fadeOut();
			self.isResize=false;
		})
		
		this.lBtnArea.hover(function(){												//显示左图标
				if(!$(this).hasClass("disable")&&self.groupData.length>1){
					$(this).addClass("showlBtn");
				}
			
			},function(){
				$(this).removeClass("showlBtn");		
		}).click(function(){															//点击左键（+8）
				self.goto("prev")
			})
		
		this.rBtnArea.hover(function(){												//显示右图标
				if(!$(this).hasClass("disable")&&self.groupData.length>1){
					$(this).addClass("showrBtn");
				}
			
			},function(){
				$(this).removeClass("showrBtn");		
			}).click(function(){
				self.goto("next")														//点击右键（+8）
		})
		
		$(window).resize(function(){	
			if(self.isResize){
				window.clearInterval(self.timer)
				self.timer=window.setTimeout(function(){
					var wSrc= self.groupData[self.index].src;
					self.showImg(wSrc)
				},500)
			}
		}).keydown(function(e){
			var keyV= e.which;
			if(keyV==37||keyV==38){
				self.goto("prev")	
			}
			if(keyV==39||keyV==40){
				self.goto("next")	
			}
		});
	}
		
	
	lightBox.prototype={
		
		xuanran:function(){													//定义遮罩层和显示层的方法(-0)
			var str='<div class="div_img">'+				
           		 		'<span class="lrBtn leftBtn"></span>'+
          	    	    '<img src="images/3-4.jpg" class="xianshi_img"/>'+
						'<span class="lrBtn rightBtn"></span>'+
					'</div>'+
					'<div class="div_imgDes">'+
						'<div class="desCont">'+
							'<p class="desCont_p">最美汽车</p>'+
							'<p class="desCont_span">当前索引：1 of 4</p>'+
						'</div>'+
						'<div class="closeBtn">'+
						'</div>'+
					'</div>'
			this.xianshi_div.html(str);
			this.body_d.append(this.mask_div,this.xianshi_div)
			
		},
		
		setGroup:function(){													//定义获取组名的方法(-1)
			var self=this;
			var curGps= this.body_d.find("*[data-group="+this.groupName+"]");
			self.groupData.length=0;
			curGps.each(function(){
				self.groupData.push({
					src:$(this).attr("data-source"),
					id :$(this).attr("data-id"),
					caption:$(this).attr("data_caption")
				});
			})
		},
		
		initUp:function(curObj){												//定义初始化弹出层(-2)
			var curSrc= curObj.attr("data-source"),
				 curId=  curObj.attr("data-id");
			this.guodu(curSrc,curId)											//实行过渡效果(+3)
		},
		
		guodu:function(cSrc,cId){												//定义过渡方法(-3)
			var self=this;
			this.mask_div.fadeIn();												//淡入遮罩层
			this.imgArea.hide();												//隐藏img图片区域
			this.div_imgDesArea.hide();											//隐藏描述区域
			
			var xianshiW= $(window).width()/2,
				xianshiH= $(window).height()/2;
			this.div_imgArea.css({												//设置div图片显示层的css
				width:xianshiW,
				height:xianshiH
			})
			
			this.xianshi_div.fadeIn()											//显示层淡入并做动画显示效果
			var xianTop=($(window).height()-xianshiH)/2;				
			var xianLeft=xianshiW-(xianshiW/2);
			this.xianshi_div.css({									
				width:xianshiW,
				height:xianshiH,
				top:-xianshiH,
				marginLeft:-xianLeft
			}).animate({
				top:xianTop
				},this.settings.speed,function(){													//动画完成后执行函数，用来显示图片s
					self.showImg(cSrc);											//加载显示图片的方法(+4)
				})
				
			//根据传过来的id调用判断索引号的方法
			this.index=this.getIndex(cId);										//获取索引（+7）
			
			//获取数组长度，并根据索引号进行判断得出是否需要添加左右图标
			var gpArrySize= this.groupData.length;
			if(gpArrySize>1){
				if(this.index==0){
					this.lBtnArea.addClass("disable");
					this.rBtnArea.removeClass("disable");
				}else if(this.index==(gpArrySize-1)){
					this.lBtnArea.removeClass("disable");
					this.rBtnArea.addClass("disable");
				}else{
					this.lBtnArea.removeClass("disable");
					this.rBtnArea.removeClass("disable");
				}
			}
			
		},
		
		showImg:function(cSrc){												//定义显示图片方法(-4)
			var self=this;												
			this.imgArea.css({													//每次加载图片，清空宽高值，之后的hiden没有看懂
				width:"auto",
				height:"auto",	
			}).hide();
			this.preLoad(cSrc,function(){										//预加载之后显示图片(+5)
				
				self.imgArea.attr("src",cSrc);									//注意self
				
				
				var imH=self.imgArea.height(),						
					imW=self.imgArea.width();
				
				self.setDivhw(imH,imW);											//设置弹出层的高宽(+6)
				
			});
		},
		
		preLoad:function(cSrc,callback){										//预加载图片方法(-5)
			var img=new Image();
			img.src=cSrc;
			if(!!window.ActiveXObject){
				img.onreadystatechange=function(){
					if(this.readyState=="complete"){
						callback()	
					}
				}	
			}else{
				img.onload=function(){
					callback()	
				}	
			}
		},
		
			setDivhw:function(h,w){												//定义弹出层的宽高(-6)
			var self=this;
			var winh= $(window).height();
			var winw= $(window).width();
			var scale=Math.min(winh/h,winw/w,1),
			w=w*scale,
			h=h*scale;
			
			this.div_imgArea.animate({									//设置div图片标签高宽动画效果
				width:w-10,
				height:h-10	
			},this.settings.speed)
			
			this.xianshi_div.animate({									//设置弹出层标签高宽动画效果
				width:w,
				height:h,
				top:(winh-h)/2,
				marginLeft:-(w/2)
			},this.settings.speed,function(){												//执行之后的img标签宽高设置及显示
				self.imgArea.css({
					width:w-10,
					height:h-10	
				}).fadeIn();
				
				self.div_imgDesArea.fadeIn();							//显示图片描述层
			})
			
			this.desCont_pArea.text(this.groupData[this.index].caption)								//载入图片描述文字
			this.desCont_spanArea.text("当前索引:"+(this.index+1)+" of "+this.groupData.length)		//载入图片索引
			
			this.isResize=true;
		},
		
		getIndex:function(ccid){												//获取索引的方法（-7）
			var index=0;
			$(this.groupData).each(function(i) {
                index=i;
				if(ccid==this.id){
					return false;	
				}
            });
			return index;
		},
		

		goto:function(dir){															//左右侧点击事件（-8）
			var self=this;
			if(dir==="next"){
		
				this.index++;
				length=this.groupData.length;
				
				if(this.index==(length-1)){
					this.rBtnArea.addClass("disable").removeClass("showrBtn");
				}
				if(this.index>0){
					this.lBtnArea.removeClass("disable");
				}
				var src= this.groupData[this.index].src;
				this.showImg(src);
				
			}else if(dir==="prev"){
				this.index--;
				length=this.groupData.length;
				
				if(this.index==0){
					this.lBtnArea.addClass("disable").removeClass("showrBtn");
				}else if(this.index<length-1){
					this.rBtnArea.removeClass("disable");
				}
				var src= this.groupData[this.index].src;
				this.showImg(src);
			}
		},
		
		
	}
	
	window["lightBox"]=lightBox;
	
})(jQuery)