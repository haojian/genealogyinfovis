from django.db import models

# Create your models here.

class Member(models.Model):
    name_first = models.CharField(max_length=12)
    name_last = models.CharField(max_length=12)
    name_middle = models.CharField(max_length=12)
    email_addr = models.CharField(max_length=40)
    imgurl = models.CharField(max_length=100)
    homepage = models.CharField(max_length=30)
    scitribe_id = models.CharField(max_length=10)
    highest_degree_name = models.CharField(max_length=20)
    highest_degree_insti = models.CharField(max_length=20)
    highest_degree_year = models.CharField(max_length=10)
    highest_degree_depart = models.CharField(max_length=20)
    cur_title = models.CharField(max_length=20)
    keywords = models.CharField(max_length=15)
    organization_info = models.CharField(max_length=200)
    mentor = models.CharField(max_length=10)
    mentee = models.CharField(max_length=30)
    collaborators = models.CharField(max_length=30)
    other_info = models.CharField(max_length=50)
    is_people = models.CharField(max_length=1)
    # return a unicode
    def __unicode__(self):
        return self.name_first
