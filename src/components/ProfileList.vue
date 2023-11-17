<template>
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
        <!--Mobile device view-->
        <div class="d-md-none" id="collapsable-card" style="width: 80%">
            <button type="button" class="btn btn-primary" @click="addNewProfile">
                <font-awesome-icon icon="plus" />
            </button>
            <div class="card" v-for="profile in profiles" v-bind:key="profile">
                <div class="card-header" :id="'heading' + profile.user">
                    <button class="btn btn-link collapsed" data-bs-toggle="collapse"
                        :data-bs-target="'#collapse' + profile.pk" aria-expanded="true"
                        :aria-controls="'collapse' + profile.pk">
                        <h6 style="color: #0275d8; float: left">{{ profile.last_name }}</h6>
                    </button>
                </div>

                <div :id="'collapse' + profile.pk" class="collapse" :aria-labelledby="'heading' + profile.pk"
                    data-bs-parent="#collapsable-card">
                    <div class="card-body">
                        <p><b>Private?:</b> {{ profile.private }}</p>
                        <p><b>User PK:</b>{{ profile.user }}</p>
                        <p><b>Name:</b> {{ profile.first_name }} {{ profile.last_name }}</p>
                        <p><b>Biography:</b> {{ profile.bio }}</p>
                        <p><b>Phone:</b> {{ profile.email }}</p>
                        <div class="btn-group">
                            <button @click="updateProfile(profile)" style="background-color: transparent; padding: 5;">
                                <font-awesome-icon icon="pencil" /></button>
                            <button @click="deleteProfile(profile)" style="background-color: transparent; padding: 5;">
                                <font-awesome-icon icon="trash" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--non-Mobile device view-->
        <div style="display: flex; justify-content: center; margin:0 auto">
            <div class="col col-12 col-md-10 align-items-center justify-content-center">
                <table class="table table-hover" style="overflow-y: auto; " :headers="headers">
                    <thead>
                        <tr>
                            <th scope="col">Profile PK</th>
                            <th scope="col">Private?</th>
                            <th scope="col">User PK</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Biography</th>
                            <th scope="col">Email</th>
                            <th scope="col">Update</th>
                            <th scope="col">Delete</th>
                            <th scope="col">Profile</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="profile in profiles" v-bind:key="profile">
                            <th scope="row">{{ profile.pk }}</th>
                            <td>{{ profile.private }}</td>
                            <td>{{ profile.user }}</td>
                            <td>{{ profile.first_name }}</td>
                            <td>{{ profile.last_name }}</td>
                            <td>{{ profile.bio }}</td>
                            <td>{{ profile.email }}</td>
                            <td v-if="this.authenticated === 'true'" @click="updateProfile(profile)"><button
                                    style="background-color: transparent; padding: 0;">
                                    <font-awesome-icon icon="pencil" /></button>
                            </td>
                            <td v-if="this.authenticated === 'true'" @click="deleteProfile(profile)"><button
                                    style="background-color: transparent; padding: 0;">
                                    <font-awesome-icon icon="trash" /></button>
                            </td>
                            <td v-if="this.authenticated === 'true'" @click="ProfilePush(profile.pk)"><img
                                    :src="profile.image" alt="Circular Image" style="object-fit: cover;"
                                    class="img rounded-circle" width="100" height="100">
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- Only allow add of profile when authenticated user -->
                <div v-if="this.authenticated === 'true'">
                    <button type="button" class="btn btn-primary" @click="addNewProfile">Add New Profile</button>
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
</template>
<script>
import router from '../router';
import { APIService } from '../http/APIService';
const apiService = new APIService();

export default {
    name: "ProfileList",
    data: () => ({
        profiles: [],
        validUserName: "Guest",
        profileSize: 0,
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
        this.authenticated = localStorage.getItem("isAuthenticated")
        this.is_superuser = (localStorage.getItem("is_superuser") === "true")
        this.getProfiles();
        this.showMessages();
        this.validateSuperUser();
    },
    methods: {
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
    }
};
</script>
<style>
button {
    padding: 1rem;
    border: 0;
    cursor: pointer;
}
</style>
