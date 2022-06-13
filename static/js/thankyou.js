let order_id = document.getElementById("order_id");
let continue_booking_click = document.getElementById("continue_booking_click");
let split_url = window.location.href.split("number=");
let number = split_url[split_url.length - 1];
order_id.innerText = number;

window.addEventListener("load", async () => {
    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    // get_member_data()為member.js裡的函式
    let member_status = await get_member_data(headers);
    if(member_status === null){
        window.location.href = "/";
    }
})

continue_booking_click.addEventListener("click", () => {
    window.location.href = "/";
})