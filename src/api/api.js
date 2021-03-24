import request from '@/utils/request';
const API_NAME = '/Agriculture'

//用户登录
export function reqLogin({ username, password }) {
    return request({
        url: `${API_NAME}/login.action`,
        method: 'GET',
        params: {
            username,
            password
        },
    })
}
//获取用户管理列表
export function reqUserList({ username, pno, pageSize, object }) {
    return request({
        url: `${API_NAME}/getUser_info`,
        method: 'GET',
        params: {
            username,
            pno,
            pageSize,
            object
        },
    })
}

//删除用户  /delUser_info
export function reqDelUser({ username, id }) {
    return request({
        url: `${API_NAME}/delUser_info`,
        method: 'GET',
        params: {
            username,
            id
        },
    })
}

//编辑用户 /editUser_info
export function reqEditUser({ username, password, phone, role }) {
    return request({
        url: `${API_NAME}/editUser_info`,
        method: 'GET',
        params: {
            username,
            password,
            phone,
            role
        },
    })
}

//新增用户 /saveUser_info
export function reqSaveUser({ username, name, pass, phone, role }) {
    return request({
        url: `${API_NAME}/saveUser_info`,
        method: 'GET',
        params: {
            username,
            name,
            pass,
            phone,
            role
        },
    })
}

//获取角色
export function reqGetRole({ username, pno, pageSize }) {
    return request({
        url: `${API_NAME}/getrole`,
        method: 'GET',
        params: {
            username,
            pno,
            pageSize
        },
    })
}
//删除角色
export function reqDelRole({ username, id }) {
    return request({
        url: `${API_NAME}/delRole`,
        method: 'GET',
        params: {
            username,
            id
        },
    })
}

//新增角色
export function reqCreateRole({ username, p_id, role_name, region }) {
    return request({
        url: `${API_NAME}/saveRole`,
        method: 'GET',
        params: {
            username,
            p_id,
            role_name,
            region
        },
    })
}

//获取权限
export function reqGetPower({ username }) {
    return request({
        url: `${API_NAME}/getPower`,
        method: 'GET',
        params: {
            username,
        },
    })
}

//获取项目 getProject
export function reqGetProject({ username, pno, pageSize }) {
    return request({
        url: `${API_NAME}/getProject`,
        method: 'GET',
        params: {
            username,
            pno,
            pageSize
        },
    })
}

//删除项目
export function reqDelProject({ username, pid }) {
    return request({
        url: `${API_NAME}/delProject`,
        method: 'GET',
        params: {
            username,
            pid
        },
    })
}

//编辑项目 editProject
export function reqEditProject({ username, name, adss, fireman, person, firemanname, personname, lnt, marker }) {
    return request({
        url: `${API_NAME}/editProject`,
        method: 'GET',
        params: {
            username,
            name,
            adss,
            fireman,
            person,
            firemanname,
            personname,
            Int,
            marker,
        },
    })
}

//获取视频列表
export function reqGetVideoDevice({ username, tid, pno, pageSize }) {
    return request({
        url: `${API_NAME}/getDevice`,
        method: 'GET',
        params: {
            username,
            tid,
            pno,
            pageSize
        },
    })
}

//获取视频  getvideo
export function reqGetVideo({ username }) {
    return request({
        url: `${API_NAME}/getvideo`,
        method: 'GET',
        params: {
            username,
        },
    })
}

// 土壤温湿度
export function reqGetTuRangDevice({ username, tid, pno, pageSize, object }) {
    return request({
        url: `${API_NAME}/getDevice`,
        method: 'GET',
        params: {
            username,
            tid,
            pno,
            pageSize,
            object,
        },
    })
}

//土壤温湿度信息
export function reqGetTuRangDeviceInfo({ username, imei }) {
    return request({
        url: `${API_NAME}/getDeviceInfoAll`,
        method: 'GET',
        params: {
            username,
            imei
        },
    })
}

//控制设备
export function reqcontorlDeviceInfo({ username, tid, pno, pageSize, object }) {
    return request({
        url: `${API_NAME}/getDevice`,
        method: 'GET',
        params: {
            username,
            tid,
            pno,
            pageSize,
            object,
        },
    })
}

///checkDevice 开关控制器
export function reqCheckDevice({ username, type, port, imei, time }) {
    return request({
        url: `${API_NAME}/checkDevice`,
        method: 'GET',
        params: {
            username,
            type,
            port,
            imei,
            time,
        },
    })
}

//报警管理 getAlarmList
export function reqAlarmList({ username, pno, pageSize, object }) {
    return request({
        url: `${API_NAME}/getAlarmList`,
        method: 'GET',
        params: {
            username,
            pno, pageSize, object
        },
    })
}
//获取设备历史报警
export function reqHisAlarm({ username, imei }) {
    return request({
        url: `${API_NAME}/getHisAlarm`,
        method: 'GET',
        params: {
            username,
            imei
        },
    })
}

//delAlarm 解除报警
export function reqDelAlarm({ username, imei, aid }) {
    return request({
        url: `${API_NAME}/delAlarm`,
        method: 'GET',
        params: {
            username,
            imei,
            aid
        },
    })
}

//设备管理
export function reqDeviceManage({ username, pno, pageSize, object }) {
    return request({
        url: `${API_NAME}/getDevice`,
        method: 'GET',
        params: {
            username,
            pno,
            pageSize,
            object
        },
    })
}

//控制设备自动检测控制
export function reqUpDetection({ username, detection, imei }) {
    return request({
        url: `${API_NAME}/upDetection`,
        method: 'GET',
        params: {
            username,
            detection,
            imei
        },
    })
}

//删除设备
export function reqDelDevice({ username, imei }) {
    return request({
        url: `${API_NAME}/delDevice`,
        method: 'GET',
        params: {
            username,
            imei
        },
    })
}

//设备设置阈值 setDeThres
export function reqSetDeThres({ username, imei, soilH_min, soilT_min, soilH_max, soilT_max, }) {
    return request({
        url: `${API_NAME}/setDeThres`,
        method: 'GET',
        params: {
            username,
            imei,
            soilH_min,
            soilT_min,
            soilH_max,
            soilT_max,
        },
    })
}
// 获取管点
export function reqGetNetspot({ username, pno, pageSize, nid, object }) {
    return request({
        url: `${API_NAME}/getNetspot`,
        method: 'GET',
        params: {
            username,
            pno,
            pageSize,
            nid,
            object
        },
    })
}


//新增设备 adDevice
export function reqadDevice({ username, nid, device_name, imei, tid, lant_lat, adss }) {
    return request({
        url: `${API_NAME}/adDevice`,
        method: 'GET',
        params: {
            username,
            nid,
            device_name,
            imei,
            tid,
            lant_lat,
            adss
        },
    })
}

//编辑管点
export function editNetspot({ username, name, adss, lnt, fireman, person, firemanname, personname, tube, marker, nid, spid }) {
    return request({
        url: `${API_NAME}/editNetspot`,
        method: 'GET',
        params: {
            username,
            name,
            adss,
            lnt,
            fireman,
            person,
            firemanname,
            personname,
            tube,
            marker,
            nid,
            spid
        },
    })
}

//新增管点
export function adNetspot({ username, name, adss, lnt, fireman, person, firemanname, personname, tube, marker, nid }) {
    return request({
        url: `${API_NAME}/adNetspot`,
        method: 'GET',
        params: {
            username,
            name,
            adss,
            lnt,
            fireman,
            person,
            firemanname,
            personname,
            tube,
            marker,
            nid,
            spid
        },
    })
}

//删除管点
export function delNetspot({ username, spid }) {
    return request({
        url: `${API_NAME}/delNetspot`,
        method: 'GET',
        params: {
            username,
            spid
        },
    })
}

//获取管网 getNetworkNew
export function getNetwork({ username, pno, pageSize, object }) {
    return request({
        url: `${API_NAME}/getNetwork`,
        method: 'GET',
        params: {
            username,
            pno,
            pageSize,
            object
        },
    })
}

//删除管网 delNetwork
export function delNetwork({ username, nid }) {
    return request({
        url: `${API_NAME}/delNetwork`,
        method: 'GET',
        params: {
            username,
            nid
        },
    })
}
//获取分区列表 getPartitionList
export function getPartitionList({ username, pno, pageSize, object }) {
    return request({
        url: `${API_NAME}/getPartitionList`,
        method: 'GET',
        params: {
            username,
            pno,
            pageSize,
            object
        },
    })
}

//查看井房设备 getReclosing
export function getReclosing({ username, fid }) {
    return request({
        url: `${API_NAME}/getReclosing`,
        method: 'GET',
        params: {
            username,
            fid,
        },
    })
}

//滴灌任务列表
export function getGridTask({ username, pno, pageSize, object }) {
    return request({
        url: `${API_NAME}/getGridTask`,
        method: 'GET',
        params: {
            username,
            pno,
            pageSize,
            object
        },
    })
}

//停止滴灌任务 stopGrid
export function stopGrid({ username, id }) {
    return request({
        url: `${API_NAME}/stopGrid`,
        method: 'GET',
        params: {
            username,
            id,
        },
    })
}

//删除滴灌任务  delGridTask
export function delGridTask({ username, id }) {
    return request({
        url: `${API_NAME}/delGridTask`,
        method: 'GET',
        params: {
            username,
            id,
        },
    })
}

//新增滴灌任务 addGridTask
export function addGridTask({ username, name, time, type, start_time, object, cycle, cut, end_time }) {
    return request({
        url: `${API_NAME}/addGridTask`,
        method: 'GET',
        params: {
            username,
            name,
            time,
            type,
            start_time,
            object,
            cycle,
            cut,
            end_time
        },
    })
}
//大数据页获取项目
export function getPidAndPname({ username, pno, pageSize }) {
    return request({
        url: `${API_NAME}/getPidAndPname`,
        method: 'GET',
        params: {
            username,
            pno,
            pageSize
        },
    })
}

//首页温湿度传感器
export function getAverage({ username, pid }) {
    return request({
        url: `${API_NAME}/getAverage`,
        method: 'GET',
        params: {
            username,
            pid,
        },
    })
}

//物联设备
export function deviceTypeData({ username, pid }) {
    return request({
        url: `${API_NAME}/deviceTypeData`,
        method: 'GET',
        params: {
            username,
            pid,
        },
    })
}

//设备状态对比 deviceOnlineData
export function deviceOnlineData({ username, pid }) {
    return request({
        url: `${API_NAME}/deviceOnlineData`,
        method: 'GET',
        params: {
            username,
            pid,
        },
    })
}

//大数据页报警信息 pushAlarmData
export function pushAlarmData({ username, pid, pno, pageSize }) {
    return request({
        url: `${API_NAME}/pushAlarmData`,
        method: 'GET',
        params: {
            username,
            pid,
            pno,
            pageSize
        },
    })
}

//大数据滴灌任务 pushGrid
export function pushGrid({ username, pid, pno, pageSize, type }) {
    return request({
        url: `${API_NAME}/pushGrid`,
        method: 'GET',
        params: {
            username,
            pid,
            pno,
            pageSize,
            type
        },
    })
}