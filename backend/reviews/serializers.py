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
            'title',
            "user_first_name",
            "user_last_name",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = ["user", "created_at"]

    def validate(self, attrs):
        # Check if the user is creating a new review, not updating
        if self.instance is None:  # This is a new review (POST)
            if Review.objects.filter(
                user=self.context["request"].user, product=attrs["product"]
            ).exists():
                raise serializers.ValidationError("You have already reviewed this product.")
        return attrs
