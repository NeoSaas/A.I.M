from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('bot-action/', views.bot_action, name='bot-action'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('conversations/', views.conversation_list, name='conversation-list'),
    path('get-statistics/', views.conversation_stats, name='conversation-stats'),
    path('invoke-endpoint/', views.invoke_endpoint, name='response-creation'),
    path('create-conversation-object', views.generate_and_add_conversation, name='add-conversation-model'),
    path('get-conversation', views.get_conversation, name='get-conversation'),
    path('conversations/<str:conversation_id>/add_message/', views.add_message_to_conversation, name='append-conversation'),
]

