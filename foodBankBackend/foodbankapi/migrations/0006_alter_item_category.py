# Generated by Django 5.0 on 2024-02-28 19:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('foodbankapi', '0005_alter_organization_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='category',
            field=models.CharField(choices=[('BE', 'Beverages'), ('BA', 'Baking'), ('BR', 'Breads'), ('DA', 'Dairy'), ('DE', 'Desserts'), ('DR', 'Dry goods'), ('EG', 'Eggs'), ('FA', 'Fats'), ('FZ', 'Frozen foods'), ('FR', 'Fruits'), ('PR', 'Proteins'), ('SE', 'Seafood'), ('SP', 'Spices'), ('SW', 'Sweets'), ('UN', 'Uncategorized'), ('VE', 'Vegetables')], default='UN', max_length=2, verbose_name='category'),
        ),
    ]
