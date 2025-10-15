import axios from 'axios';
import Cookies from 'js-cookie';

// Constants
const API_BASE_URL = 'http://hamiltondinnerapp.staging.intelligrp.com/api/admin/';
const API_TIMEOUT = 50000;
const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';
const USER_TOKEN_COOKIE = 'userToken';

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear authentication data
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      Cookies.remove(USER_TOKEN_COOKIE);

      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const responseBody = (response) => response.data;

const requests = {
  get: (url, params, headers) =>
    instance.get(url, { params, headers }).then(responseBody),

  post: (url, body) => 
    instance.post(url, body).then(responseBody),

  uploadPosts: (url, body) =>
    instance.post(url, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(responseBody),
    
  uploadPut: (url, body) =>
    instance.post(url, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(responseBody),

  customPost: (url, body, token) =>
    instance.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(responseBody),

  put: (url, body) => 
    instance.put(url, body).then(responseBody),

  patch: (url, body) => 
    instance.patch(url, body).then(responseBody),

  delete: (url, body) =>
    instance.delete(url, { data: body }).then(responseBody),

  upload: (url, formData) =>
    instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(responseBody),
};

export default requests;