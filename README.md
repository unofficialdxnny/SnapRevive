# SnapRevive

Boost Snapscore all with a new GUI
----

Setting up

## Windows

Open Command Prompt as Amin

run the below commands

`powershell -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"`

close cmd and again open as admin

`choco install nodejs -y --force`

download or clone this repo

`git clone https://github.com/unofficialdxnny/SnapRevive`

go to the repo directory

type in the below commands

`npm i`
`npm install electron --save-dev`
`electron .`