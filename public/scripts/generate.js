console.log("Linked generate script")
let op=0;
let alpha="ABCDEFGHIJKLMNOP"
let show=1;

$(()=>{
    let progress=$("#par > div >div:first-child >div>div")
    let votes=$("#par > div >div:last-child >div>p")
    let pollName=$("#pollNaam").text()
    console.log(pollName)
    let sec=1000;
    setInterval(updatePoll, sec);

    // updatePoll()
    async function updatePoll(){
        let values;
        let total=0;
        var returned=await fetch("/getPollVal?name="+pollName)
        returned.json()
            .then(d=>{

                console.log(d[0].value)
                values=d[0].value;
                if (d[0].totalPolls===0){
                    total=0;
                }
                else {
                    total=100/d[0].totalPolls;
                }
                // console.log("total: "+total)
                progress.each((key,ele)=>{
                    let percent=Math.round(values[key]*total);
                    // console.log(key+" %: "+percent+" val: "+values[key])
                    $(ele).text(percent+" %")
                    $(ele).css("width",percent+"%")
                })
                votes.each((key,ele)=>{
                    $(ele).text("Votes: "+values[key])
                })
                if (show%2===0){
                    $("#live").show()
                    show++;
                }
                else {
                    $("#live").hide()
                    show++;
                }
                console.log("Calling rep")
            })

    }
    console.log("Start jquery")
})



