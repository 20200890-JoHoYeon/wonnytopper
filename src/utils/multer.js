const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/public/uploads");
  },
  filename: (req, file, callback) => {
    const originalExtension = file.originalname.split(".").pop(); // 원본 파일의 확장자 추출
    callback(null, file.fieldname + "-" + Date.now() + "." + originalExtension);
  },
});

// 파일 필터 함수: 이미지 파일 여부를 검사하는 로직
const fileFilter = function (req, file, callback) {
  // 이미지 파일인지 MIME 타입으로 검사
  if (file.mimetype.startsWith("image/")) {
    callback(null, true); // 이미지 파일인 경우 허용
  } else {
    callback(new Error("Only image files are allowed!"), false); // 이미지 파일이 아닌 경우 에러 발생
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
module.exports = upload;
