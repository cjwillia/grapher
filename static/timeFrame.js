var currentDate=new Date();
var currentDateX=0;

//Fill the deadline form in the decription according to the x coordinate of the currrent node
function fillDeadLine(){
	var time=currentSelectedNode.x*convertTime(manager.project.timeScale)/20;
	var date=new Date(time+manager.project.startDate);
	$("#endYear").val(date.getFullYear());
	$("#endMonth").val(date.getMonth()+1);
	$("#endDate").val(date.getDate());
	$("#endHour").val(date.getHours());
	}

//change the x coordinate of the current node according to the deadline form in the description
function saveDeadLineFromDesc(endY,endM,endD,endH){
	endM=endM*1-1;
	var time=currentSelectedNode.x*convertTime(manager.project.timeScale)/20;
	var date=new Date(time+manager.project.startDate);
	console.log(endY,date.getFullYear(),endM,date.getMonth(),endD,date.getDate(),endH,date.getHours());
	if ((1*endY!==date.getFullYear())||(1*endM!==date.getMonth())||
	    (1*endD!==date.getDate())||(1*endH!==date.getHours())){
		var newDate=new Date(endY,endM,endD,endH);
		var timeGap=(newDate.getTime()-manager.project.startDate);
		var pxGap=(timeGap/(convertTime(manager.project.timeScale)))*20;
		if (pxGap<=0 || pxGap>=canvas.width){return}
		else {currentSelectedNode.x=pxGap}
	}
}

//draw the current time point in the canvas
function drawCurrentTime(){
	currentDate=new Date();
	if (currentDate.getTime()<manager.project.startDate){return}
	else{
		var timeGap=(currentDate.getTime()-manager.project.startDate);
		var pxGap=(timeGap/(convertTime(manager.project.timeScale)))*20;
		currentDateX=pxGap;
		ctx.beginPath();
		ctx.strokeStyle='rgba(50,50,50,0.4)';
		ctx.moveTo(pxGap,0);
		ctx.fillStyle = "#012932";
		ctx.lineTo(pxGap,canvas.width);
		ctx.lineWidth=3;
		ctx.stroke();
		ctx.font = "10px Arial";
		ctx.textAlign = "left";
		ctx.fillText("Current Time",pxGap+5,15);	
	}
}
//helper function to change the display mode for an jquery object
function display(a){
	a.css("display","block");
}
function hide(a){
	a.css("display","none");
}

//get the date of the node according to the x coordinate
function  getDeadline(x){
	var timeGap=x*(convertTime(manager.project.timeScale));
	return (new Date(manager.project.startDate+Math.floor(timeGap)));
	}

//check if one node's deadline pass according to it's x coordinate and the current date
function passDeadline(node){
	//var deadLine=getDeadline(node.x);
	return (node.x<currentDateX);
	}	

//return a 2d list form of time based on the year, month,day,hour,minute given
var timeFormat=function(year,month,day,hour,minute){
	var time=[];
	time.push([year,"years"]);
	time.push([month,"months"]);
	time.push([day,"days"]);
	time.push([hour,"hours"]);
	time.push([minute,"minutes"]);
	return time;
}

//save the timeScale from the form when pressing the "save button"
function saveScaleData(){
	$("#saveScale").click(function(){
		var year=$("#scaleYear").val();
		var month=$("#scaleMonth").val();
		var day=$("#scaleDay").val();
		var hour=$("#scaleHour").val();
		var minute=$("#scaleMinute").val();
		if (year||month||day||hour||minute){
			manager.project.timeScale=timeFormat(year,month,day,hour,minute);
			$(".clear3").val("");
			hide($("#chooseScale"));
			console.log(manager.project.timeScale);
		};})
	}


//draw the timeScale icon in the canvas
function drawTimeScale(){
	var y0=canvas.height-40;
	var x0=30;
	ctx.beginPath()
	ctx.moveTo(x0,y0);
	ctx.lineTo(x0,y0+5);
	ctx.lineTo(x0+20,y0+5);
	ctx.lineTo(x0+20,y0);
	ctx.lineWidth=2;
	ctx.strokeStyle="#015C65"
	ctx.stroke();
	var time=manager.project.timeScale;
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
	ctx.fillStyle = "#012932";
	ctx.fillText(text,x0-10,y0+25);	
}
//convert the 2d list time format to be milliseconds
function convertTime(time){	
	return 1000*60*(time[4][0]*1+60*(time[3][0]*1+24*(time[2][0]*1+
		30*(time[1][0]*1+12*time[0][0]))));
}



