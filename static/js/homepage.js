let page_now = 1;
let click_paging = document.querySelectorAll(".page_icon");
let select_distric = document.getElementById("select_distric");
let search_attraction_input = document.getElementById("search_attraction_input");
let search_attraction_buttun = document.getElementById("search_attraction_buttun");


// 分頁頁碼的addEventListener
click_paging.forEach(item => {
    item.addEventListener('click', event => {
        let click_page_textContent = event.target.textContent;
        specify_page(click_page_textContent);
    })
})

// 選擇行政區的addEventListener，選擇行政區當下頁數從第一頁開始
select_distric.addEventListener('change', () => {
    search_attraction_input.value = '';
    page = 1;
    specify_page(page);
})

// 輸入關鍵字的addEventListener
search_attraction_buttun.addEventListener('click', () => {
    select_distric.value = "請選擇區域";
    page = 1;
    specify_page(page);
})

// 按下enter key便可查詢
search_attraction_input.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
    select_distric.value = "請選擇區域";
    page = 1;
    specify_page(page);
    }
})

// --------------------------------------------------controller--------------------------------------------------
// 取得首頁資料
async function first_page() {
    search_attraction_input.value = "";
    select_distric.value = "請選擇區域";
    let url = "api/attractions?page=1";
    let promise_datas = await fetch_data(url);
    let datas = promise_datas.Data;
    render(datas);
}

// 取得指定頁面資料
async function specify_page(click_page_textContent) {
    page_now = determine_page(click_page_textContent);
    
    if (search_attraction_input.value === "") {
        if (select_distric.value === "請選擇區域") {
            url = "./api/attractions?page=" + String(page_now);
        }
        else {
            url = "./api/attractions?page=" + String(page_now) + "&distric=" + select_distric.value;
        }
    }
    else{
        url = "./api/attractions?page=" + String(page_now) + "&keyword=" + search_attraction_input.value;
    }
    let promise_datas = await fetch_data(url);
    let datas = promise_datas.Data;
    let max_page = promise_datas.AllPage;
    change_page_icon_number(max_page);
    reset_render();
    render(datas);
    next_previous_display_icon(max_page);
    window.scrollTo({top: 400, behavior: 'smooth'});
}

// 判斷下一頁跟上一頁的按鈕是否要顯示
function next_previous_display_icon(max_page) {
    if (page_now === 1 && page_now === max_page){
        delete_next_page_icon();
        delete_previous_page_icon();
    }
    // 搜尋關鍵字未出現結果時max_page會=0
    else if (max_page === 0 && page_now === 1){
        delete_next_page_icon();
        delete_previous_page_icon();
    }
    else if (page_now === 1){
        delete_previous_page_icon();
        show_next_page_icon();
    }
    else if (page_now === max_page){
        show_previous_page_icon();
        delete_next_page_icon();
    }
    else {
        show_previous_page_icon();
        show_next_page_icon();
    }
}

// 按下分頁、上一頁、下一頁按鈕後判斷需載入哪一頁的資料
function determine_page(click_page_textContent) {
    if (click_page_textContent === "上一頁") {
        page_now = page_now - 1;
    }
    else if(click_page_textContent === "下一頁") {
        page_now = page_now + 1;
    }
    else {
        let int_click_page_textContent = parseInt(click_page_textContent);
        page_now = int_click_page_textContent;
    }

    return page_now
}

// --------------------------------------------------model-------------------------------------------------
// 根據URL取資料
async function fetch_data(url) {
    let response = await fetch(url);
    let res = await response.json();
    return res;
}

// --------------------------------------------------view--------------------------------------------------
// 秀該頁出資料
function render(datas) {
    let main_wrap = document.getElementById("main_wrap");
    let attraction_wrap = document.createElement("div");
    attraction_wrap.setAttribute("id", "attraction_wrap");
    if (datas.length === 0) {
        let no_data = document.createElement("div");
        no_data.setAttribute("class", "no_data");
        no_data.textContent = "查無資料，請重新輸入";
        main_wrap.appendChild(attraction_wrap);
        attraction_wrap.appendChild(no_data);
    }
    else {
        for (let i=0; i<datas.length; i++){
            let img_wrap = document.createElement("div");
            let img_box = document.createElement("div");
            let attraction_img = document.createElement("img");
            let name_distric_box = document.createElement("div");
            let attraction_name = document.createElement("div");
            let attraction_distric = document.createElement("div");
            let attraction_category = document.createElement("div");
            img_wrap.addEventListener('click', () => {
                window.location.href = "./attraction/" + datas[i].ID;
            })

            img_wrap.setAttribute("class", "img_wrap");
            img_box.setAttribute("class", "img_box");
            attraction_img.setAttribute("class", "attr_image");
            name_distric_box.setAttribute("class", "name_distric_box");
            attraction_name.setAttribute("class", "name_left");
            attraction_distric.setAttribute("class", "district_right");
            attraction_category.setAttribute("class", "category_left");

            data_img = datas[i].Image[0];
            attraction_img.src = data_img;
            data_name = datas[i].Name;
            data_distric = datas[i].Distric;
            attraction_name.innerText = data_name;
            attraction_distric.innerText = data_distric;
            let data_category = '';
            if (datas[i].category.length == 1){
                data_category = datas[i].category[0]
            } 
            else {
                for (let j=0; j<2; j++) {
                    data_category = datas[i].category[j] + '\xa0\xa0\xa0\xa0' + data_category
                }
            }
            attraction_category.innerText = data_category;

            main_wrap.appendChild(attraction_wrap);
            attraction_wrap.appendChild(img_wrap);
            img_wrap.appendChild(img_box);
            img_box.appendChild(attraction_img);
            img_wrap.appendChild(name_distric_box);
            name_distric_box.appendChild(attraction_name);
            name_distric_box.appendChild(attraction_distric);
            img_wrap.appendChild(attraction_category);
        }
    }
}

// 進到下一頁前會先前一頁的資料全刪掉
function reset_render() {
    let attraction_wrap = document.getElementById("attraction_wrap");
    attraction_wrap.remove();
}

// 刪除下一頁的按鈕
function delete_next_page_icon() {
    let next_page_icon = document.getElementById("next_page_icon");
    next_page_icon.style.display = 'none';
}

// 顯示下一頁的按鈕
function show_next_page_icon() {
    let next_page_icon = document.getElementById("next_page_icon");
    next_page_icon.style.display = 'block';
}

// 刪除上一頁的按鈕
function delete_previous_page_icon() {
    let previous_page_icon = document.getElementById("previous_page_icon");
    previous_page_icon.style.display = 'none';
}

// 顯示上一頁的按鈕
function show_previous_page_icon() {
    let previous_page_icon = document.getElementById("previous_page_icon");
    previous_page_icon.style.display = 'block';
}

// 更改分頁頁碼
function change_page_icon_number(max_page) {
    let change_page_icon_number = document.querySelectorAll(".page_icon.specify_page")
    let modify_number = -2
    for (let i=0; i<5; i++) {
        change_page_icon_number[i].textContent = page_now + modify_number
        modify_number++
        let page_icon_text = change_page_icon_number[i].textContent
        if (page_icon_text < 1 || page_icon_text > max_page) {
            change_page_icon_number[i].style.display = 'none'
        }
        else {
            change_page_icon_number[i].style.display = 'block'
        }
    }
    change_page_icon_number[2].style.backgroundColor = '#deecf5';
}
