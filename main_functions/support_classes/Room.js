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
                is_deleted_by_conv:is_deleted_by_conv,
                current_room:false
                });
        })
        const get_user_rooms = ((user_id)=>{
            return this.rooms.filter((room)=>room.author_id===user_id||room.conversationer_id===user_id)
        })
        const get_room_info = ((roomName)=>{
            // return this.rooms.filter((room)=>
            // room.author_id===author_id&&room.conversationer_id===conversationer_id||
            // room.author_id===conversationer_id&&room.author_id)
            return this.rooms.filter((room)=>room.roomName===roomName)
        })
        const save_room_db = (author_id, conversationer_id,roomName,  is_deleted_by_auth=false, is_deleted_by_conv=false)=>{
            //operations to save in db
            return {success:false, msg:'Not working now'}
        }
        const set_current_room = ((roomName, is_author, is_co)=>{
            this.rooms.filter((room)=>{
                room.current_room=false
                if(room.roomName===roomName) room.current_room=true
            })
        })
		return {
            add_room,
            get_user_rooms,
            get_room_info,
            save_room_db,
            set_current_room
		};
	}
}