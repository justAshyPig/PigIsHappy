// 利用window.onload 函数调用 使得DOM元素一定会被找到
window.onload= function(){

    // 顶部通栏的滚动效果
    headerScroll();

    // 倒计时的效果
    cutDownTime();

    // 轮播图效果
    banner();
    
}

// 定义headerScroll：
// 顶部header向下移动，更改透明度，从0-1
function headerScroll(){
    // 一开始需要获取的初始值：
    // 1.初始的距离顶部的高度        offsetTop
    // 2.nav的高度               offsetHeight
    // 3.滚动的最大值    jd_banner的 offsetHeight

    //滚动之后要获取的值：
    //1. 向下滚动的距离     document.body.scrollTop
    //2. 顶部的rgba         header.style.backgroundColor

    var headerDom = document.querySelector(".jd_header");
    var navDom = document.querySelector(".jd_nav");
    var maxScroll = navDom.offsetTop + navDom.offsetHeight;

    //注册onscroll事件

    window.onscroll = function(){
        //谷歌火狐中声明了doctype,需要通过document.documentElement.scrollTop获取距离。
        //没有声明doctype，则需要通过document.body.scrollTop来获取距离  
        //IE都可以。
        //Safari有自己的一套定义方法：window.pageYOffset    
        //所以兼容写法||
        var scrollDistance = window.document.documentElement.scrollTop||window.document.body.scrollTop||window.pageYOffset;
        // console.log(scrollDistance);
        // console.log(maxScroll);
        var percent = scrollDistance/maxScroll;
        // console.log(percent);
        if(percent>1){
            percent =1;
        }

        headerDom.style.backgroundColor = 'rgba(201,21,35,'+percent+')';
    }
}



//倒计时
function cutDownTime(){
    //定义一个总时间，换算成秒
    // 获取li，递减时间，修改对应的显示标签
    var totalHour = 3;
    var totalSec = 3*60*60+1;
    var liArr = document.querySelectorAll('.main_content:nth-child(1) .content_top li');
    // console.log(liArr);

    // 定时器
    var timeId = setInterval(function(){
        if(totalSec<0){
            clearInterval(timeId);
            alert("秒杀活动结束了！");
            return;
        }

        totalSec--;
        var currentHour = Math.floor(totalSec/3600);
        var currentMin = Math.floor(totalSec%3600/60);
        var currentSec = totalSec%60;

        // 修改dom元素li的显示

        liArr[0].innerHTML = Math.floor(currentHour/10);
        liArr[1].innerHTML = currentHour%10;

        liArr[3].innerHTML = Math.floor(currentMin/10);
        liArr[4].innerHTML = currentMin%10;

        liArr[6].innerHTML = Math.floor(currentSec/10);
        liArr[7].innerHTML = currentSec%10;
    },1000)
}


// 轮播图
function banner(){
    //1.屏幕的宽度
    var width = document.body.offsetWidth;
    //2.轮播图的ul
    var moveUl = document.querySelector(".banner_images");
    //3.ul底下索引的圆点中的li
    var indexLiArr = document.querySelectorAll(".banner_index li");
    //由于是8+2张图片，左边默认已经有了一张图片，所以O_index的index=0的对应的是U_index的index=1
    //定义一个U_index来记录图片的index
    var U_index = 1;

    var startTransition = function(){
        moveUl.style.transition = 'all 0.3s';
    }

    var endTransition = function(){
        moveUl.style.transition = '';
    }

    var setTransform = function(distance){
        moveUl.style.transform = 'translateX('+distance+'px)';
    } 
    //开启定时器
    var timeId = setInterval(function(){
        U_index++;
        startTransition();
        setTransform(U_index*width*-1);
    },1000)

    moveUl.addEventListener('webkitTransitionEnd',function(){
        // console.log("过度结束");
        //每一次过渡transition触发一次
        if(U_index>8){
            U_index=1;
            endTransition();
            setTransform(U_index*width*-1);
        }else if(U_index<1){
            U_index=8;
            endTransition();
            setTransform(U_index*width*-1);
        }
        for(var i=0;i<indexLiArr.length;i++){
            indexLiArr[i].className ="";
        }
        indexLiArr[U_index-1].className = "current";
    })

    //touch事件
    var startX=0;
    var moveX=0;
    var distance =0;

    //触摸开始start
    moveUl.addEventListener('touchstart',function(event){
        clearInterval(timeId);
        endTransition();
        startX = event.touches[0].clientX;
        // console.log(event);
        // console.log(startX);
    });

    //触摸中move
    document.addEventListener('touchmove',function(event){
        
        moveX = event.touches[0].clientX-startX;
        setTransform(moveX+U_index*width*-1);
        // console.log(event);
        // console.log(event.touches[0].clientX);
        // console.log(moveX);
    })

    //触摸结束
    moveUl.addEventListener('touchend',function(event){
        var maxDistance = width/3;
        // console.log(event);
        if(Math.abs(moveX)>maxDistance){
            if(moveX>0){
                U_index--;
            }else{
                U_index++;
            }
            startTransition();
            setTransform(U_index*width*-1);
        }else{
            startTransition();
            setTransform(U_index*width*-1);
        }
        timeId= setInterval(function(){
            U_index++;
            startTransition();
            setTransform(U_index*width*-1);
        },1000)
    })
}