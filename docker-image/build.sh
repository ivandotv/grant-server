#!/bin/bash
set -euo pipefail

temp_build_dir='temp_build_dir'
username='ivandotv'
image_name='grant-server'
build_params="$@"
full_image_name=${username}/${image_name}

cd docker-image

function clean_up(){
    rm -rf "$temp_build_dir"
}

trap clean_up ERR SIGINT

mkdir -p "$temp_build_dir"

cp Dockerfile "$temp_build_dir"

cp ../package*.json "$temp_build_dir"

cp -R ../dist "temp_build_dir"

docker build ${build_params} -t ${full_image_name} ${temp_build_dir}

clean_up
