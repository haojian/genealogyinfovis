# coding=utf-8
# Create your views here.
from django.template import Context, loader
from django.http import HttpResponse
from django.shortcuts import render_to_response
#use to make json
from django.core import serializers
from familytree.models import *
#import simplejson

#use local() return all agruments
def index(request):
    return render_to_response('index.html')

def ft(request):
    #member = Member.objects.get(pk=1)
    return render_to_response('action.html')

def Give_branch(request):
    mydata = request.GET["mydata"]
    mimeformat = 'json'
    mimetype = 'application/javascript'
    #serialize中只能用.objects.all()  不能用.objects.get(...)吗??
    #member = data = serializers.serialize(mimeformat,Member.objects.all())
    #return HttpResponse(member,mimetype)
    try:
        member = Member.objects.get(pk=mydata)
    except Member.DoesNotExist:
        return HttpResponse('')
    s = member.mentee
    if s=='' or s=="0":
        return HttpResponse("none")

    youngerlist = s.split(',')
    ks = []
    for younger in youngerlist:
        try:
            if younger != "":
                member = Member.objects.get(pk=younger)
                ks.append(member)
        except Member.DoesNotExist:
            continue
        #return HttpResponse(member.younger)
            #raise Http404
#    haha = simplejson.dumps()
    haha = serializers.serialize('json',ks)
    return HttpResponse(haha)

def alldata(request):
    #mimeformat = 'json'
    #mimetype = 'application/javascript'
    #serialize中只能用.objects.all()  不能用.objects.get(...)吗??
    #member = data = serializers.serialize(mimeformat,Member.objects.all())
    #return HttpResponse(member,mimetype)
    member = Member.objects.get(name="UniqueStudio")
    head = 0
    tail = 1
    ks = []
    ks.append(member)
    record = []
    record.append(-1)
    
    num = []
    count = -1
    
    while tail != head:
        array = ks[head].younger.split(",")
        num.append(0)
        count += 1
        for arr in array:
            try:
                member = Member.objects.get(name=arr)
                ks.append(member)
                record.append(head)
                tail += 1
                num[count] += 1
            except Member.DoesNotExist:
                continue
        head += 1
    
    haha = serializers.serialize('json',ks)
    data = []
    data.append(haha)
    data.append(record)

    new_num = [1]
    what = 1
    pos = 1
    new_num.append(0)
    for n in num:
        if what == 0:
            new_num.append(n)
            what = new_num[pos]-1
            pos += 1
        else:
            what -= 1
            new_num[pos] += n
    
    #data.append(num)
    data.append(new_num)
    return HttpResponse(data)

def getmentor(request):
     #mimeformat = 'json'
    #mimetype = 'application/javascript'
    #serialize中只能用.objects.all()  不能用.objects.get(...)吗??
    #member = data = serializers.serialize(mimeformat,Member.objects.all())
    #return HttpResponse(member,mimetype)
    member = Member.objects.get(name="UniqueStudio")
    head = 0
    tail = 1
    ks = []
    ks.append(member)
    record = []
    record.append(-1)
    
    num = []
    count = -1
    
    while tail != head:
        array = ks[head].younger.split(",")
        num.append(0)
        count += 1
        for arr in array:
            try:
                member = Member.objects.get(name=arr)
                ks.append(member)
                record.append(head)
                tail += 1
                num[count] += 1
            except Member.DoesNotExist:
                continue
        head += 1
    
    haha = serializers.serialize('json',ks)
    data = []
    #data.append(haha)
    #data.append(record)

    new_num = [1]
    what = 1
    pos = 1
    new_num.append(0)
    for n in num:
        if what == 0:
            new_num.append(n)
            what = new_num[pos]-1
            pos += 1
        else:
            what -= 1
            new_num[pos] += n
    
    #data.append(num)
    data.append(new_num)
    return HttpResponse(data)
    
def normal(request):
    member = Member.objects.all().order_by('-highest_degree_year')
    grade = []
    count = -1
    num = []
    for m in member:
        if len(grade)==0 or grade[count]!=m.highest_degree_year:
            num.append(1)
            grade.append(m.highest_degree_year)
            count += 1
        else:
            num[count] += 1
    width_array = []
    for n in num:
        width_array.append((n-0.5)*133)
    
    height = len(grade)*143
        
    return render_to_response('normal.html',{'member':member,'grade':grade,'num':num,'width_array':width_array,'height':height})

def search(request):
    mydata = request.GET["mydata"]
    try:
        member = Member.objects.get(user_name=mydata)
    except Member.DoesNotExist:
        return HttpResponse("none")
    all_member = Member.objects.all()#.order_by("-grade")                mydata = m.name
    s = ""
    mentor_number = member.cur_mentor
    while 1:
        member = Member.objects.get(pk=int(mentor_number))
        mentor_number = member.cur_mentor
        if member.pk == 1:
            s += member.user_name
            break
        s += member.user_name+","
    return HttpResponse(s)

def new_normal(request):
    member = Member.objects.all().order_by("highest_degree_year")
    grade = []
    count = -1
    for m in member:
        if count == -1 or grade[count]!=m.highest_degree_year:
            if m.highest_degree_year == '0':
                continue
            grade.append(m.highest_degree_year)
            count += 1
    return render_to_response("normal.html",{"grade":grade})

def data_by_grade(request):
    mydata = request.GET["mydata"]
    member = Member.objects.all()
    data = []
    for m in member:
        if m.highest_degree_year == mydata:
            data.append(m)
    haha = serializers.serialize('json',data)
    return HttpResponse(haha)

def normal_search(request):
    mydata = request.GET["mydata"]
    try:
        member = Member.objects.get(name=mydata)
    except Member.DoesNotExist:
        return HttpResponse("none")
    return HttpResponse(member.grade)

def change_team(request):
    org = request.GET["org"].lower()
    new = request.GET["new"]
    if org != new.lower():
        return HttpResponse("error")
    member = Member.objects.all()
    count = 0
    test = 0
    for m in member:
        if m.team.lower() == org:
            test = m.team.lower()
            m.team = new
            m.save()
            count += 1
    return HttpResponse(count)

def about(request):
    return render_to_response("about.html")

def update(request):
    data = request.GET["value"]
    my_id = request.GET["id"]
    try:
        member = Member.objects.get(pk=my_id)
    except Member.DoesNotExist:
        return HttpResponse("error")
    value = data.split(",")
    change = 0
    if member.name_first != value[0]:
        member.name_first = value[0]
        change = 1
    if member.name_middle != value[1]:
        member.name_middle = value[1]
        change = 1
    if member.name_last != value[2]:
        member.name_last = value[2]
        change = 1
    if member.imgurl != value[3]:
        member.imgurl = value[3]
        change = 1
    if member.homepage != value[4]:
        member.homepage = value[4]
        change = 1
    if member.highest_degree_name != value[5]:
        member.highest_degree_name = value[5]
        change = 1
    if member.highest_degree_insti != value[6]:
        member.highest_degree_insti = value[6]
        change = 1
    if member.highest_degree_year != value[7]:
        if value[7] != "N/A":
            member.highest_degree_year = value[7]
            change = 1
    if member.highest_degree_depart != value[8]:
        member.highest_degree_depart = value[8]
        change = 1
    if member.cur_title != value[9]:
        member.cur_title = value[9]
        change = 1
    if member.keywords != value[10]:
        member.keywords = value[10]
        change = 1
    if member.other_info != value[11]:
        member.other_info = value[11]
        change = 1
    if member.mentor != value[12]:
        member.mentor = value[12]
        change = 1
    if member.mentee != value[13]:
        member.mentee = value[13]
        change = 1
    if member.collaborators != value[14]:
        member.collaborators = value[14]
        change = 1
    if member.organization_info != value[15]:
        member.organization_info = value[15]
        change = 1
    member.save()
    if change == 1:
        return HttpResponse("success")
    else:
        return HttpResponse("none")

def add(request):
    f_id = request.GET["f_id"]
    name = request.GET["name"]
    mytype = request.GET["type"]
    name_arr = name.split(",")
    m = Member(name_first=name_arr[0],name_middle=name_arr[1],name_last=name_arr[2],is_people=mytype)
    m.save()
    mentor = Member.objects.get(pk=int(f_id))
    if mentor.mentee=="0" or mentor.mentee=="":
        mentor.mentee = str(m.pk)
    else:
        mentor.mentee += ","+str(m.pk)
    mentor.save()
    m.mentor = mentor.pk
    m.save()
    ks = []
    ks.append(m)
    haha = serializers.serialize('json',ks)
    return HttpResponse(haha)

def searchinfo(request):
    mytype = request.GET["type"]
    value = request.GET["value"]
    data = []
    if mytype == "1":
        try:
            member = Member.objects.all()
        except Member.DoesNotExist:
            return HttpResponse("error")
        name1 = value.split(" ")
        name = (''.join(name1)).lower()
        for m in member:
            m_name = (m.name_first+m.name_middle+m.name_last).lower()
            pos = m_name.find(name)
            if pos != -1:
                data.append(m)
        haha = serializers.serialize('json',data)
        return HttpResponse(haha)
    elif mytype == "2":
        try:
            member = Member.objects.all()
        except Member.DoesNotExist:
            return HttpResponse("error")
        data = []
        name1 = value.split(" ")
        name = ''.join(name1)
        for m in member:
            m_name = m.name_first+m.name_middle+m.name_last
            pos = m_name.find(name)
            if pos != -1 and m.is_people=="2":
                youngerlist = m.mentee.split(',')
                for younger in youngerlist:
                    try:
                        member = Member.objects.get(pk=younger)
                        data.append(member)
                    except Member.DoesNotExist:
                        continue
                break
        haha = serializers.serialize('json',data)
        return HttpResponse(haha)
    elif mytype == "3":
        try:
            member = Member.objects.filter(location=value)
        except Member.DoesNotExist:
            return HttpResponse("error")
    elif mytype == "4":
        try:
            member = Member.objects.filter(department=value)
        except Member.DoesNotExist:
            return HttpResponse("error")
    else:
        return HttpResponse("error")
    haha = serializers.serialize('json',member)
    return HttpResponse(haha)

def del_child(member):
    s = member.mentee
    if s != "":
        mentee_str = s.split(',')
        for  m_str in mentee_str:
            if m_str != "":
                try:
                    m = Member.objects.get(pk=m_str)
                    del_child(m)
                except Member.DoesNotExist:
                    v = 1
    member.delete()
    return 1
    

def delete(request):
    f_id = request.GET["f_id"]
    mytype = request.GET["type"]
    member = Member.objects.get(pk=f_id)
    if mytype == "1":
        del_child(member)
    elif mytype == "2":
        s = member.mentee
        string = s.split(',')
        for s1 in string:
            m = Member.objects.get(pk=s1)
            m.mentor = member.mentor
            m.save()
    mentor = Member.objects.get(pk=member.mentor)
    s = mentor.mentee
    men = s.split(',')
    new_mentee = ""
    for m in men:
        if m != f_id and m!="":
            new_mentee += m+","
    mentor.mentee = new_mentee
    if mytype == "2":
        mentor.mentee = mentor.mentee + member.mentee
        member.delete()
    mentor.save()
    return HttpResponse("1")

def con(request):
    f_id = request.GET["f_id"]
    c_id = request.GET["c_id"]
    try:
        c_node = Member.objects.get(pk=int(c_id))
    except Member.DoesNotExist:
        return HttpResponse("error")
    try:
        f_node = Member.objects.get(pk=int(f_id))
    except Member.DoesNotExist:
        return HttpResponse("error")
    c_node_father = Member.objects.get(pk = int(c_node.mentor))
    m_arr = c_node_father.mentee.split(",")
    m_str = ""
    for m in m_arr:
        if m == c_id or m =="":
            continue
        m_str += m+","
    c_node_father.mentee = m_str[0:-1]
    c_node_father.save()

    c_node.mentor = f_id
    c_node.save()

    if f_node.mentee == "":
        f_node.mentee = c_id
    else:
        f_node.mentee+=","+c_id
    f_node.save();
    return HttpResponse("success")
