let context;
let oscillator, freqosc, filterosc;
let gain, freqgain, filtergain;
let filter;

var mapV = {
    OSC_DETUNE: 0, 
    FREQ_OSC: 1,
    FREQ_GAIN: 2, 
    FILTER_OSC: 3,
    FILTER_GAIN: 4,
    GAIN: 5
}

function initWebaudio() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
        console.log(e);
        return false;
    }
    initSound();
    return true;
}

function initSound() {
    //main oscillator
    oscillator = newOsc('sine', 440);
    //oscillator.detune.value = ; // changed by oscdetv(6)
    //oscillator.connect(audioCtx.destination);
    oscillator.start();

    //main gain
    gain = newGain(1, context.destination); // changed by gainv(1)

    //frequency oscillator;
    freqosc = newOsc('sine', 0); // changed by freqoscv(2)
    //linearRampToValueAtTime
    freqosc.start();
    
    //freqeuncy gain;
    freqgain = newGain(100); // changed by freqgainv(3)

    //filter
    filter = newFilter(500);
    filter.detune.value = 300;

    //filter lfo
    filterosc = newOsc('sine', 1); //changed by filteroscv(4)
    filterosc.start();

    //filter gain;
    filtergain = newGain(200); // changed by filtergainv(5)

    //connect
    freqosc.connect(freqgain);
    freqgain.connect(oscillator.frequency);
    oscillator.connect(filter);
    filterosc.connect(filtergain);
    filtergain.connect(filter.frequency);
    filter.connect(gain);

}

function changeSound(config) {
    console.log(config);
    let current = context.currentTime;
    let v;
    if (mapV.OSC_DETUNE in config) {
        //TODO: mapping 0~1
        v = scalingValue([0,1], [-300, 400], config[mapV.OSC_DETUNE]);
        setValue(oscillator.detune, v, current);
        //setValueAtTime(config[mapV.OSC_DETUNE], current);
    } 
    if (mapV.FREQ_OSC in config) {
        v = scalingValue([0,1], [0, 400], config[mapV.FREQ_OSC]);
        setValue(freqosc.frequency, v, current);  
        //freqosc.frequency.setValueAtTime(config[mapV.FREQ_OSC], current);
    }
    if (mapV.FREQ_GAIN in config) {
        v = scalingValue([0,1], [0, 200], config[mapV.FREQ_GAIN]);
        setValue(freqgain.gain, v, current);  
        //freqgain.gain.setValueAtTime(config[mapV.FREQ_GAIN], current);
    }
    if (mapV.FILTER_OSC in config) {
        v = scalingValue([0,1], [0, 5], config[mapV.FILTER_OSC]);
        setValue(filterosc.frequency, v, current);  
        //freqgain.gain.setValueAtTime(config[mapV.FREQ_GAIN], current);
    }
    if (mapV.FILTER_GAIN in config) {
        v = scalingValue([0,1], [100, 400], config[mapV.FILTER_GAIN]);
        setValue(filtergain.gain, v, current);  
        //freqgain.gain.setValueAtTime(config[mapV.FREQ_GAIN], current);
    }
    if (mapV.GAIN in config) {
        //v = scalingValue([0,1], [0, ], config[mapV.GAIN]);
        setValue(gain.gain, config[mapV.GAIN], current);  
        //freqgain.gain.setValueAtTime(config[mapV.FREQ_GAIN], current);
    }

}

function scalingValue(fromRange, toRange, value) {
    return (value - fromRange[0])*(toRange[1]-toRange[0])/(fromRange[1]-fromRange[0])+ toRange[0];
}

function setValue(obj, value, time) {
    obj.setValueAtTime(value, time);
}

function newFilter(frequency) {
    let f = context.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(frequency, context.currentTime);
    return f;
}

function newOsc(type, frequency, dest=null) {
    let o = context.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(frequency, context.currentTime);
    if (dest) o.connect(dest);
    return o;
}

function newGain(value, dest=null) {
    let g = context.createGain();
    g.gain.value = value;
    if (dest) g.connect(dest);
    return g;
}

function newConstant(offset, dest=null) {
    let c = context.createConstantSource();
    c.offset = offset;
    if (dest) c.connect(dest);
    return c;
}



export {initWebaudio, changeSound};