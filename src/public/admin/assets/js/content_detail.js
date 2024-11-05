const params = new URLSearchParams(window.location.search);
const id = params.get("content_id");

$(document).ready(function () {
  findContent();

  $("#to_board_btn").click(onClickCancleBtn);
  $("#update_btn").click(onClickUpdateBtn);
  $("#delete_btn").click(onClickDeleteBtn);
});

const onClickCancleBtn = () => {
  location.href = "/admin/content_main";
};

const onClickUpdateBtn = () => {
  location.href = `/admin/content_edit?content_id=${id}`;
};

//삭제
const onClickDeleteBtn = async () => {
  const raw = JSON.stringify({
    content_id: [id],
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
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

//상세 조회
const findContent = async () => {
  try {
    const response = await fetch(`${host}/content/select/` + id);
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
      const regDate = document.querySelector("#reg_date");
      const modDate = document.querySelector("#mod_date");
      const file = document.querySelector("#file_main_url");
      const file1 = document.querySelector("#file_1_url");
      const file2 = document.querySelector("#file_2_url");
      const file3 = document.querySelector("#file_3_url");
      const file4 = document.querySelector("#file_4_url");
      if (data[0].exposure_yn === "Y") {
        document.querySelector(".exposure.y").checked = true;
      } else {
        document.querySelector(".exposure.n").checked = true;
      }

      title.value = data[0].title;
      note.value = data[0].note;
      category.value = categoryDecode(data[0].category);
      category_m.value = subCategoryDecode(data[0].category_m);
      onChangeCategory(data[0].category);
      modDate.textContent = dayjs(data[0].mod_date).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      regDate.textContent = dayjs(data[0].reg_date).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      contentId.value = data[0].content_id;
      file.innerHTML = data[0].file_main_id_origin_name;
      file1.innerHTML = data[0].file_1_id_origin_name;
      file2.innerHTML = data[0].file_2_id_origin_name;
      file3.innerHTML = data[0].file_3_id_origin_name;
      file4.innerHTML = data[0].file_4_id_origin_name;
    }
  } catch (err) {
    //console.log("Err:", err);
  }
};
