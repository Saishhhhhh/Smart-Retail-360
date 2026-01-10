import os

def run_day():
    os.system("python ../simulation/simulator.py 1")
    return {"status": "Simulated next day"}


def reset_simulation():
    os.system("python ../simulation/simulator.py 2")
    return {"status": "Simulation reset to day 0"}
