from django.db import models
from django.conf import settings
from category.models import Category
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile


class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.PositiveIntegerField(blank=False)
    quantity = models.IntegerField(blank=False)
    model = models.CharField(max_length=255)
    is_favorited_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="favorite_products", blank=True
    )
    main_photo = models.ImageField(upload_to="products/%Y/%m/%d/", blank=False)
    photo1 = models.ImageField(upload_to="products/%Y/%m/%d/", blank=True)
    photo2 = models.ImageField(upload_to="products/%Y/%m/%d/", blank=True)
    photo3 = models.ImageField(upload_to="products/%Y/%m/%d/", blank=True)
    photo4 = models.ImageField(upload_to="products/%Y/%m/%d/", blank=True)
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)

    def __str__(self):
        return f"ProductName: {self.name}, Count: {self.quantity}, Seller: {self.seller}"

    def save(self, *args, **kwargs):
        # Resize all the images before saving
        if self.main_photo:
            self.main_photo = self.resize_image(self.main_photo)
        if self.photo1:
            self.photo1 = self.resize_image(self.photo1)
        if self.photo2:
            self.photo2 = self.resize_image(self.photo2)
        if self.photo3:
            self.photo3 = self.resize_image(self.photo3)
        if self.photo4:
            self.photo4 = self.resize_image(self.photo4)
        
        super(Product, self).save(*args, **kwargs)

    def resize_image(self, image_field):
        # Open the image
        img = Image.open(image_field)

        # If the image has an alpha channel (RGBA), convert it to RGB
        if img.mode == 'RGBA':
            img = img.convert('RGB')

        # Resize the image
        img = img.resize((221, 221), Image.Resampling.LANCZOS)

        # Save it into a BytesIO object to convert it back to an InMemoryUploadedFile
        img_io = BytesIO()
        img.save(img_io, format='JPEG')
        img_io.seek(0)

        # Generate the file name
        image_field_name = image_field.name.split('/')[-1]

        # Return the image as an InMemoryUploadedFile
        image_file = InMemoryUploadedFile(
            img_io, None, image_field_name, 'image/jpeg', img_io.tell(), None
        )

        return image_file
