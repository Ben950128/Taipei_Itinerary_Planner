// controller
async function get_data(){
    url = "api/attractions?page=1";
    datas = await fetch_data(url);
    console.log(datas)
    console.log(datas[0].Image[0])
    render(datas);
}

// model
function fetch_data(){
    return fetch(url)
    .then(function(response) {
        return response.json()
    })
    .then(function(res){
        return res.Data
    })
}

// view
function render(datas){
    let attraction_line = document.getElementById("attraction_line");
    for (let i=0; i<12; i++){
        let img_box = document.createElement("div");
        let name_distric_box = document.createElement("div");
        let attraction_img = document.createElement("img");
        let attraction_name = document.createElement("div");
        let attraction_distric = document.createElement("div");
        let attraction_category = document.createElement("div");

        img_box.setAttribute("class","img_box");
        attraction_img.setAttribute("class","attr_image");
        name_distric_box.setAttribute("class","name_distric_box");
        attraction_name.setAttribute("class","attr_left");
        attraction_distric.setAttribute("class","attr_right");
        attraction_category.setAttribute("class","attr_left");

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

        attraction_line.appendChild(img_box);
        img_box.appendChild(attraction_img);
        img_box.appendChild(name_distric_box);
        name_distric_box.appendChild(attraction_name);
        name_distric_box.appendChild(attraction_distric);
        img_box.appendChild(attraction_category);
    }
}