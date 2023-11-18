<template>
  <body>

  <div class="container">
    <div class="row align-items-center justify-content-center">
      <div class="col col-12 align-items-center justify-content-center">
      </div>
      <div class="col-12 col-md-10 col-lg-10 col-12 align-items-center justify-content-center">
        <div class="alert alert-success" v-if="showMsg === 'new'" :value="true">
          New task has been added.
        </div>
        <div class="alert alert-success" v-if="showMsg === 'update'" :value="true">
          Task information has been updated.
        </div>
        <div class="alert alert-success" v-if="showMsg === 'deleted'" :value="true">
          Selected task has been deleted.
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <template v-if="task && task.length > 0">
          <h1>{{ task.find(t => t.pk === pk).title }}</h1>
          <h1>{{ task[0].title }}</h1>
          <h5>Primary Key (PK): </h5>
          <p>{{ task[0].pk }}</p>
          <h5>Description: </h5>
          <p>{{ task[0].description }}</p>
          <h5>Due Date: </h5>
          <p>{{ task[0].due_date }}</p>
          <h5>Notes: </h5>
          <p>{{ task[0].notes }}</p>
          <h5>User PK: </h5>
          <p>{{ task[0].user }}</p>
          <h5>List PK: </h5>
          <p>{{ task[0].list }}</p>
        </template>
        <!-- Display a message if task array is empty -->
        <template v-else>
          <p>No tasks available</p>
        </template>
      </div>

      <div v-if="this.authenticated === 'true'" style="margin-top:20px">
        <button type="button" class="btn btn-primary" @click="updateTask(task)">Update my Task</button>
      </div>
    </div>
  </div>

  </body>
</template>
<script>
import router from '../router';
import {APIService} from '../http/APIService';

const apiService = new APIService();

export default {
  name: "MyTask",
  data: () => ({
    task: [],
    tasksAssigned: [],
    validUserName: "Guest",
    taskSize: 0,
    showMsg: '',
    isMobile: false,
    authenticated: false,
    is_superUser: false,
  }),
  mounted() {
    this.authenticated = localStorage.getItem("isAuthenticated");
    this.is_superuser = localStorage.getItem("is_superuser");
    this.validUserName = localStorage.getItem("username");
    this.userID = Number(localStorage.getItem("userID"));
    const pk = this.$route.params.pk;
    this.getTask(pk);
    this.showMessages();
  },
  methods: {
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
    getTask(pk) {
      apiService.getTask(pk).then(response => {
        console.log('Raw API response data:', response.data.data);
        if (response.data.data && response.data.length > 0) {
          this.task = response.data[0];
          console.log('Task array:', this.task);
          this.taskSize = this.task.length;
          if (this.taskSize !== 0) {
            if (localStorage.getItem("isAuthenticated")
                && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
              this.validUserName = JSON.parse(localStorage.getItem("log_user"));
            }
          }
        } else {
          // Handle the case when the response is empty
          console.log('No tasks available');
        }
      }).catch(error => {
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          router.push("/auth");
        } else {
          console.error('Error fetching task:', error);
        }
      });
    },

    updateTask(task) {
      router.push('/task-create/' + task.pk);
    },
    deleteTask(task) {
      if (confirm("Do you really want to delete?")) {
        apiService.deleteTask(task.pk).then(response => {
          if (response.status === 204) {
            router.push('/task-list/deleted/')
            this.getMyTasks()
          }
        }).catch(error => {
          if (error.response.status === 401) {
            localStorage.clear();
            router.push("/auth");
          }
        });
      }
    },
    addNewTask() {
      if (localStorage.getItem("isAuthenticated")
          && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
        router.push('/task-create');
      } else {
        router.push("/auth");
      }
    },
  }
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
  text-align: center;
}
</style>
