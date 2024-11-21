from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import VideoPost
from .serializers import *
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import AllowAny
from django.db import IntegrityError
from rest_framework.authtoken.models import Token
from django.http import Http404
from rest_framework.exceptions import NotFound
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt
# @csrf_exempt


# User Registration
class RegisterUser(APIView):
    permission_classes = [AllowAny]  # Allow any user to register

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        # Basic validation
        if not username or not password or not email:
            return Response({"detail": "Username, password, and email are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create a new user
            user = User.objects.create_user(username=username, password=password, email=email)
            
            # Create a token for the user
            token, created = Token.objects.get_or_create(user=user)  # Get or create the token for the user

            # Set the token in the cookies of the response
            response = Response({
                "detail": "User created successfully.",
                "is_admin": user.is_superuser
            }, status=status.HTTP_201_CREATED)

            response.set_cookie(
                'auth_token',  # Name of the cookie
                token.key,  # Value of the token
                httponly=True,  
                secure=True,  
                samesite='Strict',  
                max_age=3600  # Set cookie expiration time (1 hour in this case)
            )

            return response

        except IntegrityError:
            return Response({"detail": "Username or email already exists."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": f"Error creating user: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        
# User Login

class LoginUser(APIView):
    permission_classes = [AllowAny]  # Allow any user to log in

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Validate that both username and password are provided
        if not username or not password:
            return Response({"detail": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate the user
        user = authenticate(username=username, password=password)
        if user is not None:
            # Log the user in
            login(request, user)

            # Create or get the token for the user
            token, created = Token.objects.get_or_create(user=user)

            # Prepare response data including is_admin status
            response_data = {
                "detail": "Login successful.",
                "is_admin": user.is_superuser , # Send the is_admin status
                "auth_token":token.key

            }

            # Create a response and set the token in the cookies
            response = Response(response_data, status=status.HTTP_200_OK)

            # Set the token in cookies
            response.set_cookie(
                'auth_token',  # Name of the cookie
                token.key,  # Value of the token
                httponly=True,  # Prevent JavaScript from accessing the cookie
                secure=False,  # Send the cookie only over HTTPS
                samesite='Strict',  # SameSite attribute to avoid CSRF attacks
                max_age=3600  # Set cookie expiration time (1 hour)
            )

            return response
        else:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

# User Logout
# @csrf_exempt
class LogoutUser(APIView):
    def post(self, request):
        # Logout the user
        logout(request)

        # Clear the authentication token from cookies
        response = Response({"detail": "Logout successful."}, status=status.HTTP_200_OK)
        response.delete_cookie('auth_token')  # Remove the token from cookies

        return response
    
    
# Create Video Post
class CreateVideoPost(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
       
        video_serializer = VideoSerializer(data=request.data, context={'request': request})

        if video_serializer.is_valid():
            video_serializer.save()  # Associate the video post with the logged-in user
            return Response(video_serializer.data, status=status.HTTP_201_CREATED)
        return Response(video_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Get User Dashboard (Get all videos created by the logged-in user)
class GetUserDashboard(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Using Django ORM to filter videos created by the logged-in user
        videos = VideoPost.objects.filter(user=request.user)
        video_serializer = VideoSerializer(videos, many=True)
        return Response(video_serializer.data)


# Admin Dashboard (Get all users and videos, manage users and posts)
class AdminDashboard(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:  # Ensure that the user is an admin
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        # Get all videos and users for admin management
        videos = VideoPost.objects.all()
        users = get_user_model().objects.all()  # Get all users via Django's User model
        return Response({
            "videos": VideoSerializer(videos, many=True).data,
            "users": UserSerializer(users, many=True).data
        })


# Delete Video (Admin Only)
class DeleteVideo(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, video_id):
        if not request.user.is_superuser:  # Ensure that the user is an admin
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        try:
            video = VideoPost.objects.get(id=video_id)
            video.delete()
            return Response({"detail": "Video deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except VideoPost.DoesNotExist:
            return Response({"detail": "Video not found"}, status=status.HTTP_404_NOT_FOUND)


# Delete User (Admin Only)
class DeleteUser(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id):
        if not request.user.is_superuser:  # Ensure that the user is an admin
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        try:
            user = get_user_model().objects.get(id=user_id)
            if user.is_superuser:
                return Response({"detail": "Cant Remove admin"})
            user.delete()
            return Response({"detail": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except get_user_model().DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)


# Update User Profile 
class UpdateUserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise Http404

    def put(self, request):
        # Get the authenticated user (request.user)
        user = request.user
        
        # Serialize and validate the data
        serializer = UserProfileUpdateSerializer(user, data=request.data)
        
        if serializer.is_valid():
            serializer.save()  # Save updated data
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



#Get all Videos
class GetAllVideos(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Fetch all videos posted by any user (no filtering by current user)
        videos = VideoPost.objects.all()
        serializer = VideoPostSerializer(videos, many=True)
        return Response(serializer.data)
    

class GetSingleVideo(APIView):
    permission_classes = [AllowAny]

    def get(self, request, video_id):
        try:
            # Fetch the video with the given ID. Optionally, check if it's the user's own video if needed.
            video = VideoPost.objects.get(id=video_id)
            serializer = VideoPostSerializer(video)
            return Response(serializer.data)
        except VideoPost.DoesNotExist:
            raise NotFound('Video not found.')
        
        
