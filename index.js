const device = new Twilio.Device;
var request = new XMLHttpRequest();

var connectObj = null;

// 接続ボタン押下
function connect() {
    var identity = document.getElementById('identity').value;
    // Twilioセットアップ
    request.open('GET', 'https://your-domain/token?identity=' + identity, true);

    request.onload = function () {
        var data = JSON.parse(this.response);
        var option = {
            edge: 'tokyo'
        }
        device.setup(data.token, option);
        updateMessageByElement('display-name', data.identity);

        device.on('ready', function (device) {
            showReadyDiaplay();
            updateMessageByElement('status', 'Twilio.Device Ready!');
        });

        device.on('error', function (error) {
            showDefaultDiaplay();
            updateMessageByElement('status', 'Twilio.Device Error: ' + error.message);
        });

        device.on('connect', function (conn) {
            showOutgoingDisplay();
            updateMessageByElement('status', 'Successfully established call!');
        });

        device.on('disconnect', function (conn) {
            showReadyDiaplay();
            updateMessageByElement('status', 'Call ended.');
        });

        device.on('incoming', function (conn) {
            updateMessageByElement('status', 'Incoming connection from ' + conn.parameters.From);
            connectObj = conn;
            showIncommingDiaplay();
        });

    };
    request.send();
}

// 発信ボタン押下
function makeCall() {
    var params = {
        To: document.getElementById('phone-number').value,
        From: document.getElementById('display-name').textContent
    };

    if (device) {
        updateMessageByElement('status','Calling ' + params.To + '...');
        showOutgoingDisplay();
        var outgoingConnection = device.connect(params);
        outgoingConnection.on('ringing', function () {
            console.log('Ringing...');
        });
    }
}

// 接続ボタン押下
function hangup() {
    updateMessageByElement('status','Hanging up...');
    if (device) {
        device.disconnectAll();
    }
}

// 拒否ボタン押下
function reject() {
    if (connectObj != null) {
        connectObj.reject();
        showReadyDiaplay();
    }
}

// 接続ボタン押下
function accept() {
    if (connectObj != null) {
        connectObj.accept();
        showOutgoingDisplay();
    }
}

// 画面更新用メソッド
function updateMessageByElement(elementId, message) {
    document.getElementById(elementId).innerHTML = message;
}

function showReadyDiaplay() {
    updateShowOrHideByElement('identity', 'hide');
    updateShowOrHideByElement('connect', 'hide');
    updateShowOrHideByElement('display-name', 'show');
    updateShowOrHideByElement('outgoing', 'show');
    updateShowOrHideByElement('phone-number', 'show');
    updateShowOrHideByElement('hangup', 'hide');
    updateShowOrHideByElement('reject', 'hide');
    updateShowOrHideByElement('accept', 'hide');
}

function showDefaultDiaplay() {
    updateShowOrHideByElement('identity', 'show');
    updateShowOrHideByElement('connect', 'show');
    updateShowOrHideByElement('display-name', 'hide');
    updateShowOrHideByElement('outgoing', 'hide');
    updateShowOrHideByElement('phone-number', 'hide');
    updateShowOrHideByElement('hangup', 'hide');
    updateShowOrHideByElement('reject', 'hide');
    updateShowOrHideByElement('accept', 'hide');
}

function showOutgoingDisplay() {
    updateShowOrHideByElement('identity', 'hide');
    updateShowOrHideByElement('display-name', 'show');
    updateShowOrHideByElement('connect', 'hide');
    updateShowOrHideByElement('outgoing', 'hide');
    updateShowOrHideByElement('phone-number', 'show');
    updateShowOrHideByElement('hangup', 'show');
    updateShowOrHideByElement('reject', 'hide');
    updateShowOrHideByElement('accept', 'hide');
}

function showIncommingDiaplay() {
    updateShowOrHideByElement('identity', 'hide');
    updateShowOrHideByElement('display-name', 'show');
    updateShowOrHideByElement('connect', 'hide');
    updateShowOrHideByElement('outgoing', 'hide');
    updateShowOrHideByElement('phone-number', 'show');
    updateShowOrHideByElement('hangup', 'hide');
    updateShowOrHideByElement('reject', 'show');
    updateShowOrHideByElement('accept', 'show');
}

function updateShowOrHideByElement(elementId, displayStatus) {
    if (displayStatus == 'show') {
        document.getElementById(elementId).style.display = "block";
    } else {
        document.getElementById(elementId).style.display = "none";
    }
}