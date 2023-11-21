<template>
    <body>
        <div class="container mt-5">
            <h3>My Lists</h3>
            <!-- Non-Mobile device view -->
            <div class="container">
                <div class="row mb-3">
                    <div class="col-md-12">
                        <div class="card-deck d-flex flex-wrap">
                            <div class="card ml-3 col-md-4" v-for="board in boards" :key="board.pk">
                                <div class="card-body" @click="navToList(board)">
                                    <img v-if="board.list_image" :src="board.list_image" alt="Circular Image"
                                        style="object-fit: cover;" class="img rounded" width="100" height="100">
                                    <h5 class="card-title">List Title</h5>
                                    <p class="card-text">{{ board.title }}</p>
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Board PK</h5>
                                    <p class="card-text">{{ board.pk }}</p>
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Description</h5>
                                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" disabled>{{ board.description }}</textarea>
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Description</h5>
                                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" disabled>{{ board.notes }}</textarea>
                                </div>
                            </div>
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
    name: "MyProfile",
    data: () => ({
        boards: [],
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
        this.getMyBoards();
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
            }).catch(error => {console.error(error)})
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
        getMyBoards() {
            apiService.getMyBoards().then(response => {
                this.boards = response.data.data;
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
        navToList(board) {
            router.push('/list/' + board.pk);
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
