<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class="col-12 col-md-10 col-lg-10 col-12 align-items-center
justify-content-center">
        <div class="alert alert-success"
             v-if="showMsg === 'new'" value="true">
          New List added.
        </div>
        <div class="alert alert-success"
             v-if="showMsg === 'update'" value="true">
          List updated.
        </div>
        <div class="alert alert-success"
             v-if="showMsg === 'deleted'" value="true">
          List deleted.
        </div>
        <div class="alert alert-danger"
             v-if="showMsg === 'error'" value="true">
          Error connecting to server. Check server.
        </div>
      </div>
    </div>
    <div class="row align-items-center justify-content-center">
      <div class="col col-12 col-md-10 d-none d-xl-block d-lg-block d-md-
block">
        <table class="table table-hover" style="overflow-y: auto">
          <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">List Title</th>
            <th scope="col">Description</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="list in lists" v-bind:key="list">
            <th scope="row">{{ lists.id }}</th>
            <td>{{ lists.title }}</td>
            <td>{{ lists.description }}</td>
            <td>{{ lists.notes }}</td>
            <td @click="updateList(list)">
              <button style="background-color: transparent;
padding: 0;">
                <font-awesome-icon icon="pencil"/>
              </button>
            </td>
            <td @click="deleteList(list)">
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
                  @click="addNewList">Add New List
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
  name: 'ListCreate',
  components: {},
  //prevent user from accessing this page if not authorized
  beforeCreate() {
    if (localStorage.getItem("isAuthenticated") &&
        JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
      this.authenticated = true
    } else {
      this.authenticated = false
    }
    if (this.authenticated === false) {
      router.push("/auth");
    }
  },
  data() {
    return {
      showError: false,
      lists: {},
      pageTitle: "Add New List",
      isUpdate: false,
      showMsg: '',
      authenticated: false
    };
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
    getList() {
      apiService
          .getList()
          .then((response) => {
            this.list = response.data;
            this.listsSize = this.list.length;
          })
          .catch((error) => {
            this.showMsg = "error"
          });
    },
    addNewList() {
      router.push('/list-create');
    },
    updateList(list) {
      router.push("/list-create/" + list.id);
    },
    deleteList(list) {
      if (confirm("Do you really want to delete?")) {
        apiService.deleteList(list.id).then(response => {
          if (response.status === 204) {
            router.push('/list-list/deleted/')
            this.getList()
            this.showMsg = "deleted"
          }
        }).catch(error => {
          this.showMsg = "error"
        });
      }
    }
  },
  mounted() {
// if a primary key is provided, set title and get the list record
    if (this.$route.params.pk) {
      this.pageTitle = "Edit List";
      this.isUpdate = true;
      apiService.getList(this.$route.params.pk).then(response => {
        this.list = response.data;
      }).catch(error => {
        this.showMsg = "error";
      });
    }
  },
};
</script>
<style>
.table > thead > tr > th {
  background-color: rgb(190, 188, 190);
}
</style>