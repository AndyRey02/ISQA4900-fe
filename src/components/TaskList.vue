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
              <button @click="updateTask(task)" style="background-color: transparent; padding:;">
                <font-awesome-icon icon="pencil"/>
              </button>
              <button @click="deleteTask(task)" style="background-color: transparent; padding:;">
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
          <th scope="col">Title</th>
          <th scope="col">Description</th>
          <th scope="col">Status</th>
          <th scope="col">Due Date</th>
          <th scope="col">Notes</th>
          <th scope="col">Assignee</th>
          <th scope="col">List</th>
          <th scope="col">Update</th>
          <th scope="col">Delete</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="task in tasks" v-bind:key="task">
          <th @click="getMyTasks(task)" scope="row">
            {{ task.title }}
          </th>
          <td>{{ task.description }}</td>
          <td>{{ task.completion_status ? 'Complete' : 'Incomplete' }}</td>
          <td>{{ task.due_date }}</td>
          <td>{{ task.notes }}</td>
          <td>{{ assignedUsernamesComputed[task.user] || 'Loading...' }}</td>
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
import moment from 'moment';
import {APIService} from '../http/APIService';

const apiService = new APIService();

export default {
  name: "TaskList",
  data: () => ({
    tasks: [],
    task: {},
    assignedUsernames: {},
    validUserName: "Guest",
    taskSize: 0,
    showMsg: '',
    isMobile: false,
    authenticated: false,
    headers: [
      {text: 'Title', sortable: false, align: 'left',},
      {text: 'Task Pk', sortable: false, align: 'left',},
      {text: 'Description', sortable: false, align: 'left',},
      {text: 'Notes', sortable: false, align: 'left',},
      {text: 'Update', sortable: false, align: 'left',},
      {text: 'Delete', sortable: false, align: 'left',}
    ],
  }),
  mounted() {
    this.authenticated = localStorage.getItem("isAuthenticated")
    this.getTasks();
    this.getTaskDate();
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
      apiService.getMyTasks().then(response => {
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
    async getTaskDate() {
      try {
        const response = await apiService.getMyTasks();
        this.tasks = response.data.data.map(task => {
          return {
            ...task,
            due_date: moment(task.due_date).format('DD/MM/YYYY')
          };
        });
      } catch (error) {
        console.error(error);
        if (error.response?.status === 401) {
          localStorage.clear();
          router.push("/auth");
        }
      }
    },
    getMyTasks(task) {
      router.push(`/task/${task.pk}`);
    },
    getTasksFromListPK() {
      apiService.getTasksFromListPK(this.$route.params.pk).then(response => {
        this.tasks = response.data.data;
      }).catch(error => {
        if (error.response?.status === 401) {
          localStorage.clear();
          router.push("/auth");
        }
      });
    },
    async getUserFromPK(userId) {
      try {
        const response = await apiService.getUserFromPK(userId);
        const username = response.data.username;
        this.assignedUsernames[userId] = username;
        return username;
      } catch (error) {
        console.error(error);
        return 'Unknown User';
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
  },
  computed: {
    completeTasks: function () {
      return this.tasks.filter(task => task.completion_status === true)
    },
    incompleteTasks: function () {
      return this.tasks.filter(task => task.completion_status === false)
    },
    assignedUsernamesComputed() {
      return this.tasks.reduce((acc, task) => {
        this.getUserFromPK(task.user).then(username => {
          this.assignedUsername = username.username;
        });
        acc[task.user] = this.assignedUsernames[task.user] || 'Loading...';
        return acc;
      }, {});
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
</style>
