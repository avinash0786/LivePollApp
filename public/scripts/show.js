$(()=>{
    console.log("jqu init")
    let inputs=$("input[type=radio]");
    console.log(inputs.length)
    inputs.each((key,val)=>{
        $(val).attr("value",key)
    })
})

