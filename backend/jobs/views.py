from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Job, Company, Attachment
from .serializers import JobSerializer, CompanySerializer, AttachmentSerializer


@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({"detail": "CSRF cookie set"})


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.select_related("company").all()
    serializer_class = JobSerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    # /api/companies/<uuid:id>/jobs/
    @action(detail=True, methods=["get"])
    def jobs(self, request, pk=None):
        company = self.get_object()
        jobs = Job.objects.filter(company=company)
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)


class AttachmentViewSet(viewsets.ModelViewSet):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
