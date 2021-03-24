#!/bin/bash

# generate client code from pinning-service.yaml and output to ./generated
openapi-generator-cli generate -i pinning-service.yaml -g javascript -o ./generated --additional-properties=usePromises=true

# copy typescript definitions into generated code dir
cp types/generated.d.ts generated/index.d.ts

