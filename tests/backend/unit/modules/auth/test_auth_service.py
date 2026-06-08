import pytest
from fastapi import HTTPException

from app.modules.auth import auth_service
from tests.backend.support.fakes import FakeConnection, FakeCursor


def test_obtener_redirect_por_rol_devuelve_ruta_esperada():
    assert auth_service.obtener_redirect_por_rol("ADMIN") == "/admin"
    assert auth_service.obtener_redirect_por_rol("DOCENTE") == "/docente"
    assert auth_service.obtener_redirect_por_rol("ESTUDIANTE") == "/estudiante"


def test_obtener_redirect_por_rol_devuelve_none_si_el_rol_no_existe():
    assert auth_service.obtener_redirect_por_rol("INVITADO") is None


def test_login_user_devuelve_token_y_usuario_si_las_credenciales_son_validas(
    monkeypatch,
):
    usuario = {
        "id": 7,
        "correo": "admin@demo.com",
        "rol": "ADMIN",
        "docente_id": None,
        "estudiante_id": None,
    }
    cursor = FakeCursor(fetchone_results=[usuario])
    connection = FakeConnection(cursor)

    monkeypatch.setattr(auth_service, "get_connection", lambda: connection)
    monkeypatch.setattr(auth_service, "create_token", lambda current_user: "jwt-demo")

    response = auth_service.login_user("admin@demo.com", "secreto123")

    assert response == {
        "mensaje": "Login correcto",
        "token": "jwt-demo",
        "redirect": "/admin",
        "usuario": {
            "id": 7,
            "correo": "admin@demo.com",
            "rol": "ADMIN",
            "docente_id": None,
            "estudiante_id": None,
        },
    }
    assert cursor.execute_calls[0][1] == ("admin@demo.com", "secreto123")
    assert cursor.closed is True
    assert connection.closed is True


def test_login_user_devuelve_none_si_no_encuentra_al_usuario(monkeypatch):
    cursor = FakeCursor(fetchone_results=[None])
    connection = FakeConnection(cursor)

    monkeypatch.setattr(auth_service, "get_connection", lambda: connection)

    response = auth_service.login_user("nadie@demo.com", "incorrecta")

    assert response is None
    assert cursor.closed is True
    assert connection.closed is True


def test_login_user_convierte_errores_inesperados_en_http_exception(monkeypatch):
    monkeypatch.setattr(
        auth_service,
        "get_connection",
        lambda: (_ for _ in ()).throw(RuntimeError("db fuera de linea")),
    )

    with pytest.raises(HTTPException) as exc_info:
        auth_service.login_user("admin@demo.com", "secreto123")

    assert exc_info.value.status_code == 500
    assert "Error en login" in exc_info.value.detail
