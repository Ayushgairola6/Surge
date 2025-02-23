const OtpComponent = ()=>{


 function EnterOtp(event){
   if(event.target.value.length===event.target.maxLength && event.target.nextElementSibling){
    
    event.target.nextElementSibling.focus();
   }
  else if(event.target.value=== "" && event.target.previousElementSibling){
    event.target.previousElementSibling.focus()  
  }

 }
function pasteOtp(event){
let i =0;
if(event.clipboardData.getData('text') && event.target.nextElementSibling){
  const data = event.clipboardData.getData('text').split('')
  let currentInput = event.target;  
  while (i < data.length && currentInput ){
    currentInput.value = data[i];
    currentInput = currentInput.nextElementSibling;
   i++;
    
  }


   }
}

	return (<>
    <div className="h-screen w-screen bg-black text-white font-bold text-xl flex items-center jusitfy-center flex-col">
  <label>Enter otp</label>
<div onPaste={pasteOtp} onChange={EnterOtp} className="flex text-black">
      <input   className=" border-2 border-red-400 rounded-full m-3 w-12 text-center" placeholder="2" type="" maxLength={1}/>
     <input  className=" border-2 border-red-400 rounded-full m-3 w-12 text-center" placeholder="2" type="" maxLength={1}/>
     <input   className=" border-2 border-red-400 rounded-full m-3 w-12 text-center" placeholder="2" type="" maxLength={1}/>
     <input   className=" border-2 border-red-400 rounded-full m-3 w-12 text-center" placeholder="2" type="" maxLength={1}/>
      <input   className=" border-2 border-red-400 rounded-full m-3 w-12 text-center" placeholder="2" type="" maxLength={1}/>
    </div>
</div>
     

	</>)
}