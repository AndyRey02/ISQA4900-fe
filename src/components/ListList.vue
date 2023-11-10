<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class="col col-12 align-items-center justify-content-center">
        <blockquote>
          Welcome {{ validUserName }}!
          <footer>
            <small>
              <em>Welcome to your ToDo Lists</em>
            </small>
          </footer>
        </blockquote>
      </div>
      <div class="col-12 col-md-10 col-lg-10 col-12 align-items-center justify-content-center">
        <div class="alert alert-success"
             v-if="showMsg === 'new'"
             :value="true">
          New List has been added.
        </div>
        <div class="alert alert-success"
             v-if="showMsg === 'update'"
             :value="true">
          List information has been updated.
        </div>
        <div class="alert alert-success"
             v-if="showMsg === 'deleted'"
             :value="true">
          Selected List has been deleted.
        </div>
      </div>
    </div>
    <!--Mobile device view-->

    <div class="d-md-none" id="collapsable-card" style="width: 80%">
      <button type="button" class="btn btn-primary" @click="addNewList">
        <font-awesome-icon icon="plus"/>
      </button>
      <div class="card" v-for="list in lists" v-bind:key="list">
        <div class="card-header" :id="'heading' + list.user">
          <button class="btn btn-link collapsed" data-bs-toggle="collapse" :data-bs-target="'#collapse' + list.pk"
                  aria-expanded="true" :aria-controls="'collapse' + list.pk">
            <h6 style="color: #0275d8; float: left">{{ list.pk }}</h6>
          </button>
        </div>

        <div :id="'collapse' + list.pk" class="collapse" :aria-labelledby="'heading' + list.pk"
             data-bs-parent="#collapsable-card">
          <div class="card-body">
            <p><b>Title:</b> {{ list.title }}</p>
            <p><b>Description:</b>{{ list.description }}</p>
            <p><b>Notes:</b> {{ list.notes }} </p>
            <p><b>Notes:</b> {{ list.category }}</p>
            <div class="btn-group">
              <button @click="updateList(list)" style="background-color: transparent; padding: 5;">
                <font-awesome-icon icon="pencil"/>
              </button>
              <button @click="deleteList(list)" style="background-color: transparent; padding: 5;">
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
          <th scope="col">List PK</th>
          <th scope="col">Title</th>
          <th scope="col">Description</th>
          <th scope="col">Notes</th>
          <th scope="col">Category</th>
          <th scope="col">Update</th>
          <th scope="col">Delete</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="list in lists" v-bind:key="list">
          <th scope="row">{{ list.pk }}</th>
          <td>{{ list.title }}</td>
          <td>{{ list.description }}</td>
          <td>{{ list.notes }}</td>
          <td>{{ list.category }}</td>
          <td v-if="this.authenticated === 'true'" @click="updateList(list)"><button style="background-color: transparent; padding: 0;">
              <font-awesome-icon icon="pencil"/></button>
          </td>
          <td v-if="this.authenticated === 'true'" @click="deleteList(list)"><button style="background-color: transparent; padding: 0;">
              <font-awesome-icon icon="trash"/></button>
          </td>
        </tr>
        </tbody>
      </table>
      <!-- Only allow add of Lists when authenticated user -->
      <div v-if="this.authenticated === 'true'">
        <button type="button" class="btn btn-primary" @click="addNewList">Add New List</button>
      </div>
    </div>
  </div>
</template>
<script>
import router from '../router';
import {APIService} from '../http/APIService';

const apiService = new APIService();

export default {
  name: "ListList",
  data: () => ({
    lists: [],
    validUserName: "Guest",
    listSize: 0,
    showMsg: '',
    isMobile: false,
    authenticated: false,
    headers: [
      {text: 'List PK', sortable: false, align: 'center',},
      {text: 'Title', sortable: false, align: 'center',},
      {text: 'Description', sortable: false, align: 'center',},
      {text: 'Notes', sortable: false, align: 'center',},
      {text: 'Category', sortable: false, align: 'center',},
    ],
  }),
  mounted() {
    this.authenticated = localStorage.getItem("isAuthenticated")
    this.getLists();
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
    getLists() {
      apiService.getListList().then(response => {
        this.lists = response.data.data;
        this.listSize = this.lists.length;
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
    addNewList() {
      if (localStorage.getItem("isAuthenticated")
          && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
        router.push('/list-create');
      } else {
        router.push("/auth");
      }
    },
    updateList(list) {
      router.push('/list-create/' + list.pk);
    },
    deleteList(list) {
      if (confirm("Do you really want to delete?")) {
        apiService.deleteList(list.pk).then(response => {
          if (response.status === 204) {
            router.push('/list-list/deleted/')
            this.getLists()
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
