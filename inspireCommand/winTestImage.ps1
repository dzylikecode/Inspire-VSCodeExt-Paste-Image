
# see https://stackoverflow.com/questions/55215482/save-image-from-clipboard-using-powershell
Add-Type -AssemblyName System.Windows.Forms
$clipboard = [System.Windows.Forms.Clipboard]::GetDataObject()
if ($clipboard.ContainsImage()) {
    Write-Output "1"
}else {
    Write-Output "0"
}