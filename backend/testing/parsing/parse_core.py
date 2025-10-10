import json
from bs4 import BeautifulSoup


def parse_core(html: str, url: str) -> dict:
    """
    Extract only the core, reliable job fields from any job post.
    Focuses on JSON-LD (schema.org/JobPosting).
    Returns a dict with: title, company, location, employment_type, date_posted, url.
    """

    soup = BeautifulSoup(html, "lxml")
    parsed = {
        "title": None,
        "company": None,
        "location": None,
        "employment_type": None,
        "date_posted": None,
        "url": url,
    }

    # === 1. Look for JSON-LD blocks ===
    jsonld_tags = soup.find_all("script", type="application/ld+json")
    for tag in jsonld_tags:
        try:
            data = json.loads(tag.string)
        except Exception:
            continue

        # handle list-style JSON-LD blocks
        items = data if isinstance(data, list) else [data]

        for item in items:
            if item.get("@type") == "JobPosting":
                # title
                parsed["title"] = parsed["title"] or item.get("title")

                # company (hiringOrganization.name)
                org = item.get("hiringOrganization")
                if isinstance(org, dict):
                    parsed["company"] = parsed["company"] or org.get("name")

                # employment type
                parsed["employment_type"] = parsed["employment_type"] or item.get(
                    "employmentType")

                # date posted
                parsed["date_posted"] = parsed["date_posted"] or item.get(
                    "datePosted")

                # location
                loc = item.get("jobLocation")
                if isinstance(loc, dict):
                    addr = loc.get("address", {})
                    city = addr.get("addressLocality")
                    region = addr.get("addressRegion")
                    parsed["location"] = parsed["location"] or ", ".join(
                        [p for p in [city, region] if p]
                    )
                elif isinstance(loc, list) and loc:
                    addr = loc[0].get("address", {})
                    city = addr.get("addressLocality")
                    region = addr.get("addressRegion")
                    parsed["location"] = parsed["location"] or ", ".join(
                        [p for p in [city, region] if p]
                    )

                # once filled, stop
                break

        # if all core fields are filled, we can stop scanning
        if all(parsed.values()):
            break

    # === 2. Fallbacks for missing fields (HTML)
    if not parsed["title"]:
        h1 = soup.find("h1")
        if h1:
            parsed["title"] = h1.get_text(strip=True)

    if not parsed["company"]:
        logo = soup.select_one(".image-container img[alt]")
        if logo:
            parsed["company"] = logo["alt"].replace(" Logo", "").strip()

    if not parsed["location"]:
        loc_div = soup.select_one(".job__location")
        if loc_div:
            parsed["location"] = loc_div.get_text(strip=True)

    return {k: v for k, v in parsed.items() if v}
