# Generated by Django 4.2.9 on 2024-02-22 22:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_department_faculty_program_department_faculty'),
    ]

    operations = [
        migrations.AlterField(
            model_name='program',
            name='program_year',
            field=models.DateField(),
        ),
    ]