import docker_admin_mocked_views
from django.conf.urls import patterns, include, url
from django.contrib import admin
import views
from rest_framework.routers import DefaultRouter
from django.conf.urls import include

# Create a router and register ViewSets with it
router = DefaultRouter()
router.register(r'tags', views.TagViewSet)
router.register(r'images', views.ImageViewSet)
router.register(r'learning_paths', views.LearningPathViewSet)
router.register(r'game_users', views.GameUserViewSet)
router.register(r'shassaros', views.ShassaroViewSet)
router.register(r'games', views.GameViewSet)
router.register(r'game_results', views.GameResultViewSet)
router.register(r'badges', views.BadgeViewSet)
router.register(r'docker_managers', views.DockerManagerViewSet)
router.register(r'docker_servers', views.DockerServerViewSet)
router.register(r'configurations', views.ConfigurationsViewSet)
router.register(r'game_requests', views.GameRequestViewSet)
router.register(r'game_request_statuses', views.GameRequestStatusViewSet)

urlpatterns = patterns('',

    url(r'^', include(router.urls)),
    url(r'^docker-admin-mock/deploy/$', docker_admin_mocked_views.deploy),
    #url(r'^admin/', include(admin.site.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
)