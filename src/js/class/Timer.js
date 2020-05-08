/**
 * Target - DOM node.
 * deadline - deadline date as example 2020-04-24T22:28:00
 * Options - object have fields:
 *  - Has label or no ( minutes, seconds and other ).
 *  How to use => options.hasLabel ( Boolean ).
 *
 *  - Callback method will called when timer will ended.
 *  How to use => options.callback ( Function ).
 *
 *  - mode: dev or build. In dev mode you can see timer in window._TIMERS
 *  How to use => options.mode ( Build or dev ).
 *  Todo: make choose locale for label.
 */

export class Timer {
    constructor( target, deadline, options = [] )
    {
        if ( options ) {
            this.options = options;
        }

        // DOM target.
        this.e = $( target );
        this.daysContainer    = this.e.find( '.timer__days-container' );
        this.hoursContainer   = this.e.find( '.timer__hours-container' );
        this.minutesContainer = this.e.find( '.timer__minutes-container' );
        this.secondsContainer = this.e.find( '.timer__seconds-container' );

        // timer labels
        if ( this.options.hasLabel || this.options.hasLabel === undefined ) {
            this.hasLabel = true;

            // DOM target label
            this.daysLabelContainer    = this.e.find( '.timer__days-label-container' );
            this.hoursLabelContainer   = this.e.find( '.timer__hours-label-container' );
            this.minutesLabelContainer = this.e.find( '.timer__minutes-label-container' );
            this.secondsLabelContainer = this.e.find( '.timer__seconds-label-container' );
        }

        // set deadline time.
        this.deadline         = new Date( deadline );

        // helper const
        this.helper = {
            secondsInDay: 24 * 60 * 60,
            secondsInHour: 60 * 60,
            secondsInMinute: 60
        };

        // init timer.
        this.tick();
    }

    tick()
    {
        this.interval = setInterval( () => {
            this.findDifference( this.deadline );

            // update timer label if this option is choose
            if ( this.hasLabel ) {
                this.updateTimerLabel();
            }

            // if mode dev you can see all info about timer here - window._TIMERS.
            if ( this.options.mode === 'dev' ) {
                this.devModeUpdate();
            }
        }, 1000 );
    }

    findDifference( deadline )
    {
        const now      = new Date();

        const secondsInNow = now.getDate() * this.helper.secondsInDay +
            now.getHours() * this.helper.secondsInHour +
            now.getMinutes() * this.helper.secondsInMinute +
            now.getSeconds();

        const secondsInDeadline = deadline.getDate() * this.helper.secondsInDay +
            deadline.getHours() * this.helper.secondsInHour +
            deadline.getMinutes() * this.helper.secondsInMinute +
            deadline.getSeconds();

        const difference = secondsInDeadline - secondsInNow;

        if ( difference > 0 ) {
            this.findTimerTime( difference );
        }

        else {
            // set ended callback
            if ( this.options.callback ) {
                this.timeIsEnded( this.options.callback );
            }

            else {
                this.timeIsEnded();
            }
        }

    }

    findTimerTime( difference )
    {
        const days = Math.floor( difference / this.helper.secondsInDay );
        const countSecondsInDay = days * this.helper.secondsInDay; // Кол-во секунд в оставшихся днях.

        const hours = Math.floor( ( difference - countSecondsInDay ) / this.helper.secondsInHour );
        const countSecondsInHours = hours * this.helper.secondsInHour; // Кол-во секунд в оставшихся часах.

        const minutes = Math.floor( ( difference - ( countSecondsInDay + countSecondsInHours ) ) / this.helper.secondsInMinute );
        const countSecondsInMinutes = minutes * this.helper.secondsInMinute; // Кол-во секунд в оставшихся минутах.

        const seconds = Math.floor( difference - ( countSecondsInDay + countSecondsInHours + countSecondsInMinutes ) );

        // Timer API
        this.timeToDeadline = {
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };

        this.updateTimerDate( {
            days: days < 10 ? '0' + days : days,
            hours: hours < 10 ? '0' + hours : hours,
            minutes: minutes < 10 ? '0' + minutes : minutes,
            seconds: seconds < 10 ? '0' + seconds : seconds
        });
    }

    setCorrectLabelText() {
        const days         = this.timeToDeadline.days;
        const daysLabel    = (days === 1 || (days > 19 && days % 10 === 1)) ? 'день' :
                             ((days > 1 && days < 5) || (days > 19 && days % 10 > 1 && days % 10 < 5)) ? 'дня' : 'дней';

        const hours        = this.timeToDeadline.hours;
        const hoursLabel   = (hours === 1 || (hours > 19 && hours % 10 === 1)) ? 'час' :
                             ((hours > 1 && hours < 5) || (hours > 19 && hours % 10 > 1 && hours % 10 < 5)) ? 'часа' : 'часов';

        const minutes      = this.timeToDeadline.minutes;
        const minutesLabel = ( minutes === 1 || minutes % 10 === 1 ) ? 'минута' :
                             ( minutes % 10 === 0 || ( minutes % 10 >= 5 && minutes % 10 <= 9 ) )  ? 'минут' : 'минуты';

        const seconds      = this.timeToDeadline.seconds;
        const secondsLabel = ( seconds === 1 || seconds % 10 === 1 ) ? 'секунда' :
                             ( seconds % 10 === 0 || ( seconds % 10 >= 5 && seconds % 10 <= 9 ) ) ? 'секунд' : 'секунды';

        this.labels = {
            daysLabel,
            hoursLabel,
            minutesLabel,
            secondsLabel
        }

        return this.labels;
    }

    updateTimerLabel()
    {
        const label = this.setCorrectLabelText();

        $( this.daysLabelContainer ).text( label.daysLabel );
        $( this.hoursLabelContainer ).text( label.hoursLabel );
        $( this.minutesLabelContainer ).text( label.minutesLabel );
        $( this.secondsLabelContainer ).text( label.secondsLabel );
    }

    updateTimerDate( time )
    {
        $( this.daysContainer ).text( time.days );
        $( this.hoursContainer ).text( time.hours );
        $( this.minutesContainer ).text( time.minutes );
        $( this.secondsContainer ).text( time.seconds );
    }

    devModeUpdate()
    {
        const _self = this;

        // if _TIMES not empty
        if ( window._TIMERS ) {

            // if hasn't match => push new item.
            const hasMatch = window._TIMERS.find( item => {
                return item === _self;
            });

            if ( !hasMatch ) {
                window._TIMERS.push( _self );
            }
        }

        // create and push first item.
        else {
            window._TIMERS = [];
            window._TIMERS.push( this );
        }
    }

    // API Methods for timer

    // set new deadline.
    updateTimerDeadline( deadline )
    {
        this.deadline = deadline;
    }

    // set callback when time will ended
    timeIsEnded( callback = function() {} )
    {
        // clear interval | stop timer.
        clearInterval( this.interval );

        try {
            callback();
        }

        catch (e) {
            throw new Error( `Invalid callback method for ${ this.e }` );
        }
    }

    stop()
    {
        clearInterval( this.interval );
    }

    start()
    {
        this.tick();
    }
}