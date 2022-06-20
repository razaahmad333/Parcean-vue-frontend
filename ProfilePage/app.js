const { createApp } = Vue;

const BASE_URL = "http://127.0.0.1:8000/";


const data = () => {
    return {
        currentUser: null,
        orders: [],
    }
}

const methods = {

    getImageURL(item) {
        if (item.imageURL) {
            return item.imageURL
        }
        return BASE_URL + item.image;
    },

    loadCurrentUser() {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/loginPage/index.html';
        }

        const options = {
            headers: {
                Authorization: "Token " + token
            }
        }


        fetch(`${BASE_URL}parcean/meWithOrders`, options)
            .then(response => response.json())
            .then(data => {
                this.currentUser = data.parcean;
                this.orders = data.orders;
                window.document.title = this.currentUser?.name + " | Parc";
            })
            .catch(error => {
                console.log(error);
            })
    }
};

const lifeCycleMethods = {
    mounted() {
        window.document.title = this.currentUser?.name + " | Parc";
    },

    created() {
        this.loadCurrentUser();
    }
};


const app = createApp({
    data,
    methods,
    ...lifeCycleMethods
});

app.mount('#profile-page');

