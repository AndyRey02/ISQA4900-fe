import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Home2 from '@/components/Home2.vue'
import Auth from '@/components/Auth.vue'
import Register from '@/components/Register'
import GroupList from '@/components/GroupList'
import GroupCreate from '@/components/GroupCreate'
import ProfileList from '@/components/ProfileList'
import ProfileCreate from '@/components/ProfileCreate'
import MyProfile from '@/components/MyProfile'
import Profile from '@/components/Profile'
import TaskList from '@/components/TaskList'
import TaskCreate from '@/components/TaskCreate'
import MyLists from '@/components/MyLists'
import List from '@/components/List'
import ListList from '@/components/ListList'
import ListCreate from '@/components/ListCreate'
import Contact from '@/components/Contact'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/',
    name: 'Home2',
    component: Home2
  },
  {
    path: '/profile-list',
    name: 'ProfileList',
    component: ProfileList
  },
  {
    path: '/profile-list/:msg',
    name: 'ProfileUpdatedList',
    component: ProfileList
  },
  {
    path: '/myprofile',
    name: 'MyProfile',
    component: MyProfile
  },
  {
    path: '/profile/:pk',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/profile-create',
    name: 'ProfileCreate',
    component: ProfileCreate
  },
  {
    path: '/profile-create/:pk',
    name: 'ProfileUpdate',
    component: ProfileCreate
  },
  {
    path: '/group-list',
    name: 'GroupList',
    component: GroupList
  },
  {
    path: '/group-list/:msg',
    name: 'GroupUpdatedList',
    component: GroupList
  },
  {
    path: '/group-create',
    name: 'GroupCreate',
    component: GroupCreate
  },
  {
    path: '/group-create/:pk',
    name: 'GroupUpdate',
    component: GroupCreate
  },
  {
    path: '/task-list',
    name: 'TaskList',
    component: TaskList
  },
  {
    path: '/task-list/:msg',
    name: 'TaskUpdatedList',
    component: TaskList
  },
  {
    path: '/task-create',
    name: 'TaskCreate',
    component: TaskCreate
  },
  {
    path: '/task-create/:pk',
    name: 'TaskUpdate',
    component: TaskCreate
  },
  {
    path: '/list-list',
    name: 'ListList',
    component: ListList
  },
  {
    path: '/MyLists',
    name: 'MyLists',
    component: MyLists
  },
  {
    path: '/list/:pk',
    name: 'list',
    component: List
  },
  {
    path: '/list-list/:msg',
    name: 'ListUpdatedList',
    component: ListList
  },
  {
    path: '/list-create',
    name: 'ListCreate',
    component: ListCreate
  },
  {
    path: '/list-create/:pk',
    name: 'ListUpdate',
    component: ListCreate
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
