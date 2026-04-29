from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import ValidationError

def get_cors_headers():
    return {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Credentials": "true",
    }

class APIError(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail

def register_exception_handlers(app: FastAPI):
    @app.exception_handler(HTTPException)
    async def handle_http_exception(_: Request, exc: HTTPException):
        headers = get_cors_headers()
        if exc.headers:
            headers.update(exc.headers)
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail}, headers=headers)

    @app.exception_handler(APIError)
    async def handle_api_error(_: Request, exc: APIError):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail}, headers=get_cors_headers())

    @app.exception_handler(ValidationError)
    async def handle_validation(_: Request, exc: ValidationError):
        return JSONResponse(status_code=422, content={"detail": exc.errors()}, headers=get_cors_headers())

    @app.exception_handler(Exception)
    async def handle_generic(_: Request, exc: Exception):
        return JSONResponse(status_code=500, content={"detail": "Unexpected server error", "error": str(exc)}, headers=get_cors_headers())
