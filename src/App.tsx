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
        <canvas id="oscilloscope" width="2560px" height= "800px" />
        <div style={{ position: "absolute", top: 40, left: 40 }}>
            <h1>{hz.toFixed(3)}Hz</h1>
            <h1>{hz2pitch(hz)}</h1>
        </div>
    </div>
};

export default App;