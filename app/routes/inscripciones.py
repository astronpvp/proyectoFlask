from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from ..models import Inscripcion, Publicacion, Usuario
from .. import db
from datetime import datetime

inscripciones_bp = Blueprint('inscripciones', __name__)

@inscripciones_bp.route('/inscribirse', methods=['POST'])
@jwt_required(locations=["cookies"])
def inscribirse_publicacion():
    usuario_id = get_jwt_identity()
    data = request.get_json()
    publicacion_id = data.get("id")

    if not publicacion_id:
        return jsonify({"mensaje": "Falta el ID de la publicación"}), 400

    publicacion = Publicacion.query.get(publicacion_id)
    if not publicacion:
        return jsonify({"mensaje": "Publicación no encontrada"}), 404

    ya_inscrito = Inscripcion.query.filter_by(usuario_id=usuario_id, publicacion_id=publicacion_id).first()
    if ya_inscrito:
        return jsonify({"mensaje": "Ya estás inscrito en esta publicación"}), 400

    nueva_inscripcion = Inscripcion(
        usuario_id=usuario_id,
        publicacion_id=publicacion_id,
        fecha_inscripcion=datetime.utcnow()
    )

    db.session.add(nueva_inscripcion)
    db.session.commit()

    return jsonify({"mensaje": "Inscripción exitosa"}), 201

