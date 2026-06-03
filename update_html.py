import os
import re

directory = r"c:\Users\Acer\Downloads\BastuBazaar-main\BastuBazaar-main\bastubazarsus"

button_replacement = '''<div class="d-flex align-items-center gap-3">
                    <button class="btn btn-light btn-sm rounded-circle shadow-sm me-2" id="theme-toggle" style="width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center; border: 1px solid #e5e7eb;">
                        <i class="bi bi-moon-fill"></i>
                    </button>'''

script_replacement = '''<!-- Bootstrap 5 JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Firebase SDKs -->
    <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore-compat.js"></script>
    <!-- Firebase Config -->
    <script src="js/firebase-config.js"></script>
    <!-- Theme Toggle -->
    <script src="js/theme.js"></script>'''

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the navbar gap div to include theme toggle
        content = content.replace('<div class="d-flex align-items-center gap-3">', button_replacement)
        
        # Replace the bootstrap script with all new scripts
        # We'll use regex to find the bootstrap script in case of spacing differences
        pattern = r"<!-- Bootstrap 5 JS -->\s*<script src=\"https://cdn\.jsdelivr\.net/npm/bootstrap@5\.3\.3/dist/js/bootstrap\.bundle\.min\.js\"></script>"
        content = re.sub(pattern, script_replacement, content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Updated {filename}")
