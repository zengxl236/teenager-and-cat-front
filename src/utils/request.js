import axios from 'axios';

const service = axios.create({
  baseURL: globalConfig.BASE_URL,
  timeout: globalConfig.TIMEOUT
});

service.interceptors.request.use(
  config => {
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
  },

  error => {
    return Promise.reject(error.message);
  }
);

service.interceptors.response.use(
  response => {
    const res = response.data;
    const isBlob = Object.prototype.toString.call(res) === '[object Blob]';

    if (isBlob || res.code === 200) {
      return res;
    }

    return Promise.reject(res.message);
  },

  error => {
    const res = error.response?.data;
    const isBlob = Object.prototype.toString.call(res) === '[object Blob]';

    if (!isBlob) {
      const message = res?.message || error.message;
      return Promise.reject(message);
    }

    const reader = new FileReader();
    reader.readAsText(res);
    reader.onload = () => {
      const data = JSON.parse(reader.result);
      return Promise.reject(data.message);
    };
  }
);

export default service;
