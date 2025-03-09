# **Scalable Task Processing with BullMQ and Node.js Clustering **  

## **Project Overview**  
This project demonstrates a **scalable task processing system** using:  
- **Node.js Clustering** for parallel processing across multiple CPU cores.  
- **BullMQ** for job queue management with Redis.  
- **Least-Loaded Worker Selection** for intelligent job distribution.  

The system ensures **efficient task execution with a total concurrency of 32** (4 workers × 8 concurrent tasks per worker).  

---

## **⚙️ Setup Instructions**  

### **1️Prerequisites**  
Before running the project, make sure you have:  
- **Node.js** (v16+ recommended)  
- **Redis** (installed and running)  
- **NPM or Yarn**  

### **2️Installation**  

1. **Clone the repository:**  
   ```sh
   git clone <YOUR_REPOSITORY_URL>
   cd <YOUR_PROJECT_FOLDER>



