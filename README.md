# Scalable Express.js Task Processing with BullMQ & Node.js Clustering

## Overview
This project implements a **scalable job processing system** using **BullMQ, Node.js Clustering, and Redis** to distribute tasks efficiently across multiple worker processes.

- Uses **Node.js Clustering** to create multiple worker processes.
- Implements **Least-Loaded Worker Selection** for efficient task distribution.
- Maintains a total concurrency of **32 jobs (4 workers × 8 concurrency per worker)**.
- Provides an API to **enqueue tasks**, which are processed asynchronously.
- Designed to be **fault-tolerant and scalable** with Redis-based job tracking.

---

## Features
 Implements an API to enqueue **dummy tasks (12s execution time)**.
 Uses **Node.js Clustering** to spawn **4 worker processes**.
 Configures each worker to handle **up to 8 concurrent jobs**.
 Implements **Least-Loaded Worker Selection** for fair task distribution.
 Maintains a **total concurrency of 32 jobs (4 workers × 8 concurrency per worker)**.

---

## 🛠 Project Setup Instructions

### **1️ Prerequisites**
Ensure you have the following installed:
- **Node.js** (v16+ recommended)
- **Redis** (running locally or on a server)
- **npm** or **yarn**

### **2️ Installation**
Clone the repository and install dependencies:
```sh
# Clone the repository
git clone <your-repo-link>
cd <your-repo-name>

# Install dependencies
npm install
```

### **3️ Start Redis**
Ensure Redis is running before starting the application:
```sh
redis-server
```

### **4️ Start the Application**
Run the cluster-based server with workers:
```sh
npm start
```
This will:
- Start a **master process**.
- Fork **4 worker processes** (based on CPU cores).

### **5️ Enqueue a Task**
Use the following cURL command or Postman to enqueue a task:
```sh
curl --location 'http://localhost:3000/enqueue-task' \
--header 'Content-Type: application/json' \
--data '{
    "jobName": "videoProcessing",
    "data": {
        "videoId": "abc123",
        "format": "mp4",
        "resolution": "1080p"
    }
}'
```

### **6️ Monitor Jobs**
Check job processing logs in the terminal.

---

## ⚖ Load Balancing Strategy

This project implements **Least-Loaded Worker Selection** to distribute tasks fairly:

- Each worker **increments** its active job count when a task starts.
- Each worker **decrements** its count after job completion.
- The API selects the worker with the **least active jobs** before adding a task to the queue.
- This ensures **even distribution** of jobs among workers, preventing overload.

**Total concurrency is maintained at 32:**
- **4 workers**, each handling **8 concurrent jobs** (`4 × 8 = 32`).

---





 **Scalability:**
- The number of worker processes adjusts dynamically based on **CPU cores**.
- More workers can be added by increasing CPU instances in a containerized setup.

 **Performance Optimizations:**
- **Job Prioritization:** Tasks are assigned based on the least-loaded worker.
- **Auto-recovery:** Workers track active jobs in Redis, ensuring task fairness.
- **Efficient Cleanup:** Completed jobs are automatically removed from Redis to free memory.

---

## 📜 API Endpoints

### **1️⃣ Enqueue a Task**
- **Endpoint:** `POST /enqueue-task`
- **Request Body:**
```json
{
    "jobName": "videoProcessing",
    "data": {
        "videoId": "abc123",
        "format": "mp4",
        "resolution": "1080p"
    }
}
```
- **Response:**
```json
{
    "message": "Task enqueued successfully",
    "jobId": "<job-id>",
    "jobName": "videoProcessing",
    "jobData": {
        "videoId": "abc123",
        "format": "mp4",
        "resolution": "1080p"
    },
    "assignedWorker": "<worker-id>"
}
```


