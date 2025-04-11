const idInput = document.getElementById('email');
const pwdInput = document.getElementById('password');
const loginBtn = document.getElementById('login_btn');

const checkEnter = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        onClickLogin();
    }
}

const onClickLogin = async () => {
    const id = idInput.value;
    const pwd = pwdInput.value;
    let isAuto = false;

    if (id.trim() === '') {
        alert("아이디를 다시 입력해주세요");
        idInput.focus();
        return;
    }
    if (pwd.trim() === '') {
        alert("비밀번호를 다시 입력해주세요");
        pwdInput.focus();
        return;
    }

    if (document.querySelector('input[name="is_auto"]:checked') != null) {
        isAuto = true;
    }

    const raw = JSON.stringify({
        id,
        pwd,
        isAuto
    });

    const mymyHeaders = new Headers();
    mymyHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: 'POST',
        headers: mymyHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${host}/user/login`, requestOptions);
        const { code, message, data } = await response.json();

        if (code === 200) {
            sessionStorage.setItem("username", data.name);
            sessionStorage.setItem("userid", data.id);

            window.location.href = "/admin/content_main";
            return;
        }
        if (message === '패스워드가 틀립니다.') {
            alert('비밀번호를 다시 입력해주세요');
            pwdInput.focus();
            return;
        }
        if (message === '유저를 찾을 수 없습니다.') {
            alert("관리자 정보가 없습니다.");
            return;
        }
        alert(message || "로그인에 실패했습니다.");
    } catch (err) {
        alert("에러가 발생했습니다.");
    }

}
idInput.addEventListener('keydown', checkEnter);
pwdInput.addEventListener('keydown', checkEnter);
loginBtn.addEventListener('click', onClickLogin);
