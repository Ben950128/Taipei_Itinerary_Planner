let main_wrap = document.getElementById("main_wrap");
// --------------------------------------------------control--------------------------------------------------
// 讀取已訂購行程
window.addEventListener("load", async () => {
    let headers = {
        "Accept": "application/json"
    };
    let datas = await get_order(headers);
    let data_length = Object.keys(datas).length
    console.log(datas);
    show_order(datas, data_length);
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
        console.log(datas[order_info]);
        let order_id_block = document.createElement("div");
        let order_span = document.createElement("span");
        let order_id = document.createElement("span");
        order_id_block.setAttribute("")
    }
    
}