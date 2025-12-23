from django.conf import settings
from django.db import models


class Checkup(models.Model):
    """Store patient checkup inputs and AI-generated results."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='checkups',
        null=True,
        blank=True,
        help_text='User who created this checkup (null for anonymous)',
    )
    age = models.PositiveIntegerField(help_text='Patient age')
    gender = models.CharField(
        max_length=16,
        choices=[
            ('male', 'Male'),
            ('female', 'Female'),
            ('other', 'Other'),
        ],
        help_text='Patient gender',
    )
    symptoms = models.TextField(help_text='Patient-reported symptoms')
    severity = models.PositiveSmallIntegerField(
        help_text='Pain severity on a scale of 1-10',
    )
    result = models.JSONField(
        help_text='AI-generated diagnosis result with conditions, summary, and recommendations',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Checkup'
        verbose_name_plural = 'Checkups'

    def __str__(self):
        user_str = f"User {self.user.id}" if self.user else "Anonymous"
        return f"Checkup #{self.id} - {user_str} - {self.created_at:%Y-%m-%d %H:%M}"



