const BASE_URL = "http://127.0.0.1:8000/";

const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            // isAuthenticated: !false,
            // user: {
            //     name: 'Ahmad',
            // },
            items: [],
            itemsToShow: [],
            newItem: {
                name: "",
                price: null,
                description: "",
                image: "",
                imageURL: {
                    url: '',
                    isValid: false
                },
            },
            search: '',
        }
    },

    methods: {
        clearAddItem() {
            this.newItem = {
                name: "",
                price: "",
                description: "",
                image: "",
                imageURL: {
                    url: '',
                    isValid: false
                }
            }
        },

        searchFilter(e) {
            this.itemsToShow = this.items.filter(item => item.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
        },

        isValidImageURL(e) {
            const url = e.target?.value;
            this.checkForValidImageURL(url, (exists) => {
                this.newItem.imageURL.isValid = exists;
                this.newItem.imageURL.url = url;
                if (exists) {
                    console.log('yes its valid')
                } else {
                    console.log('no its not valid')
                }
            })
        },

        handleItemImage(e) {
            this.newItem.image = e.target.files[0];
        },

        addNewItem() {
            const formData = new FormData();
            const { name, price, description, image, imageURL } = this.newItem;
            formData.append('name', name);
            formData.append('price', price);
            formData.append('description', description);
            if (image) {
                formData.append('image', image, image.name);
            }
            if (imageURL.isValid) {
                formData.append('imageURL', imageURL.url);
            }

            const options = {
                method: 'POST',
                body: formData,

            };
            fetch(BASE_URL + "shops/items", options)
                .then(response => response.json())
                .then(data => {
                    this.clearAddItem();
                    this.loadItems();
                })

        },
        getImageURL(item) {
            if (item.imageURL) {
                return item.imageURL
            }
            return BASE_URL + item.image;
        },
        loadItems() {
            fetch(BASE_URL + "shops/items")
                .then(response => response.json())
                .then(data => {
                    this.items = data;
                    this.itemsToShow = data;
                })
                .catch(error => console.log(error))
        },

        checkForValidImageURL(url, callback) {
            let img = new Image();
            img.src = url;

            if (img.complete) {
                callback(true)
            } else {
                img.onload = () => {
                    callback(true)
                };
                img.onerror = () => {
                    callback(false)
                }
            }
        }
    },

    created() {
        this.loadItems();
    },

    mounted() {

    }

});

app.mount('#app')

// function checkIfImageExists(url, callback) {
//     const img = new Image();
//     img.src = url;

//     if (img.complete) {
//         callback(true);
//     } else {
//         img.onload = () => {
//             callback(true);
//         };

//         img.onerror = () => {
//             callback(false);
//         };
//     }
// }


// // USAGE
// checkIfImageExists('http://website/images/img.png', (exists) => {
//     if (exists) {
//         console.log('Image exists. ')
//     } else {
//         console.error('Image does not exists.')
//     }
// });