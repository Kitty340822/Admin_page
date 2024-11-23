<template>
  <AdminLayout>
    <div class="container pt-4">
      <div>
        <h1 class="display-5 fw-bold"><i class="bi bi-vinyl"></i> Edit Product <i class="bi bi-vinyl"></i></h1><i class="bi bi-vinyl"></i>

        <!-- <div class="button-group mb-4">
          <button class="btn btn-success me-2" @click="addProduct()">
            <i class="fas fa-plus"></i> Add New Product <i class="bi bi-plus-circle-dotted"></i>
          </button>
        </div>  -->

        <div>
          <div class="row gy-4">
            <div class="col-4" v-for="product in products" :key="product.id">
              <div class="card h-100 shadow-sm" style="width: 18rem">
                <img :src="`https://30e6-158-108-229-150.ngrok-free.app/img_product/${product.id}.png`"
                  class="card-img-top" width="255" height="361" alt="Product Image" />
                <div class="card-body">
                  <h5 class="card-title">
                    {{ product.name }}
                    Price: {{ product.price }}
                    Quantity: {{ product.quantity }}
                  </h5>
                  <p class="card-text">
                    {{ product.description }}
                  </p>
                  <button class="btn btn-warning me-2" @click="editProduct(product)">
                    <i class="fas fa-edit"></i> Edit <i class="bi bi-pen-fill"></i>
                  </button>
                  <!-- <button class="btn btn-danger" @click="deleteProduct(product.id)">
                    <i class="fas fa-trash"></i> Delete <i class="bi bi-trash-fill"></i>
                  </button> -->
                </div>
              </div>
            </div>
          </div>

          <!-- No Products Message -->
          <div v-if="products.length === 0" class="text-center mt-4">
            <p class="text-muted">No products available</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Product Modal -->
    <div class="modal" tabindex="-1" role="dialog" :class="{ 'show d-block': showEditModal }">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Product</h5>
            <button type="button" class="btn-close" @click="closeEditModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProduct">
              <div class="mb-3">
                <label class="form-label">Product Name</label>
                <input type="text" class="form-control" v-model="currentProduct.name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Price</label>
                <input type="number" class="form-control" v-model="currentProduct.price" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Quantity</label>
                <input type="number" class="form-control" v-model="currentProduct.quantity" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" v-model="currentProduct.description" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import config from "@/config.js";

axios.defaults.withCredentials = true;

export default {
  components: {
    AdminLayout,
  },
  setup() {
    const products = ref([]);
    const showEditModal = ref(false);
    const currentProduct = ref({});
    const apiURL = ref(config.apiBaseUrl);

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiURL.value}/main-product`, {
          headers: {
            "Content-type": "application/json",
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "69420",
          }
        });
        products.value = response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    onMounted(fetchProducts);

    return {
      products,
      showEditModal,
      currentProduct,
      fetchProducts,
      apiURL: config.apiBaseUrl,
    };
  },
  methods: {
    addProduct() {
      this.$router.push('/main-product/add');
    },
    editProduct(product) {
      // Create a copy of the product to edit
      this.currentProduct = { ...product };
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.currentProduct = {};
    },
    async saveProduct() {
      try {
        // Update product via API
        const response = await axios.put(
          `${this.apiURL}/main-product/${this.currentProduct.id}`,
          this.currentProduct,
          {
            headers: {
              "Content-type": "application/json",
              "Accept": "application/json",
              "ngrok-skip-browser-warning": "69420",
            }
          }
        )
        console.log(response);

        // Update local state
        const index = this.products.findIndex(p => p.id === this.currentProduct.id);
        if (index !== -1) {
          this.products[index] = { ...this.currentProduct };
        }

        // Close modal
        this.closeEditModal();

        // Optional: Show success message
        alert('Product updated successfully');
      } catch (error) {
        console.error("Error updating product:", error);
        alert('Failed to update product');
      }
    },
    async deleteProduct(productId) {
      try {
        // Call backend API to delete product
        await axios.delete(`${this.apiURL}/main-product/${productId}`);

        // Remove product from local state
        this.products = this.products.filter(product => product.id !== productId);

        alert(`Product with ID ${productId} has been deleted`);
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background-color: var(--bs-blue-200, #cfe2ff);
  padding: 20px;
  border-radius: 8px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.card-text {
  font-size: 0.95rem;
  color: #a05353;
}

button {
  min-width: 100px;
}

.text-muted {
  font-size: 1.25rem;
  color: #52728d;
}
</style>