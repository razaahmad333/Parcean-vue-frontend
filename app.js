const { createApp } = Vue;

const BASE_URL = "http://127.0.0.1:8000/user"

const app = createApp({
    data() {
        return {
            message: 'Hello Vue!',
            isVisible: !true,
            parceans: [],
        }
    },

    created() {
        console.log('created');
        fetch(BASE_URL + "/list")
            .then(response => response.json())
            .then(data => {
                this.parceans = data;
                console.log(data);
            }
            )

    },

    mounted() {
        console.log('mounted');
    }
    ,
    methods: {

        toggleTheBox() {
            this.isVisible = !this.isVisible
        },
        greet() {
            console.log(this.message)
        }
    }

});

app.mount('#app')


