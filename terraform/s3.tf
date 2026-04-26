resource "aws_s3_bucket" "shopping_assets" {
  bucket = "shopping-app-assets-${var.environment}"

  tags = {
    Name = "shopping-app-assets"
  }
}

resource "aws_s3_bucket_versioning" "shopping_assets_versioning" {
  bucket = aws_s3_bucket.shopping_assets.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "shopping_assets_access" {
  bucket = aws_s3_bucket.shopping_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
