#!/usr/bin/env bash
set -o errexit

# Install CPU-only PyTorch first (much smaller than full torch ~200MB vs ~2GB)
pip install torch --index-url https://download.pytorch.org/whl/cpu

# Install remaining dependencies
pip install -r requirements.txt

# Pre-download the model during build so it's cached
python -c "from transformers import pipeline; pipeline('text-classification', model='roberta-base-openai-detector', tokenizer='roberta-base-openai-detector'); print('Model downloaded successfully')"
