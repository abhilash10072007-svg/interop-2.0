from fastapi import APIRouter

from services.validation import (
    validate_citizen_data,
    validate_income_data,
    validate_education_data
)

router = APIRouter()


@router.post("/citizen")
def validate_citizen(data: dict):

    return validate_citizen_data(data)


@router.post("/income")
def validate_income(data: dict):

    return validate_income_data(data)


@router.post("/education")
def validate_education(data: dict):

    return validate_education_data(data)