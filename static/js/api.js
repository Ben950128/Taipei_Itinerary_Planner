// controller
async function get_data(){
    url = "api/attractions?page=1";
    datas = await fetch_data(url);
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
    for(i=0;i<12;i++){
        let img_box = document.createElement("div");
        let new_img = document.createElement("img");
        img_box.setAttribute("class","img_box");
        new_img.setAttribute("class","pic");
        url_img = datas[i].Image[0];
        new_img.src = url_img;
        attraction_line.appendChild(img_box);
        img_box.appendChild(new_img);
    }
}