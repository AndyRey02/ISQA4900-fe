<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class="col-12 col-md-10 col-lg-10 col-12 align-items-center
justify-content-center">
        <div class="alert alert-success"
             v-if="showMsg === 'new'" value="true">
          New Task added.
        </div>
        <div class="alert alert-success"
             v-if="showMsg === 'update'" value="true">
          Task updated.
        </div>
        <div class="alert alert-success"
             v-if="showMsg === 'deleted'" value="true">
          Task deleted.
        </div>
        <div class="alert alert-danger"
             v-if="showMsg === 'error'" value="true">
          Error connecting to server. Check server.
        </div>
      </div>
    </div>
    <br>
    <h1>Tasks ToDo</h1>
    <br>
    <div class="row align-items-center justify-content-center">
      <div class="col col-12 col-md-10 d-none d-xl-block d-lg-block d-md-
block">
        <table class="table table-hover" style="overflow-y: auto">
          <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Task Name</th>
            <th scope="col">Description</th>
            <th scope="col">Due Date</th>
            <th scope="col">Notes</th>
            <th scope="col">List</th>
            <th scope="col">Difficulty</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="task in tasklist" v-bind:key="task">
            <th scope="row">{{ task.id }}</th>
            <td>{{ task.title }}</td>
            <td>{{ task.description }}</td>
            <td>{{ task.due_date }}</td>
            <td>{{ task.notes }}</td>
            <td>{{ task.list }}</td>
            <td>{{ task.difficulty }}</td>
            <td @click="updateTask(task)">
              <button style="background-color: transparent;
padding: 0;">
                <font-awesome-icon icon="pencil"/>
              </button>
            </td>
            <td @click="deleteTask(task)">
              <button style="background-color: transparent;
padding: 0;">
                <font-awesome-icon icon="trash"/>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
        <div>
          <button type="button" class="btn btn-primary"
                  @click="addNewTask">Add New Task
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import router from "../router";
import {APIService} from "@/http/APIService";
const apiService = new APIService();
export default {
      name: 'TaskCreate',
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
      tasklist: {},
      pageTitle: "Add New Task",
      isUpdate: false,
      showMsg: '',
      authenticated: false
    };
  },
  mounted() {
    this.getTaskList();
    this.showMessages();
  },
  methods: {
    onResize() {
      if (window.innerWidth > 600)
        this.isMobile = true;
      else
        this.isMobile = false;
    },
    showMessages() {
      if (this.$route.params.msg) {
        this.showMsg = this.$route.params.msg;
      }
    },
    getTaskList() {
      apiService
          .getTaskList()
          .then((response) => {
            this.tasklist = response.data;
            this.tasksSize = this.tasks.length;
          })
          .catch((error) => {
            this.showMsg = "error"
          });
    },
    addNewTask() {
      router.push('/task-create');
    },
    updateTask(task) {
      router.push("/task-create/" + task.id);
    },
    deleteTask(task) {
      if (confirm("Do you really want to delete?")) {
        apiService.deleteTask(task.id).then(response => {
          if (response.status === 204) {
            router.push('/task-list/deleted/')
            this.getTask()
            this.showMsg = "deleted"
          }
        }).catch(error => {
          this.showMsg = "error"
        });
      }
    }
  },
};
</script>
<style>
.table > thead > tr > th {
  background-color: rgb(190, 188, 190);
}
</style>