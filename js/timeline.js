$(document).ready( function(){init()} );

let radius1, radius2, typeWriter;

function init(){
    // read svg radius from shape
    radius1 = $($('.lvl1')[0]).attr('r');
    radius2 = $($('.lvl2')[0]).attr('r');
    
    //animate dataPoints with class active
    animateIn($('.dataPoint.active'));

    //event handlers
    $('.dot').hover(displayTitle, hideTitle);
    $('.dot').click(toggleActiveState);
}

// event-handler (mouseenter)
// typewriter in animation of teaser title that's shown when hovering over element
function displayTitle(e) {
    let $parent = $(this).parent(); // parent .dataPoint surrounding element

    if($parent.hasClass('active') ) { return; } // don't run title animation when .dataPoint is active

    let str = $('.description h3', $parent).html() + '...'; // read out title from .description
    let $target = $('.title', $parent); // the target element in which the title will be displayed

    if(typeWriter){ clearInterval( typeWriter.interval ); } // if there's still a typewriter running, stop the interval
    typeWriter = new TypeWriter(str, $target); // create new typeWriter
}

// event-handler (mouseleave)
// fade out animation of teaser title that's shown when hovering over element
function hideTitle(e) {
    let $parent = $(this).parent(); // parent .dataPoint surrounding element
    let $target = $('.title', $parent); // the target element that will be animated out

    if(typeWriter){ clearInterval( typeWriter.interval );} // if there's still a typewriter running, stop the interval

    $target.fadeTo('200', 0, function(){ // fade out item to opacity 0
        // animation completed
        $target.html(""); // clear out the target
        $target.css('opacity', 1); // set opacity back to 1
    });
}

// event-handler (click)
function toggleActiveState(e) {
    let $parent = $(this).parent(); // parent .dataPoint surrounding element

    if($parent.hasClass('active') ) { //if .dataPoint is already active
        animateOut($parent);
    } else {
        animateOut($('.dataPoint.active')); // animate out the previous active .dataPoint
        $(this).trigger('mouseleave'); // animate out the hover animation by triggering mouseout event handler
        $parent.addClass('active'); 
        animateIn($parent);
    }
}

function animateIn($parent) {
    // .circle level 2 animation : trim path from 0% (2*pi*r) to 100% (0)
    $('.lvl2', $parent).delay(0).animate(
        {'stroke-dashoffset': 0},
        { duration: 600,
            easing: 'easeInQuad'}
    );
    //.circle level 1 animation : trim path from 0% (2*pi*r) to 25% (1.5*pi*r)
    $('.lvl1', $parent).delay(0).animate(
        {'stroke-dashoffset': 3 * Math.PI * radius1 / 2},
        {duration: 600,
            easing: 'easeInQuad'}
    );
    //.line animation: max-width from 0% to 100% & opacity from 0 to 1
    $('.line', $parent).delay(400).animate(
        {'max-width': 100 +'%','opacity': 1},
        {duration: 600,
            easing: 'easeInCubic'}
    );

    //.description animation: max-height from 0% to 100% & h3/p opacity from 0 to 1
    $('.description', $parent).delay(800).animate(
        {'max-height': 100 +'%'},
        {duration: 300,
            easing: 'easeInCubic'}
    );
    $('.description h3', $parent).delay(1000).fadeTo('300', 1);
    $('.description p', $parent).delay(1150).fadeTo('300', 1);
}
function animateOut($parent) {
    //.description animation: max-height from 100% to 0% & h3/p opacity from 1 to 0
    $('.description p', $parent).delay(0).fadeTo('50', 0);
    $('.description h3', $parent).delay(50).fadeTo('50', 0);
    $('.description', $parent).delay(50).animate(
        {'max-height': 0 +'%'},
        {duration: 300,
            easing: 'easeOutCubic'}
    );
    //.line animation: max-width from 100% to 0% & opacity from 1 to 0
    $('.line', $parent).delay(350).animate(
        {'max-width': 0 +'%','opacity': 0},
        {duration: 600,
            easing: 'easeOutCubic',
            complete: function(){ $parent.removeClass('active'); }
        }
    );
    //.circle level 1 animation : trim path from 25% (1.5*pi*r)to 0% (2*pi*r)
    $('.lvl1', $parent).delay(650).animate(
        {'stroke-dashoffset': 2 * Math.PI * radius1},
        {duration: 600,
            easing: 'easeOutQuad'}
    );
    // .circle level 2 animation : trim path from 100% (0) to 0% (2*pi*r)
    $('.lvl2', $parent).delay(650).animate(
        {'stroke-dashoffset': 2 * Math.PI * radius2},
        {duration: 600,
            easing: 'easeOutQuad'}
    );
}

class TypeWriter {
    constructor(str, $target) {
        this.str = str;
        this.currentLetter = 0;
        this.$target = $target;
        this.interval = setInterval(typewriter, 20); //call typewriter function every 20ms
    }
}

function typewriter(){
    typeWriter.$target.html( //change html from typewriter
        typeWriter.str.substr(0, typeWriter.currentLetter+1) // the substring from first letter until currentLetter
    );
    if(typeWriter.currentLetter < typeWriter.str.length) { // if the current letter isn't the last letter
        typeWriter.currentLetter++; // go to next letter
    } else {
        clearInterval(typeWriter.interval); // stop calling typewriter function
    }
}