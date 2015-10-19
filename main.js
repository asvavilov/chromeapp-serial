window.addEventListener('load', function(){
	var cnt = 3;
	var connectionId;
	var log = document.getElementById('log');
	log.value += 'start\n';
	chrome.serial.connect('COM4', {bitrate: 9600}, function(info) {
		connectionId = info.connectionId;
		log.value += ('Connection opened with id: ' + connectionId + ', Bitrate: ' + info.bitrate + '\n');
	});
	chrome.serial.onReceive.addListener(function (info){
		var ab = info.data;
		log.value += (ab.byteLength)+' - byteLength\n';
		var dv = new DataView(ab);
		for (var i = 0; i < ab.byteLength; i++) {
			var ch = dv.getInt8(i);
			log.value += String.fromCharCode(ch) + '('+ch+')' + ',';
		}
		log.value += '\n';
		cnt--;
		if (cnt <= 0) {
			chrome.serial.disconnect(connectionId, function(result) {
				log.value += ('Connection with id: ' + connectionId + ' closed\n');
			});
		}
	});
});
