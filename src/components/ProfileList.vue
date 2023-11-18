<template>
    <body>
        <div class="container-fluid" v-if="is_superuser">
            <div class="row align-items-center justify-content-center">
                <div class="col col-12 align-items-center justify-content-center">
                    <blockquote>
                        Welcome {{ validUserName }}!
                        <footer>
                            <small>
                                Welcome to the user list
                            </small>
                        </footer>
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

            <div class="justify-content-center row row-cols-1 row-cols-lg-4 row-cols-md-2 row-cols-sm-1 g-4" style="margin: 8%; margin-top: 0%">
                <div v-if="this.authenticated === 'true'">
                    <button type="button" class="btn btn-primary" @click="addNewProfile">Add New Profile</button>
                </div>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">@</span>
                    </div>
                    <input type="text" v-model="search" class="form-control" placeholder="Username" aria-label="Username"
                        aria-describedby="basic-addon1">
                </div>
                <div class="col" v-for="profile in filteredList" style="padding-top: 5px">
                    <div class="card" style="">
                        <div class="card-body">
                            <h5 class="card-title" :data-bs-toggle="'collapse'"
                                :data-bs-target="'#collapseExample' + profile.pk" aria-expanded="false"
                                aria-controls="collapseExample"> {{ profile.username }}</h5>
                            <img :src="profile.image" alt="Circular Image" style="object-fit: cover;"
                                class="img rounded-circle" width="100" height="100" @click="ProfilePush(profile.pk)">
                        </div>
                        <div class="collapse" :id="'collapseExample' + profile.pk">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">PK: {{ profile.user }}</li>
                                <li class="list-group-item">First Name: {{ profile.first_name }}</li>
                                <li class="list-group-item">Last Name: {{ profile.last_name }}</li>
                                <li class="list-group-item">Biography: {{ profile.bio }}</li>
                                <li class="list-group-item">Email: {{ profile.email }}</li>
                                <li class="list-group-item">Private: {{ profile.private }}</li>
                            </ul>
                            <div class="card-body">
                                <h5 class="card-title">Actions:</h5>
                                <div v-if="this.authenticated === 'true'"><button
                                        style="background-color: transparent; padding: 5px;"
                                        @click="updateProfile(profile)">
                                        <font-awesome-icon icon="pencil" /></button><button
                                        style="background-color: transparent; padding: 5px;"
                                        @click="deleteProfile(profile)">
                                        <font-awesome-icon icon="trash" /></button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!is_superuser" class="container">
            <div class="row align-items-center justify-content-center">
                <div class="col col-12 align-items-center justify-content-center">
                    <div class="alert alert-danger shadow" role="alert">
                        Users require superuser access to view this page.
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
import { faCropSimple, faTruckPlane } from '@fortawesome/free-solid-svg-icons';
const apiService = new APIService();

export default {
    name: "ProfileList",
    data: () => ({
        profiles: [],
        validUserName: "Guest",
        profileSize: 0,
        showMsg: '',
        search: '',
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
        this.authenticated = localStorage.getItem("isAuthenticated")
        this.getSuperUser();
        this.getProfiles();
        this.showMessages();
        this.validateSuperUser();
    },
    methods: {
        getUserFromPK(pk) {
            apiService.getUserFromPK(pk).then(response => {
                let user = response.data;
                for (let profile of this.profiles) {
                    if (profile.user === user.pk) {
                        profile.username = user.username
                    }
                }
            }).catch(error => {
                console.error(error)
            });
        },
        getSuperUser() {
            apiService.getUser().then(response => {
                this.is_superuser = response.data.is_superuser
            }).catch(error => {
                console.error(error)
            })
        },
        validateSuperUser() {
            if (this.is_superuser == true) {
                return true
            }
            return false
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
        getProfiles() {
            apiService.getProfileList().then(response => {
                this.profiles = response.data.data;
                this.profileSize = this.profiles.length;
                for (let profile of this.profiles) {
                    this.getUserFromPK(profile.user)
                }
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
        returnHome() {
            router.push('/');
        },
        ProfilePush(profilepk) {
            router.push('/profile/' + profilepk);;
        },
        updateProfile(profile) {
            router.push('/profile-create/' + profile.pk);
        },
        deleteProfile(profile) {
            if (confirm("Do you really want to delete?")) {
                apiService.deleteProfile(profile.pk).then(response => {
                    if (response.status === 204) {
                        router.push('/profile-list/deleted/')
                        this.getProfiles()
                    }
                }).catch(error => {
                    if (error.response.status === 401) {
                        localStorage.clear();
                        router.push("/auth");
                    }
                });
            }
        }
    },
    computed: {
        filteredList() {
            const searchLowerCase = this.search.toLowerCase();
            if (this.profiles.length) {
            const filteredProfiles = this.profiles.filter(profile => profile.username?.toLowerCase().includes(searchLowerCase));
            return filteredProfiles;
                }
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
