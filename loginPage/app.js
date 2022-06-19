const { createApp } = Vue;
const BASE_URL = "http://127.0.0.1:8000/parcean/"

createApp({
    data() {
        return {
            title: "Login to Parcean",
            buttonLabel: "Login",
            password: "",
            username: "",
            errors: {
                password: "",
                username: "",
            },
        }
    },
    created() {

    },
    methods: {
        canLoginThisParcean(parcean) {
            const { username, password } = parcean;

            if (username.length === 0) {
                this.errors.username = 'Username is required';
            }
            if (password.length === 0) {
                this.errors.password = 'Password is required';
            }
            if (this.errors.username.length === 0 && this.errors.password.length === 0) {
                return true;
            }
            return false;
        },

        handleRegister() {

            let parcean = {
                username: this.username,
                password: this.password
            }

            if (this.canLoginThisParcean(parcean)) {
                fetch(`${BASE_URL}login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(parcean)
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        localStorage.setItem('token', data.token);
                        this.username = '';
                        this.password = '';
                        window.location.href = '/'

                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
            else {
                console.log('cant register')
                return;
            }

        },
        cancelRegister() {
            console.log('registered cancel')
            window.location.href = '/'
        }
    }
}).mount("#login-page")

