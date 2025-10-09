from rest_framework.routers import DefaultRouter
from .views import JobViewSet, CompanyViewSet, AttachmentViewSet

router = DefaultRouter()
router.register(r'jobs', JobViewSet)
router.register(r'companies', CompanyViewSet)
router.register(r"attachments", AttachmentViewSet, basename="attachment")

urlpatterns = router.urls
