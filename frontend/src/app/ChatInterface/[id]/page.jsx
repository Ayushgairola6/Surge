import Interface from '../../components/chatinterface';

const ChatInterface = async({params})=>{

	const {room_name,room_id} = await params;
	return (<>
		<Interface room_name={room_name} room_id={room_id}/>
	</>)
}

export default ChatInterface;