import json
from bs4 import BeautifulSoup
from decimal import Decimal
from typing import Optional, Dict


def parse_greenhouse(html: str, url: str, parsed: Optional[Dict] = None) -> Dict:
    """
    Fills missing JobPosting fields using Greenhouse HTML conventions.
    Intended to run AFTER a generic JSON-LD parser.
    """
    soup = BeautifulSoup(html, "lxml")

    if parsed is None:
        parsed = {}

    # === 1. Title (visible <h1>) ===
    if not parsed.get("title"):
        h1 = soup.find("h1")
        if h1:
            parsed["title"] = h1.get_text(strip=True)

    # === 2. Hiring Organization (logo alt or company link) ===
    if not parsed.get("hiringOrganization"):
        logo_alt = soup.select_one(".image-container img")
        if logo_alt and logo_alt.get("alt"):
            company_name = logo_alt["alt"].replace(" Logo", "").strip()
            parsed["hiringOrganization"] = {
                "@type": "Organization", "name": company_name}

    # === 3. Description (HTML body) ===
    if not parsed.get("employerOverview") and not parsed.get("responsibilities"):
        desc = soup.select_one(".job__description")
        if desc:
            text = desc.get_text(separator="\n", strip=True)
            parsed["employerOverview"] = text
            parsed["responsibilities"] = text

    # === 4. Job Location (fallback from visible header) ===
    if not parsed.get("jobLocation"):
        loc_div = soup.select_one(".job__location")
        if loc_div:
            loc_text = loc_div.get_text(strip=True)
            parsed["jobLocation"] = {
                "@type": "Place",
                "address": {"@type": "PostalAddress", "addressLocality": loc_text}
            }
            parsed["jobLocationType"] = "TELECOMMUTE" if "remote" in loc_text.lower(
            ) else "ONSITE"

    # === 5. Salary extraction (visible compensation text if JSON-LD missing) ===
    if not parsed.get("baseSalary"):
        body_text = soup.get_text(separator=" ")
        import re
        match = re.search(
            r"(\$|USD)\s?(\d{2,3}(?:,\d{3})*)(?:\s*-\s*(\$|USD)?\s?(\d{2,3}(?:,\d{3})*))?",
            body_text
        )
        if match:
            min_str = match.group(2).replace(",", "")
            max_str = match.group(4).replace(
                ",", "") if match.group(4) else None
            try:
                base = {
                    "@type": "MonetaryAmount",
                    "currency": "USD",
                    "value": {
                        "@type": "QuantitativeValue",
                        "minValue": Decimal(min_str),
                        "maxValue": Decimal(max_str) if max_str else Decimal(min_str),
                        "unitText": "YEAR"
                    }
                }
                parsed["baseSalary"] = base
                parsed["salaryCurrency"] = "USD"
            except Exception:
                pass

    # === 6. Remote and location type flag ===
    if not parsed.get("jobLocationType"):
        text_to_check = (str(parsed.get("employerOverview")) or "").lower()
        parsed["jobLocationType"] = "TELECOMMUTE" if "remote" in text_to_check else "ONSITE"

    # === 7. Date posted (meta tag fallback) ===
    if not parsed.get("datePosted"):
        meta_date = soup.find("meta", {"property": "article:published_time"})
        if meta_date and meta_date.get("content"):
            parsed["datePosted"] = meta_date["content"]

    # === 8. Always preserve URL ===
    parsed["url"] = url

    return parsed
