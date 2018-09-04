const { ipcRenderer } = require('electron');
var checkDailySet = true;
global.clickURLForDailySet = () =>{
    if(checkDailySet){
        var link1 = $('#daily-sets').find('a.ng-scope').get(0);
        var tCom1 = $('#daily-sets').find('mee-rewards-points.ng-isolate-scope').find('span.mee-icon')[0];
        var is1Com = $(tCom1).hasClass('mee-icon-SkypeCircleCheck');
        var tCom2 = $('#daily-sets').find('mee-rewards-points.ng-isolate-scope').find('span.mee-icon')[1];
        var is2Com = $(tCom2).hasClass('mee-icon-SkypeCircleCheck');
        var tCom3 = $('#daily-sets').find('mee-rewards-points.ng-isolate-scope').find('span.mee-icon')[2];
        var is3Com = $(tCom3).hasClass('mee-icon-SkypeCircleCheck');
        var link2 = $('#daily-sets').find('a.ng-scope').get(1); 
        var link3 = $('#daily-sets').find('a.ng-scope').get(2);
        ipcRenderer.sendToHost('clicked', [0, $(link1).attr('href'), is1Com],[1,$(link2).attr('href'), is2Com],[2,$(link3).attr('href'), is3Com]);
        checkDailySet = false;
    }
}
global.resetStorage = () =>{
    ipcRenderer.sendToHost('clear');
}
global.openDevTools = () =>{
    ipcRenderer.send('devtools', true);
}
global.clickPoll = function(x) {
    if (document.readyState === "complete") {
        console.log($('#daily-sets').find('a.ng-scope').get(x));
        var item = $('#daily-sets').find('a.ng-scope').get(x);
        simulate(item, 'click');
    }
}
global.clickQuiz = function(x) {
    if (document.readyState === "complete") {
        console.log($('#daily-sets').find('a.ng-scope').get(x));
        var item = $('#daily-sets').find('a.ng-scope').get(x);
        simulate(item, 'click');
    }
}
global.clickSearch = function(x) {
    if (document.readyState === "complete") {
        console.log($('#daily-sets').find('a.ng-scope').get(x));
        var item = $('#daily-sets').find('a.ng-scope').get(x);
        simulate(item, 'click');
    }
}
global.solvePoll = () =>{
    if (document.readyState === "complete") {
        var choosePollOption = setTimeout(function(){
            document.getElementById('OptionPollData00').click();
            var delayRedirect = setTimeout(function(){
                ipcRenderer.sendToHost('finishedPoll', true);
                clearTimeout(delayRedirect);
            }, 1000);
            clearTimeout(choosePollOption);
        }, 5000);
    }
}
global.solveQuiz = () =>{
    if (document.readyState === "complete") {
        if(document.getElementsByClassName('wk_paddingBtm')[0]){
            var i = 0;
            var chooseOption = setTimeout(function(){
                eval(document.getElementsByClassName('wk_paddingBtm')[0].getAttribute('onmouseup'));
                i++;
                if(i < 11){
                    var nextQuestion = setTimeout(function(){
                        document.getElementById('check').click()
                        clearTimeout(nextQuestion);
                    }, 500);
                    i++;
                }else{
                    ipcRenderer.sendToHost('finsihedQuiz', true);
                    clearTimeout(chooseOption);
                }
            }, 500);
        }
    }
}
function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}