from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from ..models import Publicacion, Usuario
from .. import db
from datetime import datetime

publicaciones_bp = Blueprint('publicaciones', __name__)

@publicaciones_bp.route('/', methods=['POST'])
def crear_publicacion():
    try:
        # Autenticación mediante cookie
        verify_jwt_in_request(locations=['cookies'])
        usuario_id = get_jwt_identity()
        usuario = Usuario.query.get(usuario_id)

        # Solo empresa o admin pueden crear publicaciones
        if not usuario or usuario.rol not in ['admin', 'empresa']:
            return jsonify({"mensaje": "No autorizado"}), 403

        data = request.get_json()

        nueva_pub = Publicacion(
            tipo=data.get('tipo'),
            titulo=data.get('titulo'),
            descripcion=data.get('descripcion'),
            ubicacion=data.get('ubicacion'),
            tipo_contrato=data.get('tipo_contrato'),
            salario=data.get('salario'),
            requisitos=data.get('requisitos'),
            duracion=data.get('duracion'),
            modalidad=data.get('modalidad'),
            fecha_inicio=datetime.strptime(data.get('fecha_inicio'), "%Y-%m-%d") if data.get('fecha_inicio') else None,
            plazas=data.get('plazas')
        )

        db.session.add(nueva_pub)
        db.session.commit()

        return jsonify({"mensaje": "Publicación creada", "id": nueva_pub.id}), 201

    except Exception as e:
        print("ERROR creando publicación:", e)
        return jsonify({"mensaje": "Error al crear publicación"}), 400
