import cv2
import mediapipe as mp
import numpy as np
import time
import pyttsx3
import threading
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import base64
import re

app = Flask(__name__)
CORS(app)




# Initialize TTS engine
engine = pyttsx3.init()

# MediaPipe face mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True, max_num_faces=1)

# App state
text = ""
letter_index = 0
last_action = time.time()
cooldown = 0.4
suggest_active = False
force_suggest_mode = False
tracking_active = False
gaze_sensitivity = 0.7  # Default sensitivity

# Keyboard layout
keys_set = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
    "A", "S", "D", "F", "G", "H", "J", "K", "L", "_",
    "Z", "X", "C", "V", "B", "N", "M", "←", "💬", "🔊"
]

# Mock word predictor class (replace with actual implementation later)
class WordPredictor:
    def suggest(self, current_word, context=""):
        # Simple mock suggestions based on the current word
        if not current_word:
            return ["the", "and", "you"]
        
        common_words = {
            't': ["the", "to", "that"],
            'a': ["and", "at", "all"],
            'i': ["in", "it", "is"],
            'y': ["you", "your", "yes"],
            'h': ["have", "has", "how"],
            'w': ["with", "what", "when"],
            'th': ["the", "this", "that"],
            'an': ["and", "any", "another"],
            'be': ["be", "been", "because"],
            'wh': ["what", "when", "where"]
        }
        
        # Check if we have suggestions for this prefix
        for prefix, words in common_words.items():
            if current_word.lower().startswith(prefix):
                return [word for word in words if word.startswith(current_word.lower())] or [current_word + suffix for suffix in ["ing", "ed", "s"]]
        
        # Default suggestions
        return [current_word + suffix for suffix in ["ing", "ed", "s"]]

predictor = WordPredictor()

def calculate_ear(landmarks, indices):
    p = [np.array([landmarks[i][0], landmarks[i][1]]) for i in indices]
    A = np.linalg.norm(p[1] - p[5])
    B = np.linalg.norm(p[2] - p[4])
    C = np.linalg.norm(p[0] - p[3])
    return (A + B) / (2.0 * C)

def get_gaze(landmarks):
    left = [landmarks[i] for i in [33, 133]]
    right = [landmarks[i] for i in [362, 263]]
    left_iris = landmarks[468]
    right_iris = landmarks[473]
    
    # Apply sensitivity
    global gaze_sensitivity
    pos = lambda eye, iris: (iris[0] - eye[0][0]) / (eye[1][0] - eye[0][0] + 1e-6)
    avg = (pos(left, left_iris) + pos(right, right_iris)) / 2
    
    # Adjust thresholds based on sensitivity
    left_threshold = 0.5 - (0.1 * gaze_sensitivity)
    right_threshold = 0.5 + (0.1 * gaze_sensitivity)
    
    if avg < left_threshold:
        return "LEFT"
    elif avg > right_threshold:
        return "RIGHT"
    return "CENTER"

def speak_text(text_to_speak):
    """Speak text in a separate thread to avoid blocking the server"""
    if not text_to_speak:
        return
    
    engine.stop()  # Stop any current speech
    engine.say(text_to_speak)
    engine.runAndWait()

def speak_async(text_to_speak):
    """Start a new thread for speaking"""
    speech_thread = threading.Thread(target=speak_text, args=(text_to_speak,))
    speech_thread.daemon = True  # Thread will close when main program exits
    speech_thread.start()

@app.route('/api/keyboard-layout', methods=['GET'])
def get_keyboard_layout():
    return jsonify({'keys': keys_set})

@app.route('/api/toggle-tracking', methods=['POST'])
def toggle_tracking():
    global tracking_active
    tracking_active = not tracking_active
    return jsonify({'tracking': tracking_active})

@app.route('/api/clear-text', methods=['POST'])
def clear_text():
    global text, letter_index, suggest_active, force_suggest_mode
    text = ""
    letter_index = 0
    suggest_active = False
    force_suggest_mode = False
    return jsonify({
        'text': text,
        'letter_index': letter_index,
        'suggest_active': suggest_active,
        'force_suggest_mode': force_suggest_mode,
        'suggestions': ["", "", ""]
    })

@app.route('/api/update-sensitivity', methods=['POST'])
def update_sensitivity():
    global gaze_sensitivity
    data = request.json
    if 'sensitivity' in data:
        gaze_sensitivity = float(data['sensitivity'])
    return jsonify({'sensitivity': gaze_sensitivity})

@app.route('/api/type', methods=['POST'])
def type_action():
    global text, letter_index, suggest_active, force_suggest_mode, last_action, cooldown
    
    data = request.json
    action = data.get('action', '')
    
    if action == "BLINK" and time.time() - last_action > cooldown:
        if suggest_active or force_suggest_mode:
            # Handle suggestion selection
            suggestions = get_suggestions()
            if letter_index < len(suggestions) and suggestions[letter_index]:
                if force_suggest_mode and text:
                    # Split text into words
                    words = text.split(' ')
                    # If there's at least one word and it's not just a space
                    if words and words[-1]:
                        # Replace the last word with the suggestion
                        words[-1] = suggestions[letter_index]
                        text = ' '.join(words)
                    else:
                        # Just add the suggestion if there's no current word
                        text += suggestions[letter_index]
                    
                    # Disable force suggest mode after selection
                    force_suggest_mode = False
                else:
                    # Regular space-triggered suggestion mode
                    text += " " + suggestions[letter_index % 3]
        else:
            key = keys_set[letter_index]
            if key == "←":
                text = text[:-1]
            elif key == "_":
                text += " "
            elif key == "🔊":
                speak_async(text.strip())
            elif key == "💬":  # Direct suggest button
                if text:  # Only activate if there's text
                    force_suggest_mode = True
            else:
                text += key
        
        last_action = time.time()
    
    elif action == "LEFT" and time.time() - last_action > 0.3:
        letter_index = max(letter_index - 1, 0)
        last_action = time.time()
        
    elif action == "RIGHT" and time.time() - last_action > 0.3:
        max_index = 2 if (suggest_active or force_suggest_mode) else len(keys_set) - 1
        letter_index = min(letter_index + 1, max_index)
        last_action = time.time()
    
    elif action == "RESET_CURSOR":
        letter_index = 0
    
    # Check if we should activate suggestion mode (after space)
    suggest_active = text and text[-1] == " "
    
    # Get updated suggestions
    suggestions = get_suggestions()
    
    return jsonify({
        'text': text,
        'letter_index': letter_index,
        'suggest_active': suggest_active,
        'force_suggest_mode': force_suggest_mode,
        'suggestions': suggestions
    })

def get_suggestions():
    # Get word suggestions - either for space-triggered or forced suggestion mode
    if suggest_active or force_suggest_mode:
        # Get the relevant words for suggestions
        words = text.strip().split(" ")
        
        if force_suggest_mode and words:
            # In direct suggestion mode, get the current partial word being typed
            current_partial = words[-1] if words else ""
            context = words[-2] if len(words) >= 2 else ""
            
            # Get suggestions for the current partial word
            suggestions = predictor.suggest(current_partial, context)
        else:
            # Regular space-triggered suggestion mode
            context = words[-2] if len(words) >= 2 else ""
            current_word = words[-1] if words else ""
            suggestions = predictor.suggest(current_word, context)
        
        # Ensure we have 3 suggestions
        suggestions += [""] * (3 - len(suggestions))
        return suggestions
    else:
        return ["", "", ""]

@app.route('/api/process-frame', methods=['POST'])
def process_frame():
    global text, letter_index, suggest_active, force_suggest_mode, last_action
    
    if not tracking_active:
        return jsonify({'status': 'Tracking not active'})
    
    try:
        data = request.json
        image_data = data['image']
        # Extract the base64 encoded image
        image_data = re.sub('^data:image/.+;base64,', '', image_data)
        image_bytes = base64.b64decode(image_data)
        
        # Convert to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({'error': 'Failed to decode image'})
        
        # Process the frame
        frame = cv2.flip(frame, 1)  # Mirror for webcam
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb)
        
        eye_position = None
        eye_direction = "CENTER"
        is_blinking = False
        ear_value = 0
        command = None
        
        if results.multi_face_landmarks:
            landmarks = results.multi_face_landmarks[0]
            frame_h, frame_w = frame.shape[:2]
            coords = [(int(p.x * frame_w), int(p.y * frame_h)) for p in landmarks.landmark]
            
            # Calculate EAR
            left_ear = calculate_ear(coords, [362, 385, 387, 263, 373, 380])
            right_ear = calculate_ear(coords, [33, 160, 158, 133, 153, 144])
            ear = (left_ear + right_ear) / 2
            ear_value = ear
            
            # Detect blink
            if ear < 0.23:
                is_blinking = True
                command = "BLINK"
            else:
                # Detect gaze direction
                gaze = get_gaze(coords)
                eye_direction = gaze
                if gaze != "CENTER":
                    command = gaze
            
            # Get eye position for UI visualization
            left_iris = landmarks.landmark[468]
            right_iris = landmarks.landmark[473]
            avg_x = (left_iris.x + right_iris.x) / 2
            avg_y = (left_iris.y + right_iris.y) / 2
            eye_position = [avg_x * 100, avg_y * 100]  # Convert to percentage
        
        # Process command here if needed
        response_data = {
            'eye_position': eye_position,
            'eye_direction': eye_direction,
            'is_blinking': is_blinking,
            'ear_value': ear_value,
            'command': command,
            'typed_text': text,
            'letter_index': letter_index,
            'suggest_active': suggest_active,
            'force_suggest_mode': force_suggest_mode,
            'suggestions': get_suggestions()
        }
        
        return jsonify(response_data)
    
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)