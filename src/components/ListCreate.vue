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
                      <label class="col-5">List PK </label>
                      <div class="col col-7">
                        <input v-model="list.pk" type="text"
                               class="form-control-sm form-control">
                      </div>
                    </div>
                    <div class="form-group row justify-content-around py-2">
                      <label class="col-5">Title</label>
                      <div class="col col-7">
                        <input v-model="list.title" type="text"
                               class="form-control-sm form-control">
                      </div>
                    </div>

                    <div class="form-group row justify-content-around py-2">
                      <label class="col-5">Description</label>
                      <div class="col col-7">
                        <input v-model="list.description"
                               type="text" class="form-control-sm form-control">
                      </div>
                    </div>
                    <div class="form-group row justify-content-around py-2">
                      <label class="col-5">Notes</label>
                      <div class="col col-7">
                        <input v-model="list.notes"
                               type="text" class="form-control-sm form-control">
                      </div>
                    </div>

                    <div class="form-group row justify-content-around py-2">
                      <label class="col-5">Group Set</label>
                      <div class="col col-7">
                        <input v-model="list.group_set"
                               type="text" class="form-control-sm form-control">
                      </div>
                    </div>

                    <div class="form-group row justify-content-around py-2">
                      <label class="col-5">Task Set</label>
                      <div class="col col-7">
                        <input v-model="list.task_set"
                               type="text" class="form-control-sm form-control">
                      </div>
                    </div>
                    <div class="form-group row justify-content-around py-2">
                      <label class="col-4">Image</label>
                      <div class="col col-8">
                        <input type="file" @change="onFileSelected">
                      </div>
                    </div>
                    <div class="row justify-content-around">
                      <div v-if="!isUpdate" type="button" class="btn
btn-primary col-4" @click="createList">Save
                      </div>
                      <div v-if="isUpdate" type="button" class="btn
btn-primary col-4" @click="updateList">Update
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
      list: {},
      group:{},
      pageTitle: "Add New List",
      isUpdate: false,
      showMsg: '',
      selectedFile: null,
    };
  },
  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0]
    },
    createList() {
      if (typeof this.list.group_set == 'string') {
      this.list.group_set = this.list.group_set.split(",")
      }
      if (typeof this.list.category == 'string') {
        this.list.category = this.list.category.split(",")
      }
      if (typeof this.list.task_set == 'string') {
        this.list.task_set = this.list.task_set.split(",")
      }
      apiService.addNewList(this.list, this.selectedFile).then(response => {
        if (response.status === 201) {
          this.list = response.data;
          this.showMsg = "";
          router.push('/mylists');
        } else {
          this.showMsg = "error";
        }
      }).catch(error => {
        this.showMsg = "error";
      });
    },
    cancelOperation() {
      router.push("/mylists");
    },
    updateList() {
      if (typeof this.list.group_set == 'string') {
      this.list.group_set = this.list.group_set.split(",")
      }
      if (typeof this.list.category == 'string') {
        this.list.category = this.list.category.split(",")
      }
      if (typeof this.list.task_set == 'string') {
        this.list.task_set = this.list.task_set.split(",")
      }
      apiService.updateList(this.list, this.selectedFile).then(response => {
        if (response.status === 200) {
          this.list = response.data;
          router.push('/mylists');
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