//CONFIRMATION PAGE URL
let str = window.location.href;

//ORDER ID
let newUrl = new URL(str);
let orderId = newUrl.searchParams.get('id');

//DISPLAY ORDER ID
document.querySelector('#orderId').innerText = `${orderId}`;