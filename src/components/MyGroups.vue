<template>
    <body>
        <div class="container mt-5">
            <h3 class="text-center">My Groups</h3>

            <!-- Non-Mobile device view -->
            <div class="container">
                <div class="row mb-3">
                    <div class="col-md-12">
                        <div class="card-deck d-flex flex-wrap">
                            <div v-for="group in groups" :key="group.pk" class="card ml-3 col-md-4">
                                <div class="card-body">
                                    <h5 class="card-title">Group Title</h5>
                                    <p class="card-text">{{ group.title }}</p>
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Users</h5>
                                    <ul class="text-center d-flex flex-column justify-content-center align-items-center">
                                        <div v-for="user in group.userinfo" :key="user.pk" @click="navToProfile(user.profile.pk)">
                                            <div v-if="user.profile">
                                                <li >{{ user.username }}</li>
                                                <img :src="user.profile.image" alt="Circular Image" style="object-fit: cover;" class="img rounded-circle" width="50"
                                                height="50"/>
                                            </div>
                                            <div v-else>
                                                <li>{{ user.username }}</li>
                                            </div>
                                    </div>
                                    </ul>
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Lists</h5>
                                    <ul class="text-center d-flex flex-column justify-content-center align-items-center">
                                        <div v-for="list in group.listinfo" :key="list.pk" @click="navToList(list.pk)">
                                        <li>{{ list.title }}</li>
                                        <div v-if="list.list_image">
                                            <img :src="list.list_image" alt="Circular Image" style="object-fit: cover;" class="img rounded" width="50"
                                            height="50"/>
                                        </div>
                                    </div>
                                    </ul>
                                </div>
                                <div style="margin-top:20px; margin-bottom:20px">
                                    <button type="button" class="btn btn-primary" @click="editGroup(group.pk)">Update group</button>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div style="margin-top:20px">
                        <button type="button" class="btn btn-success" @click="addGroup()">Add group</button>
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
        navToList(pk) {
            router.push('/list/' + pk);
        },
        addGroup(pk) {
            router.push('/group-create/');
        },
        editGroup(pk) {
            router.push('/group-edit/' + pk);
        },
        navToProfile(pk) {
            router.push('/profile/' + pk);
        },
        getMyGroups() {
            apiService.getMyGroups().then(response => {
                this.groups = response.data.data;
                this.groupSize = this.group.length;
                for (let group of this.groups) {
                    apiService.getListsFromGroupPK(group.pk).then(response =>
                        group.listinfo = response.data.data
                    ).catch(error => console.error(error))
                    apiService.getUsersFromGroupPK(group.pk).then(response => {
                        group.userinfo = response.data.data
                        for (let user in group.userinfo) {
                            apiService.getProfileFromUserPK(group.userinfo[user].pk).then(response => {
                                group.userinfo[user].profile = response.data.data
                            }).catch(error => (console.log(`User ${group.userinfo[user].username} has no attached profile. ${error}`)))
                        }
                    }
                    ).catch(error => console.error(error))
                }
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
