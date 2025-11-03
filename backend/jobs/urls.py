from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import JobViewSet, CompanyViewSet, AttachmentViewSet
from .views import csrf as csrf_view

router = DefaultRouter()
router.register(r'jobs', JobViewSet)
router.register(r'companies', CompanyViewSet)
router.register(r"attachments", AttachmentViewSet, basename="attachment")

urlpatterns = router.urls + [path("csrf/", csrf_view, name="csrf")]
