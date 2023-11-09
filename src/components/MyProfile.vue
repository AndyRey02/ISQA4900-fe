<template>
  <div class="container-fluid">
      <div class="row align-items-center justify-content-center">
          <div class="col col-12 align-items-center justify-content-center">
              <blockquote>
                  Welcome {{ validUserName }}!
                  <footer>
                      <small>
                          <em>Welcome to your user profile</em>
                      </small>
                  </footer>
              </blockquote>
          </div>
          <div class="col-12 col-md-10 col-lg-10 col-12 align-items-center justify-content-center">
              <div class="alert alert-success"
                   v-if="showMsg === 'new'"
                   :value="true">
                  New profile has been added.
              </div>
              <div class="alert alert-success"
                   v-if="showMsg === 'update'"
                   :value="true">
                  Profile information has been updated.
              </div>
              <div class="alert alert-success"
                   v-if="showMsg === 'deleted'"
                   :value="true">
                  Selected profile has been deleted.
              </div>
          </div>
      </div>
      <!--Mobile device view-->
      <div class="d-md-none" id="collapsable-card" style="width: 80%">
              <button type="button" class="btn btn-primary" @click="addNewProfile">
                  <font-awesome-icon icon="plus"/>
              </button>
              <div class="card" v-for="profile in profiles" v-bind:key="profile">
                  <div class="card-header" :id="'heading' + profile.user">
                      <button class="btn btn-link collapsed" data-bs-toggle="collapse" :data-bs-target="'#collapse' + profile.pk" 
                      aria-expanded="true" :aria-controls="'collapse' + profile.pk">
                          <h6 style="color: #0275d8; float: left">{{profile.last_name}}</h6>
                      </button>
                  </div>

                  <div :id="'collapse' + profile.pk" class="collapse" :aria-labelledby="'heading' + profile.pk" data-bs-parent="#collapsable-card">
                      <div class="card-body">
                          <p><b>Private?:</b> {{profile.private}}</p>
                          <p><b>User PK:</b>{{ profile.user }}</p>
                          <p><b>Name:</b> {{profile.first_name}} {{ profile.last_name }}</p>
                          <p><b>Biography:</b> {{profile.bio}}</p>
                          <p><b>Phone:</b> {{profile.email}}</p>
                          <div class="btn-group">
                          <button @click="updateProfile(profile)" style="background-color: transparent; padding: 5;">
                              <font-awesome-icon icon="pencil"/></button>
                          <button @click="deleteProfile(profile)" style="background-color: transparent; padding: 5;">
                              <font-awesome-icon icon="trash"/></button>
                      </div>
                      </div>
                  </div>
              </div>
          </div>
          <!--non-Mobile device view-->
          
          <div style="margin: auto" class="col col-12 col-md-10 d-none d-xl-block d-lg-block d-md-block" v-for="profile in profiles" v-bind:key="profile">
              <div>
                <form class="row g-3">
                    <div class="mb-3">
                        <label for="disabledTextInput" class="form-label">Profile PK</label>
                        <div type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">{{profile.pk}}</div>
                      </div>
                    <div class="col-md-4">
                      <label for="disabledTextInput" class="form-label">First name</label>
                      <div type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">{{profile.first_name}}</div>
                    </div>
                    <div class="col-md-4">
                      <label for="disabledTextInput" class="form-label">Last name</label>
                      <div type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">{{profile.last_name}}</div>
                    </div>
                    <div class="col-md-4">
                      <label for="disabledTextInput" class="form-label">Username</label>
                      <div type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">{{validUserName}}</div>
                    </div>
                    <div class="col-md-1">
                      <label for="disabledTextInput" class="form-label">Private?</label>
                      <div type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">{{profile.private}}</div>
                    </div>
                    <div class="col-md-3">
                        <label for="disabledTextInput" class="form-label">Email</label>
                        <div type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">{{profile.email}}</div>
                      </div>
                    <div class="col-md-8">
                    <label for="disabledTextInput" class="form-label">Biography</label>
                    <div type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">{{profile.bio}}</div>
                    </div>
                  </form>
              </div>
              
              <!-- Only allow add of profile when authenticated user -->
              <div style="margin-top: 20px">
              <div class="card w-25" style="padding: 1%; margin:auto">
                <div class="card-body">
                    <h5 class="card-title">Remaining Tasks:</h5>
                    <div v-for="task in tasks" v-bind:key="task">
                    <p class="card-text" v-if="task.completion_status != true">{{ task.title }}
                    </p>
                    </div>
              </div>
            </div>
            </div>
              <div v-if="this.authenticated === 'true'" style="margin-top:20px">
                <button type="button" class="btn btn-primary" @click="updateProfile(profile)">Update my profile</button>
            </div>
          </div>
      </div>
</template>
<script>
  import router from '../router';
  import {APIService} from '../http/APIService';
  const apiService = new APIService();

  export default {
      name: "MyProfile",
      data: () => ({
          profiles: [],
          tasks: [],
          validUserName: "Guest",
          profileSize: 0,
          showMsg: '',
          isMobile: false,
          authenticated: false,
          is_superUser: false,
          headers: [
              {text: 'Profile PK', sortable: false, align: 'left',},
              {text: 'Private', sortable: false, align: 'left',},
              {text: 'User PK', sortable: false, align: 'left',},
              {text: 'First Name', sortable: false, align: 'left',},
              {text: 'Last Name', sortable: false, align: 'left',},
              {text: 'Biography', sortable: false, align: 'left',},
              {text: 'Email', sortable: false, align: 'left',},
              {text: 'Update', sortable: false, align: 'left',},
              {text: 'Delete', sortable: false, align: 'left',}
          ],
      }),
      mounted() {
        this.authenticated = localStorage.getItem("isAuthenticated")
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
          showMessages(){
              if (this.$route.params.msg) {
                  this.showMsg = this.$route.params.msg;
              }
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
              if(confirm("Do you really want to delete?")) {
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
</style>
