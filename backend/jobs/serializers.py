from rest_framework import serializers
from .models import Company, Job


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


class JobSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    company_id = serializers.PrimaryKeyRelatedField(

        source="company", queryset=Company.objects.all(), write_only=True
    )

    class Meta:
        model = Job
        fields = "__all__"
