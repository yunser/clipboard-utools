import { uid } from 'uid'
import md5 from 'md5'
import mkdirp from 'mkdirp'

const fs = require('fs')
// import fs from 'fs'
// console.log('Node version is: ' + process.version);
// console.log('version', process.versions)
console.log('fs', fs, fs.readFileSync)
const code_prefix = 'open-app-v3-'

const userHomePath = utools.getPath('home')
console.log('userHomePath', userHomePath)

const features = utools.getFeatures()

// console.log('features', features)

const demo_urls = [
    {
        "title": "我的邮箱",
        "content": "12306@qq.com",
        "keywords": [
            "email"
        ]
    }
]

const folderPath = `${userHomePath}/data/clipboard`
if (!fs.existsSync(folderPath)) {
    mkdirp(folderPath)
}
const dbPath = `${userHomePath}/data/clipboard/data.json`
if (!fs.existsSync(dbPath)) {
    const dataJson = {
        "version": "0.0.1",
        "data": demo_urls
    }

    fs.writeFileSync(dbPath, JSON.stringify(dataJson, null, 4), 'utf-8')
}
console.log('init ok')

let urls = demo_urls

async function main() {
    
    // console.log('urls', JSON.stringify(ur))
    if (fs.existsSync(dbPath)) {
        const jsonContent = fs.readFileSync(dbPath, 'utf-8')
        let jsonData
        try {
            jsonData = JSON.parse(jsonContent)
        }
        catch (err) {
            console.error('JSON 格式解析出错')
            console.error(err)
        }
        if (jsonData) {
            urls = jsonData.data
        }
    }

    console.log('urls', urls)
    
    for (let item of urls) {
        item.id = md5(item.content)
    }
    
    for (let url of urls) {
        utools.setFeature({
            "code": code_prefix + url.id,
            explain: `复制 ${url.content} `,
            cmds: [
                url.title,
                ...(url.keywords || []),
            ]
        })
    }
    for (let feature of features) {
        if (!feature.code.includes(code_prefix)) {
            utools.removeFeature(feature.code)
        }
    }
    
    const features2 = utools.getFeatures()
    
    console.log('features2', features2)
    
    utools.onPluginEnter(({ code, type, payload }) => {
        console.log('用户进入插件', code, type, payload)
        if (code.includes(code_prefix)) {
            const item = urls.find(u => code_prefix + u.id == code)
            if (item) {
                console.log('找到', item)
                // utools.shellOpenPath(item.path)
                //     // utools.showNotification('hello')
                utools.copyText(item.content)
                utools.outPlugin()
                utools.hideMainWindow()
            }
        }
    })
    
    // window.exports = {
    //     'open-in-browser': {
    //         mode: 'none',
    //         args: {
    //             enter: (action) => {
    //                 console.log('action', action)
    //                 // window.utools.hideMainWindow()
    //                 // utools.showNotification('hello')
    //                 // window.utools.outPlugin()
    //             }
    //         }
    //     }
    // }
}

main()

window._plugin = {

    getList() {
        return urls
    },

    getConfigPath() {
        return dbPath
    },

    showPath(path) {
        utools.shellShowItemInFolder(path)
    }
}
