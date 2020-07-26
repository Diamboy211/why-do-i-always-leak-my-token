const Discord = require('discord.js');
var Decimal = require('./break_eternity.min.js')
var num = 0
let a = 0
let helpText = `
!count: count in ordinal notation. Usage: !count
!nto: converts bigint to ordinal notation. Usage: !nto <bigint>
!sbi: store bigint to variable name. Usage: !sbi <bigint> <variable name>
!gbi: get bigint from variable name. Usage: !gbi <variable name>
!mas: get bigint from variable name, multiples it with argument, then stores the result. Usage: !mas <variable name> <argument>
!ofb: converts bigint from variable name to ordinal notation. Usage: !ofb <variable name>
!help: helps. Usage: !help
`
var data = {}
const fs = require('fs')
global.discord = Discord

const client = new Discord.Client();

function bigintabs(f) {
	if (f < 0) return -f
	else return f
}

function numToOrd(arg) {
	try {
		arg = bigintabs(BigInt(arg)).toString()
	} catch (e) {
		console.log(e)
		return "humans tryna break this bot again"
	}
	if (arg === "NaN" || arg === "Infinity" || arg === "-Infinity") {
		throw "stupid hoomans"
	}
	let str = ''
	if (arg[arg.length-1] != 0) {
		str = `${arg[arg.length-1]}` + str
	}
	for (let i = arg.length-1; i > 0; i--) {
		if (arg.length-i != "1") {
			if (arg[i-1] == 1) {
				str = `ω^(${numToOrd(arg.length-i)})+` + str
			} else if (arg[i-1] == 0) {
				str = str
			} else {
				str = `ω^(${numToOrd(arg.length-i)})×${arg[i-1]}+` + str
			}
		} else {
			if (arg[i-1] == 1) {
				str = `ω+` + str
			} else if (arg[i-1] == 0) {
				str = str
			} else {
				str = `ω${arg[i-1]}+` + str
			}
		}
	}
	if (str[str.length-1] == "+") str = str.slice(0,-1)
	return str;
}
 
function datastore(data) {
	let k = Object.keys(data)
	let a = ""
	for (let i = 0; i < k.length; i++) {
		a += k[i]+":"+data[k[i]]+"\n"
	}
	console.log(a)
	return a
}

function dataparse(data) {
	let dd = {}
	let d = data.split("\n")
	d.pop()
	for (let i = 0; i < d.length; i++) {
		d[i] = d[i].split(':')
		dd[d[i][0]] = BigInt(d[i][1])
	}
	return dd
}

client.on('ready', () => {
	console.log('I am ready!');
});

function send(chan, msg) {
	let a = []
	msg = msg.toString()
	for (let i = 0; i < msg.length; i += 2000) a.push(msg.slice(i, i+2000))
	for (let i = 0; i < a.length; i++) chan.send(a[i])
}

client.on('message', message => {
	// if (message.content === 'ping') message.reply('If you see this the bot worked! yay diamboy is happy');
	let c = message.content
	let ch = message.channel
	let instr = c.split(' ')
	if (c === "!count") {
		num++;
		ch.send(numToOrd(num));
	} else if (instr[0] === "!nto") {
		try {
			// message.channel.send(numToOrd(message.content.slice(5)))
			send(ch, numToOrd(instr[1]))
		} catch (e) {
			ch.send("Invalid input")
			console.log(e)
		}
	} else if (instr[0] === "!sbi") {
		// store bigint
		try {
			if (instr[2].search(':') === -1) {
				let n = BigInt(instr[1] ? instr[1] : 1)
				data[instr[2]] = n
				send(ch, "Stored " + n + " to " + instr[2])
			} else send(ch, "No colons in variable name")
		} catch (e) {
			send(ch, "Error")
			console.log(e)
		}
	} else if (instr[0] === "!gbi") {
		// get bigint
		try {
			send(ch, data[instr[1]])
		} catch (e) {
			send(ch, "Error")
			console.log(e)
		}
	} else if (instr[0] === "!mas") {
		// multiply and store
		try {
			data[instr[1]] *= BigInt(instr[2])
			send(ch, "Multiplied " + instr[2] + " to variable " + instr[1])
		} catch (e) {
			send(ch, "Error")
			console.log(e)
		}
	} else if (instr[0] === "!ofb") {
		// ordinal from bigint
		try {
			send(ch, numToOrd(data[instr[1]]))
		} catch (e) {
			ch.send("Error")
			console.log(e)
		}
	} else if (instr[0] === "!help") {
		send(ch, helpText)
	} else if (instr[0] === "!cld") {
		if (message.author.id == 213117847436656650) {
			data = {}
			send(ch, "cleared database")
		} else {
			send(ch, "https://tenor.com/view/your-not-my-dad-gif-8300190")
		}
	} else if (instr[0] === "!ldd") {
		if (message.author.id == 213117847436656650) {
			let d = fs.readFileSync("./.data", "utf8", (err) => {
				if (err) {
					console.log("error " + err)
					send(ch, "errored")
				} else send(ch, "loaded database")
			})
			data = dataparse(d)
		} else {
			send(ch, "https://tenor.com/view/your-not-my-dad-gif-8300190")
		}
	} else if (instr[0] === "!svd") {
		if (message.author.id == 213117847436656650) {
			let d = datastore(data)
			fs.writeFileSync("./.data", d, "utf8", (err) => {
				if (err) {
					console.log("error " + err)
					send(ch, "errored")
				} else {
					send(ch, "saved database")
				}
			})
		} else {
			send(ch, "https://tenor.com/view/your-not-my-dad-gif-8300190")
		}
	}
});

 

(()=>{
	let { token } = require('./auth.json') 
	client.login(token);
})()