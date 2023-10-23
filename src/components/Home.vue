<template>
    <div class="container-fluid">
      <div class="row">
        <div class="col col-12 align-items-center justify-content-center">
          <blockquote>
            <strong>
                Welcome {{ validUserName }}!
            </strong>
            <footer>
              
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="row align-items-center justify-content-center">
        <div class="col col-12 col-sm-10 col-md-10">
          <div class="card-group">
            <div class="card">
              <img :src="require('@/assets/group.jpg')" class="card-img-top" style="height: 15rem">
              <div class="card-body">
                <h5 class="card-title">Work Groups</h5>
                <a @click="viewGroups" class="btn btn-primary">Show Groups</a>
              </div>
            </div>
            <div class="card">
              <img :src="require('@/assets/tasks.jpg')" class="card-img-top" style="height: 15rem">
              <div class="card-body">
                <h5 class="card-title">Project Boards</h5>
                <a @click="viewTasks" class="btn btn-primary">Show Tasks</a>
              </div>
            </div>
            <div class="card">
              <img :src="require('@/assets/list.jpg')" class="card-img-top" style="height: 15rem">
              <div class="card-body">
                <h5 class="card-title">ToDo Items</h5>
                <a @click="viewList" class="btn btn-primary">Show List</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  import router from '../router'
  export default {
    name: 'Home',
    beforeCreate() {
      if (localStorage.getItem("isAuthenticated") &&
        JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
        this.authenticated = true
      }
      else {
        this.authenticated = false
      }
    },
    data: () => ({
      validUserName: "Guest",
      authenticated: false
    }),
    mounted() {
      this.getUser();
    },
    methods: {
      viewGroups() {
        router.push('/group-list');
      },
      viewTasks() {
        router.push('/task-list');
      },
      viewList() {
        router.push('/list-list');
      },
      getUser() {
        if (localStorage.getItem("isAuthenticated")
          && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
          this.validUserName = JSON.parse(localStorage.getItem("log_user"));
          this.authenticated = true;
        }
      }
    }
  }
  </script>
  