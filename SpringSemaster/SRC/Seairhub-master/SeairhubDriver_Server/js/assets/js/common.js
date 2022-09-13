function pad2(n) { return n < 10 ? '0' + n : n }

// date yyyymmddhhmmss format
Date.prototype.yyyymmddhhmmss = function(setDash) {
    var result;
    if(setDash == true){
        result = this.getFullYear().toString() + "-" + pad2(this.getMonth() + 1) + "-" + pad2( this.getDate()) + " " + pad2( this.getHours() ) + ":" + pad2( this.getMinutes() ) + ":" + pad2( this.getSeconds() )
    }else{
        result = this.getFullYear().toString() + pad2(this.getMonth() + 1) + pad2( this.getDate()) + pad2( this.getHours() ) + pad2( this.getMinutes() ) + pad2( this.getSeconds() )
    }

    return result;
};

Date.prototype.yyyymmddhhmm = function(setDash) {
    var result;
    if(setDash == true){
        result = this.getFullYear().toString() + "-" + pad2(this.getMonth() + 1) + "-" + pad2( this.getDate()) + " " + pad2( this.getHours() ) + ":" + pad2( this.getMinutes() )
    }else{
        result = this.getFullYear().toString() + pad2(this.getMonth() + 1) + pad2( this.getDate()) + pad2( this.getHours() ) + pad2( this.getMinutes() )
    }

    return result;
};

Date.prototype.hhmmss = function(setDash) {
    var result;
    if(setDash == true){
        result = pad2( this.getHours() ) + ":" + pad2( this.getMinutes() ) + ":" + pad2( this.getSeconds() )
    }else{
        result = pad2( this.getDate()) + pad2( this.getHours() ) + pad2( this.getMinutes() ) + pad2( this.getSeconds() )
    }

    return result;
};

Date.prototype.yyyymmdd = function(setDash) {
    var result;
    if(setDash == true){
        result = this.getFullYear().toString() + "-" + pad2(this.getMonth() + 1) + "-" + pad2( this.getDate());
    }else{
        result = this.getFullYear().toString() + pad2(this.getMonth() + 1) + pad2( this.getDate());
    }
    return result
};

// 천자리 콤마
Number.prototype.comma = function(decimal = false){
    var value = this;
    var parts = value.toString().split(".")
    if(parts.length > 2) {
        const tempPart = parts.pop()
        parts = [parts.join(''), tempPart]
    }

    parts[0] = parts[0].replace(/\D+/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')
   
    if(decimal !== false) {
        if(parts.length > 1) {
            parts[1] = parts[1].substring(0, decimal);
        }

        value = parts.join('.')
    } else {
        value = parts[0]
    }

    return value;
}

String.prototype.comma = Number.prototype.comma;

String.prototype.removeComma = function(){
    var value = this;
    var parts = value.toString().split(".")
    if(parts.length > 2) {
        const tempPart = parts.pop()
        parts = [parts.join(''), tempPart]
        
        parts[1] = parts[0].replace(/^0+|\D+/g, '');
    }

    if(parts[0] != 0)
        parts[0] = parts[0].replace(/^0+|\D+/g, '');

    return parts.join(".");
}

// ex) "You can enter an {0} within {1} characters.".format("english", 10);
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

function resetFileInput(input){
    input.value = ''

    if(!/safari/i.test(navigator.userAgent)){
        input.type = ''
        input.type = 'file'
    }
}

function removeStr(str){
    return str.replace(/[^0-9]/g, '');
}

function removeSpace(str){
    return str.replace(/\s/g, "");
}

function bindData(html, name, data){
    var re = new RegExp("{{"+name+"}}", "gi");
    return html.replace(re, data);
}

function isValidUrlWithHttp(str){
    // var urlCheck =/^(((http(s?))\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?/;
    var urlCheck = /^http[s]?\:\/\//i;
    return urlCheck.test(str);
}

function isValidUrl(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$', 'i')
    return !!pattern.test(str)
}

function checkWarningText(str){
    var textArray = str.split(/\s+/);
    var emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i; // 이메일 정규식
    var telReg = /^\d{3}-\d{3,4}-\d{4}$/; // 전화번호 정규식

    for (var i = 0; i < textArray.length; i++) {
        if (emailReg.test(textArray[i]) || telReg.test(textArray[i])) {
            $('.warning-comment').removeClass('hidden');
            return false;
        }
    }

    return true;
}

function isEmpty(data){
    return data==null || data.length == 0;
}

//logout
function logout(){
    try{
        var formData = new FormData();
        seairApp.getToken().then(function(token){
            formData.append("token", token);
            requestLogout(formData);
        }).catch(error => {
            requestLogout(formData);
        });
    }catch(err){
        requestLogout(formData);
    }
}

function requestLogout(formData){
    yamon.fetch("/ajax/user/logout", {
        "method": "post",
        "data": formData,
    }).then(function(){
        location.href = "/";
    });
}

function onEnterKey(elem, func) { 
    if (window.event.keyCode == 13) { 
        window.event.preventDefault();
        func();
    } 
}


// 모달 취소버튼 누를 시 input 값 초기화
function setModalCloseReset(){
    $('.modal').on('hidden.bs.modal', function (e) {
        $(this).find('input[type!="checkbox"][type!="radio"], textarea').val('');
        $(this).find('input[type="checkbox"]').prop("checked", false);
        $(this).find('input[type="radio"]').prop("checked", false);
    });
}

function printModal(elem, target){
    var printWrap = document.getElementById("print-wrap");
    var wrap = document.getElementById("wrap");
    printWrap.innerHTML = target.innerHTML;
    wrap.classList.add("hidden");
    printWrap.classList.remove("hidden");

    var body = document.querySelector("body");
    body.style.height = "auto";
    
    var modalBack = document.querySelector(".modal-backdrop");
    modalBack.classList.add("hidden");

    document.head.insertAdjacentHTML('beforeend', `
        <style id="printer-css">
            @media print {
                * {
                    -webkit-print-color-adjust: exact !important;
                }
            }
        </style>
    `)

    window.onafterprint = function(){
        body.style.height = null;

        window.onafterprint = null;
        printWrap.innerHTML = "";
        wrap.classList.remove("hidden");
        printWrap.classList.remove("hidden");
        modalBack.classList.remove("hidden");

        document.head.querySelector('#printer-css').remove()
    }

    setTimeout(function(){
        window.print();
    }, 500);
}

if(typeof window.yamon == 'undefined'){
    window.yamon = {};
}

function isMobile() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

window.yamon.fetch = function(url, opt, count) {
    if(typeof opt == "undefined"){
        opt = {};
    }

    if(typeof count == "undefined"){
        count = 1;
    }

    var method = opt.hasOwnProperty("method") ? opt.method : "get";
    var data = opt.hasOwnProperty("data") ? opt.data : false;
    var header = opt.hasOwnProperty("header") ? opt.header : {};

    if(!header.hasOwnProperty("X-Requested-With")){
        header['X-Requested-With'] = 'XMLHttpRequest';
    }

    var fetchOpt = {
        method: method, // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: header,
        // {
            // 'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        // },
        // redirect: 'manual', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
    };

    if(opt.hasOwnProperty("signal")){
        fetchOpt.signal = opt.signal;
    }

    if(method == "get" && data !== false){
        var query = new URLSearchParams(data).toString();
        url += "?" + query;
    }else if(method != "get" && data !== false){
        if(!(data instanceof FormData)){
            var formData = new FormData();
            for (const key in data) {
                const element = data[key];
                if(typeof element == 'object'){
                    for (const key2 in element) {
                        const element2 = element[key2];
                        formData.append(`${key}[${key2}]`, element2);
                    }
                }else{
                    formData.append(key, element);
                }
            }
            data = formData;
        }

        fetchOpt.body = data;
    }

    // 페이지 이동으로 cancel 됬을때 에러들
    var ignoreErrors = [
        'TypeError: Failed to fetch', // 크롬
        'TypeError: NetworkError when attempting to fetch resource.', // 사파리
        'TypeError: Cancelled', // 파폭
    ];

    return fetch(url, fetchOpt).then(function(response){
        var json = response.json()
        return json;
    }).then(function(json){
        if(!json.status && json.hasOwnProperty("err_code") && json.err_code == -1 && count < 3){
            // 토큰값 갱신
            return yamon.refreshHash()
            .then(function(hash){
                if(opt.hasOwnProperty("data")){
                    if(opt.data instanceof FormData){
                        opt.data.set(yamon.form_token_name, hash);
                    }else if(typeof opt.data == "object"){
                        opt.data[yamon.form_token_name] = hash;
                    }
                    return yamon.fetch(url, opt, count+1);
                }
                return json;
            });
        }else{
            if(json.hasOwnProperty("hash") && typeof window.yamon.form_token_name != "undefined"){
                var inputs = document.querySelectorAll("input[name="+window.yamon.form_token_name+"]");
                inputs.forEach(element => {
                    element.value = json.hash;
                });
            }
            return json;
        }
    }).catch(function(err){
        // err.code == 20 => abort
        if(err.code == 20 || ignoreErrors.indexOf(err.toString()) !== -1){
            return;
        }else{
            alert(messages.server_error);
        }
    });
};

// 검증
window.yamon.validation = function (target){
    var list = target;
    if(typeof target == "undefined"){
        list = document.getElementsByClassName("validation-check");
    }
    
    for (var i = 0; i < list.length; i++) {
        var element = list[i];
        var validation = element.dataset.validation;
        var name = element.dataset.validationName;

        if(validation == undefined || element.disabled){
            continue;
        }
        
        var validationList = validation.split("|");
        for (var j = 0; j < validationList.length; j++) {
            var valid = validationList[j];
            if(valid == "required"){
                // 필수
                if(element.type == "checkbox"){
                    // 체크박스
                    if(!element.checked){
                        if(name.length == 0){
                            alert(messages.empty_content);
                        }else{
                            alert(messages["agree"].format(name));
                        }
                        element.focus();
                        return false;
                    }
                }else if(element.type == "file"){
                    // 파일
                    if(element.files.length == 0){
                        if(name.length == 0){
                            alert(messages.empty_content);
                        }else{
                            alert(messages[valid + "_file"].format(name));
                        }
                        element.focus();
                        return false;
                    }
                }else{
                    if((element.tagName.toLowerCase() == "select" && element.value == -1)
                            || element.value.trim().length == 0) {
                        if(name.length == 0){
                            alert(messages.empty_content);
                        }else{
                            alert(messages[valid].format(name));
                        }
                        element.focus();
                        return false;
                    }
                }
            }else if(valid == "length"){
                // 글자수
                var minLength = element.minLength;
                var maxLength = element.maxLength;
                if((minLength > 0 && element.value.length < minLength)
                        || (maxLength > 0 && element.value.length > maxLength)){
                    if(maxLength != -1 && minLength != -1){
                        alert(messages[valid + "_min_max"].format(name, maxLength));
                    }else if(maxLength != -1){
                        alert(messages[valid + "_max"].format(name, maxLength));
                    }else{
                        alert(messages[valid + "_min"].format(name, maxLength));
                    }
                    element.focus();
                    return false;
                }
            }else if(valid == "email"){
                // 이메일 형식
                var emailReg = /^([\w\.\_\-])*[a-zA-Z0-9]+([\w\.\_\-])*([a-zA-Z0-9])+([\w\.\_\-])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/i;

                if(element.value.trim().length > 0 && !emailReg.test(element.value)){
                    alert(messages["invalid_email"]);
                    element.focus();
                    return false;
                }
            }else if(valid == "company_reg"){
                var reg = /^[0-9]{3}-[0-9]{2}-[0-9]{5}$/;
                if(!reg.test(element.value)){
                    alert(messages["invalid_company_reg"]);
                    element.focus();
                    return false;
                }
            }else if(valid =="warning_text"){
                if(!checkWarningText(element.value)){
                    alert(messages["warning_text"]);
                    element.focus();
                    return false;
                }
            }
        }
    }

    return true;
}

yamon.refreshHash = function(){
    return yamon.fetch("/ajax/home/hash", {})
    .then(function(res){
        var inputs = document.querySelectorAll("input[name="+window.yamon.form_token_name+"]");
        inputs.forEach(element => {
            element.value = res.hash;
        });

        return res.hash;
    });
}

yamon.getNowHash = function(){
    var input = document.querySelector("input[name="+window.yamon.form_token_name+"]");
    if(input){
        return input.value;
    }else{
        return false;
    }
}

yamon.alertResMessage = function(res){
    var message = messages.server_error;

    if(res.hasOwnProperty("message")){
        message = res.message;
        if(res.hasOwnProperty("err_code")){
            if(res.hasOwnProperty("err_code_sub")){
                message += `[${res.err_code}-${res.err_code_sub}]`
            }else{
                message += `[${res.err_code}]`
            }
        }
    }
    
    alert(message);
}

// 취소 여부 확인
function closeModalCheck(elem) {
    var $this = $(elem);
    var modalId = $this.data('modal-id');
    if(confirm('취소 시 저장하지 않은 내역은 삭제됩니다.')) {
        $('#' + modalId).modal('hide');
    }
}

/**
 * 페이지네이션 셋팅
 * FIXME: setPagination2 로 변경
 * @param element wrapper page 담을 wrapper
 * @param string tempHTML template html
 * @param int nowPage 현재 페이지
 * @param int dataCnt 데이터 총 개수
 * @param int dataLimit 한 페이지 보이는 데이터 개수
 * @param int onClickMethodName 페이지 onclick 함수명
 * @param object opt 
 */
 function setPagination(wrapper, tempHTML, nowPage, dataCnt, dataLimit, onClickMethodName, opt){
    // 한번에 보여질 페이지네이션 개수
    var MAX_PAGE_CNT = 5;

    var btnFirst = document.getElementById("btn-page-first");
    var btnEnd = document.getElementById("btn-page-end");
    var btnNext = document.getElementById("btn-page-next");
    var btnPrev = document.getElementById("btn-page-prev");

    var isFuncFormat = false;

    if(typeof opt == "object"){
        if(opt.hasOwnProperty("page_count")){
            MAX_PAGE_CNT = opt.page_count;
        }
        if(opt.hasOwnProperty("btn_first")){
            if(opt.btn_first == false){
                btnFirst = false;
            }else{
                btnFirst = opt.btn_first;
            }
        }
        if(opt.hasOwnProperty("btn_end")){
            if(opt.btn_end == false){
                btnEnd = false;
            }else{
                btnEnd = opt.btn_end;
            }
        }
        if(opt.hasOwnProperty("btn_next")){
            if(opt.btn_next == false){
                btnNext = false;
            }else{
                btnNext = opt.btn_next;
            }
        }
        if(opt.hasOwnProperty("btn_prev")){
            if(opt.btn_prev == false){
                btnPrev = false;
            }else{
                btnPrev = opt.btn_prev;
            }
        }
        if(opt.hasOwnProperty("func_format")){
            isFuncFormat = opt.func_format;
        }
    }

    var pageCntAll = Math.ceil(dataCnt / dataLimit);
    var startPage = 1;
    var endPage = pageCntAll;

    if(typeof MAX_PAGE_CNT == "number"){
        startPage = (MAX_PAGE_CNT * ( Math.ceil(nowPage/MAX_PAGE_CNT)-1) ) +1;
        endPage = Math.min(startPage+MAX_PAGE_CNT-1, pageCntAll);
    }

    if(typeof onClickMethodName == "undefined"){
        onClickMethodName = "requestList";
    }

    if(nowPage > endPage) return false;
    
	var pageHTML = "";
	for (let i = startPage; i <= endPage; i++) {
		var html = bindData(tempHTML, "page", i);
		if(nowPage == i){
			html = bindData(html, "class", "active");
		}else{
			html = bindData(html, "class", "");
		}
        if(isFuncFormat){
            var method = bindData(onClickMethodName, "page", i);
            html = bindData(html, "onclick", method);
        }else{
            html = bindData(html, "onclick", onClickMethodName+"("+i+")");
        }
		pageHTML += html;
	}

	wrapper.innerHTML = pageHTML;

    if(btnPrev){
        var method = isFuncFormat ? bindData(onClickMethodName, "page", Math.max(1, nowPage-1)) : onClickMethodName + "("+Math.max(1, nowPage-1)+")";
        btnPrev.setAttribute("onclick", method);
    }
    if(btnNext){
        var method = isFuncFormat ? bindData(onClickMethodName, "page", Math.min(pageCntAll, nowPage+1)) : onClickMethodName + "("+Math.min(pageCntAll, nowPage+1)+")";
        btnNext.setAttribute("onclick", method);
    }
    if(btnFirst){
        var method = isFuncFormat ? bindData(onClickMethodName, "page", 1) : onClickMethodName + "(1)";
        btnFirst.setAttribute("onclick", method);
    }

    if(btnEnd){
        var method = isFuncFormat ? bindData(onClickMethodName, "page", pageCntAll) : onClickMethodName + "("+pageCntAll+")";
        btnEnd.setAttribute("onclick", method);
    }

    return {
        max: pageCntAll,
    };
}

/**
 * 페이지네이션 셋팅
 * @param element wrapper
 * @param string tempHTML template html
 * @param int nowPage 현재 페이지
 * @param int dataCnt 데이터 총 개수
 * @param int dataLimit 한 페이지 보이는 데이터 개수
 * @param int onClickMethodName 페이지 onclick 함수명
 * @param object opt 
 */
 function setPagination2(wrapper, tempHTML, nowPage, dataCnt, dataLimit, onClickMethodName, opt){
    // 한번에 보여질 페이지네이션 개수
    var MAX_PAGE_CNT = 5;

    var btnFirst = wrapper.querySelector(".btn-page-first");
    var btnEnd = wrapper.querySelector(".btn-page-end");
    var btnNext = wrapper.querySelector(".btn-page-next");
    var btnPrev = wrapper.querySelector(".btn-page-prev");

    var isFuncFormat = false;

    if(typeof opt == "object"){
        if(opt.hasOwnProperty("page_count")){
            MAX_PAGE_CNT = opt.page_count;
        }
        if(opt.hasOwnProperty("btn_first")){
            if(opt.btn_first == false){
                btnFirst = false;
            }else{
                btnFirst = opt.btn_first;
            }
        }
        if(opt.hasOwnProperty("btn_end")){
            if(opt.btn_end == false){
                btnEnd = false;
            }else{
                btnEnd = opt.btn_end;
            }
        }
        if(opt.hasOwnProperty("btn_next")){
            if(opt.btn_next == false){
                btnNext = false;
            }else{
                btnNext = opt.btn_next;
            }
        }
        if(opt.hasOwnProperty("btn_prev")){
            if(opt.btn_prev == false){
                btnPrev = false;
            }else{
                btnPrev = opt.btn_prev;
            }
        }
        if(opt.hasOwnProperty("func_format")){
            isFuncFormat = opt.func_format;
        }
    }

    var pageCntAll = Math.ceil(dataCnt / dataLimit);
    var startPage = 1;
    var endPage = pageCntAll;

    if(typeof MAX_PAGE_CNT == "number"){
        startPage = (MAX_PAGE_CNT * ( Math.ceil(nowPage/MAX_PAGE_CNT)-1) ) +1;
        endPage = Math.min(startPage+MAX_PAGE_CNT-1, pageCntAll);
    }

    if(typeof onClickMethodName == "undefined"){
        onClickMethodName = "requestList";
    }

    if(nowPage > endPage) return false;
    
	var pageHTML = "";
	for (let i = startPage; i <= endPage; i++) {
		var html = bindData(tempHTML, "page", i);
		if(nowPage == i){
			html = bindData(html, "class", "active");
		}else{
			html = bindData(html, "class", "");
		}
        if(isFuncFormat){
            var method = bindData(onClickMethodName, "page", i);
            html = bindData(html, "onclick", method);
        }else{
            html = bindData(html, "onclick", onClickMethodName+"("+i+")");
        }
		pageHTML += html;
	}
	wrapper.querySelector(".page-wrapper").innerHTML = pageHTML;

    if(btnPrev){
        var method = isFuncFormat ? bindData(onClickMethodName, "page", Math.max(1, nowPage-1)) : onClickMethodName + "("+Math.max(1, nowPage-1)+")";
        btnPrev.setAttribute("onclick", method);
    }
    if(btnNext){
        var method = isFuncFormat ? bindData(onClickMethodName, "page", Math.min(pageCntAll, nowPage+1)) : onClickMethodName + "("+Math.min(pageCntAll, nowPage+1)+")";
        btnNext.setAttribute("onclick", method);
    }
    if(btnFirst){
        var method = isFuncFormat ? bindData(onClickMethodName, "page", 1) : onClickMethodName + "(1)";
        btnFirst.setAttribute("onclick", method);
    }

    if(btnEnd){
        var method = isFuncFormat ? bindData(onClickMethodName, "page", pageCntAll) : onClickMethodName + "("+pageCntAll+")";
        btnEnd.setAttribute("onclick", method);
    }

    return {
        max: pageCntAll,
    };
}
    
// 구글 지도 이동
function moveMap(map, lat, lng){
    if(typeof lat == "string"){
        var idx = lat.indexOf(",");
        if(idx != -1){
            lat = lat.substr(0, idx);
        }

        var idx = lat.indexOf("!");
        if(idx != -1){
            lat = lat.substr(0, idx);
        }
    }

    if(typeof lng == "string"){
        var idx = lng.indexOf(",");
        if(idx != -1){
            lng = lng.substr(0, idx);
        }

        var idx = lng.indexOf("!");
        if(idx != -1){
            lng = lng.substr(0, idx);
        }
    }

    map.panTo(new google.maps.LatLng(lat, lng));
}

/**
 * input 영어만 입력, 변환
 */
function inputOnlyEn(elem, isCanNumber) {
    if(isCanNumber) {
        elem.value = elem.value.replace(/[^\!-z\s0-9]/gi,"");
    }else{
        elem.value = elem.value.replace(/[0-9]|[^\!-z\s]/gi,"");
    }
}

function inputOnlyUpper(elem){
    elem.value = elem.value.toUpperCase();
}

function setInputComma(elem){
    var num01;
    var num02;
    num01 = elem.value;
    num02 = num01.removeComma();
    num01 = num02.comma();
    elem.value =  num01;
}

// elem1에 있는 value(file)를 elem2로 복사
function copyInputFileValue(elem1, elem2){
    if(elem1.type == "file" && elem2.type == "file"){
        var files = elem1.files;
        var dt = new DataTransfer();
        for(var i=0; i<files.length; i++) {
            var f = files[i];
            var file = new File(
                [f.slice(0, f.size, f.type)],
                f.name,
                {
                    type: f.type,
                }
            );
            dt.items.add(file);
        }
        elem2.files = dt.files;
    }
    
}

// Custom Pure Javascript converted from JQuery
class convertedFromJQuery {
    constructor() {
        this.dataTableCurrent = {
            page: 1,
            searchText: '',
            limit: 10,
        }

        this.dataTableData = {
            url: '',
            option: {}
        }

        // 데이터테이블 한글 버전
        this.defaultDataTableText = {
            "emptyTable": "데이터가 없습니다.",
            "lengthMenu": " 개씩 보기",
            "search": "검색",
            "zeroRecords": "검색된 데이터가 없습니다.",
        }

        this.initHash()
    }

    registerHashChange(callback) {
        callback()
        window.addEventListener('hashchange', e => {
            const newHash = e.newURL.split('#')
            if(newHash.length !== 2) {
                window.location.href = e.newURL
            } else {
                this.initHash(newHash[1])
                if(this.dataTableData.dataLengthSelect) {
                    this.dataTableData.dataLengthSelect.value = this.dataTableCurrent.limit
                }
                if(this.dataTableData.dataFilterInput) {
                    this.dataTableData.dataFilterInput.value = this.dataTableCurrent.searchText
                }
                callback()
            }
        })
    }

    initHash(locationHash = window.location.hash.replace('#', '')) {
        const getHistory = locationHash.split('|')

        for(const history of getHistory) {
            const splitKeyValue = history.split('=')
            if(splitKeyValue.length !== 2) continue
            switch(splitKeyValue[0]) {
                case 'page':
                    this.dataTableCurrent[splitKeyValue[0]] = parseInt(splitKeyValue[1])
                    break
                case 'searchText':
                    this.dataTableCurrent[splitKeyValue[0]] = decodeURIComponent(splitKeyValue[1])
                    break
                default:
                    this.dataTableCurrent[splitKeyValue[0]] = splitKeyValue[1]
                    break
            }
        }
    }

    setCurrentData(key = '', value = '') {
        if(!key || !value) return false
        if(key.length === 0 || value.length === 0) return false

        this.dataTableCurrent[key] = value
    }

    getCurrentData(key = '') {
        if(!key || key.length === 0) return Error('No key provided')

        return this.dataTableCurrent[key] ?? Error('No key existed')
    }

    removeCurrentData(key = '') {
        if(!key || key.length === 0) return Error('No key provided')

        delete this.dataTableCurrent[key]
    }

    convertDataToHash() {
        let newHash = ''
        for(const [key, value] of Object.entries(this.dataTableCurrent)) {
            let newValue = value
            if(key === 'searchText') {
                newValue = encodeURIComponent(value)
            }
            if(newHash === '') {
                newHash = `#${key}=${newValue}`
            } else {
                newHash = `${newHash}|${key}=${newValue}`
            }
        }
        return newHash
    }

    getPaginates(totalItems, currentPage, limit = 10, pageSize = 10) {
        let totalPages = Math.ceil(totalItems / limit)
    
        if(currentPage < 1) currentPage = 1
        if(currentPage > totalPages) currentPage = totalPages
    
        let startPage, endPage
        if(totalPages <= pageSize) {
            startPage = 1
            endPage = totalPages
        } else {
            let maxPagesBeforeCurrentPage = Math.floor(pageSize / 2)
            let maxPagesAfterCurrentPage = Math.ceil(pageSize / 2) - 1
            if (currentPage <= maxPagesBeforeCurrentPage) {
                startPage = 1
                endPage = pageSize
            } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
                startPage = totalPages - pageSize + 1
                endPage = totalPages
            } else {
                // current page somewhere in the middle
                startPage = currentPage - maxPagesBeforeCurrentPage
                endPage = currentPage + maxPagesAfterCurrentPage
            }
        }
    
        let startIndex = (currentPage - 1) * limit
        let endIndex = Math.min(startIndex + limit - 1, totalItems - 1)
    
        let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i)
    
        return {
            totalPages: totalPages,
            pages: pages
        }
    }

    /**
     * 페이지네이션 생성 기능들
     * 사용 등록시 registerPagination([1,2,...], 현재페이지, 페이지 숫자 클릭시 발생할 이벤트)
     * [1,2,...] 을 대신 해 getPaginates function 사용
     * 페이지 숫자 클릭시 발생할 이벤트는 event(page)로 콜백
     */
    paginate(type, currentPage = 1, totalPages = null) {
        switch(type) {
            case 'previous':
                currentPage --
                break
            case 'next':
                if((currentPage + 1) >= totalPages) {
                    currentPage = totalPages
                } else {
                    currentPage ++
                }
                break
            case 'page':
                currentPage = currentPage
                break
        }
        return currentPage
    }

    setPaginationDefault(type, currentPage, totalPages, callback) {
        const instance = this
        const li = document.createElement('li')
        li.classList.add('page-item')
    
        const link = document.createElement('a')
        link.classList.add('page-link')
    
        const span = document.createElement('span')
        span.setAttribute('aria-hidden', 'true')
        switch(type) {
            case 'previous':
                link.setAttribute('aria-label', 'Previous')
                if(currentPage <= 1) {
                    li.classList.add('disabled')
                } else {
                    link.addEventListener('click', function(e) {
                        const page = instance.paginate('previous', currentPage)
                        callback(page)
                    })
                }
                span.innerHTML = '&laquo;'
                break
            case 'next':
                link.setAttribute('aria-label', 'Next')
                if(currentPage >= totalPages) {
                    li.classList.add('disabled')
                } else {
                    link.addEventListener('click', function(e) {
                        const page = instance.paginate('next', currentPage, totalPages)
                        callback(page)
                    })
                }
                span.innerHTML = '&raquo;'
                break
        }
        link.appendChild(span)
        li.appendChild(link)
    
        return li
    }

    registerPagination(pager, currentPage, callback) {
        const instance = this
        const pagination = document.querySelector('.Page.navigation .pagination')
        pagination.innerHTML = ''
        pagination.appendChild(this.setPaginationDefault('previous', currentPage, pager.totalPages, callback))
        for(const item of pager.pages) {
            const li = document.createElement('li')
            li.classList.add('page-item')
    
            const link = document.createElement('a')
            link.classList.add('page-link')
            if(item === currentPage) {
                li.classList.add('active')
                link.classList.add('disabled')
            } else {
                link.addEventListener('click', function(e) {
                    const page = instance.paginate('page', item)
                    callback(page)
                })
            }
            link.innerText = item
            li.appendChild(link)
    
            pagination.appendChild(li)
        }
        pagination.appendChild(this.setPaginationDefault('next', currentPage, pager.totalPages, callback))
    }
    /**
     * 페이지네이션 생성 기능 끝
     */

    // Custom all check box
    setCheckAllBox() {
        document.querySelectorAll('#check-all-box').forEach(elem => {
            const children = document.querySelectorAll(`input.elem-check[data-type="${elem.getAttribute('data-type')}"]`)
            elem.addEventListener('change', function() {
                children.forEach(child => {
                    child.checked = elem.checked
                })
            })

            const childrenCheck = () => {
                if(elem.checked) {
                    elem.checked = false
                } else {
                    let isChecked = true
                    children.forEach(check => {
                        if(!check.checked) {
                            isChecked = false
                        }
                    })

                    if(isChecked) {
                        elem.checked = true
                    } else {
                        elem.checked = false
                    }
                }
            }

            // in case of individual selection, toggle all check box
            children.forEach((child, key) => {
                child.addEventListener('change', childrenCheck)
            })

            childrenCheck()
        })
    }

    // Custom datatable with pure javascript
    setDataTable(url, option) {
        if(this.isWorkingOn === true) return
        this.isWorkingOn = true
        window.location.hash = this.convertDataToHash()
        this.dataTableData.url = url
        this.dataTableData.option = option
        if(!option.request) option.request = {}
        if(!option.request.data) option.request.data = {}
        option.request.data = { ...option.request.data, ...this.dataTableCurrent }
        const langText = option.languages ?? {}
        const instance = this
        const selector = option.selector

        const setLoading = state => {
            const parent = selector.parentNode
            const loadingDiv = parent.querySelector('#datatable_loading')
            switch(state) {
                case 'start':
                    if(!loadingDiv) {
                        const newLoading = document.createElement('div')
                        newLoading.id = 'datatable_loading'
                        newLoading.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.5); display: flex; justify-content: center; align-items: center;'
                        newLoading.innerHTML = `
                            <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve" style="width: 100px; height: 100px;">
                                <path fill="#000" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                                <animateTransform 
                                    attributeName="transform" 
                                    attributeType="XML" 
                                    type="rotate"
                                    dur="1s" 
                                    from="0 50 50"
                                    to="360 50 50" 
                                    repeatCount="indefinite" />
                            </path>
                            </svg>
                        `
                        parent.insertAdjacentElement('afterbegin', newLoading)
                    }
                    break
                default:
                    if(loadingDiv) {
                        loadingDiv.remove()
                    }
                    break
            }
        }

        setLoading('start')
        yamon.fetch(url, option.request)
            .then(res => {
                if(res.status) {
                    let tbody = selector.querySelector('tbody')
                    if(!tbody) {
                        selector.appendChild(document.createElement('tbody'))
                        tbody = selector.querySelector('tbody')
                    }
    
                    const newTbody = document.createElement('tbody')
                    if(res.data.length <= 0) {
                        const newTr = document.createElement('tr')
                        let emptyText
                        if(this.dataTableCurrent.searchText === '') {
                            emptyText = langText.emptyTable ?? this.defaultDataTableText.emptyTable
                        } else {
                            emptyText = langText.zeroRecords ?? this.defaultDataTableText.zeroRecords
                        }
                        newTr.innerHTML = `
                            <td colspan="${option.table.length}">${emptyText}</td>
                        `
                        newTbody.appendChild(newTr)
                    }

                    const linkObject = {}

                    for(const [dataCurrent, list] of Object.entries(res.data)) {
                        const newTr = document.createElement('tr')

                        if(option.columnLink) {
                            let newLink = ''
                            if(option.columnLink.includes('#id#')) {
                                newLink = option.columnLink.replace('#id#', list.id)
                            }

                            linkObject[dataCurrent] = { link: newLink }
                        }

                        for(const [current, item] of Object.entries(option.table)) {
                            const newTd = document.createElement('td')
                            let rendered
                            if(item.data === null) {
                                rendered = item.render(list)
                            } else {
                                rendered = item.render(list[item.data])
                            }
                            newTd.innerHTML = rendered
                            newTr.appendChild(newTd)

                            if(option.columnLink && item.noLink) {
                                if(!linkObject[dataCurrent].noLink) linkObject[dataCurrent].noLink = []
                                linkObject[dataCurrent].noLink.push(current)
                            }
                        }
                        newTbody.appendChild(newTr)
                    }
                    tbody.innerHTML = newTbody.innerHTML

                    if(option.columnLink) {
                        const trs = tbody.querySelectorAll('tr')
    
                        for(let i = 0; i < trs.length; i ++) {
                            const tds = trs[i].querySelectorAll('td')
                            const linkObj = linkObject[i]
                            for(let num = 0; num < tds.length; num ++) {
                                if(linkObj.noLink.includes(num.toString())) continue
                                tds[num].addEventListener('click', e => {
                                    location.href = linkObj.link
                                })
                            }
                        }
                    }
    
                    const parent = selector.parentNode
    
                    // Initialise a select filter for limit length
                    if(!parent.querySelector('.dataTable_length')) {
                        const newDataLength = document.createElement('div')
                        newDataLength.style.cssText = 'float: left;'
                        newDataLength.classList.add('dataTable_length')
                        newDataLength.innerHTML = `
                            <label>
                                <select class="datatable_length-select border">
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>${langText.lengthMenu ?? this.defaultDataTableText.lengthMenu}
                            </label>
                        `
                        newDataLength.addEventListener('change', function(e) {
                            instance.dataTableCurrent.page = 1
                            instance.dataTableCurrent.limit = e.target.value
                            instance.setDataTable(url, option)
                        })
                        selector.insertAdjacentElement('beforebegin', newDataLength)

                        this.dataTableData.dataLengthSelect = parent.querySelector('.dataTable_length select.datatable_length-select')
                    }

                    // Initialise an input filter for text search
                    if(!parent.querySelector('.dataTable_filter')) {
                        const newDataFilter = document.createElement('div')
                        newDataFilter.classList.add('dataTable_filter')
                        newDataFilter.style.cssText = 'float: right;'
                        newDataFilter.innerHTML = `
                            <label class="d-flex">
                                <span class="mt-2 mr-1">${langText.search ?? this.defaultDataTableText.search} : </span>
                                <input type="search" class="datatable_filter-input border mr-1 ml-1" value="${this.dataTableCurrent.searchText ?? ''}">
                                <a class="btn ml-1"><i class="ri-search-line"></i></a>
                            </label>
                        `
                        const searchFunc = (elem) => {
                            instance.dataTableCurrent.page = 1
                            instance.dataTableCurrent.searchText = elem.value ?? ''
                            instance.setDataTable(url, option)
                        }
                        newDataFilter.querySelector('a').addEventListener('click', (e) => {
                            searchFunc(newDataFilter.querySelector('input'))
                        })
                        newDataFilter.querySelector('input').addEventListener('keyup', (e) => {
                            if(e.keyCode === 13) {
                                searchFunc(e.target)
                            }
                        })
                        selector.insertAdjacentElement('beforebegin', newDataFilter)

                        this.dataTableData.dataFilterInput = parent.querySelector('.dataTable_filter input.datatable_filter-input')
                    }

                    // Pagination
                    if(!parent.querySelector('.Page.navigation')) {
                        const newPageNavigation = document.createElement('nav')
                        newPageNavigation.classList.add(...['Page', 'navigation', 'mt-1'])
                        const newPagination = document.createElement('ul')
                        newPagination.classList.add(...['pagination', 'justify-content-center'])
                        newPageNavigation.appendChild(newPagination)
                        selector.after(newPageNavigation)
                    }
                    const dataTablePaginateCallback = (page) => {
                        this.dataTableCurrent.page = page
                        instance.setDataTable(instance.dataTableData.url, instance.dataTableData.option)
                    }
    
                    const pager = this.getPaginates(res.total, this.dataTableCurrent.page, res.limit)
                    this.registerPagination(pager, this.dataTableCurrent.page, dataTablePaginateCallback)
                } else {
                    yamon.alertResMessage(res)
                }
                setLoading('end')
            }).finally(() => {
                if(option.checkbox === true) {
                    this.setCheckAllBox()
                }
                this.isWorkingOn = false
            })
    }
}

yamon.custom = new convertedFromJQuery()

function allowInputNumber(event, elem, decimal = false) {
    const startPosition = elem.value.length - elem.selectionEnd
    elem.value = elem.value.comma(decimal);
    const len = Math.max(elem.value.length - startPosition, 0)
    elem.setSelectionRange(len, len)
}

function printEstimate(id) {
    fetch(`/ajax/excel/proposal/${id}?print=true`, {
        method: 'get'
    }).then(res => res.text())
    .then(res => {
        document.head.insertAdjacentHTML('beforeend', `
            <style id="printer-css">
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printer * {
                        visibility: visible;
                    }
                    #printer {
                        position: absolute;
                        left: 0;
                        top: 0;
                    }

                    #printer table .gridlines td { border: none !important }

                    #printer table tr.row0 td { text-align: right !important;border: none !important;width: 2480px; }
                }
            </style>`)
        document.body.insertAdjacentHTML('beforeend', '<div id="printer"></div>')
        const printer = document.querySelector('#printer')
        printer.innerHTML = res
        printer.querySelector("tr.row0 td").innerHTML = '<img src="/assets/image/estimate_excel_image.png">'
        for(let i = 24; i <= 46; i ++) {
            printer.querySelectorAll(`td.column${i}`).forEach(elem => elem.remove())
        }
        // for(let i = 32; i <= 37; i ++) {
        //     printer.querySelectorAll(`tr.row${i}`).forEach(elem => elem.remove())
        // }
        let printImageLength = 0
        const allImage = document.querySelectorAll('#printer img')
        allImage.forEach(elem => {
            elem.addEventListener('load', function() {
                printImageLength ++
                if(printImageLength >= allImage.length) {
                    window.print()
                }
            })
        })

        window.addEventListener('afterprint', e => {
            document.head.querySelector('#printer-css').remove()
            document.querySelector('#printer').innerHTML = ''
        })
    })
}