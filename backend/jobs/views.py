from django.shortcuts import render
from rest_framework import viewsets
from .models import Company, Job
from .serializers import CompanySerializer, JobSerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.select_related("company").all()
    serializer_class = JobSerializer
