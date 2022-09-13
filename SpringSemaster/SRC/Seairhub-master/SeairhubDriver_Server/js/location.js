var map, marker1 // map: 지도 초기화, marker: 도착지점
var lon, lat; //lon: 도착지점 lon, lat: 도착지점 lat

var marker_s = new Tmapv2.Marker(), marker_e = new Tmapv2.Marker();

var drawInfoArr = [];
var resultInfoArr1 = [];
var resultInfoArr2 = [];
var distance;

function initTmap(){ // 지도 초기화
    map = new Tmapv2.Map("map_div", {
        width : "50%",
        height : "500px",
        zoom : 18,
        zoomControl : true,
        scrollwheel : true

    });
}

function findLocation(location){ // 주소 -> 위,경도로 표시
    //var fullAddr = $("#fullAddr").val();
    let find_lon, find_lat;
    var fullAddr = location;
    $.ajax({
        method: "GET",
        url:  "https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?version=1&format=json&callback=result",
        async : false,
        data:{
            "appKey": "l7xxedbd15512a7043129a3059cd74430de3",
            "coordType" : "WGS84GEO",
            "fullAddr" : fullAddr
        },
        success: function(response){
            var resultInfo = response.coordinateInfo;

            if(resultInfo.coordinate.length == 0){
                alert("요청 데이터가 올바르지 않습니다.")
            }
            else{
                var resultCoordinate = resultInfo.coordinate[0];
                if (resultCoordinate.lon.length > 0) {
                    // 구주소
                    find_lon = resultCoordinate.lon;
                    find_lat = resultCoordinate.lat;
                } else {
                    // 신주소
                    find_lon = resultCoordinate.newLon;
                    find_lat = resultCoordinate.newLat
                }
            }
        },
        error: function(request, status, error){
            console.log(request);
            console.log("code:" + request.status + "\n message" + requst.responseText + "\n error:" + error);
        }
    });
    let obj = {
        lat: find_lat,
        lon: find_lon
    };

    return obj;
}

function pathFind(s_lon, s_lat, d_lon, d_lat){ // 최적 경로 출력
    //지도 중심 이동
    var lonlat =  new Tmapv2.LatLng(s_lon, s_lat); // 기사 위치로 변경 바람
    map.setCenter(lonlat);

    //마커 초기화 하기
    if(marker_s.isLoaded()) marker_s.setMap(null);
    if(marker_e.isLoaded()) marker_e.setMap(null);
    //출발 마커
    marker_s = new Tmapv2.Marker(
        {
            position : new Tmapv2.LatLng(s_lon, s_lat), // 기사 위치로 변경
            icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
            iconSize : new Tmapv2.Size(24, 38),
            map : map
        });

    // 도착 마커(이전에 받은 경,위도를 넣는다.)
    marker_e = new Tmapv2.Marker(
        {
            position : new Tmapv2.LatLng(d_lon, d_lat), //도착 위치
            icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
            iconSize : new Tmapv2.Size(24, 38),
            map : map
        });

    //경로탐색 api 사용요청
    var searchOption = 1;
    let distance = 0;
    setTimeout(
        function() {
            $.ajax({
                    method : "POST",
                    url : "https://apis.openapi.sk.com/tmap/truck/routes?version=1&format=json&callback=result",//
                    zoom: 18,
                    async : false,
                    data : {
                        "appKey" : "l7xxedbd15512a7043129a3059cd74430de3",
                        "startX" : s_lat,
                        "startY" : s_lon,
                        "endX" : d_lat,
                        "endY" : d_lon,
                        "reqCoordType" : "WGS84GEO",
                        "resCoordType" : "EPSG3857",
                        "angle" : "172",
                        "searchOption" : searchOption,
                        "trafficInfo" : "Y",
                        "truckType" : "1",
                        "truckWidth" : "100",
                        "truckHeight" : "100",
                        "truckWeight" : "35000",
                        "truckTotalWeight" : "35000",
                        "truckLength" : "200"
                    },
                    success : function(response) {
                        // 결과 출력
                        var resultData = response.features;

                        distance = 100;
                        var tDistance = "총 거리 : "
                            + (resultData[0].properties.totalDistance / 1000)
                                .toFixed(1)
                            + "km,";
                        var tTime = " 총 시간 : "
                            + (resultData[0].properties.totalTime / 60)
                                .toFixed(0)
                            + "분";

                        $("#result").html(tDistance + tTime);

                        if (resultInfoArr2.length > 0) {
                            for (var k = 0; k < resultInfoArr2.length; k++) {
                                resultInfoArr2[k].setMap(null);
                            }
                        }
                        resultInfoArr2 = [];

                        for ( var i in resultData) { //for문 [S]
                            var geometry = resultData[i].geometry;
                            var properties = resultData[i].properties;
                            var polyline_;

                            drawInfoArr = [];

                            if (geometry.type == "LineString") {
                                for ( var j in geometry.coordinates) {
                                    // 경로들의 결과값(구간)들을 포인트 객체로 변환
                                    var latlng = new Tmapv2.Point(
                                        geometry.coordinates[j][0],
                                        geometry.coordinates[j][1]);
                                    // 포인트 객체를 받아 좌표값으로 변환
                                    var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                                        latlng);
                                    // 포인트객체의 정보로 좌표값 변환 객체로 저장
                                    var convertChange = new Tmapv2.LatLng(
                                        convertPoint._lat,
                                        convertPoint._lng);
                                    // 배열에 담기
                                    drawInfoArr
                                        .push(convertChange);
                                }

                                polyline_ = new Tmapv2.Polyline(
                                    {
                                        path : drawInfoArr,
                                        strokeColor : "#FF0000", //RED
                                        strokeWeight : 6,
                                        map : map
                                    });
                                resultInfoArr2
                                    .push(polyline_);
                            }
                        }//for문 [E]
                    },
                    error : function(request, status, error) {
                        console.log("code:"
                                + request.status
                                + "\n"
                                + "message:"
                                + request.responseText
                                + "\n"
                                + "error:"
                                + error);
                    }
                });
        }, 1000);
// //맵 중심영역 재설정
// var mapBoundInfo = map.getBounds();
// map.fitBounds(mapBoundInfo, 50);

}

function getDistance(s_lon, s_lat, d_lon, d_lat){
    var searchOption = 1;
    let distance = 0;
    $.ajax({
        method : "POST",
        url : "https://apis.openapi.sk.com/tmap/truck/routes?version=1&format=json&callback=result",//
        zoom: 18,
        async : false,
        data : {
            "appKey" : "l7xxedbd15512a7043129a3059cd74430de3",
            "startX" : s_lat,
            "startY" : s_lon,
            "endX" : d_lon,
            "endY" : d_lat,
            "reqCoordType" : "WGS84GEO",
            "resCoordType" : "EPSG3857",
            "angle" : "172",
            "searchOption" : searchOption,
            "trafficInfo" : "Y",
            "truckType" : "1",
            "truckWidth" : "100",
            "truckHeight" : "100",
            "truckWeight" : "35000",
            "truckTotalWeight" : "35000",
            "truckLength" : "200"
        },
        success : function(response) {
            // 결과 출력
            var resultData = response.features;
            distance = (resultData[0].properties.totalDistance / 1000).toFixed(1)

        },
        error : function(request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        }
    });
    return distance;
}

function getTable(){
    $.ajax({
        method: "POST",
        url: "https://localhost:443/getTable",
        success: function(response){
            var bl_num = response.BL;
            var container_num = response.container;
        },
        error: function(response){
            alert(response.error);
        }
    });
}

function driverLocation(){
    let s_lat, s_lon;
    $.ajax({
        method: "POST",
        url: "https://localhost:443/getLocation",
        async : false,
        success: function(response){
            s_lat = response.lat;
            s_lon = response.lon;
        },
        error: function(response){
            console.log(response.error);
        }
    });
    let obj = {
        lat: s_lat,
        lon: s_lon
    }
    return obj;
}

function getdelivery(){
    let start, dist;
    $.ajax({
        method: "POST",
        url: "https://localhost:443/getDelivery",
        async : false,
        success: function(response){
            start = response.start;
            dist = response.dist;
            //document.getElementById("endpoint").innerHTML = start + " => " + dist;

        },
        error: function(response){
            alert(response.error);
        }
    });
    let obj = {
        start_point: start,
        end_point: dist
    }
    return obj;
}

function getnowLocation(totalDistance, end){

    let driver = driverLocation();
    pathFind(driver.lat, driver.lon, end.lat, end.lon);
    let driverDistance = getDistance(driver.lat, driver.lon, end.lon, end.lat);
    //document.getElementById("distanceProgress").value  = parseInt(parseInt(totalDistance - driverDistance) / parseInt(totalDistance));


}

let starting, ending;
let startToendDistance;

function info(){
    initTmap();
    let obj = getdelivery();
    starting = findLocation(obj.start_point);
    ending = findLocation(obj.end_point);
    startToendDistance = getDistance(starting.lat, starting.lon, ending.lon, ending.lat);
    getnowLocation(startToendDistance, ending);
    setInterval(getnowLocation, 60000, startToendDistance, ending);


}

window.onload = info;