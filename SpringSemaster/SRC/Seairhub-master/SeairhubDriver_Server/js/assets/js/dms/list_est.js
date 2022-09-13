var tempEst = document.getElementById("tmp-est").innerHTML;
var $previewRoot = $("#previewModal");
var $invoiceRoot = $("#invoiceModal");
var btnInvoiceShowEst = $invoiceRoot.find(".btn-show-est")[0];
var previewModalBody = document.querySelector("#previewModal .modal-body");
var paymentBtn = document.querySelector('button.owner-payment-btn');
var paymentLang = JSON.parse(paymentLang);
var inputHash;
let locationHash = window.location.hash.replace('#', '')
let isHashingChanged = false

var resDatas = {};

const pageData = {}

function eventListen() {
    inputHash = document.querySelector(`input[name='${yamon.form_token_name}']`);
    const getData = locationHash.split('|')
    for(const data of getData) {
        const splitKey = data.split('=')

        if(splitKey.length !== 2) continue

        pageData[splitKey[0]] = splitKey[0] === 'page' ? parseInt(splitKey[1]) : splitKey[1]
        switch(splitKey[0]) {
            case 'startDate':
                inputStartDate.value = splitKey[1]
                break
            case 'endDate':
                inputEndDate.value = splitKey[1]
                break
            case 'status':
                if(form.status) {
                    form.status.value = splitKey[1]
                }
                break
            case 'search':
                form.search.value = decodeURIComponent(splitKey[1])
                pageData[splitKey[0]] = decodeURIComponent(splitKey[1])
                break
            default:
                break
        }
    }

    if(!pageData.page || pageData.page <= 0) {
        pageData.page = 1
    }
    requestList(pageData.page);
}

document.addEventListener("DOMContentLoaded", eventListen);

window.addEventListener('hashchange', e => {
    locationHash = e.newURL.split('#')

    if(locationHash.length !== 2) {
        window.location.href = e.newURL
    } else {
        locationHash = locationHash[1]
    }

    isHashingChanged = true
    eventListen()
})

function setLocationHash() {
    let hashText = ''

    for(const [key, value] of Object.entries(pageData)) {
        if(hashText === '') {
            hashText = `#${key}=${value}`
        } else {
            hashText = `${hashText}|${key}=${value}`
        }
    }

    window.location.hash = hashText
}

function requestList(page) {
    if (typeof page == 'undefined') {
        page = 1;
    }

    var formData = new FormData(form);
    formData.append("page", page);
    if (type == "invoice") {
        if(status == "all") {
            formData.append("status", "trd");
        }else if(status == "pay") {
            formData.append("paymented", "1");
        }
    }

    pageData.page = page 
    pageData.startDate = inputStartDate.value
    pageData.endDate = inputEndDate.value
    pageData.status = form.status ? form.status.value : ''
    pageData.search = form.search.value

    if(!isHashingChanged) {
        setLocationHash()
    } else {
        isHashingChanged = false
    }

    yamon.fetch(type == 'invoice' ? "/ajax/invoice" : "/ajax/estimate", {
        method: "get",
        data: formData,
    }).then(function (res) {
        if (res.status) {
            var dataCnt = res.data_cnt;
            var dataLimit = res.data_limit;

            setPagination(pageWrapper, tempPage,page, dataCnt, dataLimit);

            // 견적 리스트 셋팅
            var estHTML = "";
            for (let i = 0; i < res.data.length; i++) {
                var est = res.data[i];
                // var cargoData = JSON.parse(est.cargo_data);
                
                var cargoData = est.cargo_data;
                var html = bindData(tempEst, "number", est.number);

                html = bindData(html, "id", est.id);
                html = bindData(html, "link", `/dms/deliveryBidDetail/${est.id}${urlSuffix}`);

                html = bindData(html, "start", est.start_continent + ', ' + est.start_country);
                html = bindData(html, "end", est.arrival_continent + ', ' + est.arrival_country);

                var basicTypeText = basicTypeLang[est.type];
                var deliveryTypeText = deliveryTypeLang[est.delivery_type];
                html = bindData(html, "type", basicTypeText);
                html = bindData(html, "delivery_type", deliveryTypeText);

                html = bindData(html, "title", cargoData[0].name);
                var title2 = "";
                if (cargoData.length > 1) {
                    title2 = messages.est_title.format(cargoData.length - 1);
                }
                html = bindData(html, "title2", title2);

                if (est.bl == null) {
                    html = bindData(html, "class_bl", "hidden");
                    html = bindData(html, "bl", "");
                } else {
                    html = bindData(html, "class_bl", "");
                    html = bindData(html, "bl", est.bl);
                }

                var incotermsText = est.incoterms;
                html = bindData(html, "incoterms", incotermsText);

                if(est.hasOwnProperty('user_company')) {
                    let company = ''
                    if(est.proposal_user_company) {
                        company = `/ ${est.proposal_user_company} ${est.proposal_user_name}`
                    }
                    html = bindData(html, "user", `${est.user_company} ${est.login_id} ${company}`);
                    html = bindData(html, "class_user", "");
                } else if(est.hasOwnProperty("login_id")){
                    html = bindData(html, "user", est.login_id);
                    html = bindData(html, "class_user", "");
                }else{
                    html = bindData(html, "user", "");
                    html = bindData(html, "class_user", "hidden");
                }

                var endDate = moment(est.end_dt.date);
                var now = moment();
                var isEnd = now > endDate;

                html = bindData(html, "end_date", endDate.format("YYYY-MM-DD"));

                if(est.status > 0){
                    html = bindData(html, "class_end_date", "hidden");
                    html = bindData(html, "class_end", "hidden");
                    html = bindData(html, "class_dday", "hidden");
                }else if (isEnd) {
                    html = bindData(html, "class_end_date", "");
                    html = bindData(html, "class_end", "");
                    html = bindData(html, "class_dday", "hidden");
                } else {
                    html = bindData(html, "class_end_date", "");
                    html = bindData(html, "class_end", "hidden");
                    var diff = endDate - now;
                    if (diff < 86400000 * 2) {
                        html = bindData(html, "class_dday", "");
                    } else {
                        html = bindData(html, "class_dday", "hidden");
                    }
                }

                var isOwner = est.is_owner == 1;
                var isAdmin = est.is_admin == 1;
                var statusText = statusLang[est.status];
                var statusClass = "";

                if(est.is_deleted == 1){
                    statusText = statusLang.cancel;
                    statusClass = "cancel";
                }else if(!isOwner && est.proposal_cnt > 0){
                    statusText = statusLang.proposal_complete;
                }
                html = bindData(html, "status", statusText);
                html = bindData(html, "status_class", statusClass);

                var buttonHtml = "";
                // var isSelected = est.is_selected == 1;

                if(est.is_deleted != 1){
                    if (status != "pay") {
                        switch (parseInt(est.status)) {
                            case -1:
                                // 정회원 대기
                                break;
                            case 0:
                                // 견적요청
                                if (isEnd) break;

                                var button = document.createElement("button");
                                button.type = 'button';
                                if (isOwner) {
                                    button.setAttribute("onclick", `event.stopPropagation();location.href = '${buttonLang.proposal_list.link}/${est.id}${urlSuffix}'`);
                                    var inner = buttonLang.proposal_list.text;
                                    var cnt = document.createElement("span");
                                    cnt.classList.add("count");
                                    cnt.innerText = est.proposal_cnt;
                                    button.innerHTML = inner + cnt.outerHTML;
                                    buttonHtml += button.outerHTML;

                                    if(est.proposal_cnt == 0){
                                        // 수정버튼
                                        var button = document.createElement("button");
                                        button.type = 'button';
                                        button.setAttribute("onclick", `event.stopPropagation();location.href = '${buttonLang.edit.link}/${est.id}${urlSuffix}'`);
                                        button.innerHTML = buttonLang.edit.text;
                                        buttonHtml += button.outerHTML; 
                                    }
                                } else { 
                                    button.setAttribute("onclick", `event.stopPropagation();location.href = '${buttonLang.proposal.link}/${est.id}${urlSuffix}'`);
                                    button.innerHTML = buttonLang.proposal.text;
                                    buttonHtml += button.outerHTML;

                                    if (est.proposal_cnt > 0) {
                                        button.setAttribute("onclick", `event.stopPropagation();location.href = '${buttonLang.proposal_list.link}/${est.id}${urlSuffix}'`);
                                        var cnt = document.createElement("span");
                                        cnt.classList.add("count");
                                        cnt.innerText = est.proposal_cnt;
                                        button.innerHTML = buttonLang.proposed.text + cnt.outerHTML;
                                        buttonHtml += button.outerHTML;
                                    }
                                }
                                break;
                            case 1: // 사전입력
                            case 2: // 서류작성
                                // 견적서버튼
                                var button = document.createElement("button");
                                button.type = 'button';

                                if(est.estimate_invoice_id == 0 && est.is_owner == 1 && !isAdmin){
                                        button.setAttribute("onclick", `event.stopPropagation();${type == 'invoice' ? `location.href="${buttonLang.invoice_detail.link}/${est.id}${urlSuffix}"` : `showEstimate(${est.estimate_proposal_id})`}`);
                                }else{
                                    button.setAttribute("onclick", `event.stopPropagation();${type == 'invoice' ? `location.href="${buttonLang.invoice_detail.link}/${est.id}${urlSuffix}"` : `openAttachDoc(this, ${est.id}, ${est.estimate_proposal_id})`}`);
                                    if (type != 'invoice') {
                                        resDatas[est.id] = est;
                                    }
                                }
                                if(type === 'invoice') {
                                    button.innerHTML = buttonLang.invoice_detail.text;
                                } else {
                                    button.innerHTML = buttonLang.detail.text;
                                }
                                buttonHtml += button.outerHTML;

                                // 서류작성버튼
                                var button = document.createElement("button");
                                button.type = 'button';
                                button.setAttribute("onclick", `event.stopPropagation();location.href = '${buttonLang.document_write.link}/${est.id}${urlSuffix}'`);
                                button.innerHTML = buttonLang.document.text.write;
                                buttonHtml += button.outerHTML;

                                // 결제 상태
                                var button = document.createElement("button");
                                button.type = 'button';
                                if (est.paymentStatus < completePay) {
                                    button.setAttribute("onclick", `event.stopPropagation();`);
                                    button.setAttribute("class", "dis-btn");
                                    button.innerHTML = buttonLang.pay_wait.text;
                                    buttonHtml += button.outerHTML;
                                }else if (est.paymentStatus >= completePay) {
                                    button.setAttribute("onclick", `event.stopPropagation();`);
                                    button.setAttribute("class", "dis-btn");
                                    button.innerHTML = buttonLang.pay_complete.text;
                                    buttonHtml += button.outerHTML;
                                }

                                if(!isOwner){
                                    // 취소
                                    var button = document.createElement("button");
                                    button.type = 'button';
                                    button.setAttribute("onclick", `event.stopPropagation();cancelEstimate(this, ${est.id})`);
                                    button.innerHTML = buttonLang.cancel.text;
                                    buttonHtml += button.outerHTML;
                                }

                                break;
                            case 3: // 배송중
                            case 4: // 배송완료
                            case 5: // 거래완료
                                var button = document.createElement("button");
                                button.type = 'button';
                                if(est.estimate_invoice_id == 0 && !isAdmin){
                                    button.setAttribute("onclick", `event.stopPropagation();showEstimate(${est.estimate_proposal_id})`);
                                }else{
                                    button.setAttribute("onclick", `event.stopPropagation();openAttachDoc(this, ${est.id}, ${est.estimate_proposal_id})`);
                                    resDatas[est.id] = est;
                                }
                                button.innerHTML = buttonLang.detail.text;
                                buttonHtml += button.outerHTML;

                                var button = document.createElement("button");
                                button.type = 'button';
                                var link = `${buttonLang.document.link}/${est.id}${urlSuffix}`;
                                button.setAttribute("onclick", `event.stopPropagation();location.href = '${link}'`);
                                button.innerHTML = est.status >= 3 ? buttonLang.document.text.look : buttonLang.document.text.write;
                                buttonHtml += button.outerHTML;

                                if (est.status >= 3) {
                                    var button = document.createElement("button");
                                    button.type = 'button';
                                    button.setAttribute("onclick", `event.stopPropagation();location.href = '${buttonLang.delivery.link}/${est.id}${urlSuffix}'`);
                                    button.innerHTML = buttonLang.delivery.text;
                                    buttonHtml += button.outerHTML;
                                }

                                // 결제 상태
                                if(est.paymentStatus >= completePay){
                                    button.setAttribute("onclick", `event.stopPropagation();`);
                                    button.setAttribute("class", "dis-btn");
                                    button.innerHTML = buttonLang.pay_complete.text;
                                    buttonHtml += button.outerHTML;
                                }

                                //평점등록
                                if (est.status >= 4 && isShowRate === true) {
                                    var button = document.createElement("button");
                                    button.type = 'button';
                                    button.classList.add("rating-btn")
                                    if(est.isRated) {
                                        button.setAttribute("onclick", `event.stopPropagation();`);
                                        button.classList.add("dis-btn");
                                    } else {
                                        button.setAttribute("onclick", `event.stopPropagation();showRatingModal(${est.id}, '${cargoData[0].name}', '${title2}');`);
                                    }
                                    button.innerHTML = buttonLang.add_rating.text;
                                    buttonHtml += button.outerHTML;
                                }
                                break;
                        }

                        if(isOwner){
                            var button = document.createElement("button");
                            button.type = 'button';
                            button.setAttribute("onclick", `event.stopPropagation();location.href = '${buttonLang.copy.link}/${est.id}/copy'`);
                            button.innerHTML = buttonLang.copy.text;
                            buttonHtml += button.outerHTML; 
                        }
                    }else {
                        var button = document.createElement("button");
                        button.type = 'button';

                        button.setAttribute("onclick", `event.stopPropagation();location.href = '${buttonLang.pay_info.link}/${est.id}${urlSuffix}'`);
                        button.innerHTML = buttonLang.pay_info.text;
                        buttonHtml += button.outerHTML;
                    }
                }
                
                html = bindData(html, "buttons", buttonHtml);

                estHTML += html;
            }
            listWrapper.innerHTML = estHTML;
            nowPage = page;
        } else {
            var message = res.message;
            if(res.hasOwnProperty("err_code")){
                if(res.hasOwnProperty("err_code_sub")){
                    message += `[${res.err_code}-${res.err_code_sub}]`
                }else{
                    message += `[${res.err_code}]`
                }
            }
            alert(message);
        }
    });
}

var ratingModalTitle = document.querySelector(".modal-body .rating-title span:nth-child(1)");
var ratingModalNumber = document.querySelector(".modal-body .rating-title span:nth-child(2)");
var ratingEstimateId = document.querySelector("#rating-estimate-id");
function showRatingModal(id, title, title2){
    ratingEstimateId.value = id;
    ratingModalTitle.innerText = title;
    ratingModalNumber.innerText = title2;
    resetRating();
    $("#ratingModal").modal("show");
}

function modalChangePackageType(elem){
    var value = elem.value;
    var $root = $(elem).parents(".packing-list");
    var root = $root[0];
    $root.removeClass("other");
    var alterName = "";
    if(root.classList.contains('basic-packing')) {
        alterName = "basic_";
    }
    root.querySelectorAll('select, input').forEach(el => {
        if(el.getAttribute('type') !== 'hidden') {
            el.classList.remove('validation-check');
        }
    });

    var removeElems = [];

    if(parseInt(root.querySelector('input#this_delivery_type').value) === cargoContainerType) {
        root.classList.add("container");
        removeElems = root.querySelectorAll(".type-small");
    }else{
        root.classList.add("small");
        removeElems = root.querySelectorAll(".type-container");
    }
    
    if(removeElems){
        removeElems.forEach(element => {
            element.classList.add("hidden");
        });
    }

    if(value.indexOf("reefer") !== -1){
        $root.removeClass("hide-temp");
        root.querySelector("[name='" + alterName + "package_quantity[]']").dataset.validation = "required";
        root.querySelector("[name='" + alterName + "package_quantity[]']").classList.add('validation-check');
        root.querySelector("[name='" + alterName + "package_temperature_max[]']").dataset.validation = "required";
        root.querySelector("[name='" + alterName + "package_temperature_max[]']").classList.add('validation-check');
        root.querySelector("[name='" + alterName + "package_temperature_min[]']").dataset.validation = "required";
        root.querySelector("[name='" + alterName + "package_temperature_min[]']").classList.add('validation-check');
        root.querySelector("[name='" + alterName + "package_value[]']").dataset.validation = "";
    }else if(value.indexOf("other") !== -1){
        $root.addClass("hide-temp");
        $root.addClass("other");
        $root.find(".temp-wrapper input").val("");
        root.querySelector("[name='" + alterName + "package_quantity[]']").dataset.validation = "";
        root.querySelector("[name='" + alterName + "package_temperature_max[]']").dataset.validation = "";
        root.querySelector("[name='" + alterName + "package_temperature_min[]']").dataset.validation = "";
        root.querySelector("[name='" + alterName + "package_value[]']").dataset.validation = "required";
        root.querySelector("[name='" + alterName + "package_value[]']").classList.add('validation-check');
    }else{
        $root.addClass("hide-temp");
        $root.find(".temp-wrapper input").val("");
        root.querySelector("[name='" + alterName + "package_quantity[]']").dataset.validation = "required";
        root.querySelector("[name='" + alterName + "package_quantity[]']").classList.add('validation-check');
        root.querySelector("[name='" + alterName + "package_temperature_max[]']").dataset.validation = "";
        root.querySelector("[name='" + alterName + "package_temperature_min[]']").dataset.validation = "";
    }
}

function showEstimate(id){
    if($previewRoot.data("est-index") == id){
        $previewRoot.modal("show");
        return;
    }


    var formData = new FormData();
    formData.append(yamon.form_token_name, document.querySelector(`[name=${yamon.form_token_name}]`).value);

    yamon.fetch("/ajax/html/proposal/" + id, {
        method: "post",
        data: formData
    }).then(function(res){
        if(res.status){
            $previewRoot.data("est-index", id);
            previewModalBody.innerHTML = res.data;
            previewModalBody.querySelectorAll('input#this_package_type').forEach(elem => {
                modalChangePackageType(elem)
            })
            $previewRoot.modal("show");
        }else{
            var message = res.message;
            if(res.hasOwnProperty("err_code")){
                if(res.hasOwnProperty("err_code_sub")){
                    message += `[${res.err_code}-${res.err_code_sub}]`
                }else{
                    message += `[${res.err_code}]`
                }
            }
            alert(message);
        }
    });
}

// (포워더)서류첨부 모달 open
function openAttachDoc(elem, id = false, proposalId) {
    var dataList;
    if(resDatas.hasOwnProperty(id)){
        dataList = resDatas[id];
    }else{
        alert(messages.server_error);
        return;
    }
    var isAttach = document.querySelector('#invoiceModal .is-attach');
    var notAttach = document.querySelector('#invoiceModal .not-attach');
    var ownerPayBtn = document.querySelector('#invoiceModal .owner-payment-btn');
    var forwarderWrapper = document.querySelector('#invoiceModal .forwarder-wrapper');
    var ownerWrapper = document.querySelector('#invoiceModal .owner-wrapper');
    var priceWrapper = document.querySelector('#invoiceModal .owner-price');
    var pdfWrapper = document.querySelector('#invoiceModal .pdf-wrapper');
    var btnDelete = document.querySelector('#invoiceModal .btn-delete');

    btnInvoiceShowEst.setAttribute("onclick", `showEstimate(${proposalId})`);

    if (dataList.estimate_invoice_id == 0) {    // 포워더가 견적서, 가격 등록은 안함
        if (dataList.is_owner == 1 && dataList.is_admin == 0) {   // 화주
            forwarderWrapper.classList.add('hidden');
            ownerWrapper.classList.remove('hidden');
            isAttach.classList.add('hidden');
            notAttach.classList.remove('hidden');
        } else { // 포워더
            forwarderWrapper.classList.remove('hidden');
            ownerWrapper.classList.add('hidden');
            isAttach.classList.add('hidden');
            notAttach.classList.add('hidden');
            $invoiceRoot.find('.payment-btn').attr('data-id', id);
        }

        ownerPayBtn.classList.add('hidden');
    } else {
        forwarderWrapper.classList.add('hidden');
        ownerWrapper.classList.remove('hidden');
        pdfWrapper.setAttribute('src', dataList.estimate_invoice_file);
        priceWrapper.value = parseFloat(dataList.estimate_invoice_price).toLocaleString();
        isAttach.classList.remove('hidden');
        notAttach.classList.add('hidden');
        ownerPayBtn.classList.add('hidden');
        if (dataList.is_owner == 1) {
            $invoiceRoot.find('.owner-payment-btn').attr('data-id', id);

            if (dataList.paymentStatus != 2) {
                ownerPayBtn.classList.remove('hidden');
            }
        }
    }

    if(dataList.is_admin == 0 || dataList.paymentStatus == 2){
        btnDelete.classList.add('hidden');
    }else{
        btnDelete.classList.remove('hidden');
        btnDelete.dataset.id = dataList.estimate_invoice_id;
    }

    $invoiceRoot.modal('show');
}

// 인보이스 견적서 삭제
function deleteInvoice(elem){
    var confm = confirm("삭제하시겠습니까?");

    if(confm){
        var id = elem.dataset.id;
        var data = {
            _method: "delete",
        };
    
        data[yamon.form_token_name] = yamon.getNowHash();
    
        yamon.fetch("/ajax/admin/invoice/" + id, {
            method: "post",
            data: data,
        }).then(function(res){
            if(res.status){
                location.reload();
            }else{
                yamon.alertResMessage(res);
            }
        });
    }
}

// (포워더)서류첨부 및 금액 제안
var invoiceModalValidation = document.querySelectorAll("#invoiceModal .validation-check");
function attachDocFilePrice(elem) {
    if(!yamon.validation(invoiceModalValidation)) return;

    var id = elem.getAttribute('data-id');
    var formData = new FormData(document.getElementById('invoice-form'));

    // var list = document.querySelectorAll(".validation-check:not(disabled)");
    // if(!yamon.validation(list)) return;

    formData.append(yamon.form_token_name, document.querySelector(`[name=${yamon.form_token_name}]`).value);
    formData.append('_method', 'put');

    if(confirm("확인 시 입력 금액으로 확정되어 수정이 불가능 합니다. 계속 하시겠습니까?")){
        yamon.fetch("/ajax/invoice/" + id, {
            method: "post",
            data: formData
        }).then(function(res){
            if(res.status){
                location.reload();
            }else{
                var message = res.message;
                if(res.hasOwnProperty("err_code")){
                    if(res.hasOwnProperty("err_code_sub")){
                        message += `[${res.err_code}-${res.err_code_sub}]`
                    }else{
                        message += `[${res.err_code}]`
                    }
                }
                alert(message);
            }
        });
    }
}


paymentBtn.addEventListener('click', function() {
    var estimateId = parseInt(paymentBtn.getAttribute('data-id'));
    var paymentType = "invoice";
    var formData = new FormData();
    formData.append('id', estimateId);
    formData.append(yamon.form_token_name, document.querySelector(`[name=${yamon.form_token_name}]`).value);

    yamon.fetch("/ajax/invoice", {
        method: "post",
        data: formData,
    })
    .then(data => {
        if(data.status){
            BootPay.request({
                price: data.price,
                application_id: appId,
                name: invoicePaymentName,
                pg: 'inicis',
                method: 'card', 
                show_agree_window: 0,
                items: [
                    {
                        item_name: invoicePaymentName,
                        qty: 1,
                        unique: invoicePaymentName, 
                        price: data.price,
                    }
                ],
                order_id: paymentType +'_' + new Date().yyyymmddhhmmss(),
                params: {type: paymentType, id: data.payment_id},
            }).error(function (data) {
                //결제 진행시 에러가 발생하면 수행됩니다.
                console.log(data);
                alert(message.server_error);
            }).cancel(function (data) {
                //결제가 취소되면 수행됩니다.
                console.log(data);
            }).ready(function (data) {
                console.log(data);
            }).confirm(function (data) {
                console.log(data);
                BootPay.transactionConfirm(data);
            }).close(function (data) {
                // 결제창이 닫힐때 수행됩니다. (성공,실패,취소에 상관없이 모두 수행됨)
                console.log(data);
            }).done(function (data) {
                data[yamon.form_token_name] = inputHash.value;
                yamon.fetch("/ajax/payment/complete", {
                    method: "post",
                    data: data,
                }).then(function(res){
                    if(res.status){
                        location.reload();
                    }else{
                        var message = res.message;
                        if(res.hasOwnProperty("err_code")){
                            if(res.hasOwnProperty("err_code_sub")){
                                message += `[${res.err_code}-${res.err_code_sub}]`
                            }else{
                                message += `[${res.err_code}]`
                            }
                        }
                        alert(message);
                    }
                });
            });
        }else{
            alert(data.message);
        }
    });
});

function cancelEstimate(elem, estimateId){
    var confm = confirm(commonLang.cancel_question);

    if(confm){
        elem.disabled = true;
        var data = {
            "_method": "delete"
        };
        data[yamon.form_token_name] = yamon.getNowHash();

        yamon.fetch("/ajax/estimate/"+estimateId, {
            method: "post",
            data: data,
        }).then(function(res){
            elem.disabled = false;
            if(res.status){
                alert(messages.complete);
                location.href = "/dms/list/est/cancel";
            }else{
                yamon.alertResMessage(res);
            }
        }).catch(function(err){
            console.log(err);
            elem.disabled = false;
        })
    }
}
