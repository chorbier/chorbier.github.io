var yth = {
	player: null,
	openVideo: function(videoID)
	{
		if(!yth.player)
		{
			var player = yth.player = new YT.Player('ytpl',{
				videoId: videoID,
				events:
				{
					'onReady': yth.hooks.onReady,
				}
        	});
        	var frame = player.getIframe();
        	frame.removeAttribute('width');
        	frame.removeAttribute('height');
        	frame.style="width:100%; height:100%; position:absolute;";
		}
		else
		{
			yth.player.playVideo(videoID);
		}
	},
	parseUrl: function(url)
	{
		var match = url.match(/(?:\?v=|youtu\.be\/)([\w\d_-]+)/);
		return match[1];
	},
	play: function(url)
	{
		yth.openVideo(yth.parseUrl(url));
	},
	hooks: {
		onReady: function(event)
		{

		},
	}
};
let pc = null;
let dataChannel;
let receiveChannel;
let remoteData = {ice:[]};
let remoteDataShow = function()
{
	$('.lDesc')[0].innerText = JSON.stringify(remoteData);
}
function loadRtc()
{
	var pc_config = {"iceServers": [
		{url:'stun.ipshka.com'},
		{url:'stun:stun01.sipphone.com'},
		{url:'stun:stun.ekiga.net'},
		{url:'stun:stun.fwdnet.net'},
		{url:'stun:stun.ideasip.com'},
		{url:'stun:stun.iptel.org'},
		{url:'stun:stun.rixtelecom.se'},
		{url:'stun:stun.schlund.de'},
		{url:'stun:stun.l.google.com:19302'},
		{url:'stun:stun1.l.google.com:19302'},
		{url:'stun:stun2.l.google.com:19302'},
		{url:'stun:stun3.l.google.com:19302'},
		{url:'stun:stun4.l.google.com:19302'},
		{url:'stun:stunserver.org'},
		{url:'stun:stun.softjoys.com'},
		{url:'stun:stun.voiparound.com'},
		{url:'stun:stun.voipbuster.com'},
		{url:'stun:stun.voipstunt.com'},
		{url:'stun:stun.voxgratia.org'},
		{url:'stun:stun.xten.com'},
		{url:'sip1.lakedestiny.cordiaip.com'},
		{url:'stun1.voiceeclipse.net'},
		{url:'stun.callwithus.com'},
		{url:'stun.counterpath.net'},
		{url:'stun.ekiga.net'},
		{url:'stun.ideasip.com'},
		{url:'stun.internetcalls.com'},
		{url:'stun.noc.ams-ix.net'},
		{url:'stun.phoneserve.com'},
		{url:'stun.softjoys.com'},
		{url:'stun.sipgate.net'},
		{url:'stun.sipgate.net:10000'},
		{url:'stun.stunprotocol.org'},
		{url:'stun.voip.aebc.com'}]};
			let onMessageReceive = e =>
	{
		console.log(`message received: ${e.data}`);
	};
	pc = new RTCPeerConnection(pc_config);
	dataChannel = pc.createDataChannel('dataChannel');
	dataChannel.onopen = () =>
	{
		console.log(`dataChannel state is ${dataChannel.readyState}`);
	};
	dataChannel.onclose = dataChannel.onopen;
	dataChannel.onmessage = onMessageReceive;
	pc.onicecandidate = e => 
	{
		//pc.addIceCandidate(e.candidate);
		remoteData.ice.push(event.candidate);
		remoteDataShow();
		console.log(`candidate: ${JSON.stringify(event.candidate)}`);
	};
	pc.ondatachannel = e =>
	{
		console.log('receive channel callback');
		receiveChannel = e.channel;
		receiveChannel.onmessage = onMessageReceive;
	};
	console.log('gruzitsa');
}
$(document).ready(function($) {
	loadRtc();
	$('button.createOffer').click(function(event) {
		pc.createOffer().then(
			desc => 
			{
				//$('.lDesc')[0].innerText = JSON.stringify(desc);
				remoteData.description = desc;
				remoteDataShow();
				pc.setLocalDescription(desc);
			},
			err => console.log(`chot obosralos ${err}`));
	});

	$('button.answer').click(function(event) {
		let data = JSON.parse($('input#rDesc')[0].value);
		pc.setRemoteDescription(data.description);
		pc.createAnswer().then(
			desc =>
			{
				pc.setLocalDescription(desc)
				remoteData.description = desc;
				remoteDataShow();
				data.ice.forEach(ice => {if(ice)pc.addIceCandidate(ice)});
			},
			err => console.log(`chot obosralos ${err}`));
	});

	$('button.getAnswer').click(function(event) {
		let data = JSON.parse($('input#rDesc')[0].value);
		pc.setRemoteDescription(data.description);
		data.ice.forEach(ice => pc.addIceCandidate(ice));
	});
});
