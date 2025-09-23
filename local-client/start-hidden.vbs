Set WshShell = CreateObject("WScript.Shell")

' Check if an argument was provided
If WScript.Arguments.Count > 0 Then
    ' Run the provided script/command
    WshShell.Run chr(34) & WScript.Arguments(0) & chr(34), 0
Else
    ' If no argument, run the default start-on-boot.bat in the same directory
    Dim scriptPath
    scriptPath = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\")) & "start-on-boot.bat"
    WshShell.Run chr(34) & scriptPath & chr(34), 0
End If

Set WshShell = Nothing
