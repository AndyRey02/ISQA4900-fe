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
          <h6 class="card-title">From List: {{ Task.list }} Assigned to: {{ assignedUsernamesComputed[Task.user] || 'Loading...' }}</h6>
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
      tasks: [],
      assignedUsernames: {},
      Task: null,
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
    getTaskDetails(taskPK) {
      apiService.getTaskDetails(taskPK).then(response => {
        this.tasks = response.data.data;
        for (let i = 0; i < this.tasks.length; i++) {
          if (this.tasks[i].pk === taskPK) {
            this.Task = this.tasks[i];
            console.log('Selected Task:', this.Task);
            break;
          }
          this.Task = this.tasks[i]
          console.log('Found Task:', this.tasks[i]);
          console.log('taskPK', this.taskPK);
        }
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
      router.push('/list/' + task.pk);
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

body {
  font-family: bierstadt;
}
</style>