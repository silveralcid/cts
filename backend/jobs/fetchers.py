import requests
from requests.adapters import HTTPAdapter, Retry


HEADERS = {
    "User-Agent": "CTS-LocalFetcher/0.1 (local dev)"
}


def fetch_job_post_html(url: str, timeout=(5, 15)) -> str:
    """Fetch raw HTML for a job post URL and return it as text."""
    session = requests.Session()
    retries = Retry(
        total=2,
        backoff_factor=0.3,
        status_forcelist=[429, 500, 502, 503, 504],
    )
    session.mount("https://", HTTPAdapter(max_retries=retries))
    session.mount("http://", HTTPAdapter(max_retries=retries))

    print(f"Fetching {url} ...")
    resp = session.get(url, headers=HEADERS,
                       timeout=timeout, allow_redirects=True)
    resp.raise_for_status()

    content_type = resp.headers.get("content-type", "").lower()
    if "html" not in content_type:
        raise ValueError(f"Non-HTML content type: {content_type}")

    return resp.text


def fetch_job_post_for_save(url: str) -> str:
    """
    Fetch job post HTML for saving as an attachment.
    This is a thin wrapper around fetch_job_post_html().
    """
    html = fetch_job_post_html(url)
    return html
