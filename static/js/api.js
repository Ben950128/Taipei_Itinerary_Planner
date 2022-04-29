// 查詢姓名
function search_click(){
    url = "api/attractions/1"
    function fetch_data(){
        fetch(url)
        .then(function(response) {
            return response.json()
        })
        .then(function(res){
            console.log(res)
            console.log(res.Data.Address)
        })
    }
    fetch_data()
}