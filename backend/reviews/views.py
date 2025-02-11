from rest_framework import viewsets
from .models import Review
from .serializers import ReviewSerializer
from .permissions import IsAdminOrOwnerOrReadOnly

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminOrOwnerOrReadOnly]

    def get_queryset(self):
        product_id = self.request.query_params.get("product")
        if self.request.user.is_authenticated and not self.request.user.is_staff:
            queryset = Review.objects.filter(user=self.request.user)
        else:
            queryset = Review.objects.all()
        if product_id:
            queryset = queryset.filter(product_id=product_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        print(f"Review created by user: {self.request.user.id}")
