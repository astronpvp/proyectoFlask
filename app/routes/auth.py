from flask import Blueprint, request, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
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

    token_db = Token(usuario_id=usuario.id, token=access_token)
    db.session.add(token_db)
    db.session.commit()

    response = make_response(jsonify({"mensaje": "Login exitoso"}))
    response.set_cookie(
        key='access_token_cookie',
        value=access_token,
        httponly=True,
        samesite='Lax',
        max_age=3600  # 1 hora
    )

    return response
