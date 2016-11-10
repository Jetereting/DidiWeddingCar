/*获取品牌*/
function getSeries(obj) {
    var bid = $(obj).val();
    var html = "";
    var optionText = '<option value="0" class="select">不限</option>';
    var model = $("#model");
    if (bid != 0) {
        $.get("/car/getSeries", {bid: bid}, function (series) {
            if (series) {
                for (var i = 0; i < series.length; i++) {
                    model.html(optionText);
                    html += '<option value="' + series[i].sid + '">' + series[i].series_name + "</option>";
                    model.find(".select").after(html)
                }
            } else {
                model.html(optionText)
            }
        }, "json")
    } else {
        model.html(optionText)
    }
}

/*搜索条件*/
function search(obj, order) {
    $(obj).siblings().removeClass("selected");
    $(obj).addClass("selected");
    /*显示加载进度条*/
    if (!$("#panel-loading").is(":animated")) {
        $("#panel-loading").fadeIn()
    }
    $("#list_car").animate({scrollTop: "0px"}, 300);
    var date = "", type = "", color = "", price = "", brand = 0, series = 0, skylight = 0, longitude = "", latitude = "";
    date = document.getElementById("date").value;
    type = document.getElementById("type").value;
    color = document.getElementById("color").value;
    price = document.getElementById("price").value;
    brand = document.getElementById("brand").value;
    series = document.getElementById("model").value;
    skylight = document.getElementById("window").value;
    market_price = document.getElementById("sell-price").value;
    var page = $(obj).data("page");
    var sort = "mixed";
    if (order == 1) {
        var sort1 = $(obj).data("sort");
        //console.log(sort1);
        if (sort1 != "mixed") {
            var item = sort1.substr(0, 1);
            //console.log(item);
            var item2 = sort1.substr(1, sort1.length - 1);
            var sort2 = "";
            if (item == "+") {
                sort2 = "-" + item2
            } else {
                sort2 = "+" + item2
            }
            $(obj).data("sort", sort2);
            $.cookie("sort", sort1);
            sort = $.cookie("sort")
        }
    }
    sort = $.cookie("sort") ? $.cookie("sort") : "mixed";
    var html = "";
    var pages = "";
    if (date || type || color || price || brand || series || skylight >= 0 || market_price && order || page) {
        $(".pager").html("");
        $("#list_car").html("");
        $.ajax({
            url: MODULE + "/car/lists",
            data: {
                date: date,
                color: color,
                type: type,
                price: price,
                brand: brand,
                series: series,
                skylight: skylight,
                market_price: market_price,
                order: order,
                sort: sort,
                page: page,
                latitude: latitude,
                longitude: longitude
            },
            type: "get",
            dataType: "json",
            success: function (cars) {
                if (cars.status) {
                    $(cars.cars).each(function (i) {
                        html = '<a target="_blank" class="car_item" data-lng=" ' + cars.cars[i].longitude + ' " data-lat="' + cars.cars[i].latitude + '" href="/car/detail/car_id/' + cars.cars[i].car_id + '" ><div class="car-item"><ul><li class="photo"><img src="http://img03.hunchelaila.com/' + cars.cars[i].img_url + '" alt="' + cars.cars[i].car_name + '" /></li><li class="info"><div class="title"><span class="car-name">' + cars.cars[i].brand.name + " " + cars.cars[i].series.name + '</span><span class="car-year gray">' + cars.cars[i].registered_year + '</span></div><div class="title gray"><span class="gray-star" style="margin-left:0"><span class="rate-star" style="width:' + cars.cars[i].starWidth + '%"></span></span> <span>（' + cars.cars[i].num + '）</span></div><div class="title gray"><span class="detail-border">' + cars.cars[i].type + '</span><span class="detail-border">' + cars.cars[i].color + '</span></div><div class="title gray"><span class="icon icon-location"></span> ' + cars.cars[i].address + '</div></li><li class="price red"><span class="px12">￥</span><span class="px18 bold">' + cars.cars[i].rent + '</span><span class="px12 gray"> /半天</span><div class="px12 gray">' + cars.cars[i].basic_time + "小时" + cars.cars[i].basic_miles + "公里</div></li></ul></div></a>";
                        $("#list_car").append(html);
                        $("#panel-loading").fadeOut()
                    });
                    $(".pager").append(cars.page);
                } else {
                    html = '<p class="red not-found">抱歉! 没有找到符合条件的爱车，请调整搜索条件再试！</p>';
                    $("#list_car").append(html);
                    $("#panel-loading").fadeOut()
                }
            }
        })
    }
}

//获取当前城市
(function () {
    var map;
    var markers = [];
    var cityName = document.getElementById("current_city").innerHTML + '市';

    map = new AMap.Map("car-map", {
        resizeEnable: true,
        keyboardEnable: false,
        zoom: 12
    });
    map.plugin(["AMap.ToolBar"], function () {
        var tool = new AMap.ToolBar;
        map.addControl(tool)
    });

    if (!cityName) {
        cityName = '北京市';
    }
    map.setCity(cityName);

    setTimeout(function () {
        map.setZoom(12);
    }, 1000);

    $.ajax({
        url: "/car/getPoi",
        type: "get",
        dataType: "json",
        success: function (result) {
            var markIcon = '../img/car_marker.png'/*tpa=http://static.hunchelaila.com/Home/img/car_marker.png*/;
            $.each(result, function (key, value) {
                var mark = this;
                var markerPosition = new AMap.LngLat(this.longitude, this.latitude);

                var marker = new AMap.Marker({
                    map: map,
                    position: markerPosition,
                    icon: markIcon,
                    offset: new AMap.Pixel(-8, -34)
                });
                markers.push(marker);
                AMap.event.addListener(marker, "click", function (e) {
                    marker.setIcon("../img/car_current.png"/*tpa=http://static.hunchelaila.com/Home/img/car_current.png*/);
                    var info = [];
                    info.push("<div class='mapTip'>" + "<a href=" + mark.detail + " target='_blank'>" + "<div class='car_image'><img class='carListImage' src=" + mark["_226x165_"] + "></div>" + "<div class='car_name'><div class='fl'><span>￥</span><span class='px18'>" + mark.rent + "</span></div>" + mark.car_name + "</div>" + "<div class='car_tit' title=" + mark.address + "><i class='icon icon-location'></i>&nbsp;" + mark.address + "</div>" + "</a>" + "<div>");
                    infoWindow = new AMap.InfoWindow({
                        content: info.join("<br/>"),
                        offset: new AMap.Pixel(7, -20),
                        autoMove: true,
                        size: new AMap.Size(250, 220),
                        isCustom: false,
                        showShadow: false,
                        closeWhenClickMap: true
                    });
                    infoWindow.open(map, new AMap.LngLat(mark.longitude, mark.latitude))
                })
            });
        }
    });
})();
