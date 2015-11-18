/*
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details at
  http://www.gnu.org/copyleft/gpl.html or LICENSE.md
*/

/*
   @TODO:

     [x] add support for multiple joysticks

     [x] add support for touch events

     [x] add support for manipulating multiple joysticks

     [ ] fix issue when releasing (caused by hack for handling multiple touch events)

     [ ] increase resistance of pulling when at 75 +

     [ ] distance setter changes knob position

     [ ] angle setter changes knob position
*/

var joystickId = 0;

function RetroJoyStick(options) {

  var self = this;

  // options
  options = options || {};

  self.retroStickElement  = options.retroStickElement || false;

  // Should there be snapping?
  self.snapping = options.snapping || true;

  // What amount of pixels should we snap to?
  self.snappingPixels = options.snappingPixels || 8;

  // How far away from the center of the joystick
  self.maxDistanceFromCenter = options.maxDistanceFromCenter || 100;

  self.speedAdjustment = options.speedAdjustment || 0.08;

  self.container = options.container || document.body;

  // @TODO:?
  // aerial or scrolling
  //
  // aerial (think helicopter):
  //   when forward is pushed, the object goes up.
  //
  // scrolling (think mario bros):
  //   when forward is pushed, the object goes to the right.
  self.orientation = options.orientation || 'arial';

  if (options.position) {
    self.position = options.position;
  }
  else {
    self.position = 'bottom_left';
  }

  self.joystickId = ++joystickId;

  self.insertJoystickMarkup();

  var wrap = $('#retrostick-' + self.joystickId);

  if (self.retroStickElement) wrap = $(self.retroStickElement);

  var ball = wrap.find('.retrostick-ball');
  var stick = wrap.find('.retrostick-stick');
  var stickWrap = wrap.find('.retrostick-stick-wrap');
  var base = wrap.find('.retrostick-base');

  // private variables used in public methods
  this._ball = ball;
  this._stick = stick;

  // Scoped to the constructor, mostly for sharing in between mouse events
  var ballOffset,
      currentPos,
      clickOffset,
      point,
      lastPointX,
      lastPointY,
      lastDistance,
      lastAngle;

  // dimension based calculations
  var ballWidth = ball.width();
  var ballHeight = ball.height();
  var baseWidth = base.width();
  var baseHeight = base.height();
  var ballRadius = ballWidth / 2;

  // couldn't live without it, no way, oh no.
  var centerPoint = {x: baseWidth / 2, y: baseHeight / 2};

  // When we are moving around the joystick.
  function handleRetroStickMove(e) {

    // get the position of the joystick
    point = {
      x: e.pageX - ballOffset.left + currentPos.left- clickOffset.left + ballRadius,
      y: e.pageY - ballOffset.top + currentPos.top - clickOffset.top + ballRadius
    };

    // publicize the distance from center
    self.distance = getDistance(point, centerPoint);

    // Get angle from center (0-360)
    var theta = Math.atan2(point.y - centerPoint.y, point.x - centerPoint.x);

    if(theta < 0) theta += 2 * Math.PI;

    // Determine the angle of the joystick
    var _angle = (theta * 180 / Math.PI + 90 ) % 360;

    // publicize the angle (triggers setter)
    self.angle = _angle;

    // Constrain the point within a circle
    var limitedPoint = limit(point, centerPoint);

    // Snapping is enabled
    if (self.snapping) {

      // amount of pixels to snap to.
      var snap = self.snappingPixels;

      // Snap to the center
      if (self.distance < snap) {
        self.angle = 0;
        limitedPoint.x = centerPoint.x;
        limitedPoint.y = centerPoint.y;
      }

      // Snap on 0 angle
      if (_angle > 360 - snap || (_angle > 0 && _angle < snap)) {
        self.angle = 0;
        limitedPoint.x = centerPoint.x;
      }

      // Snap on 90 angle
      if (_angle > 90 - snap && _angle < 90 + snap) {
        self.angle = 90;
        limitedPoint.y = centerPoint.y;
      }

      // Snap on 180 angle
      if (_angle > 180 - snap && _angle < 180 + snap) {
        self.angle = 180;
        limitedPoint.x = centerPoint.x;
      }

      // Snap on 270 angle
      if (_angle > 270 - snap && _angle < 270 + snap) {
        self.angle = 270;
        limitedPoint.y = centerPoint.y;
      }
    } // End snapping

    var changed = false;

    if (limitedPoint.y !== lastPointY) {
      ball.css('top', limitedPoint.y - (ballHeight / 2));
      lastPointY = limitedPoint.y;
      changed = true;
    }

    if (limitedPoint.x !== lastPointX) {
      ball.css('left', limitedPoint.x - ballRadius);
      lastPointX = limitedPoint.x;
      changed = true;
    }

    if (self._angle !== lastAngle) {
      // Change stick angle according to where the ball has rotated
      stickWrap.css('-webkit-transform', 'rotate(' + self._angle + 'deg)');
      stickWrap.css('-moz-transform', 'rotate(' + self._angle + 'deg)');
      stickWrap.css('transform', 'rotate(' + self._angle + 'deg)');
      lastAngle = self._angle;
      changed = true;
    }

    // Change stick height so it reaches the ball
    if (self.distance !== lastDistance) {
      stick.height(self.distance);
      changed = true;
    }

    if (changed) {
      self.publish('change', [self, self.angle, self.distance]);
    }

    if (e.preventDefault) e.preventDefault();
  }

  function handleRetroStickUp(e, isTouch) {
    //if (e.target === self._ball[0]) {
      self.resetPosition();
      if (isTouch) {
        document.removeEventListener('touchmove', handleTouchRetroStickMove, false);
      }
      else {
        window.removeEventListener('mousemove', handleRetroStickMove, false);
      }
    //}
  }

  function handleTouchRetroStickMove(e) {
    if (e.target === self._ball[0]) {
      var touches = e.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        //console.log(i);
        handleRetroStickMove(touches[i], true);
      }
    }
  }

  function handleTouchRetroStickUp(e) {
    var touches = e.changedTouches;
    for (var i = 0; i < touches.length; i++) {
      handleRetroStickUp(e, true);
    }
  }

  function lol() {
    var strundefined = typeof undefined;


    var getWindow = function ( elem ) {
      return jQuery.isWindow( elem ) ?
        elem :
        elem.nodeType === 9 ?
          elem.defaultView || elem.parentWindow :
          false;
    };

    if ( arguments.length ) {
      return options === undefined ?
        this :
        this.each(function( i ) {
          jQuery.offset.setOffset( this, options, i );
        });
    }

    var docElem, win,
        box = { top: 0, left: 0 },
        elem = this[ 0 ],
        doc = elem && elem.ownerDocument;

    if ( !doc ) {
      return;
    }

    docElem = doc.documentElement;

    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if ( typeof elem.getBoundingClientRect !== strundefined ) {
      box = elem.getBoundingClientRect();
    }
    win = getWindow( doc );
    return {
      top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
        left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
    };
  }

  // When we press down on the joystick ball.
  function handleRetroStickPress(e, isTouch) {

    // Notate some shit
    ballOffset = ball.offset();
    currentPos = ball.position();
    clickOffset = {left: e.pageX - ballOffset.left, top: e.pageY - ballOffset.top};

    // Remove animation classes (from previous press)
    self._ball.removeClass('retrostick-ball-to-center');
    self._stick.removeClass('retrostick-stick-to-center');
    var doc = self._ball[0].ownerDocument;


    if (isTouch) {
      doc.addEventListener('touchmove', handleTouchRetroStickMove, false);
      doc.addEventListener('touchend', handleTouchRetroStickUp, false);

    }
    else {
      window.addEventListener('mousemove', handleRetroStickMove, false);
      window.addEventListener('mouseup', handleRetroStickUp, false);
    }

    if (e.preventDefault) e.preventDefault();
  }

  ball[0].addEventListener('mousedown', handleRetroStickPress, false);

  ball[0].addEventListener('touchstart', function (e) {
    var touches = e.changedTouches;
    for (var i = 0; i < touches.length; i++) {
      handleRetroStickPress(touches[i], true);
    }

    e.preventDefault();
  }, false);

}

RetroJoyStick.prototype = {

    get angle(){
      return this._angle;
    },

    set angle(val){
      this._angle = Math.floor(val);
    },

    get distance(){
      return this._distance;
    },

    set distance(distance){
      // Make sure distance doesn't go further than the max.
      if (distance > this.maxDistanceFromCenter) distance = this.maxDistanceFromCenter;
      this._distance = distance;
    }

};

RetroJoyStick.prototype.insertJoystickMarkup = function () {

  if (this.retroStickElement) {
    return this.retroStickElement;
  }

  var self = this;

  var wrap = document.createElement('div');
  wrap.setAttribute('id', 'retrostick-' + self.joystickId);
  wrap.className = 'retrostick';

  if (this.position == 'bottom_left') {
    $(wrap).addClass('retrostick-bottom-left');
  }

  if (this.position == 'bottom_right') {
    $(wrap).addClass('retrostick-bottom-right');
  }

  this.container.appendChild(wrap);

  this.publish('beforeInsert', wrap);

  return wrap;
};

RetroJoyStick.prototype.getPositionAdjustment = function () {

  var angle = angle || this.angle;
  var distance = distance || this.distance;

  distance *= this.speedAdjustment;

  angle = angle - 90;
  if (angle < 0) {
    angle = Math.abs(angle) + 270;
  }

  var radian = angle * Math.PI / 180;
  var cosAngle = Math.cos(radian);
  var sinAngle = Math.sin(radian);

  var x = Math.floor(cosAngle * distance);
  var y = Math.floor(sinAngle * distance);

  return {x: x, y: y};

};

RetroJoyStick.prototype.resetPosition = function () {
  this._ball.addClass('retrostick-ball-to-center');
  this._ball.css('top', 50);
  this._ball.css('left', 50);
  this._stick.addClass('retrostick-stick-to-center');
  this._stick.height(5);
  var prevAngle = this.angle;
  this.angle = 1;
  var prevDistance = this.distance;
  this.distance = 0;

  if (prevAngle !== this.angle || prevDistance !== this.distance) {
    this.publish('change', [this, this.angle, this.distance]);
  }
};

// https://gist.github.com/deshawnbw/7521966
RetroJoyStick.prototype.publish = function(topic, args){
  var self = this;
  if (this._eventCache && this._eventCache[topic]) {
    this._eventCache[topic].forEach(function (topicSubscriber) {
      topicSubscriber.apply(self, args || []);
    });
  }
};

RetroJoyStick.prototype.subscribe = function (topic, callback) {
  if (!this._eventCache) this._eventCache = {};
  if (!this._eventCache[topic]) this._eventCache[topic] = [];
  this._eventCache[topic].push(callback);

  return [topic, callback];
};

RetroJoyStick.prototype.on = RetroJoyStick.prototype.subscribe;

RetroJoyStick.prototype.trigger = RetroJoyStick.prototype.publish;

RetroJoyStick.prototype.unsubscribe = function(handle){
  var self = this;
  if (this._eventCache && this._eventCache[handle[0]]) {
    this._eventCache[handle[0]].forEach(function (callback, i) {
      if (handle[1] === callback) {
        self._eventCache[handle[0]].splice(i, 1);
      }
    });
  }
};

function getDistance(point1, point2) {
  var xs = (point1.x - point2.x) * (point1.x - point2.x);
  var ys = (point1.y - point2.y) * (point1.y - point2.y);

  return Math.floor(Math.sqrt(xs + ys));
}

// http://stackoverflow.com/questions/8515900/how-to-constrain-movement-within-the-area-of-a-circle
// http://jsfiddle.net/7Asn6/
function limit(point, centerPoint) {
  if (centerPoint.x) {
  var dist = getDistance(point, centerPoint);
  if (dist <= centerPoint.x) { // radius
      return point;
  } 
  else {
    x = point.x - centerPoint.x;
    y = point.y - centerPoint.y;
    var radians = Math.atan2(y, x);
       return {
           x: Math.cos(radians) * centerPoint.x + centerPoint.x,
           y: Math.sin(radians) * centerPoint.y + centerPoint.y
       };
  }
  }
}

