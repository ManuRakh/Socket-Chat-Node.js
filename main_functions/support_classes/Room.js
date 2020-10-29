exports.get_room_class = ()=>
class Room {
	constructor() {
        this.rooms = []
        
		const add_room = ((author_id, conversationer_id,roomName,  is_deleted_by_auth=false, is_deleted_by_conv=false) => {
			this.rooms.push({
                author_id:author_id, 
                conversationer_id:conversationer_id,
                roomName:roomName,
                is_deleted_by_auth:is_deleted_by_auth,
                is_deleted_by_conv:is_deleted_by_conv    
                });
        })
        const get_user_rooms = ((user_id)=>{
            return this.rooms.filter((room)=>room.author_id===user_id||room.conversationer_id===user_id)
        })
		return {
            add_room,
            get_user_rooms
		};
	}
}