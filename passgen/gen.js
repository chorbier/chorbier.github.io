"use strict";

const copyToClipboard = str => {
	const el = document.createElement('textarea');
	el.value = str;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
};

const arrayToBigInt = (arr) => {
	let bi = 0n;
	for(let i = 0; i<arr.length; i++)
	{
		bi *= 256n;
		bi += BigInt(arr[i]);
	}
	return bi
};

const characters = {
	letters: 'abcdefghijklmnopqrstuvwxyz',
	caps: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	digits: '0123456789',
	shit: '!@#$%&*()/*-+'
}

document.addEventListener('DOMContentLoaded', e => {
	document.getElementById('mainbutton').onclick = e => {
		let host = document.getElementById('host').value;
		let pass = document.getElementById('pass').value;
		console.log(host,pass);

		console.log('start');
		let hash = sha512(`eban${sha512(host)}govna${sha512(host)}`);
		for(let i = 0; i < 1000; i++)
		{
			hash = sha512(`vas${hash}ebali`);
		}
		console.log('end');
		let arr = sha512.digest(hash);
		let bi = arrayToBigInt(arr);
		let lib = characters.letters+characters.caps+characters.digits+(document.getElementById('useshit').checked ? characters.shit : "");
		let ll = BigInt(lib.length);
		let res = []
		while(bi > 0)
		{
			res.push(lib[bi % ll]);
			bi /= ll;
		}
		copyToClipboard(res.join(''));
	};
});