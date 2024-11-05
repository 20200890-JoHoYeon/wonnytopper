$(document).ready(function () {
    const refreshBtn = document.getElementById("refreshBtn");
    const instaRecoTextArea = document.querySelector(".insta_reco_text_area");
    const modDateEl = document.getElementById("insta_mod_date");
    const recoDateEl = document.getElementById("insta_reco_date");

    const refreshBtnActive = (active) => {
        $("#refreshBtn").attr("disabled", !active);
        if (active) {
            refreshBtn.classList.remove("disable");
            refreshBtn.innerHTML = "갱신하기";
            instaRecoTextArea.classList.add("hidden");
        }
    }

    const showInstaDate = async () => {
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

                modDateEl.innerHTML = `최근 갱신일 : ${modDate.format("YYYY-MM-DD HH:mm:ss")}`;
                recoDateEl.innerHTML = recoDate;
                //갱신 가능일인 경우 
                if (today.isSameOrAfter(recoDate, "day")) refreshBtnActive(true);
            } else {
                //아직 발급 받기 전인 경우
                refreshBtnActive(true);
                modDateEl.classList.add("hidden");
            }
        } catch (err) {
            alert('최근 갱신일 조회 실패');
            refreshBtnActive(true);
            //console.log("Err:", err);
        }
    };

    showInstaDate();

    $("#refreshBtn").click(function () {
        // GET - 디비에서 토큰 값 받아오기
        fetch('https://web.wonnytopper.co.kr/token/select/1')
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const accessToken = data.data[0].token;
                    //console.log('토큰 조회에 성공하였습니다.');
                    //console.log('토큰:', accessToken);

                    // # 토큰 갱신
                    fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`)
                        .then(response => response.json())
                        .then(data => {
                            updatedToken = data.access_token;

                            // UPDATE - 토큰 업데이트
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
                                        alert("갱신이 완료되었습니다");
                                        location.href = "#";
                                    } else {
                                        alert('토큰 업데이트에 실패하였습니다. 메시지:', data.message);
                                    }
                                })
                                .catch(error => {
                                    alert('토큰 업데이트에 실패하였습니다.');
                                    //console.error('Error occurred:', error);
                                });
                        })
                        .catch(error => {
                            alert('토큰 업데이트에 실패하였습니다.');
                            //console.error('Error occurred:', error);
                        });
                }
            })
            .catch(error => {
                //console.error('Error occurred:', error);
            });
    });
});