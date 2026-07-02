# AI Detection API — Backend

FastAPI-powered backend for AI text detection using HuggingFace Transformers.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Copy env file
cp .env.example .env

# Run the server
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### `POST /api/analyze`

Analyze text for AI detection.

**Request:**
```json
{
  "text": "Your text to analyze (20-5000 characters)"
}
```

**Response:**
```json
{
  "prediction": "AI Generated",
  "confidence": 93.6,
  "ai_probability": 93.6,
  "human_probability": 6.4,
  "perplexity": 19.8,
  "burstiness": 0.39,
  "sentence_diversity": 0.52,
  "vocabulary_richness": 0.71,
  "average_sentence_length": 18,
  "explanation": [
    "High confidence AI generated detection (93.6%).",
    "Repeated sentence patterns detected.",
    "Low linguistic variability across sentences."
  ]
}
```

### `GET /api/health`

Health check.

```json
{
  "status": "ok",
  "model_loaded": true
}
```

## Deployment (Render)

1. Push this `backend/` folder to a GitHub repo
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your repo and set the root directory to `backend`
4. Render will auto-detect `render.yaml` configuration
5. The model (~500MB) downloads on first startup — allow 1-2 minutes

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `ALLOWED_ORIGINS` | `*` | CORS allowed origins |
| `PORT` | `8000` | Server port |
| `MODEL_NAME` | `roberta-base-openai-detector` | HuggingFace model |

## Model

Uses [`roberta-base-openai-detector`](https://huggingface.co/roberta-base-openai-detector) — a RoBERTa model fine-tuned by OpenAI for detecting GPT-2 generated text. Works well as a general AI text detector.
