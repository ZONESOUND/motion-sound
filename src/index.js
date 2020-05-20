import 'babel-polyfill';// for async
import $ from 'jquery';
import {grantDeviceOrient, dispatchDevice} from './device';
import {initWebaudio, changeSound} from './sound';

$('#start').click(async function(){
    if (await grantDeviceOrient()) {
        $('#start').hide();
        initWebaudio();

    }
    // if (initWebaudio()) {
    //     console.log('ya');
    // }
});

// $('#test').click(function() {
//     let t = Math.floor(Math.random()*6);
//     changeSound({
//         5 : Math.random()
//     });
// })