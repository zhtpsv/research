# 🚗 Command Age Timeouts and Braking Strength in Simulated Vehicle

<p align="center">
  <b>An exploratory study on the impact of command age timeouts and braking force on the safety and intervention costs of remotely controlled vehicles.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Completed-success?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Python-Simulation-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/IITU-Research-red?style=for-the-badge" alt="IITU">
</p>

---

## 🔗 Live Demo

🌐 **Explore the Interactive Dashboard:** [research-kappa-six.vercel.app](https://research-kappa-six.vercel.app/)

---

## 📖 About the Research Paper

In teleoperated and automated driving systems, network delays, jitter, and packet loss can compromise vehicle safety when incoming control commands become stale (*Command Age*). 

Based on **107,200 simulation runs** across 400 physical cases and various network loss profiles, this study evaluates:
* **Timeout Thresholds:** How local age limits govern fallback actions.
* **Braking Force Strategy:** The impact of constant fallback deceleration ($3, 4, \text{and } 7\text{ m/s}^2$) versus transitioning to local autonomous following control.
* **Intervention Trade-offs:** The critical balance between collision mitigation and cruise distance loss.

📄 **Paper Title:** *Command Age Timeouts and Braking Strength in Simulated Vehicle*  
🏫 **Institution:** International IT University (Almaty, Kazakhstan)

---

## 💻 Web Application (React Frontend)

This repository includes an interactive React-based web dashboard designed to visualize simulation outputs, compare control architectures, and inspect vehicle behavior under simulated network faults.

### ✨ Key Features:
* 📊 **Interactive Analytics & Charts:** Visual representation of collision proportions and contact severity metrics ($J$) across age thresholds.
* ⚙️ **Strategy Comparison:** Side-by-side comparison between emergency stopping modes (`Stop 3`, `Stop 4`, `Stop 7`) and local controller switching (`Switch 3`).
* 📉 **Network Profile Inspector:** Data exploration across baseline delay ($P1$), independent transaction loss ($P2$), fixed outages ($P3$), and random outage exposures ($P3R$).
* ⚡ **Modern & Responsive UI:** Fast, user-friendly interface built with React for presenting research findings effectively.

---

## 👥 Authors

* **Baktiyaruly Zhakiyan** — *International IT University* | `39579@iitu.edu.kz`
* **Damirlan Zhetpissov** — *International IT University* | `39514@iitu.edu.kz`

---

<p align="center">
  <i>International IT University • Department of Digital and Intelligent Systems</i>
</p>
