from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_first_name = serializers.ReadOnlyField(source="user.first_name")
    user_last_name = serializers.ReadOnlyField(source="user.last_name")

    class Meta:
        model = Review
        fields = [
            "id",
            "product",
            "user",
            "user_first_name",
            "user_last_name",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = ["user", "created_at"]
