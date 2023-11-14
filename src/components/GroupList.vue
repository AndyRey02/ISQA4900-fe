<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class="col-12 col-md-10 col-lg-10 col-12 align-items-center justify-content-center">
          <blockquote>
          Welcome {{ validUserName }}!!
          <footer>
            <small>
              <em>Welcome to your Group Lists!!</em>
            </small>
          </footer>
        </blockquote>
        </div>
        <div class="col-12 col-md-10 col-lg-10 col-12 align-items-center justify-content-center">
        <div class="alert alert-success"
             v-if="showMsg === 'new'" value="true">
          New group added.
        </div>
        <div class="alert alert-success"
             v-if="showMsg === 'update'" value="true">
          Group updated.
        </div>
        <div class="alert alert-success"
             v-if="showMsg === 'deleted'" value="true">
          Group deleted.
        </div>
        <div class="alert alert-danger"
             v-if="showMsg === 'error'" value="true">
          Error connecting to server. Check server.
        </div>
      </div>
    </div>
    <br>
    <h1>Available Work Groups:</h1>
    <br>
    <div class="row align-items-center justify-content-center">
      <div class="col col-10 col-md-8 d-none d-xl-block d-lg-block d-md-
block">
        <table class="table table-hover" style="overflow-y: auto">
          <thead>
          <tr>
            <th scope="col">ID #</th>
            <th scope="col">Group Title</th>
            <th scope="col">Founder</th>
            <th scope="col">Description</th>
            <th scope="col">Notes</th>
            <th scope="col">Assignee 1</th>
            <th scope="col">Assignee 2</th>
            <th scope="col">Assignee 3</th>
            <th scope="col">Assignee 4</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="group in GroupList" v-bind:key="group">
            <th scope="row">{{ group.pk }}</th>
            <td>{{ group.title }}</td>
            <td>{{ group.user }}</td>
            <td>{{ group.description }}</td>
            <td>{{ group.notes }}</td>
            <td>{{ group.guest1 }}</td>
            <td>{{ group.guest2 }}</td>
            <td>{{ group.guest3 }}</td>
            <td>{{ group.guest4 }}</td>
            <td @click="updateGroup(group)">
              <button style="background-color: transparent;
padding: 0;">
                <font-awesome-icon icon="pencil"/>
              </button>
            </td>
            <td @click="deleteGroup(group)">
              <button style="background-color: transparent;
padding: 0;">
                <font-awesome-icon icon="trash"/>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
        <div>
          <button class="btn btn-primary" type="button"
                  @click="addNewGroup">Add New Group
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import router from "../router";
import {APIService} from "@/http/APIService";
import GroupList from "@/components/GroupList.vue";
const apiService = new APIService();
export default {
      name: 'GroupCreate',
  computed: {
    GroupList() {
      return GroupList
    }
  },
      components: {},
          //prevent user from accessing this page if not authorized
    beforeCreate() {
    this.authenticated = !!(localStorage.getItem("isAuthenticated") &&
        JSON.parse(localStorage.getItem("isAuthenticated")) === true);
        if(this.authenticated===false){
            router.push("/auth");
          }
   },
  data() {
    return {
      showError: false,
      tasklist: [],
      pageTitle: "Add New Group",
      isUpdate: false,
      showMsg: '',
      authenticated: false
    };
  },
  mounted() {
    this.getGroupList();
    this.showMessages();
  },
  methods: {
    onResize() {
      this.isMobile = window.innerWidth > 600;
    },
    showMessages() {
      if (this.$route.params.msg) {
        this.showMsg = this.$route.params.msg;
      }
    },
    getGroupList() {
      apiService
          .getGroupList()
          .then((response) => {
            this.grouplist = response.data.data;
            this.groupSize = this.grouplist.length;
            console.log('Here'+this.grouplist)
            console.log(response.data)
          })
          .catch((error) => {
            this.showMsg = "error"
          });
    },
    addNewGroup() {
      router.push('/group-create');
    },
    updateGroup(group) {
      router.push("/group-create/" + group.id);
    },
    deleteGroup(group) {
      if (confirm("Do you really want to delete?")) {
        apiService.deleteGroup(group.id).then(response => {
          if (response.status === 204) {
            router.push('/group-list/deleted/')
            this.getGroup()
            this.showMsg = "deleted"
          }
        }).catch(error => {
          this.showMsg = "error"
        });
      }
    }
  },
};
</script>
<style>
.table > thead > tr > th {
  background-color: rgb(190, 188, 190);
}
</style>