<template>
    <body>
        <div class="container" v-if="profile.private == false || is_superuser == true">
            <div class="row align-items-center justify-content-center">
                <div class="col col-12 align-items-center justify-content-center">
                    <blockquote class="p-2 bg-warning text-dark">
                        Welcome to <strong>{{ profileUser.username }}'s</strong> user profile!
                    </blockquote>
                </div>
            </div>
            <!--non-Mobile device view-->
            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                        <form class="row g-3">
                            <div class="col-md-4">
                                <label for="disabledTextInput" class="form-label">First name</label>
                                <div type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
                                    {{ profile.first_name }}</div>
                            </div>
                            <div class="col-md-4">
                                <label for="disabledTextInput" class="form-label">Last name</label>
                                <div type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
                                    {{ profile.last_name }}</div>
                            </div>
                            <div class="col-md-4">
                                <label for="disabledTextInput" class="form-label">Username</label>
                                <div type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
                                    {{ profileUser.username }}</div>
                            </div>
                            <div class="col-12">
                                <label for="disabledTextInput" class="form-label">Biography</label>
                                <div type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
                                    {{ profile.bio }}</div>
                            </div>
                            <div class="col-md-2">
                                <label for="disabledTextInput" class="form-label">Private?</label>
                                <div type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
                                    {{ profile.private }}</div>
                            </div>
                            <div class="col-md-8">
                                <label for="disabledTextInput" class="form-label">Email</label>
                                <div type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
                                    {{ profile.email }}</div>
                            </div>
                            <div class="col-md-2">
                                <label for="disabledTextInput" class="form-label">#</label>
                                <div type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
                                    {{ profile.pk }}</div>
                            </div>
                        </form>
                    </div>
                    <div class="col-md-6"> <img :src="profile.image" alt="Circular Image" style="object-fit: cover;"
                            class="img rounded-circle" width="300" height="300"> </div>
                </div>
            </div>
        </div>
        <div v-if="profile.private == true" class="container">
            <div class="row align-items-center justify-content-center">
                <div class="col col-12 align-items-center justify-content-center">
                    <div class="alert alert-danger shadow" role="alert" v-if="is_superuser == false">
                        This profile is private.
                    </div>
                    <div class="alert alert-danger shadow" role="alert" v-if="is_superuser == true">
                        You are seeing this profile because you are a superuser. Do not share this page with anyone. Your
                        userID is {{ validUserName }}.
                    </div>
                    <button type="button" class="btn btn-success" @click="returnHome">Return Home</button>
                </div>
            </div>
        </div>
    </body>
</template>
<script>
import router from '../router';
import { APIService } from '../http/APIService';
import { faCropSimple } from '@fortawesome/free-solid-svg-icons';
const apiService = new APIService();

export default {
    name: "MyProfile",
    data: () => ({
        profile: [],
        profileUser: [],
        validUserName: "Guest",
        profileSize: 0,
        profileUserSize: 0,
        showMsg: '',
        isMobile: false,
        authenticated: false,
        is_superuser: false,
        headers: [
            { text: 'Profile PK', sortable: false, align: 'left', },
            { text: 'Private', sortable: false, align: 'left', },
            { text: 'User PK', sortable: false, align: 'left', },
            { text: 'First Name', sortable: false, align: 'left', },
            { text: 'Last Name', sortable: false, align: 'left', },
            { text: 'Biography', sortable: false, align: 'left', },
            { text: 'Email', sortable: false, align: 'left', },
            { text: 'Update', sortable: false, align: 'left', },
            { text: 'Delete', sortable: false, align: 'left', }
        ],
    }),
    mounted() {
        this.getProfile();
        this.showMessages();
        this.is_superuser = (localStorage.getItem("is_superuser") === "true")
    },
    methods: {
        onResize() {
            if (window.innerWidth > 600)
                this.isMobile = false;
            else
                this.isMobile = true;
        },
        returnHome() {
            router.push('/');
        },
        showMessages() {
            if (this.$route.params.msg) {
                this.showMsg = this.$route.params.msg;
            }
        },
        getUserFromPK(pk) {
            apiService.getUserFromPK(pk).then(response => {
                this.profileUser = response.data;
                this.profileUserSize = this.profileUser.length;
                if (this.profileUserSize != 0) {
                    if (localStorage.getItem("isAuthenticated")
                        && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
                    }
                }
            }).catch(error => {
                if (error.response.status === 401) {
                    localStorage.clear();
                    router.push("/auth");
                }
            });
        },
        getProfile() {
            apiService.getProfile(this.$route.params.pk).then(response => {
                this.profile = response.data;
                this.profileSize = this.profile.length;
                if (this.profileSize != 0) {
                    if (localStorage.getItem("isAuthenticated")
                        && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
                        this.validUserName = JSON.parse(localStorage.getItem("log_user"));
                        this.getUserFromPK(this.profile.user)
                    }
                }
            }).catch(error => {
                if (error.response.status === 401) {
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
