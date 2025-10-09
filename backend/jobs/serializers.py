from rest_framework import serializers
from jobs.models import Company, Job, Attachment


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


class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = [
            "id",
            "job",
            "type",
            "file",
            "filename",
            "mime_type",
            "size_bytes",
            "uploaded_at",
        ]
        read_only_fields = ["filename", "mime_type",
                            "size_bytes", "uploaded_at"]
