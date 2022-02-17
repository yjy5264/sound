const pitchs = {
    "C(do)": 16.352,
    "C^#/D^b": 17.324,
    "D(re)": 18.354,
    "D^#/^bE": 19.446,
    "E(mi)": 20.602,
    "F(fa)": 21.827,
    "F^#/G^b": 23.125,
    "G(so)": 24.5,
    "G^#/A^b": 25.957,
    "A(la)": 27.501,
    "A^#/^bB": 29.136,
    "B(si)": 30.868, 
}
let array: number[] = [];
for(let i = 0; i < 10; i++) {
    const _pitchs = Object.values(pitchs).map(item => item * Math.pow(2, i));
    array = array.concat(_pitchs);
}

export const hz2pitch = (hz: number) => {
    let d = Number.MAX_VALUE;
    let i = 0;
    array.map((item, index) => {
        if (Math.abs(hz - item) < d) {
            d = Math.abs(hz - item);
            i = index; 
        }
    })
    const noteIndex = i % 12;
    const octave = (i - noteIndex) / 12;

    const note = Object.keys(pitchs)[noteIndex];
    
    return `${note} ${octave}`;
}

export const getColor = (value: number) => {
    // value 0 - 255
    const colors = ["#e6fffb", "#b5f5ec", "#87e8de", "#5cdbd3", "#36cfc9", "#13c2c2", "#08979c", "#006d75", "#00474f", "#002329"];
    const index = Math.floor(value / 25.5);
    return colors[index];
}