const { createApp } = Vue;
const BASE_URL = "http://127.0.0.1:8000";

createApp({
    data() {
        return {
            title: "Students of Parc",
            grades: ["A", "B", "C", "D", "E"],
            actionLabel: "Create",
            students: [],
            id: null,
            name: "",
            grade: "",
            showConfirmModal: false,
            selectedStudent: null,
            standard: "",
            errors: {
                name: '',
                grade: "",
                standard: '',
            },
        }
    },
    methods: {
        convertGradeToPercents(grade) {
            const i = this.grades.slice().reverse().indexOf(grade);
            return (i + 1) * (100 / this.grades.length)
        },

        loadStudents() {
            fetch(BASE_URL + "/students")
                .then(response => response.json())
                .then(data => {
                    this.students = data;
                })
                .catch(error => {
                    console.log(error)
                })
        },
        clear() {
            this.name = "";
            this.grade = "";
            this.standard = "";
            this.id = null;
            this.actionLabel = "Create";
        },
        closeModal() {
            this.showConfirmModal = false;
            this.selectedStudent = null;
        },

        checkForPossibleErrors(student) {
            if (student.Name.length === 0) {
                this.errors.name = "Name is required"
            }
            if (student.Grade.length === 0) {
                this.errors.grade = "Grade is required"
            }
            if (student.Standard.length === 0) {
                this.errors.standard = "Standard is required"
            }

            return this.errors.name.length === 0 && this.errors.grade.length === 0 && this.errors.standard.length === 0;
        },

        transferToEdit(idx) {
            this.actionLabel = "Update";
            this.name = this.students[idx].Name;
            this.grade = this.students[idx].Grade;
            this.standard = this.students[idx].Standard;
            this.id = this.student[idx].id;

        },

        selectToDelete(idx) {
            this.selectedStudent = this.students[idx];
            this.showConfirmModal = true;
        },

        deleteStudent(studentId) {
            this.clear();
            this.closeModal();

            const newStudent = {
                ...this.selectedStudent
            };
            const options = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    newStudent
                })
            };
            fetch(BASE_URL + "/students/" + studentId, options)
                .then(response => response.json())
                .then(data => {
                    this.loadStudents();
                })
                .catch(error => {
                    console.log(error)
                    this.loadStudents();

                })
        },

        createStudent() {
            const newStudent = {
                Name: this.name,
                Grade: this.grade,
                Standard: this.standard
            };

            if (!this.checkForPossibleErrors(newStudent)) {
                return;
            }

            if (this.id) {
                fetch(BASE_URL + "/students/" + this.id + '/', {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newStudent)
                })
                    .then(response => response.json())
                    .then(data => {
                        this.loadStudents();
                        this.clear();
                    })
                    .catch(error => {
                        console.log(error)
                    });

                return;
            }

            // console.log(newStudent);
            // return;

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newStudent)
            };

            fetch(BASE_URL + "/students/", options)
                .then(response => response.json())
                .then(data => {
                    this.loadStudents();
                    this.name = "";
                    this.grade = "";
                    this.standard = "";
                })
                .catch(error => {
                    console.log(error)
                });

        }
    },
    created() {
        this.loadStudents();
    }


}).mount("#app");