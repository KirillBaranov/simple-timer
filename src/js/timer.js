import { Timer } from "./class/Timer";

$( document ).ready( () => {
    const deadline = '2020-05-12T23:09:30';

    const options = {
        hasLabel: true,
        mode: 'dev',
        callback: myCallback
    }

    const timer   = new Timer( '#timer', deadline, options );


    // start timer.
    $( '#start' ).click( () => {
        timer.start();
    });

    // stop timer
    $( '#stop' ).click( () => {
        timer.stop();
    });
});

function myCallback() {
    console.log( 'my callback' );
}