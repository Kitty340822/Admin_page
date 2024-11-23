<template>
  <div>
    <div class="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary position-fixed top-0 bottom-0"
      style="width: 280px">
      <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
        <span class="fs-2">Admin <i class="bi bi-person"></i></span>
      </a>
      <hr />
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <div @click="goToProduct()" class="nav-link active">Product <i class="bi bi-box2"></i></div>
        </li>
      </ul>

      <hr />
      <div class="dropdown">
        <a href="#" class="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle"
          data-bs-toggle="dropdown" aria-expanded="false">
          <img src="..\assets\img\products\images.jpg" alt="" width="32" height="32" class="rounded-circle me-2" />
          <strong>{{ username }}</strong>
        </a>
        <ul class="dropdown-menu text-small shadow">
          <li>
            <a class="dropdown-item" href="#">Profile</a>
          </li>
          <li>
            <hr class="dropdown-divider"/>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/login-admin" class="dropdown-item">Login</router-link>
          </li>
          <li v-else>
            <a class="dropdown-item" href="#" @click="userLogout">Logout</a>
          </li>
        </ul>
      </div>
    </div>

    <div style="margin-left: 281px" class="bg-primary">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import EventBus from '@/EventBus';
import config from '@/config';

export default {
  name: "AdminLayout",
  setup() {
    const router = useRouter();
    const isLoggedIn = ref(false);
    const username = ref("");
    const apiURL = ref(config.apiBaseUrl);

    // Check initial login state
    onMounted(() => {
      // Set initial state from session storage
      const storedUsername = sessionStorage.getItem('username');
      if (storedUsername) {
        isLoggedIn.value = true;
        username.value = storedUsername;
      }

      // Listen for login events
      EventBus.on('login-admin', (loginStatus, user) => {
        isLoggedIn.value = loginStatus;
        username.value = user || '';
      });
    });

    onUnmounted(() => {
      EventBus.off('login-admin');
    });

    const goToProduct = () => {
      router.push({ name: 'TheProducts' });
    };

    const userLogout = async () => {
      try {
        const confirmed = window.confirm("Are you sure you want to log out?");
        if (!confirmed) return;

        // Send logout request to backend
        await axios.post(`${apiURL.value}/logout`, {}, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "69420"
          }
        });

        // Clear session storage
        sessionStorage.removeItem('username');

        // Update login state
        isLoggedIn.value = false;
        username.value = '';

        // Emit logout event
        EventBus.emit('login-admin', false, '');

        // Redirect to login page
        await router.push("/login-admin");

        // Reload the page to ensure all states are reset
        window.location.reload();
      } catch (error) {
        console.error("Logout error:", error);
        // Handle specific error cases
        if (error.response?.status === 401) {
          // Already logged out or session expired
          sessionStorage.removeItem('username');
          isLoggedIn.value = false;
          username.value = '';
          await router.push("/login-admin");
          window.location.reload();
        } else {
          alert("An error occurred during logout. Please try again.");
        }
      }
    };

    return {
      goToProduct,
      userLogout,
      isLoggedIn,
      username
    };
  }
};
</script>