var now_pos=0;
var bef_pos=0;
var xmlhttp;
var now_info;
//储存信息
var info_array=new Array();
//储存信息位置
var pos_to_info_array=new Array();
function member_info(data){
    var that = this;
    this.name;
    this.team;
    this.grade;
    this.tel;
    this.email;
    this.otherinfo;
    this.init = function(data){
	that.name = data.name;
	that.team = data.team;
	that.grade = data.grade;
	that.tel = data.tel;
	that.email = data.email;
	that.otherinfo = data.otherinfo;
    };
    this.init(data);
    this.show_info=function(){
	if(now_info==that)return 0;
	$("#info p").remove();
	$("#info .info_team").remove();
	$("#info").css({"display":"block"}).css({"width":"0px"}).css({"height":"0px"}).animate({width:"229px",height:"200px"});
	$("#info_body").append("<p class='info_name'>"+that.name+"</p>");
	var color="#000000";
	switch(that.team){
	case "pm":color="#f3e2aa";break;
	case "design":color="#ffceba";break;
	case "it":color="#a7dec9";break;
	case "sde":color="#d4e6e8";break;
	case "alg":color="#faf0d7";break;
	case "web":color="#d4e6e8";break;
	case "嵌入式":color="#f3e2aa";break;
	}
	$("#info_body").append("<div class='info_team' class='"+that.team+"_color' style='background-color:"+color+";'></div>");
	if(that.team!="0")$("#info_body").append("<p>"+that.team+"</p>");
	if(that.grade!="0")$("#info_body").append("<p>"+that.grade+"</p>");
	if(that.tel!="0")$("#info_body").append("<p>"+that.tel+"</p>");
	if(that.email!="0")$("#info_body").append("<p>"+that.email+"</p>");
	now_info=that;
    };
}
function member_info_cube(member){
    var that = this;
    this.member = member;
    this.info_cube = new Array();
    this.add_info=function(data){
	that.info_cube.push(new member_info(data));
    };
    this.show_info=function(pos){
	that.info_cube[pos].show_info();
    }
}
loadXMLDoc=function(grade){
    xmlhttp=null;
    if(window.XMLHttpRequest){
	// code for Firefox, Opera, IE7, etc.
	xmlhttp=new XMLHttpRequest();
    }
    else if(window.ActiveXObject){
	// code for IE6, IE6
	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if(xmlhttp!=null){
	xmlhttp.onreadystatechange=state_Change;
	xmlhttp.open("GET","/grade?mydata="+grade,true);
	xmlhttp.send(null);
    }
    else{
	alert("Your browser does not support XMLHTTP.");
    }
};
state_Change=function(){
    if(xmlhttp.readyState==4){
	//4 = "loaded"
	if(xmlhttp.status==200){
	    var haha;
	    if (typeof (JSON) == 'undefined'){
		haha = eval(xmlhttp.responseText);
	    }
	    else{
		//200 = "OK"
		haha = JSON.parse(xmlhttp.responseText);
	    }
	    //alert(xmlhttp.responseText);
	    show_member(haha);
	}
	else{
	    alert("Problem retrieving data:" + xmlhttp.statusText);
	}
    }
};
function show_info(pos,event,num){
    $("#info").css({"left":event.clientX+15}).css({"top":event.pageY+15});
    if(0&&$("#info").css("display")=="none"){
	//alert("");
	$("#info").css({"display":"block"}).css({"width":"0px"}).css({"height":"0px"}).animate({width:"100px",height:"200px"});
    }
    var count = 0 ;
    var len = info_array.length;
    for(;count<len;count++){
	if(info_array[count].member == num){
	    info_array[count].show_info(pos);
	    break;
	}
    }
}
function hide_info(){
    $("#info").css({"display":"none"});
    now_info = -1;
}
function show_member(data){
    $("#show_member").append("<div id='"+now_pos+"_member'></div>");
    var len = data.length;
    var count = 0;
    var i = info_array.length;
    info_array.push(new member_info_cube(now_pos));
    var team = data[count].fields.team;
    pos_to_info_array.push(data[count].fields.grade);
    var team_num = 0;
    $("#"+now_pos+"_member").append("<div id='"+now_pos+team+"' class='team' ><div class='team_name'>"+team+"</div><div class='team_people'></div></div>");
    for(;count<len;count++){
	var the_data = data[count].fields;
	//alert(the_data.name);
	if(team!=the_data.team){
	    team = the_data.team;
	    team_num = 0;
	    $("#"+now_pos+"_member").append("<div id='"+now_pos+team+"' class='team' ><div class='team_name'>"+team+"</div><div class='team_people'></div></div>");
	}
	info_array[i].add_info(the_data);
	team_num++;
	$("#"+now_pos+team+" .team_name").css({"height":10+Math.round(team_num/7)*100+"px"});
	$("#"+now_pos+team).css({"height":160+Math.round(team_num/7)*100+"px"});
	$("#"+now_pos+team+" .team_people").append("<div class='member_div'><img class='member_img' src='/static/element/head/"+the_data.name+".png' onerror='this.src=\"/static/element/head/uniquestudio.png\"' onmousemove='show_info("+count+",event,"+now_pos+")' onmouseout='hide_info()' /><p>"+the_data.name+"</p></div>");
    }
}
$(document).ready(function(){
    $("#search_input").css("border-width","0px").css("border-color","red").css("border-style","solid");
    $("#search_input").focus(function(){
	$("#search_input").css("border-width","2px");
    });
    $("#search_input").blur(function(){
	$("#search_input").css("border-width","0px");
    });
    var move_distance = (now_pos-0.5)*200+document.documentElement.clientWidth/2;
    $("#0_head_img").attr("src","/static/element/simple/circle.png");
    $("#time_line_body").animate({left:""+move_distance+"px"});
    $(".grade").click(function(){
	var text = parseInt($(this).first().text());
	var the_pos = parseInt(this.id);
	now_pos = the_pos;
	$("#"+bef_pos+"_head_img").attr("src","/static/element/simple/circle2.png");
	var move_distance = (-the_pos-0.5)*200+$(window).width()/2;//;document.documentElement.clientWidth/2;
	$("#"+the_pos+"_head_img").attr("src","/static/element/simple/circle.png");
	$("#time_line_body").animate({left:""+move_distance+"px"});
	if(the_pos == bef_pos){
	}
	else if(document.getElementById(the_pos+"_member")){
	    $("#"+the_pos+"_member").css({"display":"block"});
	    $("#"+bef_pos+"_member").css({"display":"none"});
	}
	else{
	    $("#"+bef_pos+"_member").css({"display":"none"});
	    loadXMLDoc(text);
	}
	bef_pos = the_pos;
    });
    loadXMLDoc(2004);
});
function search(){
    var value = document.getElementById("search_input").value;
    var len = info_array.length;
    var count = 0;
    for(;count<len;count++){
	var info_cube = info_array[count].info_cube;
	var len2 = info_cube.length;
	for(var i=0;i<len2;i++){
	    if(info_cube[i].name == value){
		for(var j=0;j<pos_to_info_array.length;j++){
		    if(pos_to_info_array[j] == info_cube[i].grade){
			//alert(j);
			break;
		    }
		}
		var the_pos = info_cube[i].grade-2004;
		now_pos = the_pos;
		$("#"+bef_pos+"_head_img").attr("src","/static/element/simple/circle2.png");
		var move_distance = (-the_pos-0.5)*200+$(window).width()/2;//;document.documentElement.clientWidth/2;
		$("#"+the_pos+"_head_img").attr("src","/static/element/simple/circle.png");
		$("#time_line_body").animate({left:""+move_distance+"px"});
		if(the_pos == bef_pos){
		}
		else if(document.getElementById(the_pos+"_member")){
		    $("#"+the_pos+"_member").css({"display":"block"});
		    $("#"+bef_pos+"_member").css({"display":"none"});
		}
		else{
		    $("#"+bef_pos+"_member").css({"display":"none"});
		    loadXMLDoc(text);
		}
		bef_pos = the_pos;
		return false;
	    }
	}
    }
    search_loadXMLDoc(value);
    return false;
}
var search_xmlhttp=null;
search_loadXMLDoc=function(name){
    if(window.XMLHttpRequest){
	// code for Firefox, Opera, IE7, etc.
	search_xmlhttp=new XMLHttpRequest();
    }
    else if(window.ActiveXObject){
	// code for IE6, IE6
	search_xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if(search_xmlhttp!=null){
	search_xmlhttp.onreadystatechange=search_state_Change;
	search_xmlhttp.open("GET","/normal_search?mydata="+name,true);
	search_xmlhttp.send(null);
    }
    else{
	alert("Your browser does not support XMLHTTP.");
    }
};
search_state_Change=function(){
    if(search_xmlhttp.readyState==4){
	//4 = "loaded"
	if(search_xmlhttp.status==200){
	    var grade = search_xmlhttp.responseText;
	    var the_pos = grade-2004;
	    now_pos = the_pos;
	    $("#"+bef_pos+"_head_img").attr("src","/static/element/simple/circle2.png");
	    var move_distance = (-the_pos-0.5)*200+$(window).width()/2;//;document.documentElement.clientWidth/2;
	    $("#"+the_pos+"_head_img").attr("src","/static/element/simple/circle.png");
	    $("#time_line_body").animate({left:""+move_distance+"px"});
	    if(the_pos == bef_pos){
	    }
	    else if(document.getElementById(the_pos+"_member")){
		$("#"+the_pos+"_member").css({"display":"block"});
		$("#"+bef_pos+"_member").css({"display":"none"});
	    }
	    else{
		$("#"+bef_pos+"_member").css({"display":"none"});
		loadXMLDoc(grade);
	    }
	    bef_pos = the_pos;
	}
	else{
	    alert("Problem retrieving data:" + search_xmlhttp.statusText);
	}
    }
};