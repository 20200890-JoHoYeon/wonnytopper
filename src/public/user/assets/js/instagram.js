fetch("https://web.wonnytopper.co.kr/token/select/1")
  .then((response) => response.json())
  .then((data) => {
    if (data.code === 200) {
      var accessToken = data.data[0].token;
      //console.log("토큰 조회에 성공하였습니다.", accessToken);

      // Instafeed.js 라이브러리를 사용하지 않고 인스타그램 API를 사용하여 인스타그램 이미지를 가져와 'instafeed' 클래스에 추가
      var instafeed = document.getElementsByClassName("instafeed");

      // 인스타그램 API를 사용하여 인스타그램 이미지를 가져오는 함수
      function getInstagramImages() {
        var xhr = new XMLHttpRequest();
        xhr.open(
          "GET",
          "https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=" +
            accessToken
        );
        xhr.send();
        xhr.addEventListener("load", function (e) {
          var response = JSON.parse(e.target.response);
          //console.log(response);
          // <li data-id=${element.content_id} style="background:url('${URL}/img/uploads/${mainImgUrl}') no-repeat center center/cover">과 같은 형식으로 instafeed 클래스에 추가
          if (response.data) {
            var count = 0;
            for (var i = 0; i < response.data.length; i++) {
              if (
                response.data[i].media_type === "IMAGE" ||
                response.data[i].media_type === "CAROUSEL_ALBUM"
              ) {
                instafeed[count].innerHTML =
                  '<li data-id="' +
                  response.data[i].id +
                  '" style="background:url(\'' +
                  response.data[i].media_url +
                  "') no-repeat center center/cover\"></li>";
                count++;
              }
              if (count === 6) {
                break;
              }
            }
          }
        });
      }

      getInstagramImages();
    } else {
      console.error("토큰 조회에 실패하였습니다. 메시지:", data.message);
    }
  })
  .catch((error) => {
    //console.log("Error occurred while fetching access token:", error);
  });
