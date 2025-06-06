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

@inscripciones_bp.route('/mis-publicaciones', methods=['GET'])
@jwt_required(locations=["cookies"])
def obtener_publicaciones_inscritas():
    usuario_id = get_jwt_identity()

    inscripciones = Inscripcion.query.filter_by(usuario_id=usuario_id).all()

    publicaciones = []
    for inscripcion in inscripciones:
        pub = inscripcion.publicacion
        publicaciones.append({
            "id": pub.id,
            "tipo": pub.tipo,
            "titulo": pub.titulo,
            "descripcion": pub.descripcion,
            "ubicacion": pub.ubicacion,
            "tipo_contrato": pub.tipo_contrato,
            "salario": pub.salario,
            "requisitos": pub.requisitos,
            "duracion": pub.duracion,
            "modalidad": pub.modalidad,
            "fecha_inicio": pub.fecha_inicio.isoformat() if pub.fecha_inicio else None,
            "plazas": pub.plazas,
            "fecha_creacion": pub.fecha_creacion.isoformat() if pub.fecha_creacion else None,
            "fecha_inscripcion": inscripcion.fecha_inscripcion.isoformat()
        })

    return jsonify(publicaciones), 200

