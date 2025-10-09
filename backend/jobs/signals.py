# jobs/signals.py
from django.db.models.signals import post_delete
from django.dispatch import receiver
from jobs.models import Attachment


@receiver(post_delete, sender=Attachment)
def delete_file_from_storage(sender, instance, **kwargs):
    file_field = instance.file
    if file_field and file_field.storage.exists(file_field.name):
        file_field.storage.delete(file_field.name)
