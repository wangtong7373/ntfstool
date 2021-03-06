const saveLog = require('electron-log');
const Store = require('electron-store');
const {_} = require('lodash')
import {AlConst} from '@/common/utils/AlfwConst'
import {getSystemInfo, noticeTheSystemError} from '@/common/utils/AlfwCommon'
const store = new Store();


const alfwStore = {
    name: "Alntfs",
    auto_run: true,
    theme: "",
    lang: "en",
    show_menu: true,
    common: {
        website_url: "",
        install_bug_type: "auto_solve",
        how_restart_window: "change_to_bacground",
    },
    message: {
        mount_show_msg: true,
        update_show_msg: true,
        error_disk_msg: "",
    },
    disk_list: {
        history_list: [],
        ignore_list: [],
    },
    privacy_url: 'https://github.com/ntfstool/ntfstool',
    update: {
        auto_check: true,
        auto_beta_update: true,
        update_url: "",
        update_beta_url: "",
    },
    sudoPwd: false,
};


export function checkNeedInitStore() {
    if (!store.get("name") || store.get("name") == "undefined") {
        setDefaultStore();
        return true;
    }

    return false;
}


export function setDefaultStore() {
    store.set(alfwStore);
    saveLog.info("initStore alfwStore");
}

export function setStore(key,value) {
    store.set(key,value);
}

export function getStore(key) {
    return store.get(key);
}

export function clearPwd() {
    store.set("sudoPwd",null);
    console.warn("clearPwd res",store.get("sudoPwd"))
}


export function savePassword(password) {
    try {
        store.set("sudoPwd", password);
        if (password != store.get("sudoPwd")) {
            noticeTheSystemError("savePassword");
            return false;
        } else {
            return true;
        }
    } catch (e) {
        noticeTheSystemError("savePassword2");
        return false;
    }
}

export function getSudoPwd() {
    try {
        return store.get("sudoPwd");
    } catch (e) {
        noticeTheSystemError("getSudoPwdError");
        return false;
    }
}

export function setStoreForDiskList(value,callback) {
    console.warn("setStoreForDiskList",value)
    store.set(AlConst.DiskList,value);
    if(typeof callback == "function") {
        callback();
    }
    // alEvent().emit(AlConst.DiskListEvent,"SADASFDS");//update the DiskListEvent
}

export function getStoreForDiskList() {
    return store.get(AlConst.DiskList);
}


/**
 * init the ntfs
 * @returns {*}
 * @constructor
 */
export function InitSystemInfo() {
    var systemInfo = store.get("SystemInfo");
    if(typeof systemInfo == "undefined" || !systemInfo){
        getSystemInfo().then(systeminfo => {
            console.warn(systeminfo,"InitSystemInfo")
            var version_int = systeminfo.os_version.replace(/[^\d]*([\d]*.[\d]*).*/i, "$1");
            var version_float = parseFloat(version_int);
            if(version_float < 10.13){
                systeminfo.mountType = "inner";
            }else{
                systeminfo.mountType = "outer";
            }

            store.set("SystemInfo",systeminfo);

            saveLog.warn(store.get("SystemInfo"),"Create New SystemInfo");
        });
    }else{
        saveLog.warn(store.get("SystemInfo"),"Already Had SystemInfo");
    }
}

/**
 * @returns {string}
 */
export function getMountType(){
    var data = store.get("SystemInfo");
    return _.get(data,"mountType") == "outer" ? "outer" : "inner";
}

/**
 * @returns {string}
 */
export function getMountNotifyStatus(){
    return store.get("message.mount_show_msg") ? true : false;
}


export function watchStatus($val){
    if(typeof $val == "undefined"){
        return store.get("WatchStatus") === false ? false : true;
    }else{
        store.set("WatchStatus",$val);
    }
}

/**
 * get ignore disk item
 * @param $val
 * @returns {boolean}
 */
export function ignoreItem($val){
    var ret = store.get("IgnoreItem");
    if(!ret){
        ret = [];
    }
    if(typeof $val == "undefined"){
        return ret;
    }else{
        if(_.indexOf(ret,$val) === -1){
            ret.push($val);
        }
        store.set("IgnoreItem",ret);
    }
}

/**
 * del ignore disk item
 * @param $val
 * @returns {boolean}
 */
export function delIgnoreItem(name){
    var ret = store.get("IgnoreItem");
    if(!ret){
        return true;
    }
    ret = ret.filter(function (item) {
        if(item == name){
            return false;
        }else{
            return true;
        }
    });

    console.warn(ret,"save delIgnoreItem")
    store.set("IgnoreItem",ret);
    return true;
}

export function delAllIgnore(){
    store.set("IgnoreItem",[]);
    console.warn("delAllIgnore ok")
    return true;
}




