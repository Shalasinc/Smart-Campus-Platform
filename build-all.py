#!/usr/bin/env python3
import subprocess
import os

def run(cmd):
    subprocess.run(cmd, shell=True)

print("🐳 Starting Docker containers...")
os.chdir('Smart-Campus-Platform')
run('docker-compose up -d rabbitmq redis auth-db booking-db marketplace-db order-db exam-db notification-db')

print("\n⏳ Waiting 10 seconds for databases to initialize...")
run('timeout /t 10 /nobreak')

print("\n🎨 Starting UI Container...")
os.chdir('..')
os.chdir('Smart-Campus-Platform-UI')
run('docker-compose up -d')

print("\n✅ Done! Everything is ready!")
print("📌 UI: http://localhost:4173")
print("📌 Next: Start services in IntelliJ IDEA")