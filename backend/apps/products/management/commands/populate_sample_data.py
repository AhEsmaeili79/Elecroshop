import random
from decimal import Decimal
from django.core.management.base import BaseCommand, CommandError
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from apps.categories.models import Category, Brand, SubCategory, ProductModel
from apps.products.models import Product, ProductOffer, Color, OfferColorQuantity, ProductImage
from apps.users.models import Seller

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate database with sample data for 100 products across different categories'

    def handle(self, *args, **options):
        self.stdout.write('Starting sample data population...')

        try:
            # Create categories
            self.create_categories()
            self.stdout.write(self.style.SUCCESS('Categories created successfully'))

            # Create brands
            self.create_brands()
            self.stdout.write(self.style.SUCCESS('Brands created successfully'))

            # Create subcategories
            self.create_subcategories()
            self.stdout.write(self.style.SUCCESS('Subcategories created successfully'))

            # Create product models
            self.create_product_models()
            self.stdout.write(self.style.SUCCESS('Product models created successfully'))

            # Create sellers
            self.create_sellers()
            self.stdout.write(self.style.SUCCESS('Sellers created successfully'))

            # Create colors
            self.create_colors()
            self.stdout.write(self.style.SUCCESS('Colors created successfully'))

            # Create products
            self.create_products()
            self.stdout.write(self.style.SUCCESS('Products created successfully'))

            self.stdout.write(self.style.SUCCESS('Sample data population completed successfully!'))

        except Exception as e:
            raise CommandError(f'Error during data population: {str(e)}')

    def create_categories(self):
        categories_data = [
            {'name': 'Electronics', 'slug': 'electronics'},
            {'name': 'Fashion', 'slug': 'fashion'},
            {'name': 'Sports & Outdoors', 'slug': 'sports-outdoors'},
            {'name': 'Gaming & Entertainment', 'slug': 'gaming-entertainment'},
            {'name': 'Home & Kitchen', 'slug': 'home-kitchen'},
        ]

        for cat_data in categories_data:
            Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults={'name': cat_data['name']}
            )

    def create_brands(self):
        brands_data = [
            # Electronics
            {'name': 'Samsung', 'slug': 'samsung'},
            {'name': 'Apple', 'slug': 'apple'},
            {'name': 'Dell', 'slug': 'dell'},
            {'name': 'HP', 'slug': 'hp'},
            {'name': 'Lenovo', 'slug': 'lenovo'},
            {'name': 'ASUS', 'slug': 'asus'},
            {'name': 'Sony', 'slug': 'sony'},
            {'name': 'LG', 'slug': 'lg'},

            # Fashion
            {'name': 'Nike', 'slug': 'nike'},
            {'name': 'Adidas', 'slug': 'adidas'},
            {'name': 'Puma', 'slug': 'puma'},
            {'name': 'Levi\'s', 'slug': 'levis'},
            {'name': 'Zara', 'slug': 'zara'},
            {'name': 'H&M', 'slug': 'hm'},
            {'name': 'Gucci', 'slug': 'gucci'},
            {'name': 'Rolex', 'slug': 'rolex'},

            # Sports
            {'name': 'Under Armour', 'slug': 'under-armour'},
            {'name': 'Reebok', 'slug': 'reebok'},
            {'name': 'Wilson', 'slug': 'wilson'},
            {'name': 'Spalding', 'slug': 'spalding'},

            # Gaming
            {'name': 'Nintendo', 'slug': 'nintendo'},
            {'name': 'Microsoft', 'slug': 'microsoft'},
            {'name': 'PlayStation', 'slug': 'playstation'},
            {'name': 'Razer', 'slug': 'razer'},
        ]

        for brand_data in brands_data:
            Brand.objects.get_or_create(
                slug=brand_data['slug'],
                defaults={'name': brand_data['name']}
            )

    def create_subcategories(self):
        subcategories_data = [
            # Electronics
            {'name': 'Smartphones', 'category_slug': 'electronics'},
            {'name': 'Laptops', 'category_slug': 'electronics'},
            {'name': 'Tablets', 'category_slug': 'electronics'},
            {'name': 'Desktop PCs', 'category_slug': 'electronics'},
            {'name': 'TVs', 'category_slug': 'electronics'},

            # Fashion
            {'name': 'Shoes', 'category_slug': 'fashion'},
            {'name': 'Clothing', 'category_slug': 'fashion'},
            {'name': 'Watches', 'category_slug': 'fashion'},
            {'name': 'Accessories', 'category_slug': 'fashion'},

            # Sports & Outdoors
            {'name': 'Sports Equipment', 'category_slug': 'sports-outdoors'},
            {'name': 'Fitness Gear', 'category_slug': 'sports-outdoors'},
            {'name': 'Outdoor Clothing', 'category_slug': 'sports-outdoors'},

            # Gaming & Entertainment
            {'name': 'Video Games', 'category_slug': 'gaming-entertainment'},
            {'name': 'Gaming Consoles', 'category_slug': 'gaming-entertainment'},
            {'name': 'Gaming Accessories', 'category_slug': 'gaming-entertainment'},
        ]

        for sub_data in subcategories_data:
            category = Category.objects.get(slug=sub_data['category_slug'])
            SubCategory.objects.get_or_create(
                name=sub_data['name'],
                category=category
            )

    def create_product_models(self):
        models_data = [
            # Smartphones
            {'name': 'Galaxy S23', 'brand_slug': 'samsung', 'subcategory_name': 'Smartphones'},
            {'name': 'Galaxy S22', 'brand_slug': 'samsung', 'subcategory_name': 'Smartphones'},
            {'name': 'iPhone 15', 'brand_slug': 'apple', 'subcategory_name': 'Smartphones'},
            {'name': 'iPhone 14', 'brand_slug': 'apple', 'subcategory_name': 'Smartphones'},

            # Laptops
            {'name': 'XPS 13', 'brand_slug': 'dell', 'subcategory_name': 'Laptops'},
            {'name': 'XPS 15', 'brand_slug': 'dell', 'subcategory_name': 'Laptops'},
            {'name': 'Pavilion 15', 'brand_slug': 'hp', 'subcategory_name': 'Laptops'},
            {'name': 'ThinkPad X1', 'brand_slug': 'lenovo', 'subcategory_name': 'Laptops'},
            {'name': 'ZenBook 14', 'brand_slug': 'asus', 'subcategory_name': 'Laptops'},
            {'name': 'MacBook Air', 'brand_slug': 'apple', 'subcategory_name': 'Laptops'},
            {'name': 'MacBook Pro', 'brand_slug': 'apple', 'subcategory_name': 'Laptops'},

            # Tablets
            {'name': 'Galaxy Tab S9', 'brand_slug': 'samsung', 'subcategory_name': 'Tablets'},
            {'name': 'iPad Pro', 'brand_slug': 'apple', 'subcategory_name': 'Tablets'},
            {'name': 'iPad Air', 'brand_slug': 'apple', 'subcategory_name': 'Tablets'},

            # Desktop PCs
            {'name': 'OptiPlex 7090', 'brand_slug': 'dell', 'subcategory_name': 'Desktop PCs'},
            {'name': 'HP EliteDesk 800', 'brand_slug': 'hp', 'subcategory_name': 'Desktop PCs'},
            {'name': 'ThinkCentre M70', 'brand_slug': 'lenovo', 'subcategory_name': 'Desktop PCs'},

            # TVs
            {'name': 'QLED Q80C', 'brand_slug': 'samsung', 'subcategory_name': 'TVs'},
            {'name': 'OLED C9', 'brand_slug': 'lg', 'subcategory_name': 'TVs'},
            {'name': 'BRAVIA A80J', 'brand_slug': 'sony', 'subcategory_name': 'TVs'},

            # Shoes
            {'name': 'Air Max 270', 'brand_slug': 'nike', 'subcategory_name': 'Shoes'},
            {'name': 'Ultraboost 22', 'brand_slug': 'adidas', 'subcategory_name': 'Shoes'},
            {'name': 'RS-X', 'brand_slug': 'puma', 'subcategory_name': 'Shoes'},

            # Clothing
            {'name': '501 Original', 'brand_slug': 'levis', 'subcategory_name': 'Clothing'},
            {'name': 'Basic T-Shirt', 'brand_slug': 'zara', 'subcategory_name': 'Clothing'},
            {'name': 'Classic Polo', 'brand_slug': 'hm', 'subcategory_name': 'Clothing'},

            # Watches
            {'name': 'Submariner', 'brand_slug': 'rolex', 'subcategory_name': 'Watches'},
            {'name': 'Datejust', 'brand_slug': 'rolex', 'subcategory_name': 'Watches'},
            {'name': 'GG Marmont', 'brand_slug': 'gucci', 'subcategory_name': 'Watches'},

            # Sports Equipment
            {'name': 'Wilson Pro Staff', 'brand_slug': 'wilson', 'subcategory_name': 'Sports Equipment'},
            {'name': 'Spalding NBA', 'brand_slug': 'spalding', 'subcategory_name': 'Sports Equipment'},

            # Gaming
            {'name': 'Nintendo Switch OLED', 'brand_slug': 'nintendo', 'subcategory_name': 'Gaming Consoles'},
            {'name': 'Xbox Series X', 'brand_slug': 'microsoft', 'subcategory_name': 'Gaming Consoles'},
            {'name': 'PlayStation 5', 'brand_slug': 'playstation', 'subcategory_name': 'Gaming Consoles'},
        ]

        for model_data in models_data:
            brand = Brand.objects.get(slug=model_data['brand_slug'])
            subcategory = SubCategory.objects.get(name=model_data['subcategory_name'])
            ProductModel.objects.get_or_create(
                name=model_data['name'],
                brand=brand,
                defaults={'sub_category': subcategory}
            )

    def create_sellers(self):
        sellers_data = [
            {'username': 'electroshop_seller1', 'email': 'seller1@electroshop.com', 'shop_name': 'ElectroHub'},
            {'username': 'electroshop_seller2', 'email': 'seller2@electroshop.com', 'shop_name': 'TechWorld'},
            {'username': 'electroshop_seller3', 'email': 'seller3@electroshop.com', 'shop_name': 'FashionPlus'},
            {'username': 'electroshop_seller4', 'email': 'seller4@electroshop.com', 'shop_name': 'SportZone'},
            {'username': 'electroshop_seller5', 'email': 'seller5@electroshop.com', 'shop_name': 'GameCentral'},
        ]

        for seller_data in sellers_data:
            user, created = User.objects.get_or_create(
                email=seller_data['email'],
                defaults={
                    'first_name': seller_data['shop_name'].split()[0],
                    'last_name': seller_data['shop_name'].split()[-1] if len(seller_data['shop_name'].split()) > 1 else '',
                }
            )
            if created:
                user.set_password('password123')
                user.save()

            Seller.objects.get_or_create(
                user=user,
                defaults={
                    'shop_name': seller_data['shop_name'],
                    'description': f'Premium {seller_data["shop_name"]} store offering quality products',
                    'is_verified': True,
                    'is_active': True,
                }
            )

    def create_colors(self):
        colors_data = [
            {'name': 'Black', 'color_hex': '#000000'},
            {'name': 'White', 'color_hex': '#FFFFFF'},
            {'name': 'Red', 'color_hex': '#FF0000'},
            {'name': 'Blue', 'color_hex': '#0000FF'},
            {'name': 'Green', 'color_hex': '#00FF00'},
            {'name': 'Gray', 'color_hex': '#808080'},
            {'name': 'Silver', 'color_hex': '#C0C0C0'},
            {'name': 'Gold', 'color_hex': '#FFD700'},
            {'name': 'Purple', 'color_hex': '#800080'},
            {'name': 'Pink', 'color_hex': '#FFC0CB'},
        ]

        for color_data in colors_data:
            Color.objects.get_or_create(
                color_hex=color_data['color_hex'],
                defaults={'name': color_data['name']}
            )

    def get_product_specifications(self, subcategory_name):
        """Generate appropriate specifications based on product type"""
        specs = {}

        if subcategory_name == 'Smartphones':
            specs = {
                'display': {
                    'size': f'{random.choice([6.1, 6.4, 6.7])} inches',
                    'resolution': random.choice(['1080 x 2400', '1170 x 2532', '1080 x 2340']),
                    'technology': random.choice(['Super AMOLED', 'OLED', 'IPS LCD']),
                    'refresh_rate': f'{random.choice([60, 90, 120])}Hz'
                },
                'processor': {
                    'chipset': random.choice(['Snapdragon 8 Gen 2', 'A16 Bionic', 'Exynos 2200']),
                    'cpu': random.choice(['Octa-core', 'Hexa-core']),
                    'gpu': random.choice(['Adreno 740', 'Apple GPU', 'Mali-G710'])
                },
                'memory': {
                    'ram': f'{random.choice([4, 6, 8, 12])}GB',
                    'storage': f'{random.choice([64, 128, 256, 512])}GB',
                    'expandable': random.choice([True, False])
                },
                'camera': {
                    'main': f'{random.choice([12, 48, 50, 108])}MP',
                    'front': f'{random.choice([8, 12, 16])}MP',
                    'features': ['4K Video', 'Night Mode', 'Portrait Mode']
                },
                'battery': {
                    'capacity': f'{random.choice([3000, 4000, 4500, 5000])}mAh',
                    'fast_charging': random.choice([25, 45, 65, 120]) if random.choice([True, False]) else None,
                    'wireless_charging': random.choice([True, False])
                },
                'connectivity': {
                    'network': random.choice(['5G', '4G LTE']),
                    'wifi': 'Wi-Fi 6',
                    'bluetooth': random.choice(['5.2', '5.3']),
                    'usb': random.choice(['USB-C', 'Lightning'])
                },
                'os': random.choice(['Android 13', 'iOS 17']),
                'dimensions': f'{random.randint(140, 170)} x {random.randint(65, 80)} x {random.randint(7, 10)} mm',
                'weight': f'{random.randint(150, 220)}g'
            }

        elif subcategory_name == 'Laptops':
            specs = {
                'display': {
                    'size': f'{random.choice([13.3, 14.0, 15.6, 16.0])} inches',
                    'resolution': random.choice(['1920 x 1080', '2560 x 1440', '2880 x 1800']),
                    'type': random.choice(['IPS', 'OLED', 'TN']),
                    'refresh_rate': f'{random.choice([60, 90, 120, 144])}Hz'
                },
                'processor': {
                    'cpu': random.choice(['Intel Core i5-12450H', 'Intel Core i7-12700H', 'AMD Ryzen 5 5600H', 'AMD Ryzen 7 5800H', 'Apple M2', 'Apple M2 Pro']),
                    'cores': random.choice([6, 8, 10, 12])
                },
                'memory': {
                    'ram': f'{random.choice([8, 16, 32])}GB',
                    'type': random.choice(['DDR4', 'DDR5', 'LPDDR5']),
                    'storage': f'{random.choice([256, 512, 1024, 2048])}GB SSD'
                },
                'graphics': {
                    'gpu': random.choice(['Intel Iris Xe', 'NVIDIA RTX 3050', 'NVIDIA RTX 3060', 'AMD Radeon RX 6500M', 'Apple M2 GPU']),
                    'vram': f'{random.choice([2, 4, 6, 8])}GB'
                },
                'battery': {
                    'capacity': f'{random.randint(40, 100)}Wh',
                    'life': f'{random.randint(4, 12)} hours'
                },
                'ports': {
                    'usb_c': random.randint(1, 3),
                    'usb_a': random.randint(0, 2),
                    'hdmi': random.randint(0, 1),
                    'headphone_jack': random.choice([True, False])
                },
                'os': random.choice(['Windows 11', 'macOS Ventura', 'Ubuntu Linux']),
                'dimensions': f'{random.randint(300, 400)} x {random.randint(200, 280)} x {random.randint(10, 25)} mm',
                'weight': f'{random.uniform(1.0, 2.5):.1f} kg'
            }

        elif subcategory_name == 'Tablets':
            specs = {
                'display': {
                    'size': f'{random.choice([10.9, 11.0, 12.9])} inches',
                    'resolution': random.choice(['2048 x 1536', '2360 x 1640', '2732 x 2048']),
                    'type': random.choice(['Liquid Retina', 'IPS LCD']),
                    'brightness': f'{random.randint(400, 600)} nits'
                },
                'processor': {
                    'chip': random.choice(['Apple M2', 'Apple A14 Bionic', 'Snapdragon 8 Gen 2']),
                    'cpu': random.choice(['Octa-core', 'Hexa-core'])
                },
                'memory': {
                    'ram': f'{random.choice([4, 8, 16])}GB',
                    'storage': f'{random.choice([64, 128, 256, 512, 1024])}GB'
                },
                'camera': {
                    'rear': f'{random.choice([8, 12])}MP',
                    'front': f'{random.choice([7, 12])}MP',
                    'features': ['4K Video', 'Portrait Mode']
                },
                'battery': {
                    'capacity': f'{random.randint(7000, 10000)}mAh',
                    'life': f'{random.randint(8, 15)} hours'
                },
                'connectivity': {
                    'cellular': random.choice([True, False]),
                    'wifi': 'Wi-Fi 6',
                    'bluetooth': random.choice(['5.0', '5.2', '5.3'])
                },
                'os': random.choice(['iPadOS 17', 'Android 13']),
                'dimensions': f'{random.randint(240, 280)} x {random.randint(170, 200)} x {random.randint(5, 8)} mm',
                'weight': f'{random.uniform(0.5, 1.0):.1f} kg'
            }

        elif subcategory_name == 'Desktop PCs':
            specs = {
                'processor': {
                    'cpu': random.choice(['Intel Core i5-12400', 'Intel Core i7-12700', 'AMD Ryzen 5 5600', 'AMD Ryzen 7 5700X']),
                    'cores': random.choice([6, 8, 12, 16])
                },
                'memory': {
                    'ram': f'{random.choice([8, 16, 32, 64])}GB',
                    'type': random.choice(['DDR4-3200', 'DDR5-4800']),
                    'slots': random.choice([2, 4])
                },
                'storage': {
                    'primary': f'{random.choice([256, 512, 1024, 2048])}GB SSD',
                    'secondary': random.choice([None, '1TB HDD', '2TB HDD'])
                },
                'graphics': {
                    'gpu': random.choice(['Integrated', 'NVIDIA GTX 1660', 'NVIDIA RTX 3060', 'AMD RX 6600']),
                    'vram': f'{random.choice([0, 6, 8, 12])}GB' if random.choice([True, False]) else 'Integrated'
                },
                'power_supply': f'{random.choice([400, 500, 600, 750])}W',
                'case_type': random.choice(['Mini Tower', 'Mid Tower', 'Full Tower']),
                'os': random.choice(['Windows 11 Pro', 'Windows 10 Pro', 'Ubuntu Linux']),
                'dimensions': f'{random.randint(150, 200)} x {random.randint(400, 500)} x {random.randint(350, 450)} mm',
                'weight': f'{random.uniform(5, 15):.1f} kg'
            }

        elif subcategory_name == 'TVs':
            screen_sizes = [32, 43, 50, 55, 65, 75, 85]
            specs = {
                'display': {
                    'size': f'{random.choice(screen_sizes)} inches',
                    'resolution': random.choice(['3840 x 2160 (4K)', '7680 x 4320 (8K)', '1920 x 1080 (Full HD)']),
                    'type': random.choice(['QLED', 'OLED', 'LED', 'NanoCell']),
                    'hdr': random.choice(['HDR10', 'HDR10+', 'Dolby Vision'])
                },
                'smart_features': {
                    'os': random.choice(['Tizen', 'webOS', 'Android TV', 'Roku TV']),
                    'voice_control': random.choice([True, False]),
                    'streaming_apps': ['Netflix', 'YouTube', 'Disney+', 'Prime Video']
                },
                'connectivity': {
                    'hdmi': random.randint(2, 4),
                    'usb': random.randint(1, 3),
                    'wifi': random.choice(['Wi-Fi 5', 'Wi-Fi 6']),
                    'bluetooth': random.choice([True, False])
                },
                'audio': {
                    'speakers': random.choice([2, 4]),
                    'watts': f'{random.choice([10, 20, 30])}W',
                    'dolby_atmos': random.choice([True, False])
                },
                'power_consumption': f'{random.randint(50, 200)}W',
                'dimensions': f'{random.randint(700, 1800)} x {random.randint(400, 1000)} x {random.randint(50, 100)} mm',
                'weight': f'{random.uniform(8, 30):.1f} kg'
            }

        elif subcategory_name == 'Shoes':
            specs = {
                'type': random.choice(['Running', 'Casual', 'Basketball', 'Training', 'Walking']),
                'material': {
                    'upper': random.choice(['Synthetic', 'Mesh', 'Leather', 'Canvas']),
                    'midsole': random.choice(['Foam', 'Gel', 'Air', 'EVA']),
                    'outsole': random.choice(['Rubber', 'TPU', 'EVA'])
                },
                'features': {
                    'cushioning': random.choice(['High', 'Medium', 'Low']),
                    'support': random.choice(['Neutral', 'Stability', 'Motion Control']),
                    'breathability': random.choice(['High', 'Medium', 'Low'])
                },
                'size_range': f'US {random.randint(6, 13)} - {random.randint(13, 16)}',
                'weight': f'{random.uniform(200, 400):.0f}g per shoe',
                'warranty': f'{random.choice([1, 2])} year limited warranty'
            }

        elif subcategory_name == 'Clothing':
            specs = {
                'type': random.choice(['T-Shirt', 'Polo', 'Jeans', 'Jacket', 'Dress', 'Sweater']),
                'material': random.choice(['Cotton', 'Polyester', 'Cotton Blend', 'Denim', 'Wool']),
                'size': random.choice(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
                'fit': random.choice(['Regular', 'Slim', 'Loose', 'Oversized']),
                'care_instructions': ['Machine Wash', 'Tumble Dry Low', 'Do Not Bleach'],
                'origin': random.choice(['USA', 'Vietnam', 'China', 'Turkey', 'Bangladesh'])
            }

        elif subcategory_name == 'Watches':
            specs = {
                'type': random.choice(['Analog', 'Digital', 'Smartwatch', 'Chronograph']),
                'movement': random.choice(['Quartz', 'Automatic', 'Manual Wind', 'Smart OS']),
                'case': {
                    'material': random.choice(['Stainless Steel', 'Titanium', 'Gold', 'Ceramic']),
                    'diameter': f'{random.randint(35, 45)}mm',
                    'thickness': f'{random.randint(8, 15)}mm'
                },
                'dial': {
                    'color': random.choice(['Black', 'White', 'Blue', 'Silver']),
                    'style': random.choice(['Minimalist', 'Sport', 'Luxury', 'Casual'])
                },
                'strap': random.choice(['Leather', 'Stainless Steel', 'Rubber', 'Fabric']),
                'water_resistance': f'{random.choice([30, 50, 100, 200, 300])}m',
                'features': ['Date Display', 'Chronograph', 'Luminous Markers'],
                'warranty': f'{random.choice([2, 5, 10])} years'
            }

        elif subcategory_name == 'Sports Equipment':
            specs = {
                'type': random.choice(['Tennis Racket', 'Basketball', 'Soccer Ball', 'Baseball Glove']),
                'material': random.choice(['Carbon Fiber', 'Aluminum', 'Composite', 'Leather']),
                'weight': f'{random.uniform(200, 400):.0f}g',
                'size': random.choice(['Youth', 'Adult', 'Professional']),
                'usage': random.choice(['Recreational', 'Tournament', 'Training']),
                'warranty': f'{random.choice([1, 2])} year manufacturer warranty'
            }

        elif subcategory_name == 'Gaming Consoles':
            specs = {
                'type': random.choice(['Home Console', 'Handheld', 'Hybrid']),
                'processor': {
                    'cpu': random.choice(['AMD Zen 2', 'Custom ARM', 'NVIDIA Tegra']),
                    'gpu': random.choice(['AMD RDNA 2', 'Custom GPU', 'NVIDIA GPU'])
                },
                'memory': {
                    'ram': f'{random.choice([8, 12, 16])}GB',
                    'storage': f'{random.choice([256, 512, 1000])}GB SSD'
                },
                'display': {
                    'resolution': random.choice(['720p', '1080p', '4K']),
                    'hdr': random.choice([True, False])
                },
                'connectivity': {
                    'wifi': 'Wi-Fi 6',
                    'bluetooth': random.choice(['4.2', '5.0', '5.1']),
                    'usb': random.randint(2, 4)
                },
                'controllers': random.randint(1, 2),
                'backward_compatibility': random.choice([True, False]),
                'dimensions': f'{random.randint(200, 300)} x {random.randint(100, 200)} x {random.randint(50, 100)} mm',
                'weight': f'{random.uniform(0.3, 4.0):.1f} kg'
            }

        return specs

    def create_products(self):
        # Get all necessary objects
        categories = {cat.slug: cat for cat in Category.objects.all()}
        subcategories = {sub.name: sub for sub in SubCategory.objects.all()}
        brands = {brand.slug: brand for brand in Brand.objects.all()}
        product_models = {(model.name, model.brand.slug): model for model in ProductModel.objects.all()}
        sellers = list(Seller.objects.all())
        colors = list(Color.objects.all())

        # Define product templates for each subcategory
        product_templates = {
            'Smartphones': [
                {'brand': 'samsung', 'models': ['Galaxy S23', 'Galaxy S22'], 'count': 15},
                {'brand': 'apple', 'models': ['iPhone 15', 'iPhone 14'], 'count': 10},
            ],
            'Laptops': [
                {'brand': 'dell', 'models': ['XPS 13', 'XPS 15'], 'count': 12},
                {'brand': 'hp', 'models': ['Pavilion 15'], 'count': 8},
                {'brand': 'lenovo', 'models': ['ThinkPad X1'], 'count': 6},
                {'brand': 'asus', 'models': ['ZenBook 14'], 'count': 6},
                {'brand': 'apple', 'models': ['MacBook Air', 'MacBook Pro'], 'count': 8},
            ],
            'Tablets': [
                {'brand': 'samsung', 'models': ['Galaxy Tab S9'], 'count': 5},
                {'brand': 'apple', 'models': ['iPad Pro', 'iPad Air'], 'count': 8},
            ],
            'Desktop PCs': [
                {'brand': 'dell', 'models': ['OptiPlex 7090'], 'count': 4},
                {'brand': 'hp', 'models': ['HP EliteDesk 800'], 'count': 3},
                {'brand': 'lenovo', 'models': ['ThinkCentre M70'], 'count': 3},
            ],
            'TVs': [
                {'brand': 'samsung', 'models': ['QLED Q80C'], 'count': 6},
                {'brand': 'lg', 'models': ['OLED C9'], 'count': 4},
                {'brand': 'sony', 'models': ['BRAVIA A80J'], 'count': 4},
            ],
            'Shoes': [
                {'brand': 'nike', 'models': ['Air Max 270'], 'count': 8},
                {'brand': 'adidas', 'models': ['Ultraboost 22'], 'count': 6},
                {'brand': 'puma', 'models': ['RS-X'], 'count': 4},
            ],
            'Clothing': [
                {'brand': 'levis', 'models': ['501 Original'], 'count': 5},
                {'brand': 'zara', 'models': ['Basic T-Shirt'], 'count': 4},
                {'brand': 'hm', 'models': ['Classic Polo'], 'count': 4},
            ],
            'Watches': [
                {'brand': 'rolex', 'models': ['Submariner', 'Datejust'], 'count': 6},
                {'brand': 'gucci', 'models': ['GG Marmont'], 'count': 3},
            ],
            'Sports Equipment': [
                {'brand': 'wilson', 'models': ['Wilson Pro Staff'], 'count': 4},
                {'brand': 'spalding', 'models': ['Spalding NBA'], 'count': 3},
            ],
            'Gaming Consoles': [
                {'brand': 'nintendo', 'models': ['Nintendo Switch OLED'], 'count': 4},
                {'brand': 'microsoft', 'models': ['Xbox Series X'], 'count': 3},
                {'brand': 'playstation', 'models': ['PlayStation 5'], 'count': 4},
            ],
        }

        product_count = 0

        for subcategory_name, templates in product_templates.items():
            subcategory = subcategories[subcategory_name]
            category = subcategory.category

            for template in templates:
                brand = brands[template['brand']]

                for model_name in template['models']:
                    model_key = (model_name, template['brand'])
                    product_model = product_models.get(model_key)

                    for i in range(template['count']):
                        if product_count >= 100:
                            break

                        # Generate product name with variation
                        variation_suffix = f" {random.choice(['Pro', 'Plus', 'Ultra', 'Max', 'Mini', 'Lite', 'Premium'])}{' ' + str(random.randint(1, 5)) if random.choice([True, False]) else ''}"
                        product_name = f"{model_name}{variation_suffix}"

                        # Create product
                        product = Product.objects.create(
                            name=product_name,
                            category=category,
                            sub_category=subcategory,
                            brand=brand,
                            product_model=product_model,
                            description=f"Premium {subcategory_name.lower()} from {brand.name}. Features advanced technology and superior performance.",
                            specifications=self.get_product_specifications(subcategory_name),
                            is_active=True
                        )

                        # Create offers for random sellers
                        num_offers = random.randint(1, 3)
                        selected_sellers = random.sample(sellers, num_offers)

                        for seller in selected_sellers:
                            # Generate random price based on category
                            base_price = {
                                'Smartphones': random.randint(300, 1200),
                                'Laptops': random.randint(800, 2500),
                                'Tablets': random.randint(200, 1000),
                                'Desktop PCs': random.randint(600, 1500),
                                'TVs': random.randint(400, 2000),
                                'Shoes': random.randint(50, 200),
                                'Clothing': random.randint(20, 150),
                                'Watches': random.randint(200, 5000),
                                'Sports Equipment': random.randint(30, 300),
                                'Gaming Consoles': random.randint(300, 600),
                            }.get(subcategory_name, 100)

                            price = Decimal(str(base_price + random.randint(-50, 100)))
                            discount_percentage = Decimal(str(random.choice([0, 5, 10, 15, 20])))

                            offer = ProductOffer.objects.create(
                                product=product,
                                seller=seller,
                                price=price,
                                stock_status=True,
                                is_active=True
                            )

                            # Create color quantities
                            num_colors = random.randint(1, 4)
                            selected_colors = random.sample(colors, num_colors)

                            for color in selected_colors:
                                quantity = random.randint(10, 100)
                                OfferColorQuantity.objects.create(
                                    offer=offer,
                                    color=color,
                                    quantity=quantity
                                )

                        product_count += 1
                        if product_count % 10 == 0:
                            self.stdout.write(f'Created {product_count} products...')

        self.stdout.write(f'Total products created: {product_count}')
