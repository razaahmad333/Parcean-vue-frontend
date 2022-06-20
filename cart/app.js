const { createApp } = Vue;
const BASE_URL = "http://127.0.0.1:8000/"


const data = () => {
    return {
        item: null,
        currentUser: null,
        quantity: 1,
    }
}



function loadItem() {
    let params = (new URL(document.location)).searchParams;
    let id = params.get("item");
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/loginPage/index.html';
    }

    const options = {
        headers: {
            Authorization: "Token " + token
        }
    }


    fetch(`${BASE_URL}parcean/me`, options)
        .then(response => response.json())
        .then(data => {
            this.currentUser = data;
        })
        .catch(error => {
            console.log(error);
        })

    if (id) {
        fetch(BASE_URL + "shops/items/" + id, options)
            .then(response => response.json())
            .then(data => {
                this.item = data;
            })
            .catch(error => {
                console.log(error)
            })
    }
}

function buy() {
    const token = localStorage.getItem('token');
    if (token) {

        const data = {
            total: this.quantity * this.item.price,
            item: this.item.id,
            quantity: this.quantity,
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Token " + token
            },
            body: JSON.stringify(data)
        };

        fetch(BASE_URL + "shops/orders", options)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                window.location.href = "/profilePage/index.html";
            })
            .catch(error => {
                console.log(error);
            })
    }
}

function getImageURL(item) {
    if (item.imageURL) {
        return item.imageURL
    }
    return BASE_URL + item.image;
}


const lifeCycleMethods = {
    created() {

        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/loginPage/index.html';
        }
        this.loadItem()
    }
}


const methods = {
    loadItem,
    getImageURL,
    buy
}


createApp({
    data,
    methods,
    ...lifeCycleMethods
}).mount("#cart-page")

