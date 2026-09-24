#!/usr/bin/env bash
set -o errexit

echo "==> Upgrading pip and installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "==> Pre-downloading and quantizing model to INT8..."
python -c "
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_name = 'roberta-base-openai-detector'
print(f'Downloading tokenizer and model weights for {model_name}...')
tokenizer = AutoTokenizer.from_pretrained(model_name)
raw_model = AutoModelForSequenceClassification.from_pretrained(model_name, low_cpu_mem_usage=True)

print('Dynamically quantizing model to INT8 (reducing RAM usage by ~70%)...')
quantized_model = torch.quantization.quantize_dynamic(
    raw_model, {torch.nn.Linear}, dtype=torch.qint8
)

print('Saving quantized model to quantized_model.pt...')
torch.save(quantized_model, 'quantized_model.pt')
print('Quantized model saved successfully! Memory footprint is now < 200MB.')
"
