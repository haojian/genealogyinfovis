//Speed为函数用来返回值
var family;
var browser=navigator.appName;
function Onload_tree(){
    family=new Family("tree",500,200);
    family.node_array[1] = new Tree_node("search",0,0,family,family.node_array[0],"search");
    family.node_move_left[1] = 0;
    family.node_move_top[1] = 0;
    family.move_to_goodplace(family.id);
    document.getElementById("search_form").onsubmit = function(){
	family.search();
	return false;
    }
    //$("#search_body").css({"display":"block"});
    alert_close();
    $("#mask").fadeOut();
    $("body").css({"cursor":"auto"});
}
var my_alert = 0;
function alert_open(message){
    if(my_alert)return 0;
    var width = message.length*6+120
    var alert_info_width = width-32;
    $("#alert_info p").remove()
    $("#alert_info").css({"width":alert_info_width+"px"}).append("<p>"+message+"</p>");
    $("#alert").css({"width":width+"px"}).css({"left":($(document).width()-width)/2}).animate({"top":"0px"},"slow");
    my_alert = 1;
}
function alert_close(){
    if(my_alert)$("#alert").animate({"top":"-56px"},"slow");
    my_alert = 0;
}
window.onload = Onload_tree;
var mouse_l,mouse_t;
var my_event;
function get_position(event){
    mouse_l = event.clientX;
    mouse_t = event.clientY;
    my_event = event;
}

function canvas_openup(id,height,width,time,node,event,speed_h,speed_w,speed_o,opacity){
    var object = document.getElementById("node_info");
    var interval = 30;
    if(!speed_h){
	//alert(object.style.display=="none");
	//alert(object.style.opacity==0)
	if(object.style.opacity==0){
	    object.width=0;
	    object.height=0;
	}
	else return 0;
	var speed_h = (height-object.height)/time*interval;
	var speed_w = (width-object.width)/time*interval;
	object.style.opacity = 0;
	var speed_o = 1/interval,opacity=0;
	//	alert(speed_h);
	canvas_openup(id,height,width,time,node,event,speed_h,speed_w,speed_o,opacity);
	return 0;
    }
    var width_dif=object.width-width,height_dif=object.height-height;

    object.width = object.width+speed_w;
    object.height = object.height+speed_h;
    opacity += speed_o;
    object.style.opacity = opacity;
    node.info.show_info(event);
    //alert(event);
    if(speed_h>0&&object.height>height){
	//alert(object.height+","+height);
	object.height=height;
	speed_h = 0;
    }
    else if(speed_h<0&&object.height<height){
	object.height=height;
	speed_h = 0;
    }
    if(speed_w>0&&object.width>width){
	object.width=width;
	speed_w = 0;
    }
    else if(speed_w<0&&object.width<width){
	object.width=width;
	speed_w = 0;
    }
    if(speed_h||speed_w)setTimeout(canvas_openup,interval,id,height,width,time,node,event,speed_h,speed_w,speed_o,opacity);
    else {
	object.style.opacity = 1;
	node.info.show_info(event);
    }
}

function canvas_open(id,width,height,time){
    var object=document.getElementById(id);
    if(object.style.opacity==0){
	var speed_w=(width-object.width)/time;
	var speed_h=(height-object.height)/time;
    }
}
function ajax_update(){
    var updata = document.getElementsByName("up-input");
    var update_xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
	update_xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
	update_xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    update_xmlhttp.onreadystatechange=function(){
	if (update_xmlhttp.readyState==4 && update_xmlhttp.status==200){
	    var data = update_xmlhttp.responseText;
	    if(data == "none"){
		alert_open("No change.")
		setTimeout(alert_close,1200);
	    }
	    else if(data == "success"){
		alert_open("Update Successfully.");
		modify_exit();
		setTimeout(alert_close,1200);
	    }
	    else if(data == "error"){
		alert_open("Update error");
		setTimeout(alert_close,1200);
	    }	 
	    $(".check").remove();
	}
    }
    var value = "";
    for(var i=0;i<updata.length-1;i++){
	if(updata[i].value=="none")value += ",";
	else value += updata[i].value+",";
    }
    var id = $("#up_id").html();
    value += updata[i].value;
    update_xmlhttp.open("GET","/update?id="+id+"&&value="+value,true);
    update_xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    update_xmlhttp.send();
    return false; 
}
function ajax_add(){
    var f_id = family.selected_node.info.pk;
    var v = document.getElementsByName("add_it");
    var add_xmlhttp;
    $("#addchild_exit").click();
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
	add_xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
	add_xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    add_xmlhttp.onreadystatechange=function(){
	if (add_xmlhttp.readyState==4 && add_xmlhttp.status==200){
	    var data = add_xmlhttp.responseText;
	    haha = JSON.parse(data);
	    var node = family.getNodeById(f_id);
	    if(node.child){
		family.loadXMLDoc(0,node);
		return 1;
	    }
	    family.node = node;
	    if(haha.length)family.create_node_canvas(haha,1);
	}
    }
    add_xmlhttp.open("GET","/add?f_id="+f_id+"&name="+v[1].value+","+v[2].value+","+v[3].value+"&type="+v[0].value,true);
    add_xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    add_xmlhttp.send();
    return false; 
}
function ajax_del(){
    var f_id = family.selected_node.info.pk;
    var type = radio_value;
    var del_xmlhttp;
    family.getNodeById(f_id);
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
	del_xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
	del_xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    del_xmlhttp.onreadystatechange=function(){
	if (del_xmlhttp.readyState==4 && del_xmlhttp.status==200){
	    var data = del_xmlhttp.responseText;
	    if(data=="1")family.delNodeById(f_id,radio_value);
	    //haha = JSON.parse(data);
	}
    }
    del_xmlhttp.open("GET","/del?f_id="+f_id+"&type="+radio_value,true);
    del_xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    del_xmlhttp.send();
    return false; 
}
function Create_up_info(name_arr){
    var count=0;
    for(;count<name_arr.length;count++){
	var name = name_arr[count].split("_");
	name = name.join(" ");
	if(count<8){
	    $("#up_attr .up_list1").append("<div class='up-info'>"+name+":</div>");
	    $("#up_value .up_list1").append("<input type='text' id='"+name_arr[count]+"-input' class='up-input' name='up-input'>");
	}
	else{
	    $("#up_attr .up_list2").append("<div class='up-info'>"+name+":</div>");
	    $("#up_value .up_list2").append("<input type='text' id='"+name_arr[count]+"-input' class='up-input' name='up-input'>");
	}
    }
}
var name_arr = new Array("First_Name","Middle_Name","Last_Name","Image_link","Websites","PhD","Institution","Year","Subject","Position","Description","Miscellaneous","Mentors","Mentees","Collaborators","Organization_info");
function modify_exit(){
    $("#update_info_div").fadeOut(function(){
	$(".check").remove();
	$(".up_list2").css({"display":"none"});
	$("#more_btn").css({"display":"block"});
    });
    $("#mask").fadeOut();
}
var radio_value = 1;
$(document).ready(function(){
    //创建input
    Create_up_info(name_arr);
    //search
    $("#search_icon").click(function(){
	family.search();
    });
    //
    $("#search_input").keyup(function(){
	if($("#search_input").val()==""){
	    family.del_search();
	}
    });
    $(".up-input").keydown(function(){
	var has = $(this).next().attr("src");
	if(!has)$(this).after("<img class='check' src='/static/element/add/check.png' />");
    });
    $(".up-input").focus(function(){
	$(this).css({"background":"url('/static/element/add/input.png') repeat scroll 0 0 transparent"});
    });
    $(".up-input").blur(function(){
	$(this).css({"background":""});
    });
    //up-input
    var up_input_normal = "url('/static/element/add/add/square.png')";
    var up_input_focus = "url('/static/element/add/add/square-click.png')";
    $(".add-input").focus(function(){
	$(this).css({"background":up_input_focus});
    });
    $(".add-input").blur(function(){
	$(this).css({"background":up_input_normal});
    });
    //more_btn
    $("#more_btn").click(function(){
	$(this).fadeOut(function(){
	    $(".up_list2").fadeIn();
	});
    });
    $("#more_btn").mouseover(function(){
	$(this).css({"background":"#c9c9c9"});
    });
    $("#more_btn").mouseleave(function(){
	$(this).css({"background":"#e6e6e6"});
    });
    //modify-btn
    $("#modify-btn").click(function(){
	family.update_info();
    });
    $("#connect-btn").click(function(){
	family.change_connect();
    });
    $("#minus-btn").click(function(){
	family.del_node();
    });
    //按钮点击效果
    var up_btn_normal = "url('/static/element/add/add/button.png')";
    var up_btn_over = "url('/static/element/add/add/button_click.png')";
    $(".up_btn").mousedown(function(){
	$(this).css({"background":up_btn_over});
    });
    $(".up_btn").mouseup(function(){
	$(this).css({"background":up_btn_normal});
    });
    $(".up_btn").mouseleave(function(){
	$(this).css({"background":up_btn_normal});
    });
    //del
    $(".del-btn").mousedown(function(){
	$(this).css({"background":up_btn_over});
    });
    $(".del-btn").mouseup(function(){
	$(this).css({"background":up_btn_normal});
    });
    $(".del-btn").mouseleave(function(){
	$(this).css({"background":up_btn_normal});
    });
    //
    $("#confirm_btn").click(function(){
	alert_close();
	ajax_update();
    });
    //addchild
    $(".addchild-btn").mousedown(function(){
	$(this).css({"background":"url('/static/element/add/add/button_click.png') repeat scroll 0 0 transparent"});
    })
    $(".addchild-btn").mouseup(function(){
	$(this).css({"background":"url('/static/element/add/add/button.png') repeat scroll 0 0 transparent"});
    })
    $(".addchild-btn").mouseleave(function(){
	$(this).css({"background":"url('/static/element/add/add/button.png') repeat scroll 0 0 transparent"});
    })
    $("#plus-btn").click(function(){
	$("#addchild_div").fadeIn();
	$("#mask").fadeIn();
    });
    $("#addchild_submit").click(function(){
	ajax_add();
    });
    //exit按钮
    $("#update_exit").click(function(){
	$("#update_info_div").fadeOut(function(){
	    alert_close();
	    $(".check").remove();
	    $(".up_list2").css({"display":"none"});
	    $("#more_btn").css({"display":"block"});
	});
	$("#mask").fadeOut();
    });
    $("#cancel_btn").click(function(){
	alert_close();
	$("#update_info_div").fadeOut(function(){
	    $(".check").remove();
	    $(".up_list2").css({"display":"none"});
	    $("#more_btn").css({"display":"block"});
	});
	$("#mask").fadeOut();
    });
    $("#addchild_exit").click(function(){
	$("#addchild_div").fadeOut();
	$("#mask").fadeOut();
    })
    //radio
    $(".radio").click(function(){
	$(".radio").attr("src","/static/element/add/del/3.png");
	$(this).attr("src","/static/element/add/del/4.png");
	radio_value = $(this).attr("alt");
    });
    $("#del_submit").click(function(){
	ajax_del();
    });
    $("#del_exit").click(function(){
	$("#mask").fadeOut();
	$("#del_div").fadeOut();
    });
    //changemode
    $("#change_mode").click(function(){
	if(family.mode == 1){
	    $("#modify_mode").css({"display":"block"});
	    family.mode = 2;
	    family.del_search();
	    $("#change_btn").animate({"left":"45px"},"fast");
	}
	else{
	    family.mode = 1;
	    $("#modify_mode").css({"display":"none"});
	    $("#modify-div").css({"display":"none"});
	    $("#change_btn").animate({"left":"2px"},"fast");
	}
    });
});
var screen_left=0,screen_top=0;
function Speed(left,top){
    this.left=left;//left为左移坐标
    this.top=top;//top为上移坐标
};
//返回min至max的随机值
function Random(min,max){
    return Math.random()*(max-min)+min;
}
//返回两点之间的距离
function Distance_point_point(x1,y1,x2,y2){
    var x=x1-x2;
    var y=y1-y2;
    return Math.sqrt(x*x+y*y);
}
//返回点到直线的距离『1』若点在直线下，返回正值『2』若点在直线上，返回负值
function Distance_line_point(x1,y1,x2,y2,x3,y3){//(x1,y1) and (x2,y2)构成直线
    if(x1==x2){
	if(x3>x1)return -Math.abs(x3-x1);
	else return Math.abs(x3-x1);
    }
    var k=(y2-y1)/(x2-x1);
    if(k*(x3-x1)+y1>y3)return -Math.abs(k*(x3-x1)+y1-y3)/Math.sqrt(k*k+1);
    return Math.abs(k*(x3-x1)+y1-y3)/Math.sqrt(k*k+1);
}
//返回点是否在直线外，负值为在直线外
function If_close_to_line(x1,y1,x2,y2,x3,y3){
    var xa=x1-x3;
    var ya=y1-y3;
    var xb=x1-x2;
    var yb=y1-y2;
    return (xa*xb+ya*yb);///Math.sqrt((xa*xa+ya*ya)*(xb*xb+yb*yb));
}
//根据点和直线的距离给出加速度
function Speed_line_point(x1,y1,x2,y2,x3,y3,width){
    var value=new Speed(0,0);
    return value;
    if(If_close_to_line(x1,y1,x2,y2,x3,y3)<0||If_close_to_line(x2,y2,x1,y1,x3,y3)<0)return value;
    var distance=Distance_line_point(x1,y1,x2,y2,x3,y3);
    if(distance>width)return value;
    var speed=(1-Math.abs(distance)/width)*20;
    if(distance<0)speed*=-1;
    //alert(distance)
    distance=Distance_point_point(x1,y1,x2,y2);
    speed/=distance;
    value.left=speed*(y1-y2);
    value.top=speed*(x1-x2);
    return value;
}
//根据两点之间的距离给出加速度
function Distance_move(x1,y1,x2,y2,remote){
    var value=new Speed();
    var r=1;
    //如果两点重合，让点获得随机的加速度
    if(x1==x2&&y1==y2){
	var sign=Random(0,4);
	if(sign<1){
	    value.left=Random(0,r);
	    value.top=Random(0,r);
	}
	else if(sign<2){
	    value.left=Random(0,r);
	    value.top=-Random(0,r)
	}
	else if(sign<3){
	    value.left=-Random(0,r);
	    value.top=Random(0,r);
	}
	else{
	    value.left=-Random(0,r);
	    value.top=-Random(0,r);
	}
	return value;
    }

    //如果两点有距离
    var distance=Distance_point_point(x1,y1,x2,y2);
    var speed=(1-distance/remote)*10;
    //如果距离太大则没有加速度
    if(speed<0){
	value.left=value.top=0;
	return value;
    }
    speed/=distance;
    value.left=speed*(x1-x2);
    value.top=speed*(y1-y2);
    return value;
}
var Distance = function(){};
Distance.prototype = {
    calculate: function(pointA,pointB){
	this['dx'] = pointA.left - pointB.left;
	this['dy'] = pointA.top - pointB.top;
	this['d2'] = (this['dx']*this['dx']+this['dy']*this['dy']);
	// Distance
	this['d'] = Math.sqrt(this['d2']);
    }
};
function Create_tension(x1,y1,x2,y2,remote){
    var distance=Distance_point_point(x1,y1,x2,y2);
    if(distance<remote){
	return false;
    }
    var value=new Speed(0,0);
    var speed=(distance/remote-1)*10;
    speed/=distance;
    value.left=speed*(x1-x2);
    value.top=speed*(y1-y2);
    return value;
}
function Distance_move_left(x1,y1,x2,y2){
    if(x1==x2&&y1==y2){
	var sign=Random(-1,1);
	if(sign<0)return -Random(0,10);
	return Random(0,10);
    }
    var distance=Distance_point_point(x1,y1,x2,y2);
    var speed=10-distance/30;
    if(speed<0)return 0;
    return speed*(x1-x2)/distance;
}
function Distance_move_top(x1,y1,x2,y2){
    if(x1==x2&&y1==y2){
	var sign=Random(-1,1);
	if(sign<0)return -Random(0,10);
	return Random(0,10);
    }
    var distance=Distance_point_point(x1,y1,x2,y2);
    var speed=10-distance/30;
    if(speed<0)return 0;
    return speed*(y1-y2)/distance;
}
function test_info(s){
    if(s==""||!s){
	return "N/A";
    }
    return s;
}
//树头，用来储存div元素
//******************id为div的id，(left,top)为div左边,node用来储存节点元素
function Tree_head(id,left,top,node){
    var that=this;
    this.tree_node=node;//用来储存节点元素
    this.left=left;
    this.top=top;
    this.id=id;
    this.node=node;
    this.width=this.node.family.width;
    
    //创建div
    this.create_head=function(){
	$("body").after("<div class='tree_head' id='"+that.id+"' style='left:"+that.left+"px;top:"+that.top+"px'>"+that.id+"</div>");
    };
    this.create_head_canvas=function(){
	var ctx=that.node.family.node_ctx;
	ctx.beginPath();
	//ctx.fillStyle="#FF0000";
	//ctx.fillRect(node.left,node.top,that.width,that.width);
	//ctx.drawImage(document.getElementById("img"),node.left,node.top,that.width,that.width*1.3225);
    };
    this.create_head_canvas();
    //this.create_head();

    //this.self=document.getElementById(that.id);
    /*
      this.self.onclick=function(){
      that.tree_node.create_node(4);
      };
    */

    //返回div的left和top，值为数字
    this.get_left=function(){
	return parseInt(that.self.style.left);
    };
    this.get_top=function(){
	return parseInt(that.self.style.top);
    };
}

//树节点
//*****left,top为实时的节点坐标，family储存整个family结构，father为这个树节点的父亲
function Tree_node(id,left,top,family,father,data){
    var that=this;

    //判断是否可产生子节点
    this.neighbors = 1;
    this.child=1;
    this.info = new Tree_node_info(data,family);
    this.id=id;
    this.left=left;
    this.top=top;
    this.family=family;
    this.father=father;
    this.birth=false;
    this.tree_head=new Tree_head(that.id,that.left,that.top,that);
    this.xmlhttp;
    this.loadXMLDoc=function(url){
	that.xmlhttp=null;
	if(window.XMLHttpRequest){
	    // code for Firefox, Opera, IE7, etc.
	    that.xmlhttp=new XMLHttpRequest();
	}
	else if(window.ActiveXObject){
	    // code for IE6, IE6
	    that.xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	if(that.xmlhttp!=null){
	    that.xmlhttp.onreadystatechange=that.state_Change;
	    that.xmlhttp.open("GET",url+"?mydata=haha",true);
	    that.xmlhttp.send(null);
	}
	else{
	    alert("Your browser does not support XMLHTTP.");
	}
    };
    this.state_Change=function(){
	if(that.xmlhttp.readyState==4){
	    //4 = "loaded"
	    if(that.xmlhttp.status==200){
		//200 = "OK"
		haha = JSON.parse(that.xmlhttp.responseText);
		alert(that.xmlhttp.responseText);
	    }
	    else{
		alert("Problem retrieving data:" + that.xmlhttp.statusText);
	    }
	}
    };
    
    //移动节点，并改变其left与top
    this.head_move=function(left,top){
	that.left+=left*2;
	that.top+=top*2;
	return true;
    };

    //创建节点
    this.create_node_canvas=function(number){
	that.neighbors += number;
	var count=0,angle ;
	var node_number=that.family.node_array.length;
	var x1,y1,x2,y2,distance;
	//如果为父不为空
	if(that.father!="none"){
	    x1=that.left;
	    y1=that.top;
	    x2=that.father.left;
	    y2=that.father.top;
	    distance=Distance_point_point(x1,y1,x2,y2);
	}
	//如果父为空（即第一个节点）
	else angle=Random(0,360)*0.017453293;
	for(;count<number;count++){
	    that.family.node_array[node_number+count]=new Tree_node(that.id+"_"+count,that.left,that.top,that.family,that);
	    //父不为空,以节点到节点父亲的反方向弹出新节点
	    if(that.father!="none"){
		var x=x1-x2,y=y1-y2;
		var speed=Random(1,10)/distance;
		var value=count-(number-1)/2-0.5;
		var emend_left=Random(value,value+1);
		var emend_top=Random(value,value+1);
		that.family.node_array[node_number+count].head_move(speed*x+emend_left/distance*y,speed*y-emend_top/distance*x);
	    }
	    //父为空（即第一个节点），平均方向弹出新节点
	    else{
		var speed=10;//Random(3,5);
		that.family.node_array[node_number+count].head_move(speed*Math.sin(angle),speed*Math.cos(angle));
		angle+=360/number*0.017453293;
	    }
	}
	//通过改变family的id来停止family.move_to_goodplace函数
	that.family.id+="0";
	
	//不可再点击
	that.tree_head.self.onclick="";
	that.birth=true;
	that.tree_head.self.style.border="dashed";

	//that.family.move_to_goodplace(that.family.id);
    };


    
}
function is_info(s){
    if(!s||s=="N/A")return false;
    return true;
}
function Tree_node_info(data,family){
    var that=this;
    this.family=family;
    
    //user data
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
    
    this.canvas = document.getElementById("node_info");
    this.ctx = this.canvas.getContext("2d");
    this.init = function(data){
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
	if(data.fields.students&&data.fields.students!="0")that.students=1;
	else that.students = 0;
	var len = that.family.node_array.length;
	if(fields.imgurl==""){
	    $("#hide").append("<img id='head_img_"+len+"' src='/static/element/head/default.png'/>");
	}
	else{
	    $("#hide").append("<img id='head_img_"+len+"' src='"+fields.imgurl+"' onerror='this.src=\"/static/element/head/default.png\"'/>");
	}
	document.getElementById("head_img_"+len).onload = function(){
	    that.img = document.getElementById("head_img_"+len);
	}
    };
    this.show_info=function(e){
	var left_fix = 25;
	that.ctx.clearRect(0,0,300,300);
	//that.ctx.font = "14px AxureHandwritingRegular";
	//write something
	that.ctx.drawImage(document.getElementById("info_head"),0,0);
	var info_mid = document.getElementById("info_mid");
	that.ctx.fillStyle="#f3e2aa";
		
	that.ctx.drawImage(info_mid,0,23);
	that.ctx.drawImage(info_mid,0,28);
	that.ctx.drawImage(info_mid,0,33);

	that.ctx.fillStyle="#252525";
	that.ctx.fillRect(24,30,180,4);
	that.ctx.stroke();
	that.ctx.fillStyle="#252525";
	var write_pos=50;
	var write_height=15;
	that.ctx.font = "20px AxureHandwritingRegular";

	var name;
	if(test_info(that.name_middle)!="N/A"){
	    name = that.name_first+" "+that.name_middle+" "+that.name_last;
	}
	else name = that.name_first+" "+that.name_last;
	
	that.ctx.fillText(name,left_fix,30);
	that.ctx.stroke();
	that.ctx.font = "14px AxureHandwritingRegular";
	if(0&&that.name!="0"){
	    that.ctx.fillText(that.name,left_fix,write_pos);
	    write_pos+=write_height;
	}
	var info_content = new Array(that.email,that.homepage,that.s_id,that.D_name,that.D_insti,that.D_year,that.D_depart,that.title,that.organization,that.other_info,that.keyword,that.mentor,that.mentee,that.coll);
	var info_name = new Array("Email","Homepage","S_id","PhD","Institution","Year","Subject","Position","Organization","Miscellaneous","Description","Mentor","Mentee","Collaborators");
	var count = 0;
	var len = info_content.length;
	for(;count<len;count++){
	    if(test_info(info_content[count])!="N/A"){
		var str = info_name[count]+": "+test_info(info_content[count]);
		var str_len = Math.ceil(str.length/20);
		for(var j = 0;j<str_len;j++){
		    that.ctx.drawImage(info_mid,0,write_pos-12);
		    that.ctx.drawImage(info_mid,0,write_pos-7);
		    that.ctx.drawImage(info_mid,0,write_pos-2);
		    that.ctx.fillText(str.substring(j*20,j*20+20),left_fix,write_pos);
		    write_pos+=write_height;
		}
	    }
	}
	that.ctx.drawImage(document.getElementById("info_footer"),0,write_pos-12);
	/*
	if(is_info(that.email)){
	    if(that.email.length>16){
		var s1 = that.email.substring(0,16);
		var s2 = that.email.substring(16,that.email.length);
		that.ctx.fillText("Email: "+s1,left_fix,write_pos);
		that.ctx.fillText(s2,left_fix,write_pos+write_height);
		write_pos+=write_height;
	    }
	    else{
		that.ctx.fillText("Email: "+that.email,left_fix,write_pos);
		write_pos+=write_height;
	    }
	}
	if(is_info(that.homepage)){
	    that.ctx.fillText(that.homepage,left_fix,write_pos);
	    write_pos+=write_height;
	}
	if(is_info(that.s_id)){
	    that.ctx.fillText(that.s_id,left_fix,write_pos);
	    write_pos+=write_height;
	}
	if(is_info(that.D_name)){
	    that.ctx.fillText(that.D_name,left_fix,write_pos);
	    write_pos+=write_height;
	}
	if(is_info(that.D_insti)){
	    that.ctx.fillText(that.D_insti,left_fix,write_pos);
	    write_pos+=write_height;
	}
	if(is_info(that.D_year)){
	    that.ctx.fillText(that.D_year,left_fix,write_pos);
	    write_pos+=write_height;
	}
	if(is_info(that.D_depart)){
	    that.ctx.fillText(that.D_depart,left_fix,write_pos);
	    write_pos+=write_height;
	}
	if(0&&is_info(that.title)){
	    that.ctx.fillText(that.title,left_fix,write_pos);
	    write_pos+=write_height;
	}
	if(is_info(that.organization)){
	    that.ctx.fillText(that.organization,left_fix,write_pos);
	    write_pos+=write_height;
	}
	if(is_info(that.other_info)){
	    that.ctx.fillText(that.other_info,left_fix,write_pos);
	    write_pos+=write_height;
	}
	if(is_info(that.keyword)){
	    that.ctx.fillText(that.keyword,left_fix,write_pos);
	    write_pos+=write_height;
	}
	if(is_info(that.mentor)){
	    that.ctx.fillText(that.mentor,left_fix,write_pos);
	    write_pos+=write_height;
	}
	if(is_info(that.mentee)){
	    that.ctx.fillText(that.mentee,left_fix,write_pos);
	    write_pos+=write_height;
	}
	if(is_info(that.coll)){
	    that.ctx.fillText(that.coll,left_fix,write_pos);
	    write_pos+=write_height;
	}
	*/
	that.canvas.style.left = mouse_l+5;//e.clientX+5;
	that.canvas.style.top = mouse_t+5;//e.clientY+5;
	//that.canvas.style.opacity=1;
	//alert("");
    };
    this.update_info = function(){
	
	$("#update_info_div").fadeIn();
	$("#up_id").html(this.pk);
	$("#"+name_arr[0]+"-input").attr("value",test_info(this.name_first));
	$("#"+name_arr[1]+"-input").attr("value",test_info(this.name_middle));
	$("#"+name_arr[2]+"-input").attr("value",test_info(this.name_last));
	$("#"+name_arr[3]+"-input").attr("value",test_info(this.imgurl));
	$("#"+name_arr[4]+"-input").attr("value",test_info(this.homepage));
	$("#"+name_arr[5]+"-input").attr("value",test_info(this.D_name));
	$("#"+name_arr[6]+"-input").attr("value",test_info(this.D_insti));
	$("#"+name_arr[7]+"-input").attr("value",test_info(this.D_year));
	$("#"+name_arr[8]+"-input").attr("value",test_info(this.D_depart));
	$("#"+name_arr[9]+"-input").attr("value",test_info(this.title));
	$("#"+name_arr[10]+"-input").attr("value",test_info(this.keyword));
	$("#"+name_arr[11]+"-input").attr("value",test_info(this.other_info));
	$("#"+name_arr[12]+"-input").attr("value",test_info(this.mentor));
	$("#"+name_arr[13]+"-input").attr("value",test_info(this.mentee));
	$("#"+name_arr[14]+"-input").attr("value",test_info(this.coll));
	$("#"+name_arr[15]+"-input").attr("value",test_info(this.organization));
    };
    if(data=="search"){
	that.pk = "";
	that.name_first = "Search";
	that.name_middle = "";
	that.name_last = "";
	that.s_id = "";
	that.D_name = "";
	that.D_year = "";
	that.D_insti = "";
	that.D_depart = "";
	that.email = "";
	that.organization = "";
	that.imgurl = 0;//fields.imgurl;
	that.homepage = "";
    }
    else if(data)this.init(data);
    else{
	that.pk = 1;
	that.name_first = "Academia";
	that.name_middle = "";
	that.name_last = "Root";
	that.s_id = "101";
	that.D_name = "";
	that.D_year = "";
	that.D_insti = "";
	that.D_depart = "";
	that.email = "email@163.comwwwwwww";
	that.organization = "";
	that.imgurl = 0;//fields.imgurl;
	that.homepage = "";
	that.mentee = "";
    }
};

//家庭数据结构--->包含node树节点--->包含head树头
//******id为第一个node的id，(left,top)为第一个node的坐标
function Family(id,left,top){
    var that=this;
    
    this.mode = 1;//mode:1为普通模式 2为修改模式
    //判断是否可产生节点
    //使用canvas来画出连线
    this.selected_node = 0;
    this.canvas=document.getElementById("node_canvas");
    this.ctx=this.canvas.getContext("2d");
    this.info_canvas=document.getElementById("node_info");
    //解决信息框不消失的bug
    if(this.info_canvas.addEventListener){
	this.info_canvas.addEventListener("mouseover",function(){
	    //alert("");
	    //that.info_canvas.style.opacity=0;
	    that.info_canvas.style.display="none";
	},false);
    }
    this.node_canvas=document.getElementById("node_canvas");
    this.node_ctx=this.node_canvas.getContext("2d");

    this.id=id;
    this.left=left;
    this.top=top;

    this.show_by_line=null;

    this.img_fix_top=10;
    this.img_fix_left=19;
    this.width=200;
    this.height=234;
    this.half_width=this.width/2;
    this.half_height=this.height/2;
    this.remote=this.width*5;
    this.banner_width=166;
    this.banner_height=166;
    this.diswidth_banner_body=(this.banner_width-this.width)/2;
    this.disheight_banner_body=130;

    this.xmlhttp;

    //创建第一个node，并将其储存在node_array中，便于操作
    this.xmldata = "UniqueStudio";
    this.node_array=new Array(new Tree_node(that.id,that.left,that.top,that,"none"));
    //this.node_info_array = new Array(new Tree_node_info());
    //对应于node_array中相应node需要移动的left值、top值
    this.node_move_left=new Array();
    this.node_move_top=new Array();

    this.mouse_near_head=function(event){
	var cX=event.clientX,cY=event.clientY;
	var len=that.node_array.length;
	var head=null;
	var node_dx,node_dy;
	var distance=that.width;
	for(var count=0;count<len;count++){
	    if(count<that.start&&count>1)continue;
	    if(count==1&&that.start<0)continue;
	    node_dx=Math.abs(that.node_array[count].left+that.half_width-cX);//为什么是that.width呢 我真搞不清楚
	    node_dy=Math.abs(that.node_array[count].top+that.half_height-cY);
	    //alert(node_dx+","+node_dy);
	    if(node_dx<that.half_width&&node_dy<that.half_width){
		distance=node_dx+node_dy;
		head=that.node_array[count];
		$("body").css({"cursor":"pointer"});
	    }
	}
	that.map_node = head;
	if(!head){
	    $("body").css({"cursor":"default"});
	}
	return head;
    };

    this.node=null;
    this.loadXMLDoc=function(event,n){
	that.xmlhttp=null;
	if(window.XMLHttpRequest){
	    // code for Firefox, Opera, IE7, etc.
	    that.xmlhttp=new XMLHttpRequest();
	}
	else if(window.ActiveXObject){
	    // code for IE6, IE6
	    that.xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	var node;
	if(n)node = n;
	else node = that.mouse_near_head(event);
	that.node = node;
	if(that.xmlhttp!=null){
	    if(that.node==null||!that.node.child)return 0;
	    alert_open("Please wait");
	    if(!that.node.info.students){//&&that.node.father!="none"
		//alert_open("Sorry，此人没有小弟！");
		//setTimeout(alert_close,2000);
		//return 0;
	    }
	    that.xmlhttp.onreadystatechange=that.state_Change;
	    that.xmlhttp.open("GET","/givebranch?mydata="+node.info.pk,true);
	    that.xmlhttp.send(null);
	    var event = window.event||event;
	    //that.node=that.mouse_near_head(event);
	}
	else{
	    alert("Your browser does not support XMLHTTP.");
	}
    };
    this.state_Change=function(){
	if(that.xmlhttp.readyState==4){
	    //4 = "loaded"
	    alert_close();
	    if(that.xmlhttp.status==200){
		if(that.xmlhttp.responseText == "none"){
		    setTimeout(alert_open,1050,"No mentee yet.");
		    setTimeout(alert_close,2500);
		    return 0;
		}
		haha = JSON.parse(that.xmlhttp.responseText);
		if(haha.length)that.create_node_canvas(haha);
	    }
	    else{
		alert("Problem retrieving data:" + that.xmlhttp.statusText);
	    }
	}
    };

    this.now_info = null;
    this.update_bool = false;
    this.update_info = function(){
	var node = that.selected_node;
	if(node){
	    if(node.info.pk==1){
		alert_open("This node can't be edited");
		setTimeout(alert_close,2000);
		return 0;
	    }
	    $("#mask").fadeIn();
	    that.update_bool = true;
	    node.info.update_info();
	}
	else{
	    that.show_by_line = null;
	    that.info_canvas.style.opacity=0;
	    that.info_canvas.display="none";
	}
    };
    this.connect_node;
    this.connect = function(){
	if(that.connect_node == that.selected_node){
	    alert_close();
	    that.connect_node = 0;
	    setTimeout(alert_open,700,"Error");
	    setTimeout(alert_close,2200);
	    return 0;
	}
	else if(that.connect_node.father == that.selected_node){
	    alert_close();
	    that.connect_node = 0;
	    setTimeout(alert_open,700,"No change");
	    setTimeout(alert_close,2200);
	    return 0;
	}
	var con_xmlhttp;
	var f_id = that.selected_node.info.pk;
	var c_id = that.connect_node.info.pk;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
	    con_xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
	    con_xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	con_xmlhttp.onreadystatechange=function(){
	    if (con_xmlhttp.readyState==4 && con_xmlhttp.status==200){
		var data = con_xmlhttp.responseText;
		//haha = JSON.parse(data);
		if(data=="success"){
		    var node = that.selected_node;
		    var m_arr = that.connect_node.father.info.mentee.split(","),id = that.connect_node.info.pk,m_str="";
		    for(var i in m_arr){
			if(m_arr[i] == id){
			    continue;
			}
			m_str += m_arr[i] + ",";
		    }
		    m_str = m_str.substring(0,m_str.length-1);

		    that.connect_node.father.info.mentee = m_str;
		    that.connect_node.father = node;
		    that.connect_node.info.mentor = that.selected_node.info.pk;
		    if(that.selected_node.info.mentee==""){
			that.selected_node.info.mentee += that.connect_node.info.pk;
		    }
		    else that.selected_node.info.mentee += ","+that.connect_node.info.pk;
		    that.connect_node = 0;
		}
		else{
		    alert("error");
		}
	    }
	}
	con_xmlhttp.open("GET","/con?f_id="+f_id+"&c_id="+c_id,true);
	con_xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	con_xmlhttp.send();
	return false; 
    };
    this.change_connect = function(){
	var node = that.selected_node;
	if(node){
	    if(node.info.pk==1){
		alert_open("This node can't be changed");
		setTimeout(alert_close,2000);
		return 0;
	    }
	    that.connect_node = that.selected_node;
	    alert_open("Please select mentor node");
	}
    };
    this.del_node = function(){
	var node = that.selected_node;
	if(node){
	    if(node.info.pk==1){
		alert_open("This node can't be deleted");
		setTimeout(alert_close,2000);
		return 0;
	    }
	    $("#mask").fadeIn();
	    $("#del_div").fadeIn();
	}
    };
    this.show_info=function(event){
	var node=that.mouse_near_head(event);
	if(node){
	    //node.info.show_info(event);
	    var object = document.getElementById("node_info");
	    object.style.display="block";
	    that.show_by_line = node;
	    if(object.style.opacity==0)canvas_openup("node_info",300,229,300,node,event);
	    else if(object.style.opacity==1)node.info.show_info(event);
	    

	}
	else{
	    that.show_by_line = null;
	    that.info_canvas.style.opacity=0;
	    that.info_canvas.display="none";
	}
    };
    this.clear_mentee = function(){
	var count = that.node_array.length-1;
	for(;count>-1;count--){
	    that.node_array[count].info.mentee = "";
	}
    };
    this.clear_mentee_last = function(){
	var count = that.node_array.length-1;
	for(;count>-1;count--){
	    var info = that.node_array[count].info;
	    var str = info.mentee;
	    var i = str.length-1;
	    for(;str[i]==",";i--){}
	    info.mentee = info.mentee.substring(0,i+1);
	}
    };
    this.set_MM = function(){
	that.clear_mentee();
	var count = that.node_array.length-1;
	for(;count>0;count--){
	    var node = that.node_array[count];
	    node.father.info.mentee += node.info.pk+",";
	    node.info.mentor = node.father.info.pk;
	}
	that.clear_mentee_last();
    };
    this.has_father = function(child,node){
	for(child=child.father;child.father!="none";child = child.father){
	    if(child == node)return 1;
	}
	return 0;
    };
    this.delNodeById = function(id,type){
	var count = 0;
	var len = that.node_array.length;
	for(;count<len;count++){
	    if(id==that.node_array[count].info.pk){
		if(type==1){
		    var i = 2;
		    while(i<len){
			if(that.has_father(that.node_array[i],that.node_array[count])){
			    that.node_array.splice(i,1);
			    that.node_move_top.pop();
			    that.node_move_left.pop();
			    len--;
			}
			else {
			    i++;
			}
		    }
		}
		else{
		    var i = 0;
		    for(;i<len;i++){
			if(that.node_array[i].father == that.node_array[count]){
			    that.node_array[i].father = that.node_array[count].father;
			}
		    }
		}
		that.node_array.splice(count,1);
		that.node_move_top.pop();
		that.node_move_left.pop();
		that.set_MM();
		$("#mask").fadeOut();
		$("#del_div").fadeOut();
		$("#modify-div").fadeOut();
		break;
	    }
	}
	return false;
    };

    this.getNodeById = function(id){
	var count = 0;
	var len = that.node_array.length;
	for(;count<len;count++){
	    if(id==that.node_array[count].info.pk)return that.node_array[count];
	}
	return false;
    };
    this.create_node_canvas=function(data,add){
	if(data.length==0)return 0;
	var node = that.node;
	var number = data.length;
	if(!node.child&&!add)return 0;
	node.child=0;
	var count=0,angle ;
	var node_number=that.node_array.length;

	var x1,y1,x2,y2,distance;
	//如果为父不为空
	if(node.father!="none"){
	    x1=node.left;
	    y1=node.top;
	    x2=node.father.left;
	    y2=node.father.top;
	    distance=Distance_point_point(x1,y1,x2,y2);
	}
	//如果父为空（即第一个节点）
	else angle=Random(0,360)*0.017453293;
	angle=Random(0,360)*0.017453293;
	for(;count<number;count++){
	    node.family.node_array[node_number+count]=new Tree_node(node.id+"_"+count,node.left,node.top,node.family,node,data[count]);
	    //父不为空,以节点到节点父亲的反方向弹出新节点
	    if(0&&node.father!="none"){
		var x=x1-x2,y=y1-y2;
		var speed=Random(5,10)/distance;
		var value=count-(number-1)/2-0.5;
		var emend_left=Random(value,value+1);
		var emend_top=Random(value,value+1);
		node.family.node_array[node_number+count].head_move(speed*x+emend_left/distance*y,speed*y-emend_top/distance*x);
	    }
	    //父为空（即第一个节点），平均方向弹出新节点
	    else{
		var speed=Random(1,5)*10;
		node.family.node_array[node_number+count].head_move(speed*Math.sin(angle),speed*Math.cos(angle));
		angle+=360/number*0.017453293;
	    }
	}
	//通过改变family的id来停止family.move_to_goodplace函数
	node.family.id+="0";
	
	//不可再点击
	//that.tree_head.self.onclick="";
	node.birth=true;
	//node.tree_head.self.style.border="dashed";

	//node.family.move_to_goodplace(node.family.id);
    };

    //描绘树头之间连线的函数
    this.line_width=5;
    this.line_bg_width=2;
    this.fix_branch=function(){
	var len=that.node_array.length;
	//that.ctx.beginPath();
	var height=that.height-15;
	var my_fix = 2*that.height/that.o_height;
	that.ctx.strokeStyle="#ffffff";
	for(var count=100000;count<len;count++){
	    if(count<that.start&&count>1)continue;
	    if(count==1&&that.start<0)continue;
	    if(that.node_array[count].father=="none")continue;
	    that.ctx.beginPath();
	    that.ctx.lineWidth=that.line_bg_width;
	    that.ctx.moveTo(that.node_array[count].left+that.half_width+my_fix,that.node_array[count].top+height+my_fix);
	    that.ctx.lineTo(that.node_array[count].father.left+that.half_width+my_fix,that.node_array[count].father.top+height+my_fix);
	    that.ctx.stroke();
	}
	that.ctx.save();
	//that.ctx.strokeStyle="#dadada";
	that.ctx.strokeStyle = "#b5d6ff";
	for(var count=0;count<len;count++){
	    if(count<that.start&&count>1)continue;
	    if(count==1&&that.start<0)continue;
	    if(that.node_array[count].father=="none")continue;
	    that.ctx.beginPath();
	    that.ctx.lineWidth=that.line_width;
	    that.ctx.moveTo(that.node_array[count].left+that.half_width,that.node_array[count].top+height);
	    that.ctx.lineTo(that.node_array[count].father.left+that.half_width,that.node_array[count].father.top+height);
	    that.ctx.stroke();
	}
	if(that.show_by_line){
	    var node = that.show_by_line;
	    that.ctx.strokeStyle="#b5d6ff";
	    //alert(node.info.name);
	    that.ctx.beginPath();
	    that.ctx.lineWidth=that.line_width*3;
	    for(;node!="none";node=node.father){
		that.ctx.moveTo(node.left+that.half_width,node.top+height);
		that.ctx.lineTo(node.father.left+that.half_width,node.father.top+height);
		that.ctx.stroke();
	    }
	}
	that.ctx.stroke();
	that.ctx.restore();
    };
    

    //将node_move_left与node_move_top清空的函数
    this.r = 69;
    this.head_move_canvas=function(){
	that.node_ctx.clearRect(0,0,4000,5000);
	var len=that.node_array.length;
	var img;
	var fac = that.width/that.o_width;
	if(fac==1){
	    img = document.getElementById("img");
	}
	else if(fac==0.5){
	    img = document.getElementById("img_small");
	}
	else{
	    img = document.getElementById("img_small2");
	}
	var banner = document.getElementById("banner");
	var fix1=8,fix2=8;
	var ljt = document.getElementById("ljt");
	var font_size = 24*fac;
	//alert(font_size);
	var font_fix_left = 15*fac;
	var font_fix_top = 191*fac;
	var document_height=document.documentElement.clientHeight;
	var document_width=document.documentElement.clientWidth;
	for(var count=0;count<len;count++){
	    if(count<that.start&&count>1)continue;
	    if(count==1&&that.start<0)continue;
	    var node=that.node_array[count];
	    that.node_ctx.fillStyle="#656c74";
	    if(node.left>document_width||node.top>document_height||node.left<-that.width||node.top<-that.height)continue;
	    if(node.info.img){
		that.node_ctx.drawImage(node.info.img,node.left+that.img_fix_left,node.top+that.img_fix_top,that.banner_width,that.banner_height);
	    }
	}
	that.node_ctx.beginPath();
	that.node_ctx.fillStyle="white";
	for(var count=0;count<len;count++){
	    if(count<that.start&&count>1)continue;
	    if(count==1&&that.start<0)continue;
	    var node=that.node_array[count];
	    that.node_ctx.arc(node.left+100*fac,node.top+90*fac,84*fac,0,Math.PI*2,false);
	    that.node_ctx.closePath();
	}
	that.node_ctx.globalCompositeOperation = "destination-in";
	that.node_ctx.fill();
	that.node_ctx.globalCompositeOperation = "destination-over";
	that.fix_branch();
	that.node_ctx.globalCompositeOperation = "source-over";
	var name;
	for(var count=0;count<len;count++){
	    if(count<that.start&&count>1)continue;
	    if(count==1&&that.start<0)continue;
	    var node=that.node_array[count];
	    that.node_ctx.drawImage(img,node.left,node.top,that.width,that.height);	   
	    that.node_ctx.font = font_size+"px AxureHandwritingRegular";
	    that.node_ctx.textAlign="center";
	    if(test_info(node.info.name_middle)!="N/A"){
		name = node.info.name_first+" "+node.info.name_middle+" "+node.info.name_last;
	    }
	    else name = node.info.name_first+" "+node.info.name_last;
	    that.node_ctx.fillStyle="#656c74";
	    that.node_ctx.fillText(name,node.left+that.half_width,node.top+font_fix_top);
	}
    };
    this.node_move_init=function(){
	var len=that.node_array.length;
	for(var count=0;count<len;count++){
	    that.node_move_top[count]=that.node_move_left[count]=0;
	}
    };
    this.attractiveForce = function(I,J,distance){
	var fac = 8*that.width/that.o_width;
	var weight = (55 + (3 * (that.node_array[I].neighbors+that.node_array[J].neighbors)))*fac;
	if(weight){
	    var attractive_force = (distance['d'] - weight)/weight*fac;
	    if(I){
		that.node_move_left[I] -= attractive_force * distance['dx'] / distance['d'];
		that.node_move_top[I] -= attractive_force * distance['dy'] / distance['d'];
	    }
	    if(J){
		that.node_move_left[J] += attractive_force * distance['dx'] / distance['d'];
		that.node_move_top[J] += attractive_force * distance['dy'] / distance['d'];
	    }
	}
    };
    this.gravity = 96;
    this.mass = 3;
    this.max_distance = 512;
    this.repulsiveForce = function( I, J, distance ) {
	//   force = gravity*(mass1*mass2)/distance^2.
	var fac = 8*that.width/that.o_width;
	var repulsive_force=that.gravity*that.mass*that.mass/distance['d2'];
	var df = that.max_distance*fac-distance['d'];
	if ( df > 0 ) {
	    repulsive_force *= (Math.log(df)*fac);
	}
	
	if ( repulsive_force < 1024*fac ) {
	    if(I){
		that.node_move_left[I] += repulsive_force * distance['dx'] / distance['d'];
		that.node_move_top[I] += repulsive_force * distance['dy'] / distance['d'];
	    }
	}
    };
    this.originForce = function( I, distance ) {
	var fac = 8*that.width/that.o_width;
	if ( that.node_array[I].father.father=="none" ) {
	    var weight = 44*fac;
	    var attractive_force = (distance['d'] - weight)/weight;
	    that.node_move_left[I] += attractive_force * (distance['dx'] / distance['d']);
	    that.node_move_top[I] += attractive_force * (distance['dy'] / distance['d']);
	} 
	else {
	    var repulsive_force=that.gravity*that.mass*that.mass/distance['d2']*fac;
	    var df = that.max_distance*fac-distance['d'];
	    if ( df > 0 ) {
		repulsive_force *= (Math.log(df)*fac);
	    }
	    if ( repulsive_force < 1024*fac ) {
		that.node_move_left[I] -= repulsive_force * distance['dx'] / distance['d'];
		that.node_move_top[I] -= repulsive_force * distance['dy'] / distance['d'];
	    }
	}
    };
    //计算移动速度的函数，并将速度储存于node_move_left与node_move_top
    this.calculate_speed=function(){
	that.node_move_init();
	var len = that.node_array.length;
	for(var i = 0;i<len;i++){
	    var nodeI = that.node_array[i];
	    for(var j=0;j<len;j++){
		var nodeJ = that.node_array[j];
		var distance = new Distance;
		distance.calculate(nodeI,nodeJ);
		if(nodeI == nodeJ.father){
		    that.attractiveForce(i,j,distance);
		}
		that.repulsiveForce(i,j,distance);
	    }
	    var distance = new Distance;
	    distance.calculate(that.node_array[0],that.node_array[i]);
	    if(i)that.originForce(i,distance);
	}
	if(that.selected_node!=0){
	    for(var i = 0;i<len;i++){
		var node = that.node_array[i];
		if(node==that.selected_node){
		    that.node_move_top[i]=0;
		    that.node_move_left[i]=0;
		    break;
		}
	    }
	}
	return 1;
    };

    //移动所有节点
    this.move_to_goodplace=function(id){
	if(!that.calculate_speed())return 0;
	//如果id变化则停止
	//if(id!=that.id)return 0;
	//绘画连线
	//that.head_move_canvas();
	that.head_move_canvas();
	var len=that.node_array.length;
	var count=0;
	for(;count<len;count++){
	    setTimeout(that.node_array[count].head_move,50,that.node_move_left[count],that.node_move_top[count]);
	}
	//循环运行move_to_goodplace函数
	setTimeout(that.move_to_goodplace,100,id);
    };
    this.all_move=function(left,top){
	var len=that.node_array.length;
	var count=0;
	for(;count<len;count++){
	    that.node_array[count].head_move(left,top);
	}
    };

    //实现鼠标滚轮缩放功能
    this.wheel_scale=function(e){
	e.stopPropagation();
	e.preventDefault();
	var e=window.event||e;
	var detail=e.wheelDelta || -e.detail;
	var factor;
	if(detail>0){
	    factor=2;
	}
	else factor=0.5;
	//	alert(that.width);
	if(that.width<38.75&&factor==0.5){
	    return 0;
	};
	if(that.width>that.o_width/2&&factor==2){
	    return 0;
	}
	that.width*=factor;
	that.height*=factor;
	that.img_fix_top*=factor;
	that.img_fix_left*=factor;
	that.r*=factor;
	that.half_width*=factor;
	that.half_height*=factor;
	that.remote*=factor;
	that.banner_width*=factor;
	that.banner_height*=factor;
	that.diswidth_banner_body*=factor;
	that.disheight_banner_body*=factor;
	that.line_width*=factor;
	that.line_bg_width*=factor;
	var count=0,len=that.node_array.length;
	var left=e.clientX,top=e.clientY;
	if(factor<1){
	    for(;count<len;count++){
		that.node_array[count].left=(that.node_array[count].left+left)*factor;
		that.node_array[count].top=(that.node_array[count].top+top)*factor;
	    }
	}
	else{
	    for(;count<len;count++){
		that.node_array[count].left=left+factor*(that.node_array[count].left-left);//2*that.node_array[count].left-left;
		that.node_array[count].top=top+factor*(that.node_array[count].top-top);//2*that.node_array[count].top-top;
	    }
	}
	//that.head_move_canvas();
	that.head_move_canvas();
	if(that.mode==2){
	    if(that.selected_node == 0)return 0;
	    var node = that.selected_node;
	    $("#modify-div").css({"display":"block",
				  "left":(node.left+that.half_width-56),
				  "top":(node.top-40)});
	}
    };

    this.mouse_status=0;
    this.mouse_down_x;
    this.mouse_down_Y;
    this.mouse_down = function(event){
	if(event.button)return 0;//鼠标左键为0
	that.mouse_status = 1;
	that.mouse_down_x = event.clientX;
	that.mouse_down_y = event.clientY;
    };
    this.mouse_up = function(event){
	if(that.mouse_status==1){
	    that.mouse_status = 0;
	    if(that.start==-1&&that.mode==1){
		that.loadXMLDoc(event);
	    }
	    else if(that.mode==2){
		var node = that.mouse_near_head(event);
		if(node==null)return 0;
		that.selected_node = node;
		if(that.connect_node){
		    that.connect();
		    return 0;
		}
		$("#modify-div").css({"display":"block",
				      "left":(node.left+that.half_width-56),
				      "top":(node.top-40)});
		//that.update_info(event);
	    }
	}
	$("body").css({"cursor":"default"});
	that.mouse_status = 0;
    };
    this.map_move = function(event){
	//if(that.mode==2)return 0;
	if(that.mouse_status){
	    $("body").css({"cursor":"move"});
	    that.mouse_status = 2;
	    var slow = 1;
	    //alert(that.mouse_down_x-event.clientX);
	    that.all_move((event.clientX-that.mouse_down_x)/slow,(event.clientY-that.mouse_down_y)/slow);
	    //that.head_move_canvas();
	    that.head_move_canvas();
	    that.mouse_down_x = event.clientX;
	    that.mouse_down_y = event.clientY;
	    //that.all_move(10,10);
	    if(that.mode==2){
		if(that.selected_node == 0)return 0;
		var node = that.selected_node;
		$("#modify-div").css({"display":"block",
				      "left":(node.left+that.half_width-56),
				      "top":(node.top-40)});
	    }
	}
    };
    if(this.node_canvas.addEventListener){
	//Chrome
	this.node_canvas.addEventListener("mousewheel",this.wheel_scale,false);
	//Firefox
	this.node_canvas.addEventListener("DOMMouseScroll",this.wheel_scale,false);

	//	this.node_canvas.addEventListener("click",this.create_node_canvas,false);
	//this.node_canvas.addEventListener("click",this.loadXMLDoc,false);
	this.node_canvas.addEventListener("mousemove",this.show_info,false);
	this.node_canvas.addEventListener("mousemove",get_position,false);
	this.node_canvas.addEventListener("mousedown",this.mouse_down,false);
	this.node_canvas.addEventListener("mouseup",this.mouse_up,false);
	this.node_canvas.addEventListener("mousemove",this.map_move,false);
	//document.addEventListener("mousedown",this.mouse_down,false);
	//document.addEventListener("mouseup",this.mouse_up,false);
	//document.addEventListener("mousemove",this.map_move,false);
    }

    this.search = function(){
	var value = document.getElementById("search_input").value;
	var search_type = document.getElementById("selects").value;
	if(search_type != "name"){
	    that.search_Info();
	    return 0;
	}
	var len = that.node_array.length;
	var yes = 0;
	for(var count=0;count<len;count++){
	    if(that.node_array[count].info.name == value){
		//while(that.orginal()!=0){}
		if(that.width<that.o_width/4){
		    var x = that.node_array[count].left - document.documentElement.clientWidth/2+that.width/2;
		    var y = that.node_array[count].top - document.documentElement.clientHeight/2+that.height/2;
		    //that.all_move(-x,-y);
		    var times = 10;//Math.ceil(Math.log(that.o_width/that.width)/Math.log(1.18))
		    that.we_enlarge(-x/times,-y/times,times,that.node_array[count]);
		}
		else{
		    that.action_ensmall(that.node_array[count],1);
		}
		yes = 1;
		break;
	    }
	}
	if(!yes){
	    alert_open("~ 搜索中 ~");
	    that.search_inDB(value);
	    //that.action_ensmall(that.node_array[len-1],value);
	    //that.search_inDB(value);
	}
    };
    this.search_Info = function(value){
	var type = document.getElementById("selects").value;
	var value = document.getElementById("search_input").value;

	var searchinfo_xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
	    searchinfo_xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
	    searchinfo_xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	searchinfo_xmlhttp.onreadystatechange=function(){
	    if (searchinfo_xmlhttp.readyState==4 && searchinfo_xmlhttp.status==200){
		var data = searchinfo_xmlhttp.responseText;
		if(data=="[]"){
		    alert_open("Nothing related");
		    setTimeout(alert_close,2000);
		    return 0;
		}
		that.make_searchinfo_data(JSON.parse(data));
	    }
	}
	searchinfo_xmlhttp.open("GET","/searchinfo?type="+type+"&value="+value,true);
	searchinfo_xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	searchinfo_xmlhttp.send();
	return false; 
    };
    this.start=-1;
    this.make_searchinfo_data = function(data){
	if(that.start!=-1)that.del_search();
	if(data.length==0)return 0;
	that.node_array[1].info.name = $("#selects").val()+":"+$("#search_input").val();
	var node = that.node_array[1];
	var number = data.length;
	var count=0,angle ;
	var node_number=that.node_array.length;
	that.start = node_number;

	var x1,y1,x2,y2,distance;
	//如果为父不为空
	if(node.father!="none"){
	    x1=node.left;
	    y1=node.top;
	    x2=node.father.left;
	    y2=node.father.top;
	    distance=Distance_point_point(x1,y1,x2,y2);
	}
	//如果父为空（即第一个节点）
	else angle=Random(0,360)*0.017453293;
	angle=Random(0,360)*0.017453293;
	for(;count<number;count++){
	    node.family.node_array[node_number+count]=new Tree_node(node.id+"_"+count,node.left,node.top,node.family,node,data[count]);
	    //父不为空,以节点到节点父亲的反方向弹出新节点
	    if(0&&node.father!="none"){
		var x=x1-x2,y=y1-y2;
		var speed=Random(5,10)/distance;
		var value=count-(number-1)/2-0.5;
		var emend_left=Random(value,value+1);
		var emend_top=Random(value,value+1);
		node.family.node_array[node_number+count].head_move(speed*x+emend_left/distance*y,speed*y-emend_top/distance*x);
	    }
	    //父为空（即第一个节点），平均方向弹出新节点
	    else{
		var speed=Random(1,5)*10;
		node.family.node_array[node_number+count].head_move(speed*Math.sin(angle),speed*Math.cos(angle));
		angle+=360/number*0.017453293;
	    }
	}
	//通过改变family的id来停止family.move_to_goodplace函数
	node.family.id+="0";
	
	//不可再点击
	//that.tree_head.self.onclick="";
	node.birth=true;
    };
    this.del_search = function(){
	if(that.start==-1)return 0;
	var count = that.node_array.length-that.start;
	that.node_array.splice(that.start,count);
	that.node_move_top.splice(that.start,count);
	that.node_move_left.splice(that.start,count);
	that.start = -1;
    };
    

    
    this.search_inDB = function(value){
	that.s_loadXMLDoc(value);
    };
    
    this.s_xmlhttp;
    this.s_loadXMLDoc=function(value){
	that.s_xmlhttp=null;
	if(window.XMLHttpRequest){
	    // code for Firefox, Opera, IE7, etc.
	    that.s_xmlhttp=new XMLHttpRequest();
	}
	else if(window.ActiveXObject){
	    // code for IE6, IE6
	    that.s_xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	if(that.s_xmlhttp!=null){
	    that.s_xmlhttp.onreadystatechange=that.s_state_Change;
	    that.s_xmlhttp.open("GET","/search?mydata="+value,true);
	    that.s_xmlhttp.send(null);
	    //that.node=that.mouse_near_head(event);
	}
	else{
	    alert("Your browser does not support XMLHTTP.");
	}
	//alert(value);
    };
    this.s_state_Change=function(){
	if(that.s_xmlhttp.readyState==4){
	    //4 = "loaded"
	    if(that.s_xmlhttp.status==200){
		//200 = "OK"
		var data = that.s_xmlhttp.responseText;
		//数据常见出错处
		//alert(data);
		if(data=="none"){
		    alert_close();
		    setTimeout(alert_open,1000,"~没有搜索到这个小朋友，或许您可以联系客服添加他~");
		    setTimeout(alert_close,2900);
		    return 1;
		}
		that.DB_data = data.split(",");
		//alert(that.DB_data);
		that.DB_pos = that.DB_data.length-1;
		that.make_data();
	    }
	    else{
		alert("Problem retrieving data:" + that.xmlhttp.statusText);
	    }
	}
    };
    
    this.getNodeByName=function(name){
	var len = that.node_array.length;
	for(var count=0;count<len;count++){
	    if(that.node_array[count].info.name == name){
		return that.node_array[count];
	    }
	}
    };
    this.make_xmlhttp;
    this.make_data=function(){
	that.make_xmlhttp=null;
	if(window.XMLHttpRequest){
	    // code for Firefox, Opera, IE7, etc.
	    that.make_xmlhttp=new XMLHttpRequest();
	}
	else if(window.ActiveXObject){
	    // code for IE6, IE6
	    that.make_xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	if(that.make_xmlhttp!=null){
	    that.make_xmlhttp.onreadystatechange=that.make_data_Change;
	    if(that.DB_pos<0){
		that.search();
		setTimeout(alert_close,1000);
		return 0;
	    }
	    var data = that.DB_data[that.DB_pos];
	    that.DB_pos--;
	    that.node = that.getNodeByName(data);
	    that.make_xmlhttp.open("GET","/givebranch?mydata="+data,true);
	    that.make_xmlhttp.send(null);
	}
	else{
	    alert("Your browser does not support XMLHTTP.");
	}
    };
    this.DB_data;
    this.DB_pos;
    this.make_data_Change=function(){
	if(that.make_xmlhttp.readyState==4){
	    //4 = "loaded"
	    if(that.make_xmlhttp.status==200){
		//200 = "OK"
		haha = JSON.parse(that.make_xmlhttp.responseText);
		//alert(that.make_xmlhttp.responseText);
		that.create_node_canvas(haha);
		setTimeout(that.make_data,300);
	    }
	    else{
		alert("Problem retrieving data:" + that.make_xmlhttp.statusText);
	    }
	}
    };

    this.o_width=that.width;
    this.o_height=that.height;
    this.o_img_fix_left = this.img_fix_left;
    this.o_img_fix_top = this.img_fix_top;
    this.o_r=that.r;
    this.o_half_width=that.half_width;
    this.o_half_height=that.half_height;
    this.o_remote=that.remote;
    this.o_banner_width=that.banner_width;
    this.o_banner_height=that.banner_height;
    this.o_diswidth_banner_body=that.diswidth_banner_body;
    this.o_disheight_banner_body=that.disheight_banner_body;
    this.o_line_width=that.line_width;
    this.o_line_bg_width=that.line_bg_width;

    this.bef_enlarge=function(node){
	var times = 30;
	var x1 = (that.o_width - that.width)/times;
	var x2 = (that.o_height - that.height)/times;
	var x3 = (that.o_r - that.r)/times;
	var x4 = (that.o_half_width - that.half_width)/times;
	var x5 = (that.o_remote - that.remote)/times;
	var x6 = (that.o_banner_width - that.banner_width)/times;
	var x7 = (that.o_banner_height - that.banner_height)/times;
	var x8 = (that.o_diswidth_banner_body - that.diswidth_banner_body)/times;
	var x9 = (that.o_disheight_banner_body - that.disheight_banner_body)/times;
	var x10 = (that.o_line_width - that.line_width)/times;
	var x11 = (that.o_line_bg_width - that.line_bg_width)/times;
	that.enlarge(x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11);
    };
    this.we_enlarge = function(x,y,times,node){
	if(!times){
	    that.enlarge(node);
	    return 1;
	}
	var len = that.node_array.length;
	for(var count=0;count<len;count++){
	    that.node_array[count].left+=x;
	    that.node_array[count].top+=y;
	}
	that.head_move_canvas();
	setTimeout(that.we_enlarge,20,x,y,times-1,node);
    };
    this.enlarge=function(node){
	var factor = 1.18;
	if(that.width*factor>=that.o_width){
	    that.width=that.o_width;
	    that.height=that.o_height;
	    that.img_fix_top=that.o_img_fix_top;
	    that.img_fix_left=that.o_img_fix_left;
	    that.r=that.o_r;
	    that.half_width=that.o_half_width;
	    that.half_height=that.o_half_height;
	    that.remote=that.o_remote;
	    that.banner_width=that.o_banner_width;
	    that.banner_height=that.o_banner_height;
	    that.diswidth_banner_body=that.o_diswidth_banner_body;
	    that.disheight_banner_body=that.o_disheight_banner_body;
	    that.line_width=that.o_line_width;
	    that.line_bg_width=that.o_line_bg_width;
	    that.head_move_canvas();
	    return 1;
	}
	that.width*=factor;
	that.height*=factor;
	that.img_fix_top*=factor;
	that.img_fix_left*=factor;
	that.r*=factor;
	that.half_width*=factor;
	that.half_height*=factor;
	that.remote*=factor;
	that.banner_width*=factor;
	that.banner_height*=factor;
	that.diswidth_banner_body*=factor;
	that.disheight_banner_body*=factor;
	that.line_width*=factor;
	that.line_bg_width*=factor;
	var count=0,len=that.node_array.length;
	var left=document.documentElement.clientWidth/2+that.width/2,top=document.documentElement.clientHeight/2+that.height/2;
	left = node.left+that.width/2;
	top = node.top+that.height/2;
	for(;count<len;count++){
	    that.node_array[count].left=left+factor*(that.node_array[count].left-left);//2*that.node_array[count].left-left;
	    that.node_array[count].top=top+factor*(that.node_array[count].top-top);//2*that.node_array[count].top-top;
	}
	that.head_move_canvas();
	setTimeout(that.enlarge,33,node);
    };
    this.enlarge=function(node){
	var factor = 1.18;
	if(that.width*factor>=that.o_width){
	    that.width=that.o_width;
	    that.height=that.o_height;
	    that.img_fix_top=that.o_img_fix_top;
	    that.img_fix_left=that.o_img_fix_left;
	    that.r=that.o_r;
	    that.half_width=that.o_half_width;
	    that.half_height=that.o_half_height;
	    that.remote=that.o_remote;
	    that.banner_width=that.o_banner_width;
	    that.banner_height=that.o_banner_height;
	    that.diswidth_banner_body=that.o_diswidth_banner_body;
	    that.disheight_banner_body=that.o_disheight_banner_body;
	    that.line_width=that.o_line_width;
	    that.line_bg_width=that.o_line_bg_width;
	    that.head_move_canvas();
	    return 1;
	}
	that.width*=factor;
	that.height*=factor;
	that.img_fix_top*=factor;
	that.img_fix_left*=factor; 
	that.r*=factor;
	that.half_width*=factor;
	that.half_height*=factor;
	that.remote*=factor;
	that.banner_width*=factor;
	that.banner_height*=factor;
	that.diswidth_banner_body*=factor;
	that.disheight_banner_body*=factor;
	that.line_width*=factor;
	that.line_bg_width*=factor;
	var count=0,len=that.node_array.length;
	var left=document.documentElement.clientWidth/2+that.width/2,top=document.documentElement.clientHeight/2+that.height/2;
	left = node.left+that.width/2;
	top = node.top+that.height/2;
	for(;count<len;count++){
	    that.node_array[count].left=left+factor*(that.node_array[count].left-left);//2*that.node_array[count].left-left;
	    that.node_array[count].top=top+factor*(that.node_array[count].top-top);//2*that.node_array[count].top-top;
	}
	that.head_move_canvas();
	setTimeout(that.enlarge,33,node);
    };
    this.action_ensmall = function(node,type){
	//alert(that.width+","+that.o_width);
	var factor = 0.9;
	var four=4;
	if(that.width*factor<=that.o_width/four){
	    that.width=that.o_width/four;
	    that.height=that.o_height/four;
	    that.img_fix_top=that.o_img_fix_top/four;
	    that.img_fix_left=that.o_img_fix_left/four;
	    that.r=that.o_r/four;
	    that.half_width=that.o_half_width/four;
	    that.half_height=that.o_half_height;
	    that.remote=that.o_remote/four;
	    that.banner_width=that.o_banner_width/four;
	    that.banner_height=that.o_banner_height/four;
	    that.diswidth_banner_body=that.o_diswidth_banner_body/four;
	    that.disheight_banner_body=that.o_disheight_banner_body/four;
	    that.line_width=that.o_line_width/four;
	    that.line_bg_width=that.o_line_bg_width/four;
	    that.head_move_canvas();
	    var x = node.left - document.documentElement.clientWidth/2+that.width/2;
	    var y = node.top - document.documentElement.clientHeight/2+that.height/2;
	    var times = 10;//Math.ceil(Math.log(that.o_width/that.width)/Math.log(1.18))
	    if(type==1){
		that.we_enlarge(-x/times,-y/times,times,node);
	    }
	    else{
		that.search_inDB(type);
	    }
	    return 1;
	}
	else{
	    that.width*=factor;
	    that.height*=factor;
	    that.img_fix_top*=factor;
	    that.img_fix_left*=factor;
	    that.r*=factor;
	    that.half_width*=factor;
	    that.half_height*=factor;
	    that.remote*=factor;
	    that.banner_width*=factor;
	    that.banner_height*=factor;
	    that.diswidth_banner_body*=factor;
	    that.disheight_banner_body*=factor;
	    that.line_width*=factor;
	    that.line_bg_width*=factor;
	    that.head_move_canvas();
	    var count=0;
	    var len = that.node_array.length;
	    for(;count<len;count++){
		that.node_array[count].left=left+factor*(that.node_array[count].left-left);//2*that.node_array[count].left-left;
		that.node_array[count].top=top+factor*(that.node_array[count].top-top);//2*that.node_array[count].top-top;
	    }
	    setTimeout(that.action_ensmall,30,node,type);
	}
    };
    //    that.action_ensmall();
    this.orginal=function(){
	var factor = 2;
	if(that.width<38.75&&factor==0.5){
	    return 0;
	};
	if(that.width>that.o_width/2&&factor==2){
	    return 0;
	}
	that.width*=factor;
	that.height*=factor;
	that.img_fix_top*=factor;
	that.img_fix_left*=factor;
	that.r*=factor;
	that.half_width*=factor;
	that.half_height*=factor;
	that.remote*=factor;
	that.banner_width*=factor;
	that.banner_height*=factor;
	that.diswidth_banner_body*=factor;
	that.disheight_banner_body*=factor;
	that.line_width*=factor;
	that.line_bg_width*=factor;
	var count=0,len=that.node_array.length;
	var left=0,top=0;
	for(;count<len;count++){
	    that.node_array[count].left=2*that.node_array[count].left-left;
	    that.node_array[count].top=2*that.node_array[count].top-top;
	}
	return 1;
    };
    //this.clearRect();
    this.head_move_canvas();
};

function get_selects(){
    var value = $("#selects").val()
    switch(value){
    case "1":return "Name";
    case "2":return "Institution";
    case "3":return "Major";
    case "4":return "Description";
    default:return "error";
    }
}
function Auto_size(){
    var height = $(document).height();
    var width = $(document).width();
    if($("#timeline-frame").css("display")=="none"){
	document.getElementById("node_canvas").height=height;
    }
    else{
	document.getElementById("node_canvas").height=height/2;
    }
    document.getElementById("node_canvas").width=width;
}
$(document).ready(function(event){    
    //selects
    $("#up").click(function(){
	alert_open("You can upload image on <a href='http://tinypic.com' target='_blank'>http://tinypic.com</a> and get the image link.");
    });
    Auto_size();
    $(window).resize(function(){
	Auto_size();
    });
    $("#selects_div").html("<p>"+get_selects()+"</p>");
    var selects = document.getElementsByTagName('select');
    for(var i =0;i<selects.length;i++){
        selects[i].onchange = function() {
	    $("#selects_div").html("<p>"+get_selects()+"</p>");
	}
    }
    //
    $("body").scroll(function(){
	//alert("");
    });
    document.onmousewheel=function(){
	//alert("")
	//return false;
    }
    //如果先在css里面设置border为0px就会让动作失效？
    $("#search_input").css("border-width","0px").css("border-color","red");
    $("#search_input").focus(function(){
	$("#search_input").css("border-width","2px");
    });
    $("#search_input").blur(function(){
	$("#search_input").css("border-width","0px");
    });
    $("#normal_button").mouseenter(function(){
	$("#normal_button p").css("font-size","22px");
    });
    $("#normal_button").mouseleave(function(){
	$("#normal_button p").css("font-size","18px");
    });
    $("#about_button").mouseenter(function(){
        $("#about_button p").css("font-size","22px");
    });
    $("#about_button").mouseleave(function(){
        $("#about_button p").css("font-size","18px");
    });
    $("#about_button").click(function(){
	document.location.href="/familytree/about";
    });
    var timeline_bool = 0;
    $("#normal_button").click(function(){
	if(!timeline_bool){
	alert_open("~loading~");
	//window.location.href="/familytree/normal/";
	document.getElementById("timeline-frame").src="/timeline";
	document.getElementById("timeline-frame").onload = alert_close;
	$("#timeline-frame").css({"display":"block"});
	    timeline_bool = 1;
	}
	else{
	    $("#timeline-frame").css({"display":"none"});
	    timeline_bool = 0;
	}
	Auto_size();
    });
    $("#tree_button").click(function(){
	alert_open("You are already on the Tree page");
	setTimeout(alert_close,2000);
    });
});







function ajax_read(){ 
    alert("");
    var time = "asdad";//document.getElementById("Time").value; 
    var reset_xmlhttp; 
    if (window.XMLHttpRequest){
	reset_xmlhttp=new XMLHttpRequest(); 
    }
    else{
	reset_xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); 
    } 
    reset_xmlhttp.onreadystatechange=function(){ 
	if (reset_xmlhttp.readyState==4 && reset_xmlhttp.status==200){
	    var data = reset_xmlhttp.responseText; 
	    if (data>0){ 
		var Str="Have Found"+data+"Tags, Choose the next Step:"; 
		$("#wfDiv").html(Str);
		$("#nsDiv").css({"display":"block"}); 
	    }
	    else if (data==0){ 
		$("#wfDiv").css({"color":"red"});
		$("#wfDiv").html("Tag Not Found"); 
	    }	 
	} 
    } 
    $("#wfDiv").css({"color":"#2ea6de"});
    $("#wfDiv").html("Wait Please"); 
    reset_xmlhttp.open("POST","/givebranch",true); 
    reset_xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded"); 
    reset_xmlhttp.send("mydata="+time); 
    return false; 
}