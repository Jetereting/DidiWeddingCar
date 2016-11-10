$(function () {

    //首页轮播图

    $(".slide-box").slide({mainCell: ".bd ul", autoPlay: true, interTime: 3200});


    //广告轮播图
    $(".slideBox").slide({mainCell: ".bd ul", autoPlay: true, interTime: 8e3}).hover(function () {
        $(this).find(".prev,.next").stop(true, true).fadeTo("show", .9)
    }, function () {
        $(this).find(".prev,.next").fadeOut()
    });

    $("#nav").slide({
        type: "menu",
        titCell: ".nLi",
        targetCell: ".sub",
        effect: "slideDown",
        delayTime: 300,
        triggerTime: 0,
        returnDefault: true
    });
    if ($.cookie("marryDate")) {
        $("#date").val($.cookie("marryDate"))
    }
    function shake(element, className, times) {
        var i = 0, t = false, o = element.attr("class"), c = "", times = times || 2;
        if (t)return;
        t = setInterval(function () {
            i++;
            c = i % 2 ? o + " " + className : o;
            element.attr("class", c);
            if (i == 2 * times) {
                clearInterval(t);
                element.removeClass(className)
            }
        }, 200)
    }

    shake($("#message-new"), "shark", 10)
});

function dayRent(obj) {
    var rent = parseInt($(obj).val(), 10);
    var day_rent;
    if (rent !== "NaN" && rent > 0) {
        day_rent = ~~(rent * 1.6)
    } else {
        day_rent = 0
    }
    $(".day_rent").text(day_rent);
    $("#day_rent").val(day_rent)
}
function setDate() {
    var marryDate = $("#date").val();
    $.cookie("marryDate", marryDate, {path: "/", expires: 7})
}
