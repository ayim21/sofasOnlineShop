/* DOM element */

function createProductCard(item) {
    for (let i = 0; i < item.length; i++) {
        let anchor = document.createElement('a');
        let sectionContainer = document.getElementById('items');
        sectionContainer.appendChild(anchor);
        anchor.setAttribute('href', `./product.html?id=${item[i]._id}`);
        /* create cardContent */
        anchor.innerHTML = 
            `<article>
                <img src="${item[i].imageUrl}" alt="${item[i].altTxt}">
                <h3 class="productName">${item[i].name}</h3>
                <p class="productDescription">${item[i].description}</p>
            </article>`;
    }
};

/* API call */

//Endpoint to getALlProducts
let url = 'http://localhost:3000/api/products';

fetch(url)
    .then((res) => {
        if (res.ok) return res.json();
    })
    .then((item) => {
        console.log(item);
        createProductCard(item);
    })
    .catch((err) => {
            let message = document.createElement('h3');
            let sectionContainer = document.getElementById('items');
            sectionContainer.appendChild(message);
            message.innerText = 'Une erreur est survenue';
    })