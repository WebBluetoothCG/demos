# Web Bluetooth Printer

Available at https://webbluetoothcg.github.io/demos/microbit-led-scrolling-text/

<img src="/microbit-led-scolling-text/microbit.jpg">

This web app demonstrates the use of the Web Bluetooth API to send text to the standard `MicroBitLEDService` service

## Dependencies
* micro:bit: https://thepihut.com/products/micro-bit
* ChromeOS 48 with Web Bluetooth API enabled: https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web?hl=en
* Bower: http://bower.io/

## Setup Instructions
* Run the following command to install the packages listed in bower.json to the bower_components folder: bower install
* Host the app on your web server.
* Confirm the Web Bluetooth implementation status: https://github.com/WebBluetoothCG/web-bluetooth/blob/gh-pages/implementation-status.md
* Load the web app in a Chrome browser.
* Power up the microbit with the LED Service found [here](https://github.com/nimbleape/microbit-led-service)
* Enter a message on the web app.
* Click on the "Send" button to send the message to the microbit- the message will scroll on the LED display.

## References and How to report bugs
* Web Bluetooth API: https://webbluetoothcg.github.io/web-bluetooth/
* If you find any issues, please open a bug here on GitHub

## How to make contributions?
Please read and follow the steps in the CONTRIBUTING.md

## License
See LICENSE

## Google+
Web Bluetooth Community on Google+: https://plus.google.com/communities/108953318610326025178
