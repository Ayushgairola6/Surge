
import User2 from '../../components/User2'

const User2Account = async ({params})=>{
	
		const {id} = await params;

	return (<>
             <User2 id={id} />

	</>)
}

export default User2Account;