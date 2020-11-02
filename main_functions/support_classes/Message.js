class Message {
	message = {}
	constructor(msg, sender, receiver, roomName) {
		let message = {}
		message.msg = msg;
		message.sender = sender;
		message.receiver = receiver;
		message.roomName = roomName;
		message.created_at = new Date().toISOString()
		message.updated_at = new Date().toISOString()
		this.message = message	
	}
	get_message = () =>{
		//я тут подумал, историю сообщений лучше выводить из роута, а не из сокета. Так будет меньше нагрузки на сокеты.
		return this.message
	}
	save_message = () =>{
		//save opetation in DB
	}
	get_rooms_and_messages = (() => {
		return { room: this.room, messages: this.messages };
	});
}
module.exports = Message
