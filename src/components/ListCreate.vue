<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class=" col align-items-center">
        <div class="row align-items-center justify-content-center">
          <div class="col col-12 col-sm-10 col-md-10 col-lg-6">
            <div class="alert alert-danger shadow" role="alert"
                 v-if="showMsg === 'error'">
              Please verify List Information
            </div>
            <div class="alert alert-danger shadow" role="alert"
                 v-if="showMsg === 'requestError'">
              Please verify List Information - data formatted
              incorrectly
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
                      <label class="col-5">List</label>
                      <div class="col col-7">
                        <input v-model="lists.title" type="text"
                               class="form-control-sm form-control">
                      </div>
                    </div>
                    <div class="form-group row justify-content-around py-2">
                      <label class="col-5">Description</label>
                      <div class="col col-7">
                        <input v-model="lists.description"
                               type="text" class="form-control-sm form-control">
                      </div>
                    </div>
                    <div class="form-group row justify-content-around py-2">
                      <label class="col-5">Notes</label>
                      <div class="col col-7">
                        <input v-model="lists.notes"
                               type="text" class="form-control-sm form-control">
                      </div>
                    </div>
                    <div class="row justify-content-around">
                      <div v-if="!isUpdate" type="button" class="btnbtn-primary col-4" @click="createList">Save
                      </div>
                      <div v-if="isUpdate" type="button" class="btnbtn-primary col-4" @click="updateList">Update
                      </div>
                      <div type="button" class="btn btn-secondary
col-4" @click="cancelOperation">Cancel
                      </div>
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
  name: 'ListCreate',
  components: {},
  //prevent user from accessing this page if not authorized
beforeCreate() {
  if (localStorage.getItem("isAuthenticated") &&
      JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
    this.authenticated = true
  } else {
    this.authenticated = false
  }
  if (this.authenticated === false) {
    router.push("/auth");
  }
  },
  data() {
    return {
      showError: false,
      lists: {},
      pageTitle: "Add New List",
      isUpdate: false,
      showMsg: '',
    };
  },
  methods: {
    createList() {
      apiService.addNewList(this.lists).then(response => {
        if (response.status === 201) {
          this.lists = response.data;
          this.showMsg = "";
          router.push('/list-list/new');
        } else {
          this.showMsg = "error";
        }
      }).catch(error => {
        this.showMsg = "error";
      });
    },
    cancelOperation() {
      router.push("/list-list");
    },
    updateList() {
      apiService.updateList(this.list).then(response => {
        if (response.status === 200) {
          this.list = response.data;
          router.push('/list-list/update');
        } else {
          this.showMsg = "error";
        }
      }).catch(error => {
        this.showMsg = "error";
      });
    }
  },
  mounted() {
// if a primary key is provided, set title and get the list record
    if (this.$route.params.pk) {
      this.pageTitle = "Edit List";
      this.isUpdate = true;
      apiService.getList(this.$route.params.pk).then(response => {
        this.list = response.data;
      }).catch(error => {
        this.showMsg = "error";
      });
    }
  },
};
</script>
<style>
</style>