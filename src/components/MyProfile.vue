<template>
    <body>
    <div class="container">
        <div class="row align-items-center justify-content-center">
            <div class="col col-12 align-items-center justify-content-center">
                <blockquote class="p-2 bg-success text-dark">
                    Welcome <strong>{{ validUserName }}</strong> to your user profile!
                </blockquote>
            </div>
            <div class="col-12 col-md-10 col-lg-10 col-12 align-items-center justify-content-center">
                <div class="alert alert-success" v-if="showMsg === 'new'" :value="true">
                    New profile has been added.
                </div>
                <div class="alert alert-success" v-if="showMsg === 'update'" :value="true">
                    Profile information has been updated.
                </div>
                <div class="alert alert-success" v-if="showMsg === 'deleted'" :value="true">
                    Selected profile has been deleted.
                </div>
            </div>
        </div>
        <!--non-Mobile device view-->
        <div class="container" v-for="profile in profiles" v-bind:key="profile">
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
                                {{ validUserName }}</div>
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
                <div class="col-md-6"> <img :src="profile.image" alt="Circular Image" style="object-fit: cover;" class="img rounded-circle" width="300"
                        height="300"> </div>
            </div>
            <div style="margin-top: 20px">
                <div class="card w-25" style="padding: 1%; margin:auto">
                    <div class="card-body" v-if="getCurrentTasks(tasks)">
                        <p class="card-title">Remaining Tasks:</p>
                        <div v-for="task in tasks" v-bind:key="task">
                            <p class="card-text" v-if="task.completion_status != true">{{ task.title }}
                            </p>
                        </div>
                    </div>
                    <div class="card-body" v-else>
                        <p class="card-title">There are no remaining tasks. <br>😀</p>
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
        profiles: [],
        tasks: [],
        tasksAssigned: [],
        validUserName: "Guest",
        profileSize: 0,
        showMsg: '',
        isMobile: false,
        authenticated: false,
        is_superUser: false,
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
        this.authenticated = localStorage.getItem("isAuthenticated");
        this.is_superuser = localStorage.getItem("is_superuser");
        this.validUserName = localStorage.getItem("username");
        this.userID = Number(localStorage.getItem("userID"));
        this.getMyProfile();
        this.getMyTasks();
        this.showMessages();
    },
    methods: {
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
        getCurrentTasks(tasks) {
            let notcompletedtasks = tasks.filter((task) => { return !task.completion_status; }).map((task) => { return task.title;});
            if (!notcompletedtasks.length) {
                return false
            }
            return notcompletedtasks
        },
        getMyProfile() {
            apiService.getMyProfile().then(response => {
                this.profiles = response.data.data;
                this.profileSize = this.profiles.length;
                if (this.profileSize != 0) {
                    if (localStorage.getItem("isAuthenticated")
                        && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
                        this.validUserName = JSON.parse(localStorage.getItem("log_user"));
                    }
                }
                else {
                    this.addNewProfile()
                }
            }).catch(error => {
                if (error.response.status === 401) {
                    localStorage.clear();
                    router.push("/auth");
                }
            });
        },
        getMyTasks() {
            apiService.getMyTasks().then(response => {
                this.tasks = response.data.data;
                this.taskSize = this.tasks.length;
                if (localStorage.getItem("isAuthenticated")
                    && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
                    this.validUserName = JSON.parse(localStorage.getItem("log_user"));
                }
            }).catch(error => {
                if (error.response.status === 401) {
                    localStorage.clear();
                    router.push("/auth");
                }
            });
        },
        addNewProfile() {
            if (localStorage.getItem("isAuthenticated")
                && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
                router.push('/profile-create');
            } else {
                router.push("/auth");
            }
        },
        updateProfile(profile) {
            router.push('/profile-create/' + profile.pk);
        },
        deleteProfile(profile) {
            if (confirm("Do you really want to delete?")) {
                apiService.deleteProfile(profile.pk).then(response => {
                    if (response.status === 204) {
                        router.push('/profile-list/deleted/')
                        this.getMyProfile()
                    }
                }).catch(error => {
                    if (error.response.status === 401) {
                        localStorage.clear();
                        router.push("/auth");
                    }
                });
            }
        }
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
