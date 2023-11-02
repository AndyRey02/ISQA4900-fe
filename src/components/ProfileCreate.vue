<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class=" col align-items-center">
        <div class="row align-items-center justify-content-center">
          <div class="col col-12 col-sm-10 col-md-10 col-lg-6">
            <div class="alert alert-danger shadow" role="alert"
            v-if="showMsg === 'error'">
              Please verify Profile Information
            </div>
          </div>
        </div>
        <div class="row align-items-center justify-content-center">
          <div class="col col-12 col-sm-10 col-md-10 col-lg-6 align-items-center">
            <div class="card">
              <div class="card-header">{{pageTitle}}</div>
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
                    <div class="form-group row justify-content-around py-2">
                      <label class="col-4">User PK</label>
                      <div class="col col-8">
                        <input v-model="profile.user" type="text" class="form-control-sm form-control" id="userplaceholder">
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
                        <input for="email" class="form-control-sm form-control" type="email" placeholder="Please enter your email here" v-model="profile.email" @blur="validateEmail">
                      </div>
                    </div>
                    <div class="row justify-content-around">
                      <div v-if="!isUpdate" type="button" class="btn btn-primary col-4" @click="createProfile">Save</div>
                      <div v-if="isUpdate" type="button" class="btn btn-primary col-4" @click="updateProfile">Update</div>
                      <div type="button" class="btn btn-secondary col-4" @click="cancelOperation">Cancel</div>   
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
</template>
<script>
  import router from '../router';
  import {APIService} from '../http/APIService';
  const apiService = new APIService();

  export default {
    name: 'ProfileCreate',
    components: {},
        //prevent user from accessing this page if not authorized
  beforeCreate() {
  if (localStorage.getItem("isAuthenticated") &&
      JSON.parse(localStorage.getItem("isAuthenticated")) === true ){
        this.authenticated = true
      }
      else {
        this.authenticated = false
      }
      if(this.authenticated===false){
          router.push("/auth");
        }
 },
    data() {
      return {
        showError: false,
        profile: {},
        pageTitle: "Create Profile",
        isUpdate: false,
        showMsg: '',
        authenticated: false
      };
    },
    methods: {
      validateEmail() {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.profile.email)) {
            this.showMsg = 'Please enter a valid email address';
        } else {
          this.showMsg = 'error';
        }
      },
      createProfile() {
        apiService.addNewProfile(this.profile).then(response => {
          if (response.status === 201) {
            this.profile = response.data;
             this.showMsg = "";
            router.push('/profile-list/new');
          }else{
              this.showMsg = "error";
          }
        }).catch(error => {
          if (error.response.status === 401) { // "not authorized"
            router.push("/auth");
          }else if (error.response.status === 400) { //"bad request"
            this.showMsg = "requestError";
          }else{
            this.showMsg = "error";
          }
        });
      },
      cancelOperation(){
         router.push("/profile-list");
      },
      updateProfile() {
        apiService.updateProfile(this.profile).then(response => {
          if (response.status === 200) {
            this.profile = response.data;
            router.push('/profile-list/update');
          }else{
              this.showMsg = "error";
          }
        }).catch(error => {
          if (error.response.status === 401) {
            router.push("/auth");
          }else if (error.response.status === 400) {
            this.showMsg = "error";
          }
        });
      }
    },
    mounted() {
      if (this.$route.params.pk) {
        this.pageTitle = "Edit Profile";
        this.isUpdate = true;
        apiService.getProfile(this.$route.params.pk).then(response => {
          this.profile = response.data;
        }).catch(error => {
          if (error.response.status === 401) { // "not authorized"
            router.push("/auth");
          }else{
            this.showMsg = "error";
            router.push("/auth");
          }
        });
      }
      this.userID = Number(localStorage.getItem("userID"))
    },
  }
</script>
