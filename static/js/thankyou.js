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
    let member_status = await get_member_data(headers);
    if(member_status === null){
        window.location.href = "/";
    }
})

async function get_member_data(headers){
    let response = await fetch("/api/members", {
            method: "GET",
            headers: headers
        }
    );
    let res = await response.json();
    return res.data;
}

continue_booking_click.addEventListener("click", () => {
    window.location.href = "/";
})