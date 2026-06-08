from fastapi.testclient import TestClient

from app.main import app
from app.modules.auth import auth_routes


client = TestClient(app)


def test_root_responde_que_la_api_funciona():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "API funcionando"}


def test_login_responde_401_si_el_servicio_no_autentica(monkeypatch):
    monkeypatch.setattr(auth_routes, "login_user", lambda correo, contrasena: None)

    response = client.post(
        "/auth/login",
        json={
            "correo": "invalido@demo.com",
            "contrasena": "falla123",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Credenciales incorrectas"


def test_login_devuelve_respuesta_del_servicio_autenticado(monkeypatch):
    expected_response = {
        "mensaje": "Login correcto",
        "token": "jwt-demo",
        "redirect": "/docente",
        "usuario": {
            "id": 3,
            "correo": "docente@demo.com",
            "rol": "DOCENTE",
            "docente_id": 9,
            "estudiante_id": None,
        },
    }

    monkeypatch.setattr(
        auth_routes,
        "login_user",
        lambda correo, contrasena: expected_response,
    )

    response = client.post(
        "/auth/login",
        json={
            "correo": "docente@demo.com",
            "contrasena": "segura123",
        },
    )

    assert response.status_code == 200
    assert response.json() == expected_response
