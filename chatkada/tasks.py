from celery import shared_task
from django.utils import timezone
from django.conf import settings
from .models import ChatMessage
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

@shared_task
def cleanup_old_chat_messages(hours=24):
    """
    Celery task to automatically delete old chat messages
    """
    try:
        cutoff_time = timezone.now() - timedelta(hours=hours)
        
        old_messages = ChatMessage.objects.filter(timestamp__lt=cutoff_time)
        count = old_messages.count()
        
        if count > 0:
            deleted_count = old_messages.delete()[0]
            logger.info(f'Automatically deleted {deleted_count} old chat messages')
            return f'Deleted {deleted_count} messages'
        else:
            logger.info('No old chat messages to delete')
            return 'No messages to delete'
            
    except Exception as e:
        logger.error(f'Error during chat message cleanup: {str(e)}')
        return f'Error: {str(e)}'

@shared_task
def cleanup_expired_messages():
    """
    Delete messages that have reached their expiration time
    """
    try:
        expired_messages = ChatMessage.objects.filter(
            expires_at__lt=timezone.now(),
            is_deleted=False
        )
        
        count = expired_messages.count()
        if count > 0:
            expired_messages.update(is_deleted=True)
            # Actually delete them
            expired_messages.delete()
            logger.info(f'Deleted {count} expired messages')
            return f'Deleted {count} expired messages'
        
        return 'No expired messages to delete'
        
    except Exception as e:
        logger.error(f'Error during expired message cleanup: {str(e)}')
        return f'Error: {str(e)}'
