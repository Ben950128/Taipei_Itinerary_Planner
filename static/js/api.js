// controller
let page_now = 1;
async function first_page(){
    url = "api/attractions?page=1";
    promise_datas = await fetch_data(url);
    datas = promise_datas.Data;
    render(datas);
}
async function next_page(){
    page_now = page_now + 1;
    url = "api/attractions?page=" + String(page_now);
    promise_datas = await fetch_data(url);
    datas = promise_datas.Data;
    reset_render();
    render(datas);
    window.scrollTo({top: 400, behavior: 'smooth'});
    show_previous_page_icon();
    if (page_now === promise_datas.AllPage){
        delete_next_page_icon()
    }
}

async function previous_page(){
    page_now = page_now - 1;
    url = "api/attractions?page=" + String(page_now);
    promise_datas = await fetch_data(url);
    datas = promise_datas.Data;
    reset_render();
    render(datas);
    window.scrollTo({top: 400, behavior: 'smooth'});
    show_next_page_icon();
    if (page_now === 1){
        delete_previous_page_icon()
    }
}


// model
// 根據URL取資料
function fetch_data(){
    return fetch(url)
    .then(function(response) {
        return response.json()
    })
    .then(function(res){
        return res
    })
}

// view
// 秀出資料
function render(datas){
    let main_line = document.getElementById("main_line");
    let attraction_line = document.createElement("div");
    attraction_line.setAttribute("id", "attraction_line");

    for (let i=0; i<datas.length; i++){
        let img_box = document.createElement("div");
        let name_distric_box = document.createElement("div");
        let attraction_img = document.createElement("img");
        let attraction_name = document.createElement("div");
        let attraction_distric = document.createElement("div");
        let attraction_category = document.createElement("div");

        img_box.setAttribute("class", "img_box");
        attraction_img.setAttribute("class", "attr_image");
        name_distric_box.setAttribute("class", "name_distric_box");
        attraction_name.setAttribute("class", "name_left");
        attraction_distric.setAttribute("class", "distinct_right");
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

        main_line.appendChild(attraction_line);
        attraction_line.appendChild(img_box);
        img_box.appendChild(attraction_img);
        img_box.appendChild(name_distric_box);
        name_distric_box.appendChild(attraction_name);
        name_distric_box.appendChild(attraction_distric);
        img_box.appendChild(attraction_category);
    }
}

// 進到下一頁前會先前一頁的資料全刪掉
function reset_render(){
    let attraction_line = document.getElementById("attraction_line");
    attraction_line.remove();
}

// 刪除下一頁的按鈕
function delete_next_page_icon(){
    let next_page_icon = document.getElementById("next_page_icon");
    next_page_icon.style.display = 'none';
}

// 顯示下一頁的按鈕
function show_next_page_icon(){
    let next_page_icon = document.getElementById("next_page_icon");
    next_page_icon.style.display = 'block';
}

// 刪除上一頁的按鈕
function delete_previous_page_icon(){
    let previous_page_icon = document.getElementById("previous_page_icon");
    previous_page_icon.style.display = 'none';
}

// 顯示上一頁的按鈕
function show_previous_page_icon(){
    let previous_page_icon = document.getElementById("previous_page_icon");
    previous_page_icon.style.display = 'block';
}