from flask import Flask, request, redirect, has_request_context
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
    app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_ACCESS_COOKIE_PATH"] = "/"
    app.config["JWT_COOKIE_NAME"] = "access_token_cookie"
    app.config["JWT_COOKIE_SECURE"] = True  # HTTPS obligatorio
    app.config["JWT_COOKIE_SAMESITE"] = "None"  # para dominios cruzados
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False  # evitar 

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db) 

    # ✅ Habilitar CORS para todas las rutas y orígenes
    CORS(app,
         origins=["https://proyecto-flask-puce.vercel.app"],
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

    

    

    return app




