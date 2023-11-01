<template>
  <div class="container-fluid">
      <div class="row align-items-center justify-content-center">
          <div class="col col-12 align-items-center justify-content-center">
              <blockquote>
                  Welcome {{ validUserName }}!
                  <footer>
                      <small>
                          <em>&mdash;Financial Services, your Midwest Financial Services Partner.</em>
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
                  <div class="card-header" :id="'heading' + profile.cust_number">
                      <button class="btn btn-link collapsed" data-bs-toggle="collapse" :data-bs-target="'#collapse' + profile.pk" 
                      aria-expanded="true" :aria-controls="'collapse' + profile.pk">
                          <h6 style="color: #0275d8; float: left">{{profile.name}}</h6>
                      </button>
                  </div>

                  <div :id="'collapse' + profile.pk" class="collapse" :aria-labelledby="'heading' + profile.pk" data-bs-parent="#collapsable-card">
                      <div class="card-body">
                          <p><b>Name:</b> {{profile.name}}</p>
                          <p><b>Profile Number:</b>{{ profile.cust_number }}</p>
                          <p><b>Address:</b> {{profile.address}},{{ profile.city }},
                          {{ profile.state }}, {{ profile.zipcode }}</p>
                          <p><b>Email:</b> {{profile.email}}</p>
                          <p><b>Phone:</b> {{profile.cell_phone}}</p>
                          <p><b>Agent:</b> {{profile.agent}}</p>
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

          <div class="col col-12 col-md-10 d-none d-xl-block d-lg-block d-md-block">
              <table class="table table-hover" style="overflow-y: auto"
                     :headers="headers">
                  <thead>
                  <tr>
                      <th scope="col">Profile #</th>
                      <th scope="col">Name</th>
                      <th scope="col">Address</th>
                      <th scope="col">City</th>
                      <th scope="col">State</th>
                      <th scope="col">Zip Code</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Update</th>
                      <th scope="col">Delete</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="profile in profiles" v-bind:key="profile">
                      <th scope="row">{{profile.pk}}</th>
                      <td>{{profile.private}}</td>
                      <td>{{profile.user}}</td>
                      <td>{{profile.first_name}}</td>
                      <td>{{profile.last_name}}</td>
                      <td>{{profile.bio}}</td>
                      <td>{{profile.email}}</td>
                      <td>{{profile.image}}</td>
                      <td v-if="this.authenticated === 'true'" @click="updateProfile(profile)"><button style="background-color: transparent; padding: 0;">
                          <font-awesome-icon icon="pencil"/></button>
                      </td>
                      <td v-if="this.authenticated === 'true'"  @click="deleteProfile(profile)"><button style="background-color: transparent; padding: 0;">
                          <font-awesome-icon icon="trash"/></button>
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
</template>
<script>
  import router from '../router';
  import {APIService} from '../http/APIService';
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
          headers: [
              {text: 'Profile Number', sortable: false, align: 'left',},
              {text: 'Name', sortable: false, align: 'left',},
              {text: 'Address', sortable: false, align: 'left',},
              {text: 'City', sortable: false, align: 'left',},
              {text: 'State', sortable: false, align: 'left',},
              {text: 'ZipCode', sortable: false, align: 'left',},
              {text: 'Email', sortable: false, align: 'left',},
              {text: 'Phone', sortable: false, align: 'left',},
              {text: 'Update', sortable: false, align: 'left',},
              {text: 'Delete', sortable: false, align: 'left',}
          ],
      }),
      mounted() {
          this.authenticated = localStorage.getItem("isAuthenticated")
          this.getProfiles();
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
          updateProfile(profile) {
              router.push('/profile-create/' + profile.pk);
          },
          deleteProfile(profile) {
              if(confirm("Do you really want to delete?")) {
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