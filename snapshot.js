const fs = require('fs');
const request = require('request');
const SolarCalc = require('solar-calc');

module.exports = class Snapshot {
  
  constructor(server, snap) {

    this.server = server;
    this.serverName = this.server.httpServer.zetta.serverName;

    this.timer = null;

    this.url = snap.url;
    this.destination = snap.destination;
    this.timeout = snap.timeout || 3000;

    // fixme: enhance code so that period may be sec, min, day, week, etc.
    // right now, period is minutes, so multiply by 60 * 1000 to get milliseconds
    this.period = snap.period * 60000;

    this.sunTrack = false;
    this.lightCheck = false;
    this.lightLevel = 0;

    this.light = snap.light;
    
    if (this.light.server && this.light.sensor && this.light.property && this.light.lowlight) {
      this.lightCheck = true;
      this.startObserver();
    }
    else if (this.light.lat && this.light.lon) {
      this.sunTrack = true;
    }

    if (this.lightCheck || this.sunTrack) {
      this.startImageLoop();
      if (this.lightCheck) {
        server.info("Snapshot timer enabled for " + snap.name + " checking light sensor");
      }
      else {
        server.info("Snapshot timer enabled for " + snap.name + " using sunrise/sunset schedule");
      }
    }
    else {
      server.info("Snapshot timer disabled for " + snap.name);
    }

  }

  startObserver() {

    // The main idea here is to observe the light level, starting the snapshot timer
    // if it is bright enough, and stopping the snapshot timer when it gets too dark.

    // if the light sensor is on the local server, then leave off the .from() clause
    const lightQuery = (this.serverName == this.light.server) ? 
                        this.server.where({name:this.light.sensor}) : 
                        this.server.from(this.light.server).where({name:this.light.sensor});

    const self = this;

    this.server.observe([lightQuery], function(photon) {
      photon.streams[self.light.property].on('data', function(message) {
        self.lightLevel = message.data;
      });
    });
  }

  checkLightLevel() {
    if (this.lightLevel > this.light.lowlight) {
      return true;
    }
    else {
      return false;
    }
  }

  checkSunPosition() {
    const now = new Date();
    const solar = new SolarCalc(now, this.light.lat, this.light.lon);

    if (now < solar.civilDusk) {
      return true;
    }
    else {
      return false;
    }
  }

  startImageLoop () {

    if (this.timer == null) {
      const self = this;

      this.timer = setInterval(function() {

        if (self.lightCheck) {
          if (!self.checkLightLevel()) {
            return;
          }
        }

        if (self.sunTrack) {
          if (!self.checkSunPosition()) {
            return;
          }
        }

        // if we made it here, then go ahead and get a snapshot
        try {
          request({url: self.url, timeout: self.timeout}, (err) => {
            if (err) {
              self.server.warn("Error connecting to " + self.url + " ERR: " + err.code);
            }
          }).pipe(fs.createWriteStream(self.destination));
        }
        catch (err) {
          self.server.warn("Error connecting to: " + self.url + " ERR: " + err);
        }
      }, this.period);
    }
  }

  stopImageLoop () {
    clearInterval(this.timer);
    this.timer = null;
  }

}