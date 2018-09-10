//图片加载类
/* 使用方法
var opt={
    'imgArray':['1.jpg'],   // 存放图片路径
    onLoading:function(loadedImgNum,imgCount){ //加载途中
        1.loadedImgNum 已经加载图片的数目 
        2.imgCount图片总数目
    }, 
    'onLoaded':function(){    //全部图片加载后回调函数
    }
}
var imageLoad=new ImageLoad();
imageLoad.init(opt);
*/
function ImageLoad(){
    this.settings={
        imgArray:[],
        onLoading:function(){},
        onLoaded:function(){} 
    }
    var iImgCount=0; //数组长度
}
ImageLoad.prototype.init=function(opt){
    this.extend( this.settings , opt );
    var flag=true;
	var msg=[];
	if(!(this.settings.imgArray instanceof Array)){
        console.log('请放入数组元素');
        return;
    }
	this.iImgCount=this.settings.imgArray.length;
	for(var i=0;i<this.iImgCount;i++){
		if(this.settings.imgArray[i]==''){
			flag=false;
			msg.push(i);
		}
	}
	if(!flag){
		console.log("图片"+msg+"为空");
	}
    this.imgLoad();
}
ImageLoad.prototype.extend=function(obj1,obj2){
     for(var attr in obj2){
        obj1[attr] = obj2[attr];
     }
}
ImageLoad.prototype.imgLoad=function(){
    var self=this;
    this.iImgCount=this.settings.imgArray.length;
    var iLoaded=0;
    for(var i=0;i<this.iImgCount;i++){
        (function (i){
            var oNewImg = new Image();
            oNewImg.onload=function(){
                oNewImg.onload=null;
                var oImg=document.createElement('img');
                oImg.src=this.src;
                oImg.style.display='none';
                document.body.appendChild(oImg);
                self.settings.onLoading(iLoaded,self.iImgCount);
                ++iLoaded==self.iImgCount && self.settings.onLoaded();
            };
            oNewImg.src=self.settings.imgArray[i];
        })(i);
    }
}


