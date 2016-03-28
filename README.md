# KQED App

Do you enjoy listening to KQED on your computer, but get annoyed how you need to open a browser and then keep a tab open? Well, this app is for you then. This electron app will let you play/pause the live stream from KQED directly from your operating system. It's nothing fancy, but having a native app means we can do things like play/pause doing a cmd+shift+space hot key sequence.

## Making it work

The packaging scripts for this app are hard-coded to support Mac OS X and no other platform. If you want to use this app for another platform, edit the `package.json` file and change the platform type to your preferred option in the "package" portion of the config.

1. Clone this repository
2. Ensure you have NPM and Nodejs installed (brew makes that easy)
3. Change to the repo directory
4. Run `npm install` (this grabs all the dependencies)
5. Run `npm run-script package`
6. Check your desktop for a KQED folder
