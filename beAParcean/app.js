const { createApp } = Vue;
const BASE_URL = "http://127.0.0.1:8000/parcean/"

const data = () => {
    return {

        title: "Be A Parcean",
        buttonLabel: "Register",
        id: null,
        name: '',
        password: "",
        username: "",
        errors: {
            name: '',
            password: "",
            username: "",
        },
    }
}

const watch = {
    name(_) {
        this.errors.name = ""
    },

    password(_) {
        this.errors.password = ""
    },

    username(_) {
        this.errors.username = ""
    }
}

const methods = {
    canRegisterThisParcean(newParcean) {
        const { name, username, password } = newParcean;

        if (password.length === 0) {
            this.$refs.password.focus();
            this.errors.password = 'Password is required';
        }

        if (username.length === 0) {
            this.$refs.username.focus();
            this.errors.username = 'Username is required';
        }

        if (name.length === 0) {
            this.$refs.name.focus();
            this.errors.name = 'Name is required';
        }
        if (this.errors.name.length === 0 && this.errors.username.length === 0 && this.errors.password.length === 0) {
            return true;
        }
        return false;
    },

    handleRegister() {

        let newParcean = {
            name: this.name,
            username: this.username,
            password: this.password
        }

        if (this.canRegisterThisParcean(newParcean)) {
            fetch(`${BASE_URL}create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newParcean)
            })
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
                    localStorage.setItem('token', data.token.key);
                    this.name = '';
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

createApp({ data, watch, methods }).mount("#register-page")

