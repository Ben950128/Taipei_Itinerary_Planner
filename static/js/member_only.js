let main_wrap = document.getElementById("main_wrap");
// --------------------------------------------------control--------------------------------------------------
// 讀取已訂購行程
window.addEventListener("load", async () => {
    let headers = {
        "Accept": "application/json"
    };
    let datas = await get_order(headers);
    console.log(datas);
    if (datas.message === "尚無已預定行程") {
        show_no_order();
    }
    else {
        let data_length = Object.keys(datas).length;
        show_order(datas, data_length);
    }
})


// --------------------------------------------------model--------------------------------------------------
// GET方法取得order資料
async function get_order(headers) {
    let response = await fetch("/api/order", {
        method: "GET",
        headers: headers
        }
    );
    let res = await response.json();
    return res;
}

// --------------------------------------------------view--------------------------------------------------
// 呈現已order資料
function show_order(datas, data_length) {
    for (let i = 0; i < data_length; i++) {
        let order_info = "data" + String(i);
        let bottom_line = document.createElement("div");
        let order_id_block = document.createElement("div");
        let order_span = document.createElement("span");
        let order_id = document.createElement("span");
        let order_block = document.createElement("div");
        let order_image_block = document.createElement("div");
        let order_image = document.createElement("img");
        let order_detail_block = document.createElement("div");
        let attarction_date = document.createElement("div");
        let attarction_name = document.createElement("div");
        let attarction_address = document.createElement("div");
        let name = document.createElement("div");
        let contact_phone = document.createElement("div");
        let attarction_cost = document.createElement("div");

        bottom_line.setAttribute("id", "bottom_line");
        order_id_block.setAttribute("id", "order_id_block");
        order_span.setAttribute("id", "order_span");
        order_id.setAttribute("id", "order_id");
        order_block.setAttribute("id", "order_block")
        order_image_block.setAttribute("id", "order_image_block");
        order_image.setAttribute("id", "order_image");
        order_detail_block.setAttribute("id", "order_detail_block");
        attarction_date.setAttribute("class", "order_text");
        attarction_name.setAttribute("class", "order_text");
        attarction_address.setAttribute("class", "order_text");
        contact_phone.setAttribute("class", "order_text");
        name.setAttribute("class", "order_text");
        attarction_cost.setAttribute("class", "order_text");
        order_span.innerText = "訂單編號 :\xa0";
        order_id.innerText = datas[order_info].order_id;
        order_image.src = datas[order_info].attarction_image;
        attarction_date.innerText = "出發日期 :\xa0" + datas[order_info].attarction_date;
        attarction_name.innerText = "景點名稱 :\xa0" + datas[order_info].attarction_name;
        attarction_address.innerText = "景點地址 :\xa0" + datas[order_info].attarction_address.substring(4, datas[order_info].attarction_address.length);
        name.innerText = "聯絡姓名 :\xa0" + datas[order_info].name;
        contact_phone.innerText = "聯絡手機 :\xa0" + datas[order_info].contact_phone;
        attarction_cost.innerText = "費用 :\xa0" + datas[order_info].attarction_cost;

        main_wrap.appendChild(bottom_line);
        main_wrap.appendChild(order_id_block);
        order_id_block.appendChild(order_span);
        order_id_block.appendChild(order_id);
        main_wrap.appendChild(order_block);
        order_block.appendChild(order_image_block);
        order_image_block.appendChild(order_image);
        order_block.appendChild(order_detail_block);
        order_detail_block.appendChild(attarction_date);
        order_detail_block.appendChild(attarction_name);
        order_detail_block.appendChild(attarction_address);
        order_detail_block.appendChild(name);
        order_detail_block.appendChild(contact_phone);
        order_detail_block.appendChild(attarction_cost);
    }
    
}

//呈現無預定資料
function show_no_order() {
    let no_order = document.createElement("div");
    no_order.setAttribute("id", "no_order");
    no_order.innerText = "目前尚無預定行程"
    main_wrap.appendChild(no_order);
}