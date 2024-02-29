# Generated by Django 5.0 on 2024-02-27 17:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('foodbankapi', '0003_remove_order_organization_order_fromorganization_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='category',
            field=models.CharField(choices=[('BE', 'Beverages'), ('BA', 'Baking'), ('BR', 'Breads'), ('DA', 'DAIRY'), ('DE', 'Desserts'), ('DR', 'Dry goods'), ('EG', 'Eggs'), ('FA', 'Fats'), ('FZ', 'Frozen foods'), ('FR', 'Fruits'), ('PR', 'Proteins'), ('SE', 'Seafood'), ('SP', 'Spices'), ('SW', 'Sweets'), ('UN', 'Uncategorized'), ('VE', 'Vegetables')], default='UN', max_length=2, verbose_name='category'),
        ),
    ]