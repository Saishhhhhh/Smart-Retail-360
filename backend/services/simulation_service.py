import os
import sys

# Get the root directory path (Smart-Retail-360)
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
simulator_path = os.path.join(root_path, "simulation", "simulator.py")

def run_day():
    if not os.path.exists(simulator_path):
        raise FileNotFoundError(f"Simulator file not found at: {simulator_path}")
    # Change to root directory to run simulator
    original_dir = os.getcwd()
    try:
        os.chdir(root_path)
        result = os.system(f'python "{simulator_path}" 1')
        return {"status": "Simulated next day", "success": result == 0}
    finally:
        os.chdir(original_dir)


def reset_simulation():
    if not os.path.exists(simulator_path):
        raise FileNotFoundError(f"Simulator file not found at: {simulator_path}")
    # Change to root directory to run simulator
    original_dir = os.getcwd()
    try:
        os.chdir(root_path)
        result = os.system(f'python "{simulator_path}" 2')
        return {"status": "Simulation reset to day 0", "success": result == 0}
    finally:
        os.chdir(original_dir)
