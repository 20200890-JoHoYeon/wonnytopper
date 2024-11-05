let DT = null;

let counsel_id = "";
let confirmAnswer = "";
let file_id = null;
let editing = false;
let confirmFileName = "";

//페이지네이션 
let page = 1;
let allDataCount = 0;
const rangeSize = 5;
const pageSize = 10;
let curDataCount = 0;
let startIndex = 1;

//검색
let from_date = null;
let to_date = null;
let search_word = "";
let purpose = [1, 2, 3, 4, 5, 6, 7, 8];
let sort = "DESC";
let answer_yn = ['N', 'Y'];

const fileNameElArr = document.getElementsByClassName("file-name");
const cancelElArr = document.getElementsByClassName("cancel-btn");
const fileInput = document.getElementById("file1");

$(document).ready(function () {
    const today = dayjs();
    const formattedDate = today.format('YYYY-MM-DD');
    $('#from_date, #to_date').datepicker({
        dateFormat: 'yyyy-mm-dd',
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true,
        placement: 'bottom',
        orientation: 'auto bottom',
    });
    $('#from_date, #to_date').datepicker('setDate', formattedDate);
    $('#from_date, #to_date').on('changeDate', function (event) {
        const startDate = new Date($('#from_date').val());
        const endDate = new Date($('#to_date').val());
        if (endDate < startDate) {
            $('#to_date').datepicker('setDate', startDate);
        }
    });

    DT = $('#dataTable').DataTable({
        info: false,
        language: lang,
        bFilter: false,
        ordering: false,
        lengthChange: false,
        paginate: false,
        columns: [
            { width: '10px' },
            { width: '10%' },
            { width: '15%' },
            { width: '15%' },
            null,
            { width: '10%' },
            { width: '10%' },
            { width: '10%' },
        ],
    });
    showListData();

    $('#order_select').on('change', function () {
        sort = $(this).val();
        showListData();
    });

    $('#check_all').change(function () {
        $('.ck').prop('checked', $(this).prop('checked'));
    });

    $('.ck').change(function () {
        if ($('.ck:checked').length === $('.ck').length) {
            $('#check_all').prop('checked', true);
        } else {
            $('#check_all').prop('checked', false);
        }
    });

    $('#dataTable tbody').on('click', '.content-list', function () {
        counsel_id = $(this).data('counsel-id');
        showCounselData();
    });

    $('.modal .close.consult').click(function () {
        if (confirm('답변 작성을 취소하시겠습니까?')) {
            resetModal("newAnswer");
            $('.modal').modal('hide');
        } else {
            return false;
        }
    });

    $('.modal .close.confirm').click(function () {
        if (confirm('입력된 내용이 전부 삭제됩니다. 진행하시겠습니까?')) {
            editing = false;
            resetModal("newAnswer");
            $('.modal').modal('hide');
        } else {
            return false;
        }
    });

    $(cancelElArr[0]).click(function () {
        fileInput.value = "";
        fileNameElArr[0].textContent = "";
        cancelElArr[0].style.display = "none";
        resetModal("delFile");
    });

    $('#search_btn').click(onClickSearch);
    $('#edit_btn').click(onClickEdit);
    $('#answer_btn').click(onClickAnswerConfirm);
    $('#register_answer_btn').click(registerAnswer);
    fileInput.addEventListener("change", function () { uploadFile() });
})

const changePage = (i) => {
    page = (i > 0) ? i : ((i > -1) ? page + 1 : page + i);
    showListData();
}

const paginate = () => {
    const paginationContainer = document.querySelector('#pagination_container .pagination');
    const listInfoContainer = document.getElementById('list_info');

    pageCount = Math.ceil(allDataCount * 1.0 / pageSize);
    rangeCount = Math.ceil(pageCount * 1.0 / rangeSize);
    curRange = Math.floor((page - 1) / rangeSize) + 1;
    startPage = (curRange - 1) * rangeSize + 1;
    endPage = startPage + rangeSize - 1;

    if (endPage > pageCount) endPage = pageCount;

    let paginationHTML = '';
    for (let i = startPage; i <= endPage; i++) {
        let pageItemClass = 'paginate_button page-item';
        if (i === page) pageItemClass += ' active';

        paginationHTML += `<li class="${pageItemClass}"><a href="#" class="page-link" onclick="changePage(${i})">${i}</a></li>`;
    }

    let prevPageLinkHTML = `
  <li class="paginate_button page-item previous ${page === 1 ? 'disabled' : ''}" id="dataTable_previous">
    <a href="#" onclick="changePage(-1)"  class="page-link" >
      <i class="fa fa-chevron-left"></i>
    </a>
  </li>
`;
    let nextPageLinkHTML = `
  <li class="paginate_button page-item next ${page === pageCount ? 'disabled' : ''}" id="dataTable_next">
    <a href="#" onclick="changePage(0)" class="page-link">
      <i class="fa fa-chevron-right"></i>
    </a>
  </li>
`;
    paginationContainer.innerHTML = prevPageLinkHTML + paginationHTML + nextPageLinkHTML;
    listInfoContainer.innerHTML = `Showing ${startIndex} to ${startIndex + curDataCount - 1} of ${allDataCount} entriess`;

}

const onClickSearch = (event) => {
    event.preventDefault();
    const checkboxes = document.querySelectorAll('.filter-purpose input[type="checkbox"]:checked:not(#check_all)');
    purpose = [];
    checkboxes.forEach(function (checkbox) {
        purpose.push(parseInt(checkbox.value));
    });
    const answer_yn_radio = document.querySelector('input[name="answer_yn"]:checked').value;
    answer_yn = answer_yn_radio == 'all' ? ["Y", "N"] : [answer_yn_radio];
    search_word = document.getElementById('keyword').value;
    from_date = document.getElementById('from_date').value;
    to_date = document.getElementById('to_date').value;
    sort = "DESC";
    page = 1;
    showListData();
}

//리스트 조회 
const showListData = async () => {
    const raw = JSON.stringify({
        from_date,
        to_date,
        purpose,
        search_word,
        sort,
        page,
        pageSize,
        answer_yn
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${host}/counsel/select`, requestOptions);
        const { code, message, data } = await response.json();
        if (code === 200) {
            DT.clear().draw();

            startIndex = ((page - 1) * pageSize) + 1;
            allDataCount = data.count;
            curDataCount = data.counsel.length;
            data.counsel.forEach(function (row, i) {
                const tr = DT.row.add([
                    i + startIndex,
                    row.name,
                    formatPhone(row.phone_num),
                    purposeDecode(row.purpose),
                    row.detail,
                    row.answer_yn,
                    row.answer_date ? dayjs(row.answer_date).format("YYYY-MM-DD") : "-",
                    dayjs(row.reg_date).format("YYYY-MM-DD"),
                ]).node();

                $(tr).attr('data-counsel-id', row.counsel_id);
                $(tr).addClass('content-list');
                $(tr).attr('data-toggle', 'modal');
                if (row.answer_yn === 'Y') {
                    $(tr).attr('data-target', '#consultDetailModal');
                } else if (row.answer_yn === 'N') {
                    $(tr).attr('data-target', '#consultModal');
                }
                DT.draw(false);

            });
            paginate();
            return;
        }
    } catch (err) {
        //console.log('Err:', err);
    }
}

//모달 상세 출력
const setModalData = (prefix, data) => {
    document.getElementById(`${prefix}-name`).innerHTML = data.name;
    document.getElementById(`${prefix}-phone`).innerHTML = formatPhone(data.phone_num);
    document.getElementById(`${prefix}-email`).innerHTML = data.email;
    document.getElementById(`${prefix}-location`).innerHTML = data.location;
    document.getElementById(`${prefix}-budget`).innerHTML = data.budget + "만원";
    document.getElementById(`${prefix}-purpose`).innerHTML = purposeDecode(data.purpose);
    document.getElementById(`${prefix}-counsel`).innerHTML = data.detail;
    document.getElementById(`${prefix}-reg-date`).innerHTML = dayjs(data.reg_date).format('YYYY-MM-DD HH:mm:ss');
    if (data.counsel_file_url != null) {
        document.getElementById(`${prefix}-nodata`).style.display = 'none';
        const modifiedLink = data.counsel_file_url.replace(/src[\/\\]public[\/\\]uploads[\/\\]/g, "/img/uploads/");//src/public/uploads,src/public/uploads ->  /img/uploads/file-1687966468886.png 
        document.getElementById(`${prefix}-relate-img`).src = modifiedLink;
        document.getElementById(`${prefix}-relate-content-td`).style.display = 'table-cell';
        document.getElementById(`${prefix}-relate-content`).innerHTML = data.content_title;
        document.getElementById(`${prefix}-relate-img-td`).style.display = 'table-cell';
        document.getElementById(`${prefix}-relate-img`).style.display = 'inline-block';
    } else {
        document.getElementById(`${prefix}-nodata`).style.display = 'table-cell';
        document.getElementById(`${prefix}-relate-img-td`).style.display = 'none';
        document.getElementById(`${prefix}-relate-content-td`).style.display = 'none';
        document.getElementById(`${prefix}-relate-content`).innerHTML = "-";
        document.getElementById(`${prefix}-relate-img`).style.display = 'none';
    }
};

const resetModal = (mode) => {
    if (mode) {
        if (mode === 'newAnswer') {
            document.getElementById('reqanswer-answer').value = "";
        }
        file_id = null;
        fileInput.value = "";
        confirmFileName = "";
    }
    fileButtonStyle();
}

//답변 모달 상세
const showCounselData = async () => {
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    try {
        const response = await fetch(`${host}/counsel/select/${counsel_id}`, requestOptions);
        const { code, message, data } = await response.json();
        if (code === 200) {
            if (data[0].answer_yn == 'Y') { //답변 등록 된 경우 
                setModalData('counsel', data[0]);
                document.getElementById('counsel-answer').innerHTML = data[0].answer_detail;
                document.getElementById('counsel-file').innerHTML = data[0].answer_file_origin_name !== null ? data[0].answer_file_origin_name : "-";
                document.getElementById('counsel-answer-reg-date').innerHTML = dayjs(data[0].answer_date).format('YYYY-MM-DD HH:mm:ss');

            } else if (data[0].answer_yn == 'N') { //답변 안된 경우   
                if (editing === true) { // 답변 등록 확인 모달 
                    setModalData('confirm-answer', data[0]);
                    document.getElementById('confirm-answer-answer').innerHTML = confirmAnswer;
                    document.getElementById('confirm-answer-file').innerHTML = confirmFileName.trim() === "" ? "-" : `${confirmFileName}`;
                } else { //답변 등록 모달
                    setModalData('reqanswer', data[0]);
                }
            }
        }
    } catch (err) {
        //console.log("Err:", err);
    }
}

//파일 삭제
const deletePreviousFile = async (fileId) => {
    const raw = JSON.stringify({
        file_id
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${host}/upload/deleteFile`, requestOptions);
        const { code, message } = await response.json();
        if (code === 200) {
            resetModal();
        }
    } catch (err) {
        //console.log("Err:", err);
    }
};

//파일 등록
const uploadFile = async () => {
    const file = fileInput.files[0];
    if (file) {
        const fileSizeInBytes = file.size;
        const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // 바이트를 메가바이트로 변환
        const maxSizeInMB = 3;
        if (fileSizeInMB > maxSizeInMB) {
            alert('파일 크기가 3MB를 초과하였습니다.');
            fileInput.value = '';
            return
        }
    }

    if (file_id) {
        await deletePreviousFile(file_id);
    }
    fileButtonStyle()

    const formData = new FormData();
    formData.append("file", file);

    const requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${host}/upload`, requestOptions);
        const { code, message, data } = await response.json();
        if (code === 200) {
            file_id = data.file_id;
            confirmFileName = file.name;
            fileButtonStyle();
        } else {
            alert(message || "파일등록 오류");
        }
    } catch (err) {
        //console.log('Err:', err);
    }
}


//답변 등록
const registerAnswer = async () => {
    const result = window.confirm("답변을 전송하시겠습니까?");
    if (result) {
        const raw = JSON.stringify({
            counsel_id,
            "detail": confirmAnswer,
            file_id,
            "email": document.getElementById('reqanswer-email').innerHTML
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${host}/counsel/insertAnswer`, requestOptions);
            const { code, message } = await response.json();
            if (code === 200) {
                alert("전송이 완료되었습니다.");
                $('#consultConfirmModal').modal('hide');
                resetModal("newAnswer");
                window.location.href = "/admin/consultation_main";
            } else {
                alert(message || "저장 실패");
            }
        } catch (err) {
            alert("저장 실패");
            //console.log('Err:', err);
        }
    }
}

const fileButtonStyle = () => {
    if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        fileNameElArr[0].textContent = fileName;
        fileNameElArr[0].style.display = "inline";
        cancelElArr[0].style.display = "inline-block";
    } else {
        fileNameElArr[0].style.display = "none";
        cancelElArr[0].style.display = "none";
    }

}

const onClickAnswerConfirm = () => {
    confirmAnswer = document.getElementById('reqanswer-answer').value;
    if (!validInput(confirmAnswer, regexDetail, "필수값을 입력해주세요.\n 국/영문, 숫자, 특수문자 10~1,000자")) {
        return
    };

    $('#consultModal').modal('hide');
    editing = true;
    $('#consultConfirmModal').modal('show');
    showCounselData();
}

const onClickEdit = () => {
    $('#consultConfirmModal').modal('hide');
    editing = false;
    $('#consultModal').modal('show');
    showCounselData();
}
