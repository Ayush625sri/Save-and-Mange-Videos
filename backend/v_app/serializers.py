from rest_framework import serializers
from .models import VideoPost, User
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User

# Serializer for VideoPost
class VideoSerializer(serializers.ModelSerializer):
  
    class Meta:
        model = VideoPost
        fields = ['title', 'description', 'video_url', 'publisher_name', 'thumbnail', 'id']  # Include all fields by default

    def __init__(self, *args, **kwargs):
        # Dynamically include specified fields
        fields = kwargs.get('fields', None)
        super().__init__(*args, **kwargs)
        if fields:
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)

    def create(self, validated_data):
        user = self.context['request'].user
        if not user:
            raise serializers.ValidationError("User must be provided.")
        
        
        # Debug: Check the type of the user
        if not isinstance(user,  get_user_model()):
            raise serializers.ValidationError(f"Expected a User instance, but got {type(user)}.")

        validated_data.pop('user', None)

        # Create the VideoPost instance with the validated data and associated user
        return VideoPost.objects.create(user=user, **validated_data)


# Serializer for User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name','id']

# serializers.py



class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']

    def update(self, instance, validated_data):
        # Update the user instance with validated data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance




class VideoPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoPost
        fields = ['id', 'title', 'description', 'publisher_name', 'date', 'thumbnail', 'video_url']