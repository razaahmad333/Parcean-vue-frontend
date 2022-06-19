const { createApp } = Vue;
const BASE_URL = "http://127.0.0.1:8000/user"

createApp({
    data() {
        return {
            title: "Register With Us",
            buttonLabel: "Register",
            id: null,
            fname: '',
            lname: '',
            email: "",
            upi: "",
            password: "",
            username: "",
            description: "",
            errors: {
                fname: '',
                password: "",
                lname: '',
                email: '',
                upi: '',
                username: "",
                description: "",
            },
            isVisible: !true
        }
    },
    created() {
        let params = (new URL(document.location)).searchParams;
        let id = params.get("id");
        console.log(id)

        if (id) {
            this.title = "Update ";
            this.id = id;
            this.buttonLabel = "Update";
            fetch(BASE_URL + "/" + id)
                .then(response => response.json())
                .then(data => {
                    this.fname = data.fname;
                    this.lname = data.lname;
                    this.email = data.email;
                    this.upi = data.upi;
                    this.password = data.password;
                    this.username = data.username;
                }
                )
                .catch(error => {
                    console.log(error)
                }
                )
        }
    },
    methods: {
        handleRegister() {
            if (this.fname.length === 0) {
                this.errors.fname = 'First name is required'
            }
            if (this.lname.length === 0) {
                this.errors.lname = 'Last name is required'
            }
            if (this.email.length === 0) {
                this.errors.email = 'Email is required'
            }
            if (this.upi.length === 0) {
                this.errors.upi = 'UPI is required'
            }
            if (this.username.length === 0) {
                this.errors.username = 'Username is required'
            }
            if (this.password.length === 0) {
                this.errors.password = 'Password is required'
            }
            if (this.description.length === 0) {
                this.errors.description = 'Description is required'
            }


            let canRegister = false;

            if (this.errors.fname.length === 0 && this.errors.description.length === 0 && this.errors.lname.length === 0 && this.errors.email.length === 0 && this.errors.upi.length === 0 && this.errors.username.length === 0 && this.errors.password.length === 0) {
                canRegister = true;
            }

            if (!canRegister) {
                return;
            }

            if (this.id) {
                fetch(BASE_URL + "/edit", {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: this.id,
                        fname: this.fname,
                        lname: this.lname,
                        email: this.email,
                        upi: this.upi,
                        password: this.password,
                        username: this.username,
                        description: this.description
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        if (data.status === "success") {
                            alert("User updated successfully")
                            window.location.href = "/";
                        }
                    }
                    )
                    .catch(error => {
                        console.log(error)
                    }
                    )
            } else {
                fetch(BASE_URL + "/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "fname": this.fname,
                        "lname": this.lname,
                        "email": this.email,
                        "upi": this.upi,
                        "username": this.username,
                        "password": this.password,
                        "description": this.description
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                    }
                    )
                    .catch(error => {
                        console.log(error)
                    }
                    )
            }
        },
        cancelRegister() {
            console.log('registered cancel')
            window.location.href = '/'
        }
    }
}).mount("#register-page")

