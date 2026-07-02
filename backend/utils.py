"""
Text processing utilities for AI detection analysis.
"""
import re
import math
from typing import List, Tuple
from collections import Counter


def clean_text(text: str) -> str:
    """
    Clean and normalize input text.
    - Strip leading/trailing whitespace
    - Normalize unicode characters
    - Collapse multiple spaces/newlines
    - Remove control characters
    """
    # Remove control characters (keep newlines and tabs)
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
    # Normalize whitespace: collapse multiple spaces
    text = re.sub(r'[ \t]+', ' ', text)
    # Collapse multiple newlines into double newline
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Strip
    text = text.strip()
    return text


def split_sentences(text: str) -> List[str]:
    """
    Split text into sentences using regex-based sentence boundary detection.
    Handles common abbreviations and edge cases.
    """
    # Split on sentence-ending punctuation followed by space and capital letter
    # or end of string
    sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])', text)
    # Filter out empty strings and very short fragments
    sentences = [s.strip() for s in sentences if len(s.strip()) > 2]
    return sentences


def tokenize_words(text: str) -> List[str]:
    """Extract words from text, lowercased."""
    words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
    return words


def calculate_vocabulary_richness(text: str) -> float:
    """
    Calculate type-token ratio (TTR) as a measure of vocabulary richness.
    TTR = unique words / total words
    Returns value between 0 and 1.
    """
    words = tokenize_words(text)
    if len(words) == 0:
        return 0.0

    unique_words = set(words)
    ttr = len(unique_words) / len(words)

    # Apply correction for text length (longer texts naturally have lower TTR)
    # Using root TTR (RTTR) normalization
    if len(words) > 1:
        rttr = len(unique_words) / math.sqrt(len(words))
        # Normalize to 0-1 range (typical RTTR ranges from 1 to ~15)
        normalized = min(rttr / 12.0, 1.0)
        return round(normalized, 2)

    return round(ttr, 2)


def calculate_burstiness(text: str) -> float:
    """
    Calculate burstiness based on sentence length variance.
    AI text tends to have more uniform sentence lengths (low burstiness).
    Human text tends to have more varied sentence lengths (high burstiness).

    Returns value between 0 and 1.
    """
    sentences = split_sentences(text)
    if len(sentences) < 2:
        return 0.5

    lengths = [len(tokenize_words(s)) for s in sentences]
    mean_length = sum(lengths) / len(lengths)

    if mean_length == 0:
        return 0.5

    # Calculate coefficient of variation
    variance = sum((l - mean_length) ** 2 for l in lengths) / len(lengths)
    std_dev = math.sqrt(variance)
    cv = std_dev / mean_length

    # Normalize to 0-1 range (typical CV ranges from 0 to ~2)
    normalized = min(cv / 2.0, 1.0)
    return round(normalized, 2)


def calculate_sentence_diversity(text: str) -> float:
    """
    Measure diversity of sentence structures by analyzing:
    - Sentence start patterns
    - Length distribution
    - Punctuation variety

    Returns value between 0 and 1.
    """
    sentences = split_sentences(text)
    if len(sentences) < 2:
        return 0.5

    # Analyze sentence starters (first word of each sentence)
    starters = []
    for s in sentences:
        words = s.split()
        if words:
            starters.append(words[0].lower())

    # Unique starters ratio
    if starters:
        starter_diversity = len(set(starters)) / len(starters)
    else:
        starter_diversity = 0.5

    # Sentence length diversity (using normalized standard deviation)
    lengths = [len(tokenize_words(s)) for s in sentences]
    mean_len = sum(lengths) / len(lengths) if lengths else 0
    if mean_len > 0 and len(lengths) > 1:
        variance = sum((l - mean_len) ** 2 for l in lengths) / len(lengths)
        length_diversity = min(math.sqrt(variance) / mean_len, 1.0)
    else:
        length_diversity = 0.5

    # Punctuation variety
    punct_types = set()
    for s in sentences:
        if s.endswith('.'):
            punct_types.add('.')
        elif s.endswith('!'):
            punct_types.add('!')
        elif s.endswith('?'):
            punct_types.add('?')
        # Check for semicolons, colons, dashes within
        if ';' in s:
            punct_types.add(';')
        if ':' in s:
            punct_types.add(':')
        if '—' in s or '--' in s:
            punct_types.add('—')

    punct_diversity = min(len(punct_types) / 4.0, 1.0)

    # Weighted combination
    diversity = (
        starter_diversity * 0.4 +
        length_diversity * 0.35 +
        punct_diversity * 0.25
    )

    return round(min(diversity, 1.0), 2)


def calculate_average_sentence_length(text: str) -> float:
    """Calculate the average number of words per sentence."""
    sentences = split_sentences(text)
    if not sentences:
        return 0.0

    total_words = sum(len(tokenize_words(s)) for s in sentences)
    return round(total_words / len(sentences), 1)


def estimate_perplexity(text: str, ai_probability: float) -> float:
    """
    Estimate a perplexity-like score based on text characteristics.
    Lower perplexity = more predictable text = more likely AI.

    This is a heuristic approximation. True perplexity requires
    a language model's token-level log probabilities.
    """
    words = tokenize_words(text)
    if len(words) < 5:
        return 50.0

    # Bigram predictability
    bigrams = [(words[i], words[i + 1]) for i in range(len(words) - 1)]
    bigram_counts = Counter(bigrams)
    word_counts = Counter(words)

    # Calculate bigram entropy approximation
    total_bigrams = len(bigrams)
    if total_bigrams == 0:
        return 50.0

    entropy = 0.0
    for bigram, count in bigram_counts.items():
        first_word_count = word_counts[bigram[0]]
        if first_word_count > 0:
            p = count / first_word_count
            if p > 0:
                entropy -= p * math.log2(p)

    # Normalize entropy to a perplexity-like score
    avg_entropy = entropy / len(bigram_counts) if bigram_counts else 0

    # Scale: AI text typically 10-30, human text 30-80+
    base_perplexity = 2 ** avg_entropy * 10

    # Adjust based on AI probability (from the model)
    # Higher AI probability → lower perplexity
    adjustment = (100 - ai_probability) / 100 * 40
    perplexity = base_perplexity + adjustment

    # Clamp to reasonable range
    perplexity = max(5.0, min(perplexity, 120.0))

    return round(perplexity, 1)


def generate_explanation(
    prediction: str,
    confidence: float,
    ai_probability: float,
    perplexity: float,
    burstiness: float,
    sentence_diversity: float,
    vocabulary_richness: float,
    average_sentence_length: float
) -> List[str]:
    """
    Generate human-readable explanations based on analysis metrics.
    """
    explanations = []

    # Confidence-based explanations
    if confidence > 90:
        explanations.append(f"High confidence {prediction.lower()} detection ({confidence:.1f}%).")
    elif confidence > 70:
        explanations.append(f"Moderate confidence in {prediction.lower()} classification ({confidence:.1f}%).")
    else:
        explanations.append(f"Low confidence result — text shows mixed characteristics ({confidence:.1f}%).")

    # AI-specific patterns
    if prediction == "AI Generated":
        if burstiness < 0.3:
            explanations.append("Highly uniform sentence structure detected — typical of AI-generated text.")
        elif burstiness < 0.5:
            explanations.append("Repeated sentence patterns detected.")

        if sentence_diversity < 0.4:
            explanations.append("Low linguistic variability across sentences.")
        elif sentence_diversity < 0.6:
            explanations.append("Moderate sentence diversity — somewhat formulaic structure.")

        if vocabulary_richness < 0.5:
            explanations.append("Limited vocabulary range — consistent with AI generation patterns.")

        if perplexity < 25:
            explanations.append("Very low perplexity indicates highly predictable text patterns.")
        elif perplexity < 40:
            explanations.append("Low perplexity suggests systematic word choices.")

        if 15 <= average_sentence_length <= 22:
            explanations.append("Sentence lengths cluster around AI-typical averages (15-22 words).")

    # Human-specific patterns
    else:
        if burstiness > 0.5:
            explanations.append("High variation in sentence lengths — characteristic of natural writing.")
        elif burstiness > 0.3:
            explanations.append("Moderate sentence length variation detected.")

        if sentence_diversity > 0.6:
            explanations.append("Rich diversity in sentence structures and openings.")

        if vocabulary_richness > 0.6:
            explanations.append("Rich and varied vocabulary usage detected.")

        if perplexity > 45:
            explanations.append("High perplexity indicates creative and unpredictable word choices.")
        elif perplexity > 30:
            explanations.append("Moderate perplexity consistent with natural human writing.")

        if average_sentence_length > 25 or average_sentence_length < 10:
            explanations.append("Sentence length patterns are inconsistent with AI generation norms.")

    # Ensure at least 3 explanations
    if len(explanations) < 3:
        if ai_probability > 50:
            explanations.append("Overall linguistic patterns lean toward AI generation.")
        else:
            explanations.append("Overall linguistic patterns lean toward human authorship.")

    return explanations[:6]  # Cap at 6 explanations
