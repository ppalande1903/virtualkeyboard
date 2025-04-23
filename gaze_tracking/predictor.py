# File: gaze_tracking/predictor.py

import os
import json
import random
from collections import Counter
try:
    import nltk
    from nltk.corpus import words, brown
    NLTK_AVAILABLE = True
except ImportError:
    NLTK_AVAILABLE = False
import string

class WordPredictor:
    """
    Word prediction system that suggests completions for partially typed words.
    Also includes common word frequencies and n-gram based predictions.
    """
    
    def __init__(self, custom_dict_path=None):
        """Initialize the word predictor with dictionaries and language models."""
        self.common_words = []
        self.word_freq = {}
        self.bigrams = {}
        self.current_context = ""
        
        # Try to load NLTK resources
        if NLTK_AVAILABLE:
            try:
                # Download required NLTK data if not already downloaded
                nltk.download('words', quiet=True)
                nltk.download('brown', quiet=True)
                
                # Load word list from NLTK
                self.all_words = set(w.lower() for w in words.words())
                
                # Get word frequencies from Brown corpus
                word_list = [w.lower() for w in brown.words() if w.isalpha()]
                self.word_freq = Counter(word_list)
                self.common_words = [word for word, _ in self.word_freq.most_common(5000)]
                
                # Build simple bigram model
                for i in range(len(word_list) - 1):
                    if word_list[i] not in self.bigrams:
                        self.bigrams[word_list[i]] = Counter()
                    self.bigrams[word_list[i]][word_list[i+1]] += 1
                    
            except Exception as e:
                print(f"NLTK data loading error: {e}")
                self._load_fallback_dictionary()
        else:
            print("NLTK not available, using fallback dictionary")
            self._load_fallback_dictionary()
            
        # Load custom dictionary if provided
        if custom_dict_path and os.path.exists(custom_dict_path):
            try:
                with open(custom_dict_path, 'r') as f:
                    custom_dict = json.load(f)
                    if isinstance(custom_dict, list):
                        self.all_words.update(w.lower() for w in custom_dict)
                    elif isinstance(custom_dict, dict):
                        self.word_freq.update(custom_dict)
                        self.all_words.update(custom_dict.keys())
            except Exception as e:
                print(f"Error loading custom dictionary: {e}")
    
    def _load_fallback_dictionary(self):
        """Load a basic fallback dictionary if NLTK is not available"""
        self.all_words = set([
            "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", 
            "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
            "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
            "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
            "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
            "when", "time", "no", "just", "him", "know", "take", "people", "into", "year",
            "your", "good", "some", "could", "them", "see", "other", "than", "then", "now",
            "look", "only", "come", "its", "over", "think", "also", "back", "after", "use",
            "two", "how", "our", "work", "first", "well", "way", "even", "new", "want"
        ])
        self.common_words = list(self.all_words)
        self.word_freq = {word: 100 - i for i, word in enumerate(self.common_words[:100])}
        
    def suggest(self, partial_word, context=None):
        """
        Suggest completions for a partially typed word.
        Args:
            partial_word: The partial word to complete
            context: Optional previous word for context-based suggestions
        Returns the top 3 suggestions.
        """
        if context:
            self.current_context = context.lower().strip()
        
        if not partial_word:
            # If no partial word, suggest common next words based on context
            if self.current_context and self.current_context in self.bigrams:
                suggestions = [word for word, _ in self.bigrams[self.current_context].most_common(3)]
                if len(suggestions) < 3:
                    suggestions += [word for word, _ in self.word_freq.most_common(3-len(suggestions))]
                return suggestions[:3]
            else:
                # Fallback to most common words
                return [word for word, _ in sorted(self.word_freq.items(), key=lambda x: x[1], reverse=True)[:3]] if self.word_freq else ["the", "and", "you"]
        
        partial_word = partial_word.lower().strip()
        
        # Get completions that start with the partial word
        completions = []
        
        # First check the more common words
        for word in self.common_words:
            if word.startswith(partial_word) and word != partial_word:
                completions.append(word)
                if len(completions) >= 10:  # Gather more than we need for ranking
                    break
        
        # If we don't have enough, check the full dictionary
        if len(completions) < 10:
            for word in self.all_words:
                if word.startswith(partial_word) and word != partial_word and word not in completions:
                    completions.append(word)
                    if len(completions) >= 10:
                        break
        
        # Add the exact word if it exists in our dictionary
        if partial_word in self.all_words and partial_word not in completions:
            completions.append(partial_word)
        
        # If still no completions, return basic suggestions
        if not completions:
            if len(partial_word) >= 3:
                # Try to find fuzzy matches for longer partial words
                fuzzy_matches = []
                for word in self.common_words:
                    if len(word) >= len(partial_word) and sum(c1 == c2 for c1, c2 in 
                                                             zip(partial_word, word[:len(partial_word)])) >= len(partial_word) - 1:
                        fuzzy_matches.append(word)
                        if len(fuzzy_matches) >= 3:
                            break
                if fuzzy_matches:
                    return fuzzy_matches[:3]
            
            # Fallback to common words with the same first letter
            first_letter_matches = [w for w in self.common_words if w and w[0] == partial_word[0]][:3]
            return first_letter_matches if first_letter_matches else ["the", "and", "you"][:3]
        
        # Rank completions by frequency and relevance
        ranked_completions = []
        for word in completions:
            # Calculate a score based on frequency and how close the length is to the partial word
            freq_score = self.word_freq.get(word, 1)
            length_score = 1.0 / (abs(len(word) - len(partial_word)) + 1)
            
            # Context relevance (if we have context and bigrams)
            context_score = 1
            if self.current_context and self.current_context in self.bigrams and word in self.bigrams[self.current_context]:
                context_score = self.bigrams[self.current_context][word] * 2
                
            final_score = freq_score * length_score * context_score
            ranked_completions.append((word, final_score))
        
        # Sort by score and return top 3
        ranked_completions.sort(key=lambda x: x[1], reverse=True)
        result = [word for word, _ in ranked_completions[:3]]
        
        # If we have fewer than 3 suggestions, add the partial word itself or common words
        while len(result) < 3:
            if partial_word not in result:
                result.append(partial_word)
            else:
                # Add a common word not already in results
                for word in self.common_words:
                    if word not in result:
                        result.append(word)
                        break
        
        # Update context for next prediction
        self.current_context = partial_word
                
        return result[:3]
    
    def add_to_dictionary(self, word):
        """Add a new word to the dictionary."""
        word = word.lower().strip()
        if word and all(c in string.ascii_lowercase for c in word):
            self.all_words.add(word)
            self.word_freq[word] = self.word_freq.get(word, 0) + 1
            return True
        return False