<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class=" col align-items-center">
        <div class="row align-items-center justify-content-center">
          <div class="col col-12 col-sm-10 col-md-10 col-lg-6">
            <div class="alert alert-danger shadow" role="alert" v-if="showMsg === 'error'">
              Please verify Group Information
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
                      <label class="col-4">Group Name</label>
                      <div class="col col-8">
                        <input v-model="group.title" type="text" class="form-control-sm form-control">
                      </div>
                    </div>
                    <div class="form-group row justify-content-around py-2">
                      <label class="col-4">Users</label>
                      <div class="col col-8">
                        <input v-model="group.users" type="text" class="form-control-sm form-control">
                      </div>
                    </div>
                    <div class="form-group row justify-content-around py-2">
                      <label class="col-4">Lists</label>
                      <div class="col col-8">
                        <input v-model="group.lists" type="text" class="form-control-sm form-control">
                      </div>
                    </div>
                    <div class="row justify-content-around">
                      <div v-if="!isUpdate" type="button" class="btn btn-primary col-4" @click="createGroup">Save</div>
                      <div v-if="isUpdate" type="button" class="btn btn-primary col-4" @click="updateGroup">Update</div>
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
import { APIService } from '@/http/APIService';
const apiService = new APIService();

export default {
  name: 'GroupCreate',
  components: {},
  //prevent user from accessing this page if not authorized
  beforeCreate() {
    this.authenticated = !!(localStorage.getItem("isAuthenticated") &&
      JSON.parse(localStorage.getItem("isAuthenticated")) === true);
    if (this.authenticated === false) {
      router.push("/auth");
    }
  },
  data() {
    return {
      showError: false,
      group: {},
      pageTitle: "Add New Group",
      isUpdate: false,
      showMsg: '',
      authenticated: false
    };
  },
  methods: {
    createGroup() {
      if (typeof this.group.lists == 'string') {
      this.group.lists = this.group.lists.split(",")
      }
      if (typeof this.group.users == 'string') {
        this.group.users = this.group.users.split(",")
      }
      apiService.addNewGroup(this.group).then(response => {
        if (response.status === 201) {
          this.group = response.data;
          this.showMsg = "";
          router.push('/mygroups');
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
      router.push("/mygroups");
    },
    updateGroup() {
      if (typeof this.group.lists == 'string') {
      this.group.lists = this.group.lists.split(",")
      }
      if (typeof this.group.users == 'string') {
        this.group.users = this.group.users.split(",")
      }
      apiService.updateGroup(this.group).then(response => {
        if (response.status === 200) {
          this.group = response.data;
          router.push('/mygroups');
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
      this.pageTitle = "Edit Group";
      this.isUpdate = true;
      apiService.getGroup(this.$route.params.pk).then(response => {
        this.group = response.data;
      }).catch(error => {
        if (error.response.status === 401) { // "not authorized"
          router.push("/auth");
        } else {
          this.showMsg = "error";
          router.push("/auth");
        }
      });
    }
  },
}
</script>
 
