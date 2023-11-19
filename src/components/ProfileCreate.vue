<template>
  <body>
    <div class="container-fluid">
      <div class="row">
        <div class="col align-items-center">
          <div class="row align-items-center justify-content-center">
            <div class="col col-12 col-sm-10 col-md-10 col-lg-6">
              <div class="alert alert-danger shadow" role="alert" v-if="showMsg === 'error'">
                Please verify Profile Information
              </div>
              <div class="alert alert-danger shadow" role="alert" v-if="showMsg === 'requestError'">
                Verify that your primary key aligns with the correct user
              </div>
            </div>
          </div>
          <div class="row align-items-center justify-content-center">
            <div class="col col-12 col-sm-10 col-md-10 col-lg-6 align-items-center">
              <div class="card">
                <div class="card-header">{{ pageTitle }}</div>
                <div class="card-body">
                  <form ref="form">
                    <div class="container-fluid">
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Private</label>
                        <div class="col col-8">
                          <select v-model="profile.private" class="form-control-sm form-control">
                            <option value="true">
                              True
                            </option>
                            <option value="false">
                              False
                            </option>
                          </select>
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2" v-if="!is_superuser">
                        <label class="col-4">Username</label>
                        <div class="col col-8">
                          <input readonly Disabled v-model="this.validUserName" type="text"
                            class="form-control-sm form-control" id="userplaceholder">
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2" v-if="is_superuser">
                        <label class="col-4">User PK</label>
                        <div class="col col-8" id="search-autocomplete">
                          <input v-model="profile.user" type="text" class="form-control-sm form-control"
                            id="userplaceholder">
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">First Name</label>
                        <div class="col col-8">
                          <input v-model="profile.first_name" type="text" class="form-control-sm form-control">
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Last Name</label>
                        <div class="col col-8">
                          <input v-model="profile.last_name" type="text" class="form-control-sm form-control">
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Biography</label>
                        <div class="col col-8">
                          <input v-model="profile.bio" type="text" class="form-control-sm form-control">
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Email</label>
                        <div class="col col-8">
                          <input for="email" class="form-control-sm form-control" type="email"
                            placeholder="Please enter your email here" v-model="profile.email" @blur="validateEmail">
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Image</label>
                        <div class="col col-8">
                          <input type="file" @change="onFileSelected">
                        </div>
                      </div>
                      <div class="row justify-content-around">
                        <div v-if="!isUpdate" type="button" class="btn btn-primary col-4" @click="createProfile">Save
                        </div>
                        <div v-if="isUpdate" type="button" class="btn btn-primary col-4" @click="updateProfile">Update
                        </div>
                        <div type="button" class="btn btn-secondary col-4" @click="cancelOperation">Cancel</div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div style="padding-top: 20px" v-if="is_superuser">
                <div class="card">
                  <div class="card-header">User search:</div>
                  <div class="card-body">
                    <form ref="form">
                      <div class="d-flex">
                        <div class="m-2 border border-primary rounded">
                          <input class="form-check-input" value="pk" type="radio" name="flexRadioDefault" id="flexRadioDefault">
                          <label class="form-check-label" for="flexRadioDefault">Search by User PK</label>
                        </div>
                        <div class="m-2 border border-primary rounded">
                          <input class="form-check-input" value="username" type="radio" name="flexRadioDefault" id="flexRadioDefault" checked>
                          <label class="form-check-label" for="flexRadioDefault">Search by Username</label>
                        </div>
                        <div class="m-2 border border-primary rounded">
                          <input class="form-check-input" value="first_name" type="radio" name="flexRadioDefault" id="flexRadioDefault">
                          <label class="form-check-label" for="flexRadioDefault">Search by First Name</label>
                        </div>
                        <div class="m-2 border border-primary rounded">
                          <input class="form-check-input" value="last_name" type="radio" name="flexRadioDefault" id="flexRadioDefault">
                          <label class="form-check-label" for="flexRadioDefault">Search by Last Name</label>
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <div class="col col-8">
                          <input type="text" v-model="search" class="form-control" placeholder="Search" aria-label="" aria-describedby="basic-addon1">
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <div>
                          <table class="table table-hover" style="margin-top: 15px">
                            <thead>
                              <tr scope="row" class="bg-primary">
                                <th scope="col">PK</th>
                                <th scope="col">Username</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="user in filteredList">
                                <td>{{ user.pk }}</td>
                                <td>{{ user.username }}</td>
                                <td>{{ user.first_name }}</td>
                                <td>{{ user.last_name }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </form>
                  </div>
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
  name: 'ProfileCreate',
  components: {},
  //prevent user from accessing this page if not authorized
  beforeCreate() {
    if (localStorage.getItem("isAuthenticated") &&
      JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
      this.authenticated = true
    }
    else {
      this.authenticated = false
    }
    if (this.authenticated === false) {
      router.push("/auth");
    }
  },
  data() {
    return {
      showError: false,
      profile: {},
      allusers: [],
      pageTitle: "Create Profile",
      isUpdate: false,
      showMsg: '',
      authenticated: false,
      userID: "",
      search: "",
      selectedUser: "",
      validUserName: "",
      is_superuser: false,
      selectedFile: null,
    };
  },
  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0]
    },
    validateEmail() {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.profile.email)) {
        this.showMsg = 'Please enter a valid email address';
      } else {
        this.showMsg = 'error';
      }
    },
    validateSuperUser() {
      if (this.is_superuser == true) {
        return true
      }
      return false
    },
    getSuperUser() {
      apiService.getUser().then(response => {
        this.is_superuser = response.data.is_superuser
      }).catch(error => {
        console.error(error)
      })
    },
    getAllUsers() {
      apiService.getAllUsers().then(response => {
        this.allusers = response.data
      }).catch(error => {
        console.error(error)
      })
    },
    createProfile() {
      if (!this.validateSuperUser()) {
        this.profile.user = this.userID
      }
      apiService.addNewProfile(this.profile, this.selectedFile).then(response => {
        if (response.status === 201) {
          this.profile = response.data;
          this.showMsg = "";
          router.push('/myprofile');
        } else {
          this.showMsg = "error";
        }
      }).catch(error => {
        if (error.response.status === 401) { // "not authorized"
          router.push("/auth");
        } else if (error.response.status === 400) { //"bad request"
          this.showMsg = "requestError";
        } else {
          this.showMsg = "error";
        }
      });
    },
    cancelOperation() {
      router.push("/myprofile");
    },
    updateProfile() {
      apiService.updateProfile(this.profile, this.selectedFile).then(response => {
        if (response.status === 200) {
          this.profile = response.data;
          router.push('/myprofile');
        } else {
          this.showMsg = "error";
        }
      }).catch(error => {
        if (error.response.status === 401) {
          router.push("/auth");
        } else if (error.response.status === 400) {
          this.showMsg = "error";
        }
      });
    }
  },
  mounted() {
    if (this.$route.params.pk) {
      this.pageTitle = "Edit Profile";
      this.isUpdate = true;
      this.validUserName = localStorage.getItem("username");
      this.userID = Number(localStorage.getItem("userID"));
      this.getSuperUser();
      apiService.getProfile(this.$route.params.pk).then(response => {
        this.profile = response.data;
      }).catch(error => {
        if (error.response.status === 401) { // "not authorized"
          router.push("/auth");
        } else {
          this.showMsg = "error";
          router.push("/auth");
        }
      });
    }
    this.userID = Number(localStorage.getItem("userID"))
    this.validUserName = localStorage.getItem("username");
    this.getSuperUser();
    this.getAllUsers();
  },
  computed: {
    filteredList() {
      const searchType = document.querySelector('input[name="flexRadioDefault"]:checked')?.value;
      let searchEdited = this.search
      if (this.allusers.length) {
        if (searchType == 'pk') {
          const filteredProfiles = this.allusers.filter(user => JSON.stringify(user[searchType])?.toLowerCase().includes(searchEdited));
          return filteredProfiles;
        }
        else {
          searchEdited = this.search.toLowerCase();
          const filteredProfiles = this.allusers.filter(user => user[searchType]?.toLowerCase().includes(searchEdited));
          return filteredProfiles;
        }
      }

    }
  }
};
</script>
<style>body {
  font: bierstadt}
</style>
