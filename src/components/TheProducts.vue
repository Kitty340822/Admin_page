<template>
  <AdminLayout>
    <div class="container pt-4 dp-flex ">
      <div class="text-center">
        <h1 class="display-5 fw-bold mb-4"><i class="bi bi-vinyl"></i>Product Management {{ products.id }}<i class="bi bi-vinyl"></i></h1>
        <!-- ปุ่มเพิ่ม ลบ และแก้ไข -->
        <div class="button-group mb-4">
          <button class="btn btn-success me-2" @click="addProduct()">
            <i class="fas fa-plus"></i> Add New Product <i class="bi bi-plus-circle-dotted"></i>
          </button>
        </div>

        
        <!-- แสดงข้อมูลสินค้า -->
        <!-- <div v-if="products.length"> -->
        <div>
          <div class="row gy-4">
            <div class="col-4" v-for="product in products" :key="product.id">
              <div class="card h-100 shadow-sm " style="width: 18rem">
                <img :src="`https://30e6-158-108-229-150.ngrok-free.app/img_product/${product.id}.png`" class="card-img-top" width="255" height="361" alt="..." />
                <div class="card-body">
                  <h5 class="card-title">{{ product.name }} {{ product.price }} {{ product.quantity }}</h5>
                  <p class="card-text">
                    {{ product.description }}
                  </p>
                  <button class="btn btn-warning me-2" @click="editProduct(productId)">
                    <i class="fas fa-edit"></i> Edit <i class="bi bi-pen-fill"></i>
                  </button>
                  <button class="btn btn-danger" @click="deleteProduct(product.id)">
                    <i class="fas fa-trash"></i> Delete <i class="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div v-else> -->
        <div v-if="false">
          <p>ไม่มีสินค้า</p>
        </div>
      </div>
    </div>
  </AdminLayout>
  <!-- <div>
    <h1>Hello</h1>
  </div> -->
</template>

<script>
import axios from "axios";
import { onMounted, ref } from "vue";
axios.defaults.withCredentials = true;
// import { useRouter } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import config from "@/config.js";

export default {
  // name: 'AdminLayout',
  components: {
    AdminLayout,
  },
  setup() {
    // const router = useRouter();
    
    const products = ref([])

    // const imagePath = ref("");

    const apiUrl = ref(config.apiBaseUrl);

    // imagePath.value = `${apiUrl.value}/img_product/${products.value.id}.png`;
    

    onMounted(() => {
      axios.get(`${apiUrl.value}/main-product`,{
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "69420",
          },
        }
      )
        .then(res => { 
          products.value = res.data; 
        })
        .then(err => { console.log(err); });
    });

    return {
      products,
    };
  },

  methods: {
    addProduct() {
      this.$router.push('/main-product/add');
  },
   editProduct (productId) {
    this.$router.push(`/main-product/edit/${productId}`);
    },
    deleteProduct(productId) {
      // ลบสินค้าที่มี id ตรงกับ productId
      this.products = this.products.filter(product => product.id !== productId);
      alert(`สินค้าที่มี ID ${productId} ถูกลบแล้ว`);
    },
    
}}
</script>

<style scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

h1 {
  color: #000000;
}

.product-card {
  border-radius: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.product-image {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  object-fit: cover;
  height: 300px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.card-text {
  font-size: 0.95rem;
  color: #6c757d;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  min-width: 120px;
}

.btn:hover {
  filter: brightness(90%);
}
</style>