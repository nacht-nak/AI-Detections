"""
Pydantic models for request/response validation.
"""
from pydantic import BaseModel, Field
from typing import List, Optional


class AnalyzeRequest(BaseModel):
    """Request model for text analysis endpoint."""
    text: str = Field(
        ...,
        min_length=20,
        max_length=5000,
        description="Text to analyze for AI detection"
    )


class AnalyzeResponse(BaseModel):
    """Response model containing full AI detection analysis."""
    prediction: str = Field(
        ...,
        description="Either 'AI Generated' or 'Human Written'"
    )
    confidence: float = Field(
        ...,
        ge=0,
        le=100,
        description="Overall confidence percentage"
    )
    ai_probability: float = Field(
        ...,
        ge=0,
        le=100,
        description="Probability the text is AI-generated"
    )
    human_probability: float = Field(
        ...,
        ge=0,
        le=100,
        description="Probability the text is human-written"
    )
    perplexity: float = Field(
        ...,
        description="Text perplexity score (lower = more predictable)"
    )
    burstiness: float = Field(
        ...,
        ge=0,
        le=1,
        description="Sentence length variation (0-1, lower = more uniform)"
    )
    sentence_diversity: float = Field(
        ...,
        ge=0,
        le=1,
        description="Diversity of sentence structures (0-1)"
    )
    vocabulary_richness: float = Field(
        ...,
        ge=0,
        le=1,
        description="Type-token ratio (0-1, higher = richer vocabulary)"
    )
    average_sentence_length: float = Field(
        ...,
        description="Average number of words per sentence"
    )
    explanation: List[str] = Field(
        ...,
        description="List of explanatory observations about the text"
    )


class HealthResponse(BaseModel):
    """Response model for health check endpoint."""
    status: str = "ok"
    model_loaded: bool = False
