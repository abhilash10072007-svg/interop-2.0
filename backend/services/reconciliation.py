def reconcile_citizen_data(
    citizen,
    education_records,
    income_records,
    welfare_records
):

    conflicts = []

    golden_dob = citizen.get("dob")
    golden_name = citizen.get("name")

    # Check Education records
    for record in education_records:

        if record.get("date_of_birth") != golden_dob:
            conflicts.append({
                "department": "Education Department",
                "field": "date_of_birth",
                "golden_value": golden_dob,
                "department_value": record.get("date_of_birth")
            })

        if record.get("name") != golden_name:
            conflicts.append({
                "department": "Education Department",
                "field": "name",
                "golden_value": golden_name,
                "department_value": record.get("name")
            })

    # Check Income records
    for record in income_records:

        if record.get("date_of_birth") != golden_dob:
            conflicts.append({
                "department": "Income Department",
                "field": "date_of_birth",
                "golden_value": golden_dob,
                "department_value": record.get("date_of_birth")
            })

        if record.get("name") != golden_name:
            conflicts.append({
                "department": "Income Department",
                "field": "name",
                "golden_value": golden_name,
                "department_value": record.get("name")
            })

    # Check Welfare records
    for record in welfare_records:

        if record.get("date_of_birth") != golden_dob:
            conflicts.append({
                "department": "Welfare Department",
                "field": "date_of_birth",
                "golden_value": golden_dob,
                "department_value": record.get("date_of_birth")
            })

        if record.get("name") != golden_name:
            conflicts.append({
                "department": "Welfare Department",
                "field": "name",
                "golden_value": golden_name,
                "department_value": record.get("name")
            })

    return {
        "reconciliation_status": (
            "CONFLICTS_FOUND"
            if conflicts
            else "NO_CONFLICTS"
        ),
        "conflict_count": len(conflicts),
        "conflicts": conflicts
    }