<template>
  <div class="register-container">
    <div class="box-warn">
      <form @submit.prevent="handleSubmit">
        <h3>Admin Login</h3>
        <div class="text-label">
          <label for="username">Username</label>
        </div>
        <div class="inside-box">
          <i class="ic bi bi-person-fill"></i>
          <input type="text" id="username" v-model="username" autocomplete="off" required autofocus
            placeholder="Enter your username">
        </div>
        <div class="text-label">
          <label for="password">Password</label>
        </div>
        <div class="inside-box">
          <i class="ic bi bi-lock-fill"></i>
          <input type="password" id="password" v-model="password" required autofocus placeholder="Enter your password">
        </div>
        <input type="submit" name="submit" value="Confirm" class="register-btn">
      </form>
    </div>
    <div class="warn-container">
      <div class="warn">
        <p v-if="backendMessage === 'success'" class="alert alert-success">
          เข้าสำเร็จ - {{ backendMessage }}
        </p>
        <p v-else-if="backendMessage === 'fail'" class="alert alert-danger">
          เข้าไม่สำเร็จ - {{ backendMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
import config from "@/config.js";

import EventBus from "@/EventBus.js";

export default {
  name: "TheLogin",
  data() {
    return {
      username: null,
      password: null,
      backendMessage: null,
      apiURL: config.apiBaseUrl,
    };
  },
  async mounted() {
    // Check if already logged in
    if (sessionStorage.getItem('username') !== null) {
      this.$router.push('/main-product');
    }
  },
  methods: {
    async handleSubmit() {
      try {
        const admin = {
          userName: this.username,
          password: this.password,
        };

        const response = await axios.post(`${this.apiURL}/login/admin`, admin);
        console.log('Login response:', response.data); // Add this to debug

        if (response.data.loginMessage === 'success') {
          // Wait for session check to complete
          this.chkSession();

          // Store username immediately after successful login
          sessionStorage.setItem('username', this.username);

          // Emit login event
          // EventBus.emit('loginok');
          EventBus.emit('login-admin', true, this.username);

          // Navigate after short delay
          setTimeout(() => {
            this.$router.push('/main-product').then(() => {
              window.location.reload();
            });
          }, 500);
        } else {
          this.backendMessage = 'fail';
        }
      } catch (err) {
        console.error('Login failed:', err);
        this.backendMessage = 'fail';
      }
    },
    async chkSession() {
      try {
        const res = await axios.get(`${this.apiURL}/session/admin`);
        console.log('Session response:', res.data); // Add this to debug

        if (res.data && res.data.admin) {
          this.username = res.data.admin.userName;
          sessionStorage.setItem('username', this.username); // Store the actual username
        } else {
          console.error('No admin data in response');
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    }
  }
};
</script>

<style>

body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f0f2f5;
}

/* กล่องสำหรับ Login */
.register-container {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  text-align: center;
}

/* ข้อความแจ้งเตือน */
.warn-container {
  margin-top: 20px;
}

.alert {
  padding: 10px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* กล่องภายใน (inside box) */
.inside-box {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  padding: 12px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.inside-box i {
  color: #ffffff;
  font-size: 1.2rem;
  margin-right: 8px;
}

/* ช่อง Input */
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: none;
  outline: none;
  background: none;
  font-size: 1rem;
  color: #333;
}

/* ปุ่ม Login */
.register-btn {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  font-weight: bold;
  color: #c4bbbb;
  background-color: #148ddf;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 15px;
}

.register-btn:hover {
  background-color: #2980b9;
}

/* ป้าย Label */
.text-label {
  text-align: left;
  font-size: 0.9rem;
  color: #333;
  margin-top: 10px;
  margin-bottom: 5px;
}

/* หัวข้อ */
h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}
</style>
