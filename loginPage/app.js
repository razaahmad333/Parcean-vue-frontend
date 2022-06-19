const { createApp } = Vue;
const BASE_URL = "http://127.0.0.1:8000/parcean/"


const watch = {
    password(_) {
        this.errors.password = ""
    },

    username(_) {
        this.errors.username = ""
    }
}


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

    watch,

    methods: {
        canLoginThisParcean(parcean) {
            const { username, password } = parcean;

            if (password.length === 0) {
                this.errors.password = 'Password is required';
            }
            if (username.length === 0) {
                this.errors.username = 'Username is required';
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
                        if (data.token) {
                            localStorage.setItem('token', data.token);
                            this.username = '';
                            this.password = '';
                            window.location.href = '/'
                        }

                        if (data.passwordIsNotCorrect) {
                            this.errors.password = 'Password is not correct';
                            this.$refs.password.focus();
                        }

                        if (data.usernameIsDoesNotExists) {
                            this.errors.username = 'Username do not exists in database';
                            this.$refs.username.focus();
                        }

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

