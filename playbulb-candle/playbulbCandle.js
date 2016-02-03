(function() {
  'use strict';

  let encoder = new TextEncoder('utf-8');
  let decoder = new TextDecoder('utf-8');

  /* Custom Bluetooth Service UUIDs */

  const CANDLE_SERVICE_UUID = 0xFF02;

  /* Custom Bluetooth Characteristic UUIDs */

  const CANDLE_DEVICE_NAME_UUID = 0xFFFF;
  const CANDLE_COLOR_UUID = 0xFFFC;
  const CANDLE_EFFECT_UUID = 0xFFFB;

  class PlaybulbCandle {
    constructor() {
      this.device = null;
      this.server = null;
      this._characteristics = new Map();
      this._debug = false;
    }
    connect() {
      let options = {filters:[{services:[ CANDLE_SERVICE_UUID ]}],
                     optionalServices: ['battery_service']};
      return navigator.bluetooth.requestDevice(options)
      .then(device => {
        this.device = device;
        return device.connectGATT();
      })
      .then(server => {
        this.server = server;
        return Promise.all([
          server.getPrimaryService(CANDLE_SERVICE_UUID).then(service => {
            return Promise.all([
              this._cacheCharacteristic(service, CANDLE_DEVICE_NAME_UUID),
              this._cacheCharacteristic(service, CANDLE_COLOR_UUID),
              this._cacheCharacteristic(service, CANDLE_EFFECT_UUID),
            ])
          }),
          server.getPrimaryService('battery_service').then(service => {
            return this._cacheCharacteristic(service, 'battery_level')
          }),
          // TODO: Uncomment when device_information service is actually
          // available in Chrome OS. http://crbug.com/532930
          /*
          server.getPrimaryService('device_information').then(service => {
            return Promise.all([
              this._cacheCharacteristic(service, 'serial_number_string'),
              this._cacheCharacteristic(service, 'hardware_revision_string'),
              this._cacheCharacteristic(service, 'firmware_revision_string'),
              this._cacheCharacteristic(service, 'software_revision_string'),
              this._cacheCharacteristic(service, 'manufacturer_name_string'),
              this._cacheCharacteristic(service, 'pnp_id'),
            ])
          }),
          */
        ]);
      })
    }

    /* Candle Service */

    getDeviceName() {
      return this._readCharacteristicValue(CANDLE_DEVICE_NAME_UUID)
      .then(this._decodeString);
    }
    setDeviceName(name) {
      let data = this._encodeString(name);
      return this._writeCharacteristicValue(CANDLE_DEVICE_NAME_UUID, data)
    }
    setColor(r, g, b) {
      let data = [0x00, r, g, b];
      return this._writeCharacteristicValue(CANDLE_COLOR_UUID, new Uint8Array(data))
      .then(() => [r,g,b]); // Returns color when fulfilled.
    }
    setCandleEffectColor(r, g, b) {
      let data = [0x00, r, g, b, 0x04, 0x00, 0x01, 0x00];
      return this._writeCharacteristicValue(CANDLE_EFFECT_UUID, new Uint8Array(data))
      .then(() => [r,g,b]); // Returns color when fulfilled.
    }
    setFlashingColor(r, g, b) {
      let data = [0x00, r, g, b, 0x00, 0x00, 0x1F, 0x00];
      return this._writeCharacteristicValue(CANDLE_EFFECT_UUID, new Uint8Array(data))
      .then(() => [r,g,b]); // Returns color when fulfilled.
    }
    setPulseColor(r, g, b) {
      // We have to correct user color to make it look nice for real...
      let newRed = Math.min(Math.round(r / 64) * 64, 255);
      let newGreen = Math.min(Math.round(g / 64) * 64, 255);
      let newBlue = Math.min(Math.round(b / 64) * 64, 255);
      let data = [0x00, newRed, newGreen, newBlue, 0x01, 0x00, 0x09, 0x00];
      return this._writeCharacteristicValue(CANDLE_EFFECT_UUID, new Uint8Array(data))
      .then(() => [r,g,b]); // Returns color when fulfilled.
    }
    setRainbow() {
      let data = [0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x00];
      return this._writeCharacteristicValue(CANDLE_EFFECT_UUID, new Uint8Array(data));
    }
    setRainbowFade() {
      let data = [0x01, 0x00, 0x00, 0x00, 0x03, 0x00, 0x26, 0x00];
      return this._writeCharacteristicValue(CANDLE_EFFECT_UUID, new Uint8Array(data));
    }

    /* Battery Service */

    getBatteryLevel() {
      return this._readCharacteristicValue('battery_level')
      .then(data => data.getUint8(0));
    }

    /* Device Info Service */

    getSerialNumber() {
      return this._readCharacteristicValue('serial_number_string')
      .then(this._decodeString);
    }
    getHardwareRevision() {
      return this._readCharacteristicValue('hardware_revision_string')
      .then(this._decodeString);
    }
    getFirmwareRevision() {
      return this._readCharacteristicValue('firmware_revision_string')
      .then(this._decodeString);
    }
    getSoftwareRevision() {
      return this._readCharacteristicValue('software_revision_string')
      .then(this._decodeString);
    }
    getManufacturerName() {
      return this._readCharacteristicValue('manufacturer_name_string')
      .then(this._decodeString);
    }
    getPnpID() {
      return this._readCharacteristicValue('pnp_id')
      .then(this._decodeString);
    }

    /* Utils */

    _cacheCharacteristic(service, characteristicUuid) {
      return service.getCharacteristic(characteristicUuid)
      .then(characteristic => {
        this._characteristics.set(characteristicUuid, characteristic);
      });
    }
    _readCharacteristicValue(characteristicUuid) {
      let characteristic = this._characteristics.get(characteristicUuid);
      return characteristic.readValue()
      .then(value => {
        // In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
        value = value.buffer ? value : new DataView(value);
        if (this._debug) {
          for (var i = 0, a = []; i < value.byteLength; i++) { a.push(value.getUint8(i)); }
          console.debug('READ', characteristic.uuid, a);
        }
        return value;
      });
    }
    _writeCharacteristicValue(characteristicUuid, value) {
      let characteristic = this._characteristics.get(characteristicUuid);
      if (this._debug) {
        console.debug('WRITE', characteristic.uuid, value);
      }
      return characteristic.writeValue(value);
    }
    _decodeString(data) {
      return decoder.decode(data);
    }
    _encodeString(data) {
      return encoder.encode(data);
    }
  }

  window.playbulbCandle = new PlaybulbCandle();

})();
