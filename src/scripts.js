const remote = require('electron').remote;
const {ipcRenderer, BrowserWindow} = require('electron');
var randomWords = require('random-words');

var listener = false;
var timer1;
var timer2;
var timer3;


function closeApp(){
    var window = remote.getCurrentWindow();
    window.close();
}
function fullscreen(){
    var window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
        window.maximize();          
    } else {
        window.unmaximize();
    }
}
function open_searches(){
    w3_close();
    stopSearches();
    if($('#timer').length){
        $('#timer').remove();
    }
    if($('.info').length){
        $(".info").remove();
    }
    $("#wrapper").prepend('<div class="info"><div class="info_inside"><div id="userinput"><h1>Set your level and press start!</h1><input value="" id="level" class="w3-input w3-border w3-round" type="number" min="1" max="2" placeholder="Level"/><button onclick="liveLogin()" id="startBtn" class="w3-button w3-white w3-border w3-border-blue w3-round-large">Start</button></div><div id="status"></div></div></div>');
    window.webview.loadURL('https://login.live.com/');
}
function open_quizzes(){
    w3_close();
    stopSearches();
    if($('#timer').length){
        $('#timer').remove();
    }
    if($('.info').length){
        $(".info").remove();
    }
    additional();
}
function open_about(){
    w3_close();
    stopSearches();
    if($('#timer').length){
        $('#timer').remove();
    }
    if($('.info')){
        $(".info").remove();
    }
    window.webview.loadURL(__dirname+'/about.html');
}
function open_settings(){
    w3_close();
    stopSearches();
    if($('#timer').length){
        $('#timer').remove();
    }
    if($('.info').length){
        $(".info").remove();
    }
    window.webview.loadURL(__dirname+'/settings.html');

    window.webview.addEventListener('ipc-message', (event) => {
        if(event.channel == "clear"){
            var remote = require('electron').remote; 
            var win = remote.getCurrentWindow();
            win.webContents.session.clearStorageData([], (data) => {});
        }
    });
}
function minimize(){
    var window = remote.getCurrentWindow();
    window.minimize();
}
function liveLogin(){
    $("#startBtn").remove();
    var count = 0;
    var num;
    var mobilenum;
    var isDesktop = true;
    if($('#level').val() == "1"){
        num = 14;
        mobilenum = 11;
    }else{
        num = 34;
        mobilenum = 21;
    }
    $('#level').remove();
    $('#userinput').append('<button onclick="stopSearches()" id="stopBtn" class="w3-button w3-white w3-border w3-border-blue w3-round-large">Stop</button>');
    words = randomWords(num + mobilenum);
    var x = 0;
    timer1 = setInterval(function(){
            $('#status').html("Word: " + words[x] + ", Number: " + (x + 1));
            window.webview.loadURL("http://www.bing.com/search?q="+words[x]);
            x++;
            if(x == num){
                clearInterval(timer1);
                timer2 = setInterval(function(){
                    window.webview.setUserAgent("Mozilla/5.0 (Linux; <Android Version>; <Build Tag etc.>) AppleWebKit/<WebKit Rev> (KHTML, like Gecko) Chrome/<Chrome Rev> Mobile Safari/<WebKit Rev>");        
                    $('#status').html("Word: " + words[x] + ", Number: " + (x + 1));
                    window.webview.loadURL("http://www.bing.com/search?q="+words[x]);
                    x++;
                    if(x == words.length){
                        clearInterval(timer2);
                        stopSearches();
                    }
                }, 3000);
            }
    }, 3000);
}
function additional(){
    clearInterval(timer3);
    if($('.info').length){
        $(".info").remove();
    }
    window.webview.getWebContents().on('did-finish-load', infoAddQuiz);
    window.webview.loadURL("https://account.microsoft.com/rewards/");
}
const infoAddQuiz = () => {
    if($('.info').length){
    }else{
        $("#wrapper").prepend('<div class="info"><div class="info_inside"><div id="userinput"><button onclick="startQuizzes()" id="startBtn" class="w3-button w3-white w3-border w3-border-blue w3-round-large">Start</button></div><div id="status"></div></div></div>');
    }
    window.webview.addEventListener('ipc-message', (event)=>{
        if((event.channel == "finsihedPoll" || event.channel == "finsihedQuiz") && $('#status').html() != "<h1>Daily set is complete!</h1>"){
            window.webview.loadURL("https://account.microsoft.com/rewards/");
            startQuizzes();
        }else{
            window.webview.loadURL("https://account.microsoft.com/rewards/");
        }
    });
    window.webview.removeEventListener('did-finish-load', infoAddQuiz);
    
}
function startQuizzes(){
    window.webview.executeJavaScript("clickURLForDailySet()");
    var {url} = [];
    window.webview.addEventListener('ipc-message', (event) => {
        if(event.channel == "clicked"){
            console.log(event.args);
            for(var p = 0; p < event.args.length; p++){
                if(event.args[0][2] == true && event.args[1][2] == true && event.args[2][2] == true){
                    $('#status').html("<h1>Daily set is complete!</h1>");
                }else if((event.args[p][1].indexOf('POLL') != -1 || event.args[p][1].indexOf('Poll') != -1 || event.args[p][1].indexOf('poll') != -1) && event.args[p][2] == false){
                    window.webview.executeJavaScript("clickPoll("+event.args[p][0]+")");
                    window.webview.loadURL(event.args[p][1]);
                    window.webview.addEventListener('did-finish-load', loadPoll);
                }else if((event.args[p][1].indexOf('quiz') != -1 || event.args[p][1].indexOf('Quiz') != -1 || event.args[p][1].indexOf('QUIZ') != -1) && event.args[p][2] == false){
                    window.webview.executeJavaScript("clickQuiz("+event.args[p][0]+")");
                    window.webview.loadURL(event.args[p][1]);
                    window.webview.addEventListener('did-finish-load', loadPoll);
                }else if(event.args[p][1].indexOf('https://www.bing.com/search?q=') != -1 && event.args[p][2] == false){
                    window.webview.executeJavaScript("clickSearch("+event.args[p][0]+")");
                }
            }
        }
    });
}
function loadPoll(item){
    window.webview.executeJavaScript("solvePoll()");
    window.webview.removeEventListener('did-finish-load', loadPoll);
}
function loadQuiz(item){
    window.webview.executeJavaScript("solveQuiz()");
    window.webview.removeEventListener('did-finish-load', loadQuiz);
}
function stopSearches(){
    clearInterval(timer1);
    clearInterval(timer2);
    clearInterval(timer3);
    window.webview.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393");
    window.webview.loadURL("https://login.live.com");
    $("#stopBtn").remove();
    $('#userinput').html('<h1>Set your level and press start!</h1><input value="" id="level" class="w3-input w3-border w3-round" type="number" min="1" max="2" placeholder="Level"/><button onclick="liveLogin()" id="startBtn" class="w3-button w3-white w3-border w3-border-blue w3-round-large">Start</button>');
    $('#status').html("");
}