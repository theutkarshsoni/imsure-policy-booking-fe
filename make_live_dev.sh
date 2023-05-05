#!/bin/bash

export AWS_PROFILE=cz

s3bucket="dev-linkk-pb.claimzippy.com"
cfdist="EZTGSG7KS9RTO"

echo "Starting Make Live Dev Linkk Process" && \
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
