import { Component } from '@angular/core';
import { RandomCoordinateUtils } from "../../node_modules/@molteni/coordinate-utils/dist/random-coordinate-utils";
import { LatLng } from "../../node_modules/@molteni/coordinate-utils/dist/LatLng";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angMaps';
  constructor() {
    this.callMe();
  }
  callMe() {
    let ZURICH = new LatLng(47.22, 8.33);
    let result = RandomCoordinateUtils.randomCoordinateFromPosition(ZURICH, 50);
    console.log({ result });


    // 
    const alternativeResult = RandomCoordinateUtils.randomCoordinateFromPositionWithExplicitLatLng(47.22, 8.33, 0.1);
    console.log({ alternativeResult });
    this.calculate({});
  }


  // calc from here 

  trim(sString) {
    console.log(sString)
    sString = String(sString);
    while (sString.charCodeAt(0) < 33)
      sString = sString.substring(1, sString.length);
    while (sString.charCodeAt(sString.length - 1) < 33)
      sString = sString.substring(0, sString.length - 1);
    return sString;
  }

  clearRandomPoint() {
    console.log("clearing old random points")
  }

  latLonToDecimal(ll, lat, f) {
    let msg;

    var sChar;
    var decCoord;
    var array1 = new Array();
    var l;
    var fail;
    ll = this.trim(ll);
    msg = "invalid";
    if (ll == "") {
      msg = "required";
      fail = true;
    }
    sChar = ll.substring(ll.length - 1);
    sChar = sChar.toLowerCase();
    if (sChar != "n" && sChar != "s" && sChar != "e" && sChar != "w") {
      if ((ll != parseFloat(ll))
        || (lat == 1 && (ll < -90 || ll > 90))
        || (lat == 0 && (ll < -180 || ll > 180))) {
        fail = true;
      } else {
        decCoord = ll;
      }
    } else {
      // ends in N, S, E or W
      ll = this.trim(ll.substring(0, ll.length - 1));
      l = ll.length;
      // test for pure integer
      if ((ll == parseInt(ll, 10)) && l > 4) {
        array1[2] = (ll.substring(l - 2, l));
        array1[1] = (ll.substring(l - 4, l - 2));
        array1[0] = (ll.substring(0, l - 4));
      } else {
        // validate DMS formats
        var dms = /^\d{1,3}\W{1}\d{1,2}\W{1}\d{1,2}\W?$/
        var dm = /^\d{1,3}\W{1}\d{1,2}\W?$/
        var d = /^\d{1,3}\W?$/
        if (dms.test(ll) || dm.test(ll) || d.test(ll)) {
          array1 = ll.match(/\d+/g)
        } else {
          fail = true;
        }
      }
      l = array1.length;
      if (l >= 1) {
        decCoord = array1[0] * 1;
      }
      if (l >= 2) {
        decCoord = decCoord + (array1[1] / 60);
      }
      if (l >= 3) {
        decCoord = decCoord + (array1[2] / 3600);
      }
      if ((lat == 1 && (decCoord > 90 || sChar != "n" && sChar != "s")
        || lat == 0 && (decCoord > 180 || sChar != "e" && sChar != "w"))
        || array1[1] > 59 || array1[2] > 59) {
        fail = true;
      }
      if (sChar == "w" || sChar == "s") {
        decCoord = decCoord * -1;
      }
    }
    if (fail) {
      alert('The ' + f + ' is ' + msg);
      return -999;
    } else {
      return decCoord;
    }
  };

  rad(dg) {
    return (dg * Math.PI / 180);
  }

  isNumeric(s, mn, mx, allowNull) {
    var result = true;
    if (s == "" && !allowNull) {
      return false;
    } else {
      if ((parseFloat(s) != s) || (s < mn) || (s > mx)) {
        return false;
      }
    }
    return result;
  }

  deg(rd) {
    return (rd * 180 / Math.PI);
  }

  normalizeLongitude(lon) {
    var n = Math.PI;
    if (lon > n) {
      lon = lon - 2 * n
    } else if (lon < -n) {
      lon = lon + 2 * n
    }
    return lon;
  }

  decimalToDMS(l, isLat) {
    var dir1 = "";
    if (isLat == 1) {
      if (l < 0) {
        dir1 = "S";
      } else {
        dir1 = "N";
      }
    } else {
      if (l < 0) {
        dir1 = "W";
      } else {
        dir1 = "E";
      }
    }
    l = Math.abs(Math.round(l * 3600) / 3600);
    var deg1 = Math.floor(l);
    var temp = (l - deg1) * 60;
    var min1 = this.padWithZero(Math.floor(temp));
    temp = (temp - min1);
    var sec1 = this.padWithZero(Math.round(temp * 60));
    if (sec1 == 60) {
      sec1 = 59;
    }
    return Math.abs(deg1) + '\u00B0' + min1 + '\u2032' + sec1 + '\u2033' + dir1;
  }

  padWithZero(s) {
    if (s < 10) {
      s = "0" + s;
    }
    return s;
  }

  padZeroRight(s) {
    var sigDigits = 8;
    if (sigDigits > 8) {
      sigDigits = 8;
    } else if (sigDigits < 5) {
      sigDigits = 5;
    }
    s = "" + Math.round(s * Math.pow(10, sigDigits)) / Math.pow(10, sigDigits);
    var i = s.indexOf('.');
    var d = (s.length - i - 1);
    if (i == -1) {
      return (s + ".00");
    } else if (d == 1) {
      return (s + "0");
    } else {
      return s;
    }
  }


  // main calculation

  calculate(data) {
    let f1 = {
      points: {
        value: 10 // number of points
      },
      startlat: {
        value: 17.385044
      },
      startlon: {
        value: 78.486671
      },
      maxdist: {
        value: 1
      }

    };


    var sigDigits = 8;
    var selectedRegion = 0;
    var selectedFormat = 0;
    var units = "km";
    var mapwin = null;
    var circumMiles = 12440.883;
    var circumKm = 20020.732;
    var gLatlon = "";
    var gStartlat = 0;
    var gStartlon = 0;
    var PI = Math.PI;
    //------


    var array1 = new Array();
    var lat = 0;
    var lon = 0;
    var p = this.trim(f1.points.value);
    // with (Math) {
    if (parseInt(p) != p || p < 1) {
      alert('The number of points is invalid');
      // f1.points.focus();
      this.clearRandomPoint();
      return;
    }
    if (p > 2000) {
      alert('A maximum of 2000 points may be generated at a time');
      // f1.points.focus();
      this.clearRandomPoint();
      return;
    }
    // f1.region[0].checked for circular
    if (1 == 1) {
      // circular
      var startlat = this.latLonToDecimal(f1.startlat.value, 1, "latitude");
      if (startlat == -999) {
        // f1.startlat.focus();
        this.clearRandomPoint();
        return;
      }
      gStartlat = startlat;
      var brg = new Array(0, 180, 0);
      var j = 0;
      if (startlat == 90) {
        startlat = 89.99999999;
        j = 1
      }
      if (startlat == -90) {
        startlat = -89.99999999;
        j = 2;
      }
      startlat = this.rad(startlat);
      var startlon = this.latLonToDecimal(f1.startlon.value, 0, "longitude");
      if (startlon == -999) {
        // f1.startlon.focus();
        this.clearRandomPoint();
        return;
      }
      gStartlon = startlon;
      startlon = this.rad(startlon);
      if (units) {
        var mx = circumKm;
        var radiusEarth = 6372.796924;
      } else {
        var mx = circumMiles;
        var radiusEarth = 3960.056052;
      }
      var maxdist = f1.maxdist.value;
      if (this.isNumeric(maxdist, 0, mx, false) == false) {
        alert("The max distance must be a valid number between 0 and " + mx);
        // f1.maxdist.focus();
        // clearRandomPoint();
        return;
      }
      maxdist = maxdist / radiusEarth;
      var cosdif = Math.cos(maxdist) - 1;
      var sinstartlat = Math.sin(startlat);
      var cosstartlat = Math.cos(startlat);
      var dist = 0;
      var rad360 = 2 * PI;
      var displayDist = (f1.startlat.value != 0 || f1.startlon.value != 0);

      for (let i = 0; i < p; i++) {
        dist = Math.acos(Math.random() * cosdif + 1);
        brg[0] = rad360 * Math.random();
        lat = Math.asin(sinstartlat * Math.cos(dist) + cosstartlat * Math.sin(dist) * Math.cos(brg[0]));
        lon = this.deg(this.normalizeLongitude(startlon * 1 + Math.atan2(Math.sin(brg[0]) * Math.sin(dist) * cosstartlat, Math.cos(dist) - sinstartlat * Math.sin(lat))));
        lat = this.deg(lat);
        dist = Math.round(dist * radiusEarth * 10000) / 10000;
        brg[0] = Math.round(this.deg(brg[0]) * 1000) / 1000;
        if (!displayDist) {
          array1.push("w" + this.decimalToDMS(lat, 1) + "x" + this.padZeroRight(lat) + "y" + this.decimalToDMS(lon, 0) + "z" + this.padZeroRight(lon) + "\n");
        } else {
          array1.push("w" + this.decimalToDMS(lat, 1) + "x" + this.padZeroRight(lat) + "y" + this.decimalToDMS(lon, 0) + "z" + this.padZeroRight(lon) + "j" + dist + "q" + brg[j] + "\u00B0\n");
        }
      }

    } else {
      // this is for rectangular
      // var northlimit = this.latLonToDecimal(f1.northlat.value, 1, "latitude north limit");
      // if (northlimit == -999) {
      //   // f1.northlat.focus();
      //   // clearRandomPoint();
      //   return;
      // }
      // var southlimit = this.latLonToDecimal(f1.southlat.value, 1, "latitude south limit");
      // if (southlimit == -999) {
      //   // f1.southlat.focus();
      //   // clearRandomPoint();
      //   return;
      // }
      // if (northlimit * 1 < 1 * southlimit) {
      //   alert('The latitude south limit must not be greater than the latitude north limit');
      //   f1.northlat.focus();
      //   clearRandomPoint();
      //   return;
      // }
      // var westlimit = latLonToDecimal(f1.westlon.value, 0, "longitude west limit");
      // if (westlimit == -999) {
      //   f1.westlon.focus();
      //   clearRandomPoint();
      //   return;
      // }
      // var eastlimit = latLonToDecimal(f1.eastlon.value, 0, "longitude east limit");
      // if (eastlimit == -999) {
      //   f1.eastlon.focus();
      //   clearRandomPoint();
      //   return;
      // }
      // gStartlat = (northlimit - southlimit) / 2 + 1 * southlimit;
      // northlimit = rad(northlimit);
      // southlimit = rad(southlimit);
      // westlimit = rad(westlimit);
      // eastlimit = rad(eastlimit);
      // var sinsl = sin(southlimit);
      // var width = eastlimit - westlimit;
      // if (width < 0) {
      //   width = width + 2 * PI;
      // }
      // gStartlon = deg(normalizeLongitude(westlimit + width / 2));
      // for (let i = 0; i < p; i++) {
      //   lat = deg(asin(random() * (sin(northlimit) - sinsl) + sinsl));
      //   lon = deg(normalizeLongitude(westlimit + width * random()));
      //   array1.push("w" + decimalToDMS(lat, 1) + "x" + padZeroRight(lat) + "y" + decimalToDMS(lon, 0) + "z" + padZeroRight(lon) + "\n");
      // }
    }
    gLatlon = array1.join("");

    let result = array1.map((item) => {

      var w1 = new Array("Latitude: ", "", "");
      var x1 = new Array("   ", "\t", ",");
      var y1 = new Array("\nLongitude: ", "\t", ",");
      var j1 = new Array("\nDistance: ", "\t", ",");
      var q1 = new Array(" " + units + "  Bearing: ", "\t", ",");
      var ll = item;
      ll = ll.replace(/w/g, w1[selectedFormat]);
      ll = ll.replace(/x/g, x1[selectedFormat]);
      ll = ll.replace(/y/g, y1[selectedFormat]);
      ll = ll.replace(/z/g, x1[selectedFormat]);
      ll = ll.replace(/j/g, j1[selectedFormat]);
      ll = ll.replace(/q/g, q1[selectedFormat]);
      return ll;
    });


    console.log({ array1, result });
    this.displayResults(p, f1, gLatlon, units, selectedFormat);
    // }
  }

  displayResults(p, f1, gLatlon, units, selectedFormat) {

    // var sigDigits = 8;
    // var selectedRegion = 0;
    // var selectedFormat = 2;
    // var units = "km";
    // var mapwin = null;
    // var circumMiles = 12440.883;
    // var circumKm = 20020.732;
    // var gLatlon = "";
    // var gStartlat = 0;
    // var gStartlon = 0;
    // var PI = Math.PI;


    var p = this.trim(f1.points.value);
    var w1 = new Array("Latitude: ", "", "");
    var x1 = new Array("   ", "\t", ",");
    var y1 = new Array("\nLongitude: ", "\t", ",");
    var j1 = new Array("\nDistance: ", "\t", ",");
    var q1 = new Array(" " + units + "  Bearing: ", "\t", ",");
    //var tick = (new Date()).valueOf();
    var ll = gLatlon;
    ll = ll.replace(/w/g, w1[selectedFormat]);
    ll = ll.replace(/x/g, x1[selectedFormat]);
    ll = ll.replace(/y/g, y1[selectedFormat]);
    ll = ll.replace(/z/g, x1[selectedFormat]);
    ll = ll.replace(/j/g, j1[selectedFormat]);
    ll = ll.replace(/q/g, q1[selectedFormat]);
    console.log({ ll })
    // f1.randompoint.value = ll;
    // if (p == 1) {
    //   document.getElementById("randompointlabel").innerHTML = "1 random point:";
    // } else {
    //   document.getElementById("randompointlabel").innerHTML = p + " random points:";
    // }
    // if (p == 1 && f1.format[0].checked && (f1.region[0].checked && f1.wholeearth[0].checked && f1.startlat.value == 0 && f1.startlon.value == 0 || f1.region[1].checked)) {
    //   document.getElementById("randompoint").rows = 2;
    // } else {
    //   document.getElementById("randompoint").rows = 3;
    // }
  }

}
