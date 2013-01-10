function node_cube(){
    var that = this;
    this.team = new Array();
    this.team_name = new Array();

    this.xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
	this.xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
	this.xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    this.load_data = function(data){
	var name = data+"_team";
	$(".member_div").css({"display":"none"});;
	for(count in that.team_name){
	    if(that.team_name[count] == name){
		$("#"+name).css({"display":"block"});
		return 0;
	    }
	}
	that.xmlhttp.onreadystatechange=function(){
	    if (that.xmlhttp.readyState==4 && that.xmlhttp.status==200){
		var data = that.xmlhttp.responseText;
		haha = JSON.parse(data);
		that.add_team(haha);
	    }
	}
	that.xmlhttp.open("GET","/grade?mydata="+data,true);
	that.xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	that.xmlhttp.send();
	return false; 
    };
    this.add_team = function(data){
	var name = data[0].fields.highest_degree_year+"_team";
	for(count in that.team_name){
	    if(that.team_name[count] == name){
		return 0;
	    }
	}
	that.team_name.push(name);
	that.team.push(new node_team());
	$("#show_member").append("<div id='"+name+"' class='member_div'></div>");
	that.team[that.team.length-1].add_info(name,data);
    };
}
function node_team(){
    var that = this;
    this.node_arr = new Array();
    this.add_info = function(name,data){
	var count = 0;
	var len = data.length;
	for(;count<len;count++){
	    that.node_arr.push(new node_info());
	    that.node_arr[that.node_arr.length-1].init(data[count],name);
	}
    };
}
function node_info(){
    var that = this;
    this.pk;
    this.name_first;
    this.name_middle;
    this.name_last;
    this.email;
    this.homepage;
    this.s_id;
    this.D_name;
    this.D_insti;
    this.D_year;
    this.D_depart;
    this.title;
    this.organization;
    this.other_info;
    this.imgurl;
    this.img;
    this.keyword;
    this.mentor;
    this.mentee;
    this.coll;
    
    this.init = function(data,name){
	var fields = data.fields;
	that.pk = data.pk;
	that.name_first = fields.name_first;
	that.name_middle = fields.name_middle;
	that.name_last = fields.name_last;
	that.s_id = fields.scitribe_id;
	that.D_name = fields.highest_degree_name;
	that.D_year = fields.highest_degree_year;
	that.D_insti = fields.highest_degree_insti;
	that.D_depart = fields.highest_degree_depart;
	that.keyword = fields.keywords;
	that.email=data.fields.email_addr;
	that.organization = fields.organization_info;
	that.imgurl = fields.imgurl;//fields.imgurl;
	that.homepage = fields.homepage;
	that.mentor = fields.mentor;
	that.mentee = fields.mentee;
	that.coll = fields.collaborators;
	that.other_info = fields.other_info;
	that.title = fields.cur_title;
	var member_name;
	if(test_info(that.name_middle)!="N/A"){
		member_name = that.name_first+" "+that.name_middle+" "+that.name_last;
	    }
	    else member_name = that.name_first+" "+that.name_last;
	if(that.imgurl == ""){
	    $("#"+name).append("<div class='member'><img id='member_"+that.pk+"' class='member-photo' src='/static/element/head/default.png' /><p>"+member_name+"</p></div>");
	}
	else{
	    $("#"+name).append("<div class='member'><img id='member_"+that.pk+"' class='member-photo' src='"+that.imgurl+"' onerror='this.src=\"/static/element/head/default.png\"' /><p>"+member_name+"</p></div>");
	}
	var img = document.getElementById("member_"+that.pk);
	img.addEventListener("mousemove",that.show_info,false);
    };
    this.show_info = function(e){
	var top = document.documentElement.scrollTop;
	$("#info").css({"display":"block","left":(e.clientX+10),"top":(e.clientY+top+10)});
	if(info_id != that.pk){
	    $("#info_body").html("");
	    info_id = that.pk;
	    
	    var name;
	    if(test_info(that.name_middle)!="N/A"){
		name = that.name_first+" "+that.name_middle+" "+that.name_last;
	    }
	    else name = that.name_first+" "+that.name_last;
	    
	    $("#info_body").append("<div class='info_name'>"+name+"<div/><hr />");
	    var info_content = new Array(that.email,that.homepage,that.s_id,that.D_name,that.D_insti,that.D_year,that.D_depart,that.title,that.organization,that.other_info,that.keyword,that.mentor,that.mentee,that.coll);
	    var info_name = new Array("Email","Homepage","S_id","PhD","Institution","Year","Subject","Position","Organization","Miscellaneous","Description","Mentor","Mentee","Collaborators");
	    var count = 0;
	    var len = info_content.length;
	    for(;count<len;count++){
		if(test_info(info_content[count])!="N/A"){
		    var str = info_name[count]+": "+test_info(info_content[count]);
		    var str_len = Math.ceil(str.length/20);
		    for(var j = 0;j<str_len;j++){
			$("#info_body").append(str.substring(j*20,j*20+20));
		    }
		    $("#info_body").append("<br/>");
		}
	    }
	}
    };
}
function test_info(s){
    if(s==""||!s){
	return "N/A";
    }
    return s;
}
var cube = new node_cube();
var info_id = -1;
$(document).ready(function(){
    var normal = "/static/element/simple/circle2.png";
    var click = "/static/element/simple/circle.png";
    $(".grade").click(function(){
	var num = parseInt($(this).attr("id"));
	$("#time_line_body").animate({"left":($(window).width()/2-num*200-100)});
	$(".circle").attr("src",normal);
	$("#"+num+"_head_img").attr("src",click);
	var year = $("#year_"+num).html();
	cube.load_data(year);
    });
    $("#0_grade").click();
    $(".member-photo").live("mouseleave",function(){
	$("#info").css({"display":"none"});
    });
});