let slide_index = 0;
// --------------------------------------------------controller--------------------------------------------------
// 取得首頁資料
async function attraction_page() {
    let split_url = window.location.href.split("/");
    let url_id = split_url[split_url.length - 1];
    let url = "../api/attraction/" + String(url_id);
    let promise_datas = await fetch_data(url);
    let datas = promise_datas.Data;
    render(datas)
}

// --------------------------------------------------model--------------------------------------------------
// 根據URL取資料
function fetch_data(url) {
    return fetch(url)
    .then(function(response) {
        return response.json()
    })
    .then(function(res){
        return res
    })
}

// --------------------------------------------------view--------------------------------------------------
// 秀該頁出資料
function render(datas) {
    let main_img_wrap = document.getElementById("main_img_wrap");
    let attraction_name = document.getElementById("attraction_name");
    let attraction_address = document.getElementById("attraction_address");
    let attraction_tel = document.getElementById("attraction_tel");
    let introduction = document.getElementById("introduction");
    let introduction_statement = document.createElement("div");
    let introduction_category = document.createElement("div");
    let prev = document.createElement("a");
    let next = document.createElement("a");
    create_preview_img(datas);
    create_all_main_img(datas);
    show_main_img(datas);
    
    prev.setAttribute("class", "prev");
    next.setAttribute("class", "next");
    prev.textContent = "❮";
    next.textContent = "❯";
    attraction_name.textContent = datas.Name;
    attraction_address.textContent = "地址:" + "\xa0\xa0" + datas.Address.substring(4, datas.Address.length);
    attraction_tel.textContent = "電話:" + "\xa0\xa0" + datas.Tell;
    introduction_statement.setAttribute("class", "introduction_statement");
    introduction_category.setAttribute("class", "introduction_category");
    prev.addEventListener('click', () => {
        plus_slides(datas, -1)
    })
    next.addEventListener('click', () => {
        plus_slides(datas, 1)
    })

    main_img_wrap.appendChild(prev);
    main_img_wrap.appendChild(next);
    introduction.appendChild(introduction_statement);
    introduction_statement.textContent = datas.Introduction;
    let categories = "";
    for (let j=0; j<datas.category.length; j++) {
        categories = datas.category[j] + "\xa0\xa0\xa0\xa0" + categories
    };
    introduction_category.textContent =  "主題標籤:\xa0\xa0\xa0\xa0" + categories;
    introduction.appendChild(introduction_category);
}


// 創造預覽圖片列表，先顯示前4張
function create_preview_img(datas) {
    let preview_img_wrap = document.getElementById("preview_img_wrap");
    let repeat_number = 0
    for (let i=0; i<4; i++) {
        let small_img_wrap = document.createElement("div");
        let small_img = document.createElement("img");
        small_img_wrap.setAttribute("class", "small_img_wrap");
        small_img.setAttribute("class", "small_img");
        small_img.src = datas.Image[i];
        if (typeof datas.Image[i] === "undefined") {
            small_img.src = datas.Image[repeat_number];
        }
        preview_img_wrap.appendChild(small_img_wrap);
        small_img_wrap.appendChild(small_img);
    }
    let small_img = document.getElementsByClassName("small_img");
    small_img[0].style.filter = "contrast(100%)"
}

// 預覽圖片列表如何輪播
function slide_preview_img(datas) {
    let small_img = document.getElementsByClassName("small_img");
    console.log(slide_index)
    // 可以讓預覽圖重頭撥放
    if (slide_index <= datas.Image.length-4) {
        for (i=0; i<4; i++) {
            small_img[i].src = datas.Image[slide_index + i];
        }
    }
    else {
        for (i=0; i<4; i++) {
            let number;
            if (slide_index + i < datas.Image.length) {
                number = slide_index + i
            }
            // 如果超過img長度，則從第0張開始撥放
            else {
                number = slide_index + i - datas.Image.length
            }
            if (number >= datas.Image.length) {
                number = 0
            }
            small_img[i].src = datas.Image[number];
        }
    }
}

// 創造中間主要的大圖片並全部先display:none
function create_all_main_img(datas) {
    let main_img_wrap = document.getElementById("main_img_wrap");
    for (let i=0; i<datas.Image.length; i++) {
        let attraction_img_block = document.createElement("div");
        let attraction_img = document.createElement("img");
        attraction_img_block.setAttribute("class", "attraction_img_block");
        attraction_img.setAttribute("class", "attraction_img");
        attraction_img.classList.add("fade");
        attraction_img.src = datas.Image[i];
        main_img_wrap.appendChild(attraction_img_block);
        attraction_img_block.appendChild(attraction_img);
        attraction_img_block.style.display = "none"
    }
}

// 判斷中間顯示哪張大圖片
function show_main_img(datas) {
    let attraction_img_block = document.getElementsByClassName("attraction_img_block");
    for (let i=0; i<datas.Image.length; i++) {
        attraction_img_block[i].style.display = "none"
    }
    attraction_img_block[slide_index].style.display = "flex"
}

// 圖片下/上一張按鈕
function plus_slides(datas, n) {
    slide_index += n;
    if (slide_index > datas.Image.length-1) {
        slide_index = 0;
    }
    else if (slide_index < 0) {
        slide_index = datas.Image.length - 1;
    }
    show_main_img(datas);
    slide_preview_img(datas);
}

function change_heart() {
    let red_heart = document.getElementById("red_heart");
    let white_heart = document.getElementById("white_heart");
    if (white_heart.style.display === "none") {
        white_heart.style.display = "block";
        red_heart.style.display = "none";
    }
    else {
        red_heart.style.display = "block";
        white_heart.style.display = "none";
    }
}