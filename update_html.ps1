$dir = "c:\Users\Acer\Downloads\BastuBazaar-main\BastuBazaar-main\bastubazarsus"
$files = Get-ChildItem -Path $dir -Filter "*.html"

$buttonReplacement = @"
<div class="d-flex align-items-center gap-3">
                    <button class="btn btn-light btn-sm rounded-circle shadow-sm me-2" id="theme-toggle" style="width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center; border: 1px solid #e5e7eb;">
                        <i class="bi bi-moon-fill"></i>
                    </button>
"@

$scriptReplacement = @"
<!-- Bootstrap 5 JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Firebase SDKs -->
    <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore-compat.js"></script>
    <!-- Firebase Config -->
    <script src="js/firebase-config.js"></script>
    <!-- Theme Toggle -->
    <script src="js/theme.js"></script>
"@

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace navbar gap div
    $content = $content.Replace('<div class="d-flex align-items-center gap-3">', $buttonReplacement)
    
    # Regex to replace bootstrap script area reliably
    $pattern = '<!-- Bootstrap 5 JS -->\s*<script src="https://cdn\.jsdelivr\.net/npm/bootstrap@5\.3\.3/dist/js/bootstrap\.bundle\.min\.js"></script>'
    $content = [regex]::Replace($content, $pattern, $scriptReplacement)
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Updated $($file.Name)"
}
