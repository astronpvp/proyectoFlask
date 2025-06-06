from . import db
from datetime import datetime

class Token(db.Model):
    __tablename__ = 'token'

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), unique=True, nullable=False)  # 🆕 Añadido
    token = db.Column(db.Text, nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)

    usuario = db.relationship('Usuario', backref='tokens')


class Usuario(db.Model):
    __tablename__ = 'usuario'  # importante para que el nombre coincida
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    rol = db.Column(db.String(20), nullable=False)  # 'usuario' o 'admin'


class Publicacion(db.Model):
    __tablename__ = 'publicacion'

    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(10), nullable=False)  # 'oferta' o 'curso'
    titulo = db.Column(db.String(120), nullable=False)
    descripcion = db.Column(db.Text, nullable=False)
    ubicacion = db.Column(db.String(100))
    tipo_contrato = db.Column(db.String(50))     # solo para ofertas
    salario = db.Column(db.Float)                # solo para ofertas
    requisitos = db.Column(db.Text)
    duracion = db.Column(db.String(50))          # solo para cursos
    modalidad = db.Column(db.String(20))         # 'presencial' o 'online'
    fecha_inicio = db.Column(db.Date)
    plazas = db.Column(db.Integer)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

class Inscripcion(db.Model):
    __tablename__ = 'inscripcion'

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    publicacion_id = db.Column(db.Integer, db.ForeignKey('publicacion.id'), nullable=False)
    fecha_inscripcion = db.Column(db.DateTime, default=datetime.utcnow)

    usuario = db.relationship('Usuario', backref='inscripciones')
    publicacion = db.relationship('Publicacion', backref='inscripciones')
