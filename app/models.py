from . import db
from datetime import datetime

class Token(db.Model):
    __tablename__ = 'token'

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    token = db.Column(db.Text, nullable=False)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)

    # Relación opcional: acceder desde usuario.tokens
    usuario = db.relationship('Usuario', backref='tokens')

class Usuario(db.Model):
    __tablename__ = 'usuario'  # importante para que el nombre coincida
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    rol = db.Column(db.String(20), nullable=False)  # 'usuario' o 'admin'
