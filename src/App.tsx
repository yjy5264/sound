import * as React from 'react';
import { Button } from 'antd';
import './App.css';
import useGetSound from './hooks/useGetSound';
import useAnalyser from './hooks/useAnalyser';

const App = () => {
    // const [play, setPlay] = useGetSound()
    const draw = useAnalyser();

    const _draw = () => {
        draw();
        requestAnimationFrame(_draw);
    }

    return <div className="App">
        <Button type="primary" onClick={() => requestAnimationFrame(_draw)}>Button</Button>
        <canvas id="oscilloscope" style={{ width: 1024, height: 800 }} />
    </div>
};

export default App;