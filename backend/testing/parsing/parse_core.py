import json
from bs4 import BeautifulSoup


def parse_core(html: str) -> dict:
    """
    Extract only the two most reliable job fields: title and company.

    Strategy:
    1. Prefer schema.org/JobPosting JSON-LD blocks.
    2. Fallback to HTML structure (<h1>, <title>, logo alt text, og:site_name).

    Returns
    -------
    dict
        Example: {"title": "Software Engineer", "company": "OpenAI"}
    """

    soup = BeautifulSoup(html or "", "lxml")
    parsed = {"title": None, "company": None}

    # === 1. Structured data: schema.org JobPosting ===
    for tag in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(tag.string or "")
        except Exception:
            continue

        items = data if isinstance(data, list) else [data]

        for item in items:
            if not isinstance(item, dict):
                continue
            if item.get("@type") == "JobPosting":
                if not parsed["title"]:
                    parsed["title"] = item.get("title")
                if not parsed["company"]:
                    org = item.get("hiringOrganization")
                    if isinstance(org, dict):
                        parsed["company"] = org.get("name")
            if parsed["title"] and parsed["company"]:
                break
        if parsed["title"] and parsed["company"]:
            break

    # === 2. Fallbacks for missing data ===
    # title
    if not parsed["title"]:
        h1 = soup.find("h1")
        if h1 and h1.get_text(strip=True):
            parsed["title"] = h1.get_text(strip=True)
        elif soup.title and soup.title.string:
            parsed["title"] = soup.title.string.strip()

    # company
    if not parsed["company"]:
        # logo alt text is common
        logo = soup.select_one('img[alt*="Logo"], .image-container img[alt]')
        if logo and logo.get("alt"):
            parsed["company"] = logo["alt"].replace(" Logo", "").strip()

        # meta tag fallback
        if not parsed["company"]:
            meta_company = soup.find("meta", {"property": "og:site_name"})
            if meta_company and meta_company.get("content"):
                parsed["company"] = meta_company["content"].strip()

        # minimal heuristic scan
        if not parsed["company"]:
            candidates = soup.find_all(
                ["div", "span"],
                string=lambda s: s and "©" not in s and len(s) < 60
            )
            for tag in candidates:
                text = tag.get_text(strip=True)
                if not text or "career" in text.lower() or "job" in text.lower():
                    continue
                if len(text.split()) <= 3:
                    parsed["company"] = text
                    break

    return {k: v for k, v in parsed.items() if v}
