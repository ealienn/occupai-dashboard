import random
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

TELEMETRY_DATA = {
    "room": "Room 313",
    "occupancy_count": 24,
    "temperature": 24.5,
    "indoor_lux": 480,
    "outdoor_lux": 1200,
    "control_mode": "Automated Control",
    "last_auto_adjustment": "2 min ago",
    "hourly_trend": {
        "labels": ["8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM"],
        "data": [15, 32, 29, 50, 22, 30, 42, 12, 40, 20, 30, 20, 41]
    },
    "hardware_status": [
        {"id": "cam_1", "name": "Camera 1", "status": "Online", "type": "Vision Sensor", "uptime": "4h 12m"},
        {"id": "cam_2", "name": "Camera 2", "status": "Offline", "type": "Vision Sensor", "uptime": "4h 12m"},
        {"id": "pir_1", "name": "PIR 1", "status": "Online", "type": "Motion Sensor", "last_trigger": "45 sec ago"},
        {"id": "pir_2", "name": "PIR 2", "status": "Online", "type": "Motion Sensor", "last_trigger": "12 sec ago"},
        {"id": "ir_beam_1", "name": "IR Break Beam", "status": "Online", "type": "Optocoupler", "last_crossing": "1 min ago"},
        {"id": "rpi", "name": "Raspberry Pi", "status": "Online", "type": "Main Gateway", "role": "Vision + IR processing", "uptime": "4h 12m", "cpu_temp": "22°C"},
        {"id": "esp32", "name": "ESP32", "status": "Online", "type": "Microcontroller", "role": "PIR, actuation", "uptime": "4h 12m"}
    ],
    "lighting": [
        {"id": "light_1", "name": "Light 1 - Front Right", "brightness": 100, "state": True, "last_changed": "Auto - 2 min ago"},
        {"id": "light_2", "name": "Light 2 - Front Left", "brightness": 60, "state": True, "last_changed": "Auto - 2 min ago"},
        {"id": "light_3", "name": "Light 3 - Middle Right", "brightness": 0, "state": False, "last_changed": "Auto - 2 min ago"}
    ],
    "blinds": [
        {"id": "blind_1", "name": "Blind 1", "position": "PARTIAL", "last_changed": "Manual by J.Cruz — 14 min ago"},
        {"id": "blind_2", "name": "Blind 2", "position": "OPEN", "last_changed": "Manual by J.Cruz — 14 min ago"}
    ],
    "air_conditioning": [
        {"id": "ac_1", "name": "AC Unit 1", "temperature": 22, "state": True, "last_changed": "Manual by J.Cruz — 14 min ago"},
        {"id": "ac_2", "name": "AC Unit 2", "temperature": 22, "state": True, "last_changed": "Manual by J.Cruz — 14 min ago"}
    ],
    "override_activity": [
        {"time": "10:42 AM", "device": "Blind 1", "action": "Set to PARTIAL", "status": "Success", "by": "J. Cruz"},
        {"time": "10:15 AM", "device": "AC Unit 2", "action": "Turn ON", "status": "Success", "by": "J. Cruz"},
        {"time": "09:58 AM", "device": "Light 1", "action": "Forced OFF", "status": "Failed", "by": "Auto-Guard"},
        {"time": "09:30 AM", "device": "AC Unit 1", "action": "Power ON", "status": "Success", "by": "System"},
        {"time": "09:20 AM", "device": "Blind 2", "action": "Set to OPEN", "status": "Success", "by": "System"}
    ],
    "occupancy_logs": [
        {"time": "11:15:53 AM", "event": "Entry — Door 2", "count": 40, "tier": "High", "source": "Vision + Break-beam"},
        {"time": "11:10:23 AM", "event": "Entry — Door 1", "count": 36, "tier": "High", "source": "Vision + Break-beam"},
        {"time": "11:02:14 AM", "event": "Entry — Door 1", "count": 28, "tier": "Medium", "source": "Vision + Break-beam"},
        {"time": "10:58:40 AM", "event": "Exit — Door 2", "count": 27, "tier": "Medium", "source": "Vision + Break-beam"},
        {"time": "10:47:03 AM", "event": "Interior presence sustained", "count": 28, "tier": "Medium", "source": "PIR Sensor 1 / 2"},
        {"time": "10:31:55 AM", "event": "Entry — Door 1", "count": 28, "tier": "Medium", "source": "Vision + Break-beam"},
        {"time": "10:15:22 AM", "event": "Entry — Door 1", "count": 16, "tier": "Medium", "source": "Vision + Break-beam"},
        {"time": "10:02:10 AM", "event": "Entry — Door 2", "count": 15, "tier": "Low", "source": "Vision + Break-beam"},
        {"time": "09:41:07 AM", "event": "Room vacated", "count": 0, "tier": "Vacant", "source": "Fused estimate"},
        {"time": "09:00:00 AM", "event": "System started", "count": 0, "tier": "Vacant", "source": "System"}
    ],
    "actuation_events": [
        {"time": "11:20:40 AM", "device": "Light 1, Light 2", "action": "Turned OFF", "result": "Success"},
        {"time": "11:02:16 AM", "device": "Light 1, Light 2", "action": "Set to 80% Brightness", "result": "Success"},
        {"time": "11:02:16 AM", "device": "AC Unit 1, AC Unit 2", "action": "Turned ON", "result": "Success"},
        {"time": "10:15:24 AM", "device": "Light 1, Light 2", "action": "Set to 60% Brightness", "result": "Success"},
        {"time": "10:15:24 AM", "device": "AC Unit 1, AC Unit 2", "action": "Turned ON", "result": "Success"},
        {"time": "09:41:09 AM", "device": "Light 1, Light 2", "action": "Turned OFF", "result": "Success"},
        {"time": "09:41:09 AM", "device": "AC Unit 1, AC Unit 2", "action": "Turned ON", "result": "Success"},
        {"time": "09:39:13 AM", "device": "Blind 1", "action": "Set to CLOSED", "result": "Success"},
        {"time": "09:38:55 AM", "device": "Blind 1", "action": "Set to CLOSED", "result": "Failed"},
        {"time": "09:00:00 AM", "device": "All devices", "action": "Initialization", "result": "Success"}
    ],
    "override_events": [
        {"time": "11:20:40 AM", "device": "Light 1, Light 2", "action": "Forced OFF", "by": "J.Cruz", "latency": "0.80 sec", "result": "Success"},
        {"time": "11:02:16 AM", "device": "Light 1, Light 2", "action": "Forced ON", "by": "J.Cruz", "latency": "0.82 sec", "result": "Success"},
        {"time": "10:42:03 AM", "device": "Blind 1", "action": "Set to PARTIAL", "by": "J.Cruz", "latency": "1.10 sec", "result": "Success"},
        {"time": "10:15:24 AM", "device": "AC Unit 2", "action": "Forced OFF", "by": "J.Cruz", "latency": "0.75 sec", "result": "Success"},
        {"time": "09:58:12 AM", "device": "Light 1", "action": "Forced OFF", "by": "Auto-Guard (safety rule)", "latency": "—", "result": "Success"},
        {"time": "09:30:00 AM", "device": "AC Unit 1", "action": "Power ON", "by": "System", "latency": "0.70 sec", "result": "Success"},
        {"time": "09:12:41 AM", "device": "Blind 2", "action": "Set to OPEN", "by": "M.Santos", "latency": "1.40 sec", "result": "Success"},
        {"time": "08:47:19 AM", "device": "Light 2", "action": "Forced ON", "by": "M.Santos", "latency": "2.10 sec", "result": "Success"},
        {"time": "08:20:05 AM", "device": "AC Unit 1, AC Unit 2", "action": "Power OFF", "by": "J.Cruz", "latency": "2.10 sec", "result": "Failed"},
        {"time": "08:01:30 AM", "device": "All devices", "action": "Revert to Automatic", "by": "J.Cruz", "latency": "—", "result": "Success"}
    ],
    "override_stats": {
        "success_rate": "96.4%",
        "total_overrides": 27,
        "failed_commands": 1,
        "avg_latency": "1.3 sec"
    },
    "automation_rules": [
        {"state": "Vacant", "threshold": "0", "lighting": "OFF", "ac": "OFF"},
        {"state": "Low", "threshold": "1-15", "lighting": "40%", "ac": "ON"},
        {"state": "Medium", "threshold": "16-35", "lighting": "70%", "ac": "ON"},
        {"state": "High", "threshold": "35+", "lighting": "100%", "ac": "ON"}
    ],
    "settings_data": {
        "authorized_users": [
            {"name": "J. Cruz", "email": "j.cruz@pup.edu.ph", "role": "Administrator", "status": "Active", "last_login": "Today, 10:41 AM"},
            {"name": "M. Santos", "email": "m.santos@pup.edu.ph", "role": "Faculty", "status": "Active", "last_login": "Today, 8:47 AM"},
            {"name": "Dr. R. Bautista", "email": "r.bautista@pup.edu.ph", "role": "Faculty", "status": "Active", "last_login": "Yesterday, 3:12 PM"},
            {"name": "A. Reyes", "email": "a.reyes@pup.edu.ph", "role": "Faculty", "status": "Inactive", "last_login": "2 weeks ago"}
        ],
        "software": {
            "dashboard_version": "v1.2.0",
            "python": "3.11.6",
            "flask": "3.0.2",
            "ultralytics_yolo": "YOLOv26 - v8.3.1",
            "sqlite": "3.45.1"
        },
        "deployment": {
            "room": "Room 313, CEA Building",
            "primary_node": "Raspberry Pi 4 Model B",
            "secondary_node": "ESP32-S3 N16R8",
            "network_mode": "LAN-restricted, no internet",
            "mqtt_host": "Raspberry Pi (local)"
        },
        "storage": {
            "database": "SQLite - local file",
            "database_size": "18.4 MB",
            "total_records": "4,812",
            "network_mode": "Aug 1, 2026",
            "auto_purge": "Logs older than 180 days"
        },
        "health_snapshot": {
            "uptime": "4h 12m",
            "nodes_online": "5 / 5",
            "last_restart": "Today, 9:00 AM",
            "last_backup": "Yesterday, 11:00 PM"
        }
    }
}

def get_tier_label(count):
    if count <= 15:
        return "TIER: LOW (0-15)"
    elif count <= 35:
        return "TIER: MEDIUM (16-35)"
    else:
        return "TIER: HIGH (36+)"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/dashboard-data", methods=["GET"])
def get_dashboard_data():
    # Simulate slight IoT sensor telemetry fluctuations for live feel
    temp_jitter = round(random.uniform(-0.1, 0.1), 1)
    lux_jitter = random.randint(-3, 3)
    
    current_temp = max(18.0, min(32.0, round(TELEMETRY_DATA["temperature"] + temp_jitter, 1)))
    current_indoor_lux = max(100, min(1000, TELEMETRY_DATA["indoor_lux"] + lux_jitter))
    
    online_count = sum(1 for hw in TELEMETRY_DATA["hardware_status"] if hw["status"] == "Online")
    total_hw = len(TELEMETRY_DATA["hardware_status"])

    response_payload = {
        "room": TELEMETRY_DATA["room"],
        "occupancy_count": TELEMETRY_DATA["occupancy_count"],
        "tier": get_tier_label(TELEMETRY_DATA["occupancy_count"]),
        "temperature": current_temp,
        "indoor_lux": current_indoor_lux,
        "outdoor_lux": TELEMETRY_DATA["outdoor_lux"],
        "control_mode": TELEMETRY_DATA["control_mode"],
        "last_auto_adjustment": TELEMETRY_DATA["last_auto_adjustment"],
        "hourly_trend": TELEMETRY_DATA["hourly_trend"],
        "hardware_summary": {
            "online_count": online_count,
            "total_count": total_hw,
            "nodes": TELEMETRY_DATA["hardware_status"]
        },
        "lighting": TELEMETRY_DATA["lighting"],
        "blinds": TELEMETRY_DATA["blinds"],
        "air_conditioning": TELEMETRY_DATA["air_conditioning"],
        "override_activity": TELEMETRY_DATA["override_activity"],
        "automation_rules": TELEMETRY_DATA["automation_rules"],
        "occupancy_logs": TELEMETRY_DATA["occupancy_logs"],
        "actuation_events": TELEMETRY_DATA["actuation_events"],
        "override_events": TELEMETRY_DATA["override_events"],
        "override_stats": TELEMETRY_DATA["override_stats"],
        "settings_data": TELEMETRY_DATA["settings_data"]
    }
    return jsonify(response_payload)

@app.route("/api/toggle-control-mode", methods=["POST"])
def toggle_control_mode():
    if TELEMETRY_DATA["control_mode"] == "Automated Control":
        TELEMETRY_DATA["control_mode"] = "Manual Control"
    else:
        TELEMETRY_DATA["control_mode"] = "Automated Control"
    
    return jsonify({"status": "success", "control_mode": TELEMETRY_DATA["control_mode"]})

@app.route("/api/device-control", methods=["POST"])
def device_control():
    payload = request.get_json() or {}
    category = payload.get("category")
    device_id = payload.get("device_id")
    new_state = payload.get("state")
    new_value = payload.get("value")

    if not device_id or not category:
        return jsonify({"status": "error", "message": "Missing parameters"}), 400

    target_list = TELEMETRY_DATA.get(category, [])
    found = False
    for dev in target_list:
        if dev["id"] == device_id:
            if new_state is not None:
                dev["state"] = bool(new_state)
            if category == "lighting" and new_value is not None:
                dev["brightness"] = int(new_value)
                dev["state"] = int(new_value) > 0
            if category == "blinds" and new_value is not None:
                dev["position"] = str(new_value).upper()
            if category == "air_conditioning" and new_value is not None:
                dev["temperature"] = int(new_value)
            dev["last_changed"] = "Manual by J.Cruz - Just now"
            found = True
            
            # Log to activity table
            TELEMETRY_DATA["override_activity"].insert(0, {
                "time": "Just now",
                "device": dev["name"],
                "action": f"Set to {new_value if new_value is not None else ('ON' if new_state else 'OFF')}",
                "status": "Success",
                "by": "J. Cruz"
            })
            if len(TELEMETRY_DATA["override_activity"]) > 8:
                TELEMETRY_DATA["override_activity"].pop()
            break

    if not found:
        return jsonify({"status": "error", "message": "Device not found"}), 404

    return jsonify({"status": "success", "category": category, "device_id": device_id})

@app.route("/api/hourly-trend", methods=["GET"])
def get_hourly_trend():
    range_param = request.args.get("range", "today").lower()
    labels = ["8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM"]
    
    if "yesterday" in range_param:
        data = [10, 25, 38, 44, 20, 28, 35, 15, 32, 18, 22, 14, 28]
    elif "today" in range_param:
        data = TELEMETRY_DATA["hourly_trend"]["data"]
    else:
        seed = sum(ord(c) for c in range_param)
        random.seed(seed)
        data = [random.randint(8, 48) for _ in labels]
        random.seed()
        
    return jsonify({"range": range_param, "labels": labels, "data": data})

if __name__ == "__main__":
    print("Starting OccupAI IoT Dashboard Server on http://127.0.0.1:5000 ...")
    app.run(host="0.0.0.0", port=5000, debug=True)

