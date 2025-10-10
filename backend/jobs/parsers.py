# backend/jobs/parsers.py
import re
from bs4 import BeautifulSoup
from urllib.parse import urlparse


def parse_job_post_html(html: str, url: str) -> dict:
    """Extract basic fields (title, company, location, salary, etc.) from raw job post HTML.

    Uses the lxml parser for faster, more fault-tolerant parsing.
    """
    # === 0. Parse HTML with lxml ===
    soup = BeautifulSoup(html, "lxml")

    # === 1. Domain hint (useful for specialized parsing later) ===
    domain = urlparse(url).netloc.lower()

    # === 2. Try to grab <title> as fallback ===
    title = None
    if soup.title and soup.title.string:
        title = soup.title.string.strip()

    # === 3. Try to find the main <h1> — many job sites use it for the position ===
    if not title:
        h1 = soup.find("h1")
        if h1:
            title = h1.get_text(strip=True)

    # === 4. Get visible text and normalize ===
    text = soup.get_text(separator="\n")
    clean_text = re.sub(r"\s+", " ", text)

    # === 5. Simple heuristics ===
    salary = None
    salary_match = re.search(
        r"(\$|USD)\s?\d{2,3}(?:,\d{3})*(?:\s*-\s*(?:\$|USD)?\s?\d{2,3}(?:,\d{3})*)?", clean_text
    )
    if salary_match:
        salary = salary_match.group(0)

    location = None
    loc_match = re.search(
        r"\b(Remote|[A-Z][a-z]+,\s?[A-Z]{2})\b", clean_text
    )
    if loc_match:
        location = loc_match.group(0)

    # === 6. Special cases per domain (placeholder) ===
    if "greenhouse.io" in domain:
        # Greenhouse pages usually have <meta property="og:title"> etc.
        meta_title = soup.find("meta", {"property": "og:title"})
        if meta_title and meta_title.get("content"):
            title = meta_title["content"]

    return {
        "title": title,
        "salary_raw": salary,
        "location": location,
        "domain": domain,
        "text_sample": clean_text[:800],  # for debugging
    }
