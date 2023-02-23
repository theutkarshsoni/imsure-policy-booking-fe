#!/bin/bash

export AWS_PROFILE=cz

s3bucket="dev-star-pb.claimzippy.com"
cfdist="E1TBO52TAG2SI8"

echo "Starting Make Live Star Dev Process" && \
echo "Starting with the build" && \
npm run build && \
echo "Build Done" && \
echo "Starting S3 Sync to bucket $s3bucket" && \
aws s3 sync build/ s3://$s3bucket && \
echo "S3 sync done" && \
echo "Starting Cloudfront Invalidation for distribution $cfdist" && \
aws cloudfront create-invalidation --distribution-id $cfdist --paths "/*" && \
echo "Cloudfront Invalidation Done" && \
echo "Make Live Dev Process done, check https://$s3bucket"
