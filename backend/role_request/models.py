from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class RoleRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("denied", "Denied"),
        ("canceled", "Canceled"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    request_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    denied_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.status}"

    def can_request_again(self):
        if self.status != "denied" or not self.denied_time:
            return True
        return (
            timezone.now() - self.denied_time
        ).total_seconds() > 86400  
