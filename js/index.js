window.onload = function () {
    //获取元素
    var headerNavLi = document.querySelectorAll(".header-main-nav li");
    var headBottom = document.querySelectorAll(".header-main-bottom");
    var headerArrow = document.querySelector(".header-main-arrow");
    var content = document.querySelector("#content");
    var contentList = document.querySelector(".content-lists");
    var homePoint = document.querySelectorAll(".home-point li");
    var homeCarousel = document.querySelectorAll(".home-carousel li");
    var home = document.querySelector(".home");


    //定义变量
    var arrowWidth = headerArrow.width / 2;//移动小图标的宽度/2
    var index = 0;//定义一个变量保存li的下标
    var contentHeight = content.offsetHeight;//定义一个变量保存容器content的高度
    var isFirst = true;
    var autoTime = null; //自动切换计时器
    var lastIndex = 0;//保存上一次点击的小图标下标
    var timer = null;//防抖定时器
    var lastTime = 0;//节流，保存上一次触发的时间

    setLeft(headerNavLi[0]);
    //封装函数，改变移动小图标的left值
    function setLeft(node){
        headerArrow.style.left = node.offsetLeft + node.offsetWidth/2 - arrowWidth +"px";
    }
    //遍历所有的li，保存相应的下标，绑定点击事件
    for (var i = 0,length = headerNavLi.length; i <length ; i++) {
        var headerNavLiElement = headerNavLi[i];
        headerNavLiElement.index = i;
        headerNavLi[i].onclick = function () {
            index = this.index;
            move(index);
        }
    }

    //chrome和 ie下的鼠标滚动事件，event.wheelDelta为正，则是向上滚，为负则是向下滚
    content.onmousewheel = function (event) {
        mouseWheel(event);
    }

    //Firefox下的鼠标滚动事件，event.detail为负，则是向上滚，为正则是向下滚
    content.addEventListener("DOMMouseScroll", function (event) {
        mouseWheel(event);
    });

    //封装鼠标滚动事件
    function mouseWheel(event) {
        for (var j = 0, length = headBottom.length; j < length; j++) {
            var headerNavBottomElement = headBottom[j];
            headerNavBottomElement.style.width = '';
        }
        headBottom[index].style.width = '100%';
        // 改变arrow的位置
        setLeft(headerNavLi[index]);


        //每次触发鼠标滚动事件都先将上一次的计时器清除，防抖
        clearTimeout(timer);
        timer =  setTimeout(function () {
            var flag = "";
            if (event.wheelDelta) {
                if (event.wheelDelta>0){
                    console.log(11);
                    flag = "up";
                } else{
                    flag = "down";
                }

            }else if (event.detail){
                if (event.detail>0){
                    flag = "down";
                } else{
                    flag = "up";
                }
            }
            switch (flag) {
                case "up":
                    index--;
                    if (index<0){
                        index = 0;
                    }
                    move(index);
                    break;
                case "down":
                    index++;
                    if (index>4){
                        index = 4;
                    }
                    move(index);
                    break;
            }
        },200)

    }

    move(1);
    //封装函数，鼠标滚动时，设置ul的位置，设置li的width，设置arrow的位置
    function move(index){
        // 去除第一个active
        if (isFirst) {
            headBottom[0].className = 'header-main-bottom';
            isFirst = false;
        }
        contentList.style.top = index*-contentHeight +"px";
        //设置li的宽度
        for (var j = 0, length = headBottom.length; j < length; j++) {
            var headerNavBottomElement = headBottom[j];
            headerNavBottomElement.style.width = '';
        }
        headBottom[index].style.width = '100%';

        setLeft(headerNavLi[index]);
    }

    window.onresize = function () {
        contentHeight = content.offsetHeight;
        contentList.style.top = index*-contentHeight+"px";
    }

    /*点击小圆点事件*/
    for (var i = 0; i <homePoint.length ; i++) {
        var homePointElement = homePoint[i];
        homePointElement.index = i;
        homePointElement.onclick = function () {
            var nowTime = Date.now();
            if (nowTime-lastTime <=2000) return;
            //同步上一次触发的时间
            lastTime = nowTime;
            var nowIndex = this.index;
            //点击自己
            if(nowIndex === lastIndex) return;
            if(nowIndex>lastIndex){
                //点击右边
                homeCarousel[nowIndex].className = "right-show active";
                homeCarousel[lastIndex].className = "left-hide";
            }else{
                //点击左边
                homeCarousel[nowIndex].className = "left-show active";
                homeCarousel[lastIndex].className = "right-hide";
            }
            //给小圆点设置点击的类名
            homePoint[nowIndex].className = "active";
            homePoint[lastIndex].className = "";
            lastIndex = nowIndex;
        }
    }

    //自动切换
    autoMove();
    function autoMove(){
        autoTime = setInterval(function () {
            var nowIndex = lastIndex+1;
            if (nowIndex>3)  nowIndex = 0;
            //切换页面
            homeCarousel[nowIndex].className = "right-show active";
            homeCarousel[lastIndex].className = "left-hide";
            //小图标自动走
            homePoint[nowIndex].className = "active";
            homePoint[lastIndex].className = "";
            //同步lastIndex
            lastIndex = nowIndex;
        },2500);
    }
    //鼠标移入事件
    home.onmouseenter = function () {
        clearInterval(autoTime);
    }
    //鼠标移出事件
    home.onmouseleave = function () {
        autoMove();
    }

}
