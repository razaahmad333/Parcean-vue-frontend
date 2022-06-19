const _baseURL = 'http://127.0.0.1:8000/';

const navApp = createApp({
    data() {
        return {
            isAuthenticated: !false,
            user: null
        }
    },

    methods: {
        onLogOut() {
            localStorage.removeItem('token');
            this.isAuthenticated = false;
            this.user = null;
            window.location.href = '/loginPage/index.html';
        }
    },

    created() {
        const token = localStorage.getItem('token');
        if (token) {

            const options = {
                headers: {
                    'Authorization': `Token ${token}`
                }
            }
            fetch(`${_baseURL}parcean/me`, options)
                .then(response => response.json())
                .then(data => {
                    this.user = data;
                    this.isAuthenticated = true;
                })
                .catch(error => {
                    console.log(error);
                })
        }

    }
});

navApp.mount("#navbar")