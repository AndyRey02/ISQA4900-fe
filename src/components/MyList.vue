<template>
    <body>
    <div class="container">
        <div class="row align-items-center justify-content-center">
            <div class="col col-12 align-items-center justify-content-center">
                <blockquote class="p-2 bg-success text-dark">
                    Welcome <strong>{{ validUserName }}</strong> to your boards!
                </blockquote>
            </div>
        </div>
        <!--non-Mobile device view-->
        <div class="container" v-for="board in boards" v-bind:key="board">
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="col-md-4">
                            <label for="disabledTextInput" class="form-label">Board Title</label>
                            <div type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
                                {{ board.title }}</div>
                        </div>
                        <div class="col-md-4">
                            <label for="disabledTextInput" class="form-label">Board PK</label>
                            <div type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
                                {{ board.pk }}</div>
                        </div>
                        <div class="col-md-4">
                            <label for="disabledTextInput" class="form-label">First name</label>
                            <div type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
                                {{ board.description }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="this.authenticated === 'true'" style="margin-top:20px">
                <button type="button" class="btn btn-primary" @click="updateProfile(profile)">Update my profile</button>
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
