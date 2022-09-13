var nowPage = -1;
var form = document.getElementById("form-list");
var loading = document.getElementById("loading");
var listWrapper = document.getElementById("list-wrapper");
var pageWrapper = document.getElementById("page-wrapper");

var tempPage = document.getElementById("tmp-page").innerHTML;

var inputStartDate = document.getElementById("start-date");
var inputEndDate = document.getElementById("end-date");
/**
 * datepicker
 */
 $(function () {
	for (var i = 0; i < $(".datepicker").length; i++) {
		$(".datepicker").eq(i).datepicker({
			showOn: 'button',
			dateFormat: 'yy-mm-dd',
			buttonText: '<span class="material-icons">date_range</span>',
		});
	}
});

function onClickMonth(startDate, endDate){
	inputStartDate.value = startDate;
	inputEndDate.value = endDate;

	requestList();
}

// 파일 첨부
function attachFile(elem) {
	var fileName = elem.files[0].name;
	var fileNameWrapper = $(elem).siblings('.file-wrapper');
	var fileInputWrapper = $(elem).siblings('input[type=file]');
	if (elem.files[0].type != "application/pdf") {
		alert('pdf 파일만 첨부 가능합니다.');
		fileInputWrapper.val('');
		fileNameWrapper.text('첨부파일');
		return;
	}
	fileNameWrapper.text(fileName);
}