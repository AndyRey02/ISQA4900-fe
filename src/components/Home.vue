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
        <div class="col col-36 align-items-left justify-content-left" font="">
          <blockquote>
            <strong>HoneyDo</strong>
            <p></p>
            <p></p>

            Never lose track of lists for yourself or chores for your family ever again!
          </blockquote>
          <div>
        <div class="bd-example-snippet bd-code-snippet"><div class="bd-example m-0 border-0">

        <button type="button" class="btn btn-dark btn-lg my-2" v-if="!authenticated" @click="register">Sign Up</button>
        <button type="button" class="btn btn-clear btn-sm"></button>  
        <button type="button" class="btn btn-outline-dark btn-lg">Learn More</button>

        </div></div>
          </div>
 <br>
          <n></n>
        

            Organize all of your lists and tasks for your "honey" to do.  Works great to keep track of house updates, chore list for kids, reminders for yourself.
        
          <p></p>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="row align-items-center justify-content-center">
        <div class="col col-12 col-sm-10 col-md-10">
          <div class="card-group">
            <div class="card">
              <h5 class="card-title">Work Groups</h5>
              <img :src="require('@/assets/group.jpg')" class="card-img-top" style="height: 15rem">
              <div class="card-body">
                <a @click="viewGroups" class="btn btn-primary">Show Groups</a>
              </div>
            </div>
            <div class="card">
              <h5 class="card-title">Project Lists</h5>
              <img :src="require('@/assets/tasks.jpg')" class="card-img-top" style="height: 15rem">
              <div class="card-body">
                <a @click="viewList" class="btn btn-primary">Show Lists</a>
              </div>
            </div>
            <div class="card">
              <h5 class="card-title">ToDo Items</h5>
              <img :src="require('@/assets/list.jpg')" class="card-img-top" style="height: 15rem">
              <div class="card-body">
                <a @click="viewTasks" class="btn btn-primary">Show Tasks</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
<br>
<br>
<br>

<strong>Our Advantages</strong>
<br>
<br>
    <div class="container-fluid">
      <div class="row align-items-center justify-content-center">
        <div class="col col-12 col-sm-10 col-md-10">
          <div class="card-group">
            <div class="card">
              <h5 class="card-title">Recurring Reminders</h5>
              <img :src="require('@/assets/recurring.jpg')" class="card-img-top" style="height: 15rem">
              When did I change the furnace filter?
              Keep trak of daily, weekly, monthly, quarterly tasks.
            </div>
            <div class="card">
              <h5 class="card-title">Daily Tasks</h5>
              <img :src="require('@/assets/daily.jpg')" class="card-img-top" style="height: 15rem">
              Do these kids even know we have a dishwasher?
              Assign daily chores to kids (or spouses)
            </div>
            <div class="card">
              <h5 class="card-title">Ad-hoc Reminders</h5>
              <img :src="require('@/assets/adhoc.jpg')" class="card-img-top" style="height: 15rem">
              Winter is here and I didn't paint the shed!?!
              Set reminders for tasks to complete.

            </div>
          </div>
        </div>
      </div>
    </div>
<br>
<br>
<br>

<strong>Sample Project or Task Lists to get you Started</strong>
<p>Use one of our templates or create your own.</p>

<div class="container-fluid">
      <div class="row align-items-center justify-content-center">
        <div class="col col-12 col-sm-10 col-md-10">
          <div class="card-group">
            <div class="card">
              <h5 class="card-title">Grocery List</h5>
              <img :src="require('@/assets/grocerylist.jpg')" class="card-img-top" style="height: 15rem">
              <div class="card-body">
                <a @click="viewGroups" class="btn btn-primary">Groceries</a>
              </div>
            </div>
            <div class="card">
              <h5 class="card-title">Chore Lists</h5>
              <img :src="require('@/assets/chorelist.jpg')" class="card-img-top" style="height: 15rem">
              <div class="card-body">
                <a @click="viewList" class="btn btn-primary">Chores</a>
              </div>
            </div>
            <div class="card">
              <h5 class="card-title">Outdoor Projects</h5>
              <img :src="require('@/assets/outdoorchores.jpg')" class="card-img-top" style="height: 15rem">
              <div class="card-body">
                <a @click="viewTasks" class="btn btn-primary">Outdoor Projects</a>
              </div>
            </div>
            <div class="card">
              <h5 class="card-title">Household Cleaning</h5>
              <img :src="require('@/assets/cleaninglist.jpg')" class="card-img-top" style="height: 15rem">
              <div class="card-body">
                <a @click="viewTasks" class="btn btn-primary">Cleaning</a>
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
  