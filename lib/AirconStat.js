/**
 * AirconStat-Class to hold the data for an Mitsubishi Aircon
 */
class AirconStat {
     airFlow = -1; //0=Auto, 1, 2, 3, 4 = Lüfterstellung
     canHomeLeaveModeStatusRequest = false;
     coolHotJudge = -1;
     electric = -1;
     entrust = -1;
     errorCode = '';
     //homeLeaveModeForCooling = null;
     //homeLeaveModeForHeating = null;
     indoorTemp = -1.0;
     isAutoHeating = false;
     isSelfCleanOperation = false;
     isSelfCleanReset = false;
     isVacantProperty = false;
     modelNo = '00000';
     operation = false; // false=Off, true=On
     operationMode = -1; //(0= 1=Kühlen, 2=Heizen, 3=Lüften, 4=Entfeuchten)
     outdoorTemp = -1.0;
     presetTemp = -1.0;
     windDirectionLR = -1;
     windDirectionUD = -1;

    constructor() {
        
    }
}