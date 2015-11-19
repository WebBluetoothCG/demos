# Web Bluetooth BB-8

Available at https://webbluetoothcg.github.io/demos/bluetooth-toy-bb8/

<img src="https://raw.githubusercontent.com/webbluetoothcg/demos/gh-pages/bluetooth-toy-bb8/bb8.jpg">

This web app demonstrates the use of the Web Bluetooth API for controlling a bluetooth toy version of the BB-8 droid.

Joystick code based on: https://github.com/debugish/retro-joystick

## Dependencies
* BB-8 bluetooth toy: http://www.sphero.com/starwars
* ChromeOS 48 with Web Bluetooth API enabled: https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web?hl=en
* Bower: http://bower.io/

## Setup Instructions
* Run the following command to install the packages listed in bower.json to the bower_components folder: bower install
* Host the app on your web server.
* Confirm the Web Bluetooth implementation status: https://github.com/WebBluetoothCG/web-bluetooth/blob/gh-pages/implementation-status.md
* Load the web app in a Chrome browser.
* Switch on the toy.
* Pair the toy with its Android app and set its heading.
* In the web app click on the "Connect" radio button and wait for toy color to change.
* Use the joystick to move the toy.
* If the toy becomes unresponsive, use the reset button on the USB powered stand.

## References and How to report bugs
* Web Bluetooth API: https://webbluetoothcg.github.io/web-bluetooth/
* If you find any issues, please open a bug here on GitHub

## How to make contributions?
Please read and follow the steps in the CONTRIBUTING.md

## License
See LICENSE

## Google+
Web Bluetooth Community on Google+: https://plus.google.com/communities/108953318610326025178
