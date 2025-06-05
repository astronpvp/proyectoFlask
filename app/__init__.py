from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from .config import Config

db = SQLAlchemy()
jwt = JWTManager()

from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)

    # ✅ Habilitar CORS para todas las rutas y orígenes
    CORS(app, supports_credentials=True)

    from .routes.auth import auth_bp
    from .routes.publicaciones import publicaciones_bp
    from .routes.inscripciones import inscripciones_bp
    from .routes.usuarios import usuarios_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(publicaciones_bp, url_prefix='/api/publicaciones')
    app.register_blueprint(inscripciones_bp, url_prefix='/api/inscripciones')
    app.register_blueprint(usuarios_bp, url_prefix='/api/usuarios')

    return app

