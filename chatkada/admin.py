from django.contrib import admin
from .models import Item, Purchase, ChatMessage, UserProfile, ChatRoom, BenchInvite, DailyChallenge, CoinTransaction, UserChatHistory

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'coins', 'avatar', 'is_available_for_chat', 'created_at']  
    list_filter = ['is_available_for_chat', 'created_at', 'login_streak']
    search_fields = ['user__username']
    readonly_fields = ['created_at', 'total_coins_earned']
    list_editable = ['coins', 'is_available_for_chat']  # Allow editing coins and avatar directly in the list view

    fieldsets = (
        ('User Info', {
            'fields': ('user', 'avatar')
        }),
        ('Coins & Challenges', {
            'fields': ('coins', 'total_coins_earned', 'daily_friends_made', 'login_streak')
        }),
        ('Settings', {
            'fields': ('is_available_for_chat',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'last_login_date', 'friends_challenge_date'),
            'classes': ('collapse',)
        })
    )

@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ['get_display_name', 'room_type', 'created_by', 'get_participant_count', 'max_users', 'is_active', 'created_at']
    list_filter = ['room_type', 'is_active', 'created_at']
    search_fields = ['name', 'bench_name', 'created_by__username']
    filter_horizontal = ['participants']
    readonly_fields = ['room_id', 'created_at']
    
    def get_participant_count(self, obj):
        return obj.participants.count()
    get_participant_count.short_description = 'Participants'

@admin.register(BenchInvite)
class BenchInviteAdmin(admin.ModelAdmin):
    list_display = ['room', 'created_by', 'invite_code', 'status', 'current_uses', 'max_uses', 'created_at', 'expires_at']
    list_filter = ['status', 'created_at', 'expires_at']
    search_fields = ['invite_code', 'created_by__username', 'room__bench_name']
    readonly_fields = ['invite_code', 'created_at']

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['user', 'room', 'message_type', 'content_preview', 'shared_item', 'timestamp', 'is_deleted']
    list_filter = ['message_type', 'is_deleted', 'timestamp', 'room__room_type']
    search_fields = ['user__username', 'content', 'room__bench_name']
    readonly_fields = ['timestamp', 'expires_at']
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content Preview'

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'emoji', 'available', 'can_be_shared']
    list_display_links = ['name']  
    list_editable = ['price', 'available', 'can_be_shared']  
    list_filter = ['category', 'available', 'can_be_shared']
    search_fields = ['name', 'description']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'category', 'emoji', 'description')
        }),
        ('Pricing & Availability', {
            'fields': ('price', 'available', 'can_be_shared')
        })
    )

@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ['user', 'item', 'quantity', 'total_price', 'timestamp', 'shared_in_chat']
    list_filter = ['timestamp', 'item__category', 'shared_in_chat']
    search_fields = ['user__username', 'item__name']
    readonly_fields = ['timestamp']

@admin.register(DailyChallenge)
class DailyChallengeAdmin(admin.ModelAdmin):
    list_display = ['user', 'challenge_type', 'completed_date', 'coins_earned']
    list_filter = ['challenge_type', 'completed_date']
    search_fields = ['user__username']
    readonly_fields = ['completed_date']

@admin.register(CoinTransaction)
class CoinTransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'amount', 'transaction_type', 'description', 'timestamp']
    list_filter = ['transaction_type', 'timestamp']
    search_fields = ['user__username', 'description']
    readonly_fields = ['timestamp']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')

@admin.register(UserChatHistory)
class UserChatHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'chatted_with', 'chat_date']
    list_filter = ['chat_date']
    search_fields = ['user__username', 'chatted_with__username']
    readonly_fields = ['chat_date']
