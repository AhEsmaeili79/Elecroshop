from django.db import models
from django.conf import settings
from category.models import Category , Brand, Model
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils import timezone

class Color(models.Model):
    color_hex = models.CharField(max_length=255, default='#fff')
    
    def __str__(self):
        return f"Color: {self.color_hex}"
    
class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.PositiveIntegerField(blank=False)
    model = models.ForeignKey(Model,on_delete=models.CASCADE,default=1, related_name="products")
    desc = models.TextField(null=True)
    is_favorited_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="favorite_products", blank=True
    )
    main_photo = models.ImageField(upload_to="products/%Y/%m/%d/", blank=False)
    photo1 = models.ImageField(upload_to="products/%Y/%m/%d/", blank=True)
    photo2 = models.ImageField(upload_to="products/%Y/%m/%d/", blank=True)
    photo3 = models.ImageField(upload_to="products/%Y/%m/%d/", blank=True)
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    colors = models.ManyToManyField(Color, related_name='products',through='ProductColorQuantity')
    brand = models.ForeignKey(Brand,on_delete=models.CASCADE,default=1, related_name="products")

    def __str__(self):
        return f"ProductName: {self.name}, Seller: {self.seller}"

    def save(self, *args, **kwargs):
        if self.main_photo:
            self.main_photo = self.resize_image(self.main_photo)
        if self.photo1:
            self.photo1 = self.resize_image(self.photo1)
        if self.photo2:
            self.photo2 = self.resize_image(self.photo2)
        if self.photo3:
            self.photo3 = self.resize_image(self.photo3)
            
        super(Product, self).save(*args, **kwargs)

    def resize_image(self, image_field):
        img = Image.open(image_field)

        if img.mode == 'RGBA':
            img = img.convert('RGB')

        img = img.resize((500, 500), Image.Resampling.LANCZOS)

        img_io = BytesIO()
        img.save(img_io, format='JPEG')
        img_io.seek(0)

        image_field_name = image_field.name.split('/')[-1]

        image_file = InMemoryUploadedFile(
            img_io, None, image_field_name, 'image/jpeg', img_io.tell(), None
        )

        return image_file
    
    
    
class ProductColorQuantity(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    color = models.ForeignKey(Color, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)  

    class Meta:
        unique_together = ('product', 'color')


    def __str__(self):
        return f"{self.product.name} - {self.color.color_hex} Quantity: {self.quantity}"




class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user', 'product')
        
    def __str__(self):
        return f"{self.user} - {self.product.name} Wishlist"
