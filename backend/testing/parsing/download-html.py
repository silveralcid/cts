import requests

url = "https://job-boards.greenhouse.io/speechify/jobs/5673271004"
headers = {"User-Agent": "Mozilla/5.0 (compatible; LocalTest/1.0)"}

r = requests.get(url, headers=headers, timeout=15)
r.raise_for_status()  # ensures we only continue on success

html = r.text
print(f"Downloaded {len(html)} bytes")

# save it to a file for later
with open("sample.html", "w", encoding="utf-8") as f:
    f.write(html)
