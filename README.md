# Intro
Check "START" in the "docs". 
Everything in the "docs" folder has been written with the help of Claude (not C4).
While the overall architecture was designed by our team, the implementation of individual modules was assisted by AI tools, specifically ChatGPT and Claude. also UI implemented by deepsite.

# Run
1- clear-ports.py :
Ports used by the project should be free.
---
2- build-all.py :
cd Smart-Campus-Platform
docker-compose up -d rabbitmq redis auth-db booking-db marketplace-db order-db exam-db notification-db
&
cd Smart-Campus-Platform-UI
docker-compose up -d
---
3- reset-db.py :
The tables are created and the admin is added to the users.
---
4- For easier debugging, lower resource consumption, and reduced internet usage, the database services, rabbirmq and redis run on Docker, while the microservices run locally on IntelliJ IDEA. However, all Docker-related configurations are also set up for the microservices. So you should setup IntelliJ IDEA for Smart-Campus-Platform folder after level 3 and just run services.

# Members
api-gateway & auth-service:
رضا یعقوبی ، دانیال عبرت
---
booking-service & exam-service:
امین نوربخش ، امیرمحمد همتی
---
iot-service & marketplace-service:
علی قربانی ، پارسا دارسرایی
---
notification-service & order-service:
حسام حسین نژاد ، آیدین دولتی
---
Each member implemented (10-15)% of the project.