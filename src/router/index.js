import { createRouter, createWebHistory } from 'vue-router';
import LoginAdmin from '../components/LoginAdmin.vue';
import TheProducts from '../components/TheProducts.vue';
import TestViews from '@/views/TestViews.vue';
import Add from '@/components/AddProducts.vue';
import EditProducts from '@/components/EditProducts.vue';


const routes = [
  { path: '/login-admin', name: 'LoginAdmin', component: LoginAdmin },
  { path: '/main-product', name: 'TheProducts', component: TheProducts },
  { path: '/test' , name: 'TestViews' , component: TestViews},
  { path: '/main-product/add' , name: 'Add' , component: Add},
  { path: '/main-product/edit/:id' , name: 'Edit' , component: EditProducts},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});



export default router;