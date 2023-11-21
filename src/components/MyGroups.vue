<template>
    <body>
        <div class="container mt-5">
            <h3>My Groups</h3>
            <!-- Non-Mobile device view -->
            <div class="container">
                <div class="row mb-3">
                    <div class="col-md-12">
                        <div class="card-deck d-flex flex-wrap">
                            <div class="card ml-3 col-md-4" v-for="group in groups" :key="group.pk">
                                <div class="card-body">
                                    <h5 class="card-title">Group Title</h5>
                                    <p class="card-text">{{ group.title }}</p>
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Users</h5>
                                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" disabled>{{ group.users }}</textarea>
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Lists</h5>
                                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" disabled>{{ group.lists }}</textarea>
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
    name: "MyGroups",
    data: () => ({
        groups: [],
        group: {},
        users: [],
        user: {},
        boards: [],
        board: {},
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
        this.getMyGroups();
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
        getMyGroups() {
            apiService.getMyGroups().then(response => {
                this.groups = response.data.data;
                this.groupSize = this.group.length;
                if (this.groupSize != 0) {
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
        getListsFromGroup(grouppk) {
            apiService.getListFromGroupPK(grouppk).then(response =>
                this.boards = response.data.data
            ).catch(error => console.error(error))
        },
    },
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
