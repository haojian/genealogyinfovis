# coding=utf-8
# Create your views here.
from django.template import Context, loader
from django.http import HttpResponse
from django.shortcuts import render_to_response
#use to make json
from django.core import serializers
from familytree.models import *
import simplejson

#use local() return all agruments
def ft(request):
    member = Member.objects.get(pk=1)
    return render_to_response('action.html',{'member':member})

def Give_branch(request):
    mydata = request.GET["mydata"]
    mimeformat = 'json'
    mimetype = 'application/javascript'
    #serialize中只能用.objects.all()  不能用.objects.get(...)吗??
    #member = data = serializers.serialize(mimeformat,Member.objects.all())
    #return HttpResponse(member,mimetype)
    member = Member.objects.get(name=mydata)
    s = member.younger
    if s=='':
        return HttpResponse('')

    youngerlist = s.split(',')
    ks = []
    for younger in youngerlist:
        try:
            member = Member.objects.get(name=younger)
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
    member = Member.objects.all().order_by('-grade')
    grade = []
    count = -1
    num = []
    for m in member:
        if len(grade)==0 or grade[count]!=m.grade:
            num.append(1)
            grade.append(m.grade)
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
        member = Member.objects.get(name=mydata)
    except Member.DoesNotExist:
        return HttpResponse("none")
    all_member = Member.objects.all().order_by("-grade")
    value = []
    s = ""
    for m in all_member:
        younger_list = m.younger.split(",")
        for l in younger_list:
            if l == mydata:
                value.append(m.name)
                s += m.name+","
                mydata = m.name
                break
    for m in all_member:
        younger_list = m.younger.split(",")
        for l in younger_list:
            if l == mydata:
                value.append(m.name)
                s += m.name+","
                mydata = m.name
                break
    s += "UniqueStudio"
    return HttpResponse(s)

def new_normal(request):
    member = Member.objects.all().order_by("grade")
    grade = []
    count = -1
    for m in member:
        if count == -1 or grade[count]!=m.grade:
            if m.grade == '0':
                continue
            grade.append(m.grade)
            count += 1
    return render_to_response("normal.html",{"grade":grade})

def data_by_grade(request):
    mydata = request.GET["mydata"]
    member = Member.objects.all().order_by('-team')
    data = []
    for m in member:
        if m.grade == mydata:
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
    name = request.GET["name"]
    try:
        member = Member.objects.get(name=name)
    except Member.DoesNotExist:
        return HttpResponse("error")
    mytype = request.GET["type"]
    updata = request.GET["updata"]
    if mytype == "tel":
        if member.tel == updata:
            HttpResponse("none")
        member.tel = updata
        member.save()
        return HttpResponse("success")
    elif mytype == "email":
        if member.email == updata:
            return HttpResponse("none")
        member.email = updata
        member.save()
        return HttpResponse("success")
    return HttpResponse("error")
