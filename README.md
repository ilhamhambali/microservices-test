# Demo Microservice: NestJS, Golang, RabbitMQ & Redis

Selamat datang di proyek demo arsitektur microservice. Proyek ini mendemonstrasikan bagaimana dua layanan yang dibangun dengan teknologi berbeda (NestJS dan Golang) dapat bekerja sama dalam satu sistem yang utuh menggunakan komunikasi sinkron (API call) dan asinkron (event-driven).

## 🏛️ Arsitektur Sistem

Sistem ini terdiri dari beberapa komponen utama yang diorkestrasi menggunakan Docker Compose.
<img width="521" height="301" alt="microservice component" src="https://github.com/user-attachments/assets/252369ad-ade0-4645-8819-0bff1f5e7ace" />


-   **`product-service` (NestJS)**: Bertanggung jawab atas semua logika bisnis yang berkaitan dengan produk (membuat, melihat, dan mengelola stok).
-   **`order-service` (Go)**: Bertanggung jawab atas logika bisnis pemesanan. Layanan ini berkomunikasi dengan `product-service` untuk memvalidasi produk sebelum membuat pesanan.
-   **`PostgreSQL`**: Database utama untuk kedua layanan. Setiap layanan memiliki skema atau tabelnya sendiri untuk menjaga independensi.
-   **`RabbitMQ`**: Berfungsi sebagai *message broker* untuk komunikasi asinkron. Ketika pesanan dibuat, `order-service` menerbitkan event `order.created`, dan `product-service` mendengarkan event tersebut untuk mengurangi stok.
-   **`Redis`**: Digunakan sebagai lapisan *caching* untuk mempercepat permintaan data yang sering diakses, seperti detail produk atau daftar pesanan.

---
## Cara Menjalankan

### Prasyarat
-   [Git](https://git-scm.com/)
-   [Docker](https://www.docker.com/get-started) dan Docker Compose

### Langkah-langkah Setup:

**1. Buat Folder Workspace**
Buat sebuah folder utama di komputer Anda untuk menampung semua repositori.

**2. Klone Semua Repositori**
```bash
# Klone repositori orkestrasi (yang berisi file ini)
git clone [https://github.com/USERNAME/microservices-deployment.git](https://github.com/USERNAME/microservices-deployment.git)

# Klone repositori product-service
git clone [https://github.com/USERNAME/product-service.git](https://github.com/USERNAME/product-service.git)

# Klone repositori order-service
git clone [https://github.com/USERNAME/order-service.git](https://github.com/USERNAME/order-service.git)
```

**4. Jalankan dengan Docker Compose**
Dari dalam folder `microservices-test`, jalankan perintah berikut:
```bash
docker-compose up --build
```
-----

Tentu saja. Menggunakan format seperti dokumentasi API adalah cara yang sangat baik dan profesional. Ini akan jauh lebih jelas daripada sekadar daftar perintah.

Berikut adalah contoh permintaan API yang diformat seperti dokumentasi resmi, yang bisa Anda masukkan ke dalam `README.md` utama Anda.

-----

## Contoh Permintaan API

### 1\. Create a New Product

Membuat data produk baru di dalam sistem.

  - **Method**: `POST`
  - **URL**: `http://localhost:3000/products`
  - **Headers**:
      - `Content-Type: application/json`

#### Request Body

| Field | Tipe | Wajib | Deskripsi |
| :--- | :--- | :--- | :--- |
| `name` | String | Ya | Nama produk. |
| `price`| Number | Ya | Harga produk. |
| `qty` | Integer| Ya | Jumlah stok awal. |

**Contoh Body:**

```json
{
    "name": "Super Smart Watch",
    "price": 299.99,
    "qty": 100
}
```

#### Responses

  - **`201 Created`** (Sukses)
    Mengembalikan objek produk yang baru saja dibuat, lengkap dengan `id` dan `createdAt`.

    ```json
    {
        "name": "Super Smart Watch",
        "price": 299.99,
        "qty": 100,
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "createdAt": "2025-10-01T02:45:00.123Z"
    }
    ```

  - **`400 Bad Request`** (Gagal)
    Terjadi jika data yang dikirim tidak valid (misalnya, `price` bukan angka).

-----

### 2\. Get Product by ID

Mengambil detail satu produk berdasarkan ID uniknya. Respons dari endpoint ini di-cache selama 60 detik.

  - **Method**: `GET`
  - **URL**: `http://localhost:3000/products/:id`

#### URL Parameters

| Parameter | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `:id` | String | `id` unik dari produk yang ingin diambil. |

#### Responses

  - **`200 OK`** (Sukses)
    Mengembalikan objek produk yang dicari.
    ```json
    {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "name": "Super Smart Watch",
        "price": "299.99",
        "qty": 100,
        "createdAt": "2025-10-01T02:45:00.123Z"
    }
    ```
  - **`404 Not Found`** (Gagal)
    Terjadi jika produk dengan `id` tersebut tidak ditemukan.

-----

### 3\. Create a New Order

Membuat pesanan baru untuk produk yang sudah ada. Tindakan ini akan memicu event `order.created` yang akan mengurangi stok produk.

  - **Method**: `POST`
  - **URL**: `http://localhost:8081/orders` *(perhatikan port 8081)*
  - **Headers**:
      - `Content-Type: application/json`

#### Request Body

| Field | Tipe | Wajib | Deskripsi |
| :--- | :--- | :--- | :--- |
| `productId` | String | Ya | `id` dari produk yang ingin dipesan (harus valid). |
| `quantity`| Integer| Ya | Jumlah produk yang dipesan. |

**Contoh Body:**

```json
{
    "productId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "quantity": 2
}
```

#### Responses

  - **`201 Created`** (Sukses)
    Mengembalikan objek pesanan yang baru saja dibuat.
    ```json
    {
        "ID": "b2c3d4e5-f6a7-8901-2345-67890abcdef1",
        "ProductID": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "TotalPrice": 599.98,
        "Quantity": 2,
        "Status": "PENDING",
        "CreatedAt": "2025-10-01T02:50:00.456Z"
    }
    ```
  - **`500 Internal Server Error`** (Gagal)
    Terjadi jika `productId` tidak ditemukan atau stok tidak mencukupi.

### 4\. Get Orders by Product ID

Mengambil semua pesanan yang terkait dengan satu ID produk. Respons dari endpoint ini di-cache selama 60 detik.

  - **Method**: `GET`
  - **URL**: `http://localhost:8081/orders/product/:productId`

#### URL Parameters

| Parameter | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `:productId` | String | `id` unik dari produk yang pesanannya ingin dilihat. |

#### Responses

  - **`200 OK`** (Sukses)
    Mengembalikan sebuah array (daftar) dari objek pesanan.
    ```json
    [
        {
            "ID": "b2c3d4e5-f6a7-8901-2345-67890abcdef1",
            "ProductID": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            "TotalPrice": 599.98,
            "Quantity": 2,
            "Status": "PENDING",
            "CreatedAt": "2025-10-01T02:50:00.456Z"
        }
    ]
    ```

