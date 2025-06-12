from flask import Flask, request, redirect, has_request_context
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from .config import Config

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db) 

    # ✅ Habilitar CORS para todas las rutas y orígenes
    CORS(app,
         origins=["https://nivex.vercel.app", "http://localhost:3000"],
         supports_credentials=True,
         methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
         allow_headers=["Content-Type", "Authorization", "X-CSRF-TOKEN"])
    

    from .routes.auth import auth_bp
    from .routes.publicaciones import publicaciones_bp
    from .routes.inscripciones import inscripciones_bp
    from .routes.usuarios import usuarios_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(publicaciones_bp, url_prefix='/api/publicaciones')
    app.register_blueprint(inscripciones_bp, url_prefix='/api/inscripciones')
    app.register_blueprint(usuarios_bp, url_prefix='/api/usuarios')

    app.before_request(redirect_https)

    

    return app

from flask import has_request_context

def redirect_https():
    if has_request_context() and request.method != "OPTIONS" and not request.is_secure:
        return redirect(request.url.replace("http://", "https://", 1), code=301)

