FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install PyTorch CPU-only (much smaller than full torch)
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# Copy requirements and install remaining dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the model during build (so it's cached in the image)
RUN python -c "from transformers import pipeline; pipeline('text-classification', model='roberta-base-openai-detector', tokenizer='roberta-base-openai-detector')"

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Start the server
CMD uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}
