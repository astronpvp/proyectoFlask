from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from .config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)

    from .routes.auth import auth_bp
    from .routes.publicaciones import publicaciones_bp
    from .routes.inscripciones import inscripciones_bp
    from .routes.usuarios import usuarios_bp
    




    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(publicaciones_bp, url_prefix='/api/publicaciones')
    app.register_blueprint(inscripciones_bp, url_prefix='/api/inscripciones')
    app.register_blueprint(usuarios_bp, url_prefix='/api/usuarios')


    return app
