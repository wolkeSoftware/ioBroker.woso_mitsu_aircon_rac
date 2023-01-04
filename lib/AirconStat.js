/**
 * AirconStat-Class to hold the data for an Mitsubishi Aircon
 */
class AirconStat {
    static airFlow = -1; //0=Auto, 1, 2, 3, 4 = Lüfterstellung
    static canHomeLeaveModeStatusRequest = false;
    static coolHotJudge = -1;
    static electric = -1;
    static entrust = -1;
    static errorCode = '';
    //homeLeaveModeForCooling = null;
    //homeLeaveModeForHeating = null;
    static indoorTemp = -1.0;
    static isAutoHeating = false;
    static isSelfCleanOperation = false;
    static isSelfCleanReset = false;
    static isVacantProperty = false;
    static modelNo = "00000";
    static operation = false; // false=Off, true=On
    static operationMode = -1; //(0= 1=Kühlen, 2=Heizen, 3=Lüften, 4=Entfeuchten)
    static outdoorTemp = -1.0;
    static presetTemp = -1.0;
    static windDirectionLR = -1;
    static windDirectionUD = -1;

    constructor() {
    }
}

module.exports = AirconStat;