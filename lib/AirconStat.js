/**
 * AirconStat-Class to hold the data for an Mitsubishi Aircon
 */
class AirconStat {
     this.airFlow = -1; //0=Auto, 1, 2, 3, 4 = Lüfterstellung
     this.canHomeLeaveModeStatusRequest = false;
     this.coolHotJudge = -1;
     this.electric = -1;
     this.entrust = -1;
     this.errorCode = '';
     //homeLeaveModeForCooling = null;
     //homeLeaveModeForHeating = null;
     this.indoorTemp = -1.0;
     this.isAutoHeating = false;
     this.isSelfCleanOperation = false;
     this.isSelfCleanReset = false;
     this.isVacantProperty = false;
     this.modelNo = "00000";
     this.operation = false; // false=Off, true=On
     this.operationMode = -1; //(0= 1=Kühlen, 2=Heizen, 3=Lüften, 4=Entfeuchten)
     this.outdoorTemp = -1.0;
     this.presetTemp = -1.0;
     this.windDirectionLR = -1;
     this.windDirectionUD = -1;

    constructor() {
        
    }
}

module.exports = AirconStat;