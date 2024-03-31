Write-Output "Starting Python app.py server..."
Start-Process python -ArgumentList "app.py" -NoNewWindow

# Wait for the server to start (adjust sleep time as needed)
Start-Sleep -Seconds 5

# Start ngrok to expose port 5000
Write-Output "Running ngrok to expose port 5000..."
$NGROK_PROCESS = Start-Process ngrok -ArgumentList "http 5000" -NoNewWindow -PassThru

# Wait for ngrok to provide the forwarding URL (adjust sleep time as needed)
Start-Sleep -Seconds 10

# Get the ngrok URL from the process output
$NGROK_URL = $NGROK_PROCESS.StandardOutput.ReadToEnd().Trim()

# Replace [old url].ngrok-free.app with the new ngrok URL
Write-Output "Replacing [old url].ngrok-free.app with $NGROK_URL in your Visual Studio project..."

# Replace the URL in your project files, assuming it's a Python file
# Replace [old url].ngrok-free.app with $NGROK_URL
# For example, if it's a Python file named main.py
Get-ChildItem -Path "C:\Users\josep\Downloads\drawerApp\main_app\" -Filter *.js | ForEach-Object {
    (Get-Content $_.FullName) | ForEach-Object {
        $_ -replace 'https://574d-199-111-224-65.ngrok-free.app', $NGROK_URL
    } | Set-Content $_.FullName
}


Write-Output "Script execution completed."
