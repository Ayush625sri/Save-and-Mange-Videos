from django.contrib import admin
from .models import VideoPost, User

# Custom admin class for VideoPost model
class VideoPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'publisher_name', 'date')  # Customize fields displayed in the admin list view
    search_fields = ('title', 'publisher_name')  # Allow search functionality for these fields

# Custom admin class for User model
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_admin')  # Customize fields displayed in the admin list view
    search_fields = ('username', 'email')  # Allow search functionality for these fields

# Register your models with the custom admin classes
admin.site.register(VideoPost, VideoPostAdmin)
admin.site.register(User, UserAdmin)
