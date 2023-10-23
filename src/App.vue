<template>
  <ul class="nav justify-content-end">
     <div class="HD">HoneyDo</div>
     <li class="nav-item active">
         <router-link to="/">Home</router-link> |
     </li>
     <li class="nav-item">
         <router-link :to="{name: 'GroupList'}">Work Groups</router-link> |
     </li>
     <li class="nav-item">
         <router-link :to="{name: 'TaskList'}">Project Boards</router-link> |
     </li>
     <li class="nav-item">
         <router-link :to="{name: 'ListList'}">ToDo Items</router-link> |
     </li>

     <li class="nav-item" v-if="!authenticated" @click="register" >
         <router-link :to="{name: 'Register'}">Register</router-link> |
     </li>
     <li class="nav-item" v-if="!authenticated" @click="login" >
         <router-link :to="{name: 'Auth'}">Log in</router-link>
     </li>
     <li class="nav-item  .justify-content-end" v-if="authenticated" @click="logout" >
         <router-link :to="{name: 'Auth'}">Logout</router-link>
     </li>
 </ul>
 <router-view/>
</template>
<script>
 import router from './router';
 import {APIService} from './http/APIService';
 import { jsx } from 'vue/jsx-runtime';
 const apiService = new APIService();

 export default {
     name: 'App',
     data: () => ({
         authenticated: false,
         dialog: false
      }),
      
      mounted() {
        if (localStorage.getItem("isAuthenticated") &&
            JSON.parse(localStorage.getItem("isAuthenticated")) === true ){
            this.authenticated = true;
            this.getUser();
        }else {
            this.authenticated = false;
        }
      },
      methods: {
          logout() {
            //clear local storage items and set authenticated to false
            localStorage.clear();
            localStorage.setItem("isAuthenticated", false);
            localStorage.setItem("username", "Guest");
            this.authenticated = false;
            window.location = "/";
          },
          login() {
              router.push("/auth");
          },
          home() {
            window.location = "/";
            },
        register() {
            router.push("/register");
        },
    getUser() {
      if (localStorage.getItem("isAuthenticated") &&
       JSON.parse(localStorage.getItem("isAuthenticated")) === true ) {
          apiService.getUser().then(response => {
              this.user = response.data;
              localStorage.setItem("username", this.user.username);
              localStorage.setItem("userID", this.user.pk);
              localStorage.setItem("is_superuser", this.user.is_superuser);
              localStorage.setItem("first_name", this.user.first_name);
              localStorage.setItem("last_name", this.user.last_name);
              localStorage.setItem("email", this.user.email);
              localStorage.setItem("userInfoDefined", true);
          }).catch(error => {
              if (error.response.status === 401) {
                  localStorage.clear();
                  localStorage.setItem("isAuthenticated", false);
                  localStorage.setItem("username", "Guest");
                  this.authenticated = false;
                  router.push("/auth");
              }
          });
          } else {
            localStorage.setItem("isAuthenticated", false);
            localStorage.setItem("username", "Guest");
          }  
      }
    }
}
</script>
<style lang="scss">
  #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
  }
  #nav {
      padding: 30px;
      background-color: cadetblue;
      a {
          font-weight: bold;
          color: #2c3e50;
          &.router-link-exact-active {
              color: #42b983;
          }
      }
  }
  .nav {
      padding: 1em;
      background-color: cadetblue;
      
      li {
          font-weight: bold;
          color: #2c3e50;
      }
      a {
          color: black;
          padding: .5em;

          &.router-link-exact-active {
              color: #42b983;
          }
      }
      .FS{
          margin-right: 33em;
      }
  }
</style>
