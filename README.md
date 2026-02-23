# Smart Campus Platform

| Login | Homepage |
|-------|------|
| <img src="https://github.com/user-attachments/assets/d3d69abd-f403-4783-b5b1-640a0f9681b0" width="100%"> | <img src="https://github.com/user-attachments/assets/97208a43-9343-4888-af5d-9c39819bb0a6" width="100%"> |

## 📌 Introduction

Please read the **"START"** guide inside the `docs` folder before running the project.

All documentation inside the `docs` directory was written with the assistance of **Claude (not C4)**.

While the overall system architecture was designed by our team, the implementation of individual modules was assisted by AI tools — specifically **ChatGPT** and **Claude**.  
The **UI implementation** was developed using **DeepSite**.

---

## 🚀 How to Run the Project

### 1️⃣ Clear Used Ports

Run:

clear-ports.py

Make sure all required ports are free before starting the services.

---

### 2️⃣ Build and Start Services

#### Backend Infrastructure (Docker)

cd Smart-Campus-Platform  
docker-compose up -d rabbitmq redis auth-db booking-db marketplace-db order-db exam-db notification-db

#### Frontend (Docker)

cd Smart-Campus-Platform-UI  
docker-compose up -d

---

### 3️⃣ Initialize the Database

Run:

reset-db.py

This will:
- Create all required tables  
- Add the default admin user  

---

### 4️⃣ Development Mode (Recommended)

For easier debugging, lower resource consumption, and reduced internet usage:

- **Database services, RabbitMQ, and Redis** run on Docker.
- **Microservices** run locally using **IntelliJ IDEA**.

All Docker configurations are already prepared for the microservices as well.

After completing step 3:
1. Open the `Smart-Campus-Platform` folder in IntelliJ IDEA.
2. Configure the project.
3. Run the services locally.

---

## 👥 Team Members

### API Gateway & Auth Service
- Reza Yaghoubi  
- Danial Ebrat  

---

### Booking Service & Exam Service
- Amin Noorbakhsh  
- Amir Mohammad Hemmati  

---

### IoT Service & Marketplace Service
- Ali Ghorbani  
- Parsa Darsaraei  

---

### Notification Service & Order Service
- Hessam Hosseinnejad  
- Aydin Dolati  

---

Each member contributed approximately **10–15%** of the overall project implementation.
