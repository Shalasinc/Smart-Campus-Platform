#!/usr/bin/env python3
import subprocess, bcrypt, sys, io
if sys.platform == 'win32': sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# ===== CONFIG =====
USERNAME = "admin"
PASSWORD = "0000"
FULL_NAME = "GUILAN"
ROLE = "FACULTY"
TENANT_ID = "default-tenant"
# ==================

def run(c): subprocess.run(c, shell=True)
def hash_pwd(p):
    h = bcrypt.hashpw(p.encode(), bcrypt.gensalt(10)).decode()
    return '$2a$' + h[4:] if h.startswith('$2b$') else h

print("Clearing...")
for db, u, d, c in [
    ('auth-db-1', 'auth', 'authdb', 'TRUNCATE users CASCADE'),
    ('booking-db-1', 'booking', 'bookingdb', 'TRUNCATE reservations, resources CASCADE'),
    ('marketplace-db-1', 'market', 'marketdb', 'TRUNCATE tickets CASCADE'),
    ('order-db-1', 'orders', 'orderdb', 'TRUNCATE orders, order_items CASCADE'),
    ('exam-db-1', 'exam', 'examdb', 'TRUNCATE exams, courses, exam_attempts, questions, question_options, student_answers CASCADE'),
    ('notification-db-1', 'note', 'notificationdb', 'TRUNCATE notifications CASCADE')
]:
    run(f'docker exec smart-campus-platform-{db} psql -U {u} -d {d} -c "{c}"')

print(f"Creating: {USERNAME}")
run(f'docker exec smart-campus-platform-auth-db-1 psql -U auth -d authdb -c "INSERT INTO users (username, password, full_name, role, tenant_id) VALUES (\'{USERNAME}\', \'{hash_pwd(PASSWORD)}\', \'{FULL_NAME}\', \'{ROLE}\', \'{TENANT_ID}\');"')

run('docker restart smart-campus-platform-rabbitmq-1')
print(f"Done! Login: {USERNAME} / {PASSWORD}")