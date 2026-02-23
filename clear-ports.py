#!/usr/bin/env python3
import subprocess
import re

# Ports used by the project
PORTS = [4173, 9080, 9081, 9082, 9083, 9084, 9085, 9086, 9087, 5700, 6379, 15672, 5433, 5434, 5435, 5436, 5437, 5438]

def get_pid_on_port(port):
    """Get PID of process using the port"""
    try:
        result = subprocess.run(
            f'netstat -ano | findstr :{port}',
            shell=True,
            capture_output=True,
            text=True
        )
        if result.stdout:
            # Extract PID from last column
            lines = result.stdout.strip().split('\n')
            pids = set()
            for line in lines:
                match = re.search(r'\s+(\d+)\s*$', line)
                if match:
                    pids.add(match.group(1))
            return list(pids)
    except:
        pass
    return []

def kill_process(pid):
    """Kill process by PID"""
    try:
        subprocess.run(f'taskkill /PID {pid} /F', shell=True, capture_output=True)
        return True
    except:
        return False

print("🔍 Scanning ports...")
killed_count = 0

for port in PORTS:
    pids = get_pid_on_port(port)
    if pids:
        for pid in pids:
            if kill_process(pid):
                print(f"✅ Killed process {pid} on port {port}")
                killed_count += 1
            else:
                print(f"⚠️  Failed to kill process {pid} on port {port}")

if killed_count == 0:
    print("✅ All ports are free!")
else:
    print(f"\n✅ Done! Killed {killed_count} process(es)")

