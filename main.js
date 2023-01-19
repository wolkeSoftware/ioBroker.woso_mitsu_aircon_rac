"use strict";

/*
 * Created with @iobroker/create-adapter v2.3.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
const AirconStatClass = require("./lib/AirconStat.js");
const AirconCoderClass = require("./lib/AirconStatCoder.js");

const KEY_AIRCON_ID = "airconId";
const KEY_AIRCON_STAT = "airconStat";
//const KEY_AUTO_HEATING = "autoHeating";
//const KEY_LED_STAT = "ledStat";

const OPERATORID = "d2bc4571-1cea-4858-b0f2-34c18bef1901";
const TIMEZONE = "Europe/Berlin";
const AIRCON_PORT = 51443;
const AIRCON_DEVICEID = "18547566-315b-4941-bb9b-90cedef4bbb7";

const COMMAND_DELETE_ACCOUNT_INFO = "deleteAccountInfo";
const COMMAND_GET_DEVICE_INFO = "getDeviceInfo";
const COMMAND_SET_AIRCON_STAT = "setAirconStat";
const COMMAND_SET_NETWORK_INFO = "setNetworkInfo";
const COMMAND_UPDATE_ACCOUNT_INFO = "updateAccountInfo";
const COMMAND_GET_AIRCON_STAT = "getAirconStat";
/*
const COMMAND_SET_OPTION_SETTING = "setOptionSetting";
const COMMAND_UPDATE_FIRMWARE = "updateFirmware";
*/

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
};

// Load your modules here, e.g.:
//const fs = require("fs");
const axios = require("axios");

class WosoMitsuAirconRac extends utils.Adapter {

    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    constructor(options) {
        super({
            ...options,
            name: "woso_mitsu_aircon_rac",
        });
        this.on("ready", this.onReady.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        // this.on("objectChange", this.onObjectChange.bind(this));
        // this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));
        this.AirconStat = new AirconStatClass();
        this.DeviceId = AIRCON_DEVICEID;
        this.AirconId = "";
        this.AirconMac = "";
        this.AirconApMode = 0;
        this.lastAirconData = null;
        this.firmwareVersion_wireless = "";
        this.firmwareVersion_mcu = "";
        this.firmwareType = "";
        this.connected_accounts = 0;
        this.name = "";
        this.lastResponse = {};
        this.lastError = "";
        this.autoHeating = 0;
        this.ledStat = 0;
        this.acCoder = new AirconCoderClass(this.log);
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        // Initialize your adapter here

        // Reset the connection indicator during startup
        this.setState("info.connection", false, true);

        // The adapters config (in the instance object everything under the attribute "native") is accessible via
        // this.config:
        this.log.info("woso::config ip: " + this.config.ip);
        this.log.info("woso::config timer: " + this.config.timer);

        this.acCoder.setLogger(this.log);

        await this.initIOBStates();


        await this.register_airco();

        if (this.AirconId!="") {
            this.setState("info.connection", true, true);
        }

        await this.getDataFromMitsu();

        await this.setIOBStates();

        /*
        For every state in the system there has to be also an object of type state
        Here a simple template for a boolean variable named "testVariable"
        Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
        */
        // You can also add a subscription for multiple states. The following line watches all states starting with "lights."
        // this.subscribeStates("lights.*");
        // Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
        // this.subscribeStates("*");

        /*
            setState examples
            you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
        */
        // the variable testVariable is set to true as command (ack=false)

        await this.setIOBStates();

        // same thing, but the value is flagged "ack"
        // ack should be always set to true if the value is received from or acknowledged from the target system
        // await this.setStateAsync("testVariable", { val: true, ack: true });

        // same thing, but the state is deleted after 30s (getState will return null afterwards)
        // await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });

        // examples for the checkPassword/checkGroup functions
        //let result = await this.checkPasswordAsync("admin", "iobroker");
        //this.log.info("check user admin pw iobroker: " + result);

        //result = await this.checkGroupAsync("admin", "admin");
        //this.log.info("check group user admin group admin: " + result);

        //get data from aircon and start timer
        if (this.config.timer > 0) {
            this.startTimerAction();
        }
    }

    async setStateVal(id, val) {
        let valchange=0;
        let idS = "";
        const h = id.split(".");
        if (h.length == 3) {
            idS = h[2];
        }
        switch (idS) {
            case "inOperation" :
                this.AirconStat.operation = val;
                valchange++;
                break;
            case "OperationMode" :
                this.AirconStat.operationMode = val;
                valchange++;
                break;
            case "Airflow" :
                this.AirconStat.airFlow = val;
                valchange++;
                break;
            case "Preset-Temp" :
                this.AirconStat.presetTemp = val;
                valchange++;
                break;
            case "Winddirection LR" :
                this.AirconStat.windDirectionLR = val;
                valchange++;
                break;
            case "Winddirection UD" :
                this.AirconStat.windDirectionUD = val;
                valchange++;
                break;
        }
        if (valchange > 0) {
            await this.sendDataToMitsu();
            this.setIOBStates();
        }
    }

    async setIOBStates() {
        await this.setStateAsync("inOperation", this.AirconStat.operation, true);
        await this.setStateAsync("OperationMode", this.AirconStat.operationMode, true);
        await this.setStateAsync("Airflow", this.AirconStat.airFlow, true);
        await this.setStateAsync("ModelNo", ""+this.AirconStat.modelNo, true);
        await this.setStateAsync("Indoor-Temp", this.AirconStat.indoorTemp, true);
        await this.setStateAsync("Outdoor-Temp", this.AirconStat.outdoorTemp, true);
        await this.setStateAsync("Preset-Temp", this.AirconStat.presetTemp, true);
        await this.setStateAsync("Winddirection LR", this.AirconStat.windDirectionLR, true);
        await this.setStateAsync("Winddirection UD", this.AirconStat.windDirectionUD, true);
        //await this.setStateAsync("Auto-Heating", this.AirconStat.isAutoHeating, true);
        await this.setStateAsync("Cool-Hot-Judge", this.AirconStat.coolHotJudge, true);
        await this.setStateAsync("Electric", this.AirconStat.electric, true);
        await this.setStateAsync("Entrust", this.AirconStat.entrust, true);
        await this.setStateAsync("Error-Code", this.AirconStat.errorCode, true);
        await this.setStateAsync("Self-Clean-Operation", this.AirconStat.isSelfCleanOperation, true);
        await this.setStateAsync("Self-Clean-Reset", this.AirconStat.isSelfCleanReset, true);
        await this.setStateAsync("Vacant", this.AirconStat.isVacantProperty, true);
        await this.setStateAsync("AP-Mode", this.AirconApMode, true);
        await this.setStateAsync("Aircon-ID", this.AirconId, true);
        await this.setStateAsync("Aircon-MAC-Address", this.AirconMac, true);
        await this.setStateAsync("LED-Stat", this.ledStat, true);
        await this.setStateAsync("Firmware-Type", this.firmwareType, true);
        await this.setStateAsync("Wireless-Firmware-Version", this.firmwareVersion_wireless, true);
        await this.setStateAsync("MCU-Firmware-Version", this.firmwareVersion_mcu, true);
        await this.setStateAsync("Accounts", this.connected_accounts, true);
        await this.setStateAsync("Auto-Heating", this.autoHeating, true);
    }

    async initIOBStates() {
        await this.setObjectNotExistsAsync("inOperation", {
            type: "state",
            common: {
                name: "inOperation",
                type: "boolean",
                role: "indicator",
                read: true,
                write: true,
            },
            native: {},
        });
        // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
        this.subscribeStates("inOperation");

        await this.setObjectNotExistsAsync("OperationMode", {
            type: "state",
            common: {
                name: "OperationMode",
                type: "number",
                role: "indicator",
                read: true,
                write: true,
            },
            native: {},
        });
        this.subscribeStates("OperationMode");

        await this.setObjectNotExistsAsync("Airflow", {
            type: "state",
            common: {
                name: "Airflow",
                type: "number",
                role: "indicator",
                read: true,
                write: true,
            },
            native: {},
        });
        this.subscribeStates("Airflow");

        await this.setObjectNotExistsAsync("ModelNo", {
            type: "state",
            common: {
                name: "ModelNo",
                type: "string",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        this.subscribeStates("ModelNo");

        await this.setObjectNotExistsAsync("Indoor-Temp", {
            type: "state",
            common: {
                name: "Indoor-Temp",
                type: "number",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("Indoor-Temp");

        await this.setObjectNotExistsAsync("Outdoor-Temp", {
            type: "state",
            common: {
                name: "Outdoor-Temp",
                type: "number",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("Outdoor-Temp");

        await this.setObjectNotExistsAsync("Preset-Temp", {
            type: "state",
            common: {
                name: "Preset-Temp",
                type: "number",
                role: "indicator",
                read: true,
                write: true,
            },
            native: {},
        });
        this.subscribeStates("Preset-Temp");

        await this.setObjectNotExistsAsync("Winddirection LR", {
            type: "state",
            common: {
                name: "Winddirection LR",
                type: "number",
                role: "indicator",
                read: true,
                write: true,
            },
            native: {},
        });
        this.subscribeStates("Winddirection LR");

        await this.setObjectNotExistsAsync("Winddirection UD", {
            type: "state",
            common: {
                name: "Winddirection UD",
                type: "number",
                role: "indicator",
                read: true,
                write: true,
            },
            native: {},
        });
        this.subscribeStates("Winddirection UD");

        /*
        await this.setObjectNotExistsAsync("Auto-Heating", {
            type: "state",
            common: {
                name: "Auto-Heating",
                type: "number",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("Auto-Heating");
        */

        await this.setObjectNotExistsAsync("Cool-Hot-Judge", {
            type: "state",
            common: {
                name: "Cool-Hot-Judge",
                type: "boolean",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("Cool-Hot-Judge");

        await this.setObjectNotExistsAsync("Electric", {
            type: "state",
            common: {
                name: "Electric",
                type: "number",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("Electric");

        await this.setObjectNotExistsAsync("Entrust", {
            type: "state",
            common: {
                name: "Entrust",
                type: "boolean",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("Entrust");

        await this.setObjectNotExistsAsync("Error-Code", {
            type: "state",
            common: {
                name: "Error-Code",
                type: "string",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("Error-Code");

        await this.setObjectNotExistsAsync("Self-Clean-Operation", {
            type: "state",
            common: {
                name: "Self-Clean-Operation",
                type: "boolean",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("Self-Clean-Operation");

        await this.setObjectNotExistsAsync("Self-Clean-Reset", {
            type: "state",
            common: {
                name: "Self-Clean-Reset",
                type: "boolean",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("Self-Clean-Reset");

        await this.setObjectNotExistsAsync("Vacant", {
            type: "state",
            common: {
                name: "Vacant",
                type: "number",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("Vacant");

        await this.setObjectNotExistsAsync("AP-Mode", {
            type: "state",
            common: {
                name: "AP-Mode",
                type: "number",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("AP-Mode");

        await this.setObjectNotExistsAsync("Aircon-ID", {
            type: "state",
            common: {
                name: "Aircon-ID",
                type: "string",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("Aircon-ID");

        await this.setObjectNotExistsAsync("Aircon-MAC-Address", {
            type: "state",
            common: {
                name: "Aircon-MAC-Address",
                type: "string",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("Aircon-MAC-Address");

        await this.setObjectNotExistsAsync("LED-Stat", {
            type: "state",
            common: {
                name: "LED-Stat",
                type: "number",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("LED-Stat");

        await this.setObjectNotExistsAsync("Firmware-Type", {
            type: "state",
            common: {
                name: "Firmware-Type",
                type: "string",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("Firmware-Type");

        await this.setObjectNotExistsAsync("Wireless-Firmware-Version", {
            type: "state",
            common: {
                name: "Wireless-Firmware-Version",
                type: "string",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("Wireless-Firmware-Version");

        await this.setObjectNotExistsAsync("MCU-Firmware-Version", {
            type: "state",
            common: {
                name: "MCU-Firmware-Version",
                type: "string",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("MCU-Firmware-Version");

        await this.setObjectNotExistsAsync("Accounts", {
            type: "state",
            common: {
                name: "Accounts",
                type: "number",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("Accounts");

        await this.setObjectNotExistsAsync("Auto-Heating", {
            type: "state",
            common: {
                name: "Auto-Heating",
                type: "number",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        //this.subscribeStates("Auto-Heating");
    }

    startTimer() {
        this.timer = setTimeout(() =>this.startTimerAction(), (this.config.timer * 60000));
    }

    async startTimerAction() {
        await this.getDataFromAircon();
        this.startTimer();
    }

    async getDataFromAircon() {
        if (this.AirconId!="") {
            await this.getDataFromMitsu();
            await this.setIOBStates();
        }
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     * @param {() => void} callback
     */
    onUnload(callback) {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            // clearTimeout(timeout1);
            // clearTimeout(timeout2);
            // ...
            // clearInterval(interval1);

            callback();
        } catch (e) {
            callback();
        }
    }

    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  * @param {string} id
    //  * @param {ioBroker.Object | null | undefined} obj
    //  */
    // onObjectChange(id, obj) {
    //     if (obj) {
    //         // The object was changed
    //         this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    //     } else {
    //         // The object was deleted
    //         this.log.info(`object ${id} deleted`);
    //     }
    // }

    /**
     * Is called if a subscribed state changes
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
    onStateChange(id, state) {
        if (state) {
            // The state was changed
            if (state.ack === false) {
                this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
                this.setStateVal(id, state.val);
            }
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }

    // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
    //  * @param {ioBroker.Message} obj
    //  */
    // onMessage(obj) {
    //     if (typeof obj === "object" && obj.message) {
    //         if (obj.command === "send") {
    //             // e.g. send email or pushover or whatever
    //             this.log.info("send command");

    //             // Send response in callback if required
    //             if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
    //         }
    //     }
    // }

    ////Data-Transfer-Functions


    async _post(cmd, contents) {
        await delay(2050);
        const url = "http://"+this.config.ip+":"+AIRCON_PORT+"/beaver/command/"+cmd;
        const millis = Date.now();
        const t = Math.floor(millis / 1000);

        const data = {
            "apiVer": "1.0",
            "command": cmd,
            "deviceId": AIRCON_DEVICEID,
            "operatorId": OPERATORID,
            "timestamp": t,
        };
        if (contents != "") {
            data["contents"] = contents;
        }

        const ret = {};
        ret.error="";
        ret.response="";
        ret.body="";
        try {
            this.log.info("data: "+cmd+"::"+JSON.stringify(data));
            const response = await axios.post(url, data, {
                headers: {
                    "Connection": "close",
                    "Content-Type": "application/json;charset=UTF-8",
                    "Access-Control-Allow-Origin": "*",
                    "accept": "application/json",
                }});
            ret.response = response.data;
            this.lastResponse = ret.response;
            this.log.info("return: "+cmd+"::"+JSON.stringify(ret.response));
            //log("RESULT:"+JSON.stringify(response.data));
            //console.log(util.inspect(response.data, { showHidden: false, depth: null }));
        } catch (error) {
            ret.error = error;
            console.error(`Could not get Data: ${error}`);
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        }
        return ret;
    }

    async getDeviceInfoFromMitsu() {
        let ret = {};
        ret.error = "-1";

        try {
            ret = await this._post(COMMAND_GET_DEVICE_INFO);
            ret = ret.response.contents;
        } catch (error) {
            this.log.error(`Could not get Data: ${error}`);
            ret.error = error;
        }
        return ret;
    }

    async update_account_info() {
        //Update the account info on the airco (sets to operator id of the device)
        const contents = {
            "accountId": OPERATORID,
            [KEY_AIRCON_ID]: this.AirconId,
            "remote": 0,
            "timezone": TIMEZONE
        };
        return await this._post(COMMAND_UPDATE_ACCOUNT_INFO, contents);
    }


    async delete_account_info() {
        //Update the account info on the airco (deletes to operator id from the device)
        const contents = {
            "accountId": OPERATORID,
            [KEY_AIRCON_ID]: this.AirconId
        };
        return await this._post(COMMAND_DELETE_ACCOUNT_INFO, contents);
    }

    async set_network_info(airco_id) {
        //Update the account info on the airco (sets to operator id of the device)
        const contents = {
            "ssid": airco_id,
            "netPass": "192.168.178.12"
        };
        return await this._post(COMMAND_SET_NETWORK_INFO, contents);
    }

    async register_airco() {
        try {
            //this.log.info("regData:"+JSON.stringify(AirconItem));
            this.lastAirconData = await this.getDeviceInfoFromMitsu();
            this.AirconId = this.lastAirconData.airconId;
            this.AirconApMode = this.lastAirconData.apMode;
            this.AirconMac = this.lastAirconData.macAddress;

            //this.delete_account_info();

            //this.log.info("regData:"+JSON.stringify(AirconItem.airconData));
            //var res = await delete_account_info(AirconItem.airconData.airconId);exit();
            await this.update_account_info();
            //this.log.info("reg:"+JSON.stringify(res.response));
            /*
            if (res.response.result == 0) {
                const res2 = await this.set_network_info(this.AirconId);
            }
             */
        } catch(e) {
            this.log.error(e);
            this.log.info(JSON.stringify(this.lastAirconData));
        }
        //this.log.info("regres:"+res.response.result);

        /*
        //following Code is from JAVA, but no set_network is working and its not part of the python-scripts
        if (res.response.result == 0) {
            const res2 = await this.set_network_info(AirconItem.airconData.airconId, AirconItem.ip);
        }
        return AirconItem;

         */
    }

    async getDataFromMitsu() {
        let ret = {};
        ret.error="-1";
        const contents = {
            [KEY_AIRCON_ID]: this.AirconId
        };
        try {
            ret = await this._post(COMMAND_GET_AIRCON_STAT, contents);
            this.acCoder.fromBase64(this.AirconStat, ret.response.contents.airconStat);
            this.firmwareVersion_wireless = ret.response.contents.wireless.firmVer;
            this.firmwareVersion_mcu = ret.response.contents.mcu.firmVer;
            this.firmwareType = ret.response.contents.firmType;
            this.connected_accounts = ret.response.contents.numOfAccount;
            this.ledStat = ret.response.contents.ledStat;
            this.autoHeating = ret.response.contents.autoHeating;
            //this.AirconId = ret.response.contents.airconId;
        } catch (error) {
            this.log.error(`Could not get Data: ${error}`);
            ret.error=error;
        }
        return ret;
    }

    async sendDataToMitsu() {
        let ret = {};
        ret.error="-1";
        const command = this.acCoder.toBase64(this.AirconStat);
        const contents = {
            [KEY_AIRCON_ID]: this.AirconId,
            [KEY_AIRCON_STAT]: command
        };
        try {
            ret = await this._post(COMMAND_SET_AIRCON_STAT, contents);
            this.acCoder.fromBase64(this.AirconStat, ret.response.contents.airconStat);
        } catch (error) {
            this.log.error(`Could not get Data: ${error}`);
            ret.error=error;
        }
        return ret;
    }

    ////End of Data-Transfer-Functions


}

if (require.main !== module) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    module.exports = (options) => new WosoMitsuAirconRac(options);
} else {
    // otherwise start the instance directly
    new WosoMitsuAirconRac();
}