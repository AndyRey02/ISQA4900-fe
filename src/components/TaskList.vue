<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class="col col-12 align-items-center justify-content-center">
        <blockquote>
          Welcome {{ validUserName }}!
          <footer>
            <small>
              <em>Welcome to your Task ToDo List</em>
            </small>
          </footer>
        </blockquote>
      </div>
      <div class="col-12 col-md-10 col-lg-10 col-12 align-items-center justify-content-center">
        <div class="alert alert-success"
             v-if="showMsg === 'new'"
             :value="true">
          New task has been added.
        </div>
        <div class="alert alert-success"
             v-if="showMsg === 'update'"
             :value="true">
          Task information has been updated.
        </div>
        <div class="alert alert-success"
             v-if="showMsg === 'deleted'"
             :value="true">
          Selected task has been deleted.
        </div>
      </div>
    </div>
    <!--Mobile device view-->

    <div class="d-md-none" id="collapsable-card" style="width: 80%">
      <button type="button" class="btn btn-primary" @click="addNewTask">
        <font-awesome-icon icon="plus"/>
      </button>
      <div class="card" v-for="task in tasks" v-bind:key="task">
        <div class="card-header" :id="'heading' + task.user">
          <button class="btn btn-link collapsed" data-bs-toggle="collapse" :data-bs-target="'#collapse' + task.pk"
                  aria-expanded="true" :aria-controls="'collapse' + task.pk">
            <h6 style="color: #0275d8; float: left">{{ task.pk }}</h6>
          </button>
        </div>

        <div :id="'collapse' + task.pk" class="collapse" :aria-labelledby="'heading' + task.pk"
             data-bs-parent="#collapsable-card">
          <div class="card-body">
            <p><b>Title:</b> {{ task.title }}</p>
            <p><b>Description:</b>{{ task.description }}</p>
            <p><b>Status:</b> {{ task.completion_status }} </p>
            <p><b>Due Date:</b> {{ task.due_date }}</p>
            <p><b>Notes:</b> {{ task.notes }}</p>
            <div class="btn-group">
              <button @click="updateTask(task)" style="background-color: transparent; padding: 5;">
                <font-awesome-icon icon="pencil"/>
              </button>
              <button @click="deleteTask(task)" style="background-color: transparent; padding: 5;">
                <font-awesome-icon icon="trash"/>
              </button>
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
          <th scope="col">Task PK</th>
          <th scope="col">Title</th>
          <th scope="col">Description</th>
          <th scope="col">Status</th>
          <th scope="col">Due Date</th>
          <th scope="col">Notes</th>
          <th scope="col">User</th>
          <th scope="col">List</th>
          <th scope="col">Update</th>
          <th scope="col">Delete</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="task in tasks" v-bind:key="task">
          <th scope="row">{{ task.pk }}</th>
          <td>{{ task.title }}</td>
          <td>{{ task.description }}</td>
          <td>{{ task.completion_status }}</td>
          <td>{{ task.due_date }}</td>
          <td>{{ task.notes }}</td>
          <td>{{ task.user }}</td>
          <td>{{ task.list }}</td>
          <td v-if="this.authenticated === 'true'" @click="updateTask(task)">
            <button style="background-color: transparent; padding: 0;">
              <font-awesome-icon icon="pencil"/>
            </button>
          </td>
          <td v-if="this.authenticated === 'true'" @click="deleteTask(task)">
            <button style="background-color: transparent; padding: 0;">
              <font-awesome-icon icon="trash"/>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
      <!-- Only allow add of tasks when authenticated user -->
      <div v-if="this.authenticated === 'true'">
        <button type="button" class="btn btn-primary" @click="addNewTask">Add New Task</button>
      </div>
    </div>
  </div>
</template>
<script>
import router from '../router';
import {APIService} from '../http/APIService';

const apiService = new APIService();

export default {
  name: "TaskList",
  data: () => ({
    tasks: [],
    validUserName: "Guest",
    taskSize: 0,
    showMsg: '',
    isMobile: false,
    authenticated: false,
    headers: [
      {text: 'Task PK', sortable: false, align: 'left',},
      {text: 'Title', sortable: false, align: 'left',},
      {text: 'Description', sortable: false, align: 'left',},
      {text: 'Completion Status', sortable: false, align: 'left',},
      {text: 'Due Date', sortable: false, align: 'left',},
      {text: 'User', sortable: false, align: 'left',},
      {text: 'List', sortable: false, align: 'left',},
      {text: 'Update', sortable: false, align: 'left',},
      {text: 'Delete', sortable: false, align: 'left',}
    ],
  }),
  mounted() {
    this.authenticated = localStorage.getItem("isAuthenticated")
    this.getTasks();
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
    getTasks() {
      apiService.getTaskList().then(response => {
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
    addNewTask() {
      if (localStorage.getItem("isAuthenticated")
          && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
        router.push('/task-create');
      } else {
        router.push("/auth");
      }
    },
    updateTask(task) {
      router.push('/task-create/' + task.pk);
    },
    deleteTask(task) {
      if (confirm("Do you really want to delete?")) {
        apiService.deleteTask(task.pk).then(response => {
          if (response.status === 204) {
            router.push('/task-list/deleted/')
            this.getTasks()
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
