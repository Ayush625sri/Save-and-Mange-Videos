


from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterUser.as_view(), name='register'), # working
    path('login/', LoginUser.as_view(), name='login'), # working
    path('logout/', LogoutUser.as_view(), name='logout'), # working
    
    
    # path('user/', get_user_info, name='get_user_info'),

    path('create-video/', CreateVideoPost.as_view(), name='create-video'), # working
    path('user-dashboard/', GetUserDashboard.as_view(), name='user-dashboard'), # fetch all created videos of particular users
    path('profile/update/', UpdateUserProfile.as_view(), name='update-user-profile'), # working

    # path('videos/all/')
    path('videos/', GetAllVideos.as_view(), name='get-all-videos'),  # Fetch all videos posted by all users
    path('video/<int:video_id>/', GetSingleVideo.as_view(), name='get-single-video'),  # Fetch a single video by ID

   # admin routes
    path('admin-dashboard/', AdminDashboard.as_view(), name='admin-dashboard'), # fetch all videos post and users
    path('delete-video/<int:video_id>/', DeleteVideo.as_view(), name='delete-video'), # working
    path('delete-user/<int:user_id>/', DeleteUser.as_view(), name='delete-user'), # working
]
