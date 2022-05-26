let login_or_singup = document.getElementById("login_or_singup");
let signup_click = document.getElementById("signup_click");
let login_click = document.getElementById("login_click");

// --------------------------------------------------control--------------------------------------------------

window.addEventListener("load", async () => {
    let headers = {
        "Content-Type": "application/json"
    };
    member_status = await get_data(headers);
    if(member_status !== null){
        login_success();                    //若為登入狀態(token未過期)則顯示會員專區
    }
})

// 跳出登入選單addEventListener
login_or_singup.addEventListener("click", login_interface)

// 註冊新帳戶的按鈕addEventListener
signup_click.addEventListener("click", member_signup)

// 登入帳戶按鈕addEventListener
login_click.addEventListener("click", member_login)

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

// 會員登入
function member_login() {
    let login_username = document.getElementById("login_username");
    let login_password = document.getElementById("login_password");
    let message = {
        username : login_username.value,
        password : login_password.value,
    };
    let headers = {
        "Content-Type": "application/json"
    };

    patch_data(message, headers);
}


// --------------------------------------------------model--------------------------------------------------
//GET會員狀態
async function get_data(headers){
    let response = await fetch("/api/members", {
        method: "GET",
        headers: headers
    });
    let res = await response.json();
    console.log(res.data)
    return res.data;
}

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
        else if(res.error === true){
            error_message = res.message;
            signup_fail(error_message);
        }
    })
}

// 登入會員
function patch_data(message, headers){
    fetch("/api/members",{                         //PATCH資料去"/api/members"
        method: "PATCH",
        body: JSON.stringify(message),
        headers: headers
    })
    .then(function(response){                   // 接收/api/members的return
        return response.json();
    })
    .then(function(res){
        if(res.ok === true){
            login_success();
        }
        else if(res.error === true){
            login_fail();
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

    // 按下關閉後觸發
    login_icon_close_block.addEventListener("click", () => {
        login_interface_block.style.visibility = "hidden";
        background_oppacity.style.display = "none";
        reset_signup_data();
        original_convert_to_login();
    })

    // 按下點次註冊後觸發
    convert_to_signup.addEventListener("click", () => {
        login_interface_block.style.visibility = "hidden";
        sinup_interface();
        reset_signup_data();
        original_convert_to_login();
    })
}

//登入成功後的介面
function login_success() {
    let background_oppacity = document.getElementById("background_oppacity");
    let login_interface_block = document.getElementById("login_interface_block");
    let login_or_singup = document.getElementById("login_or_singup");
    background_oppacity.style.display = "none";
    login_interface_block.style.visibility = "hidden";
    login_or_singup.style.display = "none";
    member_area.style.display = "inline-block";
}

//顯示登入失敗原因
function login_fail() {
    let login_status = document.getElementById("login_status");
    login_status.textContent = "帳號或密碼錯誤";
}

// 註冊帳號介面
function sinup_interface() {
    let background_oppacity = document.getElementById("background_oppacity");
    let signup_interface_block = document.getElementById("signup_interface_block");
    let signup_icon_close_block = document.getElementById("signup_icon_close_block");
    let convert_to_login = document.getElementById("convert_to_login");
    signup_interface_block.style.visibility = "visible";

    // 按下關閉後觸發
    signup_icon_close_block.addEventListener('click', () => {
        signup_interface_block.style.visibility = "hidden";
        background_oppacity.style.display = "none";
        reset_signup_data();
        original_convert_to_login();
    })

    // 按下點次登入後觸發
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
function signup_fail(error_message) {
    let signup_status = document.getElementById("signup_status");
    signup_status.textContent = error_message;
}

// 點此登入及註冊後顯示原因區域變成不顯示
function original_convert_to_login() {
    let signup_status = document.getElementById("signup_status");
    let login_status = document.getElementById("login_status");
    signup_status.textContent = "\xa0"
    login_status.textContent = "\xa0";
}

// 清空登入及註冊資料
function reset_signup_data() {
    let login_username = document.getElementById("login_username");
    let login_password = document.getElementById("login_password");
    let signup_name = document.getElementById("signup_name");
    let signup_username = document.getElementById("signup_username");
    let signup_password = document.getElementById("signup_password");
    let signup_email = document.getElementById("signup_email");

    login_username.value = "";
    login_password.value = "";
    signup_name.value = "";
    signup_username.value = "";
    signup_password.value = "";
    signup_email.value = "";
}