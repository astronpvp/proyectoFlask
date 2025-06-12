from app import create_app
import os

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # 👈 usa el puerto que Render proporciona
    app.run(host="0.0.0.0", port=port)        # 👈 escucha en todas las interfaces
