from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from ..models import Usuario

usuarios_bp = Blueprint('usuarios', __name__)

@usuarios_bp.route('/perfil', methods=['GET'])
def perfil():
    try:
        # ✅ Verifica el token JWT desde la cookie automáticamente
        verify_jwt_in_request()
        usuario_id = get_jwt_identity()
        usuario = Usuario.query.get(usuario_id)

        if not usuario:
            return jsonify({"mensaje": "Usuario no encontrado"}), 404

        return jsonify({
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email,
            "rol": usuario.rol
        })

    except Exception as e:
        return jsonify({"mensaje": "Token inválido o ausente"}), 401
