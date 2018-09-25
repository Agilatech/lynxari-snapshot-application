![Lynxari IoT Platform](https://agilatech.com/images/lynxari/lynxari200x60.png) **IoT Platform**
## Lynxari Snapshot Application

### Install
```
$> npm install @agilatech/lynxari-snapshot-application
```
Install in the same directory in which lynxari is installed. Create a config.json file to suit.


### Purpose
The purpose of this application is to capture a still image from a Web cam. It is intended for outdoor image capture, so it will only grab the image during daylight. Daylight can be detected either via external light sensor, or by using Lat and Lon to track sunrise and sunset.


### Usage
This application runs on the [Agilatech®](https://agilatech.com) Lynxari IoT platform.  As such, it is not applicable for other environments.

To use it with Lynxari, simply insert its object definition as an element in the apps array in the _applist.json_ file. On startup, the Lynxari server reads _applist.json_ and starts all applications found there.

A _config.json_ configuration file must be present in the module's main directory. For this module, that will be within the Lynxari home directory in _node\_modules/@agilatech/lynxari-snapshot-application/config.json_


### Configuration
The _config.json_ file defines an array of sources from which images will be captured. Each source contains the following:

1. **name** : The name of the camera. This is only used for logging purposes.
2. **url** : The full URL to the camera's still image.
3. **timeout** : The number of milliseconds to wait for the camera to respond to the image request. _optional_ Defaults to 3000 if not supplied.
3. **destination** : A full path to the file where the image will be stored on the local file system.
4. **period** : The number of minutes between image captures.
5. **light** : An object defining the the minimum light necessary to capture the image. Further explanation...

  **light**
  1. **lat** : The latitude of the camera. Only used if ambient light sensor is NOT used.
  2. **lon** : The longitude of the camera. Only used if ambient light sensor is NOT used.
  3. **server** : The name of the server peer containing an ambient light sensor. Defaults to local server if not given.
  4. **sensor** : The name of the light sensor device from which light levels are taken.
  5. **property** : The ambient light data property on the device.
  6. **lowlight** : The numerical value of the light property which is considered the lowlight cutoff.

  Note that _either_ lat and lon _or_ light sensor should be defined. If all parameters of the light sensor are given it will be used, but any single one is missing then the sunrise/sunset for the location will be used. If neither the light sensor or the earth position are properly defined, then the snapshot will be disabled for that camera source.

There is no limit to the number of source objects which may appear in the **sources** array. The config.json file must be valid JSON.

A sample config file:
```
{
  "sources":[
    {
      "name":"North Cam",
      "url":"http://username:password@192.168.1.102/snapshot.jpg",
      "destination":"/home/agt/webcam/latest.jpg",
      "period":"5",
      "light":{
        "lat":42.949009,
        "lon":-110.140349,
        "server":"agt1",
        "sensor":"SI1145",
        "property":"visible",
        "lowlight":5 
      }
    }
  ]
}
```

### Copyright
Copyright © 2018 [Agilatech®](https://agilatech.com). All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
