from django.db import models

# Create your models here.

class Conversation(models.Model):
    id = models.CharField(max_length=255, unique=True, default="00000000", primary_key=True)
    messages = models.JSONField()  # Field to store the entire conversation as a list of messages
    timestamp = models.DateTimeField(auto_now_add=True)  # Timestamp of the conversation

    def __str__(self):
        return f"Conversation {self.id}"
    
class ConversationStatistics(models.Model):
    tag = models.CharField(max_length=255, default = "test1")
    conversation_count = models.PositiveIntegerField(default=0)  # Number of conversations
    
    class Meta:
        verbose_name_plural = "Conversation Statistics"

    def __str__(self):
        return self.tag
    
    
    
    