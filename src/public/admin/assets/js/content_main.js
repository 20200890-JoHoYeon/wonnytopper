let DT = null;

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
let category = [1, 2, 3, 4, 5, 6]; //풍선장식, 메시지토퍼, 삐에로/페이스페인팅, 클래스, 레터링풍선, 인쇄풍선
let sort = "DESC";
let exposure_yn = ["N", "Y"];

$(document).ready(function () {
    const today = dayjs();
    const formattedDate = today.format("YYYY-MM-DD");
    $("#from_date, #to_date").datepicker({
        dateFormat: "yyyy-mm-dd",
        format: "yyyy-mm-dd",
        autoclose: true,
        todayHighlight: true,
        placement: "bottom",
        orientation: "auto bottom",
    });
    $("#from_date, #to_date").datepicker("setDate", formattedDate);
    $("#from_date, #to_date").on("changeDate", function (event) {
        const startDate = new Date($("#from_date").val());
        const endDate = new Date($("#to_date").val());
        if (endDate < startDate) {
            $("#to_date").datepicker("setDate", startDate);
        }
    });

    DT = $("#dataTable").DataTable({
        info: false,
        language: lang,
        bFilter: false,
        ordering: false,
        lengthChange: false,
        paginate: false,
        columns: [
            { width: "10px" },
            { width: "10px" },
            { width: "20%" },
            null,
            { width: "20%" },
            { width: "10%" },
        ],
    });
    showListData();
    checkToken();

    $("#order_select").on("change", function () {
        sort = $(this).val();
        showListData();
    });

    //전체 체크
    $("#check_all").change(function () {
        $(".ck").prop("checked", $(this).prop("checked"));
    });

    //나머지 체크
    $(".ck").change(function () {
        if ($(".ck:checked").length === $(".ck").length) {
            $("#check_all").prop("checked", true);
        } else {
            $("#check_all").prop("checked", false);
        }
    });

    //테이블 전체 체크
    $("input[name=table_ck_all]").change(function () {
        $(".table-ck").prop("checked", $(this).prop("checked"));
    });

    $("#dataTable tbody").on("click", "tr.content-list", function () {
        if ($(event.target).is('input[type="checkbox"]')) {
            if ($(".table-ck:checked").length === curDataCount) {
                $("input[name=table_ck_all]").prop("checked", true);
            } else {
                $("input[name=table_ck_all]").prop("checked", false);
            }
            return;
        }
        const checkboxValue = $(this).find(".table-ck").val();
        const queryString = `?content_id=${checkboxValue}`;
        window.location.href = "/admin/content_detail" + queryString;
    });

    $("#search_btn").click(onClickSearch);
    $("#delete_btn").click(onClickDeleteBtn);
});

const changePage = (i) => {
    page = i > 0 ? i : i > -1 ? page + 1 : page + i;
    showListData();
};

const paginate = () => {
    pageCount = Math.ceil((allDataCount * 1.0) / pageSize);
    rangeCount = Math.ceil((pageCount * 1.0) / rangeSize);
    curRange = Math.floor((page - 1) / rangeSize) + 1;
    startPage = (curRange - 1) * rangeSize + 1;
    endPage = startPage + rangeSize - 1;
    if (endPage > pageCount) endPage = pageCount;

    const paginationContainer = document.querySelector(
        "#pagination_container .pagination"
    );
    let paginationHTML = "";
    for (let i = startPage; i <= endPage; i++) {
        let pageItemClass = "paginate_button page-item";
        if (i === page) pageItemClass += " active";

        paginationHTML += `<li class="${pageItemClass}"><a href="#" class="page-link" onclick="changePage(${i})">${i}</a></li>`;
    }

    let prevPageLinkHTML = `
      <li class="paginate_button page-item previous ${page === 1 ? "disabled" : ""
        }" id="dataTable_previous">
        <a href="#" onclick="changePage(-1)"  class="page-link" >
          <i class="fa fa-chevron-left"></i>
        </a>
      </li>
    `;
    let nextPageLinkHTML = `
      <li class="paginate_button page-item next ${page === pageCount ? "disabled" : ""
        }" id="dataTable_next">
        <a href="#" onclick="changePage(0)" class="page-link">
          <i class="fa fa-chevron-right"></i>
        </a>
      </li>
    `;
    paginationContainer.innerHTML =
        prevPageLinkHTML + paginationHTML + nextPageLinkHTML;

    const listInfoContainer = document.getElementById("list_info");
    listInfoContainer.innerHTML = `Showing ${startIndex} to ${startIndex + curDataCount - 1
        } of ${allDataCount} entriess`;
};

//검색 버튼 이벤트
const onClickSearch = (event) => {
    event.preventDefault();
    const checkboxes = document.querySelectorAll(
        '.filter-category input[type="checkbox"]:checked:not(#check_all)'
    );
    category = [];
    checkboxes.forEach(function (checkbox) {
        category.push(parseInt(checkbox.value));
    });
    const exposure_yn_radio = document.querySelector(
        'input[name="exposure_yn"]:checked'
    ).value;
    exposure_yn = exposure_yn_radio == "all" ? ["Y", "N"] : [exposure_yn_radio];
    search_word = document.getElementById("keyword").value;
    from_date = document.getElementById("from_date").value;
    to_date = document.getElementById("to_date").value;
    sort = "DESC";
    page = 1;
    showListData();
};

//리스트 조회
const showListData = async () => {
    const raw = JSON.stringify({
        from_date,
        to_date,
        category,
        search_word,
        sort,
        page,
        pageSize,
        exposure_yn,
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    try {
        const response = await fetch(`${host}/content/search`, requestOptions);
        const { code, message, data } = await response.json();
        if (code === 200) {
            DT.clear().draw();

            startIndex = (page - 1) * pageSize + 1;
            allDataCount = data.count;
            curDataCount = data.content.length;
            data.content.forEach(function (row, i) {
                const checkbox = $("<input>").attr({
                    type: "checkbox",
                    class: "content-ck table-ck",
                    value: row.content_id,
                    name: "idxArr[]",
                    id: "checkbox" + i,
                });

                DT.row
                    .add([
                        checkbox[0].outerHTML,
                        i + startIndex,
                        row.category === 1
                            ? `풍선 장식 > ${subCategoryDecode(row.category_m)}`
                            : categoryDecode(row.category),
                        row.title,
                        dayjs(row.reg_date).format("YYYY-MM-DD"),
                        row.exposure_yn,
                    ])
                    .node()
                    .classList.add("content-list");

                DT.draw(false);
            });
            paginate();
            return;
        }
    } catch (err) {
        //console.log('Err:', err);
    }
};

//컨텐츠 선택삭제
const onClickDeleteBtn = async () => {
    const checkboxes = document.querySelectorAll(
        '.content-table input[type="checkbox"]:checked:not(#check_all)'
    );
    if (checkboxes.length === 0) {
        alert("삭제할 컨텐츠를 선택해주세요.");
        return;
    }
    const delContents = [];
    checkboxes.forEach(function (checkbox) {
        delContents.push(parseInt(checkbox.value, 10));
    });

    const contentRaw = JSON.stringify({
        content_id: delContents,
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: contentRaw,
        redirect: "follow",
    };

    const result = window.confirm("삭제 하시겠습니까?");
    if (result) {
        try {
            const response = await fetch(`${host}/content/delete`, requestOptions);
            const { code, message } = await response.json();
            if (code === 200) {
                window.location.href = "/admin/content_main";
            } else {
                alert(message || "에러가 발생했습니다.");
            }
        } catch (err) {
            alert("에러가 발생했습니다.");
            //console.log("Err", err);
        }
    }
};

const checkToken = async () => {
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    try {
        const response = await fetch(`${host}/token/select/1`, requestOptions);
        const { code, message, data } = await response.json();
        if (code === 200) {
            const modDate = dayjs(data[data.length - 1].mod_date);
            const recoDate = modDate.add(40, "day").format("YYYY-MM-DD");
            const today = dayjs();
            const accessToken = data[0].token;

            if (today.isSameOrAfter(recoDate, "day")) {
                alert("인스타그램 추천 갱신일이 되어 자동으로 갱신합니다.");

                // # 토큰 갱신
                fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`)
                    .then(response => response.json())
                    .then(data => {
                        updatedToken = data.access_token;
                        const newTokenValue = updatedToken;
                        const updateTokenData = {
                            token: newTokenValue,
                            token_kind: 1
                        };

                        fetch("https://web.wonnytopper.co.kr/token/update", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(updateTokenData)
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.code === 200) {
                                    if (confirm("갱신이 완료되었습니다. 확인하시겠습니까?")) {
                                        document.location = "/admin/instagram_main";
                                    }
                                } else {
                                    alert('토큰 갱신 실패');
                                }
                            })
                            .catch(error => {
                                alert('토큰 갱신 실패');
                                //console.error('Error occurred:', error);
                            });
                    })
                    .catch(error => {
                        alert('토큰 갱신 실패');
                        //console.error('Error occurred:', error);
                    });
            }else{
                //console.log("안넘는날");
            }
        }
    } catch (err) {
        //console.log("Err:", err);
    }
}
