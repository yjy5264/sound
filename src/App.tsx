import * as React from 'react';
import './App.css';
import useAnalyser from './hooks/useAnalyser';
import { hz2pitch } from "./utils"

const App = () => {
    const [draw, hz] = useAnalyser();

    const _draw = () => {
        draw();
        requestAnimationFrame(_draw);
    }

    React.useEffect(() => {
        requestAnimationFrame(_draw)
    }, [])

    hz2pitch(1)

    return <div className="App">
        <canvas id="oscilloscope" style={{ width: 1024, height: 800 }} />
        <h1>{hz.toFixed(3)}Hz</h1>
        <h1>{hz2pitch(hz)}</h1>
    </div>
};

export default App;