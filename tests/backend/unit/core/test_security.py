from datetime import datetime, timedelta, timezone

import jwt
import pytest
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials

from app.core import security
from tests.backend.support.fakes import FakeConnection, FakeCursor


def test_create_token_y_decode_token_conservan_los_datos_principales():
    usuario = {
        "id": 12,
        "correo": "docente@demo.com",
        "rol": "DOCENTE",
    }

    token = security.create_token(usuario)
    payload = security.decode_token(token)

    assert payload["sub"] == "12"
    assert payload["correo"] == "docente@demo.com"
    assert payload["rol"] == "DOCENTE"
    assert "exp" in payload


def test_decode_token_rechaza_un_token_invalido():
    with pytest.raises(HTTPException) as exc_info:
        security.decode_token("token-no-valido")

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail.lower().startswith("token")


def test_decode_token_rechaza_un_token_expirado():
    expired_token = jwt.encode(
        {
            "sub": "1",
            "correo": "admin@demo.com",
            "rol": "ADMIN",
            "exp": datetime.now(timezone.utc) - timedelta(minutes=1),
        },
        security.JWT_SECRET,
        algorithm=security.JWT_ALGORITHM,
    )

    with pytest.raises(HTTPException) as exc_info:
        security.decode_token(expired_token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "El token ha expirado."


def test_get_current_user_devuelve_el_usuario_activo_asociado_al_token(monkeypatch):
    usuario = {
        "id": 5,
        "correo": "estudiante@demo.com",
        "rol": "ESTUDIANTE",
        "activo": True,
    }
    cursor = FakeCursor(fetchone_results=[usuario])
    connection = FakeConnection(cursor)
    credentials = HTTPAuthorizationCredentials(
        scheme="Bearer",
        credentials="jwt-demo",
    )

    monkeypatch.setattr(
        security,
        "decode_token",
        lambda token: {"sub": "5", "correo": "estudiante@demo.com", "rol": "ESTUDIANTE"},
    )
    monkeypatch.setattr(security, "get_connection", lambda: connection)

    current_user = security.get_current_user(credentials)

    assert current_user == usuario
    assert cursor.execute_calls[0][1] == ("5",)
    assert cursor.closed is True
    assert connection.closed is True


def test_get_current_user_rechaza_tokens_sin_usuario(monkeypatch):
    credentials = HTTPAuthorizationCredentials(
        scheme="Bearer",
        credentials="jwt-demo",
    )

    monkeypatch.setattr(security, "decode_token", lambda token: {})

    with pytest.raises(HTTPException) as exc_info:
        security.get_current_user(credentials)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail.startswith("Token sin usuario")


def test_require_docente_rechaza_usuarios_con_otro_rol():
    with pytest.raises(HTTPException) as exc_info:
        security.require_docente({"id": 10, "rol": "ADMIN"})

    assert exc_info.value.status_code == 403


def test_require_docente_devuelve_el_usuario_si_tiene_rol_docente():
    usuario = {"id": 22, "rol": "DOCENTE"}

    assert security.require_docente(usuario) == usuario
