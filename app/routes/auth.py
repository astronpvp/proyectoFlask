from flask import Blueprint, request, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    get_jti,
    jwt_required,
    get_jwt,
    unset_jwt_cookies
)


from datetime import timedelta
from ..models import Usuario, Token
from .. import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    nombre = data.get('nombre')
    email = data.get('email')
    password = data.get('password')
    rol = data.get('rol', 'usuario')  # por defecto es "usuario"

    if Usuario.query.filter_by(email=email).first():
        return jsonify({"mensaje": "El correo ya está registrado"}), 400

    hashed_password = generate_password_hash(password)
    nuevo_usuario = Usuario(nombre=nombre, email=email, password=hashed_password, rol=rol)

    db.session.add(nuevo_usuario)
    db.session.commit()

    return jsonify({"mensaje": "Usuario registrado correctamente"}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario or not check_password_hash(usuario.password, password):
        return jsonify({"mensaje": "Credenciales inválidas"}), 401

    access_token = create_access_token(identity=str(usuario.id), expires_delta=timedelta(hours=1))
    jti = get_jti(access_token)  # 🆕 Obtener el identificador único del token

    # 🆕 Guardar jti en base de datos
    token_db = Token(usuario_id=usuario.id, token=access_token, jti=jti)
    db.session.add(token_db)
    db.session.commit()

    # Crear la cookie segura
    response = make_response(jsonify({"mensaje": "Login exitoso"}))
    response.set_cookie(
        key='access_token_cookie',
        value=access_token,
        httponly=True,
        secure=True,         # ✅ obligatorio para cross-origin en HTTPS
        samesite='None',     # ✅ obligatorio para enviar cookie cross-site
        max_age=3600
    )

    return response

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt().get("jti")

    if jti:
        token = Token.query.filter_by(jti=jti).first()
        if token:
            db.session.delete(token)
            db.session.commit()

    response = jsonify({"msg": "Sesión cerrada correctamente"})
    unset_jwt_cookies(response)
    return response, 200
