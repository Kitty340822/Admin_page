<template>
  <AdminLayout>
    <div class="bg-blue full-screen">
      <div class="container justify-content-center align-items-center min-vh-100 ">
        <div class="bg-white shadow p-5 rounded">
          <h1 class="text-center mb-4 text-dark">Add New Product</h1>
          <form @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label for="productName" class="form-label text-info">Product ID</label>
              <input type="text" id="productName" v-model="productId" class="form-control form-control-lg" required />
            </div>
            <div class="mb-4">
              <label for="productName" class="form-label text-info">Product Name</label>
              <input type="text" id="productName" v-model="productName" class="form-control form-control-lg" required />
            </div>
            <div class="mb-4">
              <label for="productPrice" class="form-label text-info">Product Price</label>
              <input type="number" id="productPrice" v-model="productPrice" class="form-control form-control-lg"
                required min="0" />
            </div>
            <div class="mb-4">
              <label for="productQuantity" class="form-label text-info">Product Quantity</label>
              <input type="text" id="productQuantity" v-model="productQuantity" class="form-control form-control-lg"
                required />
            </div>
            <div class="mb-4">
              <label for="productDescription" class="form-label text-info">Product Description</label>
              <textarea id="productDescription" v-model="productDescription" class="form-control form-control-lg"
                rows="4"></textarea>
            </div>

            <!-- Add img -->
            <div class="row">
              <div class="col-md-6 col-sm-12">
                <h3 class="mt-5 text-end">{{ productId }}</h3>
                <h5 class="text-end">{{ productName }}</h5>
              </div>
              <div class="col-md-6 col-sm-12">
                <label for="image text-center ">Select Image</label>
                <input type="file" @change="handleFileUpload" id="image" required>
                <div v-if="previewImage" class="image-preview">
                  <img :src="previewImage" alt="Image Preview" style="width: 100px; height: 100px;">
                </div>
              </div>
            </div>
            <input type="submit" value="Add product" class="add-product-btn btn btn-success">
          </form>
          <p v-if="message" class="mt-3 text-center alert alert-success">
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>



<script>
import axios from "axios";
import AdminLayout from "@/layouts/AdminLayout.vue";
axios.defaults.withCredentials = true;
import config from "@/config.js";

export default {
  components: {
    AdminLayout,
  },
  data() {
    return {
      productId: "",
      productName: "",
      productPrice: null,
      productQuantity: "",
      productDescription: "",
      message: "",
      apiURL: config.apiBaseUrl,
      image: null,
      previewImage: null
    };
  },
  methods: {
    addProduct() {
      // ตัวอย่างการจัดการเพิ่มสินค้า
      const newProduct = {
        id: this.productId,
        name: this.productName,
        price: this.productPrice,
        quantity: this.productQuantity,
        description: this.productDescription,
      };

      // ในที่นี้คุณสามารถเรียก API หรือจัดเก็บในอาร์เรย์ได้
      console.log("New Product:", newProduct);
      axios.post(`${this.apiURL}/main-product`, {
        headers: {
          "Content-type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
      });
      // แสดงข้อความสำเร็จ
      this.message = "Product added successfully!";

      // ล้างฟิลด์หลังจากเพิ่มสินค้า
      this.productName = "";
      this.productPrice = null;
      this.productDescription = "";
      this.$router.push("/main-product");
    },
    handleFileUpload(event) {
      this.image = event.target.files[0];
      this.previewImage = URL.createObjectURL(this.image);
    },
    async handleSubmit() {
      const formData = new FormData();
      formData.append("id", this.productId);
      formData.append("name", this.productName);
      formData.append("price", this.productPrice);
      formData.append("quantity", this.productQuantity);
      formData.append("description", this.productDescription);
      formData.append("image", this.image); // Add the image file

      try {
        const response = await axios.post(`${this.apiURL}/main-product`, formData, {
          headers: {
            "Content-type": "multipart/form-data",
            "ngrok-skip-browser-warning": "69420",
          },
        }
        );
        console.log('Product added:', response.data);
        this.message = "Product added successfully!";
        // Clear form fields after successful submission
        this.productId = "";
        this.productName = "";
        this.productPrice = null;
        this.productQuantity = "";
        this.productDescription = "";
        this.image = null;
        this.previewImage = null;

        setTimeout(() => {
          this.$router.push('/main-product');
        }, 1000);
      } catch (err) {
        console.error('Error adding product:', err.response ? err.response.data : err.message); 
        this.message = `Failed to add product: ${err.response ? err.response.data.message : err.message}`
      }
    },

  }
};
</script>

<style scoped>
.full-screen {
            background-image: url('../assets/img/products/Pokemon\ Backgrounds.jpg'); /* เปลี่ยน path ให้เป็นที่อยู่ของรูปภาพ */
            background-size: cover; /* ทำให้ภาพครอบคลุมพื้นที่ทั้งหมด */
            background-position: center; /* จัดตำแหน่งภาพให้อยู่ตรงกลาง */
            height: 100vh; /* ความสูงของ div เป็น 100% ของ viewport */
            display: flex; /* ใช้ Flexbox */
            justify-content: center; /* จัดให้อยู่ตรงกลางในแนวนอน */
            align-items: center; /* จัดให้อยู่ตรงกลางในแนวตั้ง */
            color: #000000; /* เปลี่ยนสีตัวอักษรให้เห็นชัดบนพื้นหลัง */
        }

.container {
            display: flex; /* ใช้ Flexbox */
            justify-content: center; /* จัดให้อยู่ตรงกลางในแนวนอน */
            align-items: center; /* จัดให้อยู่ตรงกลางในแนวตั้ง */
            height: 100vh; /* ความสูงของ container เป็น 100% ของ viewport */
        }
.form-label {
  font-weight: bold;
  font-size: 1.1em;
}

.btn-lg {
  padding: 0.5rem 2rem;
  font-size: 1.2rem;
}

.bg-light {
  background-color: #f8f9fa;
}

.alert {
  font-size: 1.1em;
  padding: 0.75rem;
}
.form-control {
            border: 2px solid #000000; /* สีขอบที่คุณต้องการ (ตัวอย่าง: สีน้ำเงิน) */
            border-radius: 0.25rem; /* รัศมีของมุม */
        }

        .form-control:focus {
            border-color: #000000; /* สีขอบเมื่อช่องกรอกข้อมูลอยู่ในสถานะโฟกัส */
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); /* เงาเมื่อช่องกรอกข้อมูลอยู่ในสถานะโฟกัส */
        }
</style>
