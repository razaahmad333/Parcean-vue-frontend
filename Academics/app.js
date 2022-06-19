const { createApp } = Vue;
const BASE_URL = "http://127.0.0.1:8000/"
const app = createApp({
    data() {
        return {
            isAuthenticated: !false,
            currentUser: null,
            questions: [],
            newAnswer: {
                text: "",
                question: null,
            },
            editTheAnswer: {
                answerId: null,
                text: "",
            }
        }
    },
    methods: {
        loadCurrentUser() {
            const token = localStorage.getItem('token');
            if (token) {

                const options = {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                }
                fetch(`${BASE_URL}parcean/me`, options)
                    .then(response => response.json())
                    .then(data => {
                        this.currentUser = data;
                        this.isAuthenticated = true;
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        },

        questionSelectedForAnswer(question) {
            this.newAnswer.question = question;
        },

        canEditThisAnswer(answerId) {
            return this.editTheAnswer.answerId === answerId;
        },

        editThisAnswer(answerId, text) {
            this.editTheAnswer.answerId = answerId;
            this.editTheAnswer.text = text;
        },

        saveThisAnswer() {
            console.log(this.editTheAnswer);
            const token = localStorage.getItem('token');
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify(this.editTheAnswer)
            };

            fetch(BASE_URL + "academics/answers/edit/" + this.editTheAnswer.answerId, options)
                .then(response => response.json())
                .then(data => {
                    this.loadQuestions();
                    this.cancelThisAnswer();
                    console.log(data);
                });

        },

        deleteTheAnswer(answerId) {
            const options = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            };

            fetch(BASE_URL + "academics/answers/delete/" + answerId, options)
                .then(response => response.json())
                .then(_ => {
                    this.loadQuestions();
                })
                .catch(error => {
                    console.log(error)
                });

        },

        cancelThisAnswer() {
            this.editTheAnswer.answerId = null;
            this.editTheAnswer.text = "";
        },

        styledDate(date) {
            return moment(date).format('MMMM Do YYYY h:mm a');
        },
        timePassed(date) {
            // console.log(date)
            return moment(date).fromNow();
        },

        loadQuestions() {
            fetch(BASE_URL + "academics/questions")
                .then(response => response.json())
                .then(data => {
                    this.questions = data;
                })
        },
        canSubmitThisAnswer(answer) {
            return answer.text.length > 0 && answer.question !== null;
        },

        upvote(answer) {
            fetch(BASE_URL + "academics/answers/" + answer + "/upvote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(data => {
                    this.loadQuestions();
                })
                .catch(error => {
                    console.log(error)
                })
        },

        handleSubmitNewAnswer() {
            const token = localStorage.getItem("token");
            if (this.canSubmitThisAnswer(this.newAnswer) && token) {
                fetch(BASE_URL + "academics/submit_answer", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Token " + token
                    },
                    body: JSON.stringify(this.newAnswer)
                })
                    .then(response => response.json())
                    .then(data => {
                        this.loadQuestions();
                        this.newAnswer.text = "";
                        this.newAnswer.question = null;
                    }
                    )
            }
        }
    },

    created() {
        this.loadQuestions();
        this.loadCurrentUser();
    }
});

app.mount('#academics');    