window.onload = function () {
    var headerNavLi = document.querySelectorAll(".header-main-nav li");
    var headBottom = document.querySelectorAll(".header-main-bottom");
    var headerArrow = document.querySelector(".header-main-arrow");

    var content = document.querySelector("#content");
    var contentList = document.querySelector(".content-lists");

    //移动小图标的宽度/2
    var arrowWidth = headerArrow.width / 2;
    //定义一个变量保存li的下标
    var index = 0;
    //定义一个变量保存容器content的高度
    var contentHeight = content.offsetHeight;

    var isFirst = true;

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


    //防抖计时器
    var timer = null;

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

}
