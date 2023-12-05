<template>
    <body>
        <div class="container mt-5">
            <h3>{{ board.title }}</h3>
            <div class="row mb-3">
                <div class="col-md-6">
                    <form>
                        <div class="mb-1">
                            <label for="description1" class="form-label">Description</label>
                            <textarea disabled class="form-control" id="description1">{{ board.description }}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="notes" class="form-label">Notes</label>
                            <textarea disabled class="form-control" id="notes">{{ board.notes }}</textarea>
                        </div>
                    </form>
                </div>
                <div class="col-md-6">
                    <img v-if="board.list_image" :src="board.list_image" alt="Circular Image"
                        style="display:flex; object-fit: cover; height:200px; width: 200px; margin-left: auto; margin-right: auto"
                        class="img rounded w-300 h-300">
                </div>
            </div>
            <button class="btn btn-primary" @click="navToListEdit(board.pk)">Edit the list</button>
            <div class="container">
                <div v-if="tasks.length > 0">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="row justify-content-center">
                            <h4 class="mb-5">Incomplete Tasks</h4>
                            <div class="card mb-3 col-md-5" v-for="task in incompleteTasks" :key="task.pk"
                                v-if="!task?.completion_status" style="background-color: rgba(220,20,60,0.1); margin:5px">
                                <div v-if="!task.completion_status">
                                    <div class="card-body" @click="navToTask(task.pk)">
                                        <h5 class="card-title">Task Title</h5>
                                        <p class="card-text">{{ task.title }}</p>
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">Task Key</h5>
                                        <p class="card-text">{{ task.pk }}</p>
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">Description</h5>
                                        <p class="card-text">{{ task.description }}</p>
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">Assigned User</h5>
                                        <p class="card-text">{{ assignedUsernamesComputed[task.user] || 'Loading...' }}</p>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row justify-content-center">
                            <h4 class="mb-5">Completed Tasks</h4>
                            <div class="card mb-3 col-md-5" v-for="task in completeTasks" :key="task.pk" style="background-color: rgba(20,220,60,0.1); margin:5px">
                                <div v-if="task.completion_status === true">
                                    <div class="card-body" @click="navToTask(task.pk)">
                                        <h5 class="card-title">Task Title</h5>
                                        <p class="card-text">{{ task.title }}</p>
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">Task Key</h5>
                                        <p class="card-text">{{ task.pk }}</p>
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">Description</h5>
                                        <p class="card-text">{{ task.description }}</p>
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">Assigned User</h5>
                                        <p class="card-text">{{ assignedUsernamesComputed[task.user] || 'Loading...' }}</p>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="my-2">
                    <button class="btn btn-success" @click="navToTaskCreate()">Add tasks</button>
                </div>
                </div>
                <div v-else>
                    <div class="row">
                        <div class="col-md-12">
                            <h4 class="my-4">You have no tasks yet.</h4>
                            <button class="btn btn-success" @click="navToTaskCreate()">Add tasks</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</template>
<script>
import router from '../router';
import { APIService } from '../http/APIService';
const apiService = new APIService();

export default {
    name: "MyList",
    data: () => ({
        board: {},
        tasks: [],
        task: {},
        assignedUsernames: {},
        validUserName: "Guest",
        profileSize: 0,
        showMsg: '',
        isMobile: false,
        authenticated: false,
        is_superUser: false,
    }),
    mounted() {
        this.authenticated = localStorage.getItem("isAuthenticated");
        this.validUserName = localStorage.getItem("username");
        this.userID = Number(localStorage.getItem("userID"));
        this.getBoardFromPk();
        this.getTasksFromListPK();
        this.getUser();
        this.showMessages();
    },
    methods: {
        getUser() {
            apiService.getUser().then(response => {
                this.validUserName = response?.data.username
                if (this.validUserName) {
                    localStorage.setItem("username", this.validUserName)
                }
            }).catch(error => { console.error(error) })
        },
        onResize() {
            if (window.innerWidth > 600)
                this.isMobile = false;
            else
                this.isMobile = true;
        },
        showMessages() {
            if (this.$route.params.msg) {
                this.showMsg = this.$route.params.msg;
            }
        },
        getBoardFromPk() {
            apiService.getList(this.$route.params.pk).then(response => {
                this.board = response.data;
                this.boardSize = this.board.length;
                if (this.boardSize != 0) {
                    if (localStorage.getItem("isAuthenticated")
                        && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
                        this.validUserName = JSON.parse(localStorage.getItem("log_user"));
                    }
                }
            }).catch(error => {
                if (error.response?.status === 401) {
                    localStorage.clear();
                    router.push("/auth");
                }
            });
        },
        getTasksFromListPK() {
            apiService.getTasksFromListPK(this.$route.params.pk).then(response => {
                this.tasks = response.data.data;
            }).catch(error => {
                if (error.response?.status === 401) {
                    localStorage.clear();
                    router.push("/auth");
                }
            });
        },
        async getUserFromPK(userId) {
            try {
                const response = await apiService.getUserFromPK(userId);
                const username = response.data.username;
                this.assignedUsernames[userId] = username;
                return username;
            } catch (error) {
                console.error(error);
                return 'Unknown User';
            }
        },
        navToTask(taskpk) {
            router.push('/task/' + taskpk);
        },
        navToTaskCreate() {
            router.push('/task-create/');
        },
        navToListEdit(listpk) {
            router.push('/list-create/' + listpk);
        },
    },
    computed: {
        completeTasks: function () {
            return this.tasks.filter(task => task.completion_status === true)
        },
        incompleteTasks: function () {
            return this.tasks.filter(task => task.completion_status === false)
        },
        assignedUsernamesComputed() {
            return this.tasks.reduce((acc, task) => {
                this.getUserFromPK(task.user).then(username => {
                    this.assignedUsername = username.username;
                });
                acc[task.user] = this.assignedUsernames[task.user] || 'Loading...';
                return acc;
            }, {});
        },
    }
};
</script>
<style>
button {
    padding: 1rem;
    border: 0;
    cursor: pointer;
}

body {
    font-family: bierstadt;
}
</style>
