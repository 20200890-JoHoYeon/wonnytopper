//const host = 'https://web.wonnytopper.co.kr'; //서버
const host = ""; //로컬
const lang = {
  decimal: "",
  emptyTable: "데이터가 없습니다.",
  thousands: ",",
  zeroRecords: "검색된 데이터가 없습니다.",
};

$(document).ready(function () {
  const currentPathname = window.location.pathname;
  const navBtnArr = document.querySelectorAll(".nav-arrow-btn");
  const logoBtn = document.getElementById("logo_btn");
  const contentBtn = document.getElementById("content_page_btn");
  const counselBtn = document.getElementById("counsel_page_btn");
  const instaBtn = document.getElementById("insta_page_btn");
  const nameText = document.getElementById("name-text");
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      onClickLnb(event, "/user/logout");
    });
  }

  if (sessionStorage.getItem("username")) {
    const userName = sessionStorage.getItem("username");
    const userId = sessionStorage.getItem("userid");
    if (nameText) {
      nameText.innerHTML = `${userId} ${userName}님 로그아웃`;
    }
  }

  if (navBtnArr[0]) {
    if (currentPathname.includes("content")) {
      navBtnArr[1].style.display = "none";
      navBtnArr[2].style.display = "none";
    } else if (currentPathname.includes("consultation")) {
      navBtnArr[0].style.display = "none";
      navBtnArr[2].style.display = "none";
    } else if (currentPathname.includes("instagram")) {
      navBtnArr[0].style.display = "none";
      navBtnArr[1].style.display = "none";
    }
  }

  if (logoBtn) {
    logoBtn.addEventListener("click", function () {
      onClickLnb(event, "/admin/content_main");
    });
  }
  if (contentBtn) {
    contentBtn.addEventListener("click", function (event) {
      event.preventDefault();
      onClickLnb(event, "/admin/content_main");
    });
  }
  if (counselBtn) {
    counselBtn.addEventListener("click", function (event) {
      event.preventDefault();
      onClickLnb(event, "/admin/consultation_main");
    });
  }
  if (instaBtn) {
    instaBtn.addEventListener("click", function (event) {
      event.preventDefault();
      onClickLnb(event, "/admin/instagram_main");
    });
  }
});

const formatPhone = (origin) => {
  return `${origin.slice(0, 3)}-${origin.slice(3, 7)}-${origin.slice(7)}`;
};

const regexDetail = /^[\s\S]{10,1000}$/; // 국/영문, 숫자, 특수문자 최대 10~1,000자
const regexTitle = /^[^\p{C}]{1,30}$/u;
const regexNote = /^[^\p{C}]{0,300}$/u;
const regexId = /^[a-zA-Z0-9]{4,10}$/;
const regexPwd = /^[\w!@#$%^&*()-+=~]{4,16}$/;

const validInput = (data, rgx, text) => {
  if (!rgx.test(data)) {
    alert(text);
    return false;
  }
  return true;
};

const requireInput = (inputs) => {
  for (const input of inputs) {
    if (
      !input ||
      (typeof input === "string" && input.trim() === "") ||
      (input instanceof File && !input.name)
    ) {
      alert("필수값이 입력되지 않았습니다.");
      return false;
    }
  }
  return true;
};

const categoryDecode = (code) => {
  const category = [
    "풍선 장식",
    "메세지 토퍼",
    "삐에로/페이스페인팅",
    "클래스",
    "레터링 풍선",
    "인쇄 풍선",
  ];
  return category[code - 1] || "";
};

const subCategoryDecode = (code) => {
  const category = ["입학식/졸업식", "풍선장식", "기업행사", "입구풍선아치"];
  return category[code - 1] || "";
};

const purposeDecode = (code) => {
  const purposes = [
    "풍선 장식",
    "메세지 토퍼",
    "부스체험(토퍼,풍선)",
    "삐에로",
    "페이스페인팅",
    "클래스",
    "레터링 풍선",
    "인쇄 풍선",
  ];
  return purposes[code - 1] || "";
};

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

//파일 삭제
const deleteFile = async (file_id) => {
  const raw = JSON.stringify({
    file_id,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${host}/upload/deleteFile`, requestOptions);
    const { code, message } = await response.json();
    if (code === 200) {
    } else {
    }
  } catch (err) {
    //console.log("Err:", err);
  }
};

const onClickLnb = (event, url) => {
  event.preventDefault();

  const currentPage = window.location.pathname;
  const targetUrl = ["/admin/content_register", "/admin/content_edit"];

  let shouldLogout = true;

  if (currentPage === targetUrl[0] || currentPage === targetUrl[1]) {
    if (confirm("등록을 취소하시겠습니까?")) {
      shouldLogout = true;
    } else {
      shouldLogout = false;
    }
  }
  if (shouldLogout) {
    window.location.href = url;
  }
};

const onChangeCategory = (val) => {
  const subCategoryEl = $(".sub-category-tr");
  const subSelectValue = $("#sub_category");

  if (parseInt(val) === 1) {
    subCategoryEl.removeClass("hidden");
  } else {
    subCategoryEl.addClass("hidden");
    subSelectValue.val("");
  }
};

/*
const showInstaDate = async (page) => {
  const modDate = dayjs(data[data.length - 1].mod_date);
  const recoDate = modDate.add(40, "day").format("YYYY-MM-DD");
  const today = dayjs();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  try {
    const response = await fetch(`${host}/token/select/1`, requestOptions);
    const { code, message, data } = await response.json();
    console.log(code);
    if (code === 200) {

      const accessToken = data.data[0].token;
      console.log("조회성공");
      switch (page) {
        case "update":
          return accessToken;
        case "check":
          return today.isSameOrAfter(recoDate, "day");
        case "show":
          console.log(modDate.format("YYYY-MM-DD HH:mm:ss"));
          return { modDate: modDate.format("YYYY-MM-DD HH:mm:ss"), recoDate, check: today.isSameOrAfter(recoDate, "day") };
        default:
          return true;
      }
    } else {
      return false;

    }
  } catch (err) {

    //console.log(err);
    return false;
  }
};
*/
/*
const instaTokenUpdate = async () => {
 
  /*
  if (accessToken) {
    fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        updatedToken = data.access_token;

        const newTokenValue = updatedToken;
        const updateTokenData = {
          token: newTokenValue,
          token_kind: 1,
        };

        fetch("https://web.wonnytopper.co.kr/token/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateTokenData),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) {
              alert("갱신이 완료되었습니다");
              location.href = "#";
            } else {
              alert(
                "토큰 업데이트에 실패하였습니다. 메시지:",
                data.message
              );
            }
          })
          .catch((error) => {
            alert("토큰 업데이트에 실패하였습니다.");
          });
      })
      .catch((error) => {
        alert("토큰 업데이트에 실패하였습니다.");
      });
  }else{
    alert("토큰 조회에 실패하였습니다.");
  }
};*/
