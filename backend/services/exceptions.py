class GovSyncException(Exception):
    def __init__(
        self,
        message,
        error_code="GOVSYNC_ERROR"
    ):
        self.message = message
        self.error_code = error_code

        super().__init__(message)


class DepartmentUnavailableException(
    GovSyncException
):
    def __init__(
        self,
        department
    ):
        super().__init__(
            message=f"{department} is currently unavailable",
            error_code="DEPARTMENT_UNAVAILABLE"
        )


class DataValidationException(
    GovSyncException
):
    def __init__(
        self,
        errors
    ):
        self.errors = errors

        super().__init__(
            message="Department data validation failed",
            error_code="DATA_VALIDATION_FAILED"
        )


class DataConflictException(
    GovSyncException
):
    def __init__(
        self,
        conflicts
    ):
        self.conflicts = conflicts

        super().__init__(
            message="Data conflict detected",
            error_code="DATA_CONFLICT"
        )