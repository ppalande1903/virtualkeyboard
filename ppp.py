import cv2
import mediapipe as mp
import numpy as np
import time
import pygame
import pyttsx3
import threading
from gaze_tracking.predictor import WordPredictor  # Use correct folder name here

# Initialize TTS and sound
engine = pyttsx3.init()
pygame.init()
try:
    click_sound = pygame.mixer.Sound("click.wav")
except:
    click_sound = None

# MediaPipe face mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True, max_num_faces=1)

# Modern UI Colors - Soft purple theme
BG_COLOR = (250, 245, 255)  # Light lavender background
KEY_INACTIVE = (230, 215, 245)  # Soft lavender for inactive keys
KEY_ACTIVE = (180, 155, 220)  # Deeper purple for active keys
KEY_BORDER = (200, 175, 235)  # Border color
TEXT_COLOR = (90, 70, 120)  # Dark purple text
HEADER_COLOR = (150, 100, 180)  # Accent color for headers
TEXT_AREA_BG = (245, 240, 255)  # Slightly different background for text area

# Keyboard setup with suggestion key added
keys_set = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
    "A", "S", "D", "F", "G", "H", "J", "K", "L", "_",
    "Z", "X", "C", "V", "B", "N", "M", "←", "💬", "🔊"
]

# Fallback to these dimensions if we can't detect the screen size
# Most monitors will be at least this size
DEFAULT_SCREEN_WIDTH = 1280
DEFAULT_SCREEN_HEIGHT = 720

# Initialize video capture first to help with resolution detection
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: Could not open camera.")
    exit()

# Get camera resolution to help determine screen size
ret, frame = cap.read()
if ret:
    cam_height, cam_width = frame.shape[:2]
    print(f"Camera resolution: {cam_width}x{cam_height}")
    # Use camera resolution as minimum screen size
    DEFAULT_SCREEN_WIDTH = max(DEFAULT_SCREEN_WIDTH, cam_width)
    DEFAULT_SCREEN_HEIGHT = max(DEFAULT_SCREEN_HEIGHT, cam_height)

# Create main window
cv2.namedWindow("Gaze Keyboard", cv2.WINDOW_NORMAL)
cv2.setWindowProperty("Gaze Keyboard", cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)

# Try to get screen dimensions from pygame as a more reliable source
pygame.display.init()
info = pygame.display.Info()
SCREEN_WIDTH = info.current_w
SCREEN_HEIGHT = info.current_h

# Fallback if pygame doesn't work
if SCREEN_WIDTH <= 0 or SCREEN_HEIGHT <= 0:
    print("Using default dimensions")
    SCREEN_WIDTH = DEFAULT_SCREEN_WIDTH
    SCREEN_HEIGHT = DEFAULT_SCREEN_HEIGHT

print(f"Screen dimensions: {SCREEN_WIDTH}x{SCREEN_HEIGHT}")

# Adjust these values to maintain proportions
KEYBOARD_HEIGHT_RATIO = 0.40  # 40% of the total height
TEXT_AREA_HEIGHT_RATIO = 0.15  # 15% of the total height 
WEBCAM_HEIGHT_RATIO = 0.45  # 45% of the total height

# Calculate component heights
KEYBOARD_HEIGHT = int(SCREEN_HEIGHT * KEYBOARD_HEIGHT_RATIO)
TEXT_AREA_HEIGHT = int(SCREEN_HEIGHT * TEXT_AREA_HEIGHT_RATIO)
WEBCAM_HEIGHT = int(SCREEN_HEIGHT * WEBCAM_HEIGHT_RATIO)

# Initialize UI components with dynamic sizes
keyboard = np.zeros((KEYBOARD_HEIGHT, SCREEN_WIDTH, 3), np.uint8)

# TTS Functions for threading
def speak_text(text_to_speak):
    """Speak text in a separate thread to avoid blocking the UI"""
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

def draw_key(index, text, is_active):
    # Calculate key dimensions based on screen width and keyboard height
    key_width = SCREEN_WIDTH // 10
    key_height = KEYBOARD_HEIGHT // 4
    
    x = (index % 10) * key_width
    y = (index // 10) * key_height
    
    padding = int(key_width * 0.08)  # 8% padding
    
    # Draw key with rounded corners
    color = KEY_ACTIVE if is_active else KEY_INACTIVE
    
    # Main key rectangle
    cv2.rectangle(keyboard, 
                 (x+padding, y+padding), 
                 (x+key_width-padding, y+key_height-padding), 
                 color, -1)
    
    # Add subtle shadow effect
    if not is_active:
        cv2.rectangle(keyboard, 
                     (x+padding, y+padding), 
                     (x+key_width-padding, y+key_height-padding), 
                     KEY_BORDER, 2)
    else:
        # Highlight effect for active key
        cv2.rectangle(keyboard, 
                     (x+padding-2, y+padding-2), 
                     (x+key_width-padding+2, y+key_height-padding+2), 
                     (150, 120, 200), 2)
    
    # Text with better positioning
    font = cv2.FONT_HERSHEY_DUPLEX  # More modern font
    
    # Scale font based on key size
    font_scale = min(key_width, key_height) / 100.0
    scale = font_scale * (1.2 if len(text) == 1 else 0.9)
    
    text_size = cv2.getTextSize(text, font, scale, 1)[0]
    text_x = x + (key_width - text_size[0]) // 2
    text_y = y + (key_height + text_size[1]) // 2
    
    # Text with subtle shadow for depth
    if is_active:
        cv2.putText(keyboard, text, (text_x+1, text_y+1), font, scale, (120, 100, 160), 1)
    cv2.putText(keyboard, text, (text_x, text_y), font, scale, TEXT_COLOR, 1)

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
    pos = lambda eye, iris: (iris[0] - eye[0][0]) / (eye[1][0] - eye[0][0] + 1e-6)
    avg = (pos(left, left_iris) + pos(right, right_iris)) / 2
    if avg < 0.4: return "RIGHT"
    elif avg > 0.6: return "LEFT"
    return "CENTER"

def create_rounded_rectangle(img, top_left, bottom_right, color, thickness, radius=None):
    """Draw a rectangle with rounded corners"""
    x1, y1 = top_left
    x2, y2 = bottom_right
    
    # If radius is None, calculate based on rectangle size
    if radius is None:
        radius = min(int((x2-x1) * 0.05), int((y2-y1) * 0.05), 20)  # Max 20px radius
    
    # Draw main rectangle
    cv2.rectangle(img, (x1+radius, y1), (x2-radius, y2), color, thickness)
    cv2.rectangle(img, (x1, y1+radius), (x2, y2-radius), color, thickness)
    
    # Draw the corners
    if thickness == -1:  # Filled rectangle
        cv2.circle(img, (x1+radius, y1+radius), radius, color, thickness)
        cv2.circle(img, (x2-radius, y1+radius), radius, color, thickness)
        cv2.circle(img, (x1+radius, y2-radius), radius, color, thickness)
        cv2.circle(img, (x2-radius, y2-radius), radius, color, thickness)
    else:
        cv2.circle(img, (x1+radius, y1+radius), radius, color, thickness)
        cv2.circle(img, (x2-radius, y1+radius), radius, color, thickness)
        cv2.circle(img, (x1+radius, y2-radius), radius, color, thickness)
        cv2.circle(img, (x2-radius, y2-radius), radius, color, thickness)

# Predictor
predictor = WordPredictor()
suggestions = ["", "", ""]
last_spoken_suggestion = ""  # Track last spoken suggestion to avoid repetition

text = ""
letter_index = 0
blink_counter = 0
last_action = time.time()
cooldown = 0.4
suggest_active = False
force_suggest_mode = False  # New flag for direct word suggestion mode

# Status indicators
status_text = "Ready"
status_color = (100, 180, 100)  # Green by default

while True:
    ret, frame = cap.read()
    if not ret: break
    frame = cv2.flip(frame, 1)
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)

    frame_h, frame_w = frame.shape[:2]
    current_time = time.time()
    
    # Reset status each loop
    status_text = "Ready"
    status_color = (100, 180, 100)
    ear_value = 0

    if results.multi_face_landmarks:
        landmarks = results.multi_face_landmarks[0]
        coords = [(int(p.x * frame_w), int(p.y * frame_h)) for p in landmarks.landmark]

        left_ear = calculate_ear(coords, [362, 385, 387, 263, 373, 380])
        right_ear = calculate_ear(coords, [33, 160, 158, 133, 153, 144])
        ear = (left_ear + right_ear) / 2
        ear_value = ear

        # Update status based on eye state
        if ear < 0.23:
            status_text = "Blink Detected"
            status_color = (50, 150, 250)  # Blue for blink
            blink_counter += 1
        else:
            gaze = get_gaze(coords)
            if gaze == "LEFT":
                status_text = "Looking Left"
                status_color = (180, 120, 200)  # Purple for left
            elif gaze == "RIGHT":
                status_text = "Looking Right"
                status_color = (180, 120, 200)  # Purple for right
                
            # Process blinks
            if blink_counter >= 1 and current_time - last_action > cooldown:
                print("Blink Detected ✅")
                if suggest_active or force_suggest_mode:
                    # Handle suggestion selection
                    if letter_index < len(suggestions) and suggestions[letter_index]:
                        # If in force suggest mode, replace the current word being typed
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
                        else:
                            # Regular space-triggered suggestion mode
                            text += " " + suggestions[letter_index % 3]
                        
                        # Disable force suggest mode after selection
                        force_suggest_mode = False
                else:
                    key = keys_set[letter_index]
                    if key == "←":
                        text = text[:-1]
                    elif key == "_":
                        text += " "
                    elif key == "🔊":
                        speak_async(text.strip())
                    elif key == "💬":  # New direct suggest button
                        if text:  # Only activate if there's text
                            force_suggest_mode = True
                            print("Direct suggestion mode activated")
                    else:
                        text += key
                    if click_sound: click_sound.play()
                last_action = current_time
            blink_counter = 0

        # Process gaze direction for navigation
        if current_time - last_action > 0.3:
            if gaze == "LEFT":
                letter_index = max(letter_index - 1, 0)
                last_action = current_time
                
                # Speak the new suggestion when navigating in suggestion mode
                if (suggest_active or force_suggest_mode) and letter_index < len(suggestions) and suggestions[letter_index]:
                    current_suggestion = suggestions[letter_index]
                    if current_suggestion != last_spoken_suggestion:
                        speak_async(current_suggestion)
                        last_spoken_suggestion = current_suggestion
                
            elif gaze == "RIGHT":
                max_index = 2 if (suggest_active or force_suggest_mode) else len(keys_set) - 1
                letter_index = min(letter_index + 1, max_index)
                last_action = current_time
                
                # Speak the new suggestion when navigating in suggestion mode
                if (suggest_active or force_suggest_mode) and letter_index < len(suggestions) and suggestions[letter_index]:
                    current_suggestion = suggestions[letter_index]
                    if current_suggestion != last_spoken_suggestion:
                        speak_async(current_suggestion)
                        last_spoken_suggestion = current_suggestion

    # Draw keyboard with enhanced UI - recreate for proper scaling
    keyboard = np.zeros((KEYBOARD_HEIGHT, SCREEN_WIDTH, 3), np.uint8)
    keyboard[:] = BG_COLOR
    
    # Check for regular suggestion mode (after space)
    suggest_active = text and text[-1] == " "
    
    # Add subtle background pattern - scale with screen size
    pattern_spacing = max(int(SCREEN_WIDTH / 30), 1)  # Ensure pattern_spacing is at least 1
    for i in range(0, SCREEN_WIDTH, pattern_spacing):
        cv2.line(keyboard, (i, 0), (i, KEYBOARD_HEIGHT), (245, 240, 250), 1)
    for i in range(0, KEYBOARD_HEIGHT, pattern_spacing):
        cv2.line(keyboard, (0, i), (SCREEN_WIDTH, i), (245, 240, 250), 1)
    
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
        
        # Speak the currently focused suggestion if it's new
        if letter_index < len(suggestions) and suggestions[letter_index] and suggestions[letter_index] != last_spoken_suggestion:
            speak_async(suggestions[letter_index])
            last_spoken_suggestion = suggestions[letter_index]
        
        # Draw suggestion section with better styling
        cv2.rectangle(keyboard, (0, 0), (SCREEN_WIDTH, KEYBOARD_HEIGHT // 4), (240, 235, 250), -1)
        for i in range(3):
            # Calculate positions for wider suggestion keys
            suggestion_width = SCREEN_WIDTH // 3
            x = i * suggestion_width
            # Draw rounded rectangle for suggestions
            create_rounded_rectangle(keyboard, 
                                    (x + int(suggestion_width*0.05), int(KEYBOARD_HEIGHT*0.05)), 
                                    (x + int(suggestion_width*0.95), int(KEYBOARD_HEIGHT*0.20)), 
                                    KEY_ACTIVE if i == letter_index % 3 else KEY_INACTIVE, -1)
            create_rounded_rectangle(keyboard, 
                                    (x + int(suggestion_width*0.05), int(KEYBOARD_HEIGHT*0.05)), 
                                    (x + int(suggestion_width*0.95), int(KEYBOARD_HEIGHT*0.20)), 
                                    KEY_BORDER, 2)
            
            # Add text with shadow effect - scale font to screen size
            font = cv2.FONT_HERSHEY_DUPLEX
            font_scale = max(SCREEN_HEIGHT / 1080 * 0.9, 0.6)  # Scale based on screen height
            text_size = cv2.getTextSize(suggestions[i], font, font_scale, 1)[0]
            text_x = x + (suggestion_width - text_size[0]) // 2
            text_y = int(KEYBOARD_HEIGHT * 0.15)
            cv2.putText(keyboard, suggestions[i], (text_x, text_y), font, font_scale, TEXT_COLOR, 1)
        
        # Instruction header with nicer styling
        cv2.rectangle(keyboard, (0, KEYBOARD_HEIGHT // 4), (SCREEN_WIDTH, int(KEYBOARD_HEIGHT * 0.35)), (180, 155, 220), -1)
        font_scale = max(SCREEN_HEIGHT / 1080 * 0.8, 0.5)
        instruction_text = "Blink to select word suggestion" if suggest_active else "Blink to autocomplete current word"
        cv2.putText(keyboard, instruction_text, 
                   (SCREEN_WIDTH // 3, int(KEYBOARD_HEIGHT * 0.32)), 
                   cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 255), 1)
    else:
        # Reset last spoken suggestion when not in suggestion mode
        last_spoken_suggestion = ""
        
        for i in range(len(keys_set)):
            draw_key(i, keys_set[i], i == letter_index)
        
        # Instruction header with nicer styling - scale with screen
        header_height = int(KEYBOARD_HEIGHT * 0.1)
        cv2.rectangle(keyboard, (0, 0), (SCREEN_WIDTH, header_height), (180, 155, 220), -1)
        font_scale = max(SCREEN_HEIGHT / 1080 * 0.8, 0.5)  # Minimum scale of 0.5
        instruction = "Look left/right to move, blink to select"
        text_size = cv2.getTextSize(instruction, cv2.FONT_HERSHEY_SIMPLEX, font_scale, 1)[0]
        text_x = (SCREEN_WIDTH - text_size[0]) // 2  # Center text
        cv2.putText(keyboard, instruction, 
                   (text_x, int(header_height * 0.7)), 
                   cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 255), 1)

    # Create an improved text area with better styling - recreate for proper scaling
    text_area = np.zeros((TEXT_AREA_HEIGHT, SCREEN_WIDTH, 3), np.uint8)
    text_area[:] = TEXT_AREA_BG
    
    # Calculate padding based on screen size
    padding_x = int(SCREEN_WIDTH * 0.02)
    padding_y = int(TEXT_AREA_HEIGHT * 0.15)
    
    # Draw text input field with rounded corners
    create_rounded_rectangle(text_area, 
                            (padding_x, padding_y), 
                            (SCREEN_WIDTH - padding_x, int(TEXT_AREA_HEIGHT * 0.6)), 
                            (255, 255, 255), -1)
    create_rounded_rectangle(text_area, 
                            (padding_x, padding_y), 
                            (SCREEN_WIDTH - padding_x, int(TEXT_AREA_HEIGHT * 0.6)), 
                            KEY_BORDER, 2)
    
    # Display text with better font - scale with screen
    font_scale = max(SCREEN_HEIGHT / 1080 * 1.2, 0.7)  # Minimum scale of 0.7
    
    # If in force suggest mode, highlight the word being completed
    if force_suggest_mode and text:
        # Split text to highlight the last word
        words = text.split(' ')
        highlighted_text = ' '.join(words[:-1])
        last_word = words[-1] if words else ""
        
        # Calculate positions
        full_text = text.strip()
        regular_text = highlighted_text + (" " if highlighted_text else "")
        
        # Calculate text widths
        regular_text_size = cv2.getTextSize(regular_text, cv2.FONT_HERSHEY_DUPLEX, font_scale, 1)[0]
        
        # Draw regular text first
        cv2.putText(text_area, regular_text, 
                   (padding_x + 10, int(TEXT_AREA_HEIGHT * 0.4)), 
                   cv2.FONT_HERSHEY_DUPLEX, font_scale, TEXT_COLOR, 1)
        
        # Draw highlighted word with different color
        highlight_x = padding_x + 10 + regular_text_size[0]
        cv2.putText(text_area, last_word, 
                   (highlight_x, int(TEXT_AREA_HEIGHT * 0.4)), 
                   cv2.FONT_HERSHEY_DUPLEX, font_scale, HEADER_COLOR, 2)  # Thicker and different color
    else:
        # Normal text display
        cv2.putText(text_area, text.strip(), 
                   (padding_x + 10, int(TEXT_AREA_HEIGHT * 0.4)), 
                   cv2.FONT_HERSHEY_DUPLEX, font_scale, TEXT_COLOR, 1)
    
    # Add status section - scale with screen
    status_y1 = int(TEXT_AREA_HEIGHT * 0.7)
    status_y2 = int(TEXT_AREA_HEIGHT * 0.9)
    cv2.rectangle(text_area, 
                 (padding_x, status_y1), 
                 (SCREEN_WIDTH - padding_x, status_y2), 
                 status_color, -1)
    
    status_font_scale = max(SCREEN_HEIGHT / 1080 * 0.8, 0.5)  # Minimum scale of 0.5
    status_prefix = "Direct Autocomplete Active: " if force_suggest_mode else "Status: "
    cv2.putText(text_area, f"{status_prefix}{status_text}", 
               (padding_x + 10, int((status_y1 + status_y2) / 2) + 5), 
               cv2.FONT_HERSHEY_SIMPLEX, status_font_scale, (255, 255, 255), 1)
    
    if ear_value > 0:
        ear_text = f"EAR: {ear_value:.3f}"
        ear_text_size = cv2.getTextSize(ear_text, cv2.FONT_HERSHEY_SIMPLEX, status_font_scale, 1)[0]
        cv2.putText(text_area, ear_text, 
                   (SCREEN_WIDTH - padding_x - ear_text_size[0] - 10, int((status_y1 + status_y2) / 2) + 5), 
                   cv2.FONT_HERSHEY_SIMPLEX, status_font_scale, (255, 255, 255), 1)

    # Show webcam frame with better layout - recreate for proper scaling
    frame_bg = np.zeros((WEBCAM_HEIGHT, SCREEN_WIDTH, 3), np.uint8)
    frame_bg[:] = BG_COLOR
    
    # Calculate webcam size while maintaining aspect ratio
    webcam_max_height = int(WEBCAM_HEIGHT * 0.9)
    webcam_max_width = int(SCREEN_WIDTH * 0.6)
    
    # Calculate dimensions while maintaining aspect ratio
    frame_aspect = frame_w / frame_h
    if webcam_max_width / webcam_max_height > frame_aspect:
        # Height is the limiting factor
        disp_height = webcam_max_height
        disp_width = int(disp_height * frame_aspect)
    else:
        # Width is the limiting factor
        disp_width = webcam_max_width
        disp_height = int(disp_width / frame_aspect)
    
    # Resize frame
    frame_resized = cv2.resize(frame, (disp_width, disp_height))
    
    # Center the frame
    x_offset = (SCREEN_WIDTH - disp_width) // 2
    y_offset = (WEBCAM_HEIGHT - disp_height) // 2
    
    # Place the frame in the background
    frame_bg[y_offset:y_offset+disp_height, x_offset:x_offset+disp_width] = frame_resized
    
    # Add border around webcam
    cv2.rectangle(frame_bg, 
                 (x_offset-2, y_offset-2), 
                 (x_offset+disp_width+2, y_offset+disp_height+2), 
                 HEADER_COLOR, 2)
    
    # Add decorative elements - scale with screen
    title_font_scale = max(SCREEN_HEIGHT / 1080 * 0.8, 0.5)  # Minimum scale of 0.5
    cv2.putText(frame_bg, "Gaze Keyboard", 
               (int(SCREEN_WIDTH * 0.02), int(WEBCAM_HEIGHT * 0.08)), 
               cv2.FONT_HERSHEY_DUPLEX, title_font_scale, HEADER_COLOR, 1)
    
    exit_font_scale = max(SCREEN_HEIGHT / 1080 * 0.6, 0.4)  # Minimum scale of 0.4
    exit_text = "Press 'Q' to exit"
    exit_text_size = cv2.getTextSize(exit_text, cv2.FONT_HERSHEY_DUPLEX, exit_font_scale, 1)[0]
    cv2.putText(frame_bg, exit_text, 
               (SCREEN_WIDTH - exit_text_size[0] - int(SCREEN_WIDTH * 0.02), int(WEBCAM_HEIGHT * 0.08)), 
               cv2.FONT_HERSHEY_DUPLEX, exit_font_scale, HEADER_COLOR, 1)

    # Display currently spoken suggestion if in any suggestion mode
    if (suggest_active or force_suggest_mode) and last_spoken_suggestion:
        speak_text = f"Suggestion: {last_spoken_suggestion}"
        speak_text_size = cv2.getTextSize(speak_text, cv2.FONT_HERSHEY_DUPLEX, exit_font_scale, 1)[0]
        # Create a background for the text
        cv2.rectangle(frame_bg,
                     (int(SCREEN_WIDTH * 0.02), int(WEBCAM_HEIGHT * 0.92) - speak_text_size[1]),
                     (int(SCREEN_WIDTH * 0.02) + speak_text_size[0], int(WEBCAM_HEIGHT * 0.92) + 5),
                     (240, 235, 250), -1)
        cv2.putText(frame_bg, speak_text,
                   (int(SCREEN_WIDTH * 0.02), int(WEBCAM_HEIGHT * 0.92)),
                   cv2.FONT_HERSHEY_DUPLEX, exit_font_scale, HEADER_COLOR, 1)

    # Combine all elements
    combined = np.vstack((frame_bg, keyboard, text_area))
    
    # Display the UI
    cv2.imshow("Gaze Keyboard", combined)

    if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release()
cv2.destroyAllWindows()