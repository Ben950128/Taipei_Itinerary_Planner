TPDirect.setupSDK("124741", "app_4ONtUGf8blFNVyDTYkljeUa7eN4XpQ67QJKQ7fam8pjflrEwQMu6sRv52NaH", "sandbox");
let trash = document.getElementById("trash");

// --------------------------------------------------control--------------------------------------------------
// 取得booking的資料
window.addEventListener("load", async () => {
    let headers = {
        "Accept": "application/json"
    };
    let datas = await get_booking(headers);

    if (datas.message === "無任何待預定行程") {
        show_no_booking(datas);
    }
    else if(datas.message === "尚未登入系統") {
        window.location.href = "/";
    }
    else {
        show_booking (datas);
    }
})

// 刪除booking的資料
trash.addEventListener("click", async () => {
    let headers = {
        "Accept": "application/json"
    };
    let datas = await delete_booking(headers);
    if (datas.ok === true) {
        show_no_booking(datas);
    }
})

// 確認付款order
function tappay_get_prime(datas, user_phone) {
    TPDirect.card.getPrime(async (result) => {
        if (result.status !== 0) {
            alert("請輸入正確的電話及信用卡資訊")
            return
        }
        let prime = result.card.prime;
        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        let message = {
            "prime": prime,
            "order": {
                "price": datas.cost,
                "trip": {
                    "attraction": {
                        "id": datas.data.attraction_id,
                        "name": datas.data.attraction_name,
                        "address": datas.data.attraction_address.substring(4, datas.data.attraction_address.length),
                        "image": datas.data.attarction_image
                    },
                    "date": datas.date
                },
                "contact": {
                    "name": datas.name,
                    "email": datas.email,
                    "phone": user_phone.value
                }
            }
        }
        let data =  await post_order(headers, message);
        let delete_data = await delete_booking(headers);
        if (delete_data.ok === true) {
            window.location.href = "/thankyou?number=" + data.order_number;
        }
    })
}

// --------------------------------------------------model--------------------------------------------------
//GET方法取得booking資料
async function get_booking(headers) {
    let response = await fetch("/api/booking", {
        method: "GET",
        headers: headers
    });
    let res = await response.json();
    return res;
}

//DELETE方法刪除booking資料
async function delete_booking(headers) {
    let response = await fetch("/api/booking", {
        method: "DELETE",
        headers: headers
    });
    let res = await response.json();
    return res;
}

//POST方法取得order資料
async function post_order(headers, message) {
    let response = await fetch("/api/order", {
        method: "POST",
        body: JSON.stringify(message),
        headers: headers
    });
    let res = await response.json();
    return res;
}

// --------------------------------------------------view--------------------------------------------------
function show_booking (datas) {
    let hello_name = document.getElementById("hello_name");
    let booking_img = document.getElementById("booking_img");
    let attraction = document.getElementById("attraction");
    let date = document.getElementById("date");
    let phone = document.getElementById("phone");
    let address = document.getElementById("address");
    let cost = document.getElementById("cost");
    let contact_name = document.getElementById("contact_name");
    let contact_email = document.getElementById("contact_email");
    let user_phone = document.getElementById("user_phone");
    let total_price_span = document.getElementById("total_price_span");
    let pay_money_block = document.getElementById("pay_money_block");

    hello_name.innerText = datas.name;
    booking_img.src = datas.data.attraction_image;
    attraction.innerText = datas.data.attraction_name;
    date.innerText = datas.date;
    phone.innerText = datas.data.attraction_tell;
    address.innerText = datas.data.attraction_address.substring(4, datas.data.attraction_address.length);
    cost.innerText = datas.cost;
    contact_name.placeholder = datas.name;
    contact_email.placeholder = datas.email;
    user_phone.addEventListener("input", () => {
        let re = /^09[0-9]{8}$/;
        if (re.test(user_phone.value)) {
            user_phone.style.color = "green";
        }
        else {
            user_phone.style.color = "red";
        }
    })
    total_price_span.innerText = datas.cost + "元";

    //確認付款的addEventListener
    pay_money_block.addEventListener("click", () => {
        tappay_get_prime(datas, user_phone);
    })

    //TapPay外觀
    let fields = {
        number: {
            element: "#card-number",
            placeholder: "**** **** **** ****"
        },
        expirationDate: {
            element: document.getElementById("card-expiration-date"),
            placeholder: "MM / YY"
        },
        ccv: {
            element: "#card-ccv",
            placeholder: "ccv"
        }
    }
    
    let styles = {
        "input": {
            "color": "gray"
        },
        ":focus": {
            "color": 'black'
        },
        ".valid": {
            "color": "green"
        },
        ".invalid": {
            "color": "red"
        }
    }
    
    TPDirect.card.setup({
        fields: fields,
        styles: styles
    })
}

function show_no_booking(datas) {
    let main_wrap = document.getElementById("main_wrap");
    let hello_name = document.getElementById("hello_name");
    let booking_detail_block = document.getElementById("booking_detail_block");
    let user_detail_block = document.querySelectorAll(".user_detail_block");
    let bottom_hr = document.querySelectorAll(".bottom_hr");
    let no_booking_span = document.createElement("span");
    let click_to_booking_block = document.createElement("div");
    let click_to_booking = document.createElement("div");

    booking_detail_block.style.display = "none";
    user_detail_block.forEach(item => {
        item.style.display = "none"
    });
    bottom_hr.forEach(item => {
        item.style.display = "none"
    });

    no_booking_span.setAttribute("class", "no_booking");
    click_to_booking_block.setAttribute("class", "click_to_booking_block");
    click_to_booking.setAttribute("class", "click_to_booking");
    main_wrap.appendChild(no_booking_span);
    main_wrap.appendChild(click_to_booking_block);
    click_to_booking_block.appendChild(click_to_booking);
    hello_name.innerText = datas.name;
    no_booking_span.innerText = "目前無任何待預定行程";
    click_to_booking.innerText = "前往預定行程"
    click_to_booking.addEventListener("click", () => {
        window.location.href = "/";
    })
}