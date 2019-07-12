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
    var teamLists = document.querySelectorAll(".team-lists li");
    var teamUl = document.querySelector(".team-lists");
    var canvas = null;
    var headerMusic = document.querySelector(".header-main-music");
    var audio = document.querySelector("audio");
    var contentPoint = document.querySelectorAll(".content-point li");

    //定义变量
    var arrowWidth = headerArrow.width / 2;//移动小图标的宽度/2
    var index = 0;//定义一个变量保存li的下标
    var contentHeight = content.offsetHeight;//定义一个变量保存容器content的高度
    var isFirst = true;
    var autoTime = null; //自动切换计时器
    var lastIndex = 0;//保存上一次点击的小图标下标
    var timer = null;//防抖定时器
    var lastTime = 0;//节流，保存上一次触发的时间
    var lastAnimation = 0;

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

            contentPoint[j].className = "";
        }
        animationArr[index].animationIn();
        animationArr[lastAnimation].animationOut();

        lastAnimation = index;

        headBottom[index].style.width = '100%';
        contentPoint[index].className = "active";

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
            animationArr[0].animationIn();
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

   //第五屏
   //鼠标移入事件
    for (var i = 0; i <teamLists.length ; i++) {
        teamLists[i].index = i;
        teamLists[i].onmouseenter = function(){
            for (var i = 0; i <teamLists.length ; i++) {
                teamLists[i].style.opacity = 0.5;
            }
            teamLists[this.index].style.opacity = 1;
            bubbleMotion(this.index);
        }
    }
    //鼠标移出事件
    teamUl.onmouseleave = function () {
        canvas.remove();
        canvas = null;
        for (var i = 0; i <teamLists.length ; i++) {
            teamLists[i].style.opacity = 1;
        }
    }

    //气泡
    function bubbleMotion(index) {
        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.className = "myCanvas";
            canvas.width = 236;
            canvas.height = 448;
            canvas.style.top = 0;
            canvas.style.left = index*236 +"px";

            if (canvas.getContext) {

                var arr = [];
                var ctx = canvas.getContext('2d');

                // 画圆
                setInterval(function () {

                    // 清除画布
                    ctx.clearRect(0, 0, 236, 448);

                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];

                        // 产生正弦运动
                        // 角度递增 --> 决定运动的速度
                        item.deg += 2;
                        // 根据角度求弧度
                        var rad = item.deg * Math.PI / 180;
                        // 求得横坐标和纵坐标的值
                        var x = item.x + item.scale * Math.sin(rad);
                        var y = item.y - item.scale * rad;

                        ctx.fillStyle = `rgb(${item.r}, ${item.g}, ${item.b})`;
                        ctx.beginPath();
                        ctx.arc(x, y, item.R, 0, 2 * Math.PI);
                        ctx.fill();

                    }

                }, 1000 / 60);

                // 产生圆
                setInterval(function () {
                    // 随机颜色
                    var r = Math.round(Math.random() * 255);
                    var g = Math.round(Math.random() * 255);
                    var b = Math.round(Math.random() * 255);
                    // 随机半径
                    var R = Math.round(Math.random() * 8  + 2);
                    // 随机初始位置
                    var y = 400 + R;
                    var x = Math.round(Math.random() * 150);
                    // 随机缩放系数
                    var scale = Math.round(Math.random() * 50  + 50);

                    // 添加到数组
                    arr.push({
                        r: r,
                        g: g,
                        b: b,
                        x: x,
                        y: y,
                        R: R,
                        deg: 0,
                        scale: scale
                    });

                }, 100)

                teamUl.appendChild(canvas);
            }
        }else{
            canvas.style.left = index*236 +"px";
        }
    }

    /*音乐播放事件*/
    headerMusic.onclick = function () {
        if (audio.paused) {
            // 说明当前音乐暂停状态，需要播放
            audio.play();
            this.style.backgroundImage = 'url("./imgs/musicon.gif")';
        } else {
            // 说明当前音乐播放状态，需要暂停
            audio.pause();
            this.style.backgroundImage = 'url("./imgs/musicoff.gif")';
        }
    }

    //侧边栏效果
    for (var i = 0; i <contentPoint.length ; i++) {
        contentPoint[i].index = i;
        contentPoint[i].onclick = function () {
            index = this.index;
            move(index);
        }
    }


    var plane1 = document.querySelector('.plane1');
    var plane2 = document.querySelector('.plane2');
    var plane3 = document.querySelector('.plane3');

    var pencil1 = document.querySelector('.pencel1');
    var pencil2 = document.querySelector('.pencel2');
    var pencil3 = document.querySelector('.pencel3');

    var home = document.querySelector(".home");

    var photo1 = document.querySelector('.about-photo-first');
    var photo2 = document.querySelector('.about-photo-second');

    var teamTitle = document.querySelector('.team-title');
    var teamContent = document.querySelector('.team-content');

    var animationArr = [
      {
          //出场动画
          animationOut: function () {
              home.style.transform = "translateY(-200px)";
          },
          // 入场动画
          animationIn: function () {
              home.style.transform = "translateY(0)";
          }
      },
        {
            //出场动画
            animationOut: function () {
                plane1.style.transform = "translate(-200px,-200px)";
                plane2.style.transform = "translate(-200px,200px)";
                plane3.style.transform = "translate(200px,-200px)";
            },
            // 入场动画
            animationIn: function () {
                plane1.style.transform = "translate(0)";
                plane2.style.transform = "translate(0)";
                plane3.style.transform = "translate(0)";
            }
        },
        {
            //出场动画
            animationOut: function () {
                pencil1.style.transform = "translateY(-200px)";
                pencil2.style.transform = "translateY(200px)";
                pencil3.style.transform = "translateY(200px)";
            },
            // 入场动画
            animationIn: function () {
                pencil1.style.transform = "translate(0)";
                pencil2.style.transform = "translate(0)";
                pencil3.style.transform = "translate(0)";
            }
        },
        {
            //出场动画
            animationOut: function () {
                photo1.style.transform = "rotate(45deg)";
                photo2.style.transform = "rotate(45deg)";
            },
            // 入场动画
            animationIn: function () {
                photo1.style.transform = "rotate(0)";
                photo2.style.transform = "rotate(0)";
            }
        },
        {
            //出场动画
            animationOut: function () {
                teamTitle.style.transform = "translateX(-200px)";
                teamContent.style.transform = "translateX(200px)";
            },
            // 入场动画
            animationIn: function () {
                teamTitle.style.transform = "translateX(0)";
                teamContent.style.transform = "translateX(0)";
            }
        }
    ];

    for (var i = 0; i < animationArr.length; i++) {
        animationArr[i].animationOut();
    }

}
