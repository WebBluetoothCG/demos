var r = g = b = 255; // White by default.

document.querySelector('#connect').addEventListener('click', function() {
  playbulbCandle.request()
  .then(_ => {
    document.querySelector('#state').classList.add('connecting');
    return playbulbCandle.connect();
  })
  .then(_ => {
    document.querySelector('#state').classList.remove('connecting');
    document.querySelector('#state').classList.add('connected');
    document.querySelector('#blow').textContent = '';
    return playbulbCandle.getDeviceName().then(handleDeviceName)
    .then(_ => playbulbCandle.getBatteryLevel().then(handleBatteryLevel))
    .then(_ => playbulbCandle.startBlowNotifications(handleBlowNotifications));
  })
  .catch(error => {
    document.querySelector('#state').classList.remove('connecting');
    // TODO: Replace with toast when snackbar lands.
    console.error('Argh!', error);
  });
});

function handleDeviceName(deviceName) {
  document.querySelector('#deviceName').value = deviceName;
}

function handleBatteryLevel(batteryLevel) {
  document.querySelector('#batteryLevel').textContent = batteryLevel + '%';
}

/* Device name */

document.querySelector('#deviceName').addEventListener('input', function() {
  playbulbCandle.setDeviceName(this.value)
  .catch(error => {
    console.error('Argh!', error);
  });
});

/* Blow notifications */

function handleBlowNotifications(event) {
  let v = event.target.value;
  if (v.byteLength == 8 &&
      v.getUint8(1) == 0 && v.getUint8(2) == 0 && v.getUint8(3) == 0) {
    // If r,g,b colors are 0, this means the candle is off.
    document.querySelector('#blow').textContent = 'Candle OFF';
  } else {
    document.querySelector('#blow').textContent = 'Candle ON';
  }
}

/* Color picker */

var img = new Image();
img.src = 'color-wheel.png'
img.onload = function() {
  var canvas = document.querySelector('canvas');
  var context = canvas.getContext('2d');

  canvas.width = 300 * devicePixelRatio;
  canvas.height = 300 * devicePixelRatio;
  canvas.style.width = "300px";
  canvas.style.height = "300px";

  canvas.addEventListener('click', draw);
  canvas.addEventListener('touchmove', function(evt) {
    evt.preventDefault();
    draw(evt.targetTouches[0]);
  });

  function draw(evt) {
    // Refresh canvas in case user zooms and devicePixelRatio changes.
    canvas.width = 300 * devicePixelRatio;
    canvas.height = 300 * devicePixelRatio;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    var rect = canvas.getBoundingClientRect();
    var x = Math.round((evt.clientX - rect.left) * devicePixelRatio);
    var y = Math.round((evt.clientY - rect.top) * devicePixelRatio);
    var data = context.getImageData(0, 0, canvas.width, canvas.height).data;

    r = data[((canvas.width * y) + x) * 4];
    g = data[((canvas.width * y) + x) * 4 + 1];
    b = data[((canvas.width * y) + x) * 4 + 2];

    changeColor();

    context.beginPath();
    context.arc(x, y + 2, 10 * devicePixelRatio, 0, 2 * Math.PI, false);
    context.shadowColor = '#333';
    context.shadowBlur = 4 * devicePixelRatio;
    context.fillStyle = 'white';
    context.fill();
  };

  context.drawImage(img, 0, 0, canvas.width, canvas.height);
}

/* Color effects */

document.querySelector('#noEffect').addEventListener('click', changeColor);
document.querySelector('#candleEffect').addEventListener('click', changeColor);
document.querySelector('#flashing').addEventListener('click', changeColor);
document.querySelector('#pulse').addEventListener('click', changeColor);
document.querySelector('#rainbow').addEventListener('click', changeColor);
document.querySelector('#rainbowFade').addEventListener('click', changeColor);

var colorChanging = false;

function changeColor() {
  if (colorChanging) {
    return;
  }
  colorChanging = true;
  var effect = document.querySelector('[name="effectSwitch"]:checked').id;
  switch(effect) {
    case 'noEffect':
      playbulbCandle.setColor(r, g, b).then(onColorChanged);
      break;
    case 'candleEffect':
      playbulbCandle.setCandleEffectColor(r, g, b).then(onColorChanged);
      break;
    case 'flashing':
      playbulbCandle.setFlashingColor(r, g, b).then(onColorChanged);
      break;
    case 'pulse':
      playbulbCandle.setPulseColor(r, g, b).then(onColorChanged);
      break;
    case 'rainbow':
      playbulbCandle.setRainbow().then(onColorChanged);
      break;
    case 'rainbowFade':
      playbulbCandle.setRainbowFade().then(onColorChanged);
      break;
  }
}

function onColorChanged(rgb) {
  if (rgb) {
    console.log('Color changed to ' + rgb);
    r = rgb[0];
    g = rgb[1];
    b = rgb[2];
  } else {
    console.log('Color changed');
  }
  colorChanging = false;
}

window.addEventListener('unhandledrejection', function() {
  colorChanging = false;
});

window.onload = function() {
  var connect = document.getElementById("connect");
  var no_bt = document.getElementById("no-bluetooth");
  if (navigator.bluetooth == undefined) {
    console.log("No navigator.bluetooth found.");
    connect.style.display = "none";
    no_bt.style.display = "block";
  } else {
    connect.style.display = "block";
    no_bt.style.display = "none";
  }
  screen.orientation.lock('portrait').catch(e => e);
};
