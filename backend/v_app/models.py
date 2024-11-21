
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model


# Custom User model for different user roles, inheriting from AbstractUser
class User(AbstractUser):
    is_admin = models.BooleanField(default=False)

    # Adding related_name to avoid conflicts with Django's default User model
    groups = models.ManyToManyField('auth.Group', related_name='custom_user_set', blank=True)
    user_permissions = models.ManyToManyField('auth.Permission', related_name='custom_user_permissions_set', blank=True)

    def __str__(self):
        return self.username

    def has_perm(self, perm):
        return self.is_admin or super().has_perm(perm)

    def has_module_perms(self, app_label):
        return self.is_admin or super().has_module_perms(app_label)


# Video Post model
class VideoPost(models.Model):
    title = models.CharField(max_length=255, blank=False)  # Correct usage of blank=False to make the field required
    description = models.TextField()
    publisher_name = models.CharField(max_length=100, blank=False)  # Correct usage of blank=False to make the field required
    date = models.DateTimeField(auto_now_add=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    video_url = models.URLField(blank=False)  # Correct usage of blank=False to make the field required

    # Establishing a ForeignKey relationship with the User model
    # user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    def __str__(self):
        return self.title
