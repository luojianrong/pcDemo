window.onload = function () {
    var headerNavLi = document.querySelectorAll(".header-main-nav li");
    var headBottom = document.querySelectorAll(".header-main-bottom");

    var headerArrow = document.querySelector(".header-main-arrow");

    var arrowWidth = headerArrow.width / 2;

    setLeft(headerNavLi[0]);

    function setLeft(node){
        headerArrow.style.left = node.offsetLeft + node.offsetWidth/2 - arrowWidth +"px";
    }

    for (var i = 0,length = headerNavLi.length; i <length ; i++) {
        var headerNavLiElemet = headerNavLi[i];
        headerNavLiElemet.index = i;
        headerNavLi[i].onclick = function () {
            for (var j = 0,length = headBottom.length; j <length ; j++) {
                headBottom[j].style.width = 0;
            }
            headBottom[this.index].style.width = "100%";

            setLeft(this);
        }
    }
}
