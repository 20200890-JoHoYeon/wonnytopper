const galleryCategoryMenu = document.querySelectorAll(
  ".gallery_category_menu li"
);
const galleryMoreBtn = document.querySelector(".gallery_more_btn");
const popupWrap = document.querySelector(".popup_wrap");
const qnaPopupWrap = document.querySelector(".qna_popup_wrap");
const popupCloseBtn = document.querySelector(".close_btn");
const agreePopupWrap = document.querySelector(".agree_popup_wrap");
const agreeDetailBtn = document.querySelector(".agree_popup_text");
const popupAgreeCloseBtn = document.querySelector(".agree_close_btn");
const applyBtn = document.querySelector(".apply_btn");
const classListContainer = document.querySelector(".class_category_list");
const pierrotListContainer = document.querySelector(".pierrot_category_list");
const topperListContainer = document.querySelector(".topper_category_list");
const letteringListContainer = document.querySelector(
  ".lettering_category_list"
);
const printBalloonListContainer = document.querySelector(
  ".print_balloon_category_list"
);
const balloonListContainer = document.querySelector(".balloon_category_list");
const ballonMoreBtn = document.querySelector(".ballon_more_btn");
const qnaConetntsContainer = document.querySelector(".conetnts_list");
const contentsBtn = document.querySelector(".contents_btn");
const saveBtn = document.querySelector(".save_btn");
const contentDelBtn = document.querySelector(".content_del");
const agreeBtn = document.querySelector(".agree_btn");

const contentTitle = document.querySelector(".select_content_title");
const contentId = document.querySelector(".select_content_id");

const balloonCategroy = document.querySelector(".balloon_categroy");
const balloonSubMenu = document.querySelector(".balloon_sub_menu_area");
const balloonSubMenuList = document.querySelectorAll(".balloon_sub_menu_li");

/* Mobile */
const moGnb = document.querySelector(".icon_menu");
const mopopupCloseBtn = document.querySelector(".mo_icon_close");
const moPopupWrap = document.querySelector(".mo_menu_popup_wrap");
const moBollonMenu = document.querySelector(".bollon_menu");
const moBollonSubMenu = document.querySelector(".mo_sub_menu");
const moCategroyMenu = document.querySelectorAll(".mo_categroy_menu");

let galleryCategoryImg = [];
let classCategoryImg = [];
let pierrotCategoryImg = [];
let topperCategoryImg = [];
let balloonCategoryImg = [];
let galleryCategoryPopup = [];
let letteringCategoryImg = [];
let printBalloonCategoryImg = [];
let popupCategoryPopup = [];

//const URL = "https://web.wonnytopper.co.kr";
const URL = "http://localhost:3000";

const fetchGalleryImages = (id, subId) => {
  //console.log(FETCH);
  FETCH.post(
    "/content/gallery",
    {
      page: 1,
      pageSize: 8,
      category: [id],
      category_m: subId ? [subId] : null,
    },
    (data) => {
      galleryCategoryImg = data;
      galleryImageList(galleryCategoryImg);
    }
  );
};

// 원데이 클래스 api
const fetchClassImages = (id) => {
  FETCH.post(
    "/content/gallery",
    {
      page: null,
      pageSize: null,
      category: [4],
    },
    (data) => {
      classCategoryImg = data;
      classImageList(classCategoryImg);
    }
  );
};

// 삐에로/페이스페인팅 api
const fetchPierrotImages = (id) => {
  FETCH.post(
    "/content/gallery",
    {
      page: null,
      pageSize: null,
      category: [3],
    },
    (data) => {
      pierrotCategoryImg = data;
      pierrotImageList(pierrotCategoryImg);
    }
  );
};

// 토퍼 api
const fetchTopperImages = (id) => {
  FETCH.post(
    "/content/gallery",
    {
      page: null,
      pageSize: null,
      category: [2],
    },
    (data) => {
      topperCategoryImg = data;
      topperImageList(topperCategoryImg);
    }
  );
};

// 레터링풍선 api
const fetchLetteringImages = (id) => {
  FETCH.post(
    "/content/gallery",
    {
      page: null,
      pageSize: null,
      category: [5],
    },
    (data) => {
      letteringCategoryImg = data;
      letteringImageList(letteringCategoryImg);
    }
  );
};

// 인쇄풍선 api
const fetchPrintBalloonImages = (id) => {
  FETCH.post(
    "/content/gallery",
    {
      page: null,
      pageSize: null,
      category: [6],
    },
    (data) => {
      printBalloonCategoryImg = data;
      printBalloonImageList(printBalloonCategoryImg);
      //ballonMoreBtn.classList.remove("hidden");
    }
  );
};

let pageCount = 1;
// 풍선 api
const fetchBalloonImages = (subId) => {
  FETCH.post(
    "/content/gallery",
    {
      page: pageCount,
      pageSize: 12,
      category: [1],
      category_m: subId ? [subId] : null,
    },
    (data) => {
      const categoryObj = Object.assign({}, data);
      const categoryList = categoryObj.data;
      balloonCategoryImg = balloonCategoryImg.concat(categoryList); // 받아온 이미지를 배열에 추가
      balloonImageList(balloonCategoryImg, subId);
    }
  );
};

// 팝업 상세 호출 api
const fetchGalleryPopupDetail = (id) => {
  FETCH.get(`/content/select/${id}`, (data) => {
    galleryCategoryPopup = data;
    popupAddElement(data); // 수정: data를 전달
  });
};

// 상담문의 카테고리 조회  api
const fetchPopupCategoryImages = (id, subId) => {
  FETCH.post(
    "/content/gallery",
    {
      page: null,
      pageSize: null,
      category: [id],
      category_m: subId ? [subId] : null,
    },
    (data) => {
      popupCategoryPopup = data;
      //console.log(popupCategoryPopup);
      contentsImageList(popupCategoryPopup);
    }
  );
};

/* 원데이클래스 호출 */
if (classListContainer) {
  fetchClassImages();
}

/* 삐에로/페이스 페인팅 호출 */
if (pierrotListContainer) {
  fetchPierrotImages();
}

/* 토퍼 호출 */
if (topperListContainer) {
  fetchTopperImages();
}

/* 토퍼 페인팅 호출 */
if (balloonListContainer) {
  const subId = new URLSearchParams(window.location.search).get("sub");
  if (balloonSubMenuList) {
    balloonSubMenuList.forEach((element, index) => {
      if (index === parseInt(subId)) {
        element.classList.add("active");
      } else if (subId == null) {
        balloonSubMenuList[0].classList.add("active");
      }
      element.addEventListener("click", () => {
        const link = element.querySelector("a");
        window.location.href = link.href;
      });
    });
  }
  fetchBalloonImages(subId);
}

if (letteringListContainer) {
  fetchLetteringImages();
}

if (printBalloonListContainer) {
  fetchPrintBalloonImages();
}

/* 카테고리별 조회 */
if (galleryCategoryMenu) {
  let id = 1;
  const activeCategory = document.querySelector(
    ".gallery_category_menu .active"
  );
  if (activeCategory) {
    id = activeCategory.id;
  }

  fetchGalleryImages(id);

  galleryCategoryMenu.forEach((prElement) => {
    prElement.addEventListener("click", function () {
      galleryCategoryMenu.forEach((element) => {
        element.classList.remove("active");
      });
      this.classList.add("active");
      id = this.id;
      //console.log(id);

      fetchGalleryImages(id);
    });
  });

  if (galleryMoreBtn) {
    galleryMoreBtn.addEventListener("click", () => {
      const numericId = parseInt(id);

      if (numericId === 1) {
        location.href = "/balloon";
      } else if (numericId === 2) {
        location.href = "/topper";
      } else if (numericId === 3) {
        location.href = "/pierrot";
      } else if (numericId === 4) {
        location.href = "/class";
      } else if (numericId === 5) {
        location.href = "/lettering";
      } else if (numericId === 6) {
        location.href = "/print-balloon";
      } else {
        location.href = "/balloon";
      }
    });
  }
}

/* 이미지 url 추출 */
const trimFilePath = (filePath) => {
  const startIndex = filePath.indexOf("uploads");
  const trimmedPath = filePath.substring(startIndex + "uploads".length + 1);
  return trimmedPath;
};

/* */
const galleryImageList = (img) => {
  const galleryListContainer = document.querySelector(".gallery_category_list");

  if (galleryListContainer) {
    galleryListContainer.innerHTML = "";
    const categoryObj = Object.assign({}, img);
    const categoryList = categoryObj.data;
    categoryList.forEach((element) => {
      if (!element.file_main_id_url) {
        return;
      }
      const mainImgUrl = trimFilePath(element.file_main_id_url);

      galleryListContainer.insertAdjacentHTML(
        "beforeend",
        `
        <li data-id=${element.content_id} style="background:url('${URL}/img/uploads/${mainImgUrl}') no-repeat center center/cover">
            <div class="gallery_category_list_content">
              <div class="gallery_category_title_area">
                <div class="gallery_category_title">${element.title}</div>
              </div>
            </div>
        </li>
        `
      );
    });
  }

  const galleryCategoryList = document.querySelectorAll(
    ".gallery_category_list li"
  );

  galleryCategoryList.forEach((element) => {
    element.addEventListener("click", () => {
      //console.log(element.getAttribute("data-id"));
      //console.log(element);
      fetchGalleryPopupDetail(element.getAttribute("data-id"));
      popupWrap.classList.remove("hidden");
    });
  });
};

/* 팝업 추가 이미지 */
const popupAddElement = (data) => {
  //console.log("data");
  const content = data.data;
  const popupImagesList = document.querySelector(".popup_images_list");
  if (popupImagesList) {
    // 요소가 존재하는 경우에만 작업 수행
    popupImagesList.innerHTML = "";
    // 나머지 코드 작성
  } else {
    //console.log("popup_images_list 요소를 찾을 수 없습니다.");
  }

  const popupTitle = document.querySelector(".popup_title");

  //popupImagesList.innerHTML = "";
  //console.log(content[0]);

  let detailImg01, detailImg02, detailImg03, detailImg04, mainImg;
  popupTitle.innerText = content[0].title;
  mainImg = trimFilePath(content[0].file_main_id_url);

  popupImagesList.insertAdjacentHTML(
    "beforeend",
    `<div class="swiper-slide"><img src='${URL}/img/uploads/${mainImg}'></div>`
  );

  if (content[0].file_1_id_url) {
    detailImg01 = trimFilePath(content[0].file_1_id_url);
    popupImagesList.insertAdjacentHTML(
      "beforeend",
      `<div class="swiper-slide"><img src='${URL}/img/uploads/${detailImg01}'></div>`
    );
  }
  if (content[0].file_2_id_url) {
    detailImg02 = trimFilePath(content[0].file_2_id_url);
    popupImagesList.insertAdjacentHTML(
      "beforeend",
      `<div class="swiper-slide"><img src='${URL}/img/uploads/${detailImg02}'></div>`
    );
  }
  if (content[0].file_3_id_url) {
    detailImg03 = trimFilePath(content[0].file_3_id_url);
    popupImagesList.insertAdjacentHTML(
      "beforeend",
      `<div class="swiper-slide"><img src='${URL}/img/uploads/${detailImg03}'></div>`
    );
  }
  if (content[0].file_4_id_url) {
    detailImg04 = trimFilePath(content[0].file_4_id_url);
    popupImagesList.insertAdjacentHTML(
      "beforeend",
      `<div class="swiper-slide"><img src='${URL}/img/uploads/${detailImg04}'></div>`
    );
  }

  const swiper = new Swiper(".mySwiper", {
    spaceBetween: 2,
    direction: "horizontal", // 가로 슬라이드
    slidesPerView: 1,
    loop: true,
    centeredSlides: true,
    autoplay: false,
    pagination: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
};

/* popup close */
if (popupCloseBtn) {
  popupCloseBtn.addEventListener("click", (event) => {
    if (popupWrap) {
      popupWrap.classList.add("hidden");
    }
    if (qnaPopupWrap) {
      qnaPopupWrap.classList.add("hidden");
    }
  });
}

if (popupAgreeCloseBtn) {
  popupAgreeCloseBtn.addEventListener("click", () => {
    agreePopupWrap.classList.add("hidden");
  });
}

if (mopopupCloseBtn) {
  mopopupCloseBtn.addEventListener("click", (event) => {
    moPopupWrap.classList.remove("on");
  });
}

/* contents popup open */
if (agreeDetailBtn) {
  agreeDetailBtn.addEventListener("click", () => {
    agreePopupWrap.classList.remove("hidden");
  });
}
if (contentsBtn) {
  contentsBtn.addEventListener("click", (event) => {
    qnaPopupWrap.classList.remove("hidden");
  });
}

if (moGnb) {
  moGnb.addEventListener("click", () => {
    moPopupWrap.classList.add("on");
  });
}

if (ballonMoreBtn) {
  ballonMoreBtn.addEventListener("click", () => {
    pageCount++; // 페이지 번호 증가
    fetchBalloonImages();
  });
}

if (balloonCategroy) {
  balloonCategroy.addEventListener("mouseenter", () => {
    balloonSubMenu.classList.add("visible");
  });

  balloonCategroy.addEventListener("mouseleave", () => {
    setTimeout(() => {
      if (!balloonSubMenu.matches(":hover")) {
        balloonSubMenu.classList.remove("visible");
      }
    }, 200);
  });

  balloonSubMenu.addEventListener("mouseleave", () => {
    setTimeout(() => {
      if (!balloonCategroy.matches(":hover")) {
        balloonSubMenu.classList.remove("visible");
      }
    }, 200);
  });
}

/* 상담문의 신청 */
if (applyBtn) {
  const name = document.querySelector(".name");
  const hp1 = document.querySelector(".phoneNum1");
  const hp2 = document.querySelector(".phoneNum2");
  const hp3 = document.querySelector(".phoneNum3");
  const email = document.querySelector(".email");
  const address = document.querySelector(".address");
  const place = document.querySelector(".place");

  const budget = document.querySelector(".budget");
  const requestSelet = document.querySelector(".request_selet");
  const qnaContent = document.querySelector(".qna_content_detail");
  const categoryRequestSelet = document.querySelector(
    ".category_request_selet"
  );
  const subCategoryRequestSelet = document.querySelector(
    ".sub_category_request_selet"
  );
  const qnaSeletPad = document.querySelector(".qna_pad_area");
  const qnaPopupSubArea = document.querySelector(
    ".qna_popup_body_content .sub.request_selet_area"
  );
  const selectContentId = document.querySelector(".select_content_id");
  const agreeCheckbox = document.querySelector("#agree");
  //console.log(agreeCheckbox.checked);

  agreeBtn.addEventListener("click", () => {
    agreeCheckbox.checked = true;
    agreePopupWrap.classList.add("hidden");
  });

  /* 이름 국/영문 최대 20자 */
  name.addEventListener("input", () => {
    const inputValue = name.value;
    const isValid = /^[A-Za-zㄱ-ㅎㅏ-ㅣ가-힣]*$/g.test(inputValue);
    if (!isValid) {
      name.value = inputValue
        .replace(/[^A-Za-zㄱ-ㅎㅏ-ㅣ가-힣]/g, "")
        .slice(0, 20);
    }
  });

  hp1.addEventListener("keyup", () => {
    const inputValue = hp1.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (inputValue !== numericValue) {
      hp1.value = numericValue;
    }
  });

  hp1.addEventListener("keydown", () => {
    const inputValue = hp1.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (inputValue !== numericValue) {
      hp1.value = numericValue;
    }
  });

  hp1.addEventListener("blur", () => {
    const inputValue = hp1.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (inputValue !== numericValue) {
      hp1.value = numericValue;
    }
  });

  hp2.addEventListener("keyup", () => {
    const inputValue = hp2.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (inputValue !== numericValue) {
      hp2.value = numericValue;
    }
  });

  hp2.addEventListener("keydown", () => {
    const inputValue = hp2.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (inputValue !== numericValue) {
      hp2.value = numericValue;
    }
  });

  hp2.addEventListener("blur", () => {
    const inputValue = hp2.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (inputValue !== numericValue) {
      hp2.value = numericValue;
    }
  });

  hp3.addEventListener("keyup", () => {
    const inputValue = hp3.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (inputValue !== numericValue) {
      hp3.value = numericValue;
    }
  });

  hp3.addEventListener("keydown", () => {
    const inputValue = hp3.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (inputValue !== numericValue) {
      hp3.value = numericValue;
    }
  });

  hp3.addEventListener("blur", () => {
    const inputValue = hp3.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (inputValue !== numericValue) {
      hp3.value = numericValue;
    }
  });

  /* 이메일 영문, 숫자 최대 20자 */
  email.addEventListener("keyup", () => {
    const inputValue = email.value;
    const isValid = /^[a-zA-Z0-9]{0,20}$/.test(inputValue);

    if (!isValid) {
      email.value = inputValue.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20);
    }
  });

  email.addEventListener("keydown", () => {
    const inputValue = email.value;
    const isValid = /^[a-zA-Z0-9]{0,20}$/.test(inputValue);

    if (!isValid) {
      email.value = inputValue.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20);
    }
  });

  email.addEventListener("blur", () => {
    const inputValue = email.value;
    const isValid = /^[a-zA-Z0-9]{0,20}$/.test(inputValue);

    if (!isValid) {
      email.value = inputValue.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20);
    }
  });

  address.addEventListener("keyup", () => {
    const inputValue = address.value;
    const filteredValue = inputValue.replace(/[^a-zA-Z.]/g, "");
    address.value = filteredValue;
  });

  address.addEventListener("keydown", () => {
    const inputValue = address.value;
    const filteredValue = inputValue.replace(/[^a-zA-Z.]/g, "");
    address.value = filteredValue;
  });

  address.addEventListener("blur", () => {
    const inputValue = address.value;
    const filteredValue = inputValue.replace(/[^a-zA-Z.]/g, "");
    address.value = filteredValue;
  });

  budget.addEventListener("keyup", () => {
    let inputValue = budget.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (inputValue !== numericValue) {
      budget.value = numericValue;
    }
  });

  budget.addEventListener("keydown", () => {
    let inputValue = budget.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (inputValue !== numericValue) {
      budget.value = numericValue;
    }
  });

  budget.addEventListener("blur", () => {
    let inputValue = budget.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (inputValue !== numericValue) {
      budget.value = numericValue;
    }
  });

  /* 장소  최대 30자 */
  place.addEventListener("input", () => {
    const inputValue = place.value;
    if (inputValue.length > 30) {
      place.value = inputValue.slice(0, 30);
    }
  });

  applyBtn.addEventListener("click", () => {
    // 유효성 체크
    if (
      name.value.trim() === "" ||
      hp1.value === "" ||
      hp2.value === "" ||
      hp3.value === "" ||
      email.value === "" ||
      address.value === "" ||
      place.value === "" ||
      budget.value === "" ||
      requestSelet.value === "" ||
      qnaContent.value === ""
    ) {
      alert("모든 내용을 입력해주세요.");
      return;
    }

    if (qnaContent.value.length < 10) {
      alert("10자부터 입력 가능합니다.");
      return;
    }

    if (!agreeCheckbox.checked) {
      alert("개인정보취급방침에 동의해주세요.");
      return;
    }

    FETCH.post(
      "/counsel/insertCounsel",
      {
        name: name.value,
        phone_num: hp1.value + hp2.value + hp3.value,
        email: email.value + "@" + address.value,
        location: place.value,
        budget: budget.value,
        purpose: requestSelet.options[requestSelet.selectedIndex].value,
        detail: qnaContent.value,
        agree: agreeCheckbox.checked,
        content_id: selectContentId.value,
      },
      (data) => {
        //console.log(data);
        alert("신청이 완료되었습니다");
        location.href = "/";
      }
    );
  });

  if (categoryRequestSelet) {
    let categoryId;
    let subCategoryId;
    const qnaInputArea = document.querySelector(
      ".qna_popup_body_content .qna_input_area"
    );

    const popupCategoryId = (id, subId) => {
      fetchPopupCategoryImages(id, subId);
      fetchGalleryImages(id, subId);
    };

    // 페이지 로딩 시 전체를 선택한 상태로 조회
    popupCategoryId(categoryRequestSelet.value);

    categoryRequestSelet.addEventListener("change", () => {
      if (categoryRequestSelet.value === "1") {
        //풍선장식인 경우
        qnaSeletPad.classList.remove("hidden"); //영역 숨김
        qnaPopupSubArea.classList.remove("hidden");
        qnaInputArea.style.gridTemplateColumns = "20% 39% 2% 39%";
      } else {
        subCategoryRequestSelet.value = "";
        qnaSeletPad.classList.add("hidden");
        qnaPopupSubArea.classList.add("hidden");
        qnaInputArea.style.gridTemplateColumns = "20% 80%";
      }

      categoryId = categoryRequestSelet.value;

      // "전체"를 선택한 경우와 다른 카테고리를 선택한 경우에만 조회 실행
      if (categoryId !== "") {
        popupCategoryId(categoryId);
      }
    });

    subCategoryRequestSelet.addEventListener("change", () => {
      subCategoryId = subCategoryRequestSelet.value;
      if (subCategoryId === "") {
        subCategoryId = null;
      }
      if (subCategoryId !== "") {
        popupCategoryId(categoryId, subCategoryId);
      }
    });
  }
}

/* 상담문의 컨텐츠 조회 태그 추가 */
const contentsImageList = (data) => {
  //console.log(data);

  qnaConetntsContainer.innerHTML = "";
  const categoryObj = Object.assign({}, data);
  const categoryList = categoryObj.data;
  categoryList.forEach((element) => {
    if (!element.file_main_id_url) {
      return;
    }
    const mainImgUrl = trimFilePath(element.file_main_id_url);

    qnaConetntsContainer.insertAdjacentHTML(
      "beforeend",
      `
      <li data-id=${element.content_id}>
        <div class="conetnts_list_area">
          <div class="conetnts_list_content" style="background:url('${URL}/img/uploads/${mainImgUrl}') no-repeat center center/cover">
            <div class="radio_area">
              <input type="radio" id=${element.content_id} name="applyInfoType" value="${element.title}" />
                <label for=${element.content_id}>
                  <span class="radio"></span>
                </label>
            </div>
          </div>
          <div class="conetnts_list_title">${element.title}</div>
        </div>
      </li>
      `
    );
  });
};

let checkTitle;
let checkId;

/* 컨텐츠 저장하기 */
if (saveBtn) {
  saveBtn.addEventListener("click", (event) => {
    const radios = document.querySelectorAll(
      ".radio_area input[name=applyInfoType]"
    );

    let isChecked = false; // 선택 여부를 변수

    radios.forEach((radio) => {
      if (radio.checked) {
        checkTitle = radio.value;
        checkId = radio.getAttribute("id");
        isChecked = true; // 선택되었음을 표시
      }
    });

    if (!isChecked) {
      event.preventDefault(); // 기본 동작(폼 제출) 중단
      alert("컨텐츠를 선택해주세요");
    }

    if (isChecked) {
      qnaPopupWrap.classList.add("hidden");
    }
    contentTitle.textContent = checkTitle;
    contentId.value = checkId;
    contentDelBtn.classList.remove("hidden");
  });
}

/* 컨텐츠 선택한 title 삭제 */
if (contentDelBtn) {
  contentDelBtn.addEventListener("click", () => {
    contentTitle.textContent = "";
    contentDelBtn.classList.add("hidden");
  });
}

/* 원데이 클래스 조회 태그 추가 */
const classImageList = (img) => {
  //console.log(img);

  classListContainer.innerHTML = "";
  const categoryObj = Object.assign({}, img);
  const categoryList = categoryObj.data;

  categoryList.forEach((element) => {
    if (!element.file_main_id_url) {
      return;
    }
    const mainImgUrl = trimFilePath(element.file_main_id_url);

    classListContainer.insertAdjacentHTML(
      "beforeend",
      `
      <li data-id=${element.content_id} style="background:url('${URL}/img/uploads/${mainImgUrl}') no-repeat center center/cover">
          <div class="gallery_category_list_content">
            <div class="gallery_category_title_area">
              <div class="gallery_category_title">${element.title}</div>
            </div>
          </div>
      </li>
      `
    );
  });
  const classCategoryList = document.querySelectorAll(
    ".class_category_list li"
  );

  classCategoryList.forEach((element) => {
    element.addEventListener("click", () => {
      //console.log(element.getAttribute("data-id"));
      fetchGalleryPopupDetail(element.getAttribute("data-id"));
      popupWrap.classList.remove("hidden");
    });
  });
};

/* 삐에로/페이스페인팅 리스트 조회 */
const pierrotImageList = (img) => {
  //console.log(img);

  pierrotListContainer.innerHTML = "";
  const categoryObj = Object.assign({}, img);
  const categoryList = categoryObj.data;

  categoryList.forEach((element) => {
    if (!element.file_main_id_url) {
      return;
    }
    const mainImgUrl = trimFilePath(element.file_main_id_url);

    pierrotListContainer.insertAdjacentHTML(
      "beforeend",
      `
      <li data-id=${element.content_id} style="background:url('${URL}/img/uploads/${mainImgUrl}') no-repeat center center/cover">
          <div class="gallery_category_list_content">
            <div class="gallery_category_title_area">
              <div class="gallery_category_title">${element.title}</div>
            </div>
          </div>
      </li>
      `
    );
  });
  const pierrotCategoryList = document.querySelectorAll(
    ".pierrot_category_list li"
  );

  pierrotCategoryList.forEach((element) => {
    element.addEventListener("click", () => {
      //console.log(element.getAttribute("data-id"));
      fetchGalleryPopupDetail(element.getAttribute("data-id"));
      popupWrap.classList.remove("hidden");
    });
  });
};

/* 토퍼 리스트 조회 */
const topperImageList = (img) => {
  //console.log(img);

  topperListContainer.innerHTML = "";
  const categoryObj = Object.assign({}, img);
  const categoryList = categoryObj.data;

  categoryList.forEach((element) => {
    if (!element.file_main_id_url) {
      return;
    }
    const mainImgUrl = trimFilePath(element.file_main_id_url);

    topperListContainer.insertAdjacentHTML(
      "beforeend",
      `
      <li data-id=${element.content_id} style="background:url('${URL}/img/uploads/${mainImgUrl}') no-repeat center center/cover">
          <div class="gallery_category_list_content">
            <div class="gallery_category_title_area">
              <div class="gallery_category_title">${element.title}</div>
            </div>
          </div>
      </li>
      `
    );
  });
  const topperCategoryList = document.querySelectorAll(
    ".topper_category_list li"
  );

  topperCategoryList.forEach((element) => {
    element.addEventListener("click", () => {
      //console.log(element.getAttribute("data-id"));
      fetchGalleryPopupDetail(element.getAttribute("data-id"));
      popupWrap.classList.remove("hidden");
    });
  });
};

/* 레트로 풍선 리스트 조회 */
const letteringImageList = (img) => {
  letteringListContainer.innerHTML = "";
  const categoryObj = Object.assign({}, img);
  const categoryList = categoryObj.data;

  categoryList.forEach((element) => {
    if (!element.file_main_id_url) {
      return;
    }
    const mainImgUrl = trimFilePath(element.file_main_id_url);

    letteringListContainer.insertAdjacentHTML(
      "beforeend",
      `
      <li data-id=${element.content_id} style="background:url('${URL}/img/uploads/${mainImgUrl}') no-repeat center center/cover">
          <div class="gallery_category_list_content">
            <div class="gallery_category_title_area">
              <div class="gallery_category_title">${element.title}</div>
            </div>
          </div>
      </li>
      `
    );
  });
  const letteringCategoryList = document.querySelectorAll(
    ".lettering_category_list li"
  );

  letteringCategoryList.forEach((element) => {
    element.addEventListener("click", () => {
      fetchGalleryPopupDetail(element.getAttribute("data-id"));
      popupWrap.classList.remove("hidden");
    });
  });
};

/* 인쇄 풍선 리스트 조회 */
const printBalloonImageList = (img) => {
  printBalloonListContainer.innerHTML = "";
  const categoryObj = Object.assign({}, img);
  const categoryList = categoryObj.data;

  categoryList.forEach((element) => {
    if (!element.file_main_id_url) {
      return;
    }
    const mainImgUrl = trimFilePath(element.file_main_id_url);

    printBalloonListContainer.insertAdjacentHTML(
      "beforeend",
      `
      <li data-id=${element.content_id} style="background:url('${URL}/img/uploads/${mainImgUrl}') no-repeat center center/cover">
          <div class="gallery_category_list_content">
            <div class="gallery_category_title_area">
              <div class="gallery_category_title">${element.title}</div>
            </div>
          </div>
      </li>
      `
    );
  });
  const printBalloonCategoryList = document.querySelectorAll(
    ".print_balloon_category_list li"
  );

  printBalloonCategoryList.forEach((element) => {
    element.addEventListener("click", () => {
      fetchGalleryPopupDetail(element.getAttribute("data-id"));
      popupWrap.classList.remove("hidden");
    });
  });
};

/* 풍선 리스트 조회 */
const balloonImageList = (imgList, sub) => {
  //console.log(imgList);

  balloonListContainer.innerHTML = "";

  imgList.forEach((element) => {
    if (!element.file_main_id_url) {
      return;
    }
    const mainImgUrl = trimFilePath(element.file_main_id_url);

    balloonListContainer.insertAdjacentHTML(
      "beforeend",
      `
      <li data-id=${element.content_id} style="background:url('${URL}/img/uploads/${mainImgUrl}') no-repeat center center/cover">
          <div class="gallery_category_list_content">
            <div class="gallery_category_title_area">
              <div class="gallery_category_title">${element.title}</div>
            </div>
          </div>
      </li>
      `
    );
  });

  const balloonCategoryList = document.querySelectorAll(
    ".balloon_category_list li"
  );

  balloonCategoryList.forEach((element) => {
    element.addEventListener("click", () => {
      //console.log(element.getAttribute("data-id"));
      fetchGalleryPopupDetail(element.getAttribute("data-id"));
      popupWrap.classList.remove("hidden");
    });
  });
  /*
     // 데이터를 모두 불러왔을 경우에 대한 조건문 수정
  if (imgList.length < pageCount * 12) {
    ballonMoreBtn.classList.add("hidden");
  } else {
    ballonMoreBtn.classList.remove("hidden");
  }
  */

  if (imgList.length < pageCount * 12) {
    // 데이터를 모두 불러왔을 경우s
    ballonMoreBtn.classList.add("hidden");
  } else {
    ballonMoreBtn.classList.remove("hidden");
  }
};

if (moBollonMenu) {
  moBollonMenu.addEventListener("click", () => {
    moBollonMenu.classList.toggle("active");
  });
}

if (moCategroyMenu) {
  moCategroyMenu.forEach((element) => {
    element.addEventListener("click", () => {
      element.classList.add("active");
    });
  });
}

//GNB 액티브
const linkArray = [
  "/balloon",
  "/lettering",
  "/print-balloon",
  "/topper",
  "/pierrot",
  "/class",
  "/qna",
];
const currentURL = window.location.href;
const targetElement = document.querySelectorAll(".gnb_li");
const targetMoElement = document.querySelectorAll(".mo_gnb_li");

linkArray.forEach((link, i) => {
  if (currentURL.includes(link)) {
    targetElement[i].classList.add("active");
    targetMoElement[i].classList.add("active");
  } else {
    targetElement[i].classList.remove("active");
    targetMoElement[i].classList.remove("active");
  }
});
