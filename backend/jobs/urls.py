from rest_framework.routers import DefaultRouter
from .views import JobViewSet, CompanyViewSet

router = DefaultRouter()
router.register(r'jobs', JobViewSet)
router.register(r'companies', CompanyViewSet)

urlpatterns = router.urls
