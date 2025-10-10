import requests
from requests.adapters import HTTPAdapter, Retry

HEADERS = {
    "User-Agent": "CTS-LocalFetcher/0.1 (local dev)"
}


def fetch_job_post_html(url: str, timeout=(5, 15)):
    """Fetch raw HTML for a job post URL and return it as text."""
    session = requests.Session()
    retries = Retry(total=2, backoff_factor=0.3,
                    status_forcelist=[429, 500, 502, 503, 504])
    session.mount("https://", HTTPAdapter(max_retries=retries))
    session.mount("http://", HTTPAdapter(max_retries=retries))

    print(f"Fetching {url} ...")
    resp = session.get(url, headers=HEADERS,
                       timeout=timeout, allow_redirects=True)
    resp.raise_for_status()

    if "html" not in resp.headers.get("content-type", "").lower():
        raise ValueError(
            f"Non-HTML content type: {resp.headers.get('content-type')}")
    return resp.text
