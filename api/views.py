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
import sys, os, base64, datetime, hashlib, hmac 

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
    conversation = Conversation.objects.filter(id=convo_id).first()
    if conversation:
        serializer = ConversationSerializer(conversation)
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({"error": "Conversation not found"}, status=404)

@api_view(['POST'])
def generate_and_add_conversation(request):
    # Create a new conversation
    message_array = {
        "messages": [
            {
                "index":"0",
                "sender":"user",
                "content":request.data.get('query')
            },
            {
                "index":"1",
                "sender":"bot",
                "content":request.data.get('response_payload')
            }
        ]
    }

    
    new_conversation = Conversation(
        messages=message_array['messages'],
    )
    new_conversation.save()
    serializer = ConversationSerializer(new_conversation)
    
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def add_message_to_conversation(request, conversation_id):
    try:
        conversation = Conversation.objects.get(id=conversation_id)
        existing_messages = conversation.messages
        
        new_message = {
            "index": str(len(existing_messages)),  
            "sender": request.data.get('sender'),  
            "content": request.data.get('content')  
        }
        
        existing_messages.append(new_message)
        conversation.messages = existing_messages
        conversation.save()
        
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Conversation.DoesNotExist:
        return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)

def conversation_stats(request):
    call_command('calc_stats')
    stats = ConversationStatistics.objects.all()
    data = [{'tag': stat.tag, 'count': stat.conversation_count} for stat in stats]

    return JsonResponse({'data': data})

@api_view(['POST'])
def invoke_endpoint(request):
    session = Session()
    credentials = session.get_credentials()
    aws_access_key = credentials.access_key
    aws_secret_key = credentials.secret_key
    region = session.region_name
    service = 'execute-api'
    endpoint = "https://k55vvzomjb.execute-api.us-east-1.amazonaws.com/default/generateResponse"
    method = 'POST'
    host = 'k55vvzomjb.execute-api.us-east-1.amazonaws.com'
    content_type = 'application/json'
    t = datetime.datetime.utcnow()
    amz_date = t.strftime('%Y%m%dT%H%M%SZ')
    date_stamp = t.strftime('%Y%m%d')
    dhash = hashlib.md5()
    
    input = request.data.get('query')
    # lambda_payload = { 
    #         query: input,    
    # }
    
    request_parameters =  f'"{input}"'
    print(request_parameters)
    query_payload = json.dumps(request_parameters, sort_keys=True).encode('utf-8')
    dhash.update(query_payload)
    
    def sign(key, msg):
        return hmac.new(key, msg.encode("utf-8"), hashlib.sha256).digest()

    def getSignatureKey(key, date_stamp, regionName, serviceName):
        kDate = sign(('AWS4' + key).encode('utf-8'), date_stamp)
        kRegion = sign(kDate, regionName)
        kService = sign(kRegion, serviceName)
        kSigning = sign(kService, 'aws4_request')
        return kSigning
    
    canonical_uri = '/default/generateResponse'
    canonical_querystring = ''
    canonical_headers = 'content-type:' + content_type + '\n' + 'host:' + host + '\n' + 'x-amz-date:' + amz_date + '\n' + 'x-amz-target:' + '\n'
    signed_headers = 'content-type;host;x-amz-date;x-amz-target'
    payload_hash = hashlib.sha256(request_parameters.encode('utf-8')).hexdigest()
    canonical_request = method + '\n' + canonical_uri + '\n' + canonical_querystring + '\n' + canonical_headers + '\n' + signed_headers + '\n' + payload_hash
    
    # ************* TASK 1: CREATE THE STRING TO SIGN*************
    algorithm = 'AWS4-HMAC-SHA256'
    credential_scope = date_stamp + '/' + region + '/' + service + '/' + 'aws4_request'
    string_to_sign = algorithm + '\n' +  amz_date + '\n' +  credential_scope + '\n' +  hashlib.sha256(canonical_request.encode('utf-8')).hexdigest()
    
    # ************* TASK 2: CALCULATE THE SIGNATURE *************
    signing_key = getSignatureKey(aws_secret_key, date_stamp, region, service)
    signature = hmac.new(signing_key, (string_to_sign).encode('utf-8'), hashlib.sha256).hexdigest()

    # ************* TASK 3: ADD SIGNING INFORMATION TO THE REQUEST *************
    authorization_header = algorithm + ' ' + 'Credential=' + aws_access_key + '/' + credential_scope + ', ' +  'SignedHeaders=' + signed_headers + ', ' + 'Signature=' + signature
    headers = {
        'Content-Type':content_type,
        'X-Amz-Date':amz_date,
        'Authorization':authorization_header
    }
    
    # payload_bytes = json.dumps(lambda_payload).encode('utf-8')
    r = requests.post(endpoint, headers=headers, data=request_parameters)
    # response_payload = r.json()
    print(r.text)
    print(r.status_code)
    # response_payload_parsed = json.loads(response_payload)
    # requests.post('http://neosaas.net/api/create-conversation-object', response_payload[0][0], input)
    
    return JsonResponse({'response-payload': r.text})