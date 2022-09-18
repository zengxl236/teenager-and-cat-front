import { defineStore } from 'pinia';

export default defineStore('user', {
  state: () => ({
    id: window.sessionStorage.getItem('id'),
    username: window.localStorage.getItem('username'),
    token: window.sessionStorage.getItem('token')
  }),
  actions: {
    setToken(token) {
      this.token = token;
      window.sessionStorage.setItem('token', token);
    },
    setUserInfo(user) {
      this.id = user.id;
      this.username = user.username;
      window.sessionStorage.setItem('id', user.id);
      window.localStorage.setItem('username', user.username);
    },
    resetUserStore() {
      this.id = '';
      this.token = '';
      window.sessionStorage.removeItem('token');
      window.sessionStorage.removeItem('id');
    }
  }
});
