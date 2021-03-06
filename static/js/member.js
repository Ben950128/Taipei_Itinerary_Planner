let login_or_singup = document.getElementById("login_or_singup");
let signup_click = document.getElementById("signup_click");
let login_click = document.getElementById("login_click");
let login_password = document.getElementById("login_password");
let member_area = document.getElementById("member_area");
let logout = document.getElementById("logout");
let already_booking = document.getElementById("already_booking");
let member_only = document.getElementById("member_only");

// --------------------------------------------------control--------------------------------------------------
// 查看是否為登入狀態
window.addEventListener("load", async () => {
    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    let member_status = await get_member_data(headers);
    if(member_status !== null){
        let name = member_status.name;
        login_success(name);                    //若為登入狀態(token未過期)則顯示會員專區
    }
})


//會員選單burger的addEventListener
member_area.addEventListener("click", (e) => {
    let burger = document.getElementById("burger");
    if (burger.style.display == "block") {
        burger.style.display = "none";
    }
    else {
        burger.style.display = "block";
    }
    e.stopPropagation();                 //阻止向上冒泡，此例為不會觸發document.body.addEventListener
})


//點擊空白區觸發
document.body.addEventListener("click", () => {
    let burger = document.getElementById("burger");
    if (burger.style.display == "block") {
        burger.style.display = "none";
    }
})

// 按下登入/註冊按鈕後，跳出登入選單addEventListener
login_or_singup.addEventListener("click", login_interface)

// 登入帳戶按鈕addEventListener
login_click.addEventListener("click", member_login)
login_password.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        member_login();
    }
})

// 按下登入帳號按鈕觸發
async function member_login() {
    let login_username = document.getElementById("login_username");
    let login_password = document.getElementById("login_password");
    let message = {
        username : login_username.value,
        password : login_password.value,
    };
    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };

    let response = await patch_member_data(message, headers);
    if(response.ok === true){
        let name = response.name;
        login_success(name);
    }
    else if(response.error === true){
        login_fail();
    }
}

// 註冊新帳戶的按鈕addEventListener
signup_click.addEventListener("click", member_signup);


// 按下註冊新帳戶按鈕觸發
async function member_signup() {
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
        "Accept": "application/json",
        "Content-Type": "application/json"
    };

    let response = await post_member_data(message, headers);
    if(response.ok === true){
        signup_success();
    }
    else if(response.error === true){
        error_message = response.message;
        signup_fail(error_message);
    }
}


//按下登出的addEventListener
logout.addEventListener("click", async () => {
    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    let response = await delete_member_data(headers);
    if (response.ok === true){
        window.location.href = "/";
    }
})

// 會員選單的預定行程按鈕
already_booking.addEventListener("click", () => {
    window.location.href = "/booking";
})

// 會員選單的會員專區按鈕
member_only.addEventListener("click", () => {
    window.location.href = "/memberonly";
})

// --------------------------------------------------model--------------------------------------------------
//GET會員狀態
async function get_member_data(headers){
    let response = await fetch("/api/members", {
            method: "GET",
            headers: headers
        }
    );
    let res = await response.json();
    return res.data;
}

// POST註冊會員資料，POST註冊資料去"/api/members"
async function post_member_data(message, headers){
    let response = await fetch("/api/members", {
            method: "POST",
            body: JSON.stringify(message),
            headers: headers
        }
    );
    let res = response.json();
    return res;
}

// 登入會員傳送資料給後端，PATCH資料去"/api/members"
async function patch_member_data(message, headers){
    let response = await fetch("/api/members",{
        method: "PATCH",
        body: JSON.stringify(message),
        headers: headers
    });
    let res = response.json();
    return res;
}

//登出會員，delete data去"/api/members"
async function delete_member_data(headers){
    let response = await fetch("/api/members", {
            method: "DELETE",
            headers: headers
        }
    );
    let res = await response.json();
    return res;
}


// --------------------------------------------------view--------------------------------------------------
// 開啟登入介面
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

    // 按下"點此註冊"後觸發
    convert_to_signup.addEventListener("click", () => {
        login_interface_block.style.visibility = "hidden";
        sinup_interface();
        reset_signup_data();
        original_convert_to_login();
    })
}

//登入成功後的介面
function login_success(name) {
    let background_oppacity = document.getElementById("background_oppacity");
    let login_interface_block = document.getElementById("login_interface_block");
    let login_or_singup = document.getElementById("login_or_singup");
    background_oppacity.style.display = "none";
    login_interface_block.style.visibility = "hidden";
    login_or_singup.style.display = "none";
    member_area.style.display = "inline-block";
    member_area.innerHTML = name + "<div class='shape-line'></div>";
}

//顯示登入失敗原因
function login_fail() {
    let login_status = document.getElementById("login_status");
    login_status.innerText = "帳號或密碼錯誤";
}

// 開啟註冊帳號介面
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

    // 按下"點此登入"後觸發
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
    signup_status.innerText = "註冊成功";
}

// 顯示註冊失敗原因
function signup_fail(error_message) {
    let signup_status = document.getElementById("signup_status");
    signup_status.innerText = error_message;
}

// 點此登入及註冊後，顯示原因區域變成不顯示
function original_convert_to_login() {
    let signup_status = document.getElementById("signup_status");
    let login_status = document.getElementById("login_status");
    signup_status.innerText = "\xa0"
    login_status.innerText = "\xa0";
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