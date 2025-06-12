import requests
import time

ASTROMETRY_API_URL = "http://nova.astrometry.net/api/"
API_KEY = "spvcbofjfgfjwvk"  # Replace with your own key if needed

def submit_astrometry_job(image_bytes):
    # Step 1: Login
    login_resp = requests.post(
        ASTROMETRY_API_URL + "login",
        data={"request-json": '{"apikey": "' + API_KEY + '"}'}
    )
    session = login_resp.json().get("session")
    if not session:
        return {"status": "error", "message": "Login failed"}

    # Step 2: Upload image
    files = {'file': ('image.jpg', image_bytes)}
    data = {'request-json': '{"session": "%s"}' % session}
    upload_resp = requests.post(ASTROMETRY_API_URL + "upload", files=files, data=data)
    sub_id = upload_resp.json().get("subid")
    if not sub_id:
        return {"status": "error", "message": "Upload failed"}

    # Step 3: Wait for job ID
    job_id = None
    for _ in range(30):
        time.sleep(3)
        status = requests.get(ASTROMETRY_API_URL + f"submissions/{sub_id}").json()
        jobs = status.get("jobs", [])
        if jobs and jobs[0]:
            job_id = jobs[0]
            break
    if not job_id:
        return {"status": "error", "message": "Timeout waiting for job"}

    # Step 4: Wait for job to finish
    for _ in range(30):
        time.sleep(5)
        job_status = requests.get(ASTROMETRY_API_URL + f"jobs/{job_id}").json()
        if job_status.get("status") == "success":
            break
        elif job_status.get("status") == "failure":
            return {"status": "error", "message": "Job failed"}
    else:
        return {"status": "error", "message": "Job timeout"}

    # Step 5: Get constellation annotations
    annot_resp = requests.get(ASTROMETRY_API_URL + f"annotations/{job_id}").json()

    lines = []
    constellations = annot_resp.get("constellations", [])
    for con in constellations:
        name = con.get("name", "Unknown")
        for line in con.get("lines", []):
            (x1, y1), (x2, y2) = line
            lines.append({
                "x1": x1,
                "y1": y1,
                "x2": x2,
                "y2": y2,
                "name": name
            })

    return {
        "status": "success",
        "constellation_lines": lines
    }
