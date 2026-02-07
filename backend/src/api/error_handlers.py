"""
Error handlers for the backend API.
"""
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    Handle HTTP exceptions globally.
    """
    logger.error(f"HTTP Exception: {exc.status_code} - {exc.detail}")

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_code": exc.status_code
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle request validation errors globally.
    """
    logger.error(f"Validation Error: {exc.errors()}")

    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": exc.errors(),
            "error_code": 422
        }
    )

async def unauthorized_exception_handler(request: Request, exc: HTTPException):
    """
    Handle unauthorized access errors specifically.
    """
    if exc.status_code == 401:
        logger.warning(f"Unauthorized access attempt: {exc.detail}")

        return JSONResponse(
            status_code=401,
            content={
                "detail": "Unauthorized: Invalid or missing authentication credentials",
                "error_code": 401
            }
        )

    # For other HTTP exceptions, use the generic handler
    return await http_exception_handler(request, exc)

async def general_exception_handler(request: Request, exc: Exception):
    """
    Handle general exceptions globally.
    """
    logger.error(f"General Exception: {str(exc)}", exc_info=True)

    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error_code": 500
        }
    )