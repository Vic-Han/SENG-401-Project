# Generated by Django 5.0.2 on 2024-02-07 03:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apiApp', '0002_remove_user_password'),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('course_id', models.IntegerField(primary_key=True, serialize=False, unique=True)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
    ]