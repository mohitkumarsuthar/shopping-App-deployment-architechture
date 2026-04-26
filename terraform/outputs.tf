output "ec2_public_ip" {
  value = aws_instance.shopping_app.public_ip
}

output "rds_endpoint" {
  value = aws_db_instance.shopping_db.endpoint
}

output "s3_bucket_name" {
  value = aws_s3_bucket.shopping_assets.bucket
}
