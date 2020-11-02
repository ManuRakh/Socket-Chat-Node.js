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
                current_room:false,
                created_at : new Date().toISOString(),
                updated_at : new Date().toISOString()
                });
        })
        const get_user_rooms = ((roomId)=>{
            return this.rooms.filter((room)=>room.roomName===roomId)
        })
        const get_room_info = ((roomId)=>{
            return this.rooms.filter((room)=>room.roomName===roomId)
        })
        const save_room_db = (author_id, conversationer_id,roomName, roomId,  is_deleted_by_auth=false, is_deleted_by_conv=false)=>{
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
function makeHash(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }