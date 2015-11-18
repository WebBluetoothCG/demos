Retro Joystick
=====================

  A traditional joystick for web apps

Screenshot
=====================
![alt text](https://github.com/deshawnbw/retro-joystick/raw/master/demo/assets/images/screenshot.png "Screenshot")

Check It Out
=====================
  View a demo <a href="http://deshawnbw.github.io/retro-joystick/">online</a>

Status
=====================

* Continuing attempts to solidfy API & distribution for a 1.0, hardening distribution format
* Working on figuring out a nice bower workflow

Usage
=====================

This is available in a couple of ways

* Using the css / js via polymer & bower
* <strike>Using the css / js via bower</strike> (not vetted yet)
* <strike>Consuming the css / js manually through your own process</strike> (not vetted yet)

### Using via Polymer & Bower

  If you don't have npm: <https://www.npmjs.com#getting-started>

  If you don't have bower: `sudo npm install -g bower`

  Install joystick via

    bower install retro-joystick

  Copy the example file from `bower_components/retro-joystick/bower_usage_example.html` and put it in your main directory.

    cp bower_components/retro-joystick/bower_usage_example.html .

  Party on

Joystick API
=====================

  Instanciate RetroJoyStick

    var retroJoyStick = new RetroJoyStick();

  You are able to view when joystick position changes

    retroJoyStick.on('change', function () {
      // do something here
    });

  You are able to access the following properties

    retroJoyStick.angle

    retroJoyStick.distance

  You are able to access the following methods:

    retroJoyStick.getPositionAdjustment

  The following options are optional via the constructor:

    retroJoyStick = new RetroJoyStick({
      snapping: true, // false
      snappingPixels: 8, // pixels away from snapping point
      speedAdjustment: 0.08, // 1 = 1:1 pixels from maxDistanceFromCenter, when adjusting pixels.
      maxDistanceFromCenter: 100, // how many pxiels away from the center of the joystick?
      container: document.getElementById('controls'), // where to insert markup? (default: body),
      position: 'bottom_left', // or 'bottom_right'
      // @todo/@inprogress pass in pre-build element or wrapper element.
    });

Authors
=====================
* DeShawn Williams <deshawn.b.williams@gmail.com>

License
=====================

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details at
  http://www.gnu.org/copyleft/gpl.html or LICENSE.md

Target environments
=====================
  This is for modern web browsers, targeted at the latest chrome/firefox at the moment. @TODO: crossbrowserness.

Development
=====================
These notes are here because i dont even remember shit after like 5 months when i pick this up once and a great while.

Create a new bower release:

commit your changes to the major branch 0.0.5-dev

    git commit -m 'updates...'

remember to push to branch

    git push origin 0.0.5-dev

tag the commit, list tags:

    git tag -l

tag the release

    git tag -a v0.0.5-dev.2 -m "Release version v0.0.5"

push the release

    git push origin master --tags


test bower release (empty dir):

    bower info retro-joystick

    bower install retro-joystick

    cp bower_components/retro-joystick/index.html .

    http-server


TODO
=====================
* Test touch devices
* Adjustable dimensions for joystick

