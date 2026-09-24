"""
AI Detection pipeline using HuggingFace Transformers.
Uses the roberta-base-openai-detector model for classifying text
as AI-generated or human-written.
"""
import os
import logging
from typing import Dict, Any, Optional
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification

from utils import (
    clean_text,
    calculate_vocabulary_richness,
    calculate_burstiness,
    calculate_sentence_diversity,
    calculate_average_sentence_length,
    estimate_perplexity,
    generate_explanation,
)

logger = logging.getLogger(__name__)

# Default model — purpose-built for detecting GPT-generated text
DEFAULT_MODEL = "roberta-base-openai-detector"


class AIDetector:
    """
    AI text detection pipeline.

    Loads a HuggingFace classifier model and combines its prediction
    with statistical text analysis to produce a comprehensive detection report.
    """

    def __init__(self, model_name: Optional[str] = None):
        self.model_name = model_name or os.getenv("MODEL_NAME", DEFAULT_MODEL)
        self.tokenizer = None
        self.model = None
        self._loaded = False

    def load_model(self):
        """Load the detection model with low memory footprint (<200MB RAM)."""
        if self._loaded:
            return

        logger.info(f"Loading AI detection model: {self.model_name}")
        try:
            import gc
            import torch

            # Limit PyTorch to single CPU thread to prevent thread allocation overhead
            torch.set_num_threads(1)

            logger.info("Loading tokenizer...")
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)

            quantized_path = os.path.join(os.path.dirname(__file__), "quantized_model.pt")
            if os.path.exists(quantized_path):
                logger.info(f"Loading pre-quantized INT8 model from {quantized_path}...")
                self.model = torch.load(quantized_path, map_location="cpu", weights_only=False)
            else:
                logger.info("Pre-quantized model not found; loading and dynamic-quantizing to INT8...")
                raw_model = AutoModelForSequenceClassification.from_pretrained(
                    self.model_name,
                    low_cpu_mem_usage=True,
                )
                self.model = torch.quantization.quantize_dynamic(
                    raw_model, {torch.nn.Linear}, dtype=torch.qint8
                )
                del raw_model
                gc.collect()

            self.model.eval()
            self._loaded = True
            logger.info("Model loaded successfully with INT8 dynamic quantization.")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise RuntimeError(f"Could not load model '{self.model_name}': {e}")

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    def analyze(self, raw_text: str) -> Dict[str, Any]:
        """
        Run the full detection pipeline on input text.

        Steps:
        1. Clean and normalize text
        2. Run model prediction
        3. Calculate supplemental metrics
        4. Generate explanations
        5. Return structured result

        Args:
            raw_text: The raw input text to analyze.

        Returns:
            Dictionary matching the AnalyzeResponse schema.
        """
        if not self._loaded:
            raise RuntimeError("Model not loaded. Call load_model() first.")

        # Step 1: Clean text
        text = clean_text(raw_text)

        # Step 2: Model prediction
        import torch
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
        )
        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = torch.softmax(outputs.logits, dim=-1)[0]

        # The roberta-base-openai-detector model outputs:
        #   LABEL_0 (index 0) = Real (human-written)
        #   LABEL_1 (index 1) = Fake (AI-generated)
        human_probability = round(probs[0].item() * 100, 1)
        ai_probability = round(probs[1].item() * 100, 1)

        # Determine prediction
        if ai_probability >= 50:
            prediction = "AI Generated"
            confidence = ai_probability
        else:
            prediction = "Human Written"
            confidence = human_probability

        # Step 3: Calculate supplemental metrics
        burstiness = calculate_burstiness(text)
        sentence_diversity = calculate_sentence_diversity(text)
        vocabulary_richness = calculate_vocabulary_richness(text)
        average_sentence_length = calculate_average_sentence_length(text)
        perplexity = estimate_perplexity(text, ai_probability)

        # Step 4: Generate explanations
        explanation = generate_explanation(
            prediction=prediction,
            confidence=confidence,
            ai_probability=ai_probability,
            perplexity=perplexity,
            burstiness=burstiness,
            sentence_diversity=sentence_diversity,
            vocabulary_richness=vocabulary_richness,
            average_sentence_length=average_sentence_length,
        )

        # Step 5: Return structured result
        return {
            "prediction": prediction,
            "confidence": confidence,
            "ai_probability": ai_probability,
            "human_probability": human_probability,
            "perplexity": perplexity,
            "burstiness": burstiness,
            "sentence_diversity": sentence_diversity,
            "vocabulary_richness": vocabulary_richness,
            "average_sentence_length": average_sentence_length,
            "explanation": explanation,
        }


# Singleton instance
detector = AIDetector()
