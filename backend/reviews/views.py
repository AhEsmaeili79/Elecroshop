from rest_framework import viewsets, permissions
from .models import Review
from .serializers import ReviewSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Get the product ID from the query parameters
        product_id = self.request.query_params.get("product")
        # Filter reviews based on the product ID, or return all if no product ID is provided
        if product_id:
            return Review.objects.filter(product_id=product_id)
        return Review.objects.all()  # Return all reviews if no product ID is specified

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
