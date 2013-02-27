var timeScale;
var startDate=new Date();
var currentDate=new Date();
function drawCurrentTime(){
	currentDate=new Date();
	if (currentDate.getTime()<startDate.getTime()){return}
	else{
		var timeGap=(currentDate.getTime()-startDate.getTime());
		var pxGap=20*(timeGap/(convertTime(timeScale)));
		ctx.beginPath();
		ctx.moveTo(pxGap,0);
		ctx.lineTo(pxGap,canvas.width);
		ctx.stroke();
	}
}
function display(a){
	a.css("display","block");
}
function hide(a){
	a.css("display","none");
}
function  addDeadlineToNode(node,x){
	var timeGap=x*(convertTime(timeScale));
	node.deadline=(new Date(startDate.getTime()+Math.floor(timeGap))).getTime();
	console.log(node.deadline);
	}
	
var timeFormat=function(year,month,day,hour,minute){
	var time=[];
	time.push([year,"years"]);
	time.push([month,"months"]);
	time.push([day,"days"]);
	time.push([hour,"hours"]);
	time.push([minute,"minutes"]);
	return time;
}
timeScale=timeFormat("","","","1","");
function saveScaleData(){
	$("#saveScale").click(function(){
		var year=$("#scaleYear").val();
		var month=$("#scaleMonth").val();
		var day=$("#scaleDay").val();
		var hour=$("#scaleHour").val();
		var minute=$("#scaleMinute").val();
		if (year||month||day||hour||minute){
			timeScale=timeFormat(year,month,day,hour,minute);
			$(".clear3").val("");
			hide($("#chooseScale"));
		};})
	}
	
function drawTimeScale(){
	var y0=canvas.height-40;
	var x0=30;
	ctx.beginPath()
	ctx.moveTo(x0,y0);
	ctx.lineTo(x0,y0+5);
	ctx.lineTo(x0+20,y0+5);
	ctx.lineTo(x0+20,y0);
	ctx.stroke();
	var time=timeScale;
	var index=0;
	for(var i=0;i<time.length;i++){
		if (time[i][0]!==""){index=i;break}
	}
	if ((index+1)<time.length&&time[index+1][0]!==""){
		text=time[index][0]+time[index][1]+", "+
		time[index+1][0]+time[index+1][1]
	}
	else{text=time[index][0]+time[index][1];}
	ctx.font = "10px Arial";
	ctx.textAlign = "left";
	ctx.fillStyle = "black";
	ctx.fillText(text,x0-10,y0+25);	
}
function convertTime(time){	
	return 1000*(time[4][0]*1+60*(time[3][0]*1+24*(time[2][0]*1+
		30*(time[1][0]*1+12*time[0][0]))));
}



