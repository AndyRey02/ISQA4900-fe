<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class=" col align-items-center">
        <div class="row align-items-center justify-content-center">
          <div class="col col-12 col-sm-10 col-md-10 col-lg-6">
            <div class="alert alert-danger shadow" role="alert"
                 v-if="showMsg === 'error'">
              Please verify Task Information
            </div>
          </div>
        </div>
        <div class="row align-items-center justify-content-center">
          <div class="col col-12 col-sm-10 col-md-10 col-lg-6 align-items-center">
            <div class="card">

              <div class="card-header">{{ pageTitle }}</div>
              <div class="card-body">
                <form ref="form">
                  <div class="form-group row justify-content-around py-2">
                      <label class="col-4">Task pk</label>
                      <div class="col col-8">
                        <input v-model="task.pk" type="text" class="form-control-sm form-control">
                      </div>
                    </div>
                  <div class="container-fluid">
                    <div class="form-group row justify-content-around py-2">
                      <label class="col-4">Title</label>
                      <div class="col col-8">
                        <input v-model="task.title" type="text" class="form-control-sm form-control"
                               id="userplaceholder">
                      </div>
                    </div>
                    <div class="form-group row justify-content-around py-2">
                      <label class="col-4">Description</label>
                      <div class="col col-8">
                        <input v-model="task.description" type="text" class="form-control-sm form-control">
                      </div>
                    </div>

                    <div class="form-group row justify-content-around py-2">
                      <label class="col-4">Due Date</label>
                      <div class="col col-8">
                        <input v-model="task.due_date" type="date" class="form-control-sm form-control">
                      </div>
                    </div>
                    <div class="form-group row justify-content-around py-2">
                      <label class="col-4">Task Status</label>
                      <div class="col col-8">
                        <input v-model="task.status" type="text" class="form-control-sm form-control">
                      </div>
                    </div>
                    <div class="form-group row justify-content-around py-2">
                      <label class="col-4">Notes</label>
                      <div class="col col-8">
                        <input v-model="task.notes" type="text" class="form-control-sm form-control">
                      </div>
                    </div>

                    <div class="form-group row justify-content-around py-2">
                      <label class="col-4">User</label>
                      <div class="col col-8">
                        <input v-model="task.user" type="text" class="form-control-sm form-control">
                      </div>
                    </div>

                    <div class="form-group row justify-content-around py-2">
                      <label class="col-4">List</label>
                      <div class="col col-8">
                        <input v-model="task.list" type="text" class="form-control-sm form-control">
                      </div>
                    </div>

                    <div class="row justify-content-around">
                      <div v-if="!isUpdate" type="button" class="btn btn-primary col-4" @click="createTask">Save
                      </div>
                      <div v-if="isUpdate" type="button" class="btn btn-primary col-4" @click="updateTask">Update
                      </div>
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
  name: 'TaskCreate',
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
      task: {},
      pageTitle: "Create Task",
      isUpdate: false,
      showMsg: '',
      authenticated: false
    };
  },
  methods: {
    validateEmail() {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.task.user)) {
        this.showMsg = 'Please enter a valid email address';
      } else {
        this.showMsg = 'error';
      }
    },
    createTask() {
      apiService.addNewTask(this.task).then(response => {
        if (response.status === 201) {
          this.task = response.data;
          this.showMsg = "";
          router.push('/task-list/new');
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
      router.push("/task-list");
    },
    updateTask() {
      apiService.updateTask(this.task).then(response => {
        if (response.status === 200) {
          this.task = response.data;
          router.push('/task-list/update');
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
      this.pageTitle = "Edit Task";
      this.isUpdate = true;
      apiService.getTask(this.$route.params.pk).then(response => {
        this.task = response.data;
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
  },
}
</script>
