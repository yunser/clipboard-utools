import { useEffect, useState } from 'react'
import './app.less'

console.log('_plugin', window._plugin)

function App() {

    const [list, setList] = useState([])
    const [configPath, setConfigPath] = useState('')
    const [msg] = useState('React')

    useEffect(() => {
        setList(window._plugin.getList())
        setConfigPath(window._plugin.getConfigPath())
    }, [])

    return (
        <div className="app">
            <div className="mb-4">已加载 {list.length} 条数据</div>

            <div className="mb-4">配置文件路径：{configPath}</div>

            <button
                onClick={() => {
                    window._plugin.showPath(configPath)
                    // window._plugin.getConfigPath()
                }}
            >打开配置文件</button>
            {/* <div className="hello">Hello {msg}</div> */}
            {/* <div>
                <button
                    onClick={() => {
                        alert('hello')
                    }}
                >Send Message</button>
            </div> */}
        </div>
    )
}
export default App
