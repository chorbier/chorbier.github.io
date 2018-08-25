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
			{url:'stun:stun.ekiga.net'},
			{url:'stun:stun.ideasip.com'},
			{url:'stun:stun.rixtelecom.se'},
			{url:'stun:stun.schlund.de'},
			{url:'stun:stun.l.google.com:19302'},
			{url:'stun:stun1.l.google.com:19302'},
			{url:'stun:stun2.l.google.com:19302'},
			{url:'stun:stun3.l.google.com:19302'},
			{url:'stun:stun4.l.google.com:19302'},
			{url:'stun:stun.voiparound.com'},
			{url:'stun:stun.voipbuster.com'},
			{url:'stun:stun.voipstunt.com'},		
			{url:'stun:stun.voxgratia.org'},		
			{url:'stun:stun.xten.com'},	
			{url:'stun:sip1.lakedestiny.cordiaip.com'},
			{url:'stun:stun.callwithus.com'},	
			{url:'stun:stun.counterpath.net'},		
			{url:'stun:stun.ekiga.net'},	
			{url:'stun:stun.ideasip.com'},	
			{url:'stun:stun.internetcalls.com'},
			{url:'stun:stun.sipgate.net'},
			{url:'stun:stun.sipgate.net:10000'},
			{url:'stun:stun.voip.aebc.com'},
			{
				url:"turn:13.250.13.83:3478?transport=udp",
				username: "YzYNCouZM1mhqhmseWk6",
				credential: "YzYNCouZM1mhqhmseWk6"
			},
			{
				url: 'turn:numb.viagenie.ca',
				username: 'sti49045@nbzmr.com',
				credential: 'dDgShSxsDddfFSsdfIHsFEQ'
			},
			{
				url: 'turn:numb.viagenie.ca',
				credential: 'muazkh',
				username: 'webrtc@live.com'
			},
			{
				url: 'turn:turn.bistri.com:80',
				credential: 'homeo',
				username: 'homeo'
			}
		]};
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
		if(!e)
			return;
		//pc.addIceCandidate(e.candidate);
		remoteData.ice.push(e.candidate);
		remoteDataShow();
		console.log(`candidate: ${JSON.stringify(e.candidate)}`);
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
