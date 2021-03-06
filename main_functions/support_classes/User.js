exports.get_user_class = ()=>
class User {
	constructor(name, id) {
		this.name = name;
		this.id = id;
		this.rooms = [];
		this.owner = true
		this.current_room = {
			roomName:this.name,
			hash:this.id,
			owner:true
		};
		const add_room = ((roomName, hash) => {
			this.rooms.push({ roomName: roomName, hash: hash, owner:false });
		});
		const get_user_rooms = (() => {
			return this.rooms;
		});
		const get_all_infos = (() => {
			return { name: this.name, id: this.id, rooms: this.rooms };
		});
		const change_current_room = ((new_room) => {
			this.current_room = new_room;
		});
		const remove_room = ((roomId, roomName) => {
			this.rooms = this.rooms.filter((r) => r.hash != roomId)&&r.roomName!=roomName;
		});
		const get_all_rooms = (()=>{
			return this.rooms
		})
		const get_current_room = (()=>{
			return this.current_room
		})
		return {
			add_room,
			get_user_rooms,
			get_all_infos,
			change_current_room,
			remove_room,
			get_current_room,
			get_all_rooms
		};
	}
}