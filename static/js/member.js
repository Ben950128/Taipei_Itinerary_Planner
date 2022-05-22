let login_or_singup = document.getElementById("login_or_singup");

// --------------------------------------------------control--------------------------------------------------
// 跳出登入選單
login_or_singup.addEventListener('click', () => {
    login_interface();
})

// 會員註冊
function member_signup() {
    let signup_name = document.getElementById("signup_name");
    let signup_username = document.getElementById("signup_username");
    let signup_password = document.getElementById("signup_password");
    let signup_email = document.getElementById("signup_email");
    let message = {
        name : signup_name.value,
        username : signup_username.value,
        password : signup_password.value,
        email : signup_email.value
    };
    let headers = {
        "Content-Type": "application/json"
    };

    post_data(message, headers);
}


// --------------------------------------------------model--------------------------------------------------
// POST註冊會員資料
function post_data(message, headers){
    fetch("/api/members",{                         //POST註冊資料去"/api/members"
        method: "POST",
        body: JSON.stringify(message),
        headers: headers
    })
    .then(function(response){                   // 接收/api/members的return
        return response.json()
    })
    .then(function(res){
        if(res.ok === true){
            signup_success();
        }
        else if(res.error === true) {
            error_message = res.message;
            already_have_email_username(error_message);
        }
    })
}

// --------------------------------------------------view--------------------------------------------------
// 登入介面
function login_interface() {
    let background_oppacity = document.getElementById("background_oppacity");
    let login_interface_block = document.getElementById("login_interface_block");
    let login_icon_close_block = document.getElementById("login_icon_close_block");
    let convert_to_signup = document.getElementById("convert_to_signup");
    background_oppacity.style.display = "block";
    login_interface_block.style.visibility = "visible";

    login_icon_close_block.addEventListener('click', () => {
        login_interface_block.style.visibility = "hidden";
        background_oppacity.style.display = "none";
    })
    convert_to_signup.addEventListener('click', () => {
        login_interface_block.style.visibility = "hidden";
        sinup_interface();
    })
}

// 註冊帳號介面
function sinup_interface() {
    let background_oppacity = document.getElementById("background_oppacity");
    let signup_interface_block = document.getElementById("signup_interface_block");
    let signup_icon_close_block = document.getElementById("signup_icon_close_block");
    let convert_to_login = document.getElementById("convert_to_login");
    signup_interface_block.style.visibility = "visible";

    signup_icon_close_block.addEventListener('click', () => {
        signup_interface_block.style.visibility = "hidden";
        background_oppacity.style.display = "none";
        reset_signup_data();
        original_convert_to_login();
    })
    convert_to_login.addEventListener('click', () => {
        signup_interface_block.style.visibility = "hidden";
        login_interface();
        reset_signup_data();
        original_convert_to_login();
    })
}

// 顯示註冊成功
function signup_success() {
    let signup_status = document.getElementById("signup_status");
    signup_status.textContent = "註冊成功";
}

// 顯示註冊失敗原因
function already_have_email_username(error_message) {
    let signup_status = document.getElementById("signup_status");
    signup_status.textContent = error_message;
}

// 點此登入回復原本預設
function original_convert_to_login() {
    let signup_status = document.getElementById("signup_status");
    signup_status.textContent = "\xa0"
}

// 重製註冊資料
function reset_signup_data() {
    let signup_name = document.getElementById("signup_name");
    let signup_username = document.getElementById("signup_username");
    let signup_password = document.getElementById("signup_password");
    let signup_email = document.getElementById("signup_email");

    signup_name.value = "";
    signup_username.value = "";
    signup_password.value = "";
    signup_email.value = "";
}