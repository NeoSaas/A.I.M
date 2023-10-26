from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework import status
from .models import Conversation, ConversationStatistics
from .serializers import ConversationSerializer
from django.core.management import call_command
import requests
import json
from boto3 import Session
from requests_aws4auth import AWS4Auth

def index(request):
    tag_to_monitor = 'your_tag_name'
    # conversations = fetch_conversations(tag_to_monitor)
    
    return JsonResponse({'conversations': 'test'})


@api_view(['POST'])
def bot_action(request):
    #respond to email
    bot_response = "Bot's response here"
    return Response({'response': bot_response})

@api_view(['POST'])
def login_view(request):
    #login 
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({'message': 'Login successful'})
    else:
        return JsonResponse({'message': 'Login failed'}, status=401)

@api_view(['POST'])
def logout_view(request):
    #logout
    logout(request)
    return JsonResponse({'message': 'Logout successful'})

@api_view(['GET'])
def conversation_list(request):
    conversations = Conversation.objects.all()
    serializer = ConversationSerializer(conversations, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def get_conversation(request):
    convo_id = request.GET.get('convo_id')
    print(convo_id)
    conversation = Conversation.objects.filter(id=convo_id).first()
    print(conversation)
    if conversation:
        serializer = ConversationSerializer(conversation)
        return JsonResponse(serializer.data)
    else:
        return JsonResponse({"error": "Conversation not found"}, status=404)

@api_view(['POST'])
def generate_and_add_conversation(request):
    # Create a new conversation
    new_conversation = Conversation(
        name="New Conversation",  
        aidr_response=request.data.get('response_payload'),
        prompt=request.data.get('input'),
    )
    new_conversation.save()
    serializer = ConversationSerializer(new_conversation)
    
    return Response(serializer.data, status=status.HTTP_201_CREATED)

def conversation_stats(request):
    call_command('calc_stats')
    stats = ConversationStatistics.objects.all()
    data = [{'tag': stat.tag, 'count': stat.conversation_count} for stat in stats]

    return JsonResponse({'data': data})

@api_view(['POST'])
def invoke_endpoint(request):
    #call lambda function in the cloud to invoke sagemaker endpoint for response generation
    input = request.data.get('query','')
    lambda_payload = {
        "queryStringParameters": input,
    }
    
    session = Session()
    credentials = session.get_credentials()
    aws_access_key = credentials.access_key
    aws_secret_key = credentials.secret_key
    region = session.region_name
    service = 'execute-api'
    endpoint = 'https://k55vvzomjb.execute-api.us-east-1.amazonaws.com/default/generateResponse'
    auth = AWS4Auth(aws_access_key, aws_secret_key, region, service)
    
    payload_bytes = json.dumps(lambda_payload).encode('utf-8')
    r = requests.post(endpoint, data=lambda_payload, auth=auth)
    response_payload = r.json()
    # response_payload_parsed = json.loads(response_payload)
    
    print(r)
    # requests.post('http://127.0.0.1:8000/api/create-conversation-object', response_payload[0][0], input)
    
    return JsonResponse({'response-payload': response_payload})