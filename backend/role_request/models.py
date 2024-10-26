# role_request/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class RoleRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    request_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20, default="pending"
    )  # 'pending', 'approved', 'denied'

    def __str__(self):
        return f"{self.user.username} - {self.status}"
