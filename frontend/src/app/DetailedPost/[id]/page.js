import DetailedPost from "../../components/detailed"

const detail = async ({params})=>{

    const {id} = await params;
    return <>
     <DetailedPost id = {id}/>

    </>
}
export default detail;