import json
from decimal import Decimal
from bs4 import BeautifulSoup


def parse_generic(html: str, url: str) -> dict:
    """
    Extracts official schema.org/JobPosting properties from JSON-LD data.
    Returns a dict covering recognized JobPosting fields only.
    """
    soup = BeautifulSoup(html, "lxml")
    job = _extract_jobposting_jsonld(soup)

    parsed = {
        # JobPosting
        "applicantLocationRequirements": None,
        "applicationContact": None,
        "baseSalary": None,
        "datePosted": None,
        "directApply": None,
        "educationRequirements": None,
        "eligibilityToWorkRequirement": None,
        "employerOverview": None,
        "employmentType": None,
        "employmentUnit": None,
        "estimatedSalary": None,
        "experienceInPlaceOfEducation": None,
        "experienceRequirements": None,
        "hiringOrganization": None,
        "incentiveCompensation": None,
        "industry": None,
        "jobBenefits": None,
        "jobImmediateStart": None,
        "jobLocation": None,
        "jobLocationType": None,
        "jobStartDate": None,
        "occupationalCategory": None,
        "physicalRequirement": None,
        "qualifications": None,
        "relevantOccupation": None,
        "responsibilities": None,
        "salaryCurrency": None,
        "securityClearanceRequirement": None,
        "sensoryRequirement": None,
        "skills": None,
        "specialCommitments": None,
        "title": None,
        "totalJobOpenings": None,
        "validThrough": None,
        "workHours": None,

        # Always include source
        "url": url,
    }

    if not job:
        return parsed

    # Straightforward mappings
    for k in parsed.keys():
        if k == "url":
            continue
        val = job.get(k)
        if val is not None:
            parsed[k] = val

    # Normalize substructures
    parsed["hiringOrganization"] = _get_nested(
        job, "hiringOrganization", "name")
    parsed["jobLocation"] = _parse_location(job)
    parsed["baseSalary"] = _parse_base_salary(job)

    # Clean string fields
    parsed = {k: (v.strip() if isinstance(v, str) else v)
              for k, v in parsed.items() if v is not None}
    return parsed


def _extract_jobposting_jsonld(soup):
    """Extracts the first valid schema.org JobPosting JSON-LD object."""
    for tag in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(tag.string)
        except Exception:
            continue

        if isinstance(data, list):
            for item in data:
                if _is_jobposting(item):
                    return item
        elif isinstance(data, dict):
            if _is_jobposting(data):
                return data
            graph = data.get("@graph")
            if isinstance(graph, list):
                for node in graph:
                    if _is_jobposting(node):
                        return node
    return None


def _is_jobposting(obj):
    return isinstance(obj, dict) and (
        obj.get("@type") == "JobPosting" or
        (isinstance(obj.get("@type"), list) and "JobPosting" in obj.get("@type"))
    )


def _get_nested(data, key, subkey):
    val = data.get(key)
    if isinstance(val, dict):
        return val.get(subkey)
    elif isinstance(val, list) and val:
        return val[0].get(subkey)
    return None


def _parse_location(job):
    loc = job.get("jobLocation")
    if isinstance(loc, dict):
        addr = loc.get("address", {})
        city = addr.get("addressLocality")
        region = addr.get("addressRegion")
        country = addr.get("addressCountry")
        return ", ".join(filter(None, [city, region, country])) or None
    elif isinstance(loc, list) and loc:
        return _parse_location(loc[0])
    return None


def _parse_base_salary(job):
    sal = job.get("baseSalary")
    if not sal:
        return None
    try:
        if isinstance(sal, dict):
            currency = sal.get("currency") or _get_nested(
                sal, "value", "currency")
            value = sal.get("value")
            min_val = max_val = None
            if isinstance(value, dict):
                min_val = value.get("minValue")
                max_val = value.get("maxValue")
            elif isinstance(value, (int, float, str)):
                min_val = max_val = value
            if min_val:
                min_val = Decimal(str(min_val))
            if max_val:
                max_val = Decimal(str(max_val))
            return {
                "currency": currency,
                "minValue": min_val,
                "maxValue": max_val,
                "unitText": _get_nested(sal, "value", "unitText") or sal.get("unitText"),
            }
    except Exception:
        pass
    return None
