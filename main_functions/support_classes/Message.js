exports.get_message_class=()=>
    
    class Message {
	constructor(message, room) {
		this.messages = message;
		this.room = room;
		const get_rooms_and_messages = (() => {
			return { room: this.room, messages: this.messages };
		});
		return {
			get_rooms_and_messages
		};
	}
}
