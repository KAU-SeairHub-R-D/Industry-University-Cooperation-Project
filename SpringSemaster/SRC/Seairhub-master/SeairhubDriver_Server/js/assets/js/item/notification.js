var notiWrap = document.querySelectorAll("#notiwrapper .noti-list");
var notiPageWrap = document.querySelector("#notiwrapper .noti-page");
var tmpNotiHTML = document.getElementById("tmp-notification").innerHTML;
var tmpNotiPageHTML = document.getElementById("tmp-notification-page").innerHTML;

var isLoadingNoti = false;

function readNotification(){
    var data = {};
    data[yamon.form_token_name] = yamon.getNowHash();
    
    yamon.fetch("/ajax/user/notification/read" ,{
        "method":"post",
        "data": data,
    }).then(function(res){

    });
}

$('#collapseNoti').on('show.bs.collapse', function (e) {
    requestNotification();
});

function requestNotification(page){
    if(typeof page == "undefined"){
        page = 1;
    }

    if(isLoadingNoti) return;

    isLoadingNoti = true;
    
    yamon.fetch("/ajax/user/notification", {
        method: "get",
        data: {
            page: page,
        },
    }).then(function(res){
        isLoadingNoti = false;
        if(res.status){
            var data = res.data;
            var dataCnt = res.data_cnt;
            var dataLimit = res.data_limit;

            var dataHTML = "";

            for (let i = 0; i < data.length; i++) {
                var _data = res.data[i];
                var html = bindData(tmpNotiHTML, "text", _data.text);
                html = bindData(html, "time", _data.time);
                
                    var evt = `onClickNoti(this, ${_data.id}`;
                if(_data.link){
                    evt += `, '${_data.link}'`;
                    if(_data.hasOwnProperty("link_type")){
                        if(_data.link_type == "link"){
                            evt += `, true`;
                        }
                    }
                    evt += ")";
                }else{
                    evt += `, false)`;
                }

                html = bindData(html, "root_tag", "button");
                html = bindData(html, "root_attr", `onclick=\"${evt}\"`);
                  

                if(_data.read){
                    html = bindData(html, "class", "read");
                }else{
                    html = bindData(html, "class", "");
                }
                dataHTML += html;
            }

            for (var i = 0; i < notiWrap.length; i++) {
                notiWrap[i].innerHTML = dataHTML;
            }

            setPagination2(notiPageWrap, tmpNotiPageHTML, page, dataCnt, dataLimit, "requestNotification", {
                page_count: 3,
            });
        }else{
            yamon.alertResMessage(res);
        }
    }).catch(function(err){
        isLoadingNoti = false;
        console.log(err);
        alert(messages.server_error);
    });
}

function onClickNoti(elem, id, link, isWindowOpen){
    elem.classList.add("read");

    var data = {};
    data[yamon.form_token_name] = yamon.getNowHash();

    yamon.fetch("/ajax/user/notification/"+id , {
        method: "post",
        data: data,
    }).then(function(){
        if(link){
            if(isWindowOpen){
                window.open(link);
            }else{
                location.href= link;
            }
        }
    }).catch(function(){
        if(link){
            if(isWindowOpen){
                window.open(link);
            }else{
                location.href= link;
            }
        }
    });
}