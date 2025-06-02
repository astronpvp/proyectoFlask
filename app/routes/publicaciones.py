from flask import Blueprint

publicaciones_bp = Blueprint('publicaciones', __name__)

@publicaciones_bp.route('/')
def index():
    return "Rutas de publicaciones"
