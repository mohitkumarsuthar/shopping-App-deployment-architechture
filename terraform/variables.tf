variable "aws_region" {
  default = "ap-south-1"
}

variable "instance_type" {
  default = "t3.micro"
}

variable "ami_id" {
  default = "ami-0f58b397bc5c1f2e8"  # Ubuntu 22.04 Mumbai
}

variable "key_name" {
  description = "Your AWS key pair name"
  default  = "shopping-app-key" 
}

variable "db_name" {
  default = "shoppingdb"
}

variable "db_username" {
  default = "admin"
}

variable "db_password" {
  description = "RDS password"
  sensitive   = true
  # default nahi likhte!
}

variable "environment" {
  default = "dev"
}
