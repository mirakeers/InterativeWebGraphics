$(document).ready( function(){init()} );

function init(){
    //move the transform origin of all paths to the path center
    $('.st0').each(function(){ setTranformOrigin($(this)) });

    //add data_color attributes to provinces
    initColorAttributes();

    //event handlers
    $('.st0').hover(addHoverState, removeHoverState);
    $('ul.description li').hover(addHoverState, removeHoverState);
    $('.st0').click(addActiveState);
    $('ul.description li').click(addActiveState);
}

function initColorAttributes() {
    let colors = ['blue', 'red', 'yellow', 'purple', 'aqua'];
    $('ul.description li').each(function(i){ // for each province

        let id = $(this).attr('data_province'); //selected province id
        let subselector = '[data_province="' + id + '"]';

        $(this).attr('data_color', colors[i % colors.length]);
        $('.st0' + subselector).attr('data_color', colors[i % colors.length]);
    });
}

function addActiveState(e) {
    let id = $(this).attr('data_province'); //selected province id
    let subselector = '[data_province="' + id + '"]';

    // if current item already is active, don't do anything
    if(hasClass($('.st0' + subselector), 'active')) { return; }

    //add active class to svg path
    $('.st0.active').attr('class', 'st0'); // remove from previous active svg path
    $('.st0' + subselector).attr('class', 'st0 hover active'); // add to current svg path

    //add active class to description
    $('ul.description li').removeClass('active'); //remove from all listitems
    $('ul.description li' + subselector).addClass('active'); // add to current listitem

    //fill in description box
    $('#description_box p').html($($('ul.description li.active p')[0]).html());
    $('#description_box h2').html($($('ul.description li.active h2')[0]).html());

    //animate description box transparency
    $('#description_box h2, #description_box p').css('opacity', 0);
    $('#description_box h2').fadeTo( '600', 1);
    $('#description_box p').delay(250).fadeTo( '400', 1);
}
function addHoverState(e) {
    let id = $(this).attr('data_province'); //current province id
    let subselector = '[data_province="' + id + '"]';

    // animate province scale
    let scale = subselector.includes("vienna") ? 1.25 : 1.035; // bigger scale for small province vienna
    $('.st0' + subselector).appendTo('#austria-map'); // move path to bottom of svg so province is shown in front
    $('.st0' + subselector).focus().css('transform', 'scale(' + scale + ')'); // scale province

    //add hover class to svg path
    let classString = hasClass($('.st0' + subselector), 'active') ? 'st0 hover active':'st0 hover';
    $('.st0' + subselector).focus().attr('class', classString);

    //add hover class to description
    $('ul.description li' + subselector).addClass('hover');
}


function removeHoverState(e) {
    let id = $(this).attr('data_province'); //current province id
    let subselector = '[data_province="' + id + '"]';

    //remove hover class from svg path
    let classString = hasClass($('.st0' + subselector), 'active') ? 'st0 active':'st0';
    $('.st0' + subselector).attr('class', classString);

    //remove hover class from description
    $('ul.description li' + subselector).removeClass('hover');

    //reverse province scale animation
    $('.st0' + subselector).css("transform", "scale(1)");
}


//Helper Functions

// Get center of bounding box surrounding a svg path
// returns object
function getPathCenter(jQuerySvgPathElement) {
    var bbox =jQuerySvgPathElement[0].getBBox();
    var centerX = bbox.x + bbox.width/2;
    var centerY = bbox.y + bbox.height/2;
    return {x: centerX, y: centerY}
}

//sets css transform-origin to path center from a SVG Path
function setTranformOrigin(jQuerySvgPathElement){
    let center = getPathCenter(jQuerySvgPathElement);
    jQuerySvgPathElement.css("transform-origin", center.x + 'px ' + center.y + 'px')
}

// Check if svg child has a certain class
// returns boolean
function hasClass(jQuerySvgPathElement, className) {
    return jQuerySvgPathElement.attr('class').includes(className);
}