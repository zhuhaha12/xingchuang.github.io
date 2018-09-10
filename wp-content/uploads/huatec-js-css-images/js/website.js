function NavLineMove(i){		//移动导航线条
	var Nav = jQuery('.nav'),
		Line = jQuery('.line',Nav),
		Item = jQuery('.item',Nav),
		Width,Left;

    i < 0 ? Line.hide() : Line.show();

	Width = Item.eq(i).width();
	Left = Item.eq(i).position().left;

	if(i == 0){
		Left = parseFloat(Item.eq(i).css('margin-left'));
	}else{
		Left += parseFloat(Item.eq(i).css('margin-left'));
	}
	
	Line.css({'width':Width,'left':Left});
}

function AjaxLoadingList(){     //Ajax加载列表
	var More = jQuery('.ajax-more'),
		Max = More.attr('max'),
		CateId = More.attr('cid'),
		Type = More.attr('type'),
		List,Path,Top,WinTop,
		Page = 1,
		Switch = true;

	switch(Type){
		case 'news':
			List = jQuery('.news-list');
			Path = '/ajax/info.php';
			break;
		case 'join':
			List = jQuery('.join-list');
			Path = '/ajax/join.php';
			break;
	}

	if(!List || !Path) return;

	More.click(function(){
		if(Switch){
			Top = false;
			WinTop = jQuery(window).scrollTop();	//获取滚动条当前的位置
			Switch = false;
			Page++;
			jQuery.get(Path,{CateId:CateId,page:Page},function(data){
				if(data){
					List.append(data);
					List.children('.item').each(function(i,e){
						if(jQuery(e).attr('page') && jQuery(e).attr('page') == Page) Top = jQuery(e).offset().top;
					});
					//重置一下滚动条的位置,避免滚动条贴在最低端，列表加载出来后没有滑动效果
					Top && jQuery('body,html').scrollTop(WinTop);
					Top && jQuery('body,html').animate({scrollTop:Top},1000);
					Switch = true;
					(Page >= Max) && More.addClass('hide');
				}
			});
		}
	});
}

function isIE() { //ie?  
    if(!!window.ActiveXObject || "ActiveXObject" in window)
        return true;  
    else  
        return false;  
}

jQuery(window).load(function() {
	if(isIE()){
		$('.grayscale').parent().addClass('bwWrapper');
		$('.bwWrapper').BlackAndWhite({ //图片黑白
		    hoverEffect : true,
		    responsive:true,
		    speed : 300
		});
	}
});

function SplitScreen(List){
    if(!List.length) return false;

    if(jQuery(window).width() <= 970){
        jQuery('html,body').removeClass('over');
        return false;
    }

    var Index = 0,
        Btn = List.siblings('.SplitScreen-btn'),
        Down = jQuery('.success-down',List),
        HtmlBody = jQuery('html,body'),
        IsScroll = true,
        direction,Site,Height;

    setTimeout(function(){  //使用定时器是因为谷歌打开页面会延迟一点点自动跳到刷新页面时的位置，所以需要定时器
        //置顶滚动条
        window.scrollTo(0,0);
        HtmlBody.scrollTop(0);
        document.body.scrollTop = 0;
    },50);

    if(!Btn.children().length){
        List.each(function(i,e){
            Btn.append('<a class="'+(i==Index?'on':'')+'"></a>')
        });
    }

    jQuery('body').mousewheel(function(event, delta, deltaX, deltaY) {
        if(IsScroll){
            IsScroll = false;
            direction = delta > 0 ? 'Up' : 'Down';
            Action();
        }

        return false;       //阻止浏览器默认的滚动
    });

    jQuery(window).resize(function(){
        HtmlBody.animate({scrollTop:Site},0);
    });

    document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(IsScroll && e && (e.keyCode==38 || e.keyCode==40)){      //键盘的上下键
            switch(e.keyCode){
                case 38:
                    direction = 'Up';
                    if(Index <= 0) return false;
                    break;
                case 40:
                    direction = 'Down';
                    if(Index >= List.length-1) return false;
                    break;
            }
            Action();
            return false;
        }
    };

    Btn.children().click(function(){
        if(Index != jQuery(this).index()){
            direction = Index > jQuery(this).index() ? 'Up' : 'Down';
            Index = jQuery(this).index();
            Action(Index);
        }
    });

    Down.click(function(){
        if(IsScroll){
            IsScroll = false;
            direction = 'Down';
            Action();
        }
    });

    function Action(i){
        switch(direction){
            case 'Up':
                if(!i) Index > 0 ? Index-- : '';
                break;
            case 'Down':
                if(!i) Index < List.length-1 ? Index++ : '';
                break;
        }
        Btn.children().eq(Index).addClass('on').siblings().removeClass('on');
        Height = List.eq(Index).height();
        Site = Height < jQuery(window).height() && direction == 'Down' ? List.eq(Index-1).offset().top+List.eq(Index).height() : List.eq(Index).offset().top;
        HtmlBody.animate({scrollTop:Site},800,'linear');
        setTimeout(function(){
            IsScroll = true;
            List.eq(Index).find('*').each(function(ii,ee){
                var Class = jQuery(ee).attr('data-class');
                if(Class != undefined){
                    jQuery(ee).addClass(Class.replace(',',' '));
                }
            });
        },800);
    }
}

function development(){     //发展历程
	var Obj = jQuery('.about-development'),
        BgSegments = jQuery('.segments',Obj),
        Segments = jQuery('.segments-1',Obj),
		List = jQuery('.info .item',Obj),
		Bar = jQuery('.years-box .bar',Obj),
		Hd = jQuery('.item',Bar),
		Prev = jQuery('.prev',Obj),
		Next = jQuery('.next',Obj),
        Page = 0,
        Vis = 9,
        Scroll = 1,
        MaxPage = List.length-Vis/Scroll,
		OuterWidth = Hd.outerWidth(true),
		Distance,Index,StartIndex,EndIndex,Time,
        Lightning = jQuery('.lightning',Obj);
		
    get_i();
    auto();
    lightning();

    /*var yearSwiper = new Swiper('.year-swiper',{
        slidesPerView: 9,
        spaceBetween: 35,
        onlyExternal: true
    });*/

    Hd.click(function(){
        StartIndex = Page*Scroll;
        EndIndex = StartIndex+Vis-1;
        Index = jQuery(this).index();
        if((Index == EndIndex || Index == EndIndex-1) && MaxPage && Page < MaxPage){
            Page++;
            slide(Page);
        }else if(Index == StartIndex && Page > 0){
            Page--;
            slide(Page);
        }
        chenge(Index);
        clearInterval(Time);
        auto();
    });

    Prev.click(function(){
        StartIndex = Page*Scroll;
        EndIndex = StartIndex+Vis-1;
        if(Index > 0){
            if(Index == StartIndex && Page > 0){
                Page--;
                slide(Page);
            }
            Index--;
            chenge(Index);
        }
        clearInterval(Time);
        auto();
    });

    Next.click(function(){
        StartIndex = Page*Scroll;
        EndIndex = StartIndex+Vis-1;
        if(Index < List.length-1){
            if(Index == EndIndex-1 && MaxPage && Page < MaxPage){
                Page++;
                slide(Page);
            }
            Index++;
            chenge(Index);
        }
        clearInterval(Time);
        auto();
    });

    function get_i(){
        Hd.each(function(i,e){
            if(jQuery(e).hasClass('on')) Index = i;
        });
        if(isNaN(Index)){
            Index = 0;
            init();
        }

        return Index;
    }

    function slide(i){
        Distance = i*Scroll*OuterWidth;
        Bar.css({left:-Distance+'px'});
        Segments.animate({left:-Distance-1+'px'},300, 'linear');
        BgSegments.animate({left:-Distance+'px'},300, 'linear');
    }
    function chenge(i){
        List.eq(i).addClass('on').siblings(List).removeClass('on');
        Hd.eq(i).addClass('on').siblings(Hd).removeClass('on');
        segments(i);
        //List.eq(i).addClass('show').siblings(List).removeClass('show');
    }
    function segments(i){
        Segments.stop(false,true).css('width',(OuterWidth*(i))+'px');
        Segments.animate({'width':(OuterWidth*(i+1))+'px'},4700, 'linear');
    }
    function auto(){
        //Segments.animate({'width':(OuterWidth*(Index+1))+'px'},4700, 'linear');
        Time = setInterval(function(){
            StartIndex = Page*Scroll;
            EndIndex = StartIndex+Vis-1;
            if(Index < List.length-1){
                if(Index == EndIndex-2 && MaxPage && Page < MaxPage){
                    Page++;
                    slide(Page);
                    //Segments.css('width',OuterWidth*(Index-1));
                }
                Index++;
            }else{
                if(Index == EndIndex && MaxPage && Page == MaxPage){
                    Page--;
                    slide(Page);
                }
                Index = 0;
                Segments.stop(false,true).animate({left:0,width:0},0, 'linear');
                BgSegments.css('left',0);
            }
            chenge(Index);
        },5000);
    }
    function init(){
        Hd.eq(Index).addClass('on').siblings(Hd).removeClass('on');
        List.eq(Index).addClass('on').siblings(List).removeClass('on');
        segments(Index);
    }

    function lightning(){
        Lightning.each(function(i,e){
            var Bar = jQuery(e).children('.bar'),
                Item = jQuery('.item',Bar),
                Distance = Item.outerWidth(true);
            if(Item.length < 2){
                Bar.append(Bar.html());
            }

            SlideLightning(Bar,Distance);
        });
    }

    function SlideLightning(Bar,Distance){
        var Length = Bar.children().length-1;
        Bar.css('right',Distance*Length);
        Bar.stop(false,true).animate({right:0},10000,'linear',function(){
            Bar.css('right',Distance*Length);
            SlideLightning(Bar,Distance);
        });
    }
}

function ZoomList(Index){
    var List = jQuery('.service-list').eq(Index),
        Img = List.find('.img'),
        F = List.find('.f');
        Top = List.offset().top,
        Url = List.attr('url');

    //Img.addClass('rotation');
    Img.addClass('flip');
    //F.addClass('rotation2');
    setTimeout((function(){
        location.href=Url;
        Img.removeClass('flip');
    }),1000);

    /*jQuery('body,html').animate({scrollTop:Top},600,function(){
        List.addClass('on');
        setTimeout(function(){
            location.href=Url;
        },1000);
    });*/
}

function SlideList(List,ScrollNum){
    if(!List.length){return false;}

    var Bd = jQuery('.bd',List),
        Hd = jQuery('.hd',List),
        Bar = jQuery('.bar',Bd),
        Item = jQuery('.item',Bar),
        Prev = jQuery('.button.prev',List),
        Next = jQuery('.button.next',List),
        Index = 0,
        Scroll = !isNaN(ScrollNum)?ScrollNum:1,
        TouchTimer,ImgMove,DMax,MoveDistance,MouseInterval,_X,Left;

    Action(Index);

    if(Hd && Math.ceil(Item.length/Scroll) > 1 && !Hd.children().length){
        for(var i = 0; i < Math.ceil(Item.length/Scroll); i++){
            Hd.append('<a class="'+(i==Index?'on':'')+'"></a>')
        }
    }

    Hd.children().click(function(){
        Index = jQuery(this).index();
        Action(Index);
    });

    Prev.click(function(){
        Index > 0 ? (Index--,Action(Index)) : '';
    });

    Next.click(function(){
        Index < Item.length-1 ? (Index++,Action(Index)) : '';
    });

    //touch是在移动端使用的
    Bd.on('touchstart',function(e){
        DMax = Item.width()*(Item.length-1);
        _X = e.originalEvent.targetTouches[0].pageX;	//记录鼠标点下时的位置	!!这条是移动端使用的!!
        ImgMove = true;
        Bar.removeClass('trans');
        Left = parseFloat(Bar.css('left'));
        TouchTimer = 0;       //记录鼠标点下的到松开的时间
        MouseInterval = setInterval(function(){TouchTimer++;},1);
    });
    jQuery('body').on('touchmove',function(e){
        if(ImgMove){
            var X = e.originalEvent.targetTouches[0].pageX-_X;	//记录鼠标移动了多远

            MoveDistance = Left+X;
            if(MoveDistance < 0 && MoveDistance > -DMax){
                Bar.css({left:MoveDistance+'px'});
            }
        }
    });
    jQuery('body').on('touchend',function(e){
        if(ImgMove){
            var L = parseFloat(Bar.css('left')),
                W = jQuery(window).width();
            clearInterval(MouseInterval);

            if(TouchTimer < 50){      //鼠标快速滑过
                if(e.originalEvent.changedTouches[0].pageX > _X && Index > 0){	//向左滑
                    Index--;
                }else if(e.originalEvent.changedTouches[0].pageX < _X && Index < (Item.length-1)){	//向右滑
                    Index++;
                }
            }else{
                Index = Math.abs(Math.round(L/W));
            }

            Bar.addClass('trans');
            Action(Index);
        }
        ImgMove = false;
    });

    function Action(i){
        var Distance = Item.outerWidth(true)*Scroll;
        Bar.css({left:-Distance*i});
        Hd.children().eq(i).addClass('on').siblings().removeClass('on');
        i > 0 ? Prev.removeClass('stop') : Prev.addClass('stop');
        i < Item.length-1 ? Next.removeClass('stop') : Next.addClass('stop');
    }
}

function ServiceLoad(){
    var Service = jQuery('.service');

    jQuery(window).scrollTop(0);

    Service.removeClass('load');

    if(jQuery('.service-list').length){
        jQuery('.service-list .pad').smoove({offset:'15%'});
    }
}

function FloatHeight(Obj){
    Obj.css('height','auto');
    if(jQuery(window).width()){
        setTimeout((function(){
            var Height = Obj.height();
            Obj.css('height',Height);
        }),1);
    }
}

function  Full(){
    var FullObj = jQuery('.full'),
        Height = jQuery(window).height();

    FullObj.height(Height);
}

function ConVideoWH(){
    var Con = jQuery('.Con'),
        Con_W = Con.width();
        Iframe = jQuery('iframe',Con);

    Iframe.each(function(i,e){
        var W = jQuery(e).width(),
            H = jQuery(e).height(),
            P = H/W;
        
        if(W > Con_W){
            var Now_H = Con_W*P;
            jQuery(e).width(Con_W);
            jQuery(e).height(Now_H);
        }
    });
}

function VideoPlayer(){
    var Video = jQuery('.video-player'),
        Player = jQuery('.player',Video),
        Proportion = 0.59340659340659340659340659340659,
        Width = Video.width(),
        Height = Width*Proportion;

    Player.height(Height);
}

function JoinList(){
    if(jQuery(window).width()>970){
        jQuery('body').on('mouseover', '.join-list .item', function(){
            jQuery(this).children('.con').stop(false,true).slideDown(300);
        });
        jQuery('body').on('mouseleave', '.join-list .item',function(){
            jQuery(this).children('.con').stop(false,true).slideUp(300);
        });
    }else{
        jQuery('body').off().on('click', '.join-list .item', function(){
            var self = this;
            jQuery(this).toggleClass('on').siblings('.item').removeClass('on').children('.con').stop(false,true).slideUp(300);
            jQuery(this).children('.con').stop(false,true).slideToggle(300);
            setTimeout(function(){
                var Top = jQuery(self).offset().top;
                jQuery('body,html').animate({scrollTop:Top},400);
            },300);
        });
    }
}

function slideTmpBanner(){
    var TmpBanner = jQuery('.tmp-banner'),
        T0,T1;

    if(!TmpBanner.length || jQuery(window).width() <= 970) return false;

    TmpBanner.imagesLoaded(function(){
        var Height = TmpBanner.height()-2;

        TmpBanner.css({top:'-'+Height+'px'});

        T0 = setTimeout(function(){
            TmpBanner.stop(false,false).animate({top:0},2000,'linear');
            jQuery('#index').stop(false,false).animate({top:Height},2000,'linear');
            T1 = setTimeout(function(){
                TmpBanner.stop(false,false).animate({top:'-'+Height},2000,'linear');
                jQuery('#index').stop(false,false).animate({top:0},2000,'linear');
            },5000);
        },1000);

        TmpBanner.click(function(){
            clearTimeout(T0);
            clearTimeout(T1);
            TmpBanner.stop(false,false).animate({top:'-'+Height},2000,'linear');
            jQuery('#index').stop(false,false).animate({top:0},2000,'linear');
        });
    });
}

function PlayVideo(Path,Type){      //Type:{0:第三方视频,1:本地视频}
    if(Path && !jQuery('#PlayVideo').length){
        var Width = jQuery(window).width()*0.8,
            Height = jQuery(window).height()*0.8;
        Html = '<div class="Body-Mask hide"></div><div id="PlayVideo" class="hide"><div class="play-box relative">{Play}</div></div>',
            Play = '';

        switch(Type){
            case 0:
                Play = '<embed src="'+Path+'" allowfullscreen="true" quality="high" allowscriptaccess="always" type="application/x-shockwave-flash" width="'+Width+'" height="'+Height+'" align="middle" wmode="transparent">';
                break;
            case 1:
                Play = '<video class="video-js vjs-default-skin" controls preload="auto" width="'+Width+'" height="'+Height+'" poster="" data-setup="{}"><source src="'+Path+'" type="video/mp4" /><source src="'+Path+'" type="video/webm"><source src="'+Path+'" type="video/ogg"><p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p></video>';
                break;
        }

        Html += (Type == 1 ? '<script src="/js/video.min.js"></script>' : '' )+(Html.replace('{Play}',Play));   //需要一起加载在才会有播放器样式   /(ㄒoㄒ)/~~

        jQuery('body').append(Html);

        jQuery('body > .Body-Mask , body > #PlayVideo').fadeIn(300,function(){jQuery(this).removeClass('hide')});
        jQuery('body > .Body-Mask , body > #PlayVideo .close-btn').click(function(){
            jQuery('body > .Body-Mask , body > #PlayVideo').fadeOut(300,function(){jQuery(this).remove();});
        });
    }

    return false;
}

jQuery(document).ready(function(){
    new WOW().init();

	jQuery('#banner .downBtn').click(function(){
		jQuery('#index-fullpage').fullpage.moveSectionDown();
	});
	jQuery('.service-special .service-down').click(function(){
		jQuery('#service-fullpage').fullpage.moveSectionDown();
	});
	if(jQuery('#index-fullpage').length){
        jQuery('#index-fullpage').fullpage({
			'verticalCentered': true,
			'afterLoad' : function(anchorLink,index){
				if(index == 2 && !jQuery('.index-introduce .introduces').hasClass('bg-show')){
					jQuery('.index-introduce .introduces').addClass('bg-show');
				}
			}
		});
        if(jQuery(window).width() < 970){
            jQuery('#footer .rig > span').hover(function(){
                $.fn.fullpage.setAllowScrolling(false);
            },function(){
                $.fn.fullpage.setAllowScrolling(true);
            });
        }
	}
	if(jQuery('#service-fullpage').length && jQuery(window).width() > 970){
		jQuery('#service-fullpage').fullpage({
			'verticalCentered': true,
			'navigation': jQuery('#service-fullpage .section').length > 1 ? true : false,
			'navigationPosition': 'right'
		});
	}

    if(jQuery('.silide-box').length){
        var slide_swiper = new Swiper('.silide-box .swiper-container', {
            slidesPerView: 6,       //显示多少
            spaceBetween: 30,       //间距
            nextButton: '.next',    //前按钮
            prevButton: '.prev',    //后按钮
            breakpoints: {  //响应式设置
                1024: {     //浏览器宽度
                    slidesPerView: 4,
                    spaceBetween: 25
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 20
                },
                640: {
                    slidesPerView: 2,
                    spaceBetween: 15
                }/*,
                 320: {
                 slidesPerView: 1,
                 spaceBetween: 10
                 }*/
            }
        });
    }

    if(jQuery('#banner').length){
        var Banner_swiper = new Swiper('#banner', { //首页广告图
            pagination: '.banner-hd',	//分页器
            slidesPerView: 1,			//容器同时显示多少个活动块
            centeredSlides: true,		//活动块是否居中
            paginationClickable: true,	//分页器控制swiper切换
            autoplayDisableOnInteraction: false,    //手动切换后重新启动自动切换定时器
            speed:  800,        //切换速度
            autoplay: 0,     //自动切换时间
            spaceBetween: 0,	//间隔
            loop: true,			//循环
            grabCursor: false,	//光标变抓手
            bulletClass: 'i',	//分页器样式名
            bulletActiveClass: 'on',	//分页器选中时的样式名
            swipeHandler: '.banner-img',   //设定只能拖动这个元素来触发切换
            onSlideChangeEnd: function(e){  //切换结束后的回调
                var Banner = jQuery('#banner'),
                    Imgs = jQuery('.imgs',Banner),
                    Index;

                Imgs.each(function(i,e){
                    if(jQuery(e).hasClass('swiper-slide-active'))
                        Index = jQuery(e).attr('data-swiper-slide-index');
                });

                Imgs.each(function(i,e){
                    //jQuery(e).attr('data-swiper-slide-index') == Index && jQuery(e).addClass('active');
                    var Box = jQuery(e).find('.font-box');
                    if(jQuery(e).attr('data-swiper-slide-index') == Index){
                        Box.children().each(function(ii,ee){
                            var Class = jQuery(ee).attr('data-class');
                            if(Class!=undefined){
                                jQuery(ee).addClass(Class.replace(',',' '));
                            }
                        });
                    }
                });
            }
        }).startAutoplay(); //自动切换
    }

    if(jQuery('.special-box.i1').length){
        var special_swiper = new Swiper('.special-box.i1 .swiper-container', {
            slidesPerView: 2,       //显示多少
            spaceBetween: 0,       //间距
            nextButton: '.next',    //前按钮
            prevButton: '.prev'    //后按钮
        });
    }

    if(jQuery('.service-list').length){
        var service_img = new Array();
        jQuery('.service-list').each(function(i,e){
            var src = jQuery(e).find('.img img').attr('src');
            src && service_img.push(src);
        });
        var opt={
            'imgArray':service_img,   // 存放图片路径
            onLoading:function(loadedImgNum,imgCount){ //加载途中
            },
            'onLoaded':function(){    //全部图片加载后回调函数
                FloatHeight(jQuery('.service-list .wrap'));
            }
        };
        var imageLoad=new ImageLoad();
        imageLoad.init(opt);
    }

    jQuery('.nav').mouseleave(function(){
        var i = jQuery('.nav > .item[class~=on]').index();
        NavLineMove(i);
    });

    jQuery('.nav > .item').mouseover(function(){
        var i = jQuery(this).index();
        NavLineMove(i);
    });

    NavLineMove(jQuery('.nav > .item[class~=on]').index());

    jQuery('.top-search > a').click(function(){
        jQuery(this).parent().addClass('unfold');
        // jQuery(this).siblings('.text').focus();
    });

    jQuery('.top-menu').click(function(){
        jQuery('.nav').toggleClass('show');
    });

    jQuery('.stopP').click(function(e){e.stopPropagation();});

    jQuery('body').click(function(){
        jQuery('.top-search').removeClass('unfold');
    });

    jQuery('#footer .rig > span').hover(function(){
        jQuery(this).children('.footer-info').stop(false,true).slideDown(300);
    },function(){
        jQuery(this).children('.footer-info').stop(false,true).slideUp(300);
    });

    jQuery('.special-box.i2 .ext').click(function(){
        jQuery(this).removeClass('shrink').addClass('on').siblings('.ext').removeClass('on').addClass('shrink');
    });

    jQuery('.HoverClass').mouseover(function(){
        var Class = jQuery(this).attr('hoverclass').replace(',',' ');
        jQuery(this).addClass(Class);
    });
    jQuery('.HoverClass').mouseleave(function(){
        var Class = jQuery(this).attr('hoverclass').replace(',',' ');
        jQuery(this).removeClass(Class);
    });

    jQuery('.topicBanner').click(function(){
        var Top = jQuery('.topic-box-1').offset().top;
        jQuery('body,html').animate({scrollTop:Top},400);
    });

    jQuery('.footer-info').css('max-height',jQuery(window).height()- 80);

    slideTmpBanner();
    //ServiceLoad();
    ConVideoWH();
    AjaxLoadingList();
    development();
    JoinList();
    VideoPlayer();
    SlideList(jQuery('.focus-box.pc.slide-list'));
    SlideList(jQuery('.focus-box.mobile.slide-list'));
    SlideList(jQuery('.box-7.pc.slide-list'));
    SlideList(jQuery('.box-7.mobile.slide-list'));
    SlideList(jQuery('.flat-box.pc'));
    SlideList(jQuery('.flat-box.mobile'));
    SlideList(jQuery('.special-box.i10 .box.pc'),3);
    SlideList(jQuery('.service-box-2.pc'));
    SlideList(jQuery('#success .slide-box'));
    SlideList(jQuery('.topic-bar-0 .box'));
    SplitScreen(jQuery('.SplitScreen'));
    Full();
});

jQuery(window).resize(function(){
    FloatHeight(jQuery('.service-list .wrap'));
    JoinList();
    VideoPlayer();
    ConVideoWH();
    Full();
});
