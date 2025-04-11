let fileId = [];
let originRegDateTime = null;
let selectDateTime = null;
const params = new URLSearchParams(window.location.search);
const content_id = params.get("content_id");
const fileInputElArr = document.getElementsByName("productImgArr[]");
const fileNameElArr = document.getElementsByClassName("file-name");
const cancelElArr = document.getElementsByClassName("cancel-btn");

$(document).ready(function () {
  $(".date-pick").datepicker({
    dateFormat: "yy-mm-dd",
    format: "yyyy-mm-dd",
    autoclose: true,
    todayHighlight: true,
    placement: "bottom",
    orientation: "auto bottom",
    templates: {
      leftArrow: '<i class="fa fa-angle-left"></i>',
      rightArrow: '<i class="fa fa-angle-right"></i>',
    },
    endDate: new Date(),
  });

  showContent();

  for (let i = 0; i < 24; i++) {
    let hour = i.toString().padStart(2, "0");
    $("#hour").append("<option value='" + hour + "'>" + hour + "</option>");
  }
  for (let i = 0; i < 60; i++) {
    let minute = i.toString().padStart(2, "0");
    $("#minute").append(
      "<option value='" + minute + "'>" + minute + "</option>"
    );
  }
  for (let i = 0; i < 60; i++) {
    let second = i.toString().padStart(2, "0");
    $("#second").append(
      "<option value='" + second + "'>" + second + "</option>"
    );
  }

  $("#start_date, #hour, #minute, #second").change(function () {
    const selectDate = $("#start_date").val();
    const selectHour = $("#hour").val();
    const selectMinute = $("#minute").val();
    const selectSecond = $("#second").val();

    selectDateTime = dayjs(
      selectDate + " " + selectHour + ":" + selectMinute + ":" + selectSecond
    );
    const nowTime = dayjs();
    if (selectDateTime.isAfter(nowTime)) {
      $("#start_date").val(originRegDateTime.format("YYYY-MM-DD"));
      $("#hour").val(originRegDateTime.format("HH"));
      $("#minute").val(originRegDateTime.format("mm"));
      $("#second").val(originRegDateTime.format("ss"));
      selectDateTime = originRegDateTime;
      alert("현재 시간 이후로는 선택이 불가능합니다");
    }
  });
  $("#start_date").blur(function () {
    $("#start_date").val(dayjs(selectDateTime).format("YYYY-MM-DD"));
  });

  Array.from(cancelElArr).forEach(function (cancelBtn, i) {
    fileInputElArr[i].addEventListener("change", function () {
      uploadFile(i);
    });
    cancelBtn.addEventListener("click", function () {
      fileInputElArr[i].value = "";
      fileId[i] = null;
      fileNameElArr[i].textContent = "";
      cancelBtn.style.display = "none";
      //deleteFile(fileId[i]);
    });
  });
  $("#category").change(function () {
    onChangeCategory($(this).val());
  });
});

const onClickCancleBtn = () => {
  if (confirm("수정을 취소하시겠습니까")) location.href = "/admin/content_main";
};

const fileButtonStyle = (i) => {
  const file = fileInputElArr[i].files[0];
  if (file != null) {
    const fileName = file.name;
    fileNameElArr[i].textContent = fileName;
    fileNameElArr[i].style.display = "inline";
    cancelElArr[i].style.display = "inline-block";
  } else {
    fileNameElArr[i].style.display = "none";
    cancelElArr[i].style.display = "none";
  }
};

//컨텐츠 조회
const showContent = async () => {
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    body: JSON.stringify({
      content_id,
    }),
    redirect: "follow",
  };

  try {
    const response = await fetch(`${host}/content/select/` + content_id);
    const { code, message, data } = await response.json();
    if (code === 200) {
      if (!data) {
        return;
      }

      const title = document.getElementById("title");
      const note = document.getElementById("note");
      const category = document.getElementById("category");
      const category_m = document.getElementById("sub_category");
      const contentId = document.getElementById("content_id");
      const regDate = document.querySelector("#start_date");
      const modDate = document.querySelector("#mod_date");
      const hour = document.getElementById("hour");
      const minute = document.getElementById("minute");
      const second = document.getElementById("second");

      contentId.textContent = content_id;
      title.value = data[0].title;
      note.value = data[0].note;
      fileId[0] = data[0].file_main_id;
      fileId[1] = data[0].file_1_id;
      fileId[2] = data[0].file_2_id;
      fileId[3] = data[0].file_3_id;
      fileId[4] = data[0].file_4_id;
      if (data[0].exposure_yn === "Y") {
        document.querySelector(".exposure.y").checked = true;
      } else {
        document.querySelector(".exposure.n").checked = true;
      }
      category.value = data[0].category;
      category_m.value = data[0].category_m;
      onChangeCategory(data[0].category);
      modDate.textContent = dayjs(data[0].mod_date).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      originRegDateTime = dayjs(data[0].reg_date);
      regDate.value = originRegDateTime.format("YYYY-MM-DD");
      selectDateTime = originRegDateTime.format("YYYY-MM-DD HH:mm:ss");
      hour.value = dayjs(data[0].reg_date).format("HH");
      minute.value = dayjs(data[0].reg_date).format("mm");
      second.value = dayjs(data[0].reg_date).format("ss");

      const filesName = [
        data[0].file_main_id_origin_name,
        data[0].file_1_id_origin_name,
        data[0].file_2_id_origin_name,
        data[0].file_3_id_origin_name,
        data[0].file_4_id_origin_name,
      ];
      filesName.forEach((name, i) => {
        if (!(name == null)) {
          fileNameElArr[i].textContent = name;
          fileNameElArr[i].style.display = "inline";
          cancelElArr[i].style.display = "inline-block";
        }
      });
    }
  } catch (err) {
    alert("에러가 발생했습니다.");
    //console.log("Err:", err);
  }
};

//파일 등록
const uploadFile = async (i) => {
  const file = fileInputElArr[i].files[0];
  if (file) {
    const fileSizeInBytes = file.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // 바이트를 메가바이트로 변환
    const maxSizeInMB = 3;
    if (fileSizeInMB > maxSizeInMB) {
      alert("파일 크기가 3MB를 초과하였습니다.");
      fileInputElArr[i].value = "";
      return;
    }
  }

  if (fileId[i] != null) {
    fileId[i] = null;
    //await deleteFile(fileId[i]);
  }

  fileButtonStyle(i);

  const formData = new FormData();
  formData.append("file", file);

  const requestOptions = {
    method: "POST",
    body: formData,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${host}/upload`, requestOptions);
    const { code, message, data } = await response.json();
    if (code === 200) {
      fileId[i] = data.file_id;
    } else {
      alert(message || "파일등록 오류");
    }
  } catch (err) {
    alert("에러가 발생했습니다.");
    //console.log('Err:', err);
  }
};

//컨텐츠 수정
const modContent = async () => {
  const title = document.getElementById("title").value;
  const note = document.getElementById("note").value;
  const category = parseInt(document.getElementById("category").value);
  const category_m = parseInt(document.getElementById("sub_category").value);
  const exposure_yn = document.querySelector(
    'input[name="exposure_yn"]:checked'
  ).value;
  if (
    !requireInput([
      category,
      category === 1 ? category_m : true,
      title,
      exposure_yn,
      selectDateTime,
      fileId[0],
    ])
  ) {
    return;
  }

  const raw = JSON.stringify({
    content_id,
    category,
    category_m,
    title,
    note,
    file_main_id: fileId[0],
    file_1_id: fileId[1],
    file_2_id: fileId[2],
    file_3_id: fileId[3],
    file_4_id: fileId[4],
    reg_date: dayjs(selectDateTime).format("YYYY-MM-DD HH:mm:ss"),
    exposure_yn,
  });

  const response = await fetch(`${host}/content/update`, {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  });

  const { code, message, data } = await response.json();
  if (code === 200) {
    alert("수정되었습니다.");
    window.location.href = "/admin/content_main";

    return;
  }
  alert(message);
};
