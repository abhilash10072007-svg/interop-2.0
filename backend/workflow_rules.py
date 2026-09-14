WORKFLOW_RULES = {
    "Ration Card (NFSA)": {
        "excluded_if_has_scheme": ["PMAY"],
        "description": "Not eligible if already receiving PMAY housing benefit.",
    },
    "PM-KISAN": {
        "excluded_if_has_scheme": [],
        "description": "Open to all verified citizens; no exclusions.",
    },
    "Ayushman Bharat": {
        "excluded_if_has_scheme": [],
        "description": "Open to all verified citizens; no exclusions.",
    },
}


def evaluate_eligibility(scheme_name: str, citizen_profile: dict) -> tuple[bool, str]:
    rule = WORKFLOW_RULES.get(scheme_name)
    if rule is None:
        return False, f"'{scheme_name}' is not a recognized scheme."

    if not citizen_profile.get("kyc_verified"):
        return False, "KYC not verified."

    existing_schemes = citizen_profile.get("linked_schemes", [])
    for excluded in rule["excluded_if_has_scheme"]:
        if excluded in existing_schemes:
            return False, f"Not eligible: already receiving {excluded}."

    return True, "Eligible."
