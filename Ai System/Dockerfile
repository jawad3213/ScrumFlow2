# Utilisation de la version 3.12 pour de meilleures performances
FROM python:3.12-slim

WORKDIR /app

# 1. Optimisation des ressources (Évite de consommer du stockage inutile)
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 2. Installation des dépendances système légères pour PyMuPDF (fitz)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 3. Installation des dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copie du code source
COPY . .

# 5. Exposition du port (On garde le 5000 pour rester cohérent avec notre Nginx)
EXPOSE 8001

# 6. Utilisation d'Uvicorn (Asynchrone et très rapide pour l'IA)
# On adapte le port à 5000 pour correspondre à ton Nginx default.conf
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]