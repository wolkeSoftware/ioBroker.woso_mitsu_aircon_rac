"use strict";

const AirconStatClass = require("./AirconStat.js");

/**
 * AirconStatCoder-Class for decoding/encoding Mitsubishi Aircon-Messages
 */
class AirconStatCoder {
    constructor () {
        this.outdoorTempList = [-50.0,  -50.0,  -50.0,  -50.0,  -50.0,  -48.9,  -46.0,  -44.0,  -42.0,  -41.0,  -39.0,  -38.0,  -37.0,  -36.0,  -35.0,  -34.0,  -33.0,  -32.0,  -31.0,  -30.0,  -29.0,  -28.5,  -28.0,  -27.0,  -26.0,  -25.5,  -25.0,  -24.0,  -23.5,  -23.0,  -22.5,  -22.0,  -21.5,  -21.0,  -20.5,  -20.0,  -19.5,  -19.0,  -18.5,  -18.0,  -17.5,  -17.0,  -16.5,  -16.0,  -15.5,  -15.0,  -14.6,  -14.3,  -14.0,  -13.5,  -13.0,  -12.6,  -12.3,  -12.0,  -11.5,  -11.0,  -10.6,  -10.3,  -10.0,  -9.6,  -9.3,  -9.0,  -8.6,  -8.3,  -8.0,  -7.6,  -7.3,  -7.0,  -6.6,  -6.3,  -6.0,  -5.6,  -5.3,  -5.0,  -4.6,  -4.3,  -4.0,  -3.7,  -3.5,  -3.2,  -3.0,  -2.6,  -2.3,  -2.0,  -1.7,  -1.5,  -1.2,  -1.0,  -0.6,  -0.3,  0.0,  0.2,  0.5,  0.7,  1.0,  1.3,  1.6,  2.0,  2.2,  2.5,  2.7,  3.0,  3.2,  3.5,  3.7,  4.0,  4.2,  4.5,  4.7,  5.0,  5.2,  5.5,  5.7,  6.0,  6.2,  6.5,  6.7,  7.0,  7.2,  7.5,  7.7,  8.0,  8.2,  8.5,  8.7,  9.0,  9.2,  9.5,  9.7,  10.0,  10.2,  10.5,  10.7,  11.0,  11.2,  11.5,  11.7,  12.0,  12.2,  12.5,  12.7,  13.0,  13.2,  13.5,  13.7,  14.0,  14.2,  14.4,  14.6,  14.8,  15.0,  15.2,  15.5,  15.7,  16.0,  16.2,  16.5,  16.7,  17.0,  17.2,  17.5,  17.7,  18.0,  18.2,  18.5,  18.7,  19.0,  19.2,  19.4,  19.6,  19.8,  20.0,  20.2,  20.5,  20.7,  21.0,  21.2,  21.5,  21.7,  22.0,  22.2,  22.5,  22.7,  23.0,  23.2,  23.5,  23.7,  24.0,  24.2,  24.5,  24.7,  25.0,  25.2,  25.5,  25.7,  26.0,  26.2,  26.5,  26.7,  27.0,  27.2,  27.5,  27.7,  28.0,  28.2,  28.5,  28.7,  29.0,  29.2,  29.5,  29.7,  30.0,  30.2,  30.5,  30.7,  31.0,  31.3,  31.6,  32.0,  32.2,  32.5,  32.7,  33.0,  33.2,  33.5,  33.7,  34.0,  34.3,  34.6,  35.0,  35.2,  35.5,  35.7,  36.0,  36.3,  36.6,  37.0,  37.2,  37.5,  37.7,  38.0,  38.3,  38.6,  39.0,  39.3,  39.6,  40.0,  40.3,  40.6,  41.0,  41.3,  41.6,  42.0,  42.3,  42.6,  43.0 ];
        this.indoorTempList = [-30.0, -30.0, -30.0, -30.0, -30.0, -30.0, -30.0, -30.0, -30.0, -30.0, -30.0, -30.0, -30.0, -30.0, -30.0, -30.0, -29.0, -28.0, -27.0, -26.0, -25.0, -24.0, -23.0, -22.5, -22.0, -21.0, -20.0, -19.5, -19.0, -18.0, -17.5, -17.0, -16.5, -16.0, -15.0, -14.5, -14.0, -13.5, -13.0, -12.5, -12.0, -11.5, -11.0, -10.5, -10.0, -9.5, -9.0, -8.6, -8.3, -8.0, -7.5, -7.0, -6.5, -6.0, -5.6, -5.3, -5.0, -4.5, -4.0, -3.6, -3.3, -3.0, -2.6, -2.3, -2.0, -1.6, -1.3, -1.0, -0.5, 0.0, 0.3, 0.6, 1.0, 1.3, 1.6, 2.0, 2.3, 2.6, 3.0, 3.2, 3.5, 3.7, 4.0, 4.3, 4.6, 5.0, 5.3, 5.6, 6.0, 6.3, 6.6, 7.0, 7.2, 7.5, 7.7, 8.0, 8.3, 8.6, 9.0, 9.2, 9.5, 9.7, 10.0, 10.3, 10.6, 11.0, 11.2, 11.5, 11.7, 12.0, 12.3, 12.6, 13.0, 13.2, 13.5, 13.7, 14.0, 14.2, 14.5, 14.7, 15.0, 15.3, 15.6, 16.0, 16.2, 16.5, 16.7, 17.0, 17.2, 17.5, 17.7, 18.0, 18.2, 18.5, 18.7, 19.0, 19.2, 19.5, 19.7, 20.0, 20.2, 20.5, 20.7, 21.0, 21.2, 21.5, 21.7, 22.0, 22.2, 22.5, 22.7, 23.0, 23.2, 23.5, 23.7, 24.0, 24.2, 24.5, 24.7, 25.0, 25.2, 25.5, 25.7, 26.0, 26.2, 26.5, 26.7, 27.0, 27.2, 27.5, 27.7, 28.0, 28.2, 28.5, 28.7, 29.0, 29.2, 29.5, 29.7, 30.0, 30.2, 30.5, 30.7, 31.0, 31.3, 31.6, 32.0, 32.2, 32.5, 32.7, 33.0, 33.2, 33.5, 33.7, 34.0, 34.2, 34.5, 34.7, 35.0, 35.3, 35.6, 36.0, 36.2, 36.5, 36.7, 37.0, 37.2, 37.5, 37.7, 38.0, 38.3, 38.6, 39.0, 39.2, 39.5, 39.7, 40.0, 40.3, 40.6, 41.0, 41.2, 41.5, 41.7, 42.0, 42.3, 42.6, 43.0, 43.2, 43.5, 43.7, 44.0, 44.3, 44.6, 45.0, 45.3, 45.6, 46.0, 46.2, 46.5, 46.7, 47.0, 47.3, 47.6, 48.0, 48.3, 48.6, 49.0, 49.3, 49.6, 50.0, 50.3, 50.6, 51.0, 51.3, 51.6, 52.0 ];

        this.COMMAND_EXTENSION_HOME_LEAVE_MODE_FAN_SPEED_AUTO = 0;
        this.COMMAND_EXTENSION_HOME_LEAVE_MODE_FAN_SPEED_VOLUME1 = 3;
        this.COMMAND_EXTENSION_HOME_LEAVE_MODE_FAN_SPEED_VOLUME2 = 5;
        this.COMMAND_EXTENSION_HOME_LEAVE_MODE_FAN_SPEED_VOLUME3 = 7;
        this.COMMAND_EXTENSION_HOME_LEAVE_MODE_FAN_SPEED_VOLUME4 = 14;
        this.COMMAND_OPERATION_MODE2_OFF = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 0];
        this.COMMAND_OPERATION_MODE2_ON = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 144, 0, 0, 0, 0, 0];
        this.COMMAND_SELF_CLEAN_RESET_OFF = [];
        this.COMMAND_SELF_CLEAN_RESET_ON = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0];
        this.COMMAND_VACANT_PROPERTY_OFF = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.COMMAND_VACANT_PROPERTY_ON = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
        this.ELECTRIC_ENERGY_COFFICIENT = 0.25;
        this.STATUS_EXTENSION_CODE_HOME_LEAVE_MODE = 248;
        this.STATUS_EXTENSION_HOME_LEAVE_MODE_FAN_SPEED_AUTO = 0;
        this.STATUS_EXTENSION_HOME_LEAVE_MODE_FAN_SPEED_VOLUME1 = 3;
        this.STATUS_EXTENSION_HOME_LEAVE_MODE_FAN_SPEED_VOLUME2 = 5;
        this.STATUS_EXTENSION_HOME_LEAVE_MODE_FAN_SPEED_VOLUME3 = 7;
        this.STATUS_EXTENSION_HOME_LEAVE_MODE_FAN_SPEED_VOLUME4 = 14;
        this.STATUS_EXTENSION_OP1_HOME_LEAVE_MODE_COMMAND = 0;
        this.STATUS_EXTENSION_OP1_HOME_LEAVE_MODE_REQUEST = 255;
        this.STATUS_EXTENSION_OP1_HOME_LEAVE_MODE_STATUS = 16;
        this.STATUS_EXTENSION_OP2_HOME_LEAVE_MODE_FAN_SPEED_FOR_COOLING = 31;
        this.STATUS_EXTENSION_OP2_HOME_LEAVE_MODE_FAN_SPEED_FOR_HEATING = 32;
        this.STATUS_EXTENSION_OP2_HOME_LEAVE_MODE_TEMP_RULE_FOR_COOLING = 27;
        this.STATUS_EXTENSION_OP2_HOME_LEAVE_MODE_TEMP_RULE_FOR_HEATING = 28;
        this.STATUS_EXTENSION_OP2_HOME_LEAVE_MODE_TEMP_SETTING_FOR_COOLING = 29;
        this.STATUS_EXTENSION_OP2_HOME_LEAVE_MODE_TEMP_SETTING_FOR_HEATING = 30;
        this.STATUS_MODEL_NO_TYPE_GLOBAL_2022 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.STATUS_MODEL_NO_TYPE_HIGH_END_FOR_JAPANESE_2023 = [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.STATUS_MODEL_NO_TYPE_MAX_BIT = [127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.STATUS_MODEL_NO_TYPE_SEPARATE_2021 = [];
        this.STATUS_OPERATION_MODE2_MAX_BIT = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0];
        this.STATUS_OPERATION_MODE2_OFF = [];
        this.STATUS_OPERATION_MODE2_ON = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0];
        this.STATUS_VACANT_PROPERTY_MAX_BIT = [];
        this.STATUS_VACANT_PROPERTY_OFF = [];
        this.STATUS_VACANT_PROPERTY_ON = [];
        this.TAG = "AirconStatCoder";
        this.af_n_00 = [0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.af_n_01 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.af_n_02 = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.af_n_03 = [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.af_n_04 = [0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.af_p_00 = [0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.af_p_01 = [0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.af_p_02 = [0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.af_p_03 = [0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.af_p_04 = [0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.as_n_of = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.as_n_on = [0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.as_p_of = [0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.as_p_on = [0, 0, 192, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.av_n_of = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.av_n_on = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
        this.av_p_of = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0];
        this.av_p_on = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0];
        this.command_init = [0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.en_n_of = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.en_n_on = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0];
        this.en_p_of = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0];
        this.en_p_on = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0];
        this.lh_n_01 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.lh_n_02 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0];
        this.lh_n_03 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0];
        this.lh_n_04 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0];
        this.lh_n_05 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0];
        this.lh_n_06 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0];
        this.lh_n_07 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0];
        this.lh_p_01 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0];
        this.lh_p_02 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0];
        this.lh_p_03 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0, 0, 0];
        this.lh_p_04 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 0, 0, 0];
        this.lh_p_05 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0];
        this.lh_p_06 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0];
        this.lh_p_07 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0];
        this.lv_n_01 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.lv_n_02 = [0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.lv_n_03 = [0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.lv_n_04 = [0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.lv_p_01 = [0, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.lv_p_02 = [0, 0, 0, 144, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.lv_p_03 = [0, 0, 0, 160, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.lv_p_04 = [0, 0, 0, 176, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.om_n_au = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.om_n_dn = [0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.om_n_jo = [0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.om_n_re = [0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.om_n_so = [0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.om_p_au = [0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.om_p_dn = [0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.om_p_jo = [0, 0, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.om_p_re = [0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.om_p_so = [0, 0, 44, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.op_n_of = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.op_n_on = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.op_p_of = [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.op_p_on = [0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.receive_init = [0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.tm_p_au = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
        this.tm_p_no = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.zeros = [];
    }

    fromBase64(airconStat, StatString) {
        const StatByte = Buffer.from(StatString.replace("\n", ""), "base64").toString("binary");

        const StatByteArray = [];
        for (let i=0; i<StatByte.length; i++) {
            let h = StatByte.charCodeAt(i);
            StatByteArray[i] = h;
            /* try without trans to signed byte*/
            h = StatByte.charCodeAt(i);
            if (h > 127) {
                StatByteArray[i] = (256 - h) * (-1);
            } else {
                StatByteArray[i] = h;
            }
            /**/
        }
        return this.byteToStat(airconStat, StatByteArray);
    }

    byteToStat(airconStat, statByteArray) {
        // get te start of the first bytearray segment we use
        const r3 = 18;
        const dataStart = statByteArray[r3] * 4 + 21;
        const dataLength = statByteArray.length - 2;
        const data = statByteArray.slice(dataStart, dataLength);

        //get the current ac operation (3th value and with byte 3)
        airconStat.operation = 1 == (3 & data[2]);
        //get preset temp: 5th byte divided by 2
        airconStat.presetTemp = data[4] / 2;
        //log(airconStat.operation); log(airconStat.presetTemp);
        //get operation mode: check if 3th byte and byte 60 matches 8,16,12 or 4 (add 1)
        //console.log('operationMode');
        airconStat.operationMode = this.woso_findMatch(60 & data[2], [0, 8, 16, 12, 4]);
        //console.log('airflow');
        airconStat.airFlow = this.woso_findMatch(15 & data[3], [7, 0, 1, 2, 6]);
        //log(airconStat.operationMode);log(airconStat.airFlow);
        //console.log('winddirectionUD');
        airconStat.windDirectionUD = (data[2] & 192) == 64 ? 0 : this.woso_findMatch(240 & data[3], [0, 16, 32, 48]);

        //log(airconStat.windDirectionUD);
        //console.log('winddirectionLR');
        airconStat.windDirectionLR = (data[12] & 3) == 1 ? 0 : this.woso_findMatch(31 & data[11], [0, 1, 2, 3, 4, 5, 6]);

        //log('WindDirLR: '+airconStat.windDirectionLR);
        airconStat.entrust = 4 == (12 & data[12]);
        //console.log('entrust:'+airconStat.entrust);
        airconStat.coolHotJudge = (data[8] & 8) <= 0;
        //console.log('coolhotjudge:'+airconStat.coolHotJudge);
        //console.log('modelno');
        airconStat.modelNo = this.woso_findMatch(data[0] & 127, [0, 1, 2]);
        //log('modelno:'+airconStat.modelNo+'----'+(data[0] & 127));
        airconStat.isVacantProperty = data[10] & 1;
        //console.log('vacant:'+airconStat.isVacantProperty);
        const code = data[6] & 127;
        const zeroPad = (num, places) => String(num).padStart(places, "0");
        if (code == 0) { airconStat.errorCode="00"; }
        else if ((data[6] & -128) <= 0) { airconStat.errorCode = "M"+zeroPad(code,2); }
        else { airconStat.errorCode = "E"+code; }
        //console.log('Error:'+airconStat.errorCode);

        let c=0;const vals=[];
        for (let i=dataStart + 19; i < statByteArray.length-2; i++) {
            vals[c]=statByteArray[i];c++;
        }
        //console.log(vals);
        airconStat.electric = 0;
        for (let i=0; i<vals.length; i+=4) {
            if ( (vals[i] == -128) && (vals[i+1]==16) ) {
                airconStat.outdoorTemp = this.outdoorTempList[vals[i + 2] & 0xFF];
            }
            if ( (vals[i] == -128) && (vals[i+1]==32) ) {
                airconStat.indoorTemp = this.indoorTempList[vals[i + 2] & 0xFF];
            }
            if ( (vals[i] == -108) && (vals[i+1]==16) ) {
                const bytes = new Uint8Array([vals[i+2], vals[i+3], 0, 0]);
                const uint = new Uint32Array(bytes.buffer)[0];
                airconStat.electric =  uint * 0.25;
            }
        }
        //log('durch');
    }

    check_byteToStat(statByteArray) {
        const airconStat = new AirconStatClass();
        //log('trans:');log(statByteArray);
        // get te start of the first bytearray segment we use
        const dataStart = 0;
        const dataLength = statByteArray.length - 2;
        const data = statByteArray.slice(dataStart, dataLength);

        //get the current ac operation (3th value and with byte 3)
        airconStat.operation = 1 == (3 & data[2]);
        //get preset temp: 5th byte divided by 2
        airconStat.presetTemp = data[4] / 2;
        //log(airconStat.operation); log(airconStat.presetTemp);
        //get operation mode: check if 3th byte and byte 60 matches 8,16,12 or 4 (add 1)
        //console.log('operationMode');
        airconStat.operationMode = this.woso_findMatch(60 & data[2], [0, 8, 16, 12, 4]);
        //console.log('airflow');
        airconStat.airFlow = this.woso_findMatch(15 & data[3], [7, 0, 1, 2, 6]);
        //log(airconStat.operationMode);log(airconStat.airFlow);
        //console.log('winddirectionUD');
        airconStat.windDirectionUD = (data[2] & 192) === 64 ? 0 : this.woso_findMatch(240 & data[3], [0, 16, 32, 48]) + 1;

        //log(airconStat.windDirectionUD);
        //console.log('winddirectionLR');
        airconStat.windDirectionLR = (data[12] & 3) === 1 ? 0 : this.woso_findMatch(31 & data[11], [0, 1, 2, 3, 4, 5, 6]) ;

        //log('WindDirLR: '+airconStat.windDirectionLR);
        airconStat.entrust = 4 == (12 & data[12]);
        //console.log('entrust:'+airconStat.entrust);
        airconStat.coolHotJudge = (data[8] & 8) <= 0;
        //console.log('coolhotjudge:'+airconStat.coolHotJudge);
        //console.log('modelno');
        airconStat.modelNo = ""+this.woso_findMatch(data[0] & 127, [0, 1, 2]);
        //log('modelno:'+airconStat.modelNo+'----'+(data[0] & 127));
        airconStat.isVacantProperty = data[10] & 1;
        //console.log('vacant:'+airconStat.isVacantProperty);
        const code = data[6] & 127;
        const zeroPad = (num, places) => String(num).padStart(places, "0");
        if (code == 0) { airconStat.errorCode="00"; }
        else if ((data[6] & -128) <= 0) { airconStat.errorCode = "M"+zeroPad(code,2); }
        else { airconStat.errorCode = "E"+code; }
        //console.log('Error:'+airconStat.errorCode);

        let c=0;const vals=[];
        for (let i=dataStart + 19; i < statByteArray.length-2; i++) {
            vals[c]=statByteArray[i];c++;
        }
        //console.log(vals);
        airconStat.electric = 0;
        for (let i=0; i<vals.length; i+=4) {
            if ( (vals[i] == -128) && (vals[i+1]==16) ) {
                airconStat.outdoorTemp = this.outdoorTempList[vals[i + 2] & 0xFF];
            }
            if ( (vals[i] == -128) && (vals[i+1]==32) ) {
                airconStat.indoorTemp = this.indoorTempList[vals[i + 2] & 0xFF];
            }
            if ( (vals[i] == -108) && (vals[i+1]==16) ) {
                const bytes = new Uint8Array([vals[i+2], vals[i+3], 0, 0]);
                const uint = new Uint32Array(bytes.buffer)[0];
                airconStat.electric =  uint * 0.25;
            }
        }
    }

    woso_findMatch(value, posVals) {
        const ret=-1;
        for (let i=0; i < posVals.length; i++) {
            //console.log('findMatch: '+i+'__'+value+'=='+posVals[i]);
            if (posVals[i] == value) {
                return i;
            }
        }
        //console.log('Findmatch: -1');
        return ret;
    }


    /*
    toBytes( iArr) {
        let allocate = new ArrayBuffer(iArr.length);
        for (i=0; i < iArr.length) {
            allocate.put(this.toByte(iArr[i]));
        }
        return allocate;
    }

    toByte(int i) {
        return Arrays.copyOfRange(ByteBuffer.allocate(4).putInt(i).array(), 3, 4)[0];
    }
    */

    //version from java
    toBase64(airconStat) {
        let hb = this.command_to_byte(airconStat);
        let hhb = this.add_commandVariable(hb);
        //let hhhb = this.byteArrayToSigned(hhb);
        const arTo1 = this.add_crc16(hhb);
        //log('crc');log(hhb);log(arTo1);
        this.check_byteToStat(this.byteArrayToBinary(arTo1));

        hb = this.receive_to_bytes(airconStat);
        hhb = this.add_variable(hb);
        //let hhhb = this.byteArrayToSigned(hhb);
        const arTo2 = (this.add_crc16(hhb));
        this.check_byteToStat(this.byteArrayToBinary(arTo2));

        //log(arTo1);log(arTo2);
        const newAR= arTo1.concat(arTo2, [0]);
        //log(newAR);
        let ret = this.arrayBufferToBase64(newAR);
        ret = ret.replace("\n", "");
        //ret = ret.toString().slice(2, (-1));
        return ret;
    }

    toBase64py(airconStat) {
        let hb = this.command_to_byte(airconStat);
        let hhb = this.add_commandVariable(hb);
        //let hhhb = this.byteArrayToSigned(hhb);
        const arTo1 = this.add_crc16(hhb);

        hb = this.receive_to_bytes(airconStat);
        hhb = this.add_variable(hb);
        //let hhhb = this.byteArrayToSigned(hhb);
        const arTo2 = (this.add_crc16(hhb));

        const newAR= arTo1.concat(arTo2);

        let ret = this.arrayBufferToBase64(newAR);
        ret = ret.toString().slice(2, (-1));
        ret = ret.replace("\n", "");
        return ret;
    }

    command_to_byte(airconStat) {
        const stat_byte = [0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        // On/Off
        if (airconStat.operation) {
            stat_byte[2] |= 3;
        } else {
            stat_byte[2] |= 2;
        }

        // Operating Mode
        switch (airconStat.operationMode) {
            case 0 : stat_byte[2] |= 32; break;
            case 1 : stat_byte[2] |= 40; break;
            case 2 : stat_byte[2] |= 48; break;
            case 3 : stat_byte[2] |= 44; break;
            case 4 : stat_byte[2] |= 36;
        }

        // airflow
        switch (airconStat.airFlow) {
            case 0 : stat_byte[3] |= 15;break;
            case 1 : stat_byte[3] |= 8;break;
            case 2 : stat_byte[3] |= 9;break;
            case 3 : stat_byte[3] |= 10;break;
            case 4 : stat_byte[3] |= 14;
        }

        // Vertical wind direction
        switch (airconStat.windDirectionUD) {
            case 0 : stat_byte[2] |= 192; stat_byte[3] |= 128; break;
            case 1 : stat_byte[2] |= 128; stat_byte[3] |= 128; break;
            case 2 : stat_byte[2] |= 192; stat_byte[3] |= 144; break;
            case 3 : stat_byte[2] |= 192; stat_byte[3] |= 160; break;
            case 4 : stat_byte[2] |= 192; stat_byte[3] |= 176; break;
        }

        // Horizontal wind direction
        switch (airconStat.windDirectionLR) {
            case 0 : stat_byte[12] |= 3; stat_byte[11] |= 16; break;
            case 1 : stat_byte[12] |= 2; stat_byte[11] |= 16; break;
            case 2 : stat_byte[12] |= 2; stat_byte[11] |= 17; break;
            case 3 : stat_byte[12] |= 2; stat_byte[11] |= 18; break;
            case 4 : stat_byte[12] |= 2; stat_byte[11] |= 19; break;
            case 5 : stat_byte[12] |= 2; stat_byte[11] |= 20; break;
            case 6 : stat_byte[12] |= 2; stat_byte[11] |= 21; break;
            case 7 : stat_byte[12] |= 2; stat_byte[11] |= 22; break;
        }

        // preset temp
        let preset_temp = 25.0;
        if (airconStat.operationMode == 3) { preset_temp = 25.0; }
        else { preset_temp = airconStat.presetTemp; }
        stat_byte[4] |= Math.floor(preset_temp / 0.5) + 128;

        // entrust
        if (! airconStat.entrust) {
            stat_byte[12] |= 8;
        } else {
            stat_byte[12] |= 12;
        }
        /*
        if (! airconStat.coolHotJudge) {
            stat_byte[8] |= 8;
        }
*/
        if (airconStat.modelNo == 1) {
            stat_byte[0] |= 1;
        } else if (airconStat.modelNo == 2) {
            stat_byte[0] |= 2;
        }

        if (airconStat.modelNo == 1) {
            if (airconStat.isVacantProperty) {
                stat_byte[10] |= 1;
            } else {
                stat_byte[10] |= 0;
            }
        }

        if ( ! ((airconStat.modelNo == 1) || (airconStat.modelNo == 2)) ) {
            return stat_byte;
        }

        stat_byte[10] |= airconStat.isSelfCleanReset ? 4 : 0;

        stat_byte[10] |= airconStat.isSelfCleanOperation ? 144 : 128;

        return stat_byte;
    }

    // setze die Bytes, wie im translate_bytes erwartet
    receive_to_bytes(airconStat) {
        const stat_byte = [0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        // On/Off
        if (airconStat.operation) {
            stat_byte[2] |= 1;
        }

        // Operating Mode
        switch (airconStat.operationMode) {
            case 1 : stat_byte[2] |= 8; break;
            case 2 : stat_byte[2] |= 16; break;
            case 3 : stat_byte[2] |= 12; break;
            case 4 : stat_byte[2] |= 4;
        }

        // airflow
        switch (airconStat.airFlow) {
            case 0 : stat_byte[3] |= 7;break;
            case 2 : stat_byte[3] |= 1;break;
            case 3 : stat_byte[3] |= 2;break;
            case 4 : stat_byte[3] |= 6;
        }

        // Vertical wind direction
        switch (airconStat.windDirectionUD) {
            case 0 : stat_byte[2] |= 64;break;
            case 2 : stat_byte[3] |= 16;break;
            case 3 : stat_byte[3] |= 32;break;
            case 4 : stat_byte[3] |= 48;
        }

        // Horizontal wind direction
        switch (airconStat.windDirectionLR) {
            case 0 : stat_byte[12] |= 1;break;
            case 1 : stat_byte[11] |= 0;break;
            case 2 : stat_byte[11] |= 1;break;
            case 3 : stat_byte[11] |= 2;break;
            case 4 : stat_byte[11] |= 3;break;
            case 5 : stat_byte[11] |= 4;break;
            case 6 : stat_byte[11] |= 5;break;
            case 7 : stat_byte[11] |= 6;
        }

        // preset temp
        let preset_temp = 25.0;
        if (airconStat.operationMode == 3) { preset_temp = 25.0; }
        else { preset_temp = airconStat.presetTemp; }
        stat_byte[4] |= Math.floor(preset_temp / 0.5);

        // entrust
        if (airconStat.entrust) {
            stat_byte[12] |= 4;
        }
        /*
        if (! airconStat.coolHotJudge) {
            stat_byte[8] |= 8;
        }
*/
        if (airconStat.modelNo == 1) {
            stat_byte[0] |= 1;
        } else if (airconStat.modelNo == 2) {
            stat_byte[0] |= 2;
        }

        if (airconStat.modelNo == 1) {
            if (airconStat.isVacantProperty) {
                stat_byte[10] |= 1;
            } else {
                stat_byte[10] |= 0;
            }
        }

        if ( ! ((airconStat.modelNo == 1) || (airconStat.modelNo == 2)) ) {
            return stat_byte;
        }

        if (airconStat.isSelfCleanOperation) {
            stat_byte[15] |= 1;
        } else {
            stat_byte[15] != 0;
        }

        return stat_byte;
    }

    add_variable(byte_buffer) {
        //Concat byte_buffer wit hveriable
        return byte_buffer.concat([1, 255, 255, 255, 255]);
    }

    add_commandVariable(byte_buffer) {
        return byte_buffer.concat([1, 255, 255, 255, 255]);
    }

    byteArrayToSigned(dataIn) {
        // Convert to signed integers instead of bytes
        const data=[];
        for (let i=0; i < dataIn.length; i++) {
            if (dataIn[i] > 127) {
                data[i]=(256-dataIn[i])*(-1);
            } else {
                data[i]=dataIn[i];
            }
        }
        return data;
    }

    crc16ccitt(dataIn) {
        /*               */
        // Convert to signed integers instead of bytes
        const data=[];
        for (let i=0; i < dataIn.length; i++) {
            if (dataIn[i] > 127) {
                data[i]=(256-dataIn[i])*(-1);
            } else {
                data[i]=dataIn[i];
            }
        }
        /**/
        let i = 65535;
        for (let i1=0; i1 < data.length; i1++) {
            const b = data[i1];
            for (let i2=0; i2 < 8; i2++) {
                let z = true;
                const z2 = ((b >> (7 - i2)) & 1) === 1;
                if (((i >> 15) & 1) != 1) {
                    z = false;
                }
                i = i << 1;
                if (z2 != z) {
                    i ^= 4129;
                }
            }
        }

        return (i & 65535);
    }

    add_crc16(byte_buffer) {
        const crc = this.crc16ccitt(byte_buffer);
        return byte_buffer.concat([(crc & 255), ((crc >> 8) & 255)]);
    }

    byteArrayToBinary(bar) {
        let ret = "";
        for (let i=0; i < bar.length; i++) {
            ret += String.fromCharCode(bar[i]);
        }
        return ret;
    }

    binaryToByteArray(bina) {
        const ret=[];
        for (let i=0; i < bina.length; i++) {
            const h = bina.charCodeAt(i);
            ret[i] = h;
        }
        return ret;
    }

    arrayBufferToBase64( buffer ) {
        //const buf = new Uint8Array(buffer);
        const binary = String.fromCharCode.apply(null, buffer);
        return Buffer.from(binary).toString("base64");
    }

}

module.exports = AirconStatCoder;