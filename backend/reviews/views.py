from rest_framework import viewsets
from .models import Review
from .serializers import ReviewSerializer
from .permissions import IsAdminOrOwnerOrReadOnly

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminOrOwnerOrReadOnly]

    def get_queryset(self):
        """
        Returns all reviews for unauthenticated users.
        Filters based on the current user for authenticated users.
        """
        product_id = self.request.query_params.get("product")
        if self.request.user.is_authenticated and not self.request.user.is_staff:
            # Authenticated users see their own reviews only
            queryset = Review.objects.filter(user=self.request.user)
        else:
            # Unauthenticated users or staff/admins see all reviews
            queryset = Review.objects.all()

        # Apply product filter if specified
        if product_id:
            queryset = queryset.filter(product_id=product_id)

        return queryset

    def perform_create(self, serializer):
        # Ensure the user is assigned when creating a review
        serializer.save(user=self.request.user)
        print(f"Review created by user: {self.request.user.id}")
