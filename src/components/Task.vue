<template>

  <div class="container mt-5" style="text-align: center">
    <!-- Non-Mobile device view -->
    <div class="container">
      <div class="card ml-2 col-xl">
        <div v-if="Task" class="card-body" style="text-align: center">
          <h5 class="card-title">Task Title</h5>
          <p class="card-text">{{ Task.title }}</p>
        </div>
        <div v-if="Task" class="card-body">
          <h5 class="card-title">Task Completion Status</h5>
          <p class="card-text">{{ Task.completion_status ? 'Complete' : 'Incomplete' }}</p>
        </div>
        <div v-if="Task" class="card-body">
          <h5 class="card-title">Task PK</h5>
          <p class="card-text">{{ Task.pk }}</p>
        </div>
        <div v-if="Task" class="card-body">
          <h5 class="card-title">Task Due Date</h5>
          <p class="card-text">{{ Task.due_date }}</p>
        </div>
        <div v-if="Task" class="card-body">
          <h6 class="card-title" @click="navToList(Task)">From List: {{ Task.list }} </h6>
          <h6> Assigned to: {{ Task.username || 'Loading...' }}</h6>
        </div>

        <div v-if="Task" class="card-body">
          <h5 class="card-title">Description</h5>
          <textarea class="form-control" id="description" rows="3" disabled>{{ Task.description }}</textarea>
        </div>
        <div v-if="Task" class="card-body">
          <h5 class="card-title">Notes</h5>
          <textarea class="form-control" id="notes" rows="3" disabled>{{ Task.notes }}</textarea>
        </div>
        <div v-if="Task" class="card-body">
          <button @click="updateTask(Task)" class="btn btn-primary">Edit Task</button>
          <button @click="deleteTask(Task)" class="btn btn-danger">Delete Task</button>
          <button @click="returnbutton()" class="btn btn-primary">Return</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '../router';
import {APIService} from '../http/APIService';
import moment from "moment";

const apiService = new APIService();

export default {
  name: "Task",
  data() {
    return {
      Task: {},
      assignedUsernames: {},
      validUserName: "Guest",
      profileSize: 0,
      showMsg: '',
      isMobile: false,
      authenticated: false,
      is_superUser: false,
    };
  },
  mounted() {
    this.authenticated = localStorage.getItem("isAuthenticated");
    this.validUserName = localStorage.getItem("username");
    this.userID = Number(localStorage.getItem("userID"));
    this.getTaskDetails();
    this.getTaskDate();
    this.getUser();
    this.showMessages();
  },
  methods: {
    getUser() {
      apiService.getUser().then(response => {
        this.validUserName = response?.data.username
        if (this.validUserName) {
          localStorage.setItem("username", this.validUserName)
        }
      }).catch(error => {
        console.error(error)
      })
    },
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
    },
    getTaskDetails() {
      apiService.getTask(this.$route.params.pk).then(response => {
        this.Task = response.data;
        apiService.getUserFromPK(this.Task.user).then(response =>
        this.Task.username = response.data.username
        ).catch(error => console.error(error))
      }).catch(error => {
        if (error.response?.status === 401) {
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
    navToList(task) {
      router.push('/list/' + task.list);
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
    returnbutton() {
      router.push('/task-list');
    },
  },
  computed: {
    async assignedUsernamesComputed() {
      const userNames = {};
      if (this.tasks && this.tasks.length > 0) {
        await Promise.all(
            this.tasks.map(async (task) => {
              try {
                const username = await this.getUserFromPK(task.user);
                userNames[task.user] = username.username;
              } catch (error) {
                userNames[task.user] = 'Unknown User';
                console.error(error);
              }
            })
        );
      }
      return userNames;
    },
  }
} 
</script>

<style>
button {
  padding: 1rem;
  border: 0;
  cursor: pointer;
}

body {
  font-family: bierstadt;
}
</style>
