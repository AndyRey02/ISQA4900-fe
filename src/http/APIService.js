import axios from 'axios';
// Change the API_URL to the correct location of the backend API before deploying the app
const API_URL = 'https://99mislas.pythonanywhere.com'

export class APIService {
   constructor() {
   }
   getTask(param_pk) {
      const url = `${API_URL}/api/tasks/${param_pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getTaskList() {
      const url = `${API_URL}/api/tasks/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getTasksFromListPK(list_pk) {
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      const url = `${API_URL}/api/gettasksfromlist/${list_pk}`;
      return axios.get(url, { headers: headers });
   }
   addNewTask(task) {
      const url = `${API_URL}/api/tasks/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.post(url, task, { headers: headers });
   }
   getTaskDetails() {
    const url = `${API_URL}/api/MyTasks`;
    let jwtToken = localStorage.getItem('access');
    const headers = { Authorization: `JWT ${jwtToken}` };
    return axios.get(url, { headers: headers });
   }
   updateTask(task) {
      const url = `${API_URL}/api/tasks/${task.pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.put(url, task, { headers: headers });
   }
   deleteTask(task_pk) {
      const url = `${API_URL}/api/tasks/${task_pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.delete(url, { headers: headers });
   }
   getMyTasks() {
      const url = `${API_URL}/api/mytasks/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getList(param_pk) {
      const url = `${API_URL}/api/lists/${param_pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getListList() {
      const url = `${API_URL}/api/lists/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   addNewList(list, image) {
      const url = `${API_URL}/api/lists/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      const fd = new FormData();
      if (image != null) {
         for (let key in list) {
           if (list.hasOwnProperty(key)) {
             if (key === 'task_set' && Array.isArray(list[key])) {
               for (let taskId of list[key]) {
                 fd.append('task_set', taskId);
               }  
             } 
             else if (key === 'group_set' && Array.isArray(list[key])) {
               for (let groupId of list[key]) {
               fd.append('group_set', groupId);
               }
            }
             else {
               fd.append(key, list[key]);
             }
           }
         }
         fd.append('list_image', image)
         return axios.post(url, fd, { headers: headers });
      }
      else {
         return axios.post(url, list, { headers: headers });
      };
   }
   updateList(list, image) {
      const url = `${API_URL}/api/lists/${list.pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      const fd = new FormData();
      if (image != null) {
         for (let key in list) {
           if (list.hasOwnProperty(key)) {
             if (key === 'task_set' && Array.isArray(list[key])) {
               for (let taskId of list[key]) {
                 fd.append('task_set', taskId);
               }
             } 
             else if (key === 'group_set' && Array.isArray(list[key])) {
               for (let groupId of list[key]) {
               fd.append('group_set', groupId);
               }
            }
             else {
               fd.append(key, list[key]);
             }
           }
         }
         fd.append('list_image', image);
         return axios.put(url, fd, { headers: headers });
       }
      else {
         delete list.list_image
         return axios.put(url, list, { headers: headers });
      };
     }
   deleteList(list_pk) {
      const url = `${API_URL}/api/lists/${list_pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.delete(url, { headers: headers });
   }
   getGroup(param_pk) {
      const url = `${API_URL}/api/groups/${param_pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getGroupList() {
      const url = `${API_URL}/api/groups/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getMyGroups() {
      const url = `${API_URL}/api/mygroups/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   addNewGroup(group) {
      const url = `${API_URL}/api/groups/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.post(url, group, { headers: headers });
   }
   updateGroup(group) {
      const url = `${API_URL}/api/groups/${group.pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.put(url, group, { headers: headers });
   }
   deleteGroup(group_pk) {
      const url = `${API_URL}/api/groups/${group_pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.delete(url, { headers: headers });
   }
   getProfile(param_pk) {
      const url = `${API_URL}/api/profiles/${param_pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getProfileList() {
      const url = `${API_URL}/api/profiles/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getMyBoards() {
      const url = `${API_URL}/api/mylists/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getMyProfile() {
      const url = `${API_URL}/api/myprofile/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   addNewProfile(profile, image) {
      const url = `${API_URL}/api/profiles/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      const fd = new FormData();
      if (image != null) {
         for (let key in profile) {
            if (profile.hasOwnProperty(key)) {
               fd.append(key, profile[key]);
            }
         }
         fd.append('image', image)
         return axios.post(url, fd, { headers: headers });
      }
      else {
         return axios.post(url, profile, { headers: headers });
      };
   }
   updateProfile(profile, image) {
      const url = `${API_URL}/api/profiles/${profile.pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      const fd = new FormData();
      if (image != null) {
         for (let key in profile) {
            if (profile.hasOwnProperty(key)) {
               fd.append(key, profile[key]);
            }
         }
         fd.append('image', image)
      }
      return axios.put(url, fd, { headers: headers });
   }
   deleteProfile(profile_pk) {
      const url = `${API_URL}/api/profiles/${profile_pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.delete(url, { headers: headers });
   }
   getReminder(param_pk) {
      const url = `${API_URL}/api/reminders/${param_pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getReminderList() {
      const url = `${API_URL}/api/reminders/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   addNewReminder(reminder) {
      const url = `${API_URL}/api/reminders/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.post(url, reminder, { headers: headers });
   }
   updateReminder(reminder) {
      const url = `${API_URL}/api/reminders/${reminder.pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.put(url, reminder, { headers: headers });
   }
   deleteReminder(reminder_pk) {
      const url = `${API_URL}/api/reminders/${reminder_pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.delete(url, { headers: headers });
   }
   authenticateLogin(credentials) {
      const url = `${API_URL}/api/`;
      return axios.post(url, credentials);
   }
   registerUser(credentials) {
      const url = `${API_URL}/register/`;
      credentials.customusername = credentials.username
      return axios.post(url, credentials);
   }
   getUser() {
      const url = `${API_URL}/api/getuser/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getAllUsers() {
      const url = `${API_URL}/api/getallusers/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getUserFromPK(pk) {
      const url = `${API_URL}/api/getuserfrompk/${pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getProfileFromUserPK(pk) {
      const url = `${API_URL}/api/getprofilefromuser/${pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getListsFromGroupPK(pk) {
      const url = `${API_URL}/api/getlistsfromgroup/${pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getUsersFromGroupPK(pk) {
      const url = `${API_URL}/api/getusersfromgroup/${pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getUserFromPK(pk) {
      const url = `${API_URL}/api/getuserfrompk/${pk}`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getGuest1(guest1) {
      const url = `${API_URL}/api/getGuest1/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getGuest2(guest2) {
      const url = `${API_URL}/api/getGuest2/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getGuest3(guest3) {
      const url = `${API_URL}/api/getGuest3/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
   getGuest4(guest4) {
      const url = `${API_URL}/api/getGuest4/`;
      let jwtToken = localStorage.getItem('access');
      const headers = { Authorization: `JWT ${jwtToken}` };
      return axios.get(url, { headers: headers });
   }
}
