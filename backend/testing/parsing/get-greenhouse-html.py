import requests
import os
import re
import time
import random

# Input file (one URL per line)
URL_LIST_FILE = "url-list.txt"

# User-Agent for polite scraping
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; LocalTest/1.0)"}


def extract_name(url: str) -> str:
    """
    Extracts the company identifier from a Greenhouse URL.
    Example:
        https://job-boards.greenhouse.io/vultr/jobs/4605266006 -> 'vultr'
    """
    match = re.search(r"greenhouse\.io/([^/]+)/jobs", url)
    if match:
        return match.group(1)
    return "unknown"


def download_greenhouse_jobs():
    if not os.path.exists(URL_LIST_FILE):
        raise FileNotFoundError(
            f"Missing {URL_LIST_FILE} in current directory")

    with open(URL_LIST_FILE, "r", encoding="utf-8") as file:
        urls = [line.strip() for line in file if line.strip()]

    print(f"Found {len(urls)} URLs to download.\n")

    for idx, url in enumerate(urls, start=1):
        name = extract_name(url)
        filename = f"greenhouse-{name}.html"

        try:
            print(f"[{idx}/{len(urls)}] Fetching {url} ...")
            r = requests.get(url, headers=HEADERS, timeout=15)
            r.raise_for_status()

            with open(filename, "w", encoding="utf-8") as f:
                f.write(r.text)

            print(f"✅ Saved: {filename} ({len(r.text)} bytes)")

        except Exception as e:
            print(f"❌ Failed to download {url}: {e}")

        # Safety delay
        delay = random.uniform(2.0, 5.0)
        print(f"Sleeping for {delay:.2f} seconds...\n")
        time.sleep(delay)


if __name__ == "__main__":
    download_greenhouse_jobs()
