const { createApp } = Vue;

const data = () => {
    return {
        name: 'Ahmad Raza',
        email: '',
        isActive: false
    }
}

const methods = {
    sayHello() {
        console.log('Hello');
    }
};

const lifeCycleMethods = {
    mounted() {
        this.sayHello();
    }
};


const app = createApp({
    data,
    methods,
    ...lifeCycleMethods
});

app.mount('#profile-page');

