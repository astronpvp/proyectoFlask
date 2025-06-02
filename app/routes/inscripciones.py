from flask import Blueprint

inscripciones_bp = Blueprint('inscripciones', __name__)

@inscripciones_bp.route('/')
def index():
    return "Rutas de inscripciones"
