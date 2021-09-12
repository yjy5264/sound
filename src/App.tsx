import * as React from 'react';
import { Button } from 'antd';
import './App.css';
import useGetSound from './hooks/useGetSound';

const App = () => {
    const [play, setPlay] = useGetSound()

    return <div className="App">
        <Button type="primary" onClick={() => setPlay(true)}>Button</Button>
    </div>
};

export default App;