import ChatRoom from '../../components/ChatRoom';

const Chats = async( {params})=>{

	const {id} = await params;

	return <>
		<ChatRoom id={id}/>
        
	</>
}

export default Chats