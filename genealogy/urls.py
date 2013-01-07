from django.conf.urls import patterns, include, url
from django.conf.urls.static import static 
import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()



urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'ft.views.home', name='home'),
    # url(r'^ft/', include('ft.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
     url(r'^admin/', include(admin.site.urls)),
     url(r'^genealogy/','familytree.views.ft'),
     url(r'^givebranch/','familytree.views.Give_branch'),
     url(r'^alldata/','familytree.views.alldata'),
     url(r'^timeline/','familytree.views.new_normal'),
     url(r'^getmentor/','familytree.views.getmentor'),
     url(r'^search/','familytree.views.search'),
     url(r'^grade/','familytree.views.data_by_grade'),
     url(r'^normal_search/','familytree.views.normal_search'),
     url(r'^changeteam/','familytree.views.change_team'),
     url(r'^about/','familytree.views.about'),
     url(r'^update/','familytree.views.update'),
     url(r'^add/','familytree.views.add'),
     url(r'^del/','familytree.views.delete'),
     url(r'^con/','familytree.views.con'),
     url(r'^searchinfo/','familytree.views.searchinfo'),
     url(r'^$','familytree.views.index'),
)

urlpatterns += static(settings.MEDIA_URL , document_root = settings.MEDIA_ROOT ) 
urlpatterns += static(settings.STATIC_URL, document_root = settings.STATIC_ROOT ) 
