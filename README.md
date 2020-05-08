# simple-timer

It's a simple Timer for your site.
Include jquery before using this timer.

<h3>How to connect src files to your project:</h3>

- Download or git clone files in your project folder
- import / include Timer ( From class folder )

<h3>How to use?</h3>

```JavaScript

// Import class
import { Timer } from './timerClass';

const options = {
  hasLabel: true, // Has label ( minutes, days and other )
  callback: yourCallbackFunction, // Your callback function when timer will finish.
  mode: 'dev' // If you - developer set mode as dev. Now you can see all data about Timer here: window._TIMERS
}

// Create deadline for timer.
const deadline = new Data( yourdate );

// Create timer const.
const timer = new Timer( $( '#timer' ), deadline, options );

```

<h3>About structure and required class. It's IMPORTANT!</h3>


<h4>Plugin is not required  all this numbers. You can use only hours and minutes or days and seconds. It's your choose.</h4>

- timer__days-container ( Only for days where you wanna see days );
- timer__hours-container
- timer__minutes-container
- timer__seconds-container

<p>Only if in options hasLabel = true. By default hasLabel = true.</p>
- timer__days-label-container
- timer__hours-label-container
- timer__minutes-label-container
- timer__seconds-label-container

<h3>How you can stop / start timer?</h3>

- yourTimer.stop() - stop timer
- yourTimer.start() - start timer
 
